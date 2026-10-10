/**
 * Disability benefits 2026/27, beyond the PIP points test (disability.ts):
 * - PIP payment dates: every 4 weeks on the same weekday; a payday on a bank holiday is usually paid before it,
 *   then the cycle continues as normal (GOV.UK, PIP: how much you'll get).
 * - PIP required period: 3 months before and 9 months after the prescribed date (SI 2013/377 reg. 12).
 * - Attendance Allowance: help needed for 6 months (GOV.UK eligibility); effect on Pension Credit through the
 *   severe disability additional amount (GOV.UK Pension Credit, DWP rates 2026/27).
 * - DLA for children: care and mobility rates with the mobility age limits (lower rate from 5, higher from 3).
 * - Moving to Scotland: DWP disability and carer benefits stop 13 weeks after the move (GOV.UK, mygov.scot).
 * - New Style ESA: assessment rate, work-related activity group, support group, private pension rule.
 */
import { P, pence, weeklyToMonthly } from './params';
import { addDays, addMonths, addWeeks, dayOfWeek, type ISO } from './dates';
import { workingDayOnOrBefore, isNonWorking, holidaysCover, type UcNation } from './ucDates';
import { computePensionCredit } from './pension';

/* ---------- PIP payment dates ---------- */
export interface PipPayment { due: ISO; paid: ISO; moved: boolean }
/** The next `count` PIP payments after a normal payday (from the award letter or a bank statement). */
export function pipNextPayments(lastPaid: ISO, count = 3, nation: UcNation = 'englandWales'): PipPayment[] {
  const out: PipPayment[] = [];
  for (let k = 1; k <= count; k++) {
    const due = addWeeks(lastPaid, P.pip.paidEveryWeeks * k);
    const paid = isNonWorking(due, nation) ? workingDayOnOrBefore(addDays(due, -1), nation) : due;
    out.push({ due, paid, moved: paid !== due });
  }
  return out;
}
/** Number of 4-weekly paydays falling inside a tax year (6 April to 5 April), from one known payday. */
export function pipPaydaysInTaxYear(knownPayday: ISO, taxYearStart = P.valid_from as ISO): number {
  const end = addDays(addMonths(taxYearStart, 12), -1);
  const step = P.pip.paidEveryWeeks * 7;
  // Move back to the first payday on or after the start of the tax year.
  let d = knownPayday;
  while (d > taxYearStart) d = addDays(d, -step);
  while (d < taxYearStart) d = addDays(d, step);
  let n = 0;
  for (; d <= end; d = addDays(d, step)) n++;
  return n;
}
export const PAYDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const paydayName = (iso: ISO) => PAYDAY_NAMES[dayOfWeek(iso)];
export { holidaysCover };

/* ---------- PIP required period (reg. 12) ---------- */
/** From the date the difficulties began: earliest date the 3-month backward test is met, and the date until which
 *  they must be expected to last (9 months after that). A claim can be made before the first date. */
export function pipRequiredPeriod(onset: ISO) {
  const qualifyFrom = addMonths(onset, P.pip.qualifyMonthsPast);
  const mustLastUntil = addMonths(qualifyFrom, P.pip.qualifyMonthsFuture);
  return { qualifyFrom, mustLastUntil };
}

/* ---------- Attendance Allowance ---------- */
export type AaRate = 'lower' | 'higher';
export const aaWeekly = (rate: AaRate) => (rate === 'higher' ? P.aa.higher : P.aa.lower);
/** Earliest date Attendance Allowance can be paid from when help has been needed since `onset` (6-month rule). */
export const aaQualifyFrom = (onset: ISO) => addMonths(onset, P.aa.needMonths);
/** Attendance Allowance and Pension Credit for a single pensioner: AA itself is ignored as income, and opens the
 *  severe disability amount unless someone is paid Carer's Allowance (or the UC carer element) for caring. */
export function aaWithPensionCredit(i: { rate: AaRate; weeklyIncome: number; savings?: number; carerPaid: boolean }) {
  const aa = aaWeekly(i.rate);
  const before = computePensionCredit({ couple: false, income: i.weeklyIncome, savings: i.savings });
  const after = computePensionCredit({ couple: false, income: i.weeklyIncome, savings: i.savings, severeDisability: i.carerPaid ? 0 : 1 });
  return { aa, pcBefore: before.guarantee, pcAfter: after.guarantee, pcGain: pence(after.guarantee - before.guarantee), weeklyGain: pence(aa + after.guarantee - before.guarantee) };
}

/* ---------- DLA for children ---------- */
export type DlaCare = 'none' | 'lowest' | 'middle' | 'highest';
export type DlaMobility = 'none' | 'lower' | 'higher';
/** Weekly DLA for a child under 16; a mobility rate the child is too young for is not paid. */
export function dlaChild(care: DlaCare, mobility: DlaMobility, age: number) {
  const D = P.dla;
  const careW = care === 'highest' ? D.careHighest : care === 'middle' ? D.careMiddle : care === 'lowest' ? D.careLowest : 0;
  const mobAllowed = mobility === 'higher' ? age >= D.mobilityHigherFromAge : mobility === 'lower' ? age >= D.mobilityLowerFromAge : true;
  const mobW = !mobAllowed ? 0 : mobility === 'higher' ? D.mobilityHigher : mobility === 'lower' ? D.mobilityLower : 0;
  const weekly = pence(careW + mobW);
  return {
    eligibleAge: age < D.ageLimit, careWeekly: careW, mobilityWeekly: mobW, mobAllowed, weekly,
    fourWeekly: pence(weekly * D.paidEveryWeeks), yearly: pence(weekly * 52),
    /** A parent caring 35 hours a week can claim Carer's Allowance with the middle or highest care rate. */
    carerQualifies: care === 'middle' || care === 'highest',
  };
}

/* ---------- Moving to Scotland ---------- */
/** Last day of DWP entitlement after a move to Scotland: 13 weeks from the move. */
export const dwpStopsAfterMove = (move: ISO, weeks = P.pip.moveStopWeeks) => addWeeks(move, weeks);

/* ---------- New Style ESA ---------- */
export type EsaPhase = 'assessment' | 'wrag' | 'support';
/** Weekly New Style ESA (2026/27). The work-related activity component was removed for claims from 3 April 2017
 *  (Welfare Reform and Work Act 2016 s.15), so a new WRAG award is the basic rate alone. */
export function newStyleEsa(i: { age: number; phase: EsaPhase; privatePension?: number; legacyWra?: boolean }) {
  const E = P.esaJsa;
  const basic = i.phase === 'assessment' && i.age < 25 ? E.under25 : E.over25;
  const component = i.phase === 'support' ? E.esaSupport : i.phase === 'wrag' && i.legacyWra ? E.esaWra : 0;
  const gross = pence(basic + component);
  const pensionCut = pence(Math.max(0, (i.privatePension ?? 0) - E.pensionThreshold) * E.pensionTaper);
  const weekly = pence(Math.max(0, gross - pensionCut));
  return { basic, component, gross, pensionCut, weekly, fortnightly: pence(weekly * E.paidEveryWeeks), monthlyForUc: pence(weeklyToMonthly(weekly)) };
}
