import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { formatMoney, formatPercent } from '../../lib/format';

const g = (n: number, d = 2) => formatMoney(n, d);
const rise = (a: number, b: number) => formatPercent((b - a) / a, 1);
const U = P.uc;

export default definePage({
  id: 'benefits-uprating',
  group: 'uc',
  order: 150,
  mini: 'uprating',
  miniHref: 'universal-credit-rates',
  related: ['universal-credit-rates', 'pip-rates', 'state-pension-amount', 'child-benefit-rates', 'benefit-cap-calculator', 'local-housing-allowance-rates'],
  sources: ['dwpRates', 'wms2025', 'hmrcCbRates', 'scotUprating', 'lhaVoa'],
  slug: 'benefits-uprating',
  nav: 'April 2026 increases',
  card: 'What rose by 3.8%, what rose more, and what stayed frozen.',
  title: 'Benefit Increase April 2026: 3.8%, 4.8%, What Stayed Frozen',
  description: `Benefit increase April 2026: most benefits up 3.8%, the State Pension 4.8% to ${g(P.statePension.newFull)}, UC standard allowance to ${g(U.standard.single25)}; the benefit cap and LHA frozen.`,
  h1: 'What went up this April, and what did not',
  intro: 'Three different increases, and a list of amounts that did not move at all.',
  resume: `Benefits rose on different scales in April 2026. Most working-age and disability benefits, including PIP, Attendance Allowance, Carer’s Allowance, New Style JSA and ESA and the Universal Credit elements for children, disability and caring, went up by 3.8%, the Consumer Prices Index for September 2025, as the Secretary of State for Work and Pensions set out on 26 November 2025. The new and basic State Pensions rose by 4.8% under the triple lock, the new State Pension to ${g(P.statePension.newFull)} a week. The Universal Credit standard allowance rose further, by ${rise(U.previous.single25, U.standard.single25)} for a single person aged 25 or over, from ${g(U.previous.single25)} to ${g(U.standard.single25)} a month. Child Benefit, set by HMRC, rose from ${g(P.childBenefit.previous.eldest)} to ${g(P.childBenefit.eldest)} for the eldest child. Several amounts did not move at all: the benefit cap, the Local Housing Allowance rates, the savings limits and the bereavement payments.`,
  faqs: [
    { q: 'Why did my Universal Credit go up by more than 3.8% in April 2026?', a: `Because the standard allowance rose by more than inflation: ${g(U.previous.single25)} to ${g(U.standard.single25)} a month for a single person 25 or over, ${rise(U.previous.single25, U.standard.single25)}. Elements such as the child amount went up by 3.8%. If your rent is privately let, your housing element probably did not change, because the Local Housing Allowance rates stayed at their April 2024 level.` },
    { q: 'Did the health element of Universal Credit go up in April 2026?', a: `For people already receiving it, yes: the LCWRA amount rose from ${g(U.previous.lcwra)} to ${g(U.lcwra)} a month. For most new claims with a health condition from 6 April 2026 a lower rate of ${g(U.lcwraNew2026)} applies instead, with exceptions for people meeting the severe conditions criteria and people nearing the end of life.` },
    { q: 'Is the benefit cap higher this year?', a: `No. The cap stayed at ${g(P.benefitCap.annual.restFamily, 0)} a year for couples and families outside London and ${g(P.benefitCap.annual.londonFamily, 0)} in Greater London. Because the benefits underneath it rose, more households can hit the cap. What did change is the earnings threshold that lifts the cap, from ${g(P.benefitCap.earningsExemptMonthlyPrev, 0)} to ${g(P.benefitCap.earningsExemptMonthly, 0)} a month.` },
    { q: 'When will the April 2027 increase be announced?', a: 'The DWP normally publishes the next year’s proposed rates in November, after the September inflation figure is known, as it did on 26 November 2025 for 2026/27. The rates then take effect in April. Until then, every figure on this site uses the 2026/27 rates.' },
  ],
  body: (h) => `
<h2>The main rates, before and after</h2>
${h.table(['Benefit', '2025/26', '2026/27', 'Rise'], [
  ['UC standard allowance, single 25+ (month)', h.gbp(U.previous.single25, 2), h.gbp(U.standard.single25, 2), rise(U.previous.single25, U.standard.single25)],
  ['UC child element (month)', h.gbp(U.previous.child, 2), h.gbp(U.child, 2), rise(U.previous.child, U.child)],
  ['UC carer element (month)', h.gbp(U.previous.carer, 2), h.gbp(U.carer, 2), rise(U.previous.carer, U.carer)],
  ['UC LCWRA, existing claims (month)', h.gbp(U.previous.lcwra, 2), h.gbp(U.lcwra, 2), rise(U.previous.lcwra, U.lcwra)],
  ['UC work allowance, higher (month)', h.gbp(U.previous.workAllowanceHigher), h.gbp(U.workAllowanceHigher), rise(U.previous.workAllowanceHigher, U.workAllowanceHigher)],
  ['New State Pension (week)', h.gbp(P.statePension.previous.newFull, 2), h.gbp(P.statePension.newFull, 2), rise(P.statePension.previous.newFull, P.statePension.newFull)],
  ['Basic State Pension (week)', h.gbp(P.statePension.previous.basicFull, 2), h.gbp(P.statePension.basicFull, 2), rise(P.statePension.previous.basicFull, P.statePension.basicFull)],
  ['Pension Credit, single (week)', h.gbp(P.pensionCredit.previous.guaranteeSingle, 2), h.gbp(P.pensionCredit.guaranteeSingle, 2), rise(P.pensionCredit.previous.guaranteeSingle, P.pensionCredit.guaranteeSingle)],
  ['PIP daily living, enhanced (week)', h.gbp(P.pip.previous.dailyEnhanced, 2), h.gbp(P.pip.dailyEnhanced, 2), rise(P.pip.previous.dailyEnhanced, P.pip.dailyEnhanced)],
  ['PIP mobility, enhanced (week)', h.gbp(P.pip.previous.mobilityEnhanced, 2), h.gbp(P.pip.mobilityEnhanced, 2), rise(P.pip.previous.mobilityEnhanced, P.pip.mobilityEnhanced)],
  ['Carer’s Allowance (week)', h.gbp(P.carers.previous.allowance, 2), h.gbp(P.carers.allowance, 2), rise(P.carers.previous.allowance, P.carers.allowance)],
  ['Carer’s Allowance earnings limit (week)', h.gbp(P.carers.previous.earningsLimit, 2), h.gbp(P.carers.earningsLimit, 2), rise(P.carers.previous.earningsLimit, P.carers.earningsLimit)],
  ['Child Benefit, eldest child (week)', h.gbp(P.childBenefit.previous.eldest, 2), h.gbp(P.childBenefit.eldest, 2), rise(P.childBenefit.previous.eldest, P.childBenefit.eldest)],
  ['Child Benefit, other children (week)', h.gbp(P.childBenefit.previous.additional, 2), h.gbp(P.childBenefit.additional, 2), rise(P.childBenefit.previous.additional, P.childBenefit.additional)],
  ['Scottish Child Payment (week)', h.gbp(P.scotland.childPaymentPrev, 2), h.gbp(P.scotland.childPayment, 2), rise(P.scotland.childPaymentPrev, P.scotland.childPayment)],
], 'DWP benefit and pension rates 2026 to 2027; HMRC Child Benefit rates; Scottish Government up-rating report 2026-27', ['l', 'r', 'r', 'r'])}
<p>The pattern is visible in the last column. Disability and carers’ benefits move together at 3.8%. Pensions take the larger triple lock figure. The Universal Credit standard allowance stands apart, with a rise well above inflation, and the Carer’s Allowance earnings limit follows wages rather than prices: it is set at 16 hours a week at the National Living Wage, as the Scottish Government’s report notes, which is why it rose by slightly more than 3.8%.</p>

<h2>What the increase means for four households</h2>
<p><strong>A single jobseeker aged 30</strong> with no rent to pay on Universal Credit gets ${h.gbp(U.standard.single25 - U.previous.single25, 2)} a month more, about ${h.gbp((U.standard.single25 - U.previous.single25) * 12)} over the year.</p>
<p><strong>A pensioner on the full new State Pension</strong> receives ${h.gbp(P.statePension.newFull - P.statePension.previous.newFull, 2)} a week more, about ${h.gbp((P.statePension.newFull - P.statePension.previous.newFull) * 52)} a year. If the pension was her only income and she also had Pension Credit, the guarantee rose by ${h.gbp(P.pensionCredit.guaranteeSingle - P.pensionCredit.previous.guaranteeSingle, 2)}, so her Pension Credit changed by the difference between the two increases.</p>
<p><strong>A disabled adult on both enhanced rates of PIP</strong> gains ${h.gbp(P.pip.dailyEnhanced + P.pip.mobilityEnhanced - P.pip.previous.dailyEnhanced - P.pip.previous.mobilityEnhanced, 2)} a week, about ${h.gbp((P.pip.dailyEnhanced + P.pip.mobilityEnhanced - P.pip.previous.dailyEnhanced - P.pip.previous.mobilityEnhanced) * 52)} a year, and the carer looking after them ${h.gbp((P.carers.allowance - P.carers.previous.allowance) * 52)} a year in Carer’s Allowance.</p>
<p><strong>A family of four on Universal Credit with two children</strong> born after 2017 and no housing costs gains ${h.gbp(U.standard.couple25 - U.previous.couple25 + 2 * (U.child - U.previous.child), 2)} a month from the standard allowance and child elements together, before any change in earnings. A third child born after April 2017 is now paid for too, which for many families is the larger change of the year.</p>

<h2>What stayed exactly where it was</h2>
<p>Some figures are not covered by the yearly up-rating at all, or were deliberately frozen. The ${h.a('benefit-cap-calculator', 'benefit cap')} kept its 2025/26 levels. The ${h.a('local-housing-allowance-rates', 'Local Housing Allowance')} rates for 2026/27 are the rates that came into force in April 2024, held for a second year, as the ${h.src('lhaVoa', 'Valuation Office Agency notice')} states. The Universal Credit capital limits of ${h.gbp(U.capitalLower)} and ${h.gbp(U.capitalUpper)}, the ${h.gbp(U.tariffPer250, 2)} tariff income, the Pension Credit savings disregard of ${h.gbp(P.pensionCredit.capitalDisregard)}, and the Bereavement Support Payment amounts did not change. Nor did the ${h.gbp(P.statePension.age80Addition, 2)} age addition at 80, or the Winter Fuel Payment amounts.</p>
<p>A frozen figure matters as much as a rising one. A household whose rent was already above the LHA rate now has a bigger gap to fill from the rest of its benefits, and a family just under the benefit cap in March can find its Universal Credit increase capped in April.</p>

<h2>Scotland’s own up-rating</h2>
<p>Social Security Scotland applies its own increase by law. The ${h.src('scotUprating', 'Scottish Government’s 2026-27 report')} raised all devolved payments by the September 2025 CPI, 3.8%, including payments with no UK equivalent: Scottish Child Payment to ${h.gbp(P.scotland.childPayment, 2)} a week, Best Start Grant and the Child Winter Heating Payment. Adult Disability Payment and Carer Support Payment move in step with PIP and Carer’s Allowance, so the rates stay identical across the border.</p>

<h2>When the increase reached your account</h2>
<p>The new rates apply from April, but the date they reach a bank account depends on the payment cycle. Universal Credit is worked out over monthly assessment periods, so the first statement showing the April 2026 rates depends on where your assessment period falls. GOV.UK gives the same explanation for the end of the two-child limit on 6 April 2026: the extra child amounts appeared on statements from May or June. Four-weekly benefits such as PIP and the State Pension show the increase in the first payment that covers weeks after the change, and the uprating letter sent in the spring sets out the new amounts.</p>
<p>The new figures are used throughout this site. ${h.a('universal-credit-rates', 'Universal Credit rates')}, ${h.a('pip-rates', 'PIP rates')} and ${h.a('child-benefit-rates', 'Child Benefit rates')} give each benefit in full.</p>
`,
});
