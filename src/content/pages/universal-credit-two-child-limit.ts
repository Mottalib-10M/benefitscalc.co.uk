import { definePage } from '../../lib/guide-types';
import { P, weeklyToMonthly } from '../../lib/engine/params';
import { computeUc, childElements } from '../../lib/engine/uc';
import { formatMoney, displayDate } from '../../lib/format';

const U = P.uc;
const C = P.benefitCap;
const g = (n: number, d = 2) => formatMoney(n, d);
const d = (iso: string) => displayDate(iso, 'en-GB');
// Worked example: couple aged 34 and 36, four children, housing association rent £750.
const fam = { couple: true, age: 34, partnerAge: 36, children: 4, housing: 'social' as const, rent: 750 };
const out = computeUc({ ...fam, earnings: 0 });
const working = computeUc({ ...fam, earnings: 950 });
const cbMonth = weeklyToMonthly(P.childBenefit.eldest + 3 * P.childBenefit.additional);
const cappedUc = Math.min(out.maximum, C.monthly.restFamily - cbMonth);

export default definePage({
  id: 'universal-credit-two-child-limit',
  group: 'uc',
  order: 30,
  mini: 'twoChildLimit',
  related: ['universal-credit-rates', 'universal-credit-calculator', 'benefit-cap-calculator', 'universal-credit-childcare-costs', 'child-benefit-rates', 'benefits-in-northern-ireland'],
  sources: ['govUcChildren', 'nidTwoChild', 'dwpRates', 'govBenefitCap'],
  slug: 'universal-credit-two-child-limit',
  nav: 'Two-child limit',
  card: 'The limit ended on 6 April 2026: what a third or fourth child now adds, and where the cap still bites.',
  title: 'Universal Credit Two-Child Limit 2026: What Ended in April',
  description: `Universal Credit two-child limit ended 6 April 2026: ${g(U.child)} a month now paid for a third and later child, from May or June. Benefit cap still applies.`,
  h1: 'The two-child limit has gone: what larger families now receive',
  intro: 'Nine years after it began, the rule that stopped child payments at two children ended with the 2026/27 tax year.',
  resume: `The two-child limit in Universal Credit ended on ${d(U.twoChildLimitEnded)}. Since then the child element of ${g(U.child)} a month is paid for every child who normally lives with you, not just the first two, so a family with three children gains ${g(U.child)} a month and a family with five gains ${g(U.child * 3)}. Nobody had to make a new claim: the DWP recalculated existing awards, and GOV.UK says the higher payment arrived from May or June 2026, depending on when each household’s monthly assessment period falls. Northern Ireland ended the limit on the same date. The benefit cap was not changed, so a family out of work with high rent may see little or none of the increase: outside London the cap is ${g(C.monthly.restFamily)} a month for a couple or lone parent. Earning ${g(C.earningsExemptMonthly, 0)} a month between you, or receiving a disability benefit such as PIP, lifts the cap and lets the full amount through.`,
  faqs: [
    { q: 'Do I need to tell Universal Credit about my third child now the limit has ended?', a: `If the child is already listed in your claim, no: the DWP reassessed awards itself and the extra ${g(U.child)} appeared on statements from May or June 2026. If a child was never added because you thought they would not count, report them now through “Report a change of circumstances” in your account, with their name and date of birth, so the child element can start.` },
    { q: 'Why did my Universal Credit not go up after the two-child limit ended?', a: `The usual reason is the benefit cap. The extra child element counts towards the cap, so a household already at ${g(C.monthly.restFamily)} a month outside London, or ${g(C.monthly.londonFamily)} in London, keeps the same total. Earnings of ${g(C.earningsExemptMonthly, 0)} a month or more, or a disability benefit in the household, remove the cap. Earnings above the work allowance can also absorb part of the rise.` },
    { q: 'Are the two-child limit exceptions for twins and adopted children still relevant?', a: `Not for new payments. Multiple births, adoption, kinship care and children conceived without consent were exceptions that let a third child be paid before ${d(U.twoChildLimitEnded)}. Since that date every child counts, so the exception forms are no longer needed to receive the child element. They only matter if you are asking for a decision about a period before April 2026 to be looked at again.` },
    { q: 'Can I get back payments for the years my third child was excluded?', a: `No. The change applies from ${d(U.twoChildLimitEnded)}; neither GOV.UK nor nidirect describes any payment for earlier years. The only route to money for a past period is to show that an exception applied at the time, for example a multiple birth or adoption, and was missed. nidirect gives an email address for backdated exception requests in Northern Ireland; in Great Britain, ask Universal Credit through your journal.` },
    { q: 'Did the end of the two-child limit change Child Benefit?', a: `No. Child Benefit never had a two-child limit: it has always been paid for every child, at ${g(P.childBenefit.eldest)} a week for the eldest and ${g(P.childBenefit.additional)} for each other child in 2026/27. The limit applied to the child element of Universal Credit and to Child Tax Credit. Child Benefit counts towards the benefit cap, which is why the cap can still hold back the new child element.` },
  ],
  body: (h) => `
<h2>What the rule was, and what replaced it</h2>
<p>From ${h.date(U.twoChildLimitStart)} until ${h.date(U.twoChildLimitEnded)}, Universal Credit paid the child element for at most two children, unless a child was born before ${h.date(U.twoChildLimitStart)} or one of a short list of exceptions applied. A third child born in 2019 to a family on Universal Credit brought no child element at all, although the family still received Child Benefit, any disabled child addition and help with childcare for that child. Official statistics published by the DWP in July 2026 describe the policy as affecting Universal Credit and Child Tax Credit claimants between April 2017 and April 2026.</p>
<p>The replacement is simple: ${h.src('govUcChildren', 'GOV.UK now says')} that Universal Credit “pays the extra amount for every child, no matter how many children you have.” The child element is ${h.gbp(U.child, 2)} a month each, or ${h.gbp(U.firstChildPre2017, 2)} for an eldest child born before April 2017. The exceptions for multiple births, adoption, kinship care and non-consensual conception no longer decide whether a child is paid for.</p>

<h2>What larger families gain each month</h2>
${h.table(['Children in the claim', 'Child elements paid before', 'Paid now', 'Extra a month', 'Extra a year'], [3, 4, 5, 6].map((n) => [
  String(n), h.gbp(childElements(2), 2), h.gbp(childElements(n), 2), h.gbp(childElements(n) - childElements(2), 2), h.gbp((childElements(n) - childElements(2)) * 12),
]), 'Child elements before and after 6 April 2026, at 2026/27 rates, assuming no exception applied before', ['l', 'r', 'r', 'r', 'r'])}
<p>These are maximum gains. They reach your bank account in full only when nothing else holds the award down: earnings above the work allowance reduce the whole award at ${Math.round(U.taper * 100)}p in the pound, and the benefit cap can stop the total rising at all.</p>

<h2>When the increase arrived</h2>
<p>The change took effect on ${h.date(U.twoChildLimitEnded)}, but Universal Credit is worked out over monthly assessment periods and paid ${U.paidDaysAfterPeriod} days after each one ends, so the first higher payment depended on where each household’s period fell: GOV.UK says increases were paid “from May or June onwards”. It tells claimants to check the statement for the period, and ${h.src('nidTwoChild', 'nidirect')} confirms that anyone due an increase in Northern Ireland had received it by June 2026. ${h.a('universal-credit-payment-dates', 'Universal Credit payment dates')} shows how to find your own assessment period.</p>

<h2>The benefit cap still applies</h2>
<p>The government kept the benefit cap unchanged, and the extra child elements count towards it. For a family whose income comes only from benefits, the cap often matters more than the end of the limit.</p>
<p>Take a couple aged 34 and 36 with four children, renting from a housing association for ${h.gbp(750)} a month, with no earnings. Their Universal Credit before the cap would be ${h.gbp(out.maximum, 2)}, but the cap outside London is ${h.gbp(C.monthly.restFamily, 2)}, and the cap counts their Child Benefit of about ${h.gbp(cbMonth, 2)} a month as well, so Universal Credit can be no more than about ${h.gbp(cappedUc, 2)}. The two extra child elements change nothing for them. If one partner takes a job paying ${h.gbp(950)} a month after tax, the household passes the ${h.gbp(C.earningsExemptMonthly)} earnings exemption, the cap stops applying and Universal Credit becomes ${h.gbp(working.award, 2)} on top of the wages. A PIP or Carer’s Allowance award in the household would lift the cap in the same way. The ${h.a('benefit-cap-calculator', 'benefit cap calculator')} checks your own figures.</p>
${h.table(['Benefit cap 2026/27', 'Couple or lone parent', 'Single, no children'], [
  ['Greater London, a month', h.gbp(C.monthly.londonFamily, 2), h.gbp(C.monthly.londonSingle, 2)],
  ['Elsewhere, a month', h.gbp(C.monthly.restFamily, 2), h.gbp(C.monthly.restSingle, 2)],
], 'Benefit cap levels (DWP rates 2026 to 2027)', ['l', 'r', 'r'])}

<h2>A new baby or a child joining the household</h2>
<p>A child born or arriving after ${h.date(U.twoChildLimitEnded)} is handled like any other: report the birth or the move in your account and the child element of ${h.gbp(U.child, 2)} is added, whatever the number of brothers and sisters already in the claim. Before April 2026 a family with two children had to look for an exception before a third child was paid for; that step has gone. If the new child is disabled, the disabled child addition of ${h.gbp(U.disabledChildLower, 2)} or ${h.gbp(U.disabledChildHigher, 2)} follows once DLA or PIP is awarded.</p>

<h2>Northern Ireland</h2>
<p>The Department for Communities ended the limit on the same day. Claimants already including more than two eligible children were reassessed automatically, with the same warning that the benefit cap may keep the payment from rising. The child element, the disabled child additions and the cap levels match those in Great Britain.</p>

<h2>Children who still do not bring a child element</h2>
<p>Ending the limit did not change who counts as your child for Universal Credit. A child you foster does not attract the child element or the disabled child addition. A young person aged 16 to 19 stays in the claim only while in full-time non-advanced education, at least ${U.fullTimeEducationHours} hours a week of lessons in term time, or approved unpaid training, and payments stop on the 31 August after their 19th birthday at the latest. GOV.UK also lists a child no longer living with you, going into council care other than respite, or being held in custody as reasons the child amount can stop.</p>
`,
});
