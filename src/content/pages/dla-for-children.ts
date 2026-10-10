import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { dlaChild } from '../../lib/engine/disability-extra';
import { formatMoney } from '../../lib/format';

const D = P.dla;
const g = (n: number, d = 2) => formatMoney(n, d);
const max = D.careHighest + D.mobilityHigher;
// Worked example: girl of 4 with cerebral palsy, middle care rate and higher mobility rate.
const girl = dlaChild('middle', 'higher', 4);
// Her brother of 4 with autism: middle care, and the lower mobility rate he cannot get until he is 5.
const boy = dlaChild('middle', 'lower', 4);

export default definePage({
  id: 'dla-for-children',
  group: 'disability',
  order: 60,
  mini: 'dlaChild',
  miniHref: 'carers-allowance',
  related: ['carers-allowance', 'pip-eligibility', 'universal-credit-carer-element', 'carers-allowance-calculator', 'child-benefit-rates', 'benefits-in-scotland'],
  sources: ['govDlaChild', 'govDlaChildRates', 'govDlaChildElig', 'dwpRates', 'scotCdp', 'govUc'],
  slug: 'dla-for-children',
  nav: 'DLA for children',
  card: 'Care and mobility rates for children under 16, the age limits and what an award unlocks for parents.',
  title: 'DLA for Children 2026/27: Rates, Age Limits and Claiming',
  description: `DLA for children 2026/27: care component ${g(D.careLowest)} to ${g(D.careHighest)}, mobility ${g(D.mobilityLower)} from age ${D.mobilityLowerFromAge} or ${g(D.mobilityHigher)} from age ${D.mobilityHigherFromAge}. Up to ${g(max)} a week, tax-free, not means-tested.`,
  h1: 'DLA for children: the rates, the age rules and what follows an award',
  intro: 'For a child under 16 who needs much more looking after than other children of the same age, or who has difficulty walking.',
  resume: `Disability Living Allowance for children helps with the extra costs of bringing up a disabled child under ${D.ageLimit}. It has two parts. The care component pays ${g(D.careLowest)}, ${g(D.careMiddle)} or ${g(D.careHighest)} a week in 2026/27, depending on how much more looking after the child needs than another child of the same age. The mobility component pays ${g(D.mobilityLower)} at the lower rate, available from age ${D.mobilityLowerFromAge}, or ${g(D.mobilityHigher)} at the higher rate, available from age ${D.mobilityHigherFromAge}. The most a child can receive is ${g(max)} a week. The difficulties must have lasted ${D.qualifyMonthsPast} months and be expected to last at least ${D.qualifyMonthsFuture} more. DLA is tax-free, ignores the parents’ income and savings, and is paid every ${D.paidEveryWeeks} weeks, usually on a ${D.payday}. A claim cannot be backdated, so send the form early. The middle or highest care rate also lets a parent caring ${P.carers.hoursPerWeek} hours a week claim Carer’s Allowance. In Scotland, the equivalent is Child Disability Payment.`,
  faqs: [
    { q: 'My two-year-old cannot walk: can I claim the DLA mobility component now?', a: `Not yet. The higher mobility rate of ${g(D.mobilityHigher)} starts at age ${D.mobilityHigherFromAge} and the lower rate at ${D.mobilityLowerFromAge}. Claim the care component now if your child needs extra looking after. If they already get DLA, the DWP should send a claim pack ${D.packBeforeMonths} months before the third and fifth birthdays so you can add mobility in time.` },
    { q: 'Do my wages or savings affect my child’s DLA?', a: `No. DLA for children is not means-tested and is tax-free. You can claim whether you are in or out of work, and a parent’s earnings, savings or partner’s income make no difference. Your earnings matter only if you also claim Carer’s Allowance, which has its own limit of ${g(P.carers.earningsLimit)} a week after tax and expenses.` },
    { q: 'Can I get DLA for my child backdated to when they were diagnosed?', a: `No. GOV.UK says DLA can be paid from the start of the claim and cannot be backdated. The claim starts on the day the form arrives, or the day you rang the helpline for a pack if you send it back within ${D.claimPackReturnWeeks} weeks. Ringing for the form first is therefore the safest way to protect the start date.` },
    { q: 'Will my child’s DLA stop during a hospital stay or a trip abroad?', a: `Usually not. GOV.UK says DLA is not normally affected by going into hospital, by a council-funded care home stay of under ${D.careHomeDays} days, or by a trip abroad of under ${D.abroadWeeks} weeks, or ${D.abroadMedicalWeeks} weeks for treatment of a condition that began before leaving. Report any of these stays to the DLA helpline all the same.` },
    { q: 'Does my child’s DLA add anything to my Universal Credit?', a: `Yes. Universal Credit adds a disabled child amount of ${g(P.uc.disabledChildLower)} a month, or ${g(P.uc.disabledChildHigher)} if the child gets the highest care rate. You also get a work allowance, so you keep more of your wages. DLA itself is not counted as income, and with the middle or highest care rate a parent caring ${P.carers.hoursPerWeek} hours a week can add the carer element of ${g(P.uc.carer)}.` },
  ],
  body: (h) => `
<h2>The five rates in 2026/27</h2>
${h.table(['Component', 'Rate', 'A week', 'Every 4 weeks', 'Typical need (GOV.UK)'], [
  ['Care', 'Lowest', h.gbp(D.careLowest, 2), h.gbp(D.careLowest * 4, 2), 'Help for some of the day'],
  ['Care', 'Middle', h.gbp(D.careMiddle, 2), h.gbp(D.careMiddle * 4, 2), 'Frequent help or continual supervision by day, supervision at night, or help during dialysis'],
  ['Care', 'Highest', h.gbp(D.careHighest, 2), h.gbp(D.careHighest * 4, 2), 'Help or supervision day and night, or nearing the end of life'],
  ['Mobility', `Lower (age ${D.mobilityLowerFromAge}+)`, h.gbp(D.mobilityLower, 2), h.gbp(D.mobilityLower * 4, 2), 'Can walk but needs help or supervision outdoors'],
  ['Mobility', `Higher (age ${D.mobilityHigherFromAge}+)`, h.gbp(D.mobilityHigher, 2), h.gbp(D.mobilityHigher * 4, 2), 'Cannot walk, or only a short distance without severe discomfort, or blind or severely sight impaired'],
], 'DLA for children from April 2026 (DWP benefit and pension rates 2026 to 2027)', ['l', 'l', 'r', 'r', 'l'])}
<p>The figures come from the ${h.src('dwpRates', 'DWP rates table')}, up from ${h.gbp(D.previous.careLowest, 2)}, ${h.gbp(D.previous.careMiddle, 2)} and ${h.gbp(D.previous.careHighest, 2)} for care and ${h.gbp(D.previous.mobilityLower, 2)} and ${h.gbp(D.previous.mobilityHigher, 2)} for mobility in 2025/26. GOV.UK’s page on the end-of-life rules still shows an older weekly figure for the highest care rate; the amount actually paid is the ${h.gbp(D.careHighest, 2)} above.</p>

<h2>Compared with a child of the same age</h2>
<p>Every baby and toddler needs constant care, so the question for DLA is always the extra: does your child need much more looking after than another child of the same age without a disability? A five-year-old who still needs nappies changed through the night, a nine-year-old with diabetes whose blood sugar has to be checked overnight, or a seven-year-old with autism who has no sense of danger near roads may all need far more than their age group. The DWP looks at attention with bodily functions (washing, dressing, eating, toileting, taking medicine) and at the supervision needed to keep the child and others safe. Diaries, letters from the school’s special needs coordinator, a health visitor or a consultant carry more weight than a diagnosis on its own.</p>

<h2>The mobility age limits in practice</h2>
<p>Mobility is where children are most often turned down simply for being too young. ${h.src('govDlaChildElig', 'GOV.UK sets the limits')}: the higher rate from ${h.num(D.mobilityHigherFromAge)}, the lower rate from ${h.num(D.mobilityLowerFromAge)}. Take a girl of four with cerebral palsy who cannot walk, on the middle care rate. With the higher mobility rate her DLA is ${h.gbp(girl.weekly, 2)} a week, or ${h.gbp(girl.fourWeekly, 2)} every four weeks. Her twin brother has autism, can walk but runs into roads and needs guiding outdoors: he fits the lower mobility rate, but at four he cannot have it, so he receives ${h.gbp(boy.weekly, 2)} until his fifth birthday. The DWP should send a claim pack ${h.num(D.packBeforeMonths)} months before a child turns ${h.num(D.mobilityHigherFromAge)} and ${h.num(D.mobilityLowerFromAge)}; if none arrives, ask the Disability Service Centre for one.</p>

<h2>Residence: how long the child must have lived here</h2>
<p>Children who have recently arrived need a minimum period in England, Scotland or Wales, and must live in England or Wales on the day of the claim.</p>
${h.table(['Child’s age', 'Time already spent in Great Britain'], [
  ['Under 6 months', `At least ${D.residenceUnder6mWeeks} weeks`],
  ['6 months to 3 years', `At least ${D.residence6mTo3yWeeks} of the last ${D.residence6mTo3yOutOf} weeks`],
  ['Over 3 years', `At least ${D.residenceOver3Months} of the last ${D.residenceOver3OutOf} months`],
], 'DLA for children: past presence by age (GOV.UK eligibility)', ['l', 'l'])}
<p>A child who is nearing the end of life, lives with a parent in the armed forces, or is returning from the EU, Switzerland, Norway, Iceland or Liechtenstein under the withdrawal agreement may qualify sooner. Children who are not British citizens also need the right to claim public funds.</p>

<h2>Making the claim</h2>
<p>A parent, or someone who looks after the child as a parent would (a step-parent, guardian, grandparent, foster parent or older sibling), makes the claim. GOV.UK offers two routes in England and Wales: print the DLA claim form, or ring the DLA helpline on 0800 121 4600 for a printed pack. Because the claim cannot be backdated, phoning first is worth it: the claim then starts on the day of the call, provided the pack goes back within ${h.num(D.claimPackReturnWeeks)} weeks. You should get a letter confirming the application within ${h.num(D.contactWeeks)} weeks, and a later decision letter giving the first payment date. If you disagree, ask for mandatory reconsideration within ${h.num(P.challenge.mrMonths)} month.</p>

<h2>What an award opens for the family</h2>
<ul>
<li>With the middle or highest care rate, a parent caring ${h.num(P.carers.hoursPerWeek)} hours a week or more can claim ${h.a('carers-allowance', 'Carer’s Allowance')} of ${h.gbp(P.carers.allowance, 2)} a week, or the ${h.a('universal-credit-carer-element', 'Universal Credit carer element')}.</li>
<li>Universal Credit adds ${h.gbp(P.uc.disabledChildLower, 2)} a month for a disabled child, or ${h.gbp(P.uc.disabledChildHigher, 2)} with the highest care rate, ${h.src('govUc', 'according to GOV.UK')}, and gives the family a work allowance.</li>
<li>DLA paid to any child under 18 in the household exempts it from the benefit cap.</li>
<li>A parent caring ${h.num(P.carersCredit.hoursPerWeek)} hours a week or more for a child on the middle or highest care rate, but not entitled to Carer’s Allowance, can apply for ${h.a('carers-credit', 'Carer’s Credit')} to protect their State Pension record.</li>
</ul>

<h2>At 16, and in Scotland</h2>
<p>DLA for children ends at ${h.num(D.ageLimit)}. Shortly after the birthday the DWP invites the young person to claim PIP; if they claim by the date in the letter, DLA continues until PIP is decided, and if not, it stops. ${h.a('pip-eligibility', 'PIP eligibility')} explains the adult test. In Scotland, Social Security Scotland pays ${h.src('scotCdp', 'Child Disability Payment')} instead, at the same rates, with the care component available from ${h.num(P.scotland.cdpCareFromMonths)} months old and the award usually able to run until ${h.num(P.scotland.cdpUntilAge)}. A child on DLA who moves to Scotland keeps it for up to ${h.num(D.moveStopWeeks)} weeks while the family applies for Child Disability Payment.</p>
`,
});
