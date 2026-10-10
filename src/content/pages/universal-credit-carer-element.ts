import { definePage } from '../../lib/guide-types';
import { P, weeklyToMonthly } from '../../lib/engine/params';
import { computeUc } from '../../lib/engine/uc';
import { formatMoney } from '../../lib/format';

const U = P.uc;
const g = (n: number, d = 2) => formatMoney(n, d);
const hrs = P.carers.hoursPerWeek;
const caMonth = weeklyToMonthly(P.carers.allowance);
// Example: Lena, 52, cares for her mother; housing association rent £480; no earnings; with and without Carer's Allowance.
const lena = { couple: false, age: 52, children: 0, earnings: 0, housing: 'social' as const, rent: 480, carer: true };
const noCa = computeUc(lena);
const withCa = computeUc({ ...lena, unearned: caMonth });
// Example: lone parent, 33, two children, one on the highest care rate of DLA; rent £650; no earnings.
const parent = computeUc({ couple: false, age: 33, children: 2, disabledChildrenHigher: 1, carer: true, earnings: 0, housing: 'social', rent: 650, capExempt: true });

export default definePage({
  id: 'universal-credit-carer-element',
  group: 'uc',
  order: 60,
  mini: 'carerElement',
  related: ['carers-allowance-and-universal-credit', 'carers-allowance', 'universal-credit-health-element', 'universal-credit-and-pip', 'carer-support-payment-scotland', 'universal-credit-rates'],
  sources: ['govUc', 'ucRegs29', 'ucRegs30', 'dwpRates', 'govCa'],
  slug: 'universal-credit-carer-element',
  nav: 'Carer element',
  card: 'The extra monthly amount for 35 hours of care a week, who qualifies and the couple rules.',
  title: `Universal Credit Carer Element 2026/27: Who Gets ${g(U.carer)}`,
  description: `Universal Credit carer element 2026/27: ${g(U.carer)} a month for ${hrs} hours of care a week for someone on PIP, AA, DLA or ADP. No earnings limit; not paid with LCWRA.`,
  h1: 'The carer element of Universal Credit',
  intro: 'An extra amount for unpaid carers, which has to be reported: it is never added on its own.',
  resume: `The carer element adds ${g(U.carer)} a month to Universal Credit in 2026/27, up from ${g(U.previous.carer)}, if you care for a severely disabled person for at least ${hrs} hours a week. The person you look after must receive a qualifying benefit: either rate of the PIP daily living part, Attendance Allowance, the middle or highest care rate of DLA, Adult Disability Payment, the middle or highest care award of Child Disability Payment, Armed Forces Independence Payment, or Constant Attendance Allowance at certain rates. You do not have to claim Carer’s Allowance, and unlike Carer’s Allowance there is no earnings limit. A couple caring for the same person gets one carer element; partners caring for two different people can get one each. Someone with the health element (LCWRA) gets that instead, because the two cannot be paid together. The element is added only once you report your caring in your Universal Credit account.`,
  faqs: [
    { q: 'Can I get the Universal Credit carer element while working full time?', a: `Yes, if you still provide at least ${hrs} hours of care a week. Regulation 30 borrows the Carer’s Allowance conditions but ignores the Carer’s Allowance earnings limit of ${g(P.carers.earningsLimit)} a week, so wages do not stop the element. Your wages are tapered as usual, and you cannot get the element for care you are paid to give, for example as a care worker employed for that person.` },
    { q: 'Does the carer element count if my partner and I both care for my father?', a: `Only one carer element is paid when two people care for the same disabled person, worth ${g(U.carer)} a month. You choose between you which of you has it; if you do not agree, the DWP decides. If each of you cares for a different person for ${hrs} hours or more, for instance one for a parent and the other for a disabled child, the award can include two carer elements.` },
    { q: 'Will the person I care for lose money if I claim the carer element?', a: `Possibly. If they get the severe disability premium in an older means-tested benefit such as income-related ESA, GOV.UK warns that it stops when you claim the carer element for looking after them. Their PIP, Attendance Allowance or DLA is not affected. Check the premium with them before reporting your caring, because the loss can be larger than the ${g(U.carer)} gained.` },
    { q: 'Is the carer element paid on top of the disabled child addition?', a: `Yes. A parent caring for a disabled child for ${hrs} hours a week can receive the child element, the disabled child addition of ${g(U.disabledChildLower)} or ${g(U.disabledChildHigher)}, and the carer element of ${g(U.carer)}, provided the child gets the middle or highest care rate of DLA, either daily living rate of PIP, or the middle or highest care award of Child Disability Payment.` },
    { q: 'How many hours of caring count towards the 35-hour carer element test?', a: `The carer element uses the Carer’s Allowance test, and GOV.UK gives examples of care that counts towards the ${hrs} hours a week: helping with washing and cooking, taking the person to a doctor’s appointment, and helping with household tasks such as managing bills and shopping. The hours are counted for one person you care for, and you must be ${P.carers.minAge} or over and meet the residence conditions.` },
  ],
  body: (h) => `
<h2>The three conditions</h2>
<p>${h.src('ucRegs29', 'Regulation 29')} includes the carer element when a claimant has “regular and substantial caring responsibilities for a severely disabled person”. ${h.src('ucRegs30', 'Regulation 30')} defines that by pointing to the Carer’s Allowance rules, which leaves three tests:</p>
<ol>
<li>You care for the person for at least ${h.num(hrs)} hours a week.</li>
<li>The person receives one of the qualifying benefits listed below.</li>
<li>You do not get paid for that care. Wages from any other job do not matter: the Carer’s Allowance earnings limit of ${h.gbp(P.carers.earningsLimit)} a week is expressly ignored.</li>
</ol>
<p>You do not have to claim Carer’s Allowance, be related to the person or live with them. In Scotland, where Carer Support Payment replaced Carer’s Allowance, being entitled to Carer Support Payment also satisfies the test.</p>

<h2>Qualifying benefits of the person you care for</h2>
${h.table(['Benefit', 'Rate that qualifies'], [
  ['Personal Independence Payment', 'Daily living part, either rate'],
  ['Attendance Allowance', 'Either rate'],
  ['Disability Living Allowance', 'Care component, middle or highest rate'],
  ['Adult Disability Payment (Scotland)', 'Standard or enhanced daily living award'],
  ['Child Disability Payment (Scotland)', 'Care component, middle or highest award'],
  ['Armed Forces Independence Payment', 'Any award'],
  ['Constant Attendance Allowance', 'Full day, intermediate or exceptional rate with Industrial Injuries Disablement Benefit; full day rate with a War Disablement Pension'],
], 'Benefits that let a carer get the Universal Credit carer element (GOV.UK, Universal Credit: what you’ll get)', ['l', 'l'])}
<p>PIP mobility on its own, or the lowest care rate of DLA, does not qualify. If the person is waiting for a PIP decision, report your caring as soon as the award arrives.</p>

<h2>When the health element gets in the way</h2>
<p>A claimant who has limited capability for work and work-related activity receives the LCWRA element and not the carer element, even if they care for ${h.num(hrs)} hours a week. The rule applies person by person. In a couple where one partner has LCWRA and the other is the one doing the caring, the award can include the health element for the first and the carer element for the second. The ${h.a('universal-credit-health-element', 'health element guide')} sets out the two LCWRA rates.</p>

<h2>Carer’s Allowance alongside Universal Credit</h2>
<p>Many carers get both. Carer’s Allowance of ${h.gbp(P.carers.allowance, 2)} a week, about ${h.gbp(caMonth, 2)} a month, is counted as unearned income and taken off Universal Credit pound for pound, while the carer element stays in the award. Lena, 52, looks after her mother, who receives Attendance Allowance, and rents from a housing association for ${h.gbp(480)}. Without Carer’s Allowance her Universal Credit is ${h.gbp(noCa.award, 2)}. With it, Universal Credit falls to ${h.gbp(withCa.award, 2)} and her total stays at ${h.gbp(withCa.award + caMonth, 2)}. The money is the same. What Carer’s Allowance adds is Class 1 National Insurance credits, which help with other benefits as well as the State Pension, where Universal Credit gives Class 3 credits that count for the State Pension only. ${h.a('carers-allowance-and-universal-credit', 'Carer’s Allowance and Universal Credit')} goes through the choice in detail.</p>

<h2>A parent caring for a disabled child</h2>
<p>Marta is 33 and brings up two children alone in a housing association home costing ${h.gbp(650)} a month. Her younger son gets the highest care rate of DLA and needs care day and night, so she cannot work at present. Her award stacks four layers for the children and her caring: two child elements of ${h.gbp(U.child, 2)}, the higher disabled child addition of ${h.gbp(U.disabledChildHigher, 2)}, and the carer element of ${h.gbp(U.carer, 2)}, on top of her standard allowance and rent. Her Universal Credit comes to ${h.gbp(parent.award, 2)} a month, and because her son receives DLA the household is outside the benefit cap. If she later takes a part-time job, the carer element stays as long as the care continues for ${h.num(hrs)} hours a week.</p>

<h2>Young carers aged 16 and 17</h2>
<p>Universal Credit is normally for people aged ${U.minAge} or over, but GOV.UK lets a 16 or 17 year old claim if they care for someone who gets a health or disability-related benefit. A young carer who meets the ${h.num(hrs)}-hour test can then receive the carer element in their own award, alongside the standard allowance for a single person under 25.</p>

<h2>The carer element and the benefit cap</h2>
<p>GOV.UK states that a household is not affected by the benefit cap if a claimant gets Universal Credit because they care for someone with a disability. Carer’s Allowance paid to you or your partner exempts it too, as does PIP, Attendance Allowance or DLA paid to you, your partner or a child under 18 living with you. For a carer with children and high rent, this exemption can be worth more each month than the ${h.gbp(U.carer, 2)} itself.</p>

<h2>Reporting the caring</h2>
<p>Use “Report a change of circumstances” in your account and give the details of the person you care for and the benefit they receive. GOV.UK is explicit that starting Carer’s Allowance does not add the carer element automatically: the DWP needs the report. Tell your work coach too, because caring is one of the things discussed when your claimant commitment and its work-related activities are agreed. If caring stops, because the person goes into a care home, dies or their benefit ends, report that as well.</p>
`,
});
