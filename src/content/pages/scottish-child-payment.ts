import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { scottishChildPayment } from '../../lib/engine/family-grants';
import { childBenefitWeekly } from '../../lib/engine/family';
import { formatMoney } from '../../lib/format';

const SC = P.scotland;
const g = (n: number, d = 2) => formatMoney(n, d);
const s = (n: number) => scottishChildPayment(n);
const rise = SC.childPayment - SC.childPaymentPrev;

export default definePage({
  id: 'scottish-child-payment',
  group: 'nations',
  order: 30,
  mini: 'scpPayment',
  miniHref: 'universal-credit-calculator',
  related: ['best-start-grant', 'benefits-in-scotland', 'free-school-meals', 'child-benefit-rates', 'universal-credit-calculator', 'adult-disability-payment-scotland'],
  sources: ['scotScp', 'scotScpWho', 'scotUprating', 'scotBsgAuto', 'scotSchoolMeals'],
  slug: 'scottish-child-payment',
  nav: 'Scottish Child Payment',
  card: 'A weekly payment for every child under 16 in Scottish families on Universal Credit.',
  title: `Scottish Child Payment 2026/27: ${g(SC.childPayment)} a Week per Child`,
  description: `Scottish Child Payment 2026/27: ${g(SC.childPayment)} a week for each child under 16, paid every 4 weeks to Scottish families on Universal Credit and other benefits.`,
  h1: 'Scottish Child Payment: the weekly amount and who can apply',
  intro: 'Social Security Scotland’s top-up for low-income families, paid per child with no limit on numbers and no effect on other benefits.',
  resume: `Scottish Child Payment is ${g(SC.childPayment)} a week for every child under 16 that you look after, paid every ${SC.scpPaidEveryWeeks} weeks by Social Security Scotland to families living in Scotland who get Universal Credit or another qualifying benefit. The rate rose from ${g(SC.childPaymentPrev)} in April 2026, an increase of ${g(rise)} in line with inflation, under the Scottish Government’s up-rating for 2026-27. A family with two children receives ${g(s(2).fourWeekly)} every four weeks, about ${g(s(2).year, 0)} a year, and three children bring ${g(s(3).fourWeekly)} a payment. There is no cap on the number of children and no earnings test of its own: the gate is the qualifying benefit, so a working family on a small Universal Credit award gets the full amount. Income-based Jobseeker’s Allowance also qualifies, as do Pension Credit, Income Support and income-related ESA when the applicant is named on the award. The payment does not reduce any UK or Scottish benefit, and Child Benefit on its own does not qualify.`,
  faqs: [
    { q: 'Can I get Scottish Child Payment if I work full time?', a: `Yes, as long as you or your partner still receive Universal Credit, even a small amount after the earnings taper. Scottish Child Payment has no earnings limit of its own and is paid at the full ${g(SC.childPayment)} a week per child whatever the size of the Universal Credit award. If earnings rise enough to end Universal Credit altogether, the payment stops too, so report that change.` },
    { q: 'Does Scottish Child Payment affect Universal Credit or Child Benefit?', a: `No. mygov.scot states that it does not affect any other UK or Scottish Government benefit received by anyone in your household. Universal Credit ignores it, Child Benefit is paid as normal. For council allowances and grants, mygov.scot suggests checking with your local council.` },
    { q: 'Who should apply for Scottish Child Payment if we are a couple?', a: `Either partner can apply if the qualifying benefit is Universal Credit or income-based JSA. With Pension Credit, Income Support or income-related ESA, the person named on that benefit must apply. The applicant must be the main person looking after the child, and the child must be named on a Child Benefit, Universal Credit or Pension Credit claim of either partner.` },
    { q: 'Is Scottish Child Payment stopped if I have a Universal Credit sanction?', a: `No. A sanction or deduction on your Universal Credit does not affect the decision on Scottish Child Payment, and you can still apply. If a sanction starts while you are being paid, tell Social Security Scotland and send a copy of the Universal Credit statement or DWP letter, because you may still meet the conditions.` },
    { q: 'What happens to Scottish Child Payment when my child turns 16?', a: `It ends for that child, since the payment covers children under ${SC.scpAgeLimit} only, while it continues for any younger brothers and sisters at the same weekly rate. There is no extension for staying on at school, although Child Benefit carries on if they remain in approved education. Keep your details up to date so the younger children’s payments continue without a gap.` },
  ],
  body: (h) => `
<h2>How much it pays, by family size</h2>
<p>Every child counts the same: there is no higher rate for the eldest and no limit on how many children are included.</p>
${h.table(['Children under 16', 'A week', 'Every 4 weeks', 'A year (52 weeks)'], [1, 2, 3, 4, 5].map((n) => [String(n), h.gbp(s(n).weekly, 2), h.gbp(s(n).fourWeekly, 2), h.gbp(s(n).year, 2)]), 'Scottish Child Payment in 2026/27 (Scottish Government up-rating 2026-27; mygov.scot)', ['l', 'r', 'r', 'r'])}
<p>For a family with two children, Scottish Child Payment is worth more than Child Benefit: ${h.gbp(s(2).weekly, 2)} a week against ${h.gbp(childBenefitWeekly(2), 2)}. Put together, the two payments give a couple on Universal Credit with two children ${h.gbp(s(2).weekly + childBenefitWeekly(2), 2)} a week before Universal Credit itself is counted, and none of it reduces the Universal Credit award.</p>
<p>Take a lone father in Dundee with children aged 4, 9 and 13, working 25 hours a week and receiving a Universal Credit top-up of a few hundred pounds a month. He gets ${h.gbp(s(3).fourWeekly, 2)} of Scottish Child Payment every four weeks. If a pay rise trims his Universal Credit to a small sum, the Scottish payment stays the same; only if Universal Credit ends completely does it stop.</p>
<p>The ${h.src('scotUprating', 'Scottish Government’s up-rating report')}, published on 2 February 2026, raised all its devolved benefits by ${h.pct(P.upratingCPI, 1)}, the Consumer Prices Index for September 2025. That took Scottish Child Payment from ${h.gbp(SC.childPaymentPrev, 2)} to ${h.gbp(SC.childPayment, 2)}, which is ${h.gbp(rise * 52, 2)} a year more per child.</p>

<h2>The qualifying benefits</h2>
<p>You must live in Scotland, be the main person looking after a child under ${SC.scpAgeLimit}, and you or your partner must receive a qualifying benefit. ${h.src('scotScpWho', 'mygov.scot')} splits the list in two.</p>
${h.table(['Benefit', 'Who must be named on it'], [
  ['Universal Credit', 'You or your partner'],
  ['Income-based Jobseeker’s Allowance', 'You or your partner'],
  ['Pension Credit', 'You alone (otherwise your partner applies)'],
  ['Income Support', 'You alone (otherwise your partner applies)'],
  ['Income-related Employment and Support Allowance', 'You alone (otherwise your partner applies)'],
], 'Benefits accepted for Scottish Child Payment (mygov.scot)', ['l', 'l'])}
<p>Child Benefit alone is not enough, nor are PIP, Carer’s Allowance or contribution-based benefits, unless the household also gets one of the benefits in the table. If you have applied for a qualifying benefit and are waiting for a decision, you can apply for Scottish Child Payment at the same time rather than waiting. A benefit from an EEA country or Switzerland may also count; Social Security Scotland decides case by case.</p>

<h2>The main person looking after the child</h2>
<p>The applicant must be the main carer: a birth parent, the parent’s partner if they live together as a couple, or a kinship carer. To show this, the child must be named on your or your partner’s claim for Child Benefit, Universal Credit or Pension Credit. A kinship carer can instead send a copy of a legal order, such as a Kinship Care Order, Residence Order or Guardianship Order, or a written kinship care agreement with the council.</p>
<p>Only one person can receive the payment for a child. When two people apply for the same child, for example separated parents who share care, Social Security Scotland follows its double claims process, which depends on the benefits each of them receives.</p>

<h2>Applying</h2>
<p>Applications are made online, by phone on 0800 182 2222 (8am to 5pm, Monday to Friday) or on a paper form. The online form takes 10 to 20 minutes and cannot be saved halfway. You need your name, date of birth, address and National Insurance number, the names and dates of birth of the children, your partner’s details and National Insurance number, and your bank details if you have an account. Interpreters are available in more than 100 languages by phone.</p>
<p>The same form covers the ${h.a('best-start-grant', 'Best Start Grant and Best Start Foods')}, and families already receiving Scottish Child Payment are checked automatically for the Early Learning Payment and School Age Payment of ${h.gbp(SC.bsgEarlyLearning, 2)} each, as ${h.src('scotBsgAuto', 'Social Security Scotland explains')}. Pregnancy and Baby Payment and Best Start Foods still need an application.</p>

<h2>What Scottish Child Payment unlocks</h2>
<p>Receiving the payment is itself a passport to other help. In primary 6 and 7, a child whose family gets Scottish Child Payment qualifies for ${h.a('free-school-meals', 'free school meals')} without the Universal Credit earnings test of ${h.gbp(P.schoolMeals.scotUcEarnedMonthly)} a month that otherwise applies, as ${h.src('scotSchoolMeals', 'mygov.scot sets out')}. Families on the qualifying benefits can also ask the council about help in the school holidays. The ${h.a('benefits-in-scotland', 'guide to benefits in Scotland')} lists the other Social Security Scotland payments, including Child Disability Payment and ${h.a('adult-disability-payment-scotland', 'Adult Disability Payment')}.</p>

<h2>Changes you must report</h2>
<p>Tell Social Security Scotland straight away if you move outside Scotland, stop looking after a child, start or stop living with a partner, or stop getting the qualifying benefit. Not reporting a change you have been asked to report is an offence under section 72 of the Social Security (Scotland) Act 2018, and overpaid money can be recovered. Also report a new child you start looking after, so they are added, and changes of name, address or bank details.</p>
`,
});
