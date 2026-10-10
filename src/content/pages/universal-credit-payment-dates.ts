import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { ucPayment, type UcNation } from '../../lib/engine/ucDates';
import { diffDays } from '../../lib/engine/dates';
import { formatMoney, displayDate } from '../../lib/format';

const U = P.uc;
const g = (n: number, d = 2) => formatMoney(n, d);
const d = (iso: string) => displayDate(iso, 'en-GB');
// GOV.UK example (Sam): claim 10 September, first assessment period to 9 October, paid 17 October.
const sam = ucPayment('2026-09-10', 1);
const xmas = ucPayment('2026-11-18', 1);
const advance = 344;
const advanceMonthly = Math.round((advance / U.advanceRepayMonths) * 100) / 100;
const EXAMPLES: Array<[string, UcNation, string]> = [
  ['2026-10-10', 'englandWales', 'England or Wales'],
  ['2026-10-23', 'englandWales', 'England or Wales'],
  ['2026-10-23', 'scotland', 'Scotland'],
  ['2026-11-18', 'englandWales', 'Anywhere in the UK'],
  ['2026-11-21', 'englandWales', 'Anywhere in the UK'],
  ['2027-01-31', 'englandWales', 'Anywhere in the UK'],
  ['2027-02-10', 'northernIreland', 'Northern Ireland'],
];

