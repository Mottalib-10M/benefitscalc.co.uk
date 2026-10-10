import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { taxFreeChildcare } from '../../lib/engine/family';
import { formatMoney } from '../../lib/format';

const C = P.childcare;
const g = (n: number, d = 0) => formatMoney(n, d);
// Worked example: one child at nursery, £1,100 a month.
const exMonth = 1100;
const ex = taxFreeChildcare({ quarterlyCost: exMonth * 3, children: 1 });
const add = 8 * C.tfcTopUpRate; // £2 added for every £8 paid in
const capBill = (C.tfcMaxQuarter * (1 + C.tfcTopUpRate)) / C.tfcTopUpRate;

export default definePage({
  id: 'tax-free-childcare-calculator',
  group: 'family',
  order: 40,
  tool: 'tfc',
  related: ['30-hours-free-childcare', 'universal-credit-childcare-costs', 'child-benefit-calculator', 'high-income-child-benefit-charge', 'benefits-calculator'],
  sources: ['govTfc', 'govTfcElig', 'govFreeChildcare', 'govUcChildcare'],
  slug: 'tax-free-childcare-calculator',
  nav: 'Tax-Free Childcare calculator',
  card: 'The government top-up on your childcare bill, up to the quarterly cap per child.',
  title: 'Tax-Free Childcare Calculator 2026/27: Government Top-Up',
  description: `Tax-Free Childcare calculator 2026/27: the government adds ${g(add)} for every £8 you pay in, up to ${g(C.tfcMaxQuarter)} a quarter for each child, or ${g(C.tfcMaxQuarterDisabled)} for a disabled child.`,
  h1: 'Tax-Free Childcare calculator: what the government adds to your bill',
  intro: 'Enter the monthly nursery or club bill and the number of children; the top-up and the cap follow.',
  resume: `Tax-Free Childcare pays 20% of an approved childcare bill: for every £8 you put into an online childcare account, the government adds ${g(add)}, up to ${g(C.tfcMaxQuarter)} every three months for each child, or ${g(C.tfcMaxYear)} a year. For a disabled child the cap doubles to ${g(C.tfcMaxQuarterDisabled)} a quarter and ${g(C.tfcMaxYearDisabled)} a year. The cap is reached when a quarter’s bill hits ${g(capBill)}, so most full-time nursery places use the whole top-up. A child qualifies until the September after their ${C.tfcChildAgeLimit}th birthday, or ${C.tfcDisabledAgeLimit}th if disabled. Each parent must expect to earn at least ${g(C.minEarnQuarter21, 2)} over the next three months if aged 21 or over, and neither can expect adjusted net income above ${g(C.incomeCap)}. The scheme cannot be combined with Universal Credit or employer childcare vouchers. The calculator takes your monthly bill, the number of children and how many are disabled, and returns the quarterly top-up and the year’s total.`,
  faqs: [
    { q: 'How much do I pay in to get the full Tax-Free Childcare top-up?', a: `${g(capBill - C.tfcMaxQuarter)} per child every three months. The government then adds ${g(C.tfcMaxQuarter)}, making ${g(capBill)} available to pay the provider. Paying in more than that is allowed, but the extra receives no top-up. For a disabled child the figures double: ${g((capBill - C.tfcMaxQuarter) * 2)} from you and ${g(C.tfcMaxQuarterDisabled)} from the government.` },
    { q: 'Is Tax-Free Childcare better than Universal Credit childcare costs?', a: `It depends on your income. Universal Credit pays back ${Math.round(P.uc.childcareShare * 100)}% of childcare costs, up to ${g(P.uc.childcareMax1, 2)} a month for one child, but only while you still qualify for Universal Credit. Tax-Free Childcare pays 20% at any income up to ${g(C.incomeCap)}. You cannot have both, so wait for the Tax-Free Childcare decision before ending a Universal Credit claim.` },
    { q: 'Can I use Tax-Free Childcare alongside the 30 free hours?', a: `Yes. The free hours cover a set number of hours, and Tax-Free Childcare can pay for extra hours, meals, nappies and trips charged by the same registered provider. One application covers both schemes in England, and you reconfirm your details every ${C.reconfirmMonths} months in the same childcare account.` },
  ],
  body: (h) => `
<h2>A worked example</h2>
<p>A nursery charges ${h.gbp(exMonth)} a month for a two-year-old, or ${h.gbp(exMonth * 3)} a quarter. Tax-Free Childcare would cover 20% of that, ${h.gbp(exMonth * 3 * 0.2)}, but the top-up stops at ${h.gbp(C.tfcMaxQuarter)}, so the parents pay ${h.gbp(ex.youPay)} into the account and receive ${h.gbp(ex.topUp)} each quarter: ${h.gbp(ex.yearTopUp)} over the year. The same family with a second child at an after-school club would have a second, separate ${h.gbp(C.tfcMaxQuarter)} allowance. A bill of ${h.gbp(capBill / 3, 0)} a month or less per child gets the full 20%.</p>

<h2>Who can open an account</h2>
<p>You, and your partner if you live together, must be working, self-employed, on sick, annual or parental leave, or about to start a job. Each must expect to earn at least ${h.gbp(C.minEarnQuarter21, 2)} over the next three months at 21 or over (${h.gbp(C.minEarnQuarter18, 2)} at 18 to 20, ${h.gbp(C.minEarnQuarterUnder18, 2)} for under-18s and apprentices), which is ${C.minEarnHours} hours a week at the minimum wage. The self-employed in their first year are exempt from the minimum. A partner who is not working can still qualify through Carer’s Allowance or certain incapacity benefits. ${h.src('govTfcElig', 'The full eligibility rules are on GOV.UK')}.</p>
<p>The provider must be registered or approved, such as a nursery, childminder, registered nanny, school or holiday club, and signed up to the scheme. Money paid in usually appears within one working day, with the top-up added at the same moment.</p>

<h2>Keeping it going</h2>
<p>Sign in every ${C.reconfirmMonths} months to confirm your details, or the top-up stops. If you are on Universal Credit, compare the two options first: ${h.a('universal-credit-childcare-costs', 'Universal Credit childcare costs')} can be worth more on lower earnings. Parents of children aged 9 months to 4 in England should also check ${h.a('30-hours-free-childcare', 'the 30 hours of free childcare')}, which uses the same account.</p>
`,
});
