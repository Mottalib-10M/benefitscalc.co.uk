import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { formatMoney, formatPercent, displayDate } from '../../lib/format';

const U = P.uc;
const V = U.previous;
const g = (n: number, d = 2) => formatMoney(n, d);
const pc = (now: number, before: number) => formatPercent(now / before - 1, 1);
const d = (iso: string) => displayDate(iso, 'en-GB');

export default definePage({
  id: 'universal-credit-rates',
  group: 'uc',
  order: 20,
  mini: 'ucRates',
  related: ['universal-credit-calculator', 'universal-credit-health-element', 'universal-credit-work-allowance', 'universal-credit-childcare-costs', 'benefit-rates', 'benefits-uprating'],
  sources: ['dwpRates', 'govUc', 'govUcWages', 'govUcHealthAmount', 'ucRegs22'],
  slug: 'universal-credit-rates',
  nav: 'Universal Credit rates',
  card: 'Every monthly Universal Credit amount for 2026/27, set against last year.',
  title: 'Universal Credit Rates 2026/27: Every Monthly Amount',
  description: `Universal Credit rates 2026/27: standard allowance ${g(U.standard.single25)} at 25 or over, ${g(U.child)} per child, health, carer and childcare amounts, each beside 2025/26.`,
  h1: 'Universal Credit rates: every amount, this year and last',
  intro: 'One table per building block, each with the 2025/26 figure beside it, so you can see what moved in April.',
  resume: `From April 2026 the Universal Credit standard allowance is ${g(U.standard.singleUnder25)} a month for a single claimant under 25, ${g(U.standard.single25)} at 25 or over, ${g(U.standard.coupleUnder25)} for a couple who are both under 25 and ${g(U.standard.couple25)} when either partner has turned 25. The child element is ${g(U.child)} for every child, or ${g(U.firstChildPre2017)} for an eldest child born before ${d(U.twoChildLimitStart)}, and a disabled child adds ${g(U.disabledChildLower)} or ${g(U.disabledChildHigher)}. The health element (LCWRA) has two rates this year: ${g(U.lcwra)} for people already covered before ${d(U.lcwraReformDate)} or with a severe lifelong condition, and ${g(U.lcwraNew2026)} for most new health claims. The carer element is ${g(U.carer)}, childcare is refunded at ${formatPercent(U.childcareShare, 0)} up to ${g(U.childcareMax1)} for one child or ${g(U.childcareMax2)} for two or more, and the work allowances are ${g(U.workAllowanceLower, 0)} and ${g(U.workAllowanceHigher, 0)}. All figures are monthly and come from the DWP rates table for 2026 to 2027.`,
  faqs: [
    { q: 'How much did the Universal Credit standard allowance go up in April 2026?', a: `For a single person aged 25 or over it went from ${g(V.single25)} to ${g(U.standard.single25)} a month, a rise of ${pc(U.standard.single25, V.single25)}. A couple with one partner aged 25 or over moved from ${g(V.couple25)} to ${g(U.standard.couple25)}. That is more than the ${formatPercent(P.upratingCPI, 1)} applied to most disability and carer benefits. The new rates apply automatically; you do not need to report anything to receive them.` },
    { q: 'Which Universal Credit amount did not rise in 2026/27?', a: `The limited capability for work amount stayed at ${g(U.lcw)} a month, the same as in 2025/26. Only people whose health claim started before ${d(U.lcwPre2017Date)} still receive it. The capital limits did not move either: savings under ${g(U.capitalLower, 0)} are ignored, ${g(U.tariffPer250)} is assumed per ${g(250, 0)} above that, and the upper limit remains ${g(U.capitalUpper, 0)}.` },
    { q: 'Are Universal Credit rates weekly or monthly?', a: `Monthly. Every Universal Credit amount in the DWP table, from the ${g(U.standard.single25)} standard allowance to the ${g(U.nonDepDeduction)} housing cost contribution, is a figure for one assessment period of a calendar month. If you want a weekly figure to compare with a wage or an older benefit, multiply the monthly amount by 12 and divide by 52.` },
    { q: 'Is the higher child amount for a first child born before 2017 still paid?', a: `Yes. When the eldest child in the claim was born before ${d(U.twoChildLimitStart)}, that child attracts ${g(U.firstChildPre2017)} a month instead of ${g(U.child)}, an extra ${g(U.firstChildPre2017Extra)}. Every other child gets the standard child amount. The extra stops when that eldest child leaves the claim, usually on the 31 August after their 16th birthday, or later if they stay in non-advanced education.` },
    { q: 'Do the 2026/27 Universal Credit rates apply in Northern Ireland?', a: `Yes. The Department for Communities pays Universal Credit in Northern Ireland at the same monthly rates as the DWP: the same standard allowances, child, disabled child, health, carer and childcare amounts and the same work allowances. What differs is housing, with its own Local Housing Allowance areas, and the housing element, which is normally paid straight to the landlord.` },
  ],
  body: (h) => `
<h2>Standard allowance</h2>
<p>Every award starts from one standard allowance for the household. Age is the only thing that changes it, and in a couple it is enough for one partner to be 25 or over for the higher couple rate to apply. ${h.a('universal-credit-under-25', 'Claimants under 25')} have their own page because the lower rate also feeds into sanctions and deductions.</p>
${h.table(['Household', '2025/26', '2026/27', 'Change'], [
  ['Single, under 25', h.gbp(V.singleUnder25, 2), h.gbp(U.standard.singleUnder25, 2), pc(U.standard.singleUnder25, V.singleUnder25)],
  ['Single, 25 or over', h.gbp(V.single25, 2), h.gbp(U.standard.single25, 2), pc(U.standard.single25, V.single25)],
  ['Couple, both under 25', h.gbp(V.coupleUnder25, 2), h.gbp(U.standard.coupleUnder25, 2), pc(U.standard.coupleUnder25, V.coupleUnder25)],
  ['Couple, one or both 25 or over', h.gbp(V.couple25, 2), h.gbp(U.standard.couple25, 2), pc(U.standard.couple25, V.couple25)],
], 'Universal Credit standard allowance, monthly (DWP benefit and pension rates 2026 to 2027)', ['l', 'r', 'r', 'r'])}

<h2>Children and disabled children</h2>
<p>The child element is now paid for every child who normally lives with you, since ${h.a('universal-credit-two-child-limit', 'the two-child limit ended')} on ${h.date(U.twoChildLimitEnded)}. The disabled child addition is paid on top of the child element, never instead of it: the higher amount goes with the highest care rate of Disability Living Allowance, the enhanced daily living rate of PIP, or a child who is blind or severely sight impaired; any other DLA or PIP award gives the lower amount.</p>
${h.table(['Amount', '2025/26', '2026/27'], [
  ['Each child', h.gbp(V.child, 2), h.gbp(U.child, 2)],
  [`Eldest child born before ${h.date(U.twoChildLimitStart)}`, h.gbp(V.firstChildPre2017, 2), h.gbp(U.firstChildPre2017, 2)],
  ['Disabled child, lower addition', h.gbp(V.disabledChildLower, 2), h.gbp(U.disabledChildLower, 2)],
  ['Disabled child, higher addition', h.gbp(V.disabledChildHigher, 2), h.gbp(U.disabledChildHigher, 2)],
], 'Monthly amounts per child', ['l', 'r', 'r'])}

<h2>Health and caring</h2>
<p>This is the block that changed shape in April. The Universal Credit Act 2025 split the LCWRA amount in two: the protected rate of ${h.gbp(U.lcwra, 2)} rose with the rest of the table, while new claims that do not meet the severe conditions criteria now receive ${h.gbp(U.lcwraNew2026, 2)}, roughly half the old figure. The ${h.a('universal-credit-health-element', 'health element guide')} explains who falls on which side of the line. A claimant cannot hold the carer element and the LCWRA element at the same time; where both would apply, only the health amount is paid.</p>
${h.table(['Amount', '2025/26', '2026/27'], [
  ['LCWRA, protected or severe conditions or end of life', h.gbp(V.lcwra, 2), h.gbp(U.lcwra, 2)],
  [`LCWRA, new health claims from ${h.date(U.lcwraReformDate)}`, h.gbp(V.lcwra, 2), h.gbp(U.lcwraNew2026, 2)],
  [`LCW, claims started before ${h.date(U.lcwPre2017Date)}`, h.gbp(V.lcw, 2), h.gbp(U.lcw, 2)],
  ['Carer element', h.gbp(V.carer, 2), h.gbp(U.carer, 2)],
], 'Health and carer amounts, monthly', ['l', 'r', 'r'])}

<h2>Childcare caps and work allowances</h2>
<p>Childcare costs are paid back at ${h.pct(U.childcareShare, 0)} of what you paid, but never above the monthly cap. The work allowance is the slice of take-home pay ignored before the ${h.pct(U.taper, 0)} taper starts, and only households with children or a limited capability for work get one. The lower figure applies whenever the award contains help with rent.</p>
${h.table(['Amount', '2025/26', '2026/27'], [
  ['Childcare cap, one child', h.gbp(V.childcareMax1, 2), h.gbp(U.childcareMax1, 2)],
  ['Childcare cap, two or more children', h.gbp(V.childcareMax2, 2), h.gbp(U.childcareMax2, 2)],
  ['Higher work allowance (no housing costs)', h.gbp(V.workAllowanceHigher, 2), h.gbp(U.workAllowanceHigher, 2)],
  ['Lower work allowance (housing costs in the award)', h.gbp(V.workAllowanceLower, 2), h.gbp(U.workAllowanceLower, 2)],
], 'Childcare and work allowance amounts, monthly', ['l', 'r', 'r'])}

<h2>What is taken away from the total</h2>
<p>Three figures reduce the maximum rather than add to it. A housing cost contribution of ${h.gbp(U.nonDepDeduction, 2)} (previously ${h.gbp(V.nonDepDeduction, 2)}) comes off the rent for most adult sons, daughters or other relatives living with you, unless an exemption applies. Capital between ${h.gbp(U.capitalLower)} and ${h.gbp(U.capitalUpper)} is treated as producing ${h.gbp(U.tariffPer250, 2)} a month for each ${h.gbp(250)} or part of it, unchanged from 2025/26. Earnings above any work allowance are taken at ${h.pct(U.taper, 0)}. Separately, repayments of advances and debts are capped at ${h.pct(U.maxDeductionShare, 0)} of the standard allowance, which is ${h.gbp(U.maxDeduction.single25, 2)} for a single person aged 25 or over; ${h.a('universal-credit-deductions', 'the deductions page')} lists each band.</p>

<h2>A household priced at 2026/27 rates</h2>
<p>Take a couple in their thirties with three children, the eldest born in 2015, renting from a housing association. Their standard allowance is ${h.gbp(U.standard.couple25, 2)}. The eldest child brings ${h.gbp(U.firstChildPre2017, 2)} and the two younger ones ${h.gbp(U.child * 2, 2)} between them, so the children add ${h.gbp(U.firstChildPre2017 + U.child * 2, 2)}. Before rent, earnings or childcare, the household's maximum is ${h.gbp(U.standard.couple25 + U.firstChildPre2017 + U.child * 2, 2)} a month. A year earlier the same family, with the third child excluded by the old limit, would have started from ${h.gbp(V.couple25 + V.firstChildPre2017 + V.child, 2)}. Their rent is then added, the lower work allowance of ${h.gbp(U.workAllowanceLower)} is applied to the wages, and the ${h.a('universal-credit-calculator', 'Universal Credit calculator')} does the rest.</p>

<h2>Checking your statement against the table</h2>
<p>Your online statement lists each element under “your entitlement” for the assessment period. If a line differs from the table, look first at the dates: a statement from before the April change will match the 2025/26 column, not the new one. Then check the household line, because GOV.UK warns that a change of circumstances, such as moving in with a partner or turning 25, can affect the whole assessment period in which it happens. A missing element, such as the carer amount, is usually one that was never reported: extras are not added automatically.</p>

<h2>Where the figures come from</h2>
<p>Every number on this page is copied from the ${h.src('dwpRates', 'DWP benefit and pension rates 2026 to 2027')}, the table that also lists the previous year, and matches the amounts on ${h.src('govUc', 'GOV.UK’s guide to what you’ll get')}. The work allowances are fixed in ${h.src('ucRegs22', 'regulation 22 of the Universal Credit Regulations 2013')}. Rates change each April, so check the year printed on any table you compare with. Amounts for other benefits are gathered on ${h.a('benefit-rates', 'the benefit rates page')}.</p>
`,
});