export default definePage({
  id: 'universal-credit-payment-dates',
  group: 'uc',
  order: 100,
  mini: 'ucPaymentDates',
  related: ['universal-credit-calculator', 'universal-credit-deductions', 'universal-credit-work-allowance', 'pip-payment-dates', 'benefits-in-scotland'],
  sources: ['govUcPaid', 'ucRegs21', 'govBankHolidays', 'govUcAdvance'],
  slug: 'universal-credit-payment-dates',
  nav: 'Payment dates',
  card: 'Your first payment about five weeks after claiming, then the same date each month.',
  title: 'Universal Credit Payment Dates 2026/27: When Money Arrives',
  description: `Universal Credit payment dates 2026/27: paid ${U.paidDaysAfterPeriod} days after each monthly assessment period ends, first payment about ${U.firstPaymentWeeks} weeks after claiming. Bank holiday dates.`,
  h1: 'Universal Credit payment dates, from the first payment on',
  intro: 'Your payday is fixed by the day you claimed. Weekends and bank holidays only ever bring it forward.',
  resume: `Universal Credit is paid once a month, ${U.paidDaysAfterPeriod} days after the end of each monthly assessment period, and the first assessment period starts on the day you submit your claim. That is why the first payment takes around ${U.firstPaymentWeeks} weeks: a month to complete the first period, then a week. GOV.UK’s example is Sam, who claims on 10 September: the first period runs to 9 October and Sam is paid on 17 October, then on the 17th of every month. When the date falls on a Saturday, Sunday or bank holiday, the money arrives on the working day before, so a payment due on ${d(xmas.due)} is paid on ${d(xmas.paid)}. People in Scotland can choose to be paid twice a month after the first payment. If you cannot wait five weeks, you can ask for an advance of up to the whole estimated first payment, repaid over ${U.advanceRepayMonths} months from later payments. Your online statement shows the exact amount for each period.`,
  faqs: [
    { q: 'Why is my first Universal Credit payment five weeks after I claimed?', a: `Because Universal Credit is paid in arrears for a whole month. Your first assessment period starts on the day you submit the claim and lasts one month, and the payment comes ${U.paidDaysAfterPeriod} days after it ends. You must also have agreed your claimant commitment at a meeting, usually at the jobcentre, before the first payment is made, so book it as soon as you are offered a date.` },
    { q: 'I claimed on the 31st: when will my Universal Credit be paid each month?', a: `Regulation 21 deals with month ends. A claim on the 31st makes every later assessment period start on the last day of the month, so the 30th in a 30-day month and the 28th or 29th in February. A claim on the 29th or 30th keeps that day, except in February, when the period starts on the 27th, or the 28th in a leap year. The payday then follows ${U.paidDaysAfterPeriod} days after each period ends.` },
    { q: 'Is Universal Credit paid early at Christmas?', a: `Only when the usual date is a weekend or bank holiday. In 2026, 25 and 26 December fall on a Friday and Saturday, 27 December is a Sunday and 28 December is the substitute bank holiday, so payments due on any of those four days are paid on Thursday 24 December. No payment is brought forward otherwise, so the January payment comes on its normal date and the gap can feel long.` },
    { q: 'How does twice-monthly Universal Credit in Scotland work?', a: `After your first payment you are asked whether you want to be paid once or twice a month. Choosing twice a month, the first payment is a full month; half the next month’s award arrives a month later and the other half ${U.scotlandSecondHalfDays} days after that. GOV.UK’s example: a full payment on 14 December, then 14 January and 29 January, then the 14th and 29th every month.` },
    { q: 'Can I change my Universal Credit payment date?', a: `No. The date is set by the first day of your claim and stays the same for the whole claim, moving only when it falls on a non-working day. What you can ask for is an alternative payment arrangement: rent paid straight to your landlord, payments twice a month, or a payment split between partners. The DWP decides, and is more likely to agree where there are rent arrears, mental health issues, addiction or domestic abuse.` },
  ],
  body: (h) => `
<h2>How the date is set</h2>
<p>${h.src('govUcPaid', 'GOV.UK')} gives three rules. Your first assessment period starts on the day you make the claim, which is the day you submit it in your online account, not the day you created the account. Each assessment period lasts a calendar month. You are paid ${U.paidDaysAfterPeriod} days after each period ends. In Sam’s example the claim on 10 September 2026 gives a first period ending ${h.date(sam.periodEnd)} and a due date of ${h.date(sam.due)}; because that is a Saturday, Sam would actually be paid on ${h.date(sam.paid)}. From then on the money arrives on or before the 17th of each month.</p>
<p>You have ${U.claimCompleteDays} days after creating your account to submit the claim, or you have to start again. If something outside your control, such as illness or a broken online service, stopped you claiming, the claim can be backdated by up to ${U.backdateMonths} month, which moves the start of the first period and so the payday.</p>

<h2>Example claims and first payments</h2>
${h.table(['Claim submitted', 'Where you live', 'First assessment period ends', 'Due', 'Paid', 'Days waited'], EXAMPLES.map(([c, n, label]) => {
  const p = ucPayment(c, 1, n);
  return [h.date(c), label, h.date(p.periodEnd), h.date(p.due), p.moved ? `<strong>${h.date(p.paid)}</strong>` : h.date(p.paid), String(diffDays(c, p.paid))];
}), 'First Universal Credit payment by claim date. Bold: moved for a weekend or bank holiday (GOV.UK bank holidays 2026 and 2027).', ['l', 'l', 'l', 'l', 'l', 'r'])}
<p>The St Andrew’s Day row shows why the nation matters: 30 November 2026 is a bank holiday in Scotland but not in England. The table applies the bank holidays of the nation shown, taken from the ${h.src('govBankHolidays', 'GOV.UK bank holidays list')}; your statement confirms the date for your own claim.</p>

<h2>Bank holidays that move payments in 2026 and 2027</h2>
${h.table(['Nation', 'Remaining bank holidays from October 2026'], [
  ['England and Wales', P.bankHolidays.englandWales.filter((x) => x >= '2026-10-01').map((x) => h.date(x)).join(', ')],
  ['Scotland', P.bankHolidays.scotland.filter((x) => x >= '2026-10-01').map((x) => h.date(x)).join(', ')],
  ['Northern Ireland', P.bankHolidays.northernIreland.filter((x) => x >= '2026-10-01').map((x) => h.date(x)).join(', ')],
], 'UK bank holidays (GOV.UK), retrieved 10 October 2026', ['l', 'l'])}
<p>A payment that moves forward still covers the same assessment period. The next one comes on the usual date, so the gap afterwards is longer than a month. Budget for it, especially over Christmas and Easter.</p>

<h2>Paying back an advance</h2>
<p>If you cannot manage until the first payment, ask for an advance through your journal, at the jobcentre or by phone; you usually hear the same day. The most you can borrow is your estimated first payment. ${h.src('govUcAdvance', 'GOV.UK’s example')}: with a first payment of ${h.gbp(advance)}, borrowing all of it is repaid at ${h.gbp(advanceMonthly, 2)} a month over ${U.advanceRepayMonths} months, so the first payment itself is ${h.gbp(advance - advanceMonthly, 2)}. Repayments start with the first payment and count towards the overall cap of ${h.pct(U.maxDeductionShare, 0)} of your standard allowance described on ${h.a('universal-credit-deductions', 'the deductions page')}. If they become unaffordable you can ask to delay them for up to ${U.advanceDelayMonths} months.</p>

<h2>Later payments and changes</h2>
<p>Every payment is worked out from what happened in the assessment period just ended: wages reported by your employer, rent, a new child, a partner moving in. A change reported late in a period still counts for the whole period, which is why GOV.UK asks you to report as soon as it happens. Two employer paydays in one period, or none, make a single payment drop or rise, while the payment date stays put. ${h.a('universal-credit-work-allowance', 'How wages reduce Universal Credit')} explains that pattern.</p>
<p>Couples get one payment for the household into one account, unless a split payment has been agreed. Rent is included in the payment for you to pass on, except where a managed payment to the landlord has been set up, and in Northern Ireland, where the housing element normally goes straight to the landlord.</p>
`,
});
