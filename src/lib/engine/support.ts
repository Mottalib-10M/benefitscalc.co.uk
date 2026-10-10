/**
 * Housing and one-off support 2026/27 that the other engine files do not cover:
 * social sector size criteria (HB Regulations 2006 reg B13; UC Regulations 2013 Sch 4), Budgeting Loans and
 * Budgeting Advances (GOV.UK), winter one-off payments by nation (GOV.UK, mygov.scot), Universal Credit paid
 * twice a month in Northern Ireland (nidirect), Scotland-only household payments (mygov.scot), and the
 * reference table of main benefit rates (DWP benefit and pension rates 2026 to 2027).
 * Every figure comes from params-2026.json.
 */
import { P, pence, weeklyToMonthly, monthlyToWeekly } from './params';
import { displayDate, formatMoney } from '../format';

/* ---------- Social sector size criteria ("bedroom tax") ---------- */

/**
 * Bedrooms a working-age social tenant is allowed (reg B13(5)): one for the claimant or couple, one for each other
 * person aged 16 or over, and children in pairs where they can share. `childRooms` overrides the pairing when the
 * children's ages and sexes mean fewer can share (two under 16 of the same sex, or two under 10 of any sex).
 */
export function socialBedroomsNeeded(o: { otherAdults: number; children: number; childRooms?: number; overnightCarer?: boolean }) {
  const kids = Math.max(0, o.children);
  const childRooms = kids === 0 ? 0 : Math.max(Math.ceil(kids / 2), Math.min(kids, o.childRooms ?? 0));
  return 1 + Math.max(0, o.otherAdults) + childRooms + (o.overnightCarer ? 1 : 0);
}

/** Reduction of eligible rent for spare bedrooms: 14% for one, 25% for two or more; none at State Pension age. */
export function socialSizeCriteria(o: { eligibleRent: number; bedrooms: number; needed: number; pensionAge?: boolean }) {
  const spare = Math.max(0, o.bedrooms - o.needed);
  const pct = o.pensionAge || spare === 0 ? 0 : spare === 1 ? P.lha.socialSpareOne : P.lha.socialSpareTwo;
  const reduction = pence(o.eligibleRent * pct);
  return { spare, pct, reduction, after: pence(o.eligibleRent - reduction), yearly: pence(reduction * 12) };
}

/* ---------- Budgeting Loan (legacy benefits, Pension Credit) and Budgeting Advance (Universal Credit) ---------- */

export type BudgetHousehold = 'single' | 'couple' | 'children';

/** Highest amount offered: Budgeting Loan for legacy benefits and Pension Credit, Budgeting Advance on Universal Credit. */
export function budgetingMax(household: BudgetHousehold, onUc: boolean) {
  const L = onUc ? P.budgetingAdvance : P.budgetingLoan;
  const max = household === 'children' ? (onUc ? P.budgetingAdvance.children : P.budgetingLoan.withChildBenefit) : household === 'couple' ? L.couple : L.single;
  return { scheme: onUc ? 'Budgeting Advance' : 'Budgeting Loan', min: L.min, max };
}

/** Even repayment of an amount: Budgeting Advance over 24 monthly UC payments, Budgeting Loan over 104 weeks. */
export function budgetingRepayment(amount: number, onUc: boolean) {
  if (amount <= 0) return { perPeriod: 0, period: onUc ? 'month' : 'week', periods: 0, monthly: 0 };
  if (onUc) { const n = P.budgetingAdvance.repayMonths; const m = pence(amount / n); return { perPeriod: m, period: 'month', periods: n, monthly: m }; }
  const n = P.budgetingLoan.repayWeeks; const w = pence(amount / n);
  return { perPeriod: w, period: 'week', periods: n, monthly: pence(weeklyToMonthly(w)) };
}

/** Savings above which a Budgeting Loan is reduced: £1,000, or £2,000 if the claimant or partner is 63 or over. */
export const budgetingSavingsLimit = (age63: boolean) => (age63 ? P.budgetingLoan.savingsLimit63 : P.budgetingLoan.savingsLimit);

/* ---------- Winter one-off payments 2026/27 by nation ---------- */

