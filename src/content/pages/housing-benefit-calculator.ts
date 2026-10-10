import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { computeHbPension } from '../../lib/engine/pension';
import { formatMoney } from '../../lib/format';

const HB = P.housingBenefit;
const g = (n: number, d = 2) => formatMoney(n, d);
const ex = computeHbPension({ couple: false, spaAfterApril2021: true, rent: 140, income: 275, savings: 12000, guaranteeCredit: false });

export default definePage({
  id: 'housing-benefit-calculator',
  group: 'pension',
  order: 90,
  tool: 'hb',
  related: ['housing-benefit', 'pension-credit-calculator', 'local-housing-allowance-rates', 'bedroom-tax', 'pension-credit'],
  sources: ['dwpRates', 'govHb', 'hbSpc51'],
  slug: 'housing-benefit-calculator',
  nav: 'Housing Benefit calculator',
  card: 'Weekly Housing Benefit for a pension-age tenant.',
  title: 'Housing Benefit Calculator 2026/27: Pension-Age Tenants',
  description: `Housing Benefit calculator 2026/27 for tenants over State Pension age: eligible rent less 65% of income above ${g(HB.pensionAgeSingleAfter2021)} a week, or full rent on Guarantee Credit.`,
  h1: 'Housing Benefit calculator for tenants over State Pension age',
  intro: 'Rent, income and savings give a weekly figure; Guarantee Credit means the full eligible rent.',
  resume: `New claims for Housing Benefit are now limited to people over State Pension age and to people in supported, sheltered or temporary housing; working-age tenants claim help with rent through Universal Credit. For a pensioner, the calculation starts from the eligible rent, capped at the Local Housing Allowance for a private tenancy, less fixed deductions for other adults in the home. Anyone getting the Guarantee Credit part of Pension Credit receives that maximum. Otherwise income is compared with an applicable amount of ${g(HB.pensionAgeSingleAfter2021)} a week for a single person who reached State Pension age after 1 April 2021 (${g(HB.pensionAgeSingle)} if earlier), and Housing Benefit falls by 65p for every pound above it. Savings over ${g(HB.capitalDisregardPension, 0)} count as ${g(1, 0)} a week per ${g(500, 0)}, and above ${g(HB.capitalUpper, 0)} there is no award unless you get Guarantee Credit.`,
  faqs: [
    { q: 'Why does the date I reached State Pension age change my Housing Benefit?', a: `The applicable amount for people who reached State Pension age on or after 1 April 2021 is ${g(HB.pensionAgeSingleAfter2021)} a week single and ${g(HB.pensionAgeCoupleAfter2021)} for a couple, the same as the Pension Credit guarantee. Earlier pensioners keep a higher figure of ${g(HB.pensionAgeSingle)} and ${g(HB.pensionAgeCouple)}. A higher applicable amount means less of your income is tapered away.` },
    { q: 'My grown-up son lives with me. How much is taken off?', a: `A non-dependant deduction applies: ${g(HB.nonDepNotWorking)} a week if he is not in paid work, rising with his gross weekly income up to ${g(HB.nonDepWorking[HB.nonDepWorking.length - 1][1])} if he earns ${g(605, 0)} or more. No deduction is made if you or your partner get Attendance Allowance, the daily living part of PIP or the middle or highest DLA care rate.` },
    { q: 'Does Housing Benefit cover Council Tax?', a: 'No. Council Tax Reduction is a separate scheme run by each council, though you can usually apply for both on the same council form. In Northern Ireland, help with rates is claimed through the rate relief schemes instead. Pension Credit Guarantee Credit usually qualifies you for the maximum Council Tax Reduction.' },
  ],
  body: (h) => `
<h2>A worked example</h2>
<p>A single pensioner who reached State Pension age in 2023 rents a flat for ${h.gbp(140)} a week, has ${h.gbp(275)} a week of State Pension and a small workplace pension, and ${h.gbp(12000)} in the bank. Her savings add ${h.gbp(ex.income - 275)} of assumed income, so ${h.gbp(ex.income, 2)} is compared with her applicable amount of ${h.gbp(ex.applicable, 2)}. The excess of ${h.gbp(ex.excess, 2)} reduces the maximum by 65%, leaving Housing Benefit of ${h.gbp(ex.hb, 2)} a week, about ${h.gbp(ex.hb * 52)} a year.</p>
<h2>The rules behind the figure</h2>
<p>The 65% taper is set by ${h.src('hbSpc51', 'regulation 51 of the Housing Benefit regulations for pension-age claimants')}; the applicable amounts and non-dependant deductions come from the ${h.src('dwpRates', 'DWP 2026/27 rates')}. Disability, severe disability and carer premiums can raise the applicable amount and are not added by the calculator, so a disabled pensioner may get more than shown. Private rents are limited to the ${h.a('local-housing-allowance-rates', 'Local Housing Allowance of the area')}; council and housing association tenants of pension age are not affected by ${h.a('bedroom-tax', 'the spare room rules')}.</p>
<p>If the result is close to the full rent, check ${h.a('pension-credit-calculator', 'Pension Credit')} first: a Guarantee Credit award, however small, gives maximum Housing Benefit and Council Tax Reduction.</p>
`,
});
