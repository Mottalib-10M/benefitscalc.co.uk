import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { ssmgGrant } from '../../lib/engine/family-grants';
import { formatMoney } from '../../lib/format';

const M = P.maternity;
const g = (n: number, d = 0) => formatMoney(n, d);
const grant = (babies: number, group: number) => g(ssmgGrant(babies, group).grant);

export default definePage({
  id: 'sure-start-maternity-grant',
  group: 'family',
  order: 60,
  mini: 'ssmgGrant',
  miniHref: 'benefits-calculator',
  related: ['maternity-allowance', 'best-start-grant', 'child-benefit-rates', 'universal-credit-calculator', 'budgeting-loan'],
  sources: ['govSsmg', 'govSsmgElig', 'govSsmgClaim', 'scotBsg'],
  slug: 'sure-start-maternity-grant',
  nav: 'Sure Start Maternity Grant',
  card: 'The one-off grant for a first baby on Universal Credit, the exceptions and the claim window.',
  title: `Sure Start Maternity Grant 2026/27: ${g(M.ssmg)}, Who Can Claim`,
  description: `Sure Start Maternity Grant 2026/27: a one-off ${g(M.ssmg)} for a first baby or twins on Universal Credit or Pension Credit, claimed from ${M.ssmgClaimWeeksBefore} weeks before the due week.`,
  h1: 'Sure Start Maternity Grant: who gets it, and the deadline to claim',
  intro: 'A single tax-free payment towards a pram, cot and clothes, for families on low-income benefits expecting their first child.',
  resume: `The Sure Start Maternity Grant is a one-off payment of ${g(M.ssmg)} from the Department for Work and Pensions to help with the cost of a new baby in England, Wales and Northern Ireland. You usually qualify if you or your partner get Universal Credit, Pension Credit or income-related Employment and Support Allowance, or have a Support for Mortgage Interest loan, and there are no other children under 16 in your family. The grant is also paid when you already have children if you are expecting twins or triplets, if the older child came to you from someone else when over 12 months old, or if you are a refugee or arrived from Afghanistan or Ukraine. You can claim from ${M.ssmgClaimWeeksBefore} weeks before the week the baby is due until ${M.ssmgClaimMonthsAfter} months after the birth, by post on form SF100 with proof from a midwife or doctor. The money never has to be paid back and does not affect other benefits. In Scotland it is replaced by the Best Start Grant Pregnancy and Baby Payment.`,
  faqs: [
    { q: 'Can I get the Sure Start Maternity Grant for my second baby?', a: `Not usually, because the grant is meant for a first child in the family: having any other child under 16 normally rules it out. The exceptions are a multiple birth, an older child who is someone else’s and came to you after their first birthday, refugee status or humanitarian protection, or arrival from Afghanistan or Ukraine under the schemes. A child who is now 16 or over does not count against you.` },
    { q: 'What is the latest date to claim the Sure Start Maternity Grant?', a: `${M.ssmgClaimMonthsAfter} months after the day your baby is born. If you are adopting or becoming responsible for a baby, it is ${M.ssmgClaimMonthsAfter} months from the date the child was placed with you or you took responsibility. You can post form SF100 before you have the midwife’s evidence to meet the deadline, and the DWP will contact you later to arrange it.` },
    { q: 'I have just applied for Universal Credit. Can I still claim the maternity grant?', a: `Yes. Send the SF100 within the claim window anyway, because the grant depends on being entitled to a qualifying benefit, and a recent Universal Credit claim simply makes the decision slower. The DWP normally replies within ${M.ssmgDecisionDays} days of receiving the form and evidence, but warns that a new Universal Credit claim can take longer to confirm.` },
    { q: 'Does the £500 maternity grant reduce my Universal Credit?', a: `No. The Sure Start Maternity Grant is not counted as income for Universal Credit or any other benefit, and it is not a loan, so nothing is deducted later. It is paid straight into your bank, building society or credit union account. A Budgeting Advance or Budgeting Loan, by contrast, does have to be repaid from future benefit.` },
  ],
  body: (h) => `
<h2>How much you get</h2>
<p>The grant is ${h.gbp(M.ssmg)} for each qualifying baby. When there are already children in the family, a multiple birth can still bring a payment, and ${h.src('govSsmg', 'GOV.UK’s table')} shows how much depends on the multiple births you have had before.</p>
${h.table(['Children under 16 already', 'One baby', 'Twins', 'Triplets'], [
  ['None', grant(1, 0), grant(2, 0), grant(3, 0)],
  ['One or more, none from a multiple birth', grant(1, 1), grant(2, 1), grant(3, 1)],
  ['You have had twins', grant(1, 2), grant(2, 2), grant(3, 2)],
  ['You have had triplets', grant(1, 3), grant(2, 3), grant(3, 3)],
], 'Sure Start Maternity Grant by family situation (GOV.UK); exceptions for refugees and children taken on later are separate', ['l', 'r', 'r', 'r'])}
<p>The logic is simple once you see it: the grant pays for each new baby beyond the largest group of children already born together in your family. A mother of a five-year-old who is expecting twins receives ${grant(2, 1)}, for the second twin; a mother of four-year-old twins expecting triplets receives ${grant(3, 2)}.</p>

<h2>The benefit you must be getting</h2>
<p>You or your partner must get one of these at the date you claim:</p>
<ul>
<li>Universal Credit, at any amount, including a small award reduced by earnings;</li>
<li>Pension Credit;</li>
<li>income-related Employment and Support Allowance;</li>
<li>or a Support for Mortgage Interest loan.</li>
</ul>
<p>Child Benefit alone does not qualify, and neither do PIP, Carer’s Allowance or contribution-based ESA. The point of the test is that the household is on a low-income benefit; a family whose Universal Credit is reduced to a few pounds by earnings still qualifies, while a family earning just too much for any Universal Credit does not. If you are not sure whether you would get Universal Credit, run the ${h.a('universal-credit-calculator', 'Universal Credit calculator')}: a pregnancy is also a good moment to check, since the child element is added from the birth.</p>

<h2>The first-child rule and its exceptions</h2>
<p>Normally there must be no other child under 16 in your family. ${h.src('govSsmgElig', 'The eligibility page')} lists the cases where an existing child does not block the grant:</p>
<ul>
<li>you are expecting more than one baby;</li>
<li>the child you already care for is someone else’s, not your partner’s, and was over 12 months old when they came to live with you, as in kinship care;</li>
<li>you have refugee status or humanitarian protection, left Afghanistan after the collapse of its government on 15 August 2021, or lived in Ukraine before 1 January 2022 and left because of the Russian invasion; the grant is then paid for your first child born in the UK;</li>
<li>you are claiming for a family member who lives with you and is having their first child, if they are under 16, or 16 to 19 and in approved full-time education or unpaid training.</li>
</ul>
<p>The last case covers a teenage daughter still at school or college: her parent, if on a qualifying benefit, claims the grant for her baby. Approved education means more than ${P.childBenefit.fullTimeHours} hours a week of supervised study on courses such as A levels, T levels or vocational qualifications up to level 3, not a degree.</p>

<h2>If you are not giving birth</h2>
<p>Adoptive parents, guardians and parents through surrogacy can also claim if they get a qualifying benefit. The baby must be under ${M.ssmgAdoptAgeUnderMonths} months old on the date of the claim, and one of these must apply: the baby has been placed with you for adoption, you have permission to adopt from abroad, you hold a parental order after a surrogate birth, you have been appointed guardian, or you hold an adoption or residence order. The claim must be made within ${M.ssmgClaimMonthsAfter} months of the placement or of becoming responsible.</p>

<h2>When and how to claim</h2>
<p>The window opens ${M.ssmgClaimWeeksBefore} weeks before the week your baby is due, which is around the 29th week of pregnancy, and closes ${M.ssmgClaimMonthsAfter} months after the birth. A claim received after that is out of time, so note the opening date as soon as you know your due date. The claim is made on paper:</p>
<ol>
<li>print and fill in form SF100;</li>
<li>ask your midwife or doctor for evidence of the pregnancy or birth, either a MAT B1 certificate or a signed statement;</li>
<li>post both to Freepost DWP SSMG, with no stamp or postcode needed.</li>
</ol>
<p>${h.src('govSsmgClaim', 'GOV.UK’s claim page')} has the form and the helpline for questions or alternative formats. A letter with the decision normally arrives within ${M.ssmgDecisionDays} days. If the claim is refused and you think the decision is wrong, ask for a mandatory reconsideration before appealing. Northern Ireland uses its own form and postal address.</p>

<h2>Scotland: the Pregnancy and Baby Payment instead</h2>
<p>If you live in Scotland you cannot get the Sure Start Maternity Grant. Social Security Scotland pays the ${h.a('best-start-grant', 'Best Start Grant Pregnancy and Baby Payment')} instead: ${h.gbp(P.scotland.bsgPregnancyFirst, 2)} for a first child and ${h.gbp(P.scotland.bsgPregnancySubsequent, 2)} for later children, so unlike the grant it is paid for second and third babies too. It can be claimed once you reach the end of the 24th week of pregnancy, and you cannot receive both payments for the same baby. A family moving from England to Scotland during pregnancy should check which one applies on the date of the claim.</p>

<h2>Other money around the birth</h2>
<p>The grant sits alongside the payments that replace earnings. An employee who does not qualify for Statutory Maternity Pay, and a self-employed mother, can claim ${h.a('maternity-allowance', 'Maternity Allowance')} of up to ${h.gbp(M.maStandard, 2)} a week. Once the baby is born, claim ${h.a('child-benefit-rates', 'Child Benefit')} straight away, since it can be backdated only ${P.childBenefit.backdateMonths} months, and report the birth on your Universal Credit journal so the child element is added. Families on certain benefits facing a large one-off cost after that can look at ${h.a('budgeting-loan', 'a Budgeting Loan')}, which is interest-free but repaid.</p>
`,
});
