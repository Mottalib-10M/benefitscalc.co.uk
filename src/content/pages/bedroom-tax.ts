import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { socialBedroomsNeeded, socialSizeCriteria } from '../../lib/engine/support';
import { formatMoney, formatPercent } from '../../lib/format';

const L = P.lha;
const g = (n: number, d = 2) => formatMoney(n, d);
const p0 = (x: number) => formatPercent(x, 0);
// Households used in the table: rent £520 a month, housing association.
const RENT = 520;
const cases: Array<[string, number, number]> = [
  ['Widow aged 58, alone in a 2-bedroom flat', 2, socialBedroomsNeeded({ otherAdults: 0, children: 0 })],
  ['Couple whose two sons have left, 3-bedroom house', 3, socialBedroomsNeeded({ otherAdults: 0, children: 0 })],
  ['Lone parent, girl of 12 and boy of 8, 3 bedrooms', 3, socialBedroomsNeeded({ otherAdults: 0, children: 2, childRooms: 2 })],
  ['Couple, two girls aged 9 and 14, 3 bedrooms', 3, socialBedroomsNeeded({ otherAdults: 0, children: 2 })],
  ['Couple and son aged 19, 3 bedrooms', 3, socialBedroomsNeeded({ otherAdults: 1, children: 0 })],
];
const one = socialSizeCriteria({ eligibleRent: RENT, bedrooms: 2, needed: 1 });
const two = socialSizeCriteria({ eligibleRent: RENT, bedrooms: 3, needed: 1 });

