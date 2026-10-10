/** Family and carers 2026/27: Child Benefit and the High Income Child Benefit Charge (HMRC), Carer's Allowance earnings test (DWP), Tax-Free Childcare (HMRC). */
import { P, pence } from './params';
const CB = P.childBenefit;
export const childBenefitWeekly = (children: number) => children <= 0 ? 0 : CB.eldest + (children - 1) * CB.additional;
/** Annual Child Benefit: weekly rate × 52 (payments are every 4 weeks; a tax year can hold 53 Mondays, ignored here). */
export const childBenefitYear = (children: number) => pence(childBenefitWeekly(children) * 52);
/** HICBC: 1% of the Child Benefit for every £200 of adjusted net income above £60,000; 100% from £80,000. */
export function hicbc(adjustedNetIncome: number, annualChildBenefit: number) {
  const over = adjustedNetIncome - CB.hicbcThreshold;
  const pct = over <= 0 ? 0 : Math.min(100, Math.floor(over / CB.hicbcPerPct));
  const charge = Math.floor((annualChildBenefit * pct) / 100);
  return { pct, charge, net: pence(annualChildBenefit - charge) };
}
const CA = P.carers;
/** Carer's Allowance earnings test: weekly earnings after tax and NI, minus half of pension contributions and care costs up to half of earnings. */
export function carersEarnings(i: { netEarnings: number; pensionContrib?: number; careCosts?: number; otherExpenses?: number }) {
  const afterPension = i.netEarnings - (i.pensionContrib ?? 0) * CA.pensionContribShare - (i.otherExpenses ?? 0);
  const care = Math.min(i.careCosts ?? 0, Math.max(0, i.netEarnings) * CA.careCostsMaxShare);
  const counted = pence(Math.max(0, afterPension - care));
  return { counted, limit: CA.earningsLimit, eligible: counted <= CA.earningsLimit, headroom: pence(CA.earningsLimit - counted) };
}
/** Carer's Allowance paid alongside the State Pension: the overlapping rule pays only the difference. */
export const carersWithPension = (statePensionWeekly: number) => pence(Math.max(0, CA.allowance - statePensionWeekly));
const CC = P.childcare;
/** Tax-Free Childcare: the government adds £2 for every £8 paid in (25% of your deposit), capped per child per quarter. */
export function taxFreeChildcare(i: { quarterlyCost: number; children: number; disabled?: number }) {
  const caps = Array.from({ length: i.children }, (_, k) => (k < (i.disabled ?? 0) ? CC.tfcMaxQuarterDisabled : CC.tfcMaxQuarter));
  const capTotal = caps.reduce((a, b) => a + b, 0);
  // £2 for every £8 paid in: the top-up is rate/(1+rate) of the bill (25% of the deposit = 20% of the bill).
  const topUp = Math.min((i.quarterlyCost * CC.tfcTopUpRate) / (1 + CC.tfcTopUpRate), capTotal);
  return { topUp: pence(topUp), youPay: pence(i.quarterlyCost - topUp), capTotal, yearTopUp: pence(topUp * 4) };
}
/** Minimum expected earnings for Tax-Free Childcare and 30 hours (16 hours at the NMW/NLW over 3 months). */
export const minEarnings3m = (age: number, apprentice = false) => apprentice || age < 18 ? CC.minEarnQuarterUnder18 : age < 21 ? CC.minEarnQuarter18 : CC.minEarnQuarter21;
const MA = P.maternity;
export const maternityAllowance = (avgWeekly: number) => avgWeekly < MA.maThreshold ? 0 : pence(Math.min(MA.maStandard, avgWeekly * MA.maShare));
