/**
 * Family grants and payments 2026/27 that family.ts does not cover: Child Benefit by tax year,
 * Guardian's Allowance, Sure Start Maternity Grant, Maternity Allowance by work status,
 * Bereavement Support Payment by claim date, free school meals by nation, Free Childcare for
 * Working Parents earnings test, Scottish Child Payment, Best Start Grant and Best Start Foods.
 * Every figure comes from params-2026.json (sources named in each block).
 */
import { P, pence, weeklyToMonthly } from './params';
import { childBenefitWeekly, maternityAllowance, minEarnings3m } from './family';

const CB = P.childBenefit;

/** Weekly Child Benefit for a number of children in a given tax year (HMRC rates table). */
export function childBenefitWeeklyFor(children: number, year: '2026' | '2025' | '2024' = '2026') {
  if (children <= 0) return 0;
  if (year === '2026') return childBenefitWeekly(children);
  const r = year === '2025' ? CB.previous : CB.prior2024;
  return pence(r.eldest + (children - 1) * r.additional);
}

/** Guardian's Allowance: a flat weekly amount per child, paid on top of Child Benefit (HMRC). */
export function guardiansAllowance(gaChildren: number, cbChildren: number) {
  const ga = Math.max(0, gaChildren);
  const cb = Math.max(ga, cbChildren);
  const gaWeekly = pence(ga * P.guardiansAllowance.weekly);
  const cbWeekly = childBenefitWeekly(cb);
  return { gaWeekly, cbWeekly, totalWeekly: pence(gaWeekly + cbWeekly), gaYear: pence(gaWeekly * 52), totalYear: pence((gaWeekly + cbWeekly) * 52) };
}

/**
 * Sure Start Maternity Grant (GOV.UK table): £500 for each new baby beyond the largest group of
 * children under 16 already in the family (0 none, 1 single births, 2 twins, 3 triplets).
 * Exceptions (refugees, kinship children taken on over 12 months old) are not modelled.
 */
export function ssmgGrant(babies: number, existingGroup: number) {
  const eligibleBabies = Math.max(0, babies - Math.max(0, existingGroup));
  return { grant: eligibleBabies * P.maternity.ssmg, eligibleBabies };
}

export type MaStatus = 'employed' | 'selfFull' | 'selfNone' | 'spouse';
/** Maternity Allowance a week and over its full length, with the Universal Credit reduction. */
export function maternityAllowanceFor(status: MaStatus, avgWeekly: number) {
  const M = P.maternity;
  let weekly = 0;
  let weeks = M.maWeeks;
  if (status === 'employed') weekly = maternityAllowance(avgWeekly);
  else if (status === 'selfFull') weekly = M.maStandard;
  else if (status === 'selfNone') weekly = M.maLow;
  else { weekly = M.maLow; weeks = M.maSpouseWeeks; }
  return { weekly, weeks, total: pence(weekly * weeks), ucMonthlyReduction: pence(weeklyToMonthly(weekly)) };
}

/**
 * Bereavement Support Payment by the month of claim after the death (GOV.UK): the lump sum needs a
 * claim within 12 months; monthly payments are backdated up to 3 months (Claims and Payments
 * Regulations 1987, reg. 19), so each month later than that loses one of the 18 payments.
 */
export function bereavementSupport(higher: boolean, monthsAfterDeath: number) {
  const B = P.bereavement;
  const m = Math.max(0, Math.floor(monthsAfterDeath));
  const lump = m <= B.lumpSumClaimMonths ? (higher ? B.higherLump : B.standardLump) : 0;
  const payments = m > B.maxClaimMonths ? 0 : Math.max(0, B.months - Math.max(0, m - B.fullClaimMonths));
  const monthly = higher ? B.higherMonthly : B.standardMonthly;
  return { lump, payments, monthly, total: lump + payments * monthly, max: (higher ? B.higherLump : B.standardLump) + B.months * monthly };
}

export type FsmNation = 'england' | 'scotland' | 'wales' | 'ni';
export type FsmStage = 'primary1to3' | 'primary4to5' | 'primary6to7' | 'secondary';
export type FsmResult = { status: 'yes' | 'no' | 'check'; rule: string };
/**
 * Free school meals for a child of a Universal Credit household, 2026/27 school year.
 * England: infant years universal; all UC households from academic year 2026 to 2027 (GOV.UK).
 * Scotland: P1 to P5 universal; then UC with earned income up to £995 a month (mygov.scot).
 * Wales: all primary pupils (gov.wales); secondary expansion under way, so "check".
 * Northern Ireland: UC with net household earnings up to £15,900 a year (nidirect).
 * Primary years are counted from the first year of school (Reception in England and Wales, P1).
 */
