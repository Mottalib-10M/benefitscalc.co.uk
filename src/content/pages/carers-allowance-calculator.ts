import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { carersEarnings } from '../../lib/engine/family';
import { formatMoney } from '../../lib/format';

const CA = P.carers;
const g = (n: number, d = 2) => formatMoney(n, d);
// Worked example: Priya takes home £236 a week, pays £30 into her workplace pension and £45 to a childminder.
const priya = carersEarnings({ netEarnings: 236, pensionContrib: 30, careCosts: 45 });
// Her colleague Dan: £212 take-home, nothing to deduct.
const dan = carersEarnings({ netEarnings: 212 });

export default definePage({
  id: 'carers-allowance-calculator',
  group: 'carers',
  order: 10,
  tool: 'carer',
  related: ['carers-allowance', 'carers-allowance-and-universal-credit', 'carers-allowance-and-state-pension', 'carers-credit', 'carer-support-payment-scotland'],
  sources: ['govCa', 'govCaOverview', 'dwpRates', 'govCaEffect'],
  slug: 'carers-allowance-calculator',
  nav: 'Carer’s Allowance calculator',
  card: `The ${g(CA.earningsLimit, 0)} earnings test with every deduction GOV.UK allows, and what is paid.`,
  title: `Carer’s Allowance Calculator 2026/27: The ${g(CA.earningsLimit, 0)} Earnings Test`,
  description: `Carer’s Allowance calculator 2026/27: check the ${g(CA.earningsLimit, 0)} weekly earnings limit after tax, NI, half your pension contributions and care costs, then the ${g(CA.allowance)} paid.`,
  h1: 'Carer’s Allowance calculator: will your earnings pass the weekly limit?',
  intro: 'Enter your take-home pay and the costs you can deduct; the result is the amount paid a week.',
  resume: `Carer’s Allowance pays ${g(CA.allowance)} a week in 2026/27 to someone caring for at least ${CA.hoursPerWeek} hours a week for a person on a qualifying disability benefit. The main obstacle for carers who work is the earnings limit: your earnings must be ${g(CA.earningsLimit, 0)} a week or less after income tax, National Insurance and allowable expenses. Those expenses are more generous than many people think. Half of what you pay into a pension comes off, as do work equipment and travel between workplaces your employer does not refund. Money you pay someone other than a close relative to look after the disabled person or your children while you work can be deducted up to half of your earnings. Pensions, contributions from people you live with and most lodger income are not earnings at all. The calculator applies these rules in order and tells you how far you are from the limit. It is a cliff edge: a penny over and the allowance is lost for that week.`,
  faqs: [
    { q: 'Can I deduct my bus fare to work from my Carer’s Allowance earnings?', a: `Not the ordinary commute. GOV.UK allows travel costs between different workplaces that your employer does not pay, for example fuel or train fares between two jobs or sites. Getting from home to your usual workplace is not on the list. Equipment you need for the job, such as specialist clothing, and self-employed business costs can be deducted.` },
    { q: 'Does my occupational pension count towards the Carer’s Allowance earnings limit?', a: `No. GOV.UK lists money from an occupational or private pension among payments that do not count as earnings, so a retired teacher with a works pension can still pass the ${g(CA.earningsLimit, 0)} test. The State Pension is different: it is not earnings either, but the overlapping benefits rule means Carer’s Allowance is paid only if the State Pension is below ${g(CA.allowance)}.` },
    { q: 'Can I pay my sister to look after Mum while I work and deduct it?', a: `No. Care costs only count if the person you pay is not your spouse or partner, parent, child or sibling. Paying a neighbour, a registered childminder or a care agency works, up to half of your earnings: GOV.UK’s own example is £100 of earnings and £60 of care costs, of which £50 can be treated as an expense.` },
    { q: 'What if overtime pushes me over the limit in one week only?', a: `Report changes in your income to the Carer’s Allowance Unit. Earnings above ${g(CA.earningsLimit, 0)} after deductions can mean no Carer’s Allowance for that week, and the DWP decides how irregular pay is assessed. Overpayments caused by unreported earnings must be repaid, and they were the subject of a DWP reassessment of cases from 2015 to 2025.` },
  ],
  body: (h) => `
<h2>Two carers, one limit</h2>
<p>Priya cares for her father for 40 hours a week and works part time. She takes home ${h.gbp(236)} a week, pays ${h.gbp(30)} into her workplace pension and ${h.gbp(45)} to a childminder for her son while she works. Half of the pension contribution and all the childcare come off, because ${h.gbp(45)} is less than half of her earnings. Her counted earnings are ${h.gbp(priya.counted, 2)}, ${h.gbp(priya.headroom, 2)} under the limit, so she gets the full ${h.gbp(CA.allowance, 2)} a week.</p>
<p>Her colleague Dan takes home ${h.gbp(212)} with nothing to deduct. He is ${h.gbp(-dan.headroom, 2)} over and gets nothing, even though he earns less than Priya. Being a few pounds over costs him ${h.gbp(CA.allowance * 52)} a year, which is why it pays to list every allowable expense.</p>
${h.table(['', 'Priya', 'Dan'], [
  ['Take-home pay', h.gbp(236, 2), h.gbp(212, 2)],
  ['Less half of pension contributions', h.gbp(15, 2), h.gbp(0, 2)],
  ['Less care costs', h.gbp(45, 2), h.gbp(0, 2)],
  ['Earnings counted', h.gbp(priya.counted, 2), h.gbp(dan.counted, 2)],
  ['Carer’s Allowance a week', h.gbp(priya.eligible ? CA.allowance : 0, 2), h.gbp(dan.eligible ? CA.allowance : 0, 2)],
], `Earnings test against the ${h.gbp(CA.earningsLimit)} limit (GOV.UK eligibility)`, ['l', 'r', 'r'])}

<h2>What the calculator checks, and what it does not</h2>
<p>It applies the deductions listed on ${h.src('govCa', 'GOV.UK’s eligibility page')}, the limit from the ${h.src('dwpRates', 'DWP rates table')} (up from ${h.gbp(CA.previous.earningsLimit)} last year) and, if you enter one, the State Pension overlap. It assumes the other conditions are met: you are ${h.num(CA.minAge)} or over, not in full-time education or studying ${h.num(CA.studyHoursLimit)} hours a week or more, and the person you care for gets PIP daily living, DLA middle or highest care, Attendance Allowance or another qualifying benefit. It does not show the effect on other benefits: Universal Credit is reduced by the full allowance, and the person you care for may lose a severe disability premium, as ${h.src('govCaEffect', 'GOV.UK explains')}. ${h.a('carers-allowance-and-universal-credit', 'Carer’s Allowance and Universal Credit')} and ${h.a('carers-allowance', 'the full Carer’s Allowance guide')} cover those effects.</p>
`,
});
