import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { scottishCarerPackage } from '../../lib/engine/carers-extra';
import { formatMoney } from '../../lib/format';

const S = P.scotland;
const CA = P.carers;
const g = (n: number, d = 2) => formatMoney(n, d);
const one = scottishCarerPackage({ overlapping: 0, additionalPeople: 0 });
const two = scottishCarerPackage({ overlapping: 0, additionalPeople: 1 });
// Mygov.scot example: £60 a week from an overlapping benefit such as Incapacity Benefit.
const ib = scottishCarerPackage({ overlapping: 60, additionalPeople: 0 });
const pensioner = scottishCarerPackage({ overlapping: P.statePension.newFull, additionalPeople: 1 });

export default definePage({
  id: 'carer-support-payment-scotland',
  group: 'carers',
  order: 60,
  mini: 'scotCarerPackage',
  miniHref: 'carers-allowance-calculator',
  related: ['carers-allowance', 'adult-disability-payment-scotland', 'carers-allowance-and-state-pension', 'carers-credit', 'benefits-in-scotland'],
  sources: ['scotCsp', 'scotCspWho', 'scotCspOverlap', 'scotCspEffect', 'scotCspWork', 'scotCas', 'scotUprating'],
  slug: 'carer-support-payment-scotland',
  nav: 'Carer Support Payment (Scotland)',
  card: `Scotland’s carer package: ${g(S.carerSupport)} plus a ${g(S.carerSupplement)} supplement and ${g(S.carerAdditionalPerson)} for each extra person cared for.`,
  title: 'Carer Support Payment 2026/27: Scotland’s Carer Package',
  description: `Carer Support Payment 2026/27: ${g(S.carerSupport)} a week in Scotland, plus ${g(S.carerSupplement)} Scottish Carer Supplement and ${g(S.carerAdditionalPerson)} for each extra person you care for, paid together.`,
  h1: 'Carer Support Payment: the three Scottish carer payments, explained',
  intro: 'One application, up to three payments, and a supplement that replaced the twice-yearly Carer’s Allowance Supplement for most carers.',
  resume: `In Scotland, unpaid carers apply to Social Security Scotland rather than the DWP. The package, called Carer Support, has three parts. Carer Support Payment replaces Carer’s Allowance at the same ${g(S.carerSupport)} a week in 2026/27, for caring at least ${CA.hoursPerWeek} hours a week for someone on a qualifying disability benefit. The Scottish Carer Supplement of ${g(S.carerSupplement)} a week is added automatically, and Carer Additional Person Payment adds ${g(S.carerAdditionalPerson)} a week for each further person you care for at least ${S.cappHours} hours a week. A carer looking after one person therefore gets ${g(one.weekly)} a week, ${g(one.fourWeekly)} every four weeks; with a second person, ${g(two.weekly)}. Take-home pay must be ${g(CA.earningsLimit, 0)} a week or less. Overlapping benefits such as the State Pension reduce Carer Support Payment, and a ${g(0)} award carries neither extra. Universal Credit is reduced by Carer Support Payment but not by the other two. The old Carer’s Allowance Supplement of ${g(S.cas)} twice a year now goes only to a few carers.`,
  faqs: [
    { q: 'How much does a carer in Scotland get altogether in 2026/27?', a: `For one person cared for, ${g(one.weekly)} a week: Carer Support Payment of ${g(S.carerSupport)} plus the Scottish Carer Supplement of ${g(S.carerSupplement)}. That is ${g(one.fourWeekly)} every four weeks, paid in one sum. Each additional person cared for at least ${S.cappHours} hours a week adds ${g(S.carerAdditionalPerson)} a week, or ${g(S.carerAdditionalPerson * 4)} every four weeks.` },
    { q: 'I care for my son and my mother: can I get Carer Additional Person Payment?', a: `Yes, if both get a qualifying benefit and you meet the conditions for Carer Support Payment for one of them. You must care for the second person at least ${S.cappHours} hours a week, and those hours can overlap with the time you spend with the first. Only one carer can get the additional person payment for the same person.` },
    { q: 'Does the Scottish Carer Supplement reduce my Universal Credit?', a: `No. Mygov.scot says the DWP does not count the Scottish Carer Supplement or Carer Additional Person Payment as income, so neither affects Universal Credit, Pension Credit or other benefits. Carer Support Payment itself is counted, and Universal Credit falls by the same amount, exactly as with Carer’s Allowance in England and Wales.` },
    { q: 'Why have I stopped getting the Carer’s Allowance Supplement in June and December?', a: `Because the Scottish Carer Supplement has replaced it for most carers: ${g(S.carerSupplement)} a week paid with every Carer Support Payment instead of two lump sums. Mygov.scot says anyone who gets the Scottish Carer Supplement does not get Carer’s Allowance Supplement. A small group, such as carers living abroad, still receive ${g(S.cas)} twice a year.` },
    { q: 'I get a State Pension: is there any point applying for Carer Support Payment?', a: `Often yes. With a State Pension above ${g(S.carerSupport)} a week the award will be ${g(0)}, which also means no supplement or additional person payment. But mygov.scot says it is still worth applying, because you may get more from other benefits. The obvious one is Pension Credit, where GOV.UK lists a carer amount of ${g(P.pensionCredit.carer)} a week for people with Carer Support Payment.` },
  ],
  body: (h) => `
<h2>The three payments in 2026/27</h2>
${h.table(['Payment', 'A week', 'Every 4 weeks', '2025/26 weekly rate', 'Counted by the DWP?'], [
  ['Carer Support Payment', h.gbp(S.carerSupport, 2), h.gbp(S.carerSupport * 4, 2), h.gbp(S.carerSupportPrev, 2), 'Yes'],
  ['Scottish Carer Supplement', h.gbp(S.carerSupplement, 2), h.gbp(S.carerSupplement * 4, 2), h.gbp(S.carerSupplementPrev, 2), 'No'],
  ['Carer Additional Person Payment, each person', h.gbp(S.carerAdditionalPerson, 2), h.gbp(S.carerAdditionalPerson * 4, 2), h.gbp(S.carerAdditionalPersonPrev, 2), 'No'],
], 'Carer Support from April 2026 (mygov.scot; Scottish Government up-rating report)', ['l', 'r', 'r', 'r', 'l'])}
<p>The ${h.src('scotUprating', 'Scottish Government’s up-rating report')} explains that Carer Support became one benefit with three components in March 2026, with the supplement and the additional person payment added to the existing Carer Support Payment. ${h.src('scotCsp', 'Mygov.scot')} adds that all three are paid together every ${h.num(S.cspPaidEveryWeeks)} weeks, at the end of the four weeks, into a UK bank account; carers who are terminally ill, or who care for someone who is, can be paid weekly in advance.</p>

<h2>Who can apply</h2>
<p>${h.src('scotCspWho', 'You must')} be ${h.num(CA.minAge)} or over and usually live in Scotland, or have lived in England, Wales, Ireland, the Channel Islands or the Isle of Man for at least ${h.num(S.cspResidenceWeeks)} of the last ${h.num(S.cspResidenceOutOf)} weeks. The person you care for must get a qualifying benefit at the right rate, such as Adult Disability Payment daily living, Pension Age Disability Payment, Child Disability Payment at the middle or highest care rate, or the equivalent DWP benefits. The care must be unpaid: care workers and volunteers through a charity scheme cannot claim for that work. You cannot get Carer Support Payment if someone else already gets Carer’s Allowance or the Universal Credit carer element for the same person, though another carer’s Carer Additional Person Payment or Young Carer Grant for that person does not stop you.</p>
<p>${h.src('scotCspWork', 'The earnings limit')} is ${h.gbp(CA.earningsLimit)} a week of take-home pay after tax, National Insurance and certain expenses, about ${h.gbp(CA.earningsLimit * 52 / 12)} a month. Social Security Scotland can average earnings that go up and down, over a repeating pattern or over 13 weeks, so an occasional week above the limit is not automatically fatal. Pensions, other benefits, student support and fostering payments are not earnings. On study, part-time students under ${h.num(S.cspStudyHours)} hours a week qualify, and full-time students can too if they are 20 or over or, at 16 to 19, are in higher education.</p>

<h2>Caring for more than one person</h2>
<p>Carer Additional Person Payment is the most distinctive part of the Scottish system: Carer’s Allowance pays nothing extra for a second person. You must get Carer Support Payment, and care for each additional person at least ${h.num(S.cappHours)} hours a week, which can be the same hours you spend with the first. A mother caring for her disabled son and for her own father, who gets Pension Age Disability Payment, receives ${h.gbp(two.weekly, 2)} a week instead of ${h.gbp(one.weekly, 2)}. Two carers in one household can split things: one gets Carer Support Payment for a child, the other Carer Additional Person Payment for the same child, but never two of the same payment.</p>

<h2>Overlapping benefits and the ${h.gbp(0)} award</h2>
<p>${h.src('scotCspOverlap', 'Mygov.scot lists the benefits')} that reduce Carer Support Payment because they also replace income: the State Pension, Maternity Allowance, New Style ESA and JSA, Incapacity Benefit, Severe Disablement Allowance, Widowed Parent’s Allowance and a few war and industrial payments. Personal and workplace pensions do not. With ${h.gbp(60)} a week of Incapacity Benefit, Carer Support Payment is cut to ${h.gbp(ib.csp, 2)}, the supplement is still paid, and the carer receives ${h.gbp(ib.weekly, 2)} from Social Security Scotland on top of the ${h.gbp(60)}.</p>
<p>Once the overlapping benefit reaches ${h.gbp(S.carerSupport, 2)}, Carer Support Payment is awarded at ${h.gbp(0)}, an underlying entitlement, and then neither the supplement nor the additional person payment is paid. A pensioner on the full new State Pension who cares for two people gets ${h.gbp(pensioner.weekly, 2)} from the package. The award still matters for Pension Credit, as ${h.a('carers-allowance-and-state-pension', 'Carer’s Allowance and the State Pension')} explains for the identical rule south of the border.</p>

<h2>Universal Credit and backdated first payments</h2>
<p>${h.src('scotCspEffect', 'Carer Support Payment is counted as income')} for Universal Credit, Income Support, income-based JSA, income-related ESA and Pension Credit, and the DWP reduces those benefits by the same amount. The first payment is always backdated to your requested start date and arrives as a lump sum, and the DWP can take time to adjust. Universal Credit claimants are therefore likely to be overpaid for a while and will repay it through deductions. Claimants of the four older income-related benefits can choose, when applying, to reduce their first Carer Support Payment so that no overpayment builds up. Mygov.scot stresses that carers usually end up better off overall, because the supplement and the additional person payment are not counted.</p>

<h2>Carer’s Allowance Supplement: who still gets it</h2>
<p>${h.src('scotCas', 'Carer’s Allowance Supplement')} is now paid only to a small number of carers who do not get the Scottish Carer Supplement, for example carers living abroad, or people who were 65 or over in 2002 and still get Carer’s Allowance. Each of the two 2026 payments is ${h.gbp(S.cas, 2)}, up from ${h.gbp(S.casPrev, 2)}. The June payment went to those getting Carer Support Payment or Carer’s Allowance on ${h.date(S.casJuneQualifying)}; the December payment goes to those getting either on ${h.date(S.casDecemberQualifying)}. Social Security Scotland writes to everyone due a payment, and it does not affect other benefits.</p>

<h2>Moving into or out of Scotland</h2>
<p>A carer on Carer’s Allowance who moves from England or Wales to Scotland must tell the DWP and apply for Carer Support Payment: Carer’s Allowance stops ${h.num(CA.moveStopWeeks)} weeks after the move. In the other direction, report the move to Social Security Scotland and claim ${h.a('carers-allowance', 'Carer’s Allowance')} straight away. If the person you care for also moves, their own disability benefit has to be reclaimed too, and a gap in it can interrupt your carer payments; ${h.a('adult-disability-payment-scotland', 'Adult Disability Payment')} explains their side.</p>
`,
});
