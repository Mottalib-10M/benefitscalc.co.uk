import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { computeUc } from '../../lib/engine/uc';
import { formatMoney } from '../../lib/format';

const U = P.uc;
const g = (n: number, d = 2) => formatMoney(n, d);
// Worked example shown in the text: lone parent, two children, £1,200 take-home, social rent £550.
const ex = computeUc({ couple: false, age: 31, children: 2, earnings: 1200, housing: 'social', rent: 550 });

export default definePage({
  id: 'universal-credit-calculator',
  group: 'uc',
  order: 10,
  tool: 'uc',
  related: ['universal-credit-rates', 'universal-credit-work-allowance', 'local-housing-allowance-rates', 'universal-credit-two-child-limit', 'benefits-calculator'],
  sources: ['dwpRates', 'govUc', 'ucRegs22', 'ucRegsSch4', 'lhaUc', 'govBenefitCap'],
  slug: 'universal-credit-calculator',
  nav: 'Universal Credit calculator',
  card: 'Your monthly award element by element, with the rent cap of your area.',
  title: 'Universal Credit Calculator 2026/27: Monthly Award by Area',
  description: 'Universal Credit calculator 2026/27: standard allowance, child, health, carer and childcare elements, rent capped by your area’s LHA, then the 55% taper.',
  h1: 'Universal Credit calculator: your monthly award, line by line',
  intro: 'Six questions give a figure; “More circumstances” adds health, caring, childcare and other income.',
  resume: `Universal Credit for 2026/27 starts from a standard allowance of ${g(U.standard.single25)} a month for a single person aged 25 or over, ${g(U.standard.singleUnder25)} under 25 and ${g(U.standard.couple25)} for a couple where either partner is 25 or over. Each child adds ${g(U.child)} a month, every child counting since the two-child limit ended on 6 April 2026, and rent is added up to the Local Housing Allowance of your area if you rent privately. Earnings then reduce the total by 55p for every pound above the work allowance, which is ${g(U.workAllowanceLower, 0)} a month when the award includes housing costs and ${g(U.workAllowanceHigher, 0)} when it does not, available only to households with children or a health condition that limits work. Savings over ${g(U.capitalLower, 0)} reduce the award and above ${g(U.capitalUpper, 0)} stop it. The calculator shows each of these lines so that you can set the result beside your own statement.`,
  faqs: [
    { q: 'Why is my Universal Credit statement lower than this calculator?', a: `The calculator works out one ordinary month. A statement can be lower because an advance is being repaid, a deduction for rent arrears, Council Tax or an overpayment is being taken (up to 15% of the standard allowance), you were paid twice by your employer in one assessment period, or a sanction applies. Each deduction is listed on the statement under “what we take off”.` },
    { q: 'What do I enter as take-home pay if my wages change every month?', a: `Enter the net pay that landed in the assessment period you want to check: gross pay less income tax, National Insurance and pension contributions. Universal Credit uses the pay your employer reports for that period, not an average, so a four-weekly or weekly payroll can put two paydays into one month and none into the next.` },
    { q: 'How does the calculator know my rent limit?', a: `If you rent privately, choose your Broad Rental Market Area and it applies the 2026/27 Local Housing Allowance for the bedrooms your household is allowed, from the DWP file covering all 192 areas of England, Scotland and Wales. Your council’s housing pages name your area. Social tenants are not capped by area, but lose 14% or 25% of eligible rent for spare bedrooms.` },
    { q: 'Does the calculator include the benefit cap?', a: `Yes. Without an exemption, a household outside London cannot receive more than ${g(P.benefitCap.monthly.restFamily)} a month in total if it is a couple or has children, or ${g(P.benefitCap.monthly.restSingle)} for a single adult, with higher London levels. The cap does not apply if household take-home pay is ${g(P.benefitCap.earningsExemptMonthly, 0)} a month or more, or if anyone gets PIP, DLA, Attendance Allowance or Carer’s Allowance.` },
    { q: 'Can I use it in Northern Ireland?', a: `For the amount, yes: Universal Credit in Northern Ireland uses the same standard allowance, elements and taper. Housing costs differ, because Northern Ireland has its own Local Housing Allowance areas set by the Housing Executive, which the area list here does not include, and the housing element is normally paid straight to the landlord.` },
  ],
  body: (h) => `
<h2>A worked month</h2>
<p>A lone parent aged 31 with two children, renting from a housing association for ${h.gbp(550)} a month and taking home ${h.gbp(1200)}, has a maximum award of ${h.gbp(ex.maximum, 2)}: the standard allowance, two child elements and the rent. Because the award includes housing costs, the lower work allowance of ${h.gbp(ex.workAllowance)} applies, and 55% of the remaining ${h.gbp(1200 - ex.workAllowance)} is ${h.gbp(ex.earningsDeduction, 2)}. Universal Credit for the month is ${h.gbp(ex.award, 2)}, on top of wages. The same household with no rent to pay would have the higher work allowance of ${h.gbp(U.workAllowanceHigher)}, which is why ${h.a('universal-credit-work-allowance', 'the two work allowances')} matter as much as the rent itself.</p>
<h2>What to have to hand</h2>
<p>Your last payslip or the earnings figure on your Universal Credit statement, your tenancy agreement for the monthly rent and any service charges, and a rough total of savings. If you have a fit note or are waiting for a Work Capability Assessment, choose the health option that matches when you reported the condition: ${h.gbp(U.lcwra, 2)} applies to those who reported it before 6 April 2026, people meeting the severe conditions criteria and anyone nearing the end of life; ${h.gbp(U.lcwraNew2026, 2)} applies to most new health claims since then. ${h.a('universal-credit-health-element', 'The health element page')} explains the split.</p>
<h2>What the result leaves out</h2>
<p>The minimum income floor for self-employed claimants, transitional protection for people moved from older benefits, student income, the surplus earnings rule and mixed-age couples are not modelled. Treat the figure as a careful estimate of an ordinary month. For a full check GOV.UK lists independent calculators, and ${h.src('govUc', 'the official guide to what you’ll get')} sets out each element. Our ${h.a('method', 'method page')} gives the regulation behind every line.</p>
`,
});
