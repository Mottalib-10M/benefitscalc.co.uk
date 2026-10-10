/**
 * Carers 2026/27, beyond the earnings test (family.ts):
 * - Carer's Allowance and Universal Credit: CA is deducted from UC pound for pound, the carer element is paid
 *   with or without CA (GOV.UK, Carer's Allowance: effect on other benefits).
 * - Carer's Allowance and the State Pension: overlapping benefits, underlying entitlement and the Pension Credit
 *   carer amount (GOV.UK Carer's Allowance eligibility; GOV.UK Pension Credit).
 * - Scotland: Carer Support Payment, Scottish Carer Supplement and Carer Additional Person Payment, none of the
 *   last two when the Carer Support Payment award is £0 (mygov.scot, overlapping benefits).
 * - Carer's Credit: 20 hours a week for someone on a qualifying benefit (GOV.UK, Carer's Credit).
 */
import { P, pence, weeklyToMonthly } from './params';
import { computeUc } from './uc';
import { computePensionCredit } from './pension';
import { carersEarnings, carersWithPension } from './family';
import { newStatePension } from './pension';

const CA = P.carers;

/** Single carer aged 25+ with rent: Universal Credit with and without Carer's Allowance in the same month. */
export function caAndUc(i: { earningsMonthly: number; rent: number; age?: number; couple?: boolean; children?: number }) {
  const caMonthly = pence(weeklyToMonthly(CA.allowance));
  const base = { couple: !!i.couple, age: i.age ?? 30, children: i.children ?? 0, earnings: i.earningsMonthly, carer: true, housing: 'social' as const, rent: i.rent, capExempt: true };
  const without = computeUc(base);
  const withCa = computeUc({ ...base, unearned: caMonthly });
  const totalWithout = pence(without.award);
  const totalWith = pence(withCa.award + caMonthly);
  return { caMonthly, ucWithout: without.award, ucWith: withCa.award, carerElement: P.uc.carer, totalWithout, totalWith, gain: pence(totalWith - totalWithout) };
}

/** Carer's Allowance claimed at State Pension age: what is paid, and the Pension Credit carer amount it opens. */
export function caAtPensionAge(i: { statePension: number; otherIncome?: number; savings?: number }) {
  const caPaid = carersWithPension(i.statePension);
  const income = i.statePension + caPaid + (i.otherIncome ?? 0);
  const noClaim = computePensionCredit({ couple: false, income: i.statePension + (i.otherIncome ?? 0), savings: i.savings });
  const claim = computePensionCredit({ couple: false, income, savings: i.savings, carer: 1 });
  return { caPaid, underlying: caPaid === 0, pcWithout: noClaim.guarantee, pcWith: claim.guarantee, weeklyGain: pence(caPaid + claim.guarantee - noClaim.guarantee) };
}

/** Carer's Allowance for a carer: weekly payment if the hours and earnings tests are met. */
export function caWeekly(i: { hours: number; countedEarnings: number }) {
  const e = carersEarnings({ netEarnings: i.countedEarnings });
  const ok = i.hours >= CA.hoursPerWeek && e.eligible;
  return { ok, weekly: ok ? CA.allowance : 0, yearly: ok ? pence(CA.allowance * 52) : 0, headroom: e.headroom, hoursShort: Math.max(0, CA.hoursPerWeek - i.hours) };
}

const S = P.scotland;
/** Scottish carer package a week: Carer Support Payment after overlapping benefits, then the supplement and
 *  £10.40 for each additional person, both lost when Carer Support Payment is £0. */
export function scottishCarerPackage(i: { overlapping: number; additionalPeople: number }) {
  const csp = pence(Math.max(0, S.carerSupport - Math.max(0, i.overlapping)));
  const paid = csp > 0;
  const supplement = paid ? S.carerSupplement : 0;
  const capp = paid ? pence(S.carerAdditionalPerson * Math.max(0, Math.floor(i.additionalPeople))) : 0;
  const weekly = pence(csp + supplement + capp);
  return { csp, supplement, capp, weekly, fourWeekly: pence(weekly * S.cspPaidEveryWeeks), yearly: pence(weekly * 52) };
}

export type CreditRoute = 'automatic' | 'apply' | 'certificate' | 'none';
/** Carer's Credit: 20 hours a week for someone on a qualifying benefit, or with a signed Care Certificate. */
export function carersCredit(i: { hours: number; benefit: 'yes' | 'no' | 'certificate'; caPaid?: boolean }) {
  let route: CreditRoute = 'none';
  if (i.caPaid) route = 'automatic';
  else if (i.hours >= P.carersCredit.hoursPerWeek) route = i.benefit === 'yes' ? 'apply' : i.benefit === 'certificate' ? 'certificate' : 'none';
  /** Weekly State Pension one qualifying year adds under the new scheme (1/35 of the full rate). */
  const perYear = pence(newStatePension(P.statePension.qualifyingYearsFull) / P.statePension.qualifyingYearsFull);
  return { route, eligible: route !== 'none', perYear, perYearAnnual: pence(perYear * 52) };
}
