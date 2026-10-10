import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { computeHbPension, pcTariff, hbNonDep } from '../../lib/engine/pension';
import { formatMoney, formatPercent, displayDate } from '../../lib/format';

const HB = P.housingBenefit;
const g = (n: number, d = 2) => formatMoney(n, d);
// Worked example: single tenant who reached State Pension age after April 2021, rent £140 a week,
// new State Pension in full plus a £40 workplace pension, £12,000 in savings, no Pension Credit.
const exIncome = P.statePension.newFull + 40;
const ex = computeHbPension({ couple: false, spaAfterApril2021: true, rent: 140, income: exIncome, savings: 12000, guaranteeCredit: false });
const top = HB.nonDepWorking[HB.nonDepWorking.length - 1][1];
const bands = HB.nonDepWorking.map(([lim, d], i) => {
  const from = i === 0 ? 0 : HB.nonDepWorking[i - 1][0];
  const label = i === 0 ? `Less than ${g(lim, 0)}` : i === HB.nonDepWorking.length - 1 ? `${g(from, 0)} or more` : `${g(from, 0)} to ${g(lim - 0.01)}`;
  return [label, d] as [string, number];
});

export default definePage({
  id: 'housing-benefit',
  group: 'housing',
  order: 30,
  mini: 'hbNonDependant',
  miniHref: 'housing-benefit-calculator',
  related: ['housing-benefit-calculator', 'pension-credit', 'local-housing-allowance-rates', 'bedroom-tax', 'universal-credit-housing-element', 'benefit-cap-calculator'],
  sources: ['govHbGet', 'govHb', 'dwpRates', 'hbSpc51', 'hbRegsB13', 'govColHelp'],
  slug: 'housing-benefit',
  nav: 'Housing Benefit',
  card: 'Who can still claim Housing Benefit, how the council works out your rent and what an adult at home costs.',
  title: 'Housing Benefit 2026/27: Who Can Claim and How Much',
  description: `Housing Benefit 2026/27: new claims at State Pension age or in supported housing, rent capped by the LHA, non-dependant deductions from ${g(HB.nonDepNotWorking)} a week each.`,
  h1: 'Housing Benefit: who can still claim it, and how the council works it out',
  intro: 'Closed to most working-age tenants, Housing Benefit is still the way pensioners and people in supported or temporary housing get help with rent.',
  resume: `Housing Benefit is paid by your council towards rent, and in 2026/27 it is mostly a benefit for older tenants. You can make a new claim if you have reached State Pension age, or if you live in temporary accommodation arranged by the council, a refuge, or supported or sheltered housing that provides care, support or supervision. Everyone else below State Pension age claims Universal Credit instead. There is no fixed amount: the council starts from your eligible rent, which for a private tenant is capped at the Local Housing Allowance of your area, and for a working-age social tenant is cut by ${formatPercent(P.lha.socialSpareOne, 0)} or ${formatPercent(P.lha.socialSpareTwo, 0)} for spare bedrooms. It then takes away ${formatPercent(HB.taper, 0)} of any income above your allowance, ${g(HB.pensionAgeSingleAfter2021)} a week for a single pensioner who reached State Pension age from April 2021. Anyone on the Guarantee Credit of Pension Credit gets full eligible rent. Savings above ${g(HB.capitalUpper, 0)} stop a claim unless you get Guarantee Credit, and an adult son or daughter at home can reduce it by ${g(HB.nonDepNotWorking)} to ${g(top)} a week.`,
  faqs: [
    { q: 'Can I claim Housing Benefit if my partner is younger than State Pension age?', a: `Usually not. A couple can make a new claim only if both have reached State Pension age, or if one had already started Pension Credit for the couple before ${displayDate(HB.coupleRuleDate, 'en-GB')}. A claim that existed before that date continues. Otherwise the couple claims Universal Credit, which includes a housing element, until the younger partner reaches State Pension age.` },
    { q: 'Is Housing Benefit paid to me or to my landlord?', a: 'It depends on who you rent from. Council tenants never see the money: it goes straight into the rent account and the rent due falls. Private and housing association tenants are normally paid into their own bank or building society account and pay the landlord themselves. Cheques are rare, and the payment method is set by the type of tenancy rather than chosen.' },
    { q: 'How far ahead can I claim Housing Benefit if I am moving home?', a: `GOV.UK allows a claim up to ${HB.advanceClaimWeeks} weeks before you need it, or ${HB.advanceClaimWeeks60} weeks if you are 60 or over, for example when you have a moving date. You will not normally be paid before you move in. A claim can sometimes be backdated too, but the council decides; claim as soon as you know the date.` },
    { q: 'What happens to my Housing Benefit if I start work or get a pay rise?', a: `Report it straight away. When another benefit stops because you work more or earn more, the council may pay ${HB.extendedPaymentWeeks} more weeks of Housing Benefit (an extended payment) and then work out in-work Housing Benefit on your new income. You do not have to claim either; the council decides and writes to you. Not reporting a change usually leads to an overpayment you must repay.` },
    { q: 'Does Housing Benefit cover heating, water or a mortgage?', a: 'No. Eligible rent is the rent plus service charges you must pay, such as lift maintenance or a communal laundry. Heating, hot water, water rates and energy are taken out. Homeowners cannot claim Housing Benefit for a mortgage at all; Support for Mortgage Interest, which is a loan repaid when the home is sold, may help with the interest instead.' },
  ],
  body: (h) => `
<h2>Who can make a new claim in 2026/27</h2>
<p>Housing Benefit has been closing to new working-age claims since Universal Credit arrived, and ${h.src('govHbGet', 'GOV.UK')} now allows a new claim in two situations only. The first is age: a single person who has reached State Pension age can claim, and so can a couple if both have reached it. The second is the type of home. Temporary accommodation arranged by the council (a bed and breakfast, for instance), a refuge for survivors of domestic abuse, and sheltered or supported housing such as a hostel that provides care, support or supervision are all paid through Housing Benefit, whatever the age of the tenant. A working-age tenant in one of these homes still claims Universal Credit for living costs, and Housing Benefit for the rent alone.</p>
<p>If your supported housing gives you no care, support or supervision, the rent goes into Universal Credit like any other tenancy. And if you leave supported or temporary housing while below State Pension age, Housing Benefit ends and you move to ${h.a('universal-credit-housing-element', 'the Universal Credit housing element')}.</p>

<h2>When the answer is no</h2>
<p>Even at State Pension age, some tenants cannot get Housing Benefit: people with savings over ${h.gbp(HB.capitalUpper)} who do not get Guarantee Credit, homeowners paying a mortgage, anyone renting from a close relative they live with, full-time students, Crown tenants (including service family accommodation) and people whose immigration leave says no public funds. A couple where one partner is under State Pension age is also refused, unless their joint claim started before ${h.date(HB.coupleRuleDate)}.</p>

<h2>How the council arrives at your eligible rent</h2>
<p>For a council or housing association tenancy, eligible rent is the rent plus compulsory service charges, less anything that pays for heating, hot water, lighting or cooking. Working-age social tenants then lose ${h.pct(P.lha.socialSpareOne, 0)} of it for one spare bedroom and ${h.pct(P.lha.socialSpareTwo, 0)} for two or more, under ${h.src('hbRegsB13', 'regulation B13 of the Housing Benefit Regulations 2006')}; pension-age tenants are not affected. ${h.a('bedroom-tax', 'The spare room rules')} list who counts as needing a room.</p>
<p>For a private tenancy, the council compares your rent with the Local Housing Allowance for your area and the bedrooms your household needs, and uses the lower of the two. The allowance is frozen at its April 2024 level for 2026/27. ${h.a('local-housing-allowance-rates', 'The rates of every area')} are on this site in monthly form; Housing Benefit uses the same levels expressed weekly. A private tenant on Housing Benefit without a break since before ${h.date(HB.lhaProtectedBefore)} keeps the older rent rules until moving or losing the claim.</p>

<h2>A pension-age claim worked through</h2>
<p>Take a single tenant who reached State Pension age in 2023, renting a flat for ${h.gbp(140)} a week. She gets the full new State Pension of ${h.gbp(P.statePension.newFull, 2)} and a workplace pension of ${h.gbp(40)}, and has ${h.gbp(12000)} saved. The first ${h.gbp(HB.capitalDisregardPension)} of savings is ignored and the rest counts as ${h.gbp(pcTariff(12000))} a week of income, so the council counts ${h.gbp(ex.income, 2)}. Her allowance, set for people who reached State Pension age from 1 April 2021, is ${h.gbp(HB.pensionAgeSingleAfter2021, 2)}. She is ${h.gbp(ex.excess, 2)} over it, and ${h.src('hbSpc51', 'regulation 51')} takes ${h.pct(HB.taper, 0)} of that from her rent: Housing Benefit is ${h.gbp(ex.hb, 2)} a week, leaving her to pay ${h.gbp(140 - ex.hb, 2)}.</p>
<p>For a single person who reached State Pension age before April 2021, the allowance is ${h.gbp(HB.pensionAgeSingle, 2)}, and for a couple ${h.gbp(HB.pensionAgeCouple, 2)} or ${h.gbp(HB.pensionAgeCoupleAfter2021, 2)}. Anyone getting the Guarantee Credit of ${h.a('pension-credit', 'Pension Credit')} skips the arithmetic: the council pays the whole eligible rent, less any non-dependant deduction. ${h.a('housing-benefit-calculator', 'The Housing Benefit calculator')} runs the same steps on your figures.</p>

<h2>Grown-up children and other adults at home</h2>
<p>An adult who lives with you but is not your partner, such as a son, daughter or friend, is a non-dependant, and the council assumes they pay something towards the rent. It takes a fixed weekly amount off your Housing Benefit, larger the more they earn. The figures come from the ${h.src('dwpRates', 'DWP rates table for 2026/27')}.</p>
${h.table(['Non-dependant’s gross weekly income', 'Deduction a week'], [['Aged 18 or over, not in paid work', h.gbp(HB.nonDepNotWorking, 2)], ...bands.map(([l, d]) => [`In work: ${l}`, h.gbp(d, 2)])], 'Non-dependant deductions from Housing Benefit, 2026/27', ['l', 'r'])}
<p>The council asks for proof of what the non-dependant earns. A daughter earning ${h.gbp(400)} a week gross costs a pensioner ${h.gbp(hbNonDep(true, 400), 2)} a week, over ${h.gbp(hbNonDep(true, 400) * 52)} a year, which is why it pays to tell the council when her hours fall.</p>

<h2>Savings and income the council counts</h2>
<p>Below State Pension age, the first ${h.gbp(HB.capitalLowerWorking)} of savings is ignored; at State Pension age, the first ${h.gbp(HB.capitalDisregardPension)}. Above ${h.gbp(HB.capitalUpper)} there is no Housing Benefit unless you get Guarantee Credit. Pensions, earnings and other benefits count as income, and so does your partner’s. You will be asked for recent payslips, two months of bank statements, proof of other income and your tenancy agreement.</p>

<h2>Extra help when Housing Benefit falls short</h2>
<p>If the benefit does not cover your rent, ask the council for more. In England this help now comes from the council’s Crisis and Resilience Fund, running from ${h.date(P.crf.start)}; in Scotland and Wales, apply for a Discretionary Housing Payment. Councils decide who gets these payments and how much, and ${h.src('govColHelp', 'you do not need to be on benefits')} to ask. In Northern Ireland, Housing Benefit is run by the Housing Executive, which also handles Discretionary Housing Payments.</p>

<h2>Claiming and challenging a decision</h2>
<p>Claim through your council, or as part of a Pension Credit claim: the Pension Service passes the details on, which saves filling in two forms. If you disagree with the decision, ask the council to look at it again, then appeal to a tribunal. The ${h.src('govHb', 'GOV.UK Housing Benefit guide')} has the full list of changes you must report, from a lodger moving in to a stay in hospital.</p>
`,
});
