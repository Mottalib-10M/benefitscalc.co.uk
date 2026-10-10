import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { childBenefitWeeklyFor } from '../../lib/engine/family-grants';
import { formatMoney } from '../../lib/format';

const CB = P.childBenefit;
const g = (n: number, d = 2) => formatMoney(n, d);
const w = (n: number) => childBenefitWeeklyFor(n, '2026');
const rise = CB.eldest - CB.previous.eldest;

export default definePage({
  id: 'child-benefit-rates',
  group: 'family',
  order: 20,
  mini: 'cbRates',
  miniHref: 'child-benefit-calculator',
  related: ['child-benefit-calculator', 'high-income-child-benefit-charge', 'guardians-allowance', 'scottish-child-payment', 'benefit-cap-calculator', 'universal-credit-rates'],
  sources: ['hmrcCbRates', 'govCb', 'govCbPaid', 'govCbHowToClaim', 'govCb1619'],
  slug: 'child-benefit-rates',
  nav: 'Child Benefit rates',
  card: 'Weekly rates for the eldest and other children, with last year’s figures and payment rules.',
  title: 'Child Benefit Rates 2026/27: Eldest and Other Children',
  description: `Child Benefit rates 2026/27: ${g(CB.eldest)} a week for the eldest child and ${g(CB.additional)} for each other child, against 2025/26, plus payment days, backdating, split families.`,
  h1: 'Child Benefit rates this year, and how the money is paid',
  intro: 'Two weekly rates, one higher rate per household, and a few rules that decide which children count.',
  resume: `From 6 April 2026 Child Benefit pays ${g(CB.eldest)} a week for the eldest or only child and ${g(CB.additional)} a week for every other child, up from ${g(CB.previous.eldest)} and ${g(CB.previous.additional)} in 2025/26, according to HMRC’s rates table. A family with two children therefore receives ${g(w(2))} a week, or ${g(w(2) * 4)} in each four-weekly payment, and a family with three gets ${g(w(3))} a week. There is no cap on the number of children. The money normally arrives every ${CB.paidEveryWeeks} weeks on a Monday or Tuesday, though single parents and people on certain benefits such as Universal Credit can ask for weekly payments. A child counts until 16, or until 20 if they stay in approved full-time education or training that began before they turned ${CB.courseAcceptedBefore}. A new claim can be backdated by up to ${CB.backdateMonths} months, so it pays to claim soon after the birth or after a child moves in with you.`,
  faqs: [
    { q: 'How much is Child Benefit for two children in 2026/27?', a: `${g(w(2))} a week: ${g(CB.eldest)} for the elder child and ${g(CB.additional)} for the younger. Each four-weekly payment is ${g(w(2) * 4)}, which comes to about ${g(w(2) * 52, 0)} over a 52-week year. If the higher earner in the household has adjusted net income above ${g(CB.hicbcThreshold, 0)}, part of it is repaid through the High Income Child Benefit Charge.` },
    { q: 'Do separated parents both get the higher Child Benefit rate?', a: `They can. If one child lives with each parent, each parent claims the higher rate of ${g(CB.eldest)} for the eldest child in their own household. Only one person can be paid for a given child; if both claim the same child, HMRC pays one of them. Further children in either household get ${g(CB.additional)} each.` },
    { q: 'When did the Child Benefit rate last go up?', a: `On 6 April 2026, the start of the tax year, when the eldest-child rate rose by ${g(rise)} to ${g(CB.eldest)} and the other-child rate by ${g(CB.additional - CB.previous.additional)} to ${g(CB.additional)}. The new rates were applied automatically; nobody had to reclaim. HMRC publishes the rates for each tax year from 6 April to 5 April in its Child Benefit and Guardian’s Allowance table.` },
    { q: 'Can I get Child Benefit paid every week instead of every four weeks?', a: `Yes, if you are bringing up the children on your own or you get certain other benefits, such as Universal Credit. Weekly payment does not change the amount, only the timing. You choose one bank, building society or credit union account; a Nationwide cashbuilder account in someone else’s name and Post Office card accounts cannot be used.` },
    { q: 'Does Child Benefit count towards the benefit cap?', a: `Yes. Child Benefit is included in the total that the benefit cap measures, although the Child Benefit itself is always paid in full; any reduction is taken from Universal Credit or Housing Benefit instead. A household outside London with children is capped at ${g(P.benefitCap.weekly.restFamily)} a week unless an exemption, such as earnings of ${g(P.benefitCap.earningsExemptMonthly, 0)} a month, applies.` },
  ],
  body: (h) => `
<h2>Rates for 2026/27 and the two previous years</h2>
<p>HMRC sets two weekly amounts each tax year. The higher one is paid once per household, for the eldest child; every other child gets the lower one. The three most recent years are below.</p>
${h.table(['Tax year', 'Eldest or only child', 'Each other child'], [
  ['2026 to 2027', h.gbp(CB.eldest, 2), h.gbp(CB.additional, 2)],
  ['2025 to 2026', h.gbp(CB.previous.eldest, 2), h.gbp(CB.previous.additional, 2)],
  ['2024 to 2025', h.gbp(CB.prior2024.eldest, 2), h.gbp(CB.prior2024.additional, 2)],
], 'Weekly Child Benefit rates by tax year, 6 April to 5 April (HMRC rates and allowances)', ['l', 'r', 'r'])}
<p>The increase this April was ${h.gbp(rise, 2)} a week on the eldest-child rate, or about ${h.gbp(rise * 52)} over a year, in line with the September 2025 Consumer Prices Index of ${h.pct(P.upratingCPI, 1)}. Over two years the eldest-child rate has gone from ${h.gbp(CB.prior2024.eldest, 2)} to ${h.gbp(CB.eldest, 2)}.</p>

<h2>What a family of each size receives</h2>
${h.table(['Children', 'A week', 'Every 4 weeks', 'A year (52 weeks)'], [1, 2, 3, 4, 5, 6].map((n) => [String(n), h.gbp(w(n), 2), h.gbp(w(n) * 4, 2), h.gbp(w(n) * 52, 2)]), 'Child Benefit in 2026/27 by number of children', ['l', 'r', 'r', 'r'])}
<p>A year here means 52 weeks. Because payments fall every four weeks, thirteen of them land in most tax years, but the calendar occasionally fits a fourteenth into the same year, which explains a bank total slightly higher than the table.</p>

<h2>Which child gets the higher rate</h2>
<p>The higher rate follows the eldest child in the household, not the eldest child of a particular parent. When two families join, the oldest of all the children living together carries the ${h.gbp(CB.eldest, 2)} rate and the rest move to ${h.gbp(CB.additional, 2)}, even if each adult was receiving the higher rate before the move. Partners can claim for different children, but they cannot both keep the higher rate while living together; HMRC can recover the difference if they do. Report the move to the Child Benefit Office.</p>
<p>When a family splits, the reverse happens. A parent with one child at home and an ex-partner with another child at home each get ${h.gbp(CB.eldest, 2)}, because each child is now the eldest in their own household. You count as responsible for a child who lives with you, or for one living elsewhere if you pay at least the amount of Child Benefit towards their keep, in money or in kind. ${h.src('govCb', 'GOV.UK sets out these household rules')}.</p>

<h2>When a child turns 16</h2>
<p>Child Benefit stops on 31 August on or after the 16th birthday unless you tell HMRC that your child is staying on. It then continues while they are in full-time non-advanced education, meaning more than ${CB.fullTimeHours} hours a week on average of supervised study, or in unpaid approved training. A levels, T levels, GCSEs, Scottish Highers, most qualifications up to level 3 and home education qualify. A university degree, an HNC or HND, or an apprenticeship does not. The child must have been accepted onto the course before turning ${CB.courseAcceptedBefore}, and payments end at the latest when they reach ${CB.educationAgeLimit}.</p>
<p>A 16 or 17-year-old who leaves and registers with the careers service or the armed forces can keep the family’s Child Benefit going for ${CB.leaverExtensionWeeks} weeks, as long as you apply within ${CB.backdateMonths} months of them leaving. Payments also stop if the young person starts work of ${CB.workHoursStop} hours a week or more outside education, starts an apprenticeship in England, or claims Universal Credit or Employment and Support Allowance in their own right. ${h.src('govCb1619', 'The GOV.UK page on children over 16')} lists the qualifying courses.</p>

<h2>Claiming and backdating</h2>
<p>You can claim ${CB.claimAfterBirthHours} hours after registering a birth, or as soon as a child comes to live with you, including during an adoption before it is finalised. Claims go online through GOV.UK, by post or by phone, and HMRC can backdate the payments by up to ${CB.backdateMonths} months from the date of claim, a limit set by ${h.src('cpRegs19', 'regulation 19 of the Claims and Payments Regulations')}. A family that waits six months after a birth to claim loses at least three months of payments: around ${h.gbp(CB.eldest * 13, 2)} for a first child. Claiming without the birth certificate is possible but slower.</p>
<p>Whoever claims receives National Insurance credits while the child is under ${CB.niCreditChildUnder}. In a couple where one partner stays at home, that partner should usually be the claimant, so that the credits fill their State Pension record. If the claimant does not need them, because they already pay National Insurance through work, a partner can apply to transfer the credits, and a grandparent or other relative who looks after the child can apply for Specified Adult Childcare credits instead.</p>

<h2>Child Benefit and other support</h2>
<p>Universal Credit ignores Child Benefit as income, so the two are paid in full side by side, subject only to the benefit cap. In Scotland, families on Universal Credit can add ${h.a('scottish-child-payment', 'Scottish Child Payment')} of ${h.gbp(P.scotland.childPayment, 2)} a week for each child under 16, a figure larger than the Child Benefit rate itself. Kinship carers looking after an orphaned child may also get ${h.a('guardians-allowance', 'Guardian’s Allowance')}. To see the effect of the tax charge on your own figures, the ${h.a('child-benefit-calculator', 'Child Benefit calculator')} takes the number of children and the higher income in the home.</p>
`,
});
