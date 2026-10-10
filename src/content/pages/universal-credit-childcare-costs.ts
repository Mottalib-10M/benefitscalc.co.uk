import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { computeUc, childcareElement } from '../../lib/engine/uc';
import { formatMoney, formatPercent } from '../../lib/format';

const U = P.uc;
const g = (n: number, d = 2) => formatMoney(n, d);
const share = formatPercent(U.childcareShare, 0);
// Example: Jo, 31, lone parent, two children (nursery and after-school club), housing association rent £700, take-home £1,500.
const jo = { couple: false, age: 31, children: 2, earnings: 1500, housing: 'social' as const, rent: 700 };
const joNo = computeUc(jo);
const joCc = computeUc({ ...jo, childcareCosts: 1100 });
const big = 2400;

export default definePage({
  id: 'universal-credit-childcare-costs',
  group: 'uc',
  order: 70,
  mini: 'childcareCosts',
  related: ['universal-credit-calculator', 'tax-free-childcare-calculator', '30-hours-free-childcare', 'universal-credit-work-allowance', 'universal-credit-rates'],
  sources: ['govUcChildcare', 'govUc', 'dwpRates', 'govTfc'],
  slug: 'universal-credit-childcare-costs',
  nav: 'Childcare costs',
  card: 'Up to 85% of registered childcare refunded each month, up to a cap per family.',
  title: `Universal Credit Childcare Costs 2026/27: ${share} Paid Back`,
  description: `Universal Credit childcare costs 2026/27: ${share} of registered childcare refunded, up to ${g(U.childcareMax1)} a month for one child or ${g(U.childcareMax2)} for two or more children.`,
  h1: 'Getting childcare costs back through Universal Credit',
  intro: 'You pay the nursery or childminder, report the bill, and most of it comes back in your next payment.',
  resume: `Universal Credit pays back up to ${share} of what you spend on childcare while you work. In 2026/27 the most it adds in one monthly assessment period is ${g(U.childcareMax1)} for one child and ${g(U.childcareMax2)} for two or more children, whatever the number above two. You qualify if you are in paid work, or starting a job within the next month; in a couple both partners must work, unless one has limited capability for work, is eligible for Carer’s Allowance or is temporarily away, for example in hospital. There is no minimum number of hours. The childcare must be registered, with Ofsted in England, the Care Inspectorate in Scotland or Care Inspectorate Wales, and can be a nursery, childminder, nanny, breakfast or after-school club or holiday club, for children up to the 31 August after their 16th birthday. You normally pay first, then report the costs with proof in your account, and the refund arrives in your normal payment. Universal Credit cannot be combined with Tax-Free Childcare.`,
  faqs: [
    { q: 'How do I prove childcare costs to Universal Credit?', a: `Upload two things in your account. Proof of the provider: a contract, invoice or letter with the provider’s name, address, phone number and registration number, your children’s names and the type of care. Proof of payment: the dates of care you paid for, the amount and the date you paid. A paid invoice covers both; otherwise combine bank statements with receipts.` },
    { q: 'Can I claim Universal Credit childcare costs paid before the assessment period?', a: `Yes, within limits. You can report costs paid in the current assessment period or the one before it. If you pay in advance, for example a term at once, you can report childcare taking place in the next ${U.childcareClaimAheadPeriods} assessment periods, and each slice is refunded in the period when that care happens. Costs reported later than that are lost, so report as soon as you pay.` },
    { q: 'Does Universal Credit pay childcare costs upfront when starting a new job?', a: `It can. When you start a job, increase your hours or return from parental leave, ask in your journal or at the jobcentre before you pay. GOV.UK says you may have the first month’s cost covered, paid directly to the provider and not repaid. After that, the normal ${share} refund applies. Ask early, because the decision has to come before the bill is due.` },
    { q: 'Do free childcare hours reduce the Universal Credit childcare refund?', a: `Only in the sense that Universal Credit refunds what you actually pay. If a funded entitlement covers part of the week and you pay the nursery for the rest, report the amount you paid and ${share} of it comes back, up to the cap. Free hours and the Universal Credit refund work together, unlike Tax-Free Childcare, which you cannot hold while claiming Universal Credit.` },
    { q: 'Can I get the childcare element while on maternity leave?', a: `Possibly. GOV.UK says you might still qualify while on sick leave or parental leave, because you remain in paid work. A parent on maternity leave who keeps an older child in nursery should report those costs. Without a job to return to, or with a partner who is not working and has no health condition or caring role, the element is not paid.` },
  ],
  body: (h) => `
<h2>The cap in practice</h2>
<p>The refund is the lower of ${h.pct(U.childcareShare, 0)} of what you paid and the cap for your family. Because the cap is a monthly figure, the bill at which it starts to bite is ${h.gbp(U.childcareMax1 / U.childcareShare, 2)} for one child and ${h.gbp(U.childcareMax2 / U.childcareShare, 2)} for two or more; above that, every extra pound is yours to pay.</p>
${h.table(['Monthly childcare bill', 'One child: refund', 'Two or more: refund'], [400, 800, 1200, 1600, big].map((b) => [h.gbp(b), h.gbp(childcareElement(b, 1), 2), h.gbp(childcareElement(b, 2), 2)]), 'Universal Credit childcare costs element by bill, 2026/27', ['l', 'r', 'r'])}
<p>The cap for two or more children was ${h.gbp(U.previous.childcareMax2, 2)} in 2025/26 and ${h.gbp(U.previous.childcareMax1, 2)} for one child. Three or four children in care do not raise it further.</p>

<h2>A worked month</h2>
<p>Jo is 31 and brings up two children alone. She takes home ${h.gbp(1500)} a month and rents from a housing association for ${h.gbp(700)}. Without childcare her Universal Credit would be ${h.gbp(joNo.award, 2)}. In the month she pays ${h.gbp(1100)} for nursery and an after-school club, ${h.pct(U.childcareShare, 0)} of that, ${h.gbp(childcareElement(1100, 2), 2)}, is added to the maximum, and her award rises to ${h.gbp(joCc.award, 2)}. Her own share of the bill is ${h.gbp(1100 - childcareElement(1100, 2), 2)}. The refund is not tapered by her wages: it is added before the ${h.pct(U.taper, 0)} earnings deduction, so the whole ${h.gbp(childcareElement(1100, 2), 2)} reaches her as long as her award does not fall to nil.</p>

<h2>Small jobs count too</h2>
<p>Because there is no hours test, a parent working a short shift pattern qualifies as fully as one in a full-time post. Sam works two mornings a week, takes home ${h.gbp(400)} a month and pays a childminder ${h.gbp(320)} for those mornings. Her pay is below the lower work allowance of ${h.gbp(U.workAllowanceLower)}, so it costs her no Universal Credit at all, and the childminder bill brings an extra ${h.gbp(childcareElement(320, 1), 2)} into her award. Her net cost of childcare is ${h.gbp(320 - childcareElement(320, 1), 2)} a month, which leaves her clearly better off for working those hours.</p>

<h2>Who counts as working</h2>
<p>${h.src('govUcChildcare', 'GOV.UK’s childcare guide')} asks that you, and your partner if you have one, are in paid work or have a job starting within the next month. Hours do not matter: a few hours of paid work a week is enough. Where one partner does not work, the couple still qualifies if that partner:</p>
<ul>
<li>has a health condition or disability giving limited capability for work, with or without work-related activity;</li>
<li>is eligible for Carer’s Allowance; or</li>
<li>has to be away from home temporarily, for example in hospital.</li>
</ul>
<p>If the job ends, report it. Costs for a settling-in period before work starts, or while you change your work pattern, can also be covered.</p>

<h2>What childcare counts</h2>
<p>The provider must be registered with the regulator for its nation: Ofsted in England, the Care Inspectorate in Scotland or Care Inspectorate Wales. Nurseries, childminders, nannies, breakfast clubs, after-school clubs and holiday clubs can all qualify if registered. Ask the provider for its registration number before you sign up, because the DWP asks for it as evidence. Children are covered up to the 31 August after their 16th birthday, which brings in summer holiday clubs for secondary school pupils.</p>

<h2>Timing: why the refund can lag a month</h2>
<p>The rules let you report costs paid in the current assessment period or in the one before it. Anything older cannot be claimed, which makes a forgotten invoice the most common way to lose a refund. When you pay ahead, the refund follows the care rather than the payment: a ${h.gbp(900)} bill paid in July for the next three months of care comes back in three slices, one in each of the periods in which the care takes place. Reporting on the day you pay, with the invoice uploaded at the same time, keeps the refund in step with the bill. Your statement lists the childcare amount separately, so a missing month is easy to spot.</p>

<h2>Universal Credit or Tax-Free Childcare</h2>
<p>You cannot open a Tax-Free Childcare account while you or your partner claim Universal Credit. Tax-Free Childcare adds ${h.pct(P.childcare.tfcTopUpRate, 0)} to what you pay into its account, up to ${h.gbp(P.childcare.tfcMaxQuarter)} a quarter per child, so the government covers ${h.pct(P.childcare.tfcTopUpRate / (1 + P.childcare.tfcTopUpRate), 0)} of the bill; Universal Credit covers ${h.pct(U.childcareShare, 0)}. If you switch, GOV.UK advises waiting for the Tax-Free Childcare decision before cancelling Universal Credit. For most families entitled to any Universal Credit, staying on it gives more help with childcare as well as with living costs. Families whose award is small may compare the two with the ${h.a('tax-free-childcare-calculator', 'Tax-Free Childcare calculator')}, remembering that closing a Universal Credit claim can end other help, such as free school meals.</p>
`,
});
