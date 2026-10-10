/**
 * Pension age benefits 2026/27: Pension Credit (State Pension Credit Act 2002 ss.2-3; SPC Regulations 2002 reg 7),
 * Housing Benefit at pension age (65% taper, SI 2006/214 reg 51), new State Pension by qualifying years, deferral,
 * State Pension age (DWP timetable, Pensions Acts 2007 and 2014).
 */
import { P, pence } from './params';
import { addMonths, addYears, type ISO } from './dates';

const PC = P.pensionCredit;
/** Assumed weekly income from savings for Pension Credit and pension-age Housing Benefit: £1 per £500 or part above £10,000. */
export const pcTariff = (savings: number) => savings <= PC.capitalDisregard ? 0 : Math.ceil((savings - PC.capitalDisregard) / 500) * PC.tariffPer500;

export interface PcInput {
  couple: boolean;
  /** Weekly income counted (State Pension, other pensions, earnings, Carer's Allowance…). PIP, AA, Child Benefit, HB are ignored. */
  income: number;
  /** Part of that income that is "qualifying income" for savings credit (pensions, State Pension; not Carer's Allowance). */
  qualifyingIncome?: number;
  savings?: number;
  severeDisability?: 0 | 1 | 2; carer?: 0 | 1 | 2;
  children?: number; firstChildPre2017?: boolean;
  /** Reached State Pension age before 6 April 2016 (or partner did): savings credit possible. */
  spaBefore2016?: boolean;
  housingCosts?: number;
}
export function computePensionCredit(i: PcInput) {
  const tariff = pcTariff(i.savings ?? 0);
  const income = Math.max(0, i.income) + tariff;
  const smg = i.couple ? PC.guaranteeCouple : PC.guaranteeSingle;
  const sd = i.severeDisability === 2 ? PC.severeDisabilityBoth : i.severeDisability === 1 ? PC.severeDisability : 0;
  const carer = (i.carer ?? 0) * PC.carer;
  const kids = i.children ?? 0;
  const childAdd = kids > 0 ? kids * PC.child + (i.firstChildPre2017 ? PC.firstChildPre2017 - PC.child : 0) : 0;
  const appropriate = smg + sd + carer + childAdd + Math.max(0, i.housingCosts ?? 0);
  const guarantee = Math.max(0, appropriate - income);
  let savingsCredit = 0;
  if (i.spaBefore2016) {
    const q = (i.qualifyingIncome ?? i.income) + tariff;
    const thr = i.couple ? PC.savingsThresholdCouple : PC.savingsThresholdSingle;
    const max = i.couple ? PC.savingsMaxCouple : PC.savingsMaxSingle;
    const a = Math.min(max, Math.max(0, q - thr) * PC.savingsShareA);
    const b = Math.max(0, income - appropriate) * PC.savingsShareB;
    savingsCredit = Math.max(0, a - b);
  }
  return { appropriate: pence(appropriate), income: pence(income), tariff, guarantee: pence(guarantee), savingsCredit: pence(savingsCredit), total: pence(guarantee + savingsCredit), smg, extras: { sd, carer, childAdd } };
}

const HB = P.housingBenefit;
/** Housing Benefit for a tenant over State Pension age (weekly). Guarantee Credit = maximum HB. */
export function computeHbPension(i: { couple: boolean; spaAfterApril2021: boolean; rent: number; income: number; savings: number; guaranteeCredit: boolean; nonDepDeductions?: number; extraAllowances?: number }) {
  const maxHb = Math.max(0, i.rent - (i.nonDepDeductions ?? 0));
  if (i.guaranteeCredit) return { maxHb: pence(maxHb), applicable: 0, income: 0, excess: 0, hb: pence(maxHb), reason: 'guarantee' as const };
  if (i.savings > HB.capitalUpper && !i.guaranteeCredit) return { maxHb: pence(maxHb), applicable: 0, income: 0, excess: 0, hb: 0, reason: 'capital' as const };
  const applicable = (i.couple ? (i.spaAfterApril2021 ? HB.pensionAgeCoupleAfter2021 : HB.pensionAgeCouple) : (i.spaAfterApril2021 ? HB.pensionAgeSingleAfter2021 : HB.pensionAgeSingle)) + (i.extraAllowances ?? 0);
  const income = i.income + pcTariff(i.savings);
  const excess = Math.max(0, income - applicable);
  const hb = Math.max(0, maxHb - excess * HB.taper);
  return { maxHb: pence(maxHb), applicable, income: pence(income), excess: pence(excess), hb: pence(hb), reason: 'means' as const };
}
/** Non-dependant deduction from pension-age HB, weekly, by the non-dependant's gross weekly income. */
export function hbNonDep(working: boolean, grossWeekly: number): number {
  if (!working) return HB.nonDepNotWorking;
  for (const [lim, d] of HB.nonDepWorking) if (grossWeekly < lim) return d;
  return HB.nonDepWorking[HB.nonDepWorking.length - 1][1];
}

const SP = P.statePension;
/** New State Pension for someone whose NI record starts on or after 6 April 2016: 1/35 of the full rate per qualifying year, nothing under 10. */
export function newStatePension(years: number): number {
  if (years < SP.qualifyingYearsMin) return 0;
  return pence((Math.min(years, SP.qualifyingYearsFull) / SP.qualifyingYearsFull) * SP.newFull);
}
/** Extra weekly State Pension after deferring: 1% for every 9 weeks (GOV.UK), nothing under 9 weeks. */
export function deferralIncrease(weekly: number, weeksDeferred: number) {
  if (weeksDeferred < SP.deferMinWeeks) return 0;
  return pence(weekly * (weeksDeferred / 9) * SP.deferPct9Weeks);
}

/** State Pension age from a date of birth, under current law (DWP timetable). Born before 6 October 1954: not modelled (already reached). */
export function statePensionAge(dob: ISO): { date: ISO | null; label: string } {
  const S = P.spa;
  if (dob < S.age66From) return { date: null, label: 'already reached (born before 6 October 1954)' };
  if (dob < S.phase67[0][0]) return { date: addYears(dob, 66), label: '66' };
  for (const [from, to, m] of S.phase67 as Array<[string, string, number]>) if (dob >= from && dob <= to) return { date: addMonths(addYears(dob, 66), m), label: `66 years and ${m} month${m > 1 ? 's' : ''}` };
  if (dob < S.phase68[0][0]) return { date: addYears(dob, 67), label: '67' };
  for (const [from, to, d] of S.phase68 as Array<[string, string, string]>) if (dob >= from && dob <= to) return { date: d, label: 'between 67 and 68 (fixed date)' };
  return { date: addYears(dob, 68), label: '68' };
}
