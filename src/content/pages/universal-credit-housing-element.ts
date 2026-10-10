import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { housingElement } from '../../lib/engine/uc';
import { lhaRate, type BedroomCat } from '../../lib/engine/lha';
import { formatMoney, formatPercent, displayDate } from '../../lib/format';

const U = P.uc;
const L = P.lha;
const g = (n: number, d = 2) => formatMoney(n, d);
const base = { couple: true, age: 33, children: 2, earnings: 0 };
// Example 1: private renters in Birmingham, two children under 10, rent £900, two-bedroom LHA.
const bham = housingElement({ ...base, housing: 'private', rent: 900, nation: 'england', brma: 'Birmingham', bedrooms: 2 });
// Example 2: council tenant, one spare bedroom, rent £560, a son of 24 living at home.
const council = housingElement({ ...base, housing: 'social', rent: 560, spareRooms: 1, nonDependants: 1 });
const AREAS: Array<['england' | 'scotland' | 'wales', string]> = [['england', 'Central London'], ['england', 'Outer East London'], ['england', 'Bristol'], ['england', 'Central Greater Manchester'], ['england', 'Birmingham'], ['england', 'Leeds'], ['scotland', 'Greater Glasgow'], ['wales', 'Cardiff']];
const lha = (n: 'england' | 'scotland' | 'wales', b: string, c: BedroomCat) => lhaRate(n, b, c) ?? 0;