export type OneOffNation = 'ew' | 'scotland' | 'ni';
/** none · UC and working · UC, not working, with a health element or a child under 5 · UC, not working, neither · Pension Credit. */
export type OneOffBenefit = 'none' | 'ucWork' | 'ucQualifying' | 'ucOther' | 'pc';
export interface OneOff { name: string; amount: number; fixed: boolean; note: string }

/**
 * One-off payments a household can expect in winter 2026 to 2027 (paid automatically unless noted).
 * Winter Fuel Payment: England, Wales and Northern Ireland, born on or before 27 June 1960 (base rate shown).
 * Pension Age Winter Heating Payment: Scotland instead. Cold Weather Payment: not in Scotland, £25 per cold spell,
 * Pension Credit or UC with no earnings and a health element or child under 5. Winter Heating Payment: Scotland,
 * same groups, £62 regardless of weather. Warm Home Discount: £150, Great Britain only, means-tested core group.
 */
export function winterOneOffs(o: { nation: OneOffNation; pensionAge: boolean; benefit: OneOffBenefit }): OneOff[] {
  const out: OneOff[] = [];
  const W = P.winterFuel;
  if (o.pensionAge) {
    if (o.nation === 'scotland') out.push({ name: 'Pension Age Winter Heating Payment', amount: P.scotland.pawhp[2], fixed: true, note: `from ${formatMoney(P.scotland.pawhp[0], 2)} to ${formatMoney(P.scotland.pawhp[3], 2)} by age and household` });
    else out.push({ name: 'Winter Fuel Payment', amount: W.base, fixed: true, note: `${formatMoney(W.older)} if born before ${displayDate(W.olderBornBefore, 'en-GB')}; repaid above ${formatMoney(W.incomeThreshold)} of income` });
  }
  const coldGroup = o.benefit === 'pc' || o.benefit === 'ucQualifying';
  if (coldGroup && o.nation !== 'scotland') out.push({ name: 'Cold Weather Payment', amount: P.coldWeather.payment, fixed: false, note: `${formatMoney(P.coldWeather.payment)} for each ${P.coldWeather.days}-day cold spell, 1 November to 31 March` });
  if (coldGroup && o.nation === 'scotland') out.push({ name: 'Winter Heating Payment', amount: P.scotland.winterHeating, fixed: true, note: 'once a year, whatever the weather' });
  if (o.nation === 'ew' && o.benefit !== 'none') out.push({ name: 'Warm Home Discount', amount: P.warmHomeDiscount.amount, fixed: true, note: 'off the electricity bill, not paid to you' });
  if (o.nation === 'scotland' && (o.benefit === 'pc' || o.benefit === 'ucQualifying')) out.push({ name: 'Warm Home Discount', amount: P.warmHomeDiscount.amount, fixed: true, note: 'automatic for Pension Credit; others may apply to the supplier' });
  return out;
}
/** Total of the fixed one-off amounts (cold-spell payments depend on the weather and are left out). */
export const oneOffTotal = (list: OneOff[]) => list.filter((x) => x.fixed).reduce((t, x) => t + x.amount, 0);

/* ---------- Universal Credit in Northern Ireland: twice a month, housing to the landlord ---------- */

/** Split of a monthly UC award in Northern Ireland (nidirect): housing element straight to the landlord, the rest in two halves. */
export function niTwiceMonthly(monthlyAward: number, housingElement: number) {
  const housing = Math.max(0, Math.min(monthlyAward, housingElement));
  const toYou = pence(Math.max(0, monthlyAward - housing));
  const half = pence(toYou / 2);
  return { toLandlord: pence(housing), toYouMonthly: toYou, eachPayment: half, secondPayment: pence(toYou - half) };
}

/* ---------- Scotland-only household payments ---------- */

/**
 * Yearly cash a family in Scotland can receive that has no equivalent elsewhere: Scottish Child Payment (each child
 * under 16, with Universal Credit or another qualifying benefit), Child Winter Heating Payment (each child under 19 on
 * the highest care rate of Child Disability Payment or DLA, or the enhanced daily living rate) and Winter Heating Payment.
 */
