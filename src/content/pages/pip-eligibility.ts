import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { pipRequiredPeriod } from '../../lib/engine/disability-extra';
import { formatMoney, displayDate } from '../../lib/format';

const pip = P.pip;
const g = (n: number, d = 2) => formatMoney(n, d);
const d = (iso: string) => displayDate(iso, 'en-GB');
const total = pip.qualifyMonthsPast + pip.qualifyMonthsFuture;
// Worked example: difficulties since a stroke on 20 July 2026.
const stroke = pipRequiredPeriod('2026-07-20');

export default definePage({
  id: 'pip-eligibility',
  group: 'disability',
  order: 40,
  mini: 'pipQualify',
  miniHref: 'pip-points-calculator',
  related: ['pip-points-calculator', 'pip-rates', 'pip-payment-dates', 'attendance-allowance', 'dla-for-children', 'adult-disability-payment-scotland'],
  sources: ['govPipElig', 'pipRegs12', 'pipRegs16', 'govPipClaim', 'govMr', 'govPip'],
  slug: 'pip-eligibility',
  nav: 'PIP eligibility',
  card: 'Age, the 3 plus 9 months time test, residence, how to claim and how to challenge a decision.',
  title: 'PIP Eligibility 2026/27: Age, Time Test and Residence Rules',
  description: `PIP eligibility 2026/27: aged ${pip.minAge} to State Pension age, difficulties for ${pip.qualifyMonthsPast} months and expected for ${pip.qualifyMonthsFuture} more, ${pip.residenceWeeks} of the last ${pip.residenceOutOfWeeks} weeks spent in Great Britain.`,
  h1: 'PIP eligibility: the conditions to meet before the points count',
  intro: 'Four gates come before the assessment: age, time, residence and the other benefits you get.',
  resume: `To start a claim for Personal Independence Payment you must be aged ${pip.minAge} or over and, for a new claim, under State Pension age. You need a long-term physical or mental health condition or disability that makes everyday tasks or getting around difficult, and the difficulty has to pass a time test: present for the ${pip.qualifyMonthsPast} months before the award starts and expected to last at least ${pip.qualifyMonthsFuture} months after it, ${total} months in all. You must normally live in England or Wales when you claim, have been in Great Britain for ${pip.residenceWeeks} of the last ${pip.residenceOutOfWeeks} weeks, roughly two of the last three years, and be habitually resident with no immigration restriction on public funds. Income, savings and work do not matter. Only then do the points decide the rate. Claims start by phone, an award lasts from ${pip.awardMinMonths} months to ${pip.awardMaxYears} years, and a refusal must be challenged by mandatory reconsideration within one month before any appeal.`,
  faqs: [
    { q: 'I get DLA and have just turned 16: do I need to claim PIP?', a: `Yes. GOV.UK says the DWP writes shortly after the 16th birthday inviting a PIP claim, and DLA stops unless the claim is made by the date in the letter. If it is, DLA continues until the PIP claim is assessed. A parent can apply to act as appointee if the young person cannot manage the claim themselves.` },
    { q: 'Can I claim PIP if I have a full-time job and savings?', a: `Yes. PIP is not means-tested: earnings, savings and a partner’s income are all ignored, and you can stay in work while claiming. What matters is how your condition affects the twelve activities. Working can still be relevant as evidence, for instance if your employer has made adjustments that show the help you need.` },
    { q: 'I reach State Pension age next year: is it too late to start a PIP claim?', a: `No, but claim before the birthday. Once you are over State Pension age you cannot usually make a new PIP claim and Attendance Allowance, which has no mobility part, becomes the benefit to claim. The exception is someone who had PIP or Adult Disability Payment in the last ${pip.reclaimAfterSpaMonths} months, who can claim PIP again.` },
    { q: 'How long do I get to send back the PIP form about my condition?', a: `One month. After the phone call the DWP sends the “How your disability affects you” form, by email link or by post, usually within two weeks. GOV.UK asks for it back within ${pip.formReturnMonths} month, with prescription lists, care plans or letters from people who support you. If you need longer, ring the PIP enquiry line before the deadline.` },
    { q: 'I have just come back to live in England after years abroad: when can I claim PIP?', a: `Usually once you have been in Great Britain for ${pip.residenceWeeks} of the last ${pip.residenceOutOfWeeks} weeks, about two years, under regulation 16. People returning from the EU, Switzerland, Norway, Iceland or Liechtenstein may be able to claim sooner, and refugees and people with humanitarian protection may qualify without meeting it.` },
  ],
  body: (h) => `
<h2>Age: who claims PIP and who claims something else</h2>
<p>PIP is the disability benefit for working-age adults. The lower limit is the ${h.num(pip.minAge)}th birthday: children below it claim ${h.a('dla-for-children', 'Disability Living Allowance for children')}, and a young person already on DLA is invited to move across at 16. The upper limit is written for new claims. Someone over that age without a recent award claims ${h.a('attendance-allowance', 'Attendance Allowance')} instead, unless they had PIP or Adult Disability Payment within the last ${h.num(pip.reclaimAfterSpaMonths)} months. People born on or before ${h.date(pip.dlaKeptBornOnOrBefore)} who still receive DLA keep it and are not moved to PIP.</p>

<h2>The time test in regulation 12</h2>
<p>PIP is for lasting difficulties, and ${h.src('pipRegs12', 'regulation 12')} turns that into dates. Looking back, you must have had the difficulties for the ${h.num(pip.qualifyMonthsPast)} months ending with the date the award would start. Looking forward, they must be likely to continue for the ${h.num(pip.qualifyMonthsFuture)} months after it. Both halves apply to the same rate: if your needs only reached the enhanced level recently, the enhanced rate waits until that level has lasted ${h.num(pip.qualifyMonthsPast)} months too.</p>
<p>Take someone who had a stroke on ${h.date('2026-07-20')} and has needed help to wash, dress and cook since. The backward test is met on ${d(stroke.qualifyFrom)}; the difficulties must be expected to continue to ${d(stroke.mustLastUntil)}. He can start the claim in August, while still recovering, but PIP cannot be paid for any day before the backward test is met. If his doctors expect a full recovery by Christmas, the forward test fails and PIP is not payable, however severe the needs are today.</p>
<p>Under the special rules for end of life, when a doctor or other medical professional has said you may have ${h.num(pip.endOfLifeMonths)} months or less to live, neither half applies. The claim goes through quickly with form SR1, without a face-to-face assessment, and the enhanced daily living rate of ${h.gbp(pip.dailyEnhanced, 2)} is paid automatically.</p>

<h2>Residence and presence</h2>
<p>${h.src('pipRegs16', 'Regulation 16')} sets four conditions on every day of the claim: being present in England or Wales, having been present in Great Britain for at least ${h.num(pip.residenceWeeks)} of the ${h.num(pip.residenceOutOfWeeks)} weeks before, being habitually resident in the UK, Ireland, the Isle of Man or the Channel Islands, and not being subject to immigration control. Most British citizens who have lived here all along meet them without thinking. They matter to people who have recently arrived or come back, to EU citizens, who also need settled or pre-settled status, and to anyone planning a long stay abroad: a trip of more than ${h.num(pip.abroadReportWeeks)} weeks must be reported before you go.</p>
${h.table(['Condition', 'Rule in 2026/27', 'Where it comes from'], [
  ['Age at claim', `${pip.minAge} to State Pension age`, 'GOV.UK eligibility'],
  ['Time before the award', `${pip.qualifyMonthsPast} months of difficulty`, 'Regulation 12'],
  ['Time after the award', `Expected to last ${pip.qualifyMonthsFuture} more months`, 'Regulation 12'],
  ['Past presence', `${pip.residenceWeeks} of the last ${pip.residenceOutOfWeeks} weeks in Great Britain`, 'Regulation 16'],
  ['Where you live', 'England or Wales (Scotland: ADP)', 'Regulation 16 and GOV.UK'],
  ['Income and savings', 'Ignored', 'GOV.UK'],
  ['Points', `${pip.thresholdStandard} for standard, ${pip.thresholdEnhanced} for enhanced, per part`, 'Regulations 5 and 6'],
], 'PIP entry conditions', ['l', 'l', 'l'])}

<h2>Other benefits that block or reduce PIP</h2>
<p>PIP can be paid with every other benefit except Armed Forces Independence Payment. Two older payments interact with it: Constant Attendance Allowance reduces the daily living part, and War Pensioners’ Mobility Supplement replaces the mobility part. Universal Credit, ESA, Carer’s Allowance paid to someone else and the State Pension leave PIP untouched. In the other direction PIP can raise them, which ${h.a('universal-credit-and-pip', 'PIP and Universal Credit')} explains.</p>

<h2>Making the claim, step by step</h2>
<ol>
<li>Phone the PIP new claims line and answer basic questions about yourself and your condition, or write to Freepost DWP PIP 1 asking to start a claim.</li>
<li>Complete the “How your disability affects you” form online or on paper within ${h.num(pip.formReturnMonths)} month. Describe a bad day and an ordinary day for each activity, and say what happens if you try to do the task without help.</li>
<li>Attend an assessment if one is needed. It can be in person, at home, by phone or by video and usually lasts about an hour; you can bring someone with you, and the audio is recorded unless you opt out.</li>
<li>Wait for the decision letter. It lists the points for each activity, the rate of each part, the first payment date and the review date.</li>
</ol>

<h2>How long an award lasts, and challenging it</h2>
<p>${h.src('govPipClaim', 'GOV.UK says')} a first award lasts between ${h.num(pip.awardMinMonths)} months and ${h.num(pip.awardMaxYears)} years, depending on whether your needs are likely to change. Before it ends, a review form arrives; PIP continues while it is considered, and the outcome can raise, lower or stop the award.</p>
<p>If you think the points are wrong, the first step is always ${h.src('govMr', 'mandatory reconsideration')}, asked for within ${h.num(P.challenge.mrMonths)} month of the decision date (later only with a good reason, such as a stay in hospital). For PIP the decision letter already includes the written reasons, so you can go straight to explaining which descriptors you disagree with and why. Only after the reconsideration notice can you appeal to the independent tribunal. ${h.a('pip-points-calculator', 'The PIP points calculator')} helps you see which descriptors would change the rate.</p>
`,
});