export default definePage({
  id: 'universal-credit-housing-element',
  group: 'uc',
  order: 120,
  mini: 'ucHousing',
  miniHref: 'local-housing-allowance-rates',
  related: ['local-housing-allowance-rates', 'bedroom-tax', 'universal-credit-calculator', 'housing-benefit', 'universal-credit-and-pip', 'benefits-in-northern-ireland'],
  sources: ['ucRegsSch4', 'lhaUc', 'govUc', 'nidUcHousing', 'dwpRates'],
  slug: 'universal-credit-housing-element',
  nav: 'Housing element',
  card: 'How rent is added to Universal Credit: LHA caps, spare-room cuts and non-dependant deductions.',
  title: 'Universal Credit Housing Element 2026/27: Rent Help Rules',
  description: `Universal Credit housing element 2026/27: private rent capped at your area’s LHA, social rent cut ${formatPercent(L.socialSpareOne, 0)} or ${formatPercent(L.socialSpareTwo, 0)} for spare rooms, ${g(U.nonDepDeduction)} per non-dependant.`,
  h1: 'The housing element: how Universal Credit helps with rent',
  intro: 'Who your landlord is decides which rule limits your rent: the area rate or the size of your home.',
  resume: `The housing element adds your rent and eligible service charges to Universal Credit, but how much is allowed depends on the landlord. Private tenants get the lower of their actual rent and the Local Housing Allowance (LHA) for their Broad Rental Market Area and the number of bedrooms their household is allowed, up to four. Those rates have been frozen at their April 2024 level. A single private renter under ${L.sarAgeLimit} without children is usually limited to the shared accommodation rate, the price of a room in a shared house. Council and housing association tenants get their actual rent, reduced by ${formatPercent(L.socialSpareOne, 0)} if they have one bedroom more than they need and ${formatPercent(L.socialSpareTwo, 0)} for two or more. In both sectors, ${g(U.nonDepDeduction)} a month is taken off for most adults aged 21 or over living with you, unless you or they receive certain disability or carer benefits. Bills such as energy and water are never included. In Northern Ireland the housing element normally goes straight to the landlord.`,
  faqs: [
    { q: 'How many bedrooms does Universal Credit allow for my children?', a: `One bedroom for you or for you and your partner, then children are expected to share: two children under 10 can share whatever their sex, and two children of the same sex under 16 can share. Any other child gets their own room, as does each other adult. Private renters are allowed up to 4 bedrooms through the LHA, so a larger family in a five-bedroom house is capped at the four-bedroom rate.` },
    { q: 'Who is exempt from the Universal Credit non-dependant deduction?', a: `No ${g(U.nonDepDeduction)} deduction is made for an adult who lives with you and is under 21, gets Pension Credit, the daily living part of PIP, Attendance Allowance, DLA care at the middle or highest rate, Carer’s Allowance or Carer Support Payment, is in prison, or is responsible for a child under 5. None at all is made if you or your partner are blind or receive PIP daily living, Attendance Allowance or the middle or highest care rate of DLA.` },
    { q: 'Does the Universal Credit housing element pay for service charges and bills?', a: `Some service charges, yes: GOV.UK says the housing element can cover rent and some service charges, and they are added to the rent before any LHA cap or spare-room cut is applied. Utilities are not covered. nidirect states plainly that charges for electricity or gas are excluded, and the same goes for Council Tax, which has its own reduction scheme run by your council.` },
    { q: 'Can my Universal Credit housing element be paid directly to my landlord?', a: `Yes. In Great Britain the rent is normally part of your own payment, but you can ask for a managed payment to landlord, and a landlord can request one if you fall into arrears; you get ${U.objectionDays} days to respond. In Northern Ireland the housing element is paid to the landlord by default, and you can ask to receive it yourself if you meet certain conditions.` },
    { q: 'What if the housing element does not cover my rent?', a: `The gap is yours to pay. Ask your council about extra help: a Discretionary Housing Payment in Scotland or Wales, or support from the Crisis and Resilience Fund in England, which GOV.UK says the benefit cap does not affect. In Northern Ireland, the Housing Executive can pay some or all of the difference for private tenants, and mitigation payments cover the social sector size criteria.` },
  ],
  body: (h) => `
<h2>Private tenants: the Local Housing Allowance</h2>
<p>For a private tenancy the housing element is the lower of the rent you pay and the LHA for your area and bedroom category. The rates for 2026/27 are those of ${h.date(L.frozenSince)} carried forward, published monthly for Universal Credit for all 192 Broad Rental Market Areas of England, Scotland and Wales. A selection:</p>
${h.table(['Area', 'Shared room', '1 bed', '2 beds', '3 beds', '4 beds'], AREAS.map(([n, b]) => [b, ...([0, 1, 2, 3, 4] as BedroomCat[]).map((c) => h.gbp(lha(n, b, c), 2))]), 'Universal Credit LHA rates a month, 2026/27 (DWP and VOA)', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Ellie and Sam, both 33, rent a two-bedroom house in Birmingham for ${h.gbp(900)} with their son of 8 and daughter of 5, who can share a room because both are under 10. Their LHA is ${h.gbp(lha('england', 'Birmingham', 2))}, so the housing element is ${h.gbp(bham.amount, 2)} and ${h.gbp(bham.shortfall, 2)} a month of rent is left for them to cover from other income. Moving to a three-bedroom house would not raise the cap: their household is only allowed two bedrooms. Look up your own area with ${h.a('local-housing-allowance-rates', 'the LHA rates tool')}.</p>
<p>Single people under ${L.sarAgeLimit} without children get the shared accommodation rate. ${h.src('ucRegsSch4', 'Schedule 4')} exempts care leavers aged 18 to 24, people who spent at least ${L.sarHostelMonths} months in homeless hostels and accepted resettlement support, people receiving PIP daily living, Attendance Allowance or the middle or highest care rate of DLA, and some ex-offenders under public protection arrangements. Each of these is assessed for a one-bedroom rate instead.</p>

<h2>Council and housing association tenants</h2>
<p>Social tenants get their actual rent and eligible service charges, with no area cap, but the bedroom rules still apply as a deduction. One bedroom more than the household needs costs ${h.pct(L.socialSpareOne, 0)} of the eligible rent; two or more cost ${h.pct(L.socialSpareTwo, 0)}. A council tenant couple of 33 paying ${h.gbp(560)}, with two young children sharing and one bedroom spare, loses ${h.gbp(560 * L.socialSpareOne, 2)}. If their son of 24 also lives at home and works, the non-dependant deduction of ${h.gbp(U.nonDepDeduction, 2)} comes off as well, and the housing element is ${h.gbp(council.amount, 2)}. ${h.a('bedroom-tax', 'The bedroom tax page')} goes through the room rules and the exceptions.</p>

<h2>Non-dependants: the housing cost contribution</h2>
<p>The contribution is a flat ${h.gbp(U.nonDepDeduction, 2)} a month for each non-dependant, up from ${h.gbp(U.previous.nonDepDeduction, 2)}, whatever they earn. It applies to the rent in both sectors.</p>
${h.table(['No deduction for this person', 'Because'], [
  ['A son, daughter or other adult under 21', 'Age'],
  ['An adult getting Pension Credit', 'Pension age'],
  ['An adult getting PIP daily living, Attendance Allowance or DLA care (middle or highest)', 'Disability'],
  ['An adult getting Carer’s Allowance or Carer Support Payment', 'Caring'],
  ['An adult responsible for a child under 5', 'Young child'],
  ['A son or daughter away on armed forces operations who intends to return', 'Service'],
], 'Exempt non-dependants (Universal Credit Regulations, Schedule 4, paragraph 16)', ['l', 'l'])}
<p>No deduction is made for anyone if the claimant, or either partner in a couple, is blind or receives PIP daily living, Attendance Allowance or the middle or highest care rate of DLA. ${h.a('universal-credit-and-pip', 'PIP and Universal Credit')} shows how much that exemption can be worth.</p>

<h2>Rent rises, moves and evidence</h2>
<p>The housing element does not follow your rent on its own. A rent increase or decrease, a move to a new address, or a partner moving in is a change of circumstances, and GOV.UK lists each of them among the changes to report straight away in your account. Have the evidence ready: a tenancy agreement or a letter from the landlord showing the rent and any service charges. For a private tenant, an increase only raises the housing element if the new rent is still within the LHA for your area. In Northern Ireland, nidirect adds that after a move the housing costs go to the landlord whose details Universal Credit holds at the end of the assessment period, with no split between two landlords.</p>

<h2>Homeowners, and what is never covered</h2>
<p>The housing element is for rent. Owners with a mortgage cannot get it, but GOV.UK says they may be able to get a loan to help with the interest payments. Eligible service charges are added to the rent, while energy and other utility bills are left out even when the landlord collects them with the rent. In Northern Ireland, people in supported housing with care, refuges or Housing Executive temporary accommodation claim Housing Benefit for their rent instead.</p>
`,
});
