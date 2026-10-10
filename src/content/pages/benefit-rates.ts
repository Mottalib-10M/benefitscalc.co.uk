import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { RATE_TABLE, rateEquivalents } from '../../lib/engine/support';
import { formatMoney, formatPercent } from '../../lib/format';

const g = (n: number, d = 2) => formatMoney(n, d);
const groups = [...new Set(RATE_TABLE.map((r) => r.group))];
const rise = (now: number, before: number) => formatPercent(now / before - 1, 1);
const U = P.uc;

export default definePage({
  id: 'benefit-rates',
  group: 'uc',
  order: 140,
  mini: 'rateLookup',
  miniHref: 'benefits-calculator',
  related: ['benefits-uprating', 'universal-credit-rates', 'pip-rates', 'child-benefit-rates', 'state-pension-amount', 'benefit-cap-calculator'],
  sources: ['dwpRates', 'hmrcCbRates', 'wms2025', 'ucAct2025s1', 'govBenefitCap', 'scotUprating'],
  slug: 'benefit-rates',
  nav: 'Benefit rates 2026/27',
  card: 'Every main benefit rate for 2026/27 in one table, weekly, monthly and yearly.',
  title: 'Benefit Rates 2026/27: Weekly and Monthly Amounts Table',
  description: `Benefit rates 2026/27 in one table: Universal Credit from ${g(U.standard.singleUnder25)} a month, PIP, Carer’s Allowance ${g(P.carers.allowance)}, State Pension ${g(P.statePension.newFull)} a week, ${RATE_TABLE.length} rates in all.`,
  h1: 'Benefit rates this year, all in one place',
  intro: 'The main amounts from April 2026, in the period each benefit is published in, with weekly, monthly and yearly equivalents.',
  resume: `Most benefits rose by ${formatPercent(P.upratingCPI, 1)} in April 2026, in line with the Consumer Prices Index for September 2025, and the new and basic State Pensions by ${formatPercent(P.statePension.tripleLockIncrease, 1)} under the triple lock. Universal Credit is set monthly: the standard allowance is ${g(U.standard.singleUnder25)} for a single person under 25, ${g(U.standard.single25)} at 25 or over and ${g(U.standard.couple25)} for a couple where either partner is 25 or over, with ${g(U.child)} for each child. Other benefits are weekly: PIP pays ${g(P.pip.dailyStandard)} or ${g(P.pip.dailyEnhanced)} for daily living and ${g(P.pip.mobilityStandard)} or ${g(P.pip.mobilityEnhanced)} for mobility, Carer’s Allowance ${g(P.carers.allowance)}, Child Benefit ${g(P.childBenefit.eldest)} for the eldest child and ${g(P.childBenefit.additional)} for others, New Style JSA and ESA ${g(P.esaJsa.over25)} at 25 or over, the full new State Pension ${g(P.statePension.newFull)} and the Pension Credit guarantee ${g(P.pensionCredit.guaranteeSingle)} for a single person. Two figures did not move: the benefit cap stays at ${g(P.benefitCap.annual.restFamily, 0)} a year for families outside London, and the Local Housing Allowance stays at its April 2024 level.`,
  faqs: [
    { q: 'Why are some benefit rates monthly and others weekly?', a: `Universal Credit is assessed and paid by the calendar month, so DWP publishes its rates monthly. The older benefits, disability benefits, Carer’s Allowance, Child Benefit and pensions are weekly rates, although most are paid every four weeks. To compare them, DWP converts weekly to monthly by multiplying by 52 and dividing by 12: ${g(P.carers.allowance)} a week is ${g((P.carers.allowance * 52) / 12)} a month.` },
    { q: 'Which benefits did not go up in April 2026?', a: `The benefit cap levels, the Local Housing Allowance, the Bereavement Support Payment amounts of ${g(P.bereavement.higherLump, 0)} and ${g(P.bereavement.higherMonthly, 0)} a month at the higher rate, and the Universal Credit and Housing Benefit capital limits of ${g(U.capitalLower, 0)} and ${g(U.capitalUpper, 0)} were all left unchanged.` },
    { q: 'Are the benefit rates different in Scotland or Northern Ireland?', a: `Not for the benefits in this table. Northern Ireland pays the same amounts through the Department for Communities, and Scotland’s replacements for PIP, Attendance Allowance, child DLA and Carer’s Allowance use the same weekly rates. Scotland adds payments of its own, such as Scottish Child Payment of ${g(P.scotland.childPayment)} a week and the Scottish Carer Supplement of ${g(P.scotland.carerSupplement)}.` },
    { q: 'When will the 2027/28 benefit rates be published?', a: `The Secretary of State reviews benefit rates each autumn against the September inflation figure, and the new rates are normally announced in November and take effect in April. The 2026/27 rates followed a written statement to Parliament on 26 November 2025. Until April 2027, the amounts here apply to every payment.` },
  ],
  body: (h) => `
<h2>The full table</h2>
<p>Each row gives the rate as DWP or HMRC publishes it, then the same amount as a week, a month and a year. A year is 52 weeks or 12 months; the monthly equivalent of a weekly rate is the week × 52 ÷ 12, the conversion Universal Credit uses when it deducts another benefit.</p>
${groups.map((grp) => h.table(['Rate', 'Published', 'A week', 'A month', 'A year'], RATE_TABLE.filter((r) => r.group === grp).map((r) => { const e = rateEquivalents(r); return [r.label, `${h.gbp(r.amount, 2)} a ${r.per}`, h.gbp(e.weekly, 2), h.gbp(e.monthly, 2), h.gbp(e.yearly)]; }), `${grp}, 2026/27`, ['l', 'r', 'r', 'r', 'r'])).join('\n')}
<p>Sources: the ${h.src('dwpRates', 'DWP benefit and pension rates 2026 to 2027')}, ${h.src('hmrcCbRates', 'HMRC’s Child Benefit and Guardian’s Allowance rates')} and ${h.src('govBenefitCap', 'GOV.UK’s benefit cap amounts')}.</p>

<h2>What went up, and by how much</h2>
${h.table(['Rate', '2025/26', '2026/27', 'Rise'], [
  ['Universal Credit, single 25 or over (month)', h.gbp(U.previous.single25, 2), h.gbp(U.standard.single25, 2), rise(U.standard.single25, U.previous.single25)],
  ['Universal Credit child element (month)', h.gbp(U.previous.child, 2), h.gbp(U.child, 2), rise(U.child, U.previous.child)],
  ['Universal Credit carer element (month)', h.gbp(U.previous.carer, 2), h.gbp(U.carer, 2), rise(U.carer, U.previous.carer)],
  ['PIP enhanced daily living (week)', h.gbp(P.pip.previous.dailyEnhanced, 2), h.gbp(P.pip.dailyEnhanced, 2), rise(P.pip.dailyEnhanced, P.pip.previous.dailyEnhanced)],
  ['Carer’s Allowance (week)', h.gbp(P.carers.previous.allowance, 2), h.gbp(P.carers.allowance, 2), rise(P.carers.allowance, P.carers.previous.allowance)],
  ['Child Benefit, eldest child (week)', h.gbp(P.childBenefit.previous.eldest, 2), h.gbp(P.childBenefit.eldest, 2), rise(P.childBenefit.eldest, P.childBenefit.previous.eldest)],
  ['New State Pension (week)', h.gbp(P.statePension.previous.newFull, 2), h.gbp(P.statePension.newFull, 2), rise(P.statePension.newFull, P.statePension.previous.newFull)],
  ['Pension Credit guarantee, single (week)', h.gbp(P.pensionCredit.previous.guaranteeSingle, 2), h.gbp(P.pensionCredit.guaranteeSingle, 2), rise(P.pensionCredit.guaranteeSingle, P.pensionCredit.previous.guaranteeSingle)],
], 'Selected rates before and after April 2026 (DWP; HMRC)', ['l', 'r', 'r', 'r'])}
<p>The Universal Credit standard allowance rose by more than inflation because ${h.src('ucAct2025s1', 'section 1 of the Universal Credit Act 2025')} requires a further uplift on top of the ${h.pct(P.upratingCPI, 1)} inflation increase each year from 2026-27 to 2029-30. The Pension Credit guarantee rose by the same ${h.pct(P.statePension.tripleLockIncrease, 1)} as the State Pension. The Universal Credit health element splits in two from ${h.date(U.lcwraReformDate)}: ${h.gbp(U.lcwra, 2)} for existing claimants, severe conditions and end of life, ${h.gbp(U.lcwraNew2026, 2)} for most new claims. ${h.a('benefits-uprating', 'How benefits are uprated')} explains each rule.</p>

<h2>Thresholds that sit beside the rates</h2>
<p>Some of the figures that decide an award are limits rather than payments. Universal Credit allows ${h.gbp(U.workAllowanceHigher)} a month of earnings before the taper if there is no housing element, or ${h.gbp(U.workAllowanceLower)} with one, for households with children or limited capability for work. Carer’s Allowance stops once earnings after allowable deductions pass ${h.gbp(P.carers.earningsLimit, 2)} a week. The High Income Child Benefit Charge starts at ${h.gbp(P.childBenefit.hicbcThreshold)} of adjusted net income and takes all of the benefit at ${h.gbp(P.childBenefit.hicbcUpper)}. The benefit cap does not apply when household take-home pay reaches ${h.gbp(P.benefitCap.earningsExemptMonthly)} a month. Savings start to reduce Universal Credit above ${h.gbp(U.capitalLower)}, and Pension Credit above ${h.gbp(P.pensionCredit.capitalDisregard)}.</p>

<h2>Reading the rates against a payment</h2>
<p>A rate table rarely matches a bank statement line for line. PIP, Carer’s Allowance, Child Benefit and the State Pension arrive every four weeks, so a payment is four times the weekly rate: ${h.gbp(P.carers.allowance * 4, 2)} for Carer’s Allowance. Universal Credit arrives monthly, after earnings, other benefits and deductions have been taken off, and the ${h.a('benefit-cap-calculator', 'benefit cap')} may trim it again. Use ${h.a('universal-credit-rates', 'the Universal Credit rates page')} for every element, including the disabled child and childcare amounts, and ${h.a('pip-rates', 'the PIP rates page')} for each combination of daily living and mobility.</p>
`,
});
