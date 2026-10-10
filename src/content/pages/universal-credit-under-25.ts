import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { computeUc, standardAllowance } from '../../lib/engine/uc';
import { formatMoney } from '../../lib/format';

const U = P.uc;
const S = U.standard;
const g = (n: number, d = 2) => formatMoney(n, d);
const gapSingle = S.single25 - S.singleUnder25;
const gapCouple = S.couple25 - S.coupleUnder25;
// Example: Kyle, 22, single, rents a room (shared accommodation) for £450 with no LHA area applied; earns £600.
const kyle = computeUc({ couple: false, age: 22, children: 0, earnings: 600, housing: 'private', rent: 450 });
const kyle25 = computeUc({ couple: false, age: 25, children: 0, earnings: 600, housing: 'private', rent: 450 });
const mum = computeUc({ couple: false, age: 19, children: 1, earnings: 0 });

export default definePage({
  id: 'universal-credit-under-25',
  group: 'uc',
  order: 90,
  mini: 'ucUnder25',
  related: ['universal-credit-rates', 'universal-credit-calculator', 'universal-credit-housing-element', 'universal-credit-deductions', 'local-housing-allowance-rates'],
  sources: ['govUc', 'govUcEligibility', 'dwpRates', 'govUcSanctions', 'ucRegs36', 'ucRegsSch4p29'],
  slug: 'universal-credit-under-25',
  nav: 'Under 25',
  card: 'The lower standard allowance, couples with one partner over 25, and claims at 16 or 17.',
  title: 'Universal Credit Under 25 2026/27: The Lower Standard Rate',
  description: `Universal Credit under 25 in 2026/27: ${g(S.singleUnder25)} a month if single, ${g(S.coupleUnder25)} for a couple both under 25. Who can claim at 16 or 17 and what else the age changes.`,
  h1: 'Universal Credit when you are under 25',
  intro: 'Only one part of the award depends on your age, but it is the largest one.',
  resume: `A single person under 25 gets a Universal Credit standard allowance of ${g(S.singleUnder25)} a month in 2026/27, against ${g(S.single25)} from their 25th birthday, a gap of ${g(gapSingle)} a month or about ${g(gapSingle * 12, 0)} a year. A couple who are both under 25 get ${g(S.coupleUnder25)}; if either partner is 25 or over, the couple receives the full ${g(S.couple25)}. Everything else in the award is the same at any age: ${g(U.child)} for each child, help with rent, the health and carer elements and childcare. You normally have to be ${U.minAge} to claim, but a 16 or 17 year old can claim if they have a health condition with medical evidence, care for a disabled person, are responsible for a child, are pregnant or have just had a baby, are nearing the end of life, or have no parental support. The lower allowance also means lower daily sanction amounts and a lower ceiling on deductions. Single private renters under 35 are usually limited to the shared accommodation rate for rent.`,
  faqs: [
    { q: 'Does my Universal Credit go up automatically when I turn 25?', a: `You do not need a new claim. The DWP already holds your date of birth, and the standard allowance should move from ${g(S.singleUnder25)} to ${g(S.single25)}. Check the statement for the assessment period that includes your birthday: if the higher rate is missing, raise it in your journal. A couple moves to ${g(S.couple25)} when the first of the two partners reaches 25.` },
    { q: 'My partner is 27 and I am 21: which Universal Credit rate do we get?', a: `The higher couple rate of ${g(S.couple25)} a month. For joint claimants it is enough for one partner to be 25 or over, so the younger partner’s age does not lower the award. The ${g(S.coupleUnder25)} rate applies only when both of you are under 25. This also sets your sanction rate and the maximum taken off for debts.` },
    { q: 'Can a 17 year old living in a hostel claim Universal Credit?', a: `Usually yes, if they have no parental support: GOV.UK gives the example of not living with parents and not being in local authority care. Other routes at 16 or 17 include a health condition with medical evidence such as a fit note, caring for someone on a disability benefit, being responsible for a child, being pregnant within ${U.youngPregnantWeeks} weeks of the due date, or having had a baby in the last ${U.youngBabyWeeks} weeks.` },
    { q: 'Can I get Universal Credit at 19 while studying A levels?', a: `Possibly. GOV.UK allows a claim from someone aged 21 or under who is studying a qualification up to A level or equivalent and does not have parental support. If you live with your parents and they support you, you normally remain in their claim as a qualifying young person instead, and they receive the child element of ${g(U.child)} for you until the 31 August after your 19th birthday.` },
    { q: 'Are Universal Credit sanctions lower for under 25s?', a: `Yes, because the daily reduction is tied to the standard allowance. A single claimant under 25 loses ${g(U.sanctionDaily100.singleUnder25)} a day at the full rate, against ${g(U.sanctionDaily100.single25)} at 25 or over. At 16 or 17 the reduction is ${g(U.sanctionDaily40.singleUnder25)} a day, the ${Math.round(U.sanctionReducedShare * 100)}% rate, and high and medium level sanctions are shorter.` },
  ],
  body: (h) => `
<h2>The four standard allowances side by side</h2>
${h.table(['Household', 'Under 25', '25 or over', 'Difference a month', 'Difference a year'], [
  ['Single', h.gbp(S.singleUnder25, 2), h.gbp(S.single25, 2), h.gbp(gapSingle, 2), h.gbp(gapSingle * 12)],
  ['Couple', h.gbp(S.coupleUnder25, 2) + ' (both under 25)', h.gbp(S.couple25, 2) + ' (either 25+)', h.gbp(gapCouple, 2), h.gbp(gapCouple * 12)],
], 'Universal Credit standard allowance by age, 2026/27 (DWP rates)', ['l', 'r', 'r', 'r', 'r'])}
<p>In April 2026 the single under-25 rate rose from ${h.gbp(U.previous.singleUnder25, 2)}, an increase of ${h.pct(S.singleUnder25 / U.previous.singleUnder25 - 1, 1)}, slightly more than the ${h.pct(S.single25 / U.previous.single25 - 1, 1)} given to the other three rates; the couple rate for two under-25s went up from ${h.gbp(U.previous.coupleUnder25, 2)}. ${h.src('ucRegs36', 'Regulation 36')} holds the table of amounts. There is no lower rate for under-25s in any other element: a 20-year-old lone parent gets exactly the same child element and childcare help as a parent of 40.</p>

<h2>Three young claimants</h2>
<p>Kyle is 22, single, and rents a room for ${h.gbp(450)} a month. Taking home ${h.gbp(600)} from a café job, with no children and no health condition, he has no work allowance and loses ${h.pct(U.taper, 0)} of every pound. If his rent of ${h.gbp(450)} is fully within the shared accommodation rate for his area, his Universal Credit is ${h.gbp(kyle.award, 2)} a month. The day he turns 25 and nothing else changes, it becomes ${h.gbp(kyle25.award, 2)}: the whole age gap of ${h.gbp(gapSingle, 2)}.</p>
<p>Leah is 19 with a baby and lives with her mother. Her own claim gives her the under-25 standard allowance plus the child element, ${h.gbp(mum.award, 2)} a month before any earnings, and when she returns to work the work allowance of ${h.gbp(U.workAllowanceHigher)} applies because she is responsible for a child.</p>
<p>Ali is 23 and his partner Sara is 26. As joint claimants they get ${h.gbp(S.couple25, 2)}, the full couple rate, because Sara is over 25. Their daily sanction rate is the one for couples where one partner is 25 or over, ${h.gbp(U.sanctionDaily100.couple25, 2)} per sanctioned claimant.</p>

<h2>Claiming at 16 or 17</h2>
<p>Universal Credit normally starts at ${U.minAge}, but ${h.src('govUcEligibility', 'GOV.UK lists exceptions')} for 16 and 17 year olds. You can claim if any of these applies:</p>
<ul>
<li>you have a health condition or disability and medical evidence for it, such as a fit note;</li>
<li>you care for someone who gets a health or disability-related benefit;</li>
<li>a medical professional has said you are nearing the end of life;</li>
<li>you are responsible for a child, or live with a partner who is eligible and you are responsible for a child;</li>
<li>you are pregnant and the baby is due within ${U.youngPregnantWeeks} weeks, or you had a baby in the last ${U.youngBabyWeeks} weeks;</li>
<li>you have no parental support, for example you do not live with your parents and are not in local authority care.</li>
</ul>

<h2>Students under 25</h2>
<p>Full-time students are normally outside Universal Credit, and that bites hardest on young claimants. ${h.src('govUc', 'GOV.UK')} allows a claim in full-time education only in set cases: you live with a partner who is eligible, you are responsible for a child, you are 21 or under, studying up to A level or equivalent and have no parental support, or you have a disability, were found to have limited capability for work before the course started and are entitled to PIP, DLA, Attendance Allowance or a Scottish disability benefit. Part-time students, and those on courses with no student loan or finance available, may be able to claim on the ordinary rules.</p>

<h2>What else the lower allowance changes</h2>
${h.table(['Amount', 'Single under 25', 'Single 25 or over'], [
  [`Daily sanction, ${h.pct(1, 0)} rate`, h.gbp(U.sanctionDaily100.singleUnder25, 2), h.gbp(U.sanctionDaily100.single25, 2)],
  [`Daily sanction, ${h.pct(U.sanctionReducedShare, 0)} rate`, h.gbp(U.sanctionDaily40.singleUnder25, 2), h.gbp(U.sanctionDaily40.single25, 2)],
  [`Most taken off for debts (${h.pct(U.maxDeductionShare, 0)})`, h.gbp(U.maxDeduction.singleUnder25, 2), h.gbp(U.maxDeduction.single25, 2)],
  [`Each third-party deduction (${h.pct(U.thirdPartyShare, 0)})`, h.gbp(U.thirdParty.singleUnder25, 2), h.gbp(U.thirdParty.single25, 2)],
], 'Amounts linked to the standard allowance, 2026/27 (DWP rates)', ['l', 'r', 'r'])}
<p>The ${h.pct(U.sanctionReducedShare, 0)} rate applies to claimants aged 16 or 17 and to those whose only requirement is to attend appointments. Sanction lengths are shorter at 16 or 17: GOV.UK gives ${U.sanctionMediumDays1617} days for a first medium level sanction instead of ${U.sanctionMediumDays}, and ${U.sanctionHighDays1617} days for a first high level sanction instead of ${U.sanctionHighDays}. ${h.a('universal-credit-deductions', 'Deductions and sanctions')} explains how both work.</p>

<h2>Rent: the shared accommodation rate runs to 35</h2>
<p>The age that matters for housing is not 25 but ${P.lha.sarAgeLimit}. A single private renter under ${P.lha.sarAgeLimit} with no children normally has rent help limited to the Local Housing Allowance shared accommodation rate, the cost of a room in a shared house, even when renting a one-bedroom flat. ${h.src('ucRegsSch4p29', 'Paragraph 29 of Schedule 4')} lists the exceptions: care leavers aged 18 to 24, people who have lived in homeless hostels for at least ${P.lha.sarHostelMonths} months and accepted resettlement support, people receiving the daily living part of PIP, the middle or highest care rate of DLA, or Attendance Allowance, and some ex-offenders managed under multi-agency public protection arrangements. ${h.a('universal-credit-housing-element', 'The housing element page')} covers the bedroom rules in full.</p>
`,
});
