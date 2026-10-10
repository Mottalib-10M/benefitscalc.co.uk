import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { aaWithPensionCredit, aaQualifyFrom } from '../../lib/engine/disability-extra';
import { formatMoney, displayDate } from '../../lib/format';

const AA = P.aa;
const PC = P.pensionCredit;
const g = (n: number, d = 2) => formatMoney(n, d);
// Worked example: widow, State Pension and a small works pension of £245 a week in all, lower rate.
const ex = aaWithPensionCredit({ rate: 'lower', weeklyIncome: 245, carerPaid: false });
// Same woman once her son claims Carer's Allowance for looking after her.
const exCarer = aaWithPensionCredit({ rate: 'lower', weeklyIncome: 245, carerPaid: true });
const onset = aaQualifyFrom('2026-05-12');

export default definePage({
  id: 'attendance-allowance',
  group: 'disability',
  order: 50,
  mini: 'aaPension',
  miniHref: 'pension-credit-calculator',
  related: ['pension-credit', 'pension-credit-calculator', 'carers-allowance', 'pip-eligibility', 'housing-benefit', 'carers-allowance-and-state-pension'],
  sources: ['govAa', 'govAaElig', 'govAaClaim', 'dwpRates', 'govPc', 'scotPadp', 'nidAa'],
  slug: 'attendance-allowance',
  nav: 'Attendance Allowance',
  card: 'Two weekly rates for people over State Pension age who need care, and the Pension Credit it can unlock.',
  title: 'Attendance Allowance 2026/27: Rates, Rules and How to Claim',
  description: `Attendance Allowance 2026/27: ${g(AA.lower)} or ${g(AA.higher)} a week over State Pension age if you need care. Not means-tested, and it can add ${g(PC.severeDisability)} to Pension Credit.`,
  h1: 'Attendance Allowance: what it pays, who gets it and what it unlocks',
  intro: 'A weekly payment for care needs after State Pension age, whatever your income or savings.',
  resume: `Attendance Allowance is paid to people over State Pension age whose illness or disability means they need help with personal care or someone to keep an eye on them. In 2026/27 it pays ${g(AA.lower)} a week at the lower rate, for frequent help or constant supervision during the day, or supervision at night, and ${g(AA.higher)} at the higher rate, for help or supervision both day and night, or when a doctor has said you may be nearing the end of life. You must normally have needed the help for ${AA.needMonths} months. It is not means-tested, so pensions, savings and the value of your home are irrelevant, and you do not need a carer to claim. It covers care, not getting around. An award often matters even more for what follows: Pension Credit can rise by a severe disability amount of ${g(PC.severeDisability)} a week, and Housing Benefit or Council Tax Reduction can go up. In Scotland, new claims are for Pension Age Disability Payment at the same rates.`,
  faqs: [
    { q: 'Can I get Attendance Allowance if I live alone and nobody actually helps me?', a: `Yes. The test is the help you need, not the help you receive. GOV.UK says you do not have to have someone caring for you to claim. A person who struggles to wash safely, forgets medication or falls at night may qualify even if they manage alone at the cost of skipped meals or unsafe bathing. Describe what happens without help, not only what others do.` },
    { q: 'Does Attendance Allowance reduce Pension Credit or Housing Benefit?', a: `No, it works the other way. Attendance Allowance is ignored as income for Pension Credit, Housing Benefit and Council Tax Reduction. It can also add the severe disability amount of ${g(PC.severeDisability)} a week to the Pension Credit appropriate amount, which can create an entitlement where there was none and with it maximum Housing Benefit.` },
    { q: 'Will my son’s Carer’s Allowance claim cut the Pension Credit I get with Attendance Allowance?', a: `It usually will. GOV.UK warns that when someone gets Carer’s Allowance for looking after you, the extra amount for severe disability in your Pension Credit normally stops. Your son gains ${g(P.carers.allowance)} a week and National Insurance credits; you may lose ${g(PC.severeDisability)}. Ask the Pension Service to work out both sides before he claims.` },
    { q: 'Can I keep Attendance Allowance after moving into a care home?', a: `It depends on who pays. You cannot usually get Attendance Allowance while living in a care home where the local authority pays for your care. If you pay all the fees yourself, you can still claim and keep it. A move into a care home, a stay in hospital or a change in how the fees are funded must be reported to the helpline straight away.` },
    { q: 'How soon after applying will I hear about my Attendance Allowance claim?', a: `GOV.UK says you will get a text or letter within ${AA.contactWeeks} weeks explaining when to expect a decision; no fixed decision time is published. The award runs from the claim date: the day you apply online, the day the DWP receives a posted form, or the day you rang for a form if you return it within ${AA.formReturnWeeks} weeks.` },
    { q: 'Does Attendance Allowance help with getting out of the house?', a: `No. It has no mobility part, unlike PIP, and the rate depends only on care and supervision needs. If walking is your main difficulty and you are still under State Pension age, PIP is the benefit with a mobility part. After that age, help with getting about comes from local schemes, such as a Blue Badge or community transport, which your council runs.` },
  ],
  body: (h) => `
<h2>The two rates and the care behind them</h2>
<p>Attendance Allowance has no points table. The DWP looks at the attention you need with bodily functions, such as washing, dressing, eating, using the toilet or taking medication, and at the supervision you need to stay safe. ${h.src('govAa', 'GOV.UK')} sums up each rate in a line:</p>
${h.table(['Rate', 'A week', 'Every four weeks', 'Level of help needed'], [
  ['Lower', h.gbp(AA.lower, 2), h.gbp(AA.lower * 4, 2), 'Frequent help or constant supervision during the day, or supervision at night'],
  ['Higher', h.gbp(AA.higher, 2), h.gbp(AA.higher * 4, 2), 'Help or supervision throughout both day and night, or nearing the end of life'],
], 'Attendance Allowance rates from April 2026 (DWP benefit and pension rates 2026 to 2027)', ['l', 'r', 'r', 'l'])}
<p>The rates rose from ${h.gbp(AA.previous.lower, 2)} and ${h.gbp(AA.previous.higher, 2)} in April 2026. Over a year the lower rate is worth about ${h.gbp(AA.lower * 52)}, the higher rate about ${h.gbp(AA.higher * 52)}. Night needs are what usually separate the two: someone who needs help getting to the toilet twice a night, or who wanders and needs watching, has night needs as well as day needs and may qualify for the higher rate.</p>

<h2>Who can claim</h2>
<p>${h.src('govAaElig', 'The eligibility page')} lists the conditions. You must have reached State Pension age and have a physical disability (including sensory loss such as blindness), a mental disability (including learning difficulties) or a health condition severe enough that you need help caring for yourself or someone to supervise you for your own or others’ safety. You must have needed that help for at least ${h.num(AA.needMonths)} months: someone whose needs began on ${h.date('2026-05-12')} can be paid from ${h.date(onset)} at the earliest, though the claim can go in sooner.</p>
<p>You must also be in Great Britain when you claim, have been here for at least ${h.num(AA.residenceYears)} of the last ${h.num(AA.residenceOutOfYears)} years (refugees and people with humanitarian protection are exempt), be habitually resident in the UK, Ireland, the Isle of Man or the Channel Islands, and not be subject to immigration control. You cannot get it alongside DLA, PIP, Adult Disability Payment, Scottish Adult DLA or Armed Forces Independence Payment: those already cover care needs.</p>

<h2>How it raises Pension Credit</h2>
<p>This is where an award can be worth far more than its face value. Attendance Allowance is not counted as income for ${h.a('pension-credit', 'Pension Credit')}, and it is one of the benefits that brings in the severe disability amount of ${h.gbp(PC.severeDisability, 2)} a week, ${h.src('govPc', 'according to GOV.UK')}. That amount is added to the guarantee, so a pensioner whose income was just too high can suddenly qualify.</p>
<p>A widow with ${h.gbp(245)} a week from her State Pension and a small works pension is above the single guarantee of ${h.gbp(PC.guaranteeSingle, 2)} and gets no Pension Credit (${h.gbp(ex.pcBefore, 2)}). Awarded the lower rate of Attendance Allowance, her appropriate amount becomes ${h.gbp(PC.guaranteeSingle + PC.severeDisability, 2)}, so Pension Credit of ${h.gbp(ex.pcAfter, 2)} a week starts. With the allowance itself she is ${h.gbp(ex.weeklyGain, 2)} a week better off, about ${h.gbp(ex.weeklyGain * 52)} a year, and because she now has Guarantee Credit she also gets maximum Housing Benefit if she rents, and Council Tax Reduction, from her council.</p>
<p>The severe disability amount usually stops if someone is paid Carer’s Allowance for looking after her. If her son claimed it, her Pension Credit would return to ${h.gbp(exCarer.pcAfter, 2)}, while he would get ${h.gbp(P.carers.allowance, 2)} a week and National Insurance credits. Which arrangement suits the family depends on both sets of figures; ${h.a('carers-allowance', 'the Carer’s Allowance guide')} sets out his side.</p>

<h2>How to claim and when payment starts</h2>
<p>${h.src('govAaClaim', 'You can claim')} online or with the paper form, which you can print or request from the Attendance Allowance helpline on 0800 731 0122. Have your National Insurance number, your GP surgery details and the dates of any hospital or care home stays to hand. The start date of the claim depends on the route:</p>
<ul>
<li>online: the day you submit the application;</li>
<li>printed form: the day the DWP receives it;</li>
<li>form requested from the helpline: the day of your call, if you send the form back within ${h.num(AA.formReturnWeeks)} weeks.</li>
</ul>
<p>Asking for a form by phone therefore protects your start date while you fill it in. Within ${h.num(AA.contactWeeks)} weeks you should get a text or letter saying when to expect a decision. An assessment is only arranged if it is unclear how your condition affects you. The decision letter gives the first payment date; the money goes into a bank, building society or credit union account.</p>

<h2>Nearing the end of life</h2>
<p>If a doctor or other medical professional has said you may have ${h.num(AA.endOfLifeMonths)} months or less to live, the special rules apply. There is no ${h.num(AA.needMonths)}-month wait, you get the higher rate of ${h.gbp(AA.higher, 2)} straight away, and there is no face-to-face assessment. Ask the professional for form SR1 and apply online or by post; someone else can make the claim for you without your permission, and the award letter does not mention the special rules.</p>

<h2>Changes you must report</h2>
<p>Ring the helpline straight away if your care needs change, if you go into hospital or a care home, if you plan to be abroad for more than ${h.num(AA.abroadReportWeeks)} weeks, or if your immigration status changes. A council-funded care place normally stops the payment; paying your own fees does not. Failing to report can lead to an overpayment you must repay.</p>

<h2>Scotland, Wales and Northern Ireland</h2>
<p>In Scotland, ${h.src('scotPadp', 'Pension Age Disability Payment')} has replaced Attendance Allowance, at the same ${h.gbp(AA.lower, 2)} and ${h.gbp(AA.higher, 2)}, run by Social Security Scotland. Someone who moves from England or Wales to Scotland must tell the DWP and apply for it: Attendance Allowance stops ${h.num(AA.moveStopWeeks)} weeks after the move. Wales follows the GOV.UK rules on this page. In Northern Ireland the benefit has the same name and rates, claimed through ${h.src('nidAa', 'nidirect')}. Anyone who disagrees with a decision must ask for mandatory reconsideration within ${h.num(P.challenge.mrMonths)} month before an appeal.</p>
`,
});