export function freeSchoolMeals(nation: FsmNation, stage: FsmStage, monthlyEarnings: number, getsScp = false): FsmResult {
  const S = P.schoolMeals;
  if (nation === 'england') {
    if (stage === 'primary1to3') return { status: 'yes', rule: 'Universal infant free school meals (Reception to Year 2)' };
    return { status: 'yes', rule: 'Every Universal Credit household from the 2026 to 2027 school year' };
  }
  if (nation === 'scotland') {
    if (stage === 'primary1to3' || stage === 'primary4to5') return { status: 'yes', rule: 'All pupils in P1 to P5' };
    if (stage === 'primary6to7' && getsScp) return { status: 'yes', rule: 'Scottish Child Payment in P6 and P7' };
    return monthlyEarnings <= S.scotUcEarnedMonthly
      ? { status: 'yes', rule: `Universal Credit with earned income up to £${S.scotUcEarnedMonthly} a month` }
      : { status: 'no', rule: `Earned income above £${S.scotUcEarnedMonthly} a month` };
  }
  if (nation === 'wales') {
    if (stage !== 'secondary') return { status: 'yes', rule: 'Universal Primary Free School Meals' };
    return { status: 'check', rule: 'Secondary meals for Universal Credit households are being extended, starting with years 7 and 8' };
  }
  return monthlyEarnings * 12 <= S.niUcNetEarningsYear
    ? { status: 'yes', rule: `Universal Credit with net earnings up to £${S.niUcNetEarningsYear.toLocaleString('en-GB')} a year` }
    : { status: 'no', rule: `Net earnings above £${S.niUcNetEarningsYear.toLocaleString('en-GB')} a year` };
}

/** Free Childcare for Working Parents (England): does a parent's expected pay pass the 3-month test? */
export function freeHoursEarnings(age: number, hoursPerWeek: number, hourlyPay: number) {
  const expected3m = pence(hoursPerWeek * hourlyPay * 13);
  const needed = minEarnings3m(age);
  return { expected3m, needed, passes: expected3m >= needed, gap: pence(Math.max(0, needed - expected3m)), year: pence(hoursPerWeek * hourlyPay * 52) };
}

const SC = P.scotland;
/** Scottish Child Payment: the same weekly amount for every child under 16. */
export function scottishChildPayment(children: number) {
  const n = Math.max(0, children);
  const weekly = pence(n * SC.childPayment);
  return { weekly, fourWeekly: pence(weekly * SC.scpPaidEveryWeeks), year: pence(weekly * 52), prevYear: pence(n * SC.childPaymentPrev * 52) };
}

/**
 * Best Start Grant Pregnancy and Baby Payment (mygov.scot): the higher amount for a first child
 * (none under 16 already), the lower amount for each further baby, plus one lower amount as the
 * multiple-birth supplement for twins or triplets.
 */
export function bsgPregnancy(babies: number, otherChildUnder16: boolean) {
  const n = Math.max(1, babies);
  const first = otherChildUnder16 ? SC.bsgPregnancySubsequent : SC.bsgPregnancyFirst;
  const supplement = n > 1 ? SC.bsgPregnancySubsequent : 0;
  return pence(first + (n - 1) * SC.bsgPregnancySubsequent + supplement);
}

/** All three Best Start Grant payments for the same babies, from pregnancy to starting school. */
export function bestStartGrantTotal(babies: number, otherChildUnder16: boolean) {
  const n = Math.max(1, babies);
  const pregnancy = bsgPregnancy(n, otherChildUnder16);
  const earlyLearning = pence(n * SC.bsgEarlyLearning);
  const schoolAge = pence(n * SC.bsgSchoolAge);
  return { pregnancy, earlyLearning, schoolAge, total: pence(pregnancy + earlyLearning + schoolAge) };
}

/** Best Start Foods every 4 weeks: one lower amount in pregnancy, higher under 1, lower from 1 to 3. */
export function bestStartFoods(pregnant: boolean, babiesUnder1: number, children1to3: number) {
  const w = (pregnant ? SC.bsfLowerWeekly : 0) + Math.max(0, babiesUnder1) * SC.bsfHigherWeekly + Math.max(0, children1to3) * SC.bsfLowerWeekly;
  return { weekly: pence(w), fourWeekly: pence(w * 4), year: pence(w * 52) };
}
