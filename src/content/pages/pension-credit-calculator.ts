import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { computePensionCredit } from '../../lib/engine/pension';
import { formatMoney } from '../../lib/format';

const PC = P.pensionCredit;
const g = (n: number, d = 2) => formatMoney(n, d);
// Example used in the text: single pensioner, State Pension £205 a week, £14,200 of savings.
const ex = computePensionCredit({ couple: false, income: 205, savings: 14200 });

export default definePage({
  id: 'pension-credit-calculator',
  group: 'pension',
  order: 10,
  tool: 'pc',
  related: ['pension-credit', 'pension-credit-savings-credit', 'housing-benefit-calculator', 'attendance-allowance', 'state-pension-amount'],
  sources: ['dwpRates', 'govPc', 'govPcElig', 'spca3', 'spcRegs7'],
  slug: 'pension-credit-calculator',
  nav: 'Pension Credit calculator',
  card: 'Guarantee Credit and Savings Credit from your weekly income and savings.',
  title: 'Pension Credit Calculator 2026/27: Guarantee and Savings',
  description: `Pension Credit calculator 2026/27: income topped up to ${g(PC.guaranteeSingle)} a week (couple ${g(PC.guaranteeCouple)}), extra for disability, carers and children, plus Savings Credit.`,
  h1: 'Pension Credit calculator: the weekly top-up you could claim',
  intro: 'Enter weekly pension income and savings; add disability, caring or children if they apply.',
  resume: `Pension Credit has two parts. Guarantee Credit raises weekly income to ${g(PC.guaranteeSingle)} for a single person or ${g(PC.guaranteeCouple)} for a couple in 2026/27, with ${g(PC.severeDisability)} more for a severe disability, ${g(PC.carer)} for a carer and ${g(PC.child)} for each child you are responsible for. Savings Credit, worth up to ${g(PC.savingsMaxSingle)} a week single or ${g(PC.savingsMaxCouple)} for a couple, is only open to people who reached State Pension age before 6 April 2016. Savings up to ${g(PC.capitalDisregard, 0)} are ignored; above that each ${g(500, 0)} or part of it counts as ${g(PC.tariffPer500, 0)} of weekly income, and there is no upper limit. Attendance Allowance, PIP, Child Benefit and Housing Benefit do not count as income. The calculator applies these steps in order and shows which line produced your result.`,
  faqs: [
    { q: 'My State Pension is just over £238. Is it worth applying?', a: `It can be. Housing costs such as service charges, a severe disability, caring or children raise your guaranteed amount above ${g(PC.guaranteeSingle)}, and the calculator adds them. If you reached State Pension age before April 2016, Savings Credit may also pay a few pounds. Even a small award opens Housing Benefit at the maximum, Council Tax Reduction and help with NHS costs.` },
    { q: 'How do I count a private pension paid monthly?', a: 'Turn it into a weekly figure: multiply the monthly amount by 12 and divide by 52. Use the gross amount before tax. A lump sum already taken is not income but becomes savings; what is left of it counts under the savings rule.' },
    { q: 'Does owning my home stop me getting Pension Credit?', a: 'No. The home you live in is not counted as savings, and owners can get Pension Credit like tenants. If you pay ground rent or service charges, enter them as housing costs, because they increase the guaranteed amount. Help with mortgage interest is a separate loan scheme.' },
    { q: 'Can my claim be backdated?', a: `Yes, by up to ${PC.backdateMonths} months, provided you met the conditions during that time. You can also apply up to ${PC.applyMonthsBefore} months before you reach State Pension age, so that payments start on time. Ask for backdating when you apply and have your income and savings figures for the earlier date ready.` },
  ],
  body: (h) => `
<h2>A worked example</h2>
<p>A widow with a State Pension of ${h.gbp(205)} a week and ${h.gbp(14200)} in savings has ${h.gbp(ex.tariff)} of assumed income from her savings, so her income for Pension Credit is ${h.gbp(ex.income, 2)}. Her guaranteed amount is ${h.gbp(ex.smg, 2)}, which leaves Guarantee Credit of ${h.gbp(ex.guarantee, 2)} a week, about ${h.gbp(ex.guarantee * 52)} a year. If she received Attendance Allowance and nobody was paid Carer’s Allowance for looking after her, the severe disability amount of ${h.gbp(PC.severeDisability, 2)} would lift that to ${h.gbp(ex.guarantee + PC.severeDisability, 2)}.</p>
<h2>What to enter</h2>
<p>Use weekly figures before tax: State Pension, workplace and personal pensions, any earnings (only part is counted in reality, so the estimate errs on the low side), Carer’s Allowance and other taxable benefits. Leave out PIP, Attendance Allowance, Disability Living Allowance, Child Benefit and Winter Fuel Payment. A couple enters joint income and joint savings. The calculator does not apply the earnings disregards or the rules for mixed-age couples, who usually claim Universal Credit instead; ${h.a('pension-credit', 'the Pension Credit guide')} covers those cases.</p>
<h2>After the result</h2>
<p>Claim online, by phone or by post through the Pension Service; ${h.src('govPcElig', 'GOV.UK’s eligibility page')} lists the evidence. Savings Credit is explained, with its two-step formula, in ${h.a('pension-credit-savings-credit', 'Savings Credit worked through')}. Tenants should also run ${h.a('housing-benefit-calculator', 'the Housing Benefit calculator')}, since Guarantee Credit gives the full eligible rent.</p>
`,
});
