import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { carersCredit } from '../../lib/engine/carers-extra';
import { formatMoney } from '../../lib/format';

const CC = P.carersCredit;
const CA = P.carers;
const SP = P.statePension;
const g = (n: number, d = 2) => formatMoney(n, d);
const v = carersCredit({ hours: 25, benefit: 'yes' });
// Worked example: Aisha, 47, left her job to care for her mother 25 hours a week; 9 years of caring before State Pension age.
const AISHA_YEARS = 9;

export default definePage({
  id: 'carers-credit',
  group: 'carers',
  order: 50,
  mini: 'carersCreditYears',
  miniHref: 'carers-allowance-calculator',
  related: ['carers-allowance', 'carers-allowance-calculator', 'state-pension-amount', 'child-benefit-rates', 'carer-support-payment-scotland'],
  sources: ['govCarersCredit', 'govNewSp', 'govCa', 'govCaEffect', 'dwpRates'],
  slug: 'carers-credit',
  nav: 'Carer’s Credit',
  card: `National Insurance credits for ${CC.hoursPerWeek} hours of care a week, with no earnings limit and no money paid.`,
  title: `Carer’s Credit 2026/27: NI Credits for ${CC.hoursPerWeek} Hours of Care`,
  description: `Carer’s Credit 2026/27: NI credits if you care ${CC.hoursPerWeek} hours a week for someone on a disability benefit. Each year can add ${g(v.perYear)} a week to your State Pension.`,
  h1: 'Carer’s Credit: protecting your State Pension while you care',
  intro: 'No money changes hands, but each credited year can be worth hundreds of pounds a year in retirement.',
  resume: `Carer’s Credit is a National Insurance credit for people who care for one or more disabled people for at least ${CC.hoursPerWeek} hours a week but do not get Carer’s Allowance. It pays no money. Instead it fills the gaps that caring would otherwise leave in your National Insurance record, the record your State Pension is built on. You must be ${CA.minAge} or over and under State Pension age, and the person you look after must normally get a qualifying benefit such as Attendance Allowance, the daily living part of PIP or the middle or highest care rate of DLA; if they do not, a health or social care professional can sign a Care Certificate instead. Your income and savings do not matter, and breaks of up to ${CC.breakWeeks} weeks in a row do not stop it. Under the new State Pension each qualifying year adds up to ${g(v.perYear)} a week, about ${g(v.perYearAnnual, 0)} a year, for life. People on Carer’s Allowance, and parents getting Child Benefit for a child under ${P.childBenefit.niCreditChildUnder}, get credits automatically.`,
  faqs: [
    { q: 'I work full time and also care for my dad 20 hours a week: can I get Carer’s Credit?', a: `You can be eligible, because GOV.UK says income, savings and investments do not affect Carer’s Credit. Whether it helps is another matter: if your job already gives you a qualifying year through National Insurance contributions, a credit for the same year adds nothing. It is most useful for carers who have cut their hours or stopped work.` },
    { q: 'Can I add up hours spent caring for two people to reach 20 a week?', a: `Yes. GOV.UK says you must be looking after one or more people for at least ${CC.hoursPerWeek} hours a week, so 12 hours for your mother and 10 for your father-in-law can qualify, as long as each person gets a qualifying benefit or a professional signs the Care Certificate. Carer’s Allowance is stricter: its ${CA.hoursPerWeek} hours must be for one person.` },
    { q: 'My mother is still waiting for her PIP decision: can I claim Carer’s Credit now?', a: `Yes, through the Care Certificate. If the person you care for does not get a qualifying benefit, fill in the Care Certificate section of the claim form and ask a health or social care professional, such as a GP, nurse or social worker, to sign it. Once her PIP daily living award comes through, the benefit itself shows that the condition is met.` },
    { q: 'Does Carer’s Credit put any money in my bank account?', a: `No. It is a credit on your National Insurance record, not a payment. Its value shows up later, in a higher State Pension and in eligibility for some contributory benefits. If you care for ${CA.hoursPerWeek} hours a week or more and earn ${g(CA.earningsLimit, 0)} or less after deductions, check Carer’s Allowance first: it pays ${g(CA.allowance)} a week and brings credits with it.` },
    { q: 'What happens to my Carer’s Credit if Mum goes into hospital for three weeks?', a: `Nothing. GOV.UK says Carer’s Credit continues through breaks in caring of up to ${CC.breakWeeks} weeks in a row, for example a short holiday, or a hospital stay by you or the person you care for. If the break goes beyond ${CC.breakWeeks} weeks in a row, tell the Carer’s Allowance Unit, which handles Carer’s Credit.` },
  ],
  body: (h) => `
<h2>Who qualifies</h2>
<p>${h.src('govCarersCredit', 'GOV.UK’s three personal conditions')} are short: aged ${h.num(CA.minAge)} or over, under State Pension age, and looking after one or more people for at least ${h.num(CC.hoursPerWeek)} hours a week. The person or people you look after must get one of these benefits:</p>
${h.table(['Benefit of the person cared for', 'Level that counts'], [
  ['Attendance Allowance or Pension Age Disability Payment', 'Either rate'],
  ['Personal Independence Payment', 'Daily living part'],
  ['Disability Living Allowance', 'Care component, middle or highest rate'],
  ['Child Disability Payment, Scottish Adult DLA', 'Care component, middle or highest rate'],
  ['Adult Disability Payment', 'Daily living, standard or enhanced'],
  ['Constant Attendance Allowance', 'Any award'],
  ['Armed Forces Independence Payment', 'Any award'],
], 'Qualifying benefits for Carer’s Credit (GOV.UK)', ['l', 'l'])}
<p>If the person does not get one of them, perhaps because a claim is pending or they have never applied, the Care Certificate in the claim form, signed by a health or social care professional, can stand in for it.</p>

<h2>Who does not need to apply</h2>
<p>Three groups already have credits and should not use the Carer’s Credit form. Anyone getting Carer’s Allowance, or Carer Support Payment in Scotland, receives credits automatically for each week of the award. A parent or main carer getting Child Benefit for a child under ${h.num(P.childBenefit.niCreditChildUnder)} is credited through the Child Benefit claim. Foster carers apply for a separate National Insurance credit for foster carers instead.</p>

<h2>Carer’s Credit or Carer’s Allowance?</h2>
${h.table(['', 'Carer’s Credit', 'Carer’s Allowance'], [
  ['Hours of care a week', `${CC.hoursPerWeek}, across one or more people`, `${CA.hoursPerWeek}, for one person`],
  ['Earnings limit', 'None', `${h.gbp(CA.earningsLimit)} a week after deductions`],
  ['Money paid', 'None', `${h.gbp(CA.allowance, 2)} a week`],
  ['National Insurance credits', 'Yes', 'Yes, automatically'],
  ['Age', `${CA.minAge} to State Pension age`, `${CA.minAge} or over`],
  ['Effect on the person cared for', 'None', 'Can end their severe disability premium'],
], 'Comparison for 2026/27 (GOV.UK)', ['l', 'l', 'l'])}
<p>Carer’s Credit is the safety net for carers who fall outside Carer’s Allowance: those caring between ${h.num(CC.hoursPerWeek)} and ${h.num(CA.hoursPerWeek - 1)} hours, those whose earnings are just above ${h.gbp(CA.earningsLimit)}, students, and people whose care is split across two relatives. It also suits families where a Carer’s Allowance claim would cost the disabled person their severe disability premium: ${h.src('govCaEffect', 'GOV.UK warns')} of that effect for the allowance, while Carer’s Credit pays nothing that could trigger it.</p>

<h2>What a credited year is worth</h2>
<p>The full new State Pension in 2026/27 is ${h.gbp(SP.newFull, 2)} a week for ${h.num(SP.qualifyingYearsFull)} qualifying years, so ${h.src('govNewSp', 'each year')} adds one ${h.num(SP.qualifyingYearsFull)}th: ${h.gbp(v.perYear, 2)} a week, or about ${h.gbp(v.perYearAnnual)} a year, at today’s rates, every year for the rest of your life. You need at least ${h.num(SP.qualifyingYearsMin)} qualifying years to get any new State Pension at all.</p>
<p>Aisha is 47. She left her job to care for her mother, who gets Attendance Allowance, for about 25 hours a week, and her husband’s pay means she cannot get Universal Credit, which would otherwise give her credits. Without Carer’s Credit, the ${h.num(AISHA_YEARS)} years until her own State Pension age would be gaps. With it, they count: if they are years she needs to reach ${h.num(SP.qualifyingYearsFull)}, they add up to ${h.gbp(v.perYear * AISHA_YEARS, 2)} a week to her pension, about ${h.gbp(v.perYearAnnual * AISHA_YEARS)} a year. Someone who already has ${h.num(SP.qualifyingYearsFull)} qualifying years gains nothing from more credits, so check your record on GOV.UK before relying on the figure.</p>

<h2>Four carers who need it</h2>
<p>A daughter who spends ${h.num(CC.hoursPerWeek + 2)} hours a week between her father, on PIP daily living, and her mother-in-law, on Attendance Allowance, cannot get Carer’s Allowance for either because neither takes ${h.num(CA.hoursPerWeek)} hours, but qualifies for Carer’s Credit on the total. A part-time nurse who takes home ${h.gbp(CA.earningsLimit + 30)} a week after deductions fails the allowance’s earnings test yet keeps her record intact with the credit, if her pay alone does not already give her a qualifying year. A 19-year-old at university who looks after his younger sister on the highest DLA care rate is shut out of Carer’s Allowance as a full-time student, but not out of Carer’s Credit. And a husband caring for his wife, whose severe disability premium would stop if he claimed the allowance, can protect his own pension without touching her benefits.</p>

<h2>Breaks in caring</h2>
<p>Caring is rarely constant. GOV.UK says Carer’s Credit continues through breaks of up to ${h.num(CC.breakWeeks)} weeks in a row, whether you take a short holiday, go into hospital yourself, or the person you care for goes into hospital. Beyond ${h.num(CC.breakWeeks)} weeks in a row, keep the Carer’s Allowance Unit informed.</p>

<h2>How to claim</h2>
<ol>
<li>Download the Carer’s Credit claim form from GOV.UK, or ask the Carer’s Allowance Unit on 0800 731 0297 to post one. Braille, large print and audio versions are available.</li>
<li>If the person you care for does not get a qualifying benefit, ask a health or social care professional to sign the Care Certificate in the form.</li>
<li>Send it to Freepost DWP Carers Allowance Unit, with nothing else written on the envelope.</li>
</ol>
<p>If the claim is refused, you can ask for mandatory reconsideration within ${h.num(P.challenge.mrMonths)} month, as for any DWP decision. Carer’s Credit also covers carers in Scotland: Child Disability Payment, Adult Disability Payment and Pension Age Disability Payment all count as qualifying benefits, and ${h.a('carer-support-payment-scotland', 'Carer Support Payment')} brings credits automatically.</p>
`,
});
