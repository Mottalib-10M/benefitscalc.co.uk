/**
 * Universal Credit for one monthly assessment period (Universal Credit Regulations 2013; DWP rates 2026/27).
 * Maximum amount = standard allowance + elements (children, disabled child, LCWRA, carer, childcare, housing),
 * minus 55% of earnings above the work allowance, minus unearned income pound for pound, minus tariff income
 * from capital (£4.35 per £250 or part above £6,000; nothing at all above £16,000). Benefit cap applied last.
 */
import { P, pence } from './params';
import { lhaRate, type BedroomCat } from './lha';
import { benefitCapMonthly } from './cap';

const U = P.uc;
export type Housing = 'none' | 'private' | 'social';
export type Health = 'none' | 'lcwra' | 'lcwraNew';
export interface UcInput {
  couple: boolean;
  /** Age of the claimant (and partner): 25+ changes the standard allowance. */
  age: number; partnerAge?: number;
  children: number;
  /** One of the children is the eldest, born before 6 April 2017 (higher first-child amount). */
  firstChildPre2017?: boolean;
  disabledChildrenLower?: number; disabledChildrenHigher?: number;
  health?: Health;
  carer?: boolean;
  /** Monthly take-home earnings of the household (after tax, NI and pension contributions). */
  earnings: number;
  /** Other benefits deducted pound for pound (Carer's Allowance, New Style JSA/ESA, State Pension…), monthly. */
  unearned?: number;
  savings?: number;
  childcareCosts?: number;
  housing?: Housing;
  rent?: number;
  /** Private renters: the LHA area (BRMA) and the bedroom category; social renters: spare bedrooms. */
  brma?: string; nation?: 'england' | 'scotland' | 'wales'; bedrooms?: BedroomCat; spareRooms?: number;
  nonDependants?: number;
  /** Benefit cap: London rates apply inside Greater London. */
  london?: boolean;
  /** Exempt from the cap (PIP, DLA, AA, Carer's Allowance in the household…). */
  capExempt?: boolean;
}
export interface UcLine { key: string; label: string; amount: number }
export interface UcResult {
  award: number; maximum: number; elements: UcLine[]; deductions: UcLine[];
  workAllowance: number; earningsDeduction: number; tariff: number; housing: number; rentShortfall: number;
  capped: boolean; capLevel: number; overCapital: boolean; ageing: string;
}

export function standardAllowance(couple: boolean, age: number, partnerAge = age): number {
  if (couple) return age >= 25 || partnerAge >= 25 ? U.standard.couple25 : U.standard.coupleUnder25;
  return age >= 25 ? U.standard.single25 : U.standard.singleUnder25;
}
/** Child element: every child since 6 April 2026 (two-child limit ended); higher amount for a first child born before 6 April 2017. */
export function childElements(children: number, firstPre2017 = false): number {
  if (children <= 0) return 0;
  return children * U.child + (firstPre2017 ? U.firstChildPre2017Extra : 0);
}
/** Assumed monthly income from capital: £4.35 for each £250 or part of £250 above £6,000. */
export function tariffIncome(savings: number): number {
  if (savings <= U.capitalLower) return 0;
  return Math.ceil((Math.min(savings, U.capitalUpper) - U.capitalLower) / 250) * U.tariffPer250;
}
export const childcareElement = (costs: number, children: number) =>
  children > 0 ? Math.min(costs * U.childcareShare, children >= 2 ? U.childcareMax2 : U.childcareMax1) : 0;

