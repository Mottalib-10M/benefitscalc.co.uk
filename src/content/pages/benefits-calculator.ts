import { definePage } from '../../lib/guide-types';
import { P, weeklyToMonthly } from '../../lib/engine/params';
import { computeUc } from '../../lib/engine/uc';
import { childBenefitWeekly } from '../../lib/engine/family';
import { formatMoney, formatPercent } from '../../lib/format';

const g = (n: number, d = 2) => formatMoney(n, d);
// Worked example = the checker's default household: single parent aged 35, one child, £900 take-home, private rent £650.
const uc = computeUc({ couple: false, age: 35, children: 1, earnings: 900, housing: 'private', rent: 650 });
const cb = weeklyToMonthly(childBenefitWeekly(1));

export default definePage({
  id: 'benefits-calculator',
  group: 'nations',
  order: 10,
  tool: 'checker',
  related: ['universal-credit-calculator', 'pension-credit-calculator', 'pip-points-calculator', 'carers-allowance-calculator', 'benefit-rates', 'benefits-in-scotland'],
  sources: ['govCalculators', 'dwpRates', 'govUc', 'hmrcCbRates', 'scotUprating'],
  slug: 'benefits-calculator',
  nav: 'Benefits calculator',
  card: 'One short form for every benefit your household could get, with a link to the full calculator for each.',
  title: 'Benefits Calculator 2026/27: Check What Your Household Gets',
  description: `Benefits calculator 2026/27: Universal Credit, Child Benefit, PIP, Pension Credit, Carer’s Allowance and Scottish payments in one form, from ${g(P.uc.standard.single25)} a month.`,
  h1: 'Benefits calculator: what your household could get this year',
  intro: 'Nine questions, one total: a first estimate of every main benefit, then the calculator that goes into detail for each.',
  resume: `This benefits calculator gives a first monthly estimate for a whole household from nine answers: age, couple or single, children, take-home income, housing, rent, disability, caring and where you live. Below State Pension age it works out Universal Credit with the 2026/27 rates, from a standard allowance of ${g(P.uc.standard.single25)} a month at 25 or over plus ${g(P.uc.child)} for each child, minus ${formatPercent(P.uc.taper, 0)} of each pound earned above the work allowance, and applies the benefit cap. It adds Child Benefit (${g(P.childBenefit.eldest)} a week for the eldest child), PIP or Adult Disability Payment at the standard rate when daily living is affected, and Carer’s Allowance when caring ${P.carers.hoursPerWeek} hours a week and earning no more than ${g(P.carers.earningsLimit)} a week. From age 66 it switches to Pension Credit, Attendance Allowance and the Winter Fuel Payment. In Scotland it adds Scottish Child Payment of ${g(P.scotland.childPayment)} a week per child. Each line links to a full calculator that asks the extra questions the estimate leaves out.`,
  faqs: [
    { q: 'Why does the checker give less Universal Credit than the full calculator for private rent?', a: `The checker takes your rent as entered. The Universal Credit calculator asks for your Broad Rental Market Area and caps rent at the Local Housing Allowance for the bedrooms you are allowed, which can be lower or, if you entered a low rent, the same. It also asks about health, childcare and savings, which the checker skips. Use the full calculator before relying on a figure.` },
    { q: 'Does this benefits calculator work for Northern Ireland?', a: `For most lines, yes: Universal Credit, Child Benefit, PIP, Pension Credit and Carer’s Allowance use the same rates there. Rent is taken as entered, because Northern Ireland’s ${P.lha.niAreas} Local Housing Allowance areas are set by the Housing Executive and not modelled here. Rates, Northern Ireland’s version of Council Tax, are not included either.` },
    { q: 'Which independent calculators does GOV.UK recommend?', a: `GOV.UK lists three free, anonymous calculators for income-related and contribution-based benefits, Universal Credit, Council Tax Reduction and Carer’s Allowance: those of entitledto, Turn2us and Policy in Practice. They ask for more detail and cover cases this site does not, such as students, transitional protection and self-employment. They are not meant for under-18s or people living abroad.` },
  ],
  body: (h) => `
<h2>A household run through the checker</h2>
<p>The form opens on a single parent aged 35 with one child, taking home ${h.gbp(900)} a month and renting privately for ${h.gbp(650)}. Universal Credit comes out at ${h.gbp(uc.award, 2)}: a maximum of ${h.gbp(uc.maximum, 2)}, less ${h.pct(P.uc.taper, 0)} of earnings above the lower work allowance of ${h.gbp(P.uc.workAllowanceLower)}. Child Benefit adds about ${h.gbp(cb, 2)} a month. Change the rent type to social, or the location to Scotland, and the lines change with it; Scottish Child Payment of ${h.gbp(P.scotland.childPayment * 52 / 12, 2)} a month appears for the child.</p>

<h2>What the estimate covers and leaves out</h2>
${h.table(['Included', 'Not included'], [
  [`Universal Credit standard allowance, child and carer elements, ${h.pct(P.uc.taper, 0)} taper, benefit cap`, 'Local Housing Allowance cap (in the full calculator), health element, childcare costs'],
  ['Child Benefit for every child', `High Income Child Benefit Charge above ${h.gbp(P.childBenefit.hicbcThreshold)} (in its own calculator)`],
  ['PIP or ADP at the standard rate if daily living is affected', 'The PIP points test, enhanced rates (in the PIP calculator)'],
  ['Pension Credit guarantee at 66 or over, Attendance Allowance lower rate', 'Savings credit, Housing Benefit, Council Tax Reduction'],
  ['Carer’s Allowance with the earnings limit', 'Transitional protection, self-employment, students, mixed-age couples'],
], 'Scope of the benefits checker, 2026/27', ['l', 'l'])}
<p>Each line of the result links to the page that goes further: ${h.a('universal-credit-calculator', 'Universal Credit')}, ${h.a('pip-points-calculator', 'PIP points')}, ${h.a('pension-credit-calculator', 'Pension Credit')} and ${h.a('carers-allowance-calculator', 'Carer’s Allowance')}. The rates come from the ${h.src('dwpRates', 'DWP table for 2026 to 2027')} and are listed in one place on ${h.a('benefit-rates', 'the benefit rates page')}.</p>

<h2>When to use another calculator</h2>
<p>${h.src('govCalculators', 'GOV.UK')} points to three independent calculators run by entitledto, Turn2us and Policy in Practice. They take longer, ask about Council Tax and outgoings, and handle situations this site does not model. GOV.UK warns that none of them is accurate for students, people on strike or people living abroad. If you already get older benefits such as tax credits or income-based JSA, check before claiming Universal Credit: once you claim, those benefits stop and cannot be restarted.</p>
<p>Scotland and Northern Ireland have their own versions of several benefits; ${h.a('benefits-in-scotland', 'benefits in Scotland')} and ${h.a('benefits-in-northern-ireland', 'benefits in Northern Ireland')} set out the differences.</p>
`,
});
