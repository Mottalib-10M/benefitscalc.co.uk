import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { childBenefitWeekly, childBenefitYear, hicbc } from '../../lib/engine/family';
import { formatMoney } from '../../lib/format';

const CB = P.childBenefit;
const g = (n: number, d = 2) => formatMoney(n, d);
// Worked example: three children, the higher earner on £66,000 adjusted net income.
const exYear = childBenefitYear(3);
const ex = hicbc(66000, exYear);

export default definePage({
  id: 'child-benefit-calculator',
  group: 'family',
  order: 10,
  tool: 'cb',
  related: ['child-benefit-rates', 'high-income-child-benefit-charge', 'guardians-allowance', 'tax-free-childcare-calculator', 'benefits-calculator'],
  sources: ['hmrcCbRates', 'govCb', 'govHicbc', 'govCbHowToClaim'],
  slug: 'child-benefit-calculator',
  nav: 'Child Benefit calculator',
  card: 'Child Benefit for your children this year, less any High Income Child Benefit Charge.',
  title: 'Child Benefit Calculator 2026/27: What You Keep After Tax',
  description: `Child Benefit calculator 2026/27: ${g(CB.eldest)} a week for the eldest child, ${g(CB.additional)} for each other child, minus the tax charge when one income tops ${g(CB.hicbcThreshold, 0)} a year.`,
  h1: 'Child Benefit calculator: the yearly amount and the tax charge',
  intro: 'Two numbers, your children and the higher income in the home, give the Child Benefit you actually keep.',
  resume: `Child Benefit for the 2026/27 tax year pays ${g(CB.eldest)} a week for the eldest or only child and ${g(CB.additional)} a week for each further child, with no limit on how many children you claim for. Over 52 weeks that is ${g(childBenefitYear(1))} for one child, ${g(childBenefitYear(2))} for two and ${g(childBenefitYear(3))} for three, paid every ${CB.paidEveryWeeks} weeks into one bank account. The money is the same whatever you earn, but if the higher earner in the household has adjusted net income above ${g(CB.hicbcThreshold, 0)}, HMRC claws back 1% of the year’s Child Benefit for each ${g(CB.hicbcPerPct, 0)} above that line through the High Income Child Benefit Charge, and all of it from ${g(CB.hicbcUpper, 0)}. The calculator applies both rules at once: enter the number of children you claim for and the higher adjusted net income, and it shows the benefit for the year, the charge and what is left after it.`,
  faqs: [
    { q: 'Whose income do I enter in the Child Benefit calculator?', a: `The higher of the two adjusted net incomes in the household, yours or your partner’s, even if the lower earner is the one receiving Child Benefit. The charge falls on whoever has the higher income. Adjusted net income is taxable income including savings interest and dividends, less pension contributions and Gift Aid; household income is never added together.` },
    { q: 'Should I still claim Child Benefit if the charge takes it all back?', a: `Yes, in most cases. Above ${g(CB.hicbcUpper, 0)} the charge equals the benefit, but the claim itself still gives National Insurance credits to a parent at home with a child under ${CB.niCreditChildUnder}, and your child gets a National Insurance number before turning 16 without applying. You can claim and choose not to be paid, which removes the charge.` },
    { q: 'Does the calculator count the child who has just turned 16?', a: `Count them only if they stay in full-time non-advanced education, such as A levels, T levels or Scottish Highers, or unpaid approved training. Child Benefit can then run until they turn ${CB.educationAgeLimit}, provided they were accepted onto the course before ${CB.courseAcceptedBefore} and do not get Universal Credit. A degree, an apprenticeship or work of ${CB.workHoursStop} hours a week ends it.` },
    { q: 'Why does my Child Benefit total for the year differ from the calculator?', a: `The calculator multiplies the weekly rate by 52. Payments arrive every ${CB.paidEveryWeeks} weeks on a Monday or Tuesday, so a tax year sometimes holds 53 payment weeks, and a claim that starts mid-year or is backdated by up to ${CB.backdateMonths} months changes the total. Rates also change each 6 April.` },
  ],
  body: (h) => `
<h2>A worked example</h2>
<p>A couple with three children, the eldest aged 9, gets ${h.gbp(childBenefitWeekly(3), 2)} a week: ${h.gbp(CB.eldest, 2)} for the eldest plus twice ${h.gbp(CB.additional, 2)}. That is ${h.gbp(exYear, 2)} over the year. One parent earns a salary that puts their adjusted net income at ${h.gbp(66000)}, which is ${h.gbp(66000 - CB.hicbcThreshold)} above the threshold. Divided by ${h.gbp(CB.hicbcPerPct)}, that gives a charge of ${ex.pct}% of the benefit, or ${h.gbp(ex.charge)}, payable by the higher earner through their tax code or a Self Assessment return. The family keeps ${h.gbp(ex.net, 2)}. Paying ${h.gbp(6000)} more into a workplace pension would bring income back to the threshold and remove the charge entirely, which ${h.a('high-income-child-benefit-charge', 'the guide to the charge')} sets out.</p>

<h2>What the calculator assumes</h2>
<p>It applies the 2026/27 weekly rates from HMRC to every child you enter, with the higher rate once for the eldest. In a blended household only one child gets the higher rate, even if each partner claimed it before moving in together. Separated parents each get the higher rate for the eldest child living with them. The full rate table, with the last two years for comparison, is on ${h.a('child-benefit-rates', 'Child Benefit rates')}.</p>
<p>The income line is the higher earner’s estimate for the whole tax year; the charge is settled on the actual figure later.</p>

<h2>Claiming and what else to check</h2>
<p>You can claim ${CB.claimAfterBirthHours} hours after registering the birth, online or by post, and HMRC backdates up to ${CB.backdateMonths} months, so a late claim for a newborn loses money quickly. ${h.src('govCbHowToClaim', 'GOV.UK explains how to claim')}. If you look after a child whose parents have died, ${h.a('guardians-allowance', 'Guardian’s Allowance')} adds ${h.gbp(P.guardiansAllowance.weekly, 2)} a week on top, and it is not touched by the tax charge. Paying for nursery? Try the ${h.a('tax-free-childcare-calculator', 'Tax-Free Childcare calculator')}.</p>
`,
});