export function housingElement(i: UcInput): { amount: number; eligible: number; shortfall: number } {
  const rent = Math.max(0, i.rent ?? 0);
  if (!i.housing || i.housing === 'none' || rent === 0) return { amount: 0, eligible: 0, shortfall: 0 };
  let eligible = rent;
  if (i.housing === 'private') {
    const cap = i.brma && i.nation ? lhaRate(i.nation, i.brma, i.bedrooms ?? 1) : undefined;
    if (cap !== undefined) eligible = Math.min(rent, cap);
  } else {
    const spare = Math.max(0, i.spareRooms ?? 0);
    const cut = spare >= 2 ? P.lha.socialSpareTwo : spare === 1 ? P.lha.socialSpareOne : 0;
    eligible = rent * (1 - cut);
  }
  const nonDep = Math.max(0, i.nonDependants ?? 0) * U.nonDepDeduction;
  const amount = Math.max(0, eligible - nonDep);
  return { amount: pence(amount), eligible: pence(eligible), shortfall: pence(rent - amount) };
}

export function computeUc(i: UcInput): UcResult {
  const elements: UcLine[] = [];
  const add = (key: string, label: string, amount: number) => { if (amount > 0) elements.push({ key, label, amount: pence(amount) }); };
  const sa = standardAllowance(i.couple, i.age, i.partnerAge ?? i.age);
  add('standard', `Standard allowance (${i.couple ? 'couple' : 'single'}${(i.couple ? Math.max(i.age, i.partnerAge ?? i.age) : i.age) >= 25 ? ', 25 or over' : ', under 25'})`, sa);
  add('children', `Child element × ${i.children}`, childElements(i.children, i.firstChildPre2017));
  add('disabledChild', 'Disabled child addition', (i.disabledChildrenLower ?? 0) * U.disabledChildLower + (i.disabledChildrenHigher ?? 0) * U.disabledChildHigher);
  const health = i.health ?? 'none';
  if (health !== 'none') add('lcwra', 'Health element (LCWRA)', health === 'lcwraNew' ? U.lcwraNew2026 : U.lcwra);
  // A claimant with the LCWRA element cannot also get the carer element (gov.uk, UC what you'll get).
  if (i.carer && health === 'none') add('carer', 'Carer element', U.carer);
  add('childcare', 'Childcare costs element (85%)', childcareElement(i.childcareCosts ?? 0, i.children));
  const h = housingElement(i);
  add('housing', 'Housing costs element', h.amount);
  const maximum = pence(elements.reduce((s, e) => s + e.amount, 0));

  const hasWA = i.children > 0 || health !== 'none';
  const workAllowance = hasWA ? (h.amount > 0 ? U.workAllowanceLower : U.workAllowanceHigher) : 0;
  const earningsDeduction = pence(Math.max(0, i.earnings - workAllowance) * U.taper);
  const tariff = tariffIncome(i.savings ?? 0);
  const unearned = Math.max(0, i.unearned ?? 0);
  const deductions: UcLine[] = [];
  if (earningsDeduction > 0) deductions.push({ key: 'earnings', label: `55% of earnings above ${hasWA ? `the £${workAllowance} work allowance` : 'nil (no work allowance)'}`, amount: earningsDeduction });
  if (unearned > 0) deductions.push({ key: 'unearned', label: 'Other benefits and income, pound for pound', amount: pence(unearned) });
  if (tariff > 0) deductions.push({ key: 'tariff', label: 'Assumed income from savings', amount: tariff });

  const overCapital = (i.savings ?? 0) > U.capitalUpper;
  let award = overCapital ? 0 : Math.max(0, maximum - earningsDeduction - unearned - tariff);
  award = award < U.minimumAward ? 0 : pence(award);

  // Benefit cap: not applied when exempt or when household earnings reach £881 a month.
  const capLevel = benefitCapMonthly(i.couple || i.children > 0, !!i.london);
  let capped = false;
  if (!i.capExempt && health === 'none' && !i.carer && i.earnings < P.benefitCap.earningsExemptMonthly && award > capLevel) { award = capLevel; capped = true; }
  return { award, maximum, elements, deductions, workAllowance, earningsDeduction, tariff, housing: h.amount, rentShortfall: h.shortfall, capped, capLevel, overCapital, ageing: '' };
}

/** Earnings at which Universal Credit runs out (monthly take-home), for a given maximum amount. */
export function breakEvenEarnings(maximum: number, workAllowance: number): number {
  return pence(workAllowance + maximum / U.taper);
}
