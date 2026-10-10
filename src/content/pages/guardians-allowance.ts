import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { guardiansAllowance } from '../../lib/engine/family-grants';
import { formatMoney } from '../../lib/format';

const GA = P.guardiansAllowance;
const CB = P.childBenefit;
const g = (n: number, d = 2) => formatMoney(n, d);
const one = guardiansAllowance(1, 1);
const ex = guardiansAllowance(2, 2);

export default definePage({
  id: 'guardians-allowance',
  group: 'family',
  order: 90,
  mini: 'guardianAllowance',
  miniHref: 'child-benefit-calculator',
  related: ['child-benefit-rates', 'child-benefit-calculator', 'bereavement-support-payment', 'high-income-child-benefit-charge', 'universal-credit-calculator'],
  sources: ['govGuardian', 'govGuardianElig', 'hmrcCbRates', 'cpRegs19'],
  slug: 'guardians-allowance',
  nav: 'Guardian’s Allowance',
  card: 'A tax-free weekly payment for bringing up a child whose parents have died.',
  title: 'Guardian’s Allowance 2026/27: Weekly Rate and Who Qualifies',
  description: `Guardian’s Allowance 2026/27: ${g(GA.weekly)} a week per child, tax-free, on top of Child Benefit, for bringing up a child whose parents have died, and how to claim.`,
  h1: 'Guardian’s Allowance: the weekly rate and the conditions',
  intro: 'A small, little-known payment for grandparents, relatives and friends raising an orphaned child, paid with Child Benefit.',
  resume: `Guardian’s Allowance is ${g(GA.weekly)} a week for each child in 2026/27, up from ${g(GA.previous)} in 2025/26, paid by HMRC to someone bringing up a child whose parents have died. It comes on top of Child Benefit, so a grandmother raising one orphaned grandchild receives ${g(one.totalWeekly)} a week in total, about ${g(one.totalYear, 0)} a year. In most cases both parents must have died, but the allowance can also be paid when one parent has died and the other cannot be found after reasonable efforts, will be in prison for at least ${GA.prisonYears} years from the date of the death, or is detained in hospital by court order. You must qualify for Child Benefit for the child, and one of the parents must have been born in the UK, the EEA or Switzerland, or have lived in the UK for a set period. The allowance is tax-free, ignored by Universal Credit, outside the benefit cap and untouched by the High Income Child Benefit Charge. Claims can be backdated by up to ${GA.backdateMonths} months.`,
  faqs: [
    { q: 'Can a grandparent get Guardian’s Allowance?', a: `Yes. You do not need to be the child’s legal guardian, despite the name: the allowance goes to whoever is bringing up the child and qualifies for Child Benefit for them, which includes grandparents, aunts, uncles, older siblings and family friends. What matters is that the parents have died, or one has died and the other meets one of the specific conditions about prison, hospital or being untraceable.` },
    { q: 'Does Guardian’s Allowance stop if I adopt the child?', a: `Not if you were already receiving it before the adoption. GOV.UK says you may keep Guardian’s Allowance after adopting a child as long as you were getting it beforehand. The safe course is to claim as soon as the child comes to live with you, before any adoption order is made, and to keep the award letter with the adoption papers.` },
    { q: 'Is Guardian’s Allowance paid if I opt out of Child Benefit because of the tax charge?', a: `Yes. You must be entitled to Child Benefit, but you do not have to be paid it. A guardian whose income is above ${g(CB.hicbcThreshold, 0)} can opt out of the Child Benefit payments to avoid the tax charge and still receive ${g(GA.weekly)} a week of Guardian’s Allowance, which is not subject to the charge at all.` },
    { q: 'What if the surviving parent starts paying towards the child?', a: `You must report it straight away, along with other changes such as finding out where the surviving parent is, or that parent leaving prison or hospital or having a sentence shortened. These changes can end entitlement where the claim relied on one surviving parent. Report by phone or post to the Guardian’s Allowance Unit; late reporting can lead to an overpayment you have to repay.` },
  ],
  body: (h) => `
<h2>The rate and its recent history</h2>
<p>There is a single flat rate, set by HMRC for each tax year from 6 April and paid for every qualifying child. It does not depend on income, savings or the child’s age, and it is paid in full alongside the higher or lower rate of Child Benefit.</p>
${h.table(['Tax year', 'Guardian’s Allowance a week', 'A year (52 weeks)'], [
  ['2026 to 2027', h.gbp(GA.weekly, 2), h.gbp(GA.weekly * 52, 2)],
  ['2025 to 2026', h.gbp(GA.previous, 2), h.gbp(GA.previous * 52, 2)],
  ['2024 to 2025', h.gbp(GA.prior2024, 2), h.gbp(GA.prior2024 * 52, 2)],
], 'Guardian’s Allowance rates by tax year (HMRC rates and allowances)', ['l', 'r', 'r'])}
<p>An aunt bringing up two orphaned nephews gets ${h.gbp(ex.gaWeekly, 2)} a week of Guardian’s Allowance plus ${h.gbp(ex.cbWeekly, 2)} of Child Benefit, ${h.gbp(ex.totalWeekly, 2)} in all or about ${h.gbp(ex.totalYear)} a year. If she already had a child of her own, the eldest child in the household would take the higher Child Benefit rate, but the Guardian’s Allowance would be the same.</p>

<h2>Who qualifies</h2>
<p>${h.src('govGuardianElig', 'GOV.UK lists three conditions')} that must all be met:</p>
<ol>
<li>you are bringing up someone else’s child;</li>
<li>the child’s parents have died, or one has died and a surviving-parent condition applies;</li>
<li>you qualify for Child Benefit for the child.</li>
</ol>
<p>There is also a link to the UK through the parents: at least one of them must have been born in the UK, an EEA country or Switzerland, or have lived in the UK for at least ${GA.parentResidenceWeeks} weeks in any two-year period after turning 16. This rarely causes problems for children of UK residents, but it can matter for a child arriving from abroad after a parent’s death.</p>

<h3>When one parent is still alive</h3>
<p>The allowance can be paid when one parent has died and the other:</p>
<ul>
<li>cannot be found, and you have made a reasonable effort to contact them;</li>
<li>will be in prison for at least ${GA.prisonYears} years from the date of the other parent’s death;</li>
<li>is detained in hospital by a court order.</li>
</ul>
<p>Separation, divorce or a parent who simply plays no part in the child’s life is not enough while that parent can be found. A father serving a sentence that will end ${GA.prisonYears} years and a few months after the mother’s death meets the condition; one due for release after 18 months does not. Keep a record of the attempts made to trace a missing parent, such as letters, messages to relatives and searches, in case HMRC asks how you tried.</p>

<h2>Effect on other benefits and tax</h2>
<p>Guardian’s Allowance does not count as income for Universal Credit, Income Support, income-based Jobseeker’s Allowance or income-related ESA, so nothing is lost elsewhere. It does not count towards the benefit cap. It is tax-free, and the ${h.a('high-income-child-benefit-charge', 'High Income Child Benefit Charge')} does not touch it: a guardian who opts out of Child Benefit payments because of a high income keeps the allowance. A kinship carer on ${h.a('universal-credit-calculator', 'Universal Credit')} also gets the child element for the child, so the two payments sit side by side.</p>

<h2>How the allowance is paid</h2>
<p>Payments normally go into a bank account every four weeks with Child Benefit. Single parents and people getting certain benefits, such as Income Support, can have it weekly. A Nationwide Building Society account in someone else’s name cannot be used. Like Child Benefit, it continues until the child stops qualifying, at 16 or up to 20 if they stay in approved education or training.</p>

<h2>Claiming</h2>
<p>Claim as soon as the child comes to live with you, since payment can be backdated only ${GA.backdateMonths} months, the limit set by ${h.src('cpRegs19', 'regulation 19 of the Claims and Payments Regulations')}. A guardian who claims eight months after taking a child in loses about five months of the allowance, around ${h.gbp(GA.weekly * 21.7)} for one child.</p>
<ol>
<li>Fill in claim form BG1 from ${h.src('govGuardian', 'GOV.UK')}, or call the Guardian’s Allowance Unit for a claim pack.</li>
<li>Send it with the child’s full birth certificate and the parents’ death certificates, or the one certificate if only one parent has died. Originals are required.</li>
<li>Make a ${h.a('child-benefit-rates', 'Child Benefit')} claim for the child at the same time if you have not already, because Guardian’s Allowance depends on it.</li>
</ol>
<p>If HMRC refuses the claim, ask for a mandatory reconsideration before appealing.</p>

<h2>Changes you must report</h2>
<p>Tell the Guardian’s Allowance Unit straight away if the child goes to live with someone else, leaves full-time education or approved training, or if you go abroad for more than 8 weeks temporarily or more than a year permanently. In surviving-parent cases, also report if you discover where the parent is, if they leave prison or hospital or their sentence is shortened, or if they start paying towards the child’s upkeep. Changes to bank or contact details are reported the same way, by phone or post.</p>

<h2>Other help after a death in the family</h2>
<p>When a child loses a parent, the surviving partner may be able to claim ${h.a('bereavement-support-payment', 'Bereavement Support Payment')}, up to ${h.gbp(P.bereavement.higherLump)} plus monthly payments, if they were married, in a civil partnership or living together. Where a relative takes over the care of the child instead, Guardian’s Allowance, Child Benefit and the Universal Credit child element are the main payments to check.</p>
`,
});
