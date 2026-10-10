import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { computePensionCredit } from '../../lib/engine/pension';
import { formatMoney } from '../../lib/format';

const CA = P.carers;
const PC = P.pensionCredit;
const g = (n: number, d = 2) => formatMoney(n, d);
const year = CA.allowance * 52;
// Worked example: Maureen (81) has £232 a week of pensions and Attendance Allowance; her daughter Joanne cares for her.
const mumBefore = computePensionCredit({ couple: false, income: 232, severeDisability: 1 });
const mumAfter = computePensionCredit({ couple: false, income: 232, severeDisability: 0 });
// Tax example: carer aged 61 with an £11,000 occupational pension (not earnings for the test).
const taxable = 11000 + year - P.tax.personalAllowance;
const tax = Math.max(0, taxable) * P.tax.basicRate;

export default definePage({
  id: 'carers-allowance',
  group: 'carers',
  order: 20,
  mini: 'caHousehold',
  miniHref: 'carers-allowance-calculator',
  related: ['carers-allowance-calculator', 'carers-allowance-and-universal-credit', 'carers-allowance-and-state-pension', 'carers-credit', 'carer-support-payment-scotland', 'attendance-allowance'],
  sources: ['govCaOverview', 'govCa', 'govCaEffect', 'govCaClaim', 'govCaChanges', 'dwpRates', 'nidCa', 'govPc'],
  slug: 'carers-allowance',
  nav: 'Carer’s Allowance',
  card: `${g(CA.allowance)} a week for ${CA.hoursPerWeek} hours of care: who qualifies, the knock-on effects and how to claim.`,
  title: 'Carer’s Allowance 2026/27: Rate, Rules and Other Benefits',
  description: `Carer’s Allowance 2026/27: ${g(CA.allowance)} a week if you care ${CA.hoursPerWeek} hours for someone on a disability benefit and earn ${g(CA.earningsLimit, 0)} or less. Rules, tax, NI credits, side effects.`,
  h1: 'Carer’s Allowance: who can get it, and what it changes for both of you',
  intro: 'The main benefit for unpaid carers in England and Wales, and the knock-on effects worth checking before you claim.',
  resume: `Carer’s Allowance is ${g(CA.allowance)} a week in 2026/27 for someone who spends at least ${CA.hoursPerWeek} hours a week caring for a person who gets a qualifying disability benefit, such as the daily living part of PIP, the middle or highest care rate of DLA, or Attendance Allowance. You do not have to be related to them or live with them. You must be ${CA.minAge} or over, not in full-time education or studying ${CA.studyHoursLimit} hours a week or more, and earn no more than ${g(CA.earningsLimit, 0)} a week after tax, National Insurance and expenses. Only one person can claim for the same disabled person, and caring for two people does not double it. It is paid weekly in advance or every four weeks, it is taxable if your total income is above the Personal Allowance, and each week brings a Class 1 National Insurance credit. Claims can be backdated ${CA.backdateMonths} months. Before claiming, check the effect on the person you care for: their severe disability premium, or the ${g(PC.severeDisability)} severe disability amount in Pension Credit, usually stops.`,
  faqs: [
    { q: 'My brother and I share Dad’s care: can we both claim Carer’s Allowance for him?', a: `No. Only one person can get Carer’s Allowance for caring for the same person, and you cannot claim if someone else already gets Carer’s Allowance, Carer Support Payment or the Universal Credit carer element for him. Agree between you who claims; if you cannot, both can apply and the DWP decides. The other carer may qualify for Carer’s Credit instead.` },
    { q: 'I look after my mother and my aunt: is Carer’s Allowance paid for each of them?', a: `No. GOV.UK says you do not get paid extra if you care for more than one person, and the ${CA.hoursPerWeek} hours must be spent caring for one person who gets a qualifying benefit. Scotland is different: Carer Additional Person Payment adds ${g(P.scotland.carerAdditionalPerson)} a week for each extra person cared for at least ${P.scotland.cappHours} hours.` },
    { q: 'Do I have to live with the person I claim Carer’s Allowance for?', a: `No, and you do not have to be related either. A neighbour, friend or grandchild who spends ${CA.hoursPerWeek} hours a week caring for someone on a qualifying benefit can claim. Time spent shopping for them, managing bills, taking them to appointments or helping with washing and cooking all counts, wherever it happens.` },
    { q: 'Do I pay income tax on Carer’s Allowance?', a: `Yes, if your total taxable income is above the Personal Allowance of ${g(P.tax.personalAllowance, 0)}. The allowance itself, ${g(year, 0)} a year, fits within the Personal Allowance, so it is usually taxed only when added to a pension or earnings. A carer with an occupational pension of a few thousand pounds is the typical case.` },
    { q: 'Can a university student get Carer’s Allowance?', a: `Not while in full-time education. GOV.UK excludes full-time students and anyone studying ${CA.studyHoursLimit} hours a week or more. A part-time student under that threshold can claim. In Scotland, Carer Support Payment allows full-time students aged 20 or over and some younger students in higher education.` },
    { q: 'How far back can a Carer’s Allowance claim go?', a: `Up to ${CA.backdateMonths} months, if you met all the conditions during that time. The person you care for must already have been getting the qualifying benefit for those weeks. When a disability benefit is awarded after a long wait, claim Carer’s Allowance as soon as the decision letter arrives so the backdating covers as much as possible.` },
  ],
  body: (h) => `
<h2>The rate and how it is paid</h2>
${h.table(['Period', 'Amount in 2026/27'], [
  ['A week', h.gbp(CA.allowance, 2)],
  ['Every four weeks', h.gbp(CA.allowance * 4, 2)],
  ['A year (52 weeks)', h.gbp(year, 2)],
  ['Earnings limit, a week', h.gbp(CA.earningsLimit, 2)],
], 'Carer’s Allowance from April 2026 (DWP benefit and pension rates 2026 to 2027)', ['l', 'r'])}
<p>The weekly rate rose from ${h.gbp(CA.previous.allowance, 2)} and the earnings limit from ${h.gbp(CA.previous.earningsLimit)}. ${h.src('govCaOverview', 'GOV.UK says')} you can choose to be paid weekly in advance or every four weeks, into a bank or similar account.</p>

<h2>Three sets of conditions</h2>
<p>The person you care for must already get a qualifying benefit. You must spend at least ${h.num(CA.hoursPerWeek)} hours a week caring for them. And you must meet personal conditions about age, study, earnings and residence. All three apply every week.</p>
${h.table(['Benefit of the person cared for', 'Qualifying level'], [
  ['Personal Independence Payment', 'Daily living part, either rate'],
  ['Disability Living Allowance', 'Middle or highest care rate'],
  ['Attendance Allowance', 'Either rate'],
  ['Adult Disability Payment (Scotland)', 'Daily living, standard or enhanced'],
  ['Child Disability Payment, Scottish Adult DLA', 'Middle or highest care rate'],
  ['Pension Age Disability Payment', 'Either rate'],
  ['Constant Attendance Allowance', 'At or above the normal maximum (industrial injuries) or basic full-day rate (war pension)'],
  ['Armed Forces Independence Payment', 'Any award'],
], 'Qualifying benefits (GOV.UK, Carer’s Allowance eligibility)', ['l', 'l'])}
<p>The mobility part of PIP and the lowest care rate of DLA do not qualify. The ${h.num(CA.hoursPerWeek)} hours can include practical help such as cooking, washing, managing bills and shopping, and taking the person to appointments. ${h.src('govCa', 'The personal conditions')} add that you must have been in England, Scotland or Wales for ${h.num(CA.residenceYears)} of the last ${h.num(CA.residenceOutOfYears)} years (refugees excepted), normally live in England or Wales, not be subject to immigration control, and keep your earnings at or below ${h.gbp(CA.earningsLimit)} a week after deductions, which ${h.a('carers-allowance-calculator', 'the Carer’s Allowance calculator')} works through.</p>

<h2>The effect on the person you care for</h2>
<p>This is the part most families miss. ${h.src('govCaEffect', 'GOV.UK warns')} that when you get Carer’s Allowance, the person you care for will usually stop getting a severe disability premium paid with their benefits, or the extra amount for severe disability in Pension Credit, and may lose a Council Tax reduction. Their disability benefit itself is never affected.</p>
<p>Maureen, 81, lives alone on ${h.gbp(232)} a week of pensions and gets Attendance Allowance. Her Pension Credit includes the severe disability amount, so she receives ${h.gbp(mumBefore.guarantee, 2)} a week. If her daughter Joanne claims Carer’s Allowance for caring for her, Maureen’s Pension Credit falls to ${h.gbp(mumAfter.guarantee, 2)}, a loss of ${h.gbp(mumBefore.guarantee - mumAfter.guarantee, 2)}. Joanne gains ${h.gbp(CA.allowance, 2)}, plus National Insurance credits. Across the family the cash is almost a wash, so the decision often turns on Joanne’s own situation: whether she needs the credits for her State Pension, whether the allowance reduces her Universal Credit, and whether Maureen would also lose Pension Credit-linked help. Ask the Pension Service or the council to confirm the figures before claiming. ${h.a('attendance-allowance', 'Attendance Allowance')} explains Maureen’s side.</p>

<h2>The effect on your own benefits</h2>
<p>GOV.UK says your total benefit payments usually go up or stay the same. In practice:</p>
<ul>
<li>Universal Credit is reduced by the whole allowance, while the carer element is added whether you claim Carer’s Allowance or not. ${h.a('carers-allowance-and-universal-credit', 'Carer’s Allowance and Universal Credit')} shows the sums.</li>
<li>Over State Pension age, the allowance overlaps with the State Pension, but an underlying entitlement adds ${h.gbp(PC.carer, 2)} a week to Pension Credit. See ${h.a('carers-allowance-and-state-pension', 'Carer’s Allowance and the State Pension')}.</li>
<li>Anyone getting Carer’s Allowance is outside the benefit cap.</li>
<li>Tax credit claimants must tell HMRC.</li>
</ul>

<h2>Tax and National Insurance</h2>
<p>Carer’s Allowance is taxable, though on its own, ${h.gbp(year)} a year, it is well inside the Personal Allowance of ${h.gbp(P.tax.personalAllowance)}. Tax arises when it is added to other income. A carer aged 61 with an ${h.gbp(11000)} occupational pension, which does not count against the earnings limit, has total income of about ${h.gbp(11000 + year)} and pays basic-rate tax of roughly ${h.gbp(tax)} a year on the excess. Every week of Carer’s Allowance also brings a Class 1 National Insurance credit automatically, which counts towards the State Pension and some other benefits; carers who do not qualify for the allowance can often protect their record with ${h.a('carers-credit', 'Carer’s Credit')} instead.</p>

<h2>Breaks in caring</h2>
<p>${h.src('govCaChanges', 'Carer’s Allowance can continue')} through a temporary break, meaning any week in which you care for fewer than ${h.num(CA.hoursPerWeek)} hours, as long as the person keeps their disability benefit. You must tell the DWP if you or they will be in hospital, a nursing home or respite care for more than ${h.num(CA.hospitalBreakWeeks)} weeks, or if you stop caring for more than ${h.num(CA.otherBreakDays)} days for any other reason. Report also a new job, a change in earnings, starting a course, a move, or the death of the person you care for.</p>

<h2>Claiming</h2>
<p>Apply online on GOV.UK, or by post with a form from the Carer’s Allowance Unit on 0800 731 0297. ${h.src('govCaClaim', 'You will need')} your National Insurance number (and your partner’s), bank details, your latest payslip or P45, course details if you study, and the date of birth, address and National Insurance number of the person you care for (their DLA reference for a child under 16). A claim can be backdated by up to ${h.num(CA.backdateMonths)} months. If you disagree with a decision, ask for mandatory reconsideration within ${h.num(P.challenge.mrMonths)} month.</p>

<h2>Scotland and Northern Ireland</h2>
<p>Carers in Scotland apply to Social Security Scotland for ${h.a('carer-support-payment-scotland', 'Carer Support Payment')}, at the same ${h.gbp(CA.allowance, 2)} but with the Scottish Carer Supplement on top. Moving from England or Wales to Scotland, Carer’s Allowance stops ${h.num(CA.moveStopWeeks)} weeks after the move, so apply for Carer Support Payment straight away. In Northern Ireland, Carer’s Allowance has the same weekly rate and is claimed through ${h.src('nidCa', 'nidirect')}.</p>
`,
});