export default definePage({
  id: 'bedroom-tax',
  group: 'housing',
  order: 40,
  mini: 'bedroomTax',
  miniHref: 'universal-credit-calculator',
  related: ['universal-credit-housing-element', 'housing-benefit', 'local-housing-allowance-rates', 'benefits-in-scotland', 'benefits-in-northern-ireland', 'benefit-cap-calculator'],
  sources: ['govHbGet', 'hbRegsB13', 'ucRegsSch4', 'scotHousingCosts', 'nidHbChanges', 'nidUcHousing'],
  slug: 'bedroom-tax',
  nav: 'Bedroom tax',
  card: 'The 14% and 25% spare room cut for social tenants, who needs a room, and how each nation softens it.',
  title: 'Bedroom Tax 2026/27: Spare Room Cut, Rules and Exemptions',
  description: `Bedroom tax 2026/27: ${p0(L.socialSpareOne)} of eligible rent for one spare room, ${p0(L.socialSpareTwo)} for two, who counts as needing a bedroom, pension age exemption and help in each nation.`,
  h1: 'The bedroom tax: how the spare room cut works, and who escapes it',
  intro: 'Council and housing association tenants of working age lose part of their housing support for every bedroom the rules say they do not need.',
  resume: `The bedroom tax, officially the social sector size criteria or removal of the spare room subsidy, reduces Housing Benefit or the Universal Credit housing element for working-age tenants of councils and housing associations who have more bedrooms than the rules allow. The cut is ${p0(L.socialSpareOne)} of eligible rent for one spare bedroom and ${p0(L.socialSpareTwo)} for two or more. On a rent of ${g(RENT, 0)} a month that is ${g(one.reduction)} a month, or ${g(one.yearly, 0)} a year, for one spare room and ${g(two.reduction)} a month for two. A bedroom is allowed for each couple, each other person aged 16 or over, each pair of children under 16 of the same sex, each pair under 10 whatever their sex, and any other child. Nothing is cut once the tenant, or both partners, have reached State Pension age, and private tenants are assessed under Local Housing Allowance instead. Scotland pays the whole cut back through Discretionary Housing Payments, Northern Ireland through Welfare Supplementary Payments, and in England councils can help from the Crisis and Resilience Fund.`,
  faqs: [
    { q: 'Does the bedroom tax apply once I reach State Pension age?', a: `No. The spare room cut is in the working-age rules only: a single tenant who has reached State Pension age, or a couple who both have, keeps full eligible rent. In Northern Ireland nidirect says the cut does not apply if you or your partner have reached State Pension age. A mixed-age couple on Universal Credit can still be affected until the younger partner reaches it.` },
    { q: 'Can my children be made to share a bedroom with a big age gap?', a: `The rules only look at age and sex. Two children under 16 of the same sex are expected to share, and so are two children under 10 of any sex, so a 15-year-old and a 3-year-old brother count as one room. A child who cannot share because of a disability or medical condition gets a room of their own, which the council or DWP will want evidence for.` },
    { q: 'Is a room counted as spare while my student son is away at university?', a: `No. GOV.UK says a bedroom used by a student or a member of the armed or reserve forces is not treated as spare while they are away, if they intend to come back. The same applies in Northern Ireland. The room counts again if they move out for good, so report the change when they do.` },
    { q: 'I foster children. Do I lose a room between placements?', a: `An approved foster carer is allowed one extra bedroom, including for up to ${P.housingBenefit.fosterSpareWeeks} weeks after a placement ends and for up to ${P.housingBenefit.fosterSpareWeeks} weeks from approval if no child has been placed yet. After that the room counts as spare if it stays empty. nidirect notes that a foster child is not counted as a child needing a room; the extra bedroom is what covers the placement.` },
    { q: 'Will a Discretionary Housing Payment in Scotland cover the whole cut?', a: `The Scottish Government says it fully mitigates the bedroom tax through Discretionary Housing Payments: if you are affected you can apply to your council and should receive one. The payment is made by the council, not Social Security Scotland, and you usually have to apply. It covers the bedroom cut, not a general rent shortfall.` },
  ],
  body: (h) => `
<h2>What the cut takes, household by household</h2>
<p>The size criteria compare the bedrooms in your home with the bedrooms your household is allowed. Each room over that number is “spare”. The table shows five housing association households, all paying ${h.gbp(RENT)} a month in rent and eligible service charges.</p>
${h.table(['Household', 'Bedrooms', 'Allowed', 'Spare', 'Cut a month'], cases.map(([label, beds, need]) => { const r = socialSizeCriteria({ eligibleRent: RENT, bedrooms: beds, needed: need }); return [label, beds, need, r.spare, r.reduction ? h.gbp(r.reduction, 2) : 'None']; }), `Social sector size criteria on a rent of ${h.gbp(RENT)} a month, 2026/27`, ['l', 'r', 'r', 'r', 'r'])}
<p>The lone parent keeps all three rooms because a girl of 12 and a boy of 8 cannot be made to share: they are of different sexes and the girl is over 10. Two sisters of 9 and 14 are expected to share, so their parents are treated as having one room too many. The widow, if she were over State Pension age, would lose nothing at all.</p>

<h2>Who is allowed a bedroom</h2>
<p>${h.src('hbRegsB13', 'Regulation B13 of the Housing Benefit Regulations 2006')} and the matching rules in ${h.src('ucRegsSch4', 'Schedule 4 of the Universal Credit Regulations')} give one bedroom for each of these, taking the first that fits:</p>
<ul>
<li>a couple, or a member of a couple who cannot share because of a disability;</li>
<li>any other person aged 16 or over, such as a grown-up son or daughter;</li>
<li>two children of the same sex under 16;</li>
<li>two children under 10, boys or girls;</li>
<li>any other child, and a child who cannot share because of a disability.</li>
</ul>
<p>One extra bedroom is allowed when you, your partner or a child need a carer who does not live with you but sometimes stays overnight, and for approved foster carers. Rooms belonging to students or armed forces members who are away and intend to return are not spare. A rough way to check: one room for the adults in charge, one for every other adult, then pair up the children by age and sex.</p>

<h2>How it shows on your award</h2>
<p>On Housing Benefit the council lowers your eligible rent before the rest of the calculation, as in the ${h.src('govHbGet', 'GOV.UK example')} where ${h.gbp(100)} a week with one spare room becomes ${h.gbp(socialSizeCriteria({ eligibleRent: 100, bedrooms: 2, needed: 1 }).after)}. On Universal Credit the housing element is reduced in the same proportion, and your statement shows the lower figure.</p>
<p>A couple with a 3-bedroom council house whose children have left lose ${h.pct(L.socialSpareTwo, 0)}. On ${h.gbp(RENT)} that is ${h.gbp(two.reduction, 2)} a month, ${h.gbp(two.yearly)} a year, which the tenants must find from other income or by moving. A large household can be hit by this cut and by the ${h.a('benefit-cap-calculator', 'benefit cap')} at the same time.</p>

<h2>Who is not affected</h2>
<p>Pension-age tenants are outside the rules; the ${h.src('scotHousingCosts', 'Scottish Government')} describes the policy as applying to working-age council or housing association tenants. Private tenants are not affected either, because their help is already capped at the ${h.a('local-housing-allowance-rates', 'Local Housing Allowance')} for the bedrooms they need. In Northern Ireland, ${h.src('nidHbChanges', 'nidirect')} also lists people in supported accommodation, temporary accommodation, houseboats, caravans and mobile homes, and shared co-ownership schemes as unaffected, and says an extra room may be allowed after a recent bereavement in the household.</p>

<h2>How each nation softens the cut</h2>
${h.table(['Nation', 'Help available', 'Who runs it'], [
  ['Scotland', 'Discretionary Housing Payment, intended to cover the whole cut', 'Your council (funded by the Scottish Government)'],
  ['Northern Ireland', 'Welfare Supplementary Payment, usually paid to the landlord', 'Department for Communities'],
  ['Wales', 'Discretionary Housing Payment, at the council’s discretion', 'Your council'],
  ['England', 'Crisis and Resilience Fund, at the council’s discretion', 'Your council'],
], 'Mitigation of the social sector size criteria in 2026/27', ['l', 'l', 'l'])}
<p>In Scotland the Scottish Government says an affected tenant who applies should receive a payment. In ${h.a('benefits-in-northern-ireland', 'Northern Ireland')}, ${h.src('nidUcHousing', 'nidirect')} says tenants hit by the size criteria on Universal Credit are entitled to mitigation payments, which normally go to the landlord, and that these continue when Housing Benefit is replaced by Universal Credit. In Wales and England the help depends on the council’s budget and its view of your case, so explain what you have cut back and whether you are looking for a smaller home.</p>

<h2>Practical steps</h2>
<p>Check the number of bedrooms the council or DWP has recorded for your home against your tenancy agreement. If your household has changed, a child reaching 10 or 16, a partner moving in, a carer starting overnight stays, report it, because the number allowed can rise as well as fall. If you disagree with a decision, ask for it to be looked at again within the time limit printed on the letter, and apply for help with the shortfall at the same time.</p>
`,
});
