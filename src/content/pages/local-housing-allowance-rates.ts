import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { allAreas, areas } from '../../lib/engine/lha';
import { formatMoney, displayDate } from '../../lib/format';

const L = P.lha;
const g = (n: number, d = 2) => formatMoney(n, d);
const ALL = allAreas();
const N = ALL.length;
const NATION = { england: 'England', scotland: 'Scotland', wales: 'Wales' } as const;
const by2 = [...ALL].sort((a, b) => b.b2 - a.b2 || a.brma.localeCompare(b.brma));
const top = by2.slice(0, 10);
const bottom = [...by2].reverse().slice(0, 10);
const sorted2 = ALL.map((a) => a.b2).sort((a, b) => a - b);
const median2 = (sorted2[Math.floor((N - 1) / 2)] + sorted2[Math.ceil((N - 1) / 2)]) / 2;
const sars = ALL.map((a) => a.sar);
const sarMin = Math.min(...sars), sarMax = Math.max(...sars);
const hi = top[0], lo = bottom[0];
const scot = areas('scotland'), wales = areas('wales');
const count = (n: 'england' | 'scotland' | 'wales') => areas(n).length;
const weekly = (m: number) => (m * 12) / 52;

export default definePage({
  id: 'local-housing-allowance-rates',
  group: 'housing',
  order: 10,
  tool: 'lha',
  related: ['universal-credit-housing-element', 'universal-credit-calculator', 'housing-benefit', 'bedroom-tax', 'benefit-cap-calculator', 'housing-benefit-calculator'],
  sources: ['lhaUc', 'lhaVoa', 'ucRegsSch4', 'ucRegsSch4p29', 'govHbGet'],
  slug: 'local-housing-allowance-rates',
  nav: 'LHA rates by area',
  card: `The Local Housing Allowance of all ${N} rental areas, from the shared room rate to four bedrooms.`,
  title: `Local Housing Allowance Rates 2026/27: All ${N} Areas`,
  description: `Local Housing Allowance rates 2026/27 for all ${N} areas of England, Scotland and Wales, monthly: 2-bedroom from ${g(lo.b2, 0)} to ${g(hi.b2, 0)}, frozen since April 2024.`,
  h1: 'Local Housing Allowance rates for every rental area',
  intro: `Pick your Broad Rental Market Area, tell us who lives with you, and see the most Universal Credit can pay towards your private rent.`,
  resume: `Local Housing Allowance is the ceiling on help with private rent. For 2026/27 the rates of all ${N} Broad Rental Market Areas in England (${count('england')}), Scotland (${count('scotland')}) and Wales (${count('wales')}) stay at the level set in April 2024, for a third year running, so a tenant whose rent has risen since then pays the whole increase. The monthly 2-bedroom rate runs from ${g(lo.b2)} in ${lo.brma} to ${g(hi.b2)} in ${hi.brma}, with a median of ${g(median2)}. The rate that applies to you depends on the bedrooms your household is allowed: one for you or your couple, one for each other adult, children sharing in pairs, up to ${L.maxBedrooms} bedrooms. A single person under ${L.sarAgeLimit} with no children is limited to the shared accommodation rate, between ${g(sarMin)} and ${g(sarMax)} a month depending on the area, unless an exemption applies. Universal Credit pays the lower of your rent and the rate; Housing Benefit uses the same levels expressed weekly.`,
  faqs: [
    { q: `Why has my Local Housing Allowance not gone up since 2024?`, a: `The government decided to keep every rate at its April 2024 level for 2026/27, as it did for 2025/26. The DWP file for 2026/27 repeats the earlier figures area by area. If your landlord has raised the rent since 2024, Universal Credit or Housing Benefit will not follow, and the difference comes out of your other income unless your council helps.` },
    { q: `Which exemptions lift an under-${L.sarAgeLimit} off the shared room rate?`, a: `Schedule 4 of the Universal Credit Regulations exempts a care leaver under ${L.sarCareLeaverUnder}, someone who spent at least ${L.sarHostelMonths} months in a homeless hostel and accepted resettlement support, anyone getting the daily living part of PIP or ADP, Attendance Allowance or the middle or highest DLA care rate, people managed under MAPPA arrangements, foster carers, survivors of domestic abuse and confirmed victims of modern slavery.` },
    { q: 'How do I find out which Broad Rental Market Area I live in?', a: `Areas follow rental markets, not council boundaries, so one council can sit across two of them. Your council’s Housing Benefit pages or the Valuation Office Agency’s LHA lookup give the area for a postcode. Universal Credit then applies that area automatically from the address on your claim; you never choose it yourself.` },
    { q: 'Does the rate cover service charges and bills as well as rent?', a: `It caps rent and eligible service charges together, such as cleaning of communal areas or lift maintenance. Charges for heating, hot water, lighting, water rates and meals are not housing costs at all. If your rent includes them, the part that pays for them is taken out before the comparison with the Local Housing Allowance.` },
  ],
  body: (h) => `
<h2>The ten dearest and ten cheapest areas</h2>
<p>London fills the top of the table. Two bedrooms in ${hi.brma} are allowed ${h.gbp(hi.b2, 2)} a month, about ${h.num(hi.b2 / lo.b2, 1)} times the ${h.gbp(lo.b2, 2)} allowed in ${lo.brma}. Outside London, the highest 2-bedroom rates are in the commuter belt and the university cities; the lowest are in former coalfield and rural areas of northern England and Wales.</p>
${h.table(['Area', 'Nation', '2 bedrooms a month', 'Shared room a month'], top.map((a) => [a.brma, NATION[a.nation], h.gbp(a.b2, 2), h.gbp(a.sar, 2)]), `Highest 2-bedroom Local Housing Allowance, 2026/27 (DWP, ${N} areas)`, ['l', 'l', 'r', 'r'])}
${h.table(['Area', 'Nation', '2 bedrooms a month', 'Shared room a month'], bottom.map((a) => [a.brma, NATION[a.nation], h.gbp(a.b2, 2), h.gbp(a.sar, 2)]), 'Lowest 2-bedroom Local Housing Allowance, 2026/27', ['l', 'l', 'r', 'r'])}

<h2>Scotland: all ${scot.length} areas</h2>
${h.table(['Area', 'Shared', '1 bed', '2 beds', '3 beds', '4 beds'], scot.map((a) => [a.brma, h.gbp(a.sar), h.gbp(a.b1), h.gbp(a.b2), h.gbp(a.b3), h.gbp(a.b4)]), 'Monthly Universal Credit LHA rates in Scotland, 2026/27', ['l', 'r', 'r', 'r', 'r', 'r'])}

<h2>Wales: all ${wales.length} areas</h2>
${h.table(['Area', 'Shared', '1 bed', '2 beds', '3 beds', '4 beds'], wales.map((a) => [a.brma, h.gbp(a.sar), h.gbp(a.b1), h.gbp(a.b2), h.gbp(a.b3), h.gbp(a.b4)]), 'Monthly Universal Credit LHA rates in Wales, 2026/27', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>The calculator above holds every English area as well; the DWP publishes the ${count('england')} English rates in a separate file.</p>

<h2>How many bedrooms you are allowed</h2>
<p>The size rules for private renters sit in ${h.src('ucRegsSch4', 'Schedule 4 of the Universal Credit Regulations 2013')}. You get one bedroom for yourself or your couple, one for each other person aged 16 or over, and one for each pair of children who can share: two under 16 of the same sex, or two under 10 whatever their sex. An extra room is allowed for a non-resident overnight carer, and for a child or adult who cannot share because of a disability. Nobody is allowed more than ${L.maxBedrooms} bedrooms, so a large family in a five-bedroom house is still assessed at the 4-bedroom rate.</p>
<p>A single claimant under ${L.sarAgeLimit} who has no children and no other adult living with them gets the shared accommodation rate, meant to pay for a room in a shared house. ${h.src('ucRegsSch4p29', 'Paragraph 29')} lists the people excepted from it, which is worth checking: a 23-year-old care leaver renting a studio flat in Lothian is assessed at the 1-bedroom rate of ${h.gbp(scot.find((a) => a.brma === 'Lothian')?.b1 ?? 0, 2)}, not the shared rate.</p>

<h2>Universal Credit monthly, Housing Benefit weekly</h2>
<p>The figures here are the monthly rates the DWP uses for Universal Credit. Housing Benefit, still paid to pensioners and people in supported or temporary housing, uses the weekly rates the Valuation Office Agency publishes for the same areas: the monthly figure × 12 ÷ 52, so ${h.gbp(median2, 2)} a month is about ${h.gbp(weekly(median2), 2)} a week. ${h.src('govHbGet', 'GOV.UK')} notes that a Housing Benefit claim running continuously since before ${h.date(P.housingBenefit.lhaProtectedBefore)} keeps its old rent rules until the tenant moves or the claim breaks. Social tenants are not capped by area at all; their rent is reduced instead for ${h.a('bedroom-tax', 'spare bedrooms')}. Northern Ireland has ${L.niAreas} areas of its own, set by the Housing Executive and not included here; ${h.a('benefits-in-northern-ireland', 'benefits in Northern Ireland')} explains how they work. The rates were read in the ${h.src('lhaUc', 'DWP files')} on ${displayDate(P.retrieved_at, 'en-GB')}.</p>
`,
});