export function scotlandExtras(o: { childrenUnder16: number; qualifyingBenefit: boolean; disabledChildren?: number; winterHeating?: boolean }) {
  const S = P.scotland;
  const kids = Math.max(0, o.childrenUnder16);
  const scpWeekly = o.qualifyingBenefit ? pence(kids * S.childPayment) : 0;
  const scpYear = pence(scpWeekly * 52);
  const cwhp = pence(Math.max(0, o.disabledChildren ?? 0) * S.childWinterHeating);
  const whp = o.winterHeating ? S.winterHeating : 0;
  return { scpWeekly, scpFourWeekly: pence(scpWeekly * 4), scpYear, cwhp, whp, total: pence(scpYear + cwhp + whp) };
}

/* ---------- Reference table of benefit rates 2026/27 ---------- */

export interface RateRow { key: string; group: string; label: string; amount: number; per: 'week' | 'month' }
const U = P.uc;
/** Main rates, in the period the DWP or HMRC publishes them. */
export const RATE_TABLE: RateRow[] = [
  { key: 'ucSingleUnder25', group: 'Universal Credit', label: 'Standard allowance, single under 25', amount: U.standard.singleUnder25, per: 'month' },
  { key: 'ucSingle25', group: 'Universal Credit', label: 'Standard allowance, single 25 or over', amount: U.standard.single25, per: 'month' },
  { key: 'ucCoupleUnder25', group: 'Universal Credit', label: 'Standard allowance, couple both under 25', amount: U.standard.coupleUnder25, per: 'month' },
  { key: 'ucCouple25', group: 'Universal Credit', label: 'Standard allowance, couple, one 25 or over', amount: U.standard.couple25, per: 'month' },
  { key: 'ucChild', group: 'Universal Credit', label: 'Child element, each child', amount: U.child, per: 'month' },
  { key: 'ucChildPre2017', group: 'Universal Credit', label: 'Child element, eldest born before 6 April 2017', amount: U.firstChildPre2017, per: 'month' },
  { key: 'ucDisChildLower', group: 'Universal Credit', label: 'Disabled child, lower rate', amount: U.disabledChildLower, per: 'month' },
  { key: 'ucDisChildHigher', group: 'Universal Credit', label: 'Disabled child, higher rate', amount: U.disabledChildHigher, per: 'month' },
  { key: 'ucLcwra', group: 'Universal Credit', label: 'LCWRA element (claims before 6 April 2026)', amount: U.lcwra, per: 'month' },
  { key: 'ucLcwraNew', group: 'Universal Credit', label: 'LCWRA element (new claims from 6 April 2026)', amount: U.lcwraNew2026, per: 'month' },
  { key: 'ucCarer', group: 'Universal Credit', label: 'Carer element', amount: U.carer, per: 'month' },
  { key: 'jsaUnder25', group: 'New Style JSA and ESA', label: 'Personal rate, under 25', amount: P.esaJsa.under25, per: 'week' },
  { key: 'jsa25', group: 'New Style JSA and ESA', label: 'Personal rate, 25 or over', amount: P.esaJsa.over25, per: 'week' },
  { key: 'esaWra', group: 'New Style JSA and ESA', label: 'ESA work-related activity component', amount: P.esaJsa.esaWra, per: 'week' },
  { key: 'esaSupport', group: 'New Style JSA and ESA', label: 'ESA support component', amount: P.esaJsa.esaSupport, per: 'week' },
  { key: 'pipDailyStd', group: 'Disability', label: 'PIP or ADP daily living, standard', amount: P.pip.dailyStandard, per: 'week' },
  { key: 'pipDailyEnh', group: 'Disability', label: 'PIP or ADP daily living, enhanced', amount: P.pip.dailyEnhanced, per: 'week' },
  { key: 'pipMobStd', group: 'Disability', label: 'PIP or ADP mobility, standard', amount: P.pip.mobilityStandard, per: 'week' },
  { key: 'pipMobEnh', group: 'Disability', label: 'PIP or ADP mobility, enhanced', amount: P.pip.mobilityEnhanced, per: 'week' },
  { key: 'aaLower', group: 'Disability', label: 'Attendance Allowance, lower rate', amount: P.aa.lower, per: 'week' },
  { key: 'aaHigher', group: 'Disability', label: 'Attendance Allowance, higher rate', amount: P.aa.higher, per: 'week' },
  { key: 'dlaCareLowest', group: 'Disability', label: 'DLA care, lowest rate', amount: P.dla.careLowest, per: 'week' },
  { key: 'dlaCareMiddle', group: 'Disability', label: 'DLA care, middle rate', amount: P.dla.careMiddle, per: 'week' },
  { key: 'dlaCareHighest', group: 'Disability', label: 'DLA care, highest rate', amount: P.dla.careHighest, per: 'week' },
  { key: 'dlaMobLower', group: 'Disability', label: 'DLA mobility, lower rate', amount: P.dla.mobilityLower, per: 'week' },
  { key: 'dlaMobHigher', group: 'Disability', label: 'DLA mobility, higher rate', amount: P.dla.mobilityHigher, per: 'week' },
  { key: 'carers', group: 'Carers', label: 'Carer’s Allowance or Carer Support Payment', amount: P.carers.allowance, per: 'week' },
  { key: 'cbEldest', group: 'Children', label: 'Child Benefit, eldest or only child', amount: P.childBenefit.eldest, per: 'week' },
  { key: 'cbOther', group: 'Children', label: 'Child Benefit, each other child', amount: P.childBenefit.additional, per: 'week' },
  { key: 'guardian', group: 'Children', label: 'Guardian’s Allowance', amount: P.guardiansAllowance.weekly, per: 'week' },
  { key: 'ma', group: 'Children', label: 'Maternity Allowance, standard rate', amount: P.maternity.maStandard, per: 'week' },
  { key: 'spNew', group: 'Pension age', label: 'New State Pension, full rate', amount: P.statePension.newFull, per: 'week' },
  { key: 'spBasic', group: 'Pension age', label: 'Basic State Pension, full rate', amount: P.statePension.basicFull, per: 'week' },
  { key: 'pcSingle', group: 'Pension age', label: 'Pension Credit guarantee, single', amount: P.pensionCredit.guaranteeSingle, per: 'week' },
  { key: 'pcCouple', group: 'Pension age', label: 'Pension Credit guarantee, couple', amount: P.pensionCredit.guaranteeCouple, per: 'week' },
  { key: 'bspHigher', group: 'Bereavement', label: 'Bereavement Support Payment, higher monthly', amount: P.bereavement.higherMonthly, per: 'month' },
  { key: 'bspStandard', group: 'Bereavement', label: 'Bereavement Support Payment, standard monthly', amount: P.bereavement.standardMonthly, per: 'month' },
  { key: 'wpa', group: 'Bereavement', label: 'Widowed Parent’s Allowance', amount: P.bereavement.widowedParent, per: 'week' },
  { key: 'capFamily', group: 'Benefit cap', label: 'Benefit cap, couple or lone parent, outside London', amount: P.benefitCap.weekly.restFamily, per: 'week' },
  { key: 'capSingle', group: 'Benefit cap', label: 'Benefit cap, single adult, outside London', amount: P.benefitCap.weekly.restSingle, per: 'week' },
  { key: 'capLondonFamily', group: 'Benefit cap', label: 'Benefit cap, couple or lone parent, Greater London', amount: P.benefitCap.weekly.londonFamily, per: 'week' },
  { key: 'capLondonSingle', group: 'Benefit cap', label: 'Benefit cap, single adult, Greater London', amount: P.benefitCap.weekly.londonSingle, per: 'week' },
];

/** Weekly, monthly (× 52 ÷ 12) and yearly (52 weeks or 12 months) equivalents of a published rate. */
export function rateEquivalents(r: Pick<RateRow, 'amount' | 'per'>) {
  if (r.per === 'month') return { weekly: pence(monthlyToWeekly(r.amount)), monthly: r.amount, yearly: pence(r.amount * 12) };
  return { weekly: r.amount, monthly: pence(weeklyToMonthly(r.amount)), yearly: pence(r.amount * 52) };
}
