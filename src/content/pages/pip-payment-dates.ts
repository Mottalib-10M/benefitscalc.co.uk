import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { pipNextPayments, pipPaydaysInTaxYear, paydayName } from '../../lib/engine/disability-extra';
import { diffDays } from '../../lib/engine/dates';
import { formatMoney } from '../../lib/format';

const pip = P.pip;
const g = (n: number, d = 2) => formatMoney(n, d);
const every = pip.paidEveryWeeks;
// Worked example: payday Monday 30 November 2026; the next one, 28 December, is a bank holiday.
const xmas = pipNextPayments('2026-11-30', 3);
const BH = P.bankHolidays;
// Bank holidays from today to the end of September 2027, with the nations they apply to.
const from = '2026-10-10', to = '2027-09-30';
const all = Array.from(new Set([...BH.englandWales, ...BH.scotland, ...BH.northernIreland])).filter((d) => d >= from && d <= to).sort();
const where = (d: string) => {
  const ew = BH.englandWales.includes(d), sc = BH.scotland.includes(d), ni = BH.northernIreland.includes(d);
  return ew && sc && ni ? 'All UK' : [ew ? 'England and Wales' : '', sc ? 'Scotland' : '', ni ? 'Northern Ireland' : ''].filter(Boolean).join(', ');
};
const combos: Array<[string, number]> = [
  ['Standard daily living only', pip.dailyStandard],
  ['Enhanced daily living only', pip.dailyEnhanced],
  ['Standard mobility only', pip.mobilityStandard],
  ['Enhanced mobility only', pip.mobilityEnhanced],
  ['Both parts at the standard rate', pip.dailyStandard + pip.mobilityStandard],
  ['Both parts at the enhanced rate', pip.dailyEnhanced + pip.mobilityEnhanced],
];

export default definePage({
  id: 'pip-payment-dates',
  group: 'disability',
  order: 30,
  mini: 'pipPayDates',
  miniHref: 'pip-points-calculator',
  related: ['pip-rates', 'pip-eligibility', 'pip-points-calculator', 'adult-disability-payment-scotland', 'universal-credit-payment-dates'],
  sources: ['govPip', 'cpRegs48', 'cpRegs49', 'govBankHolidays', 'dwpRates'],
  slug: 'pip-payment-dates',
  nav: 'PIP payment dates',
  card: 'Every four weeks on the same weekday: work out your next paydays and the bank holiday moves.',
  title: 'PIP Payment Dates 2026/27: Your Next Paydays and Holidays',
  description: `PIP payment dates 2026/27: paid every ${every} weeks in arrears on the same weekday, and a little earlier when payday is a bank holiday. Up to ${g((pip.dailyEnhanced + pip.mobilityEnhanced) * every)} per payment.`,
  h1: 'PIP payment dates: the four-week cycle and how to predict it',
  intro: 'Find your next three paydays from the date of your last payment.',
  resume: `Personal Independence Payment is paid every ${every} weeks in arrears, on the same day of the week each time, straight into your bank, building society or credit union account. Your weekday is fixed when the award is made: the regulations set it as the weekday on which the decision was taken, and the decision letter gives you that day and the date of the first payment. From then on, every payday is exactly 28 days after the last one, so a single date from a bank statement is enough to predict the whole year. When a payday falls on a bank holiday, GOV.UK says you will usually be paid before the holiday, and the next payment comes back to the normal day. Each payment covers four weeks: ${g(pip.dailyStandard * every)} for the standard daily living rate alone and up to ${g((pip.dailyEnhanced + pip.mobilityEnhanced) * every)} with both parts at the enhanced rate. A tax year holds thirteen paydays, occasionally fourteen. People with a terminal illness can be paid weekly in advance instead.`,
  faqs: [
    { q: 'Why did my PIP arrive a day or more early this month?', a: `Almost always because the normal payday was a bank holiday. GOV.UK says that when a payment date falls on a bank holiday you are usually paid before it, and the following payment returns to your usual weekday. Around Christmas and Easter this can mean money arriving several days early, which then makes the gap to the next payment longer than four weeks.` },
    { q: 'Is PIP paid for the four weeks ahead or the four weeks just gone?', a: `For the four weeks just gone. Regulation 48 of the Claims and Payments Regulations 2013 says PIP is paid at intervals of ${every} weeks in arrears. The exception is someone covered by the terminal illness rules, who can be paid weekly in advance. That is why a new claimant waits for the first payment even after the award is made.` },
    { q: 'Can the DWP move my PIP to a different weekday?', a: `Yes. Regulation 49 lets the DWP arrange payment on any day of the week. When the day changes, the days caught between the old and the new payday are paid at one seventh of the weekly rate each, so you are not short-changed. Ask on the PIP enquiry line if your usual day causes a problem, for example with a direct debit.` },
    { q: 'How many PIP payments will I get between April 2026 and April 2027?', a: `Thirteen for most people, fourteen for those whose cycle puts a payday in the first few days of the tax year and another in its last days. ${every} weeks times thirteen is 364 days, so a year with a spare day or two can fit a fourteenth payment. The mini-calculator on this page counts yours from one payday.` },
    { q: 'Does my PIP payday change after a reassessment or an increase?', a: `Not usually. A higher or lower award keeps the same weekday. Regulation 49 adds that when the amount changes on a day that is not your payday, the days before and after the change are paid at a daily rate of one seventh of the old and new weekly amounts, so the first payment after a change can be an odd figure.` },
  ],
  body: (h) => `
<h2>Why your payday is the day it is</h2>
<p>Many people assume the DWP picks a payday from their National Insurance number, as it does for some other benefits. PIP works differently. ${h.src('cpRegs49', 'Regulation 49 of the Claims and Payments Regulations 2013')} makes PIP payable on the weekday on which the decision to award it was made; a decision taken at a weekend gets a weekday the DWP chooses. ${h.src('cpRegs48', 'Regulation 48')} then sets the rhythm: payment every ${every} weeks, in arrears. Put together, the payday is a fixed weekday and every payment lands 28 days after the previous one. It never drifts with the calendar month, which is why PIP rarely falls on the same date two months running.</p>
<p>${h.src('govPip', 'GOV.UK')} adds that the decision letter tells you the date of the first payment, the weekday you will usually be paid on, how long the award lasts and when it will be reviewed. Keep that letter: it is the simplest proof of your payment pattern if a bank, landlord or council asks.</p>

<h2>Bank holidays between now and September 2027</h2>
<p>A payday on a bank holiday is usually paid on the working day before, then the cycle continues as normal. The table lists the bank holidays published on GOV.UK until the end of September 2027. Only those that fall on your weekday can touch your money: a Monday payee meets most of them, a Friday payee meets Christmas Day, New Year’s Day and Good Friday, and someone paid midweek may go the whole year untouched.</p>
${h.table(['Bank holiday', 'Weekday', 'Where'], all.map((d) => [h.date(d), paydayName(d), where(d)]), 'Bank holidays, October 2026 to September 2027 (GOV.UK bank holidays list)', ['l', 'l', 'l'])}
<p>Take a Monday payee whose last payment arrived on ${h.date('2026-11-30')}. The next due date is ${h.date(xmas[0].due)}, the bank holiday that replaces Boxing Day, so the money should arrive on ${h.date(xmas[0].paid)}, the Thursday before Christmas Day. The following payment returns to the normal cycle on ${h.date(xmas[1].paid)}, which leaves ${diffDays(xmas[0].paid, xmas[1].paid)} days between the two instead of 28. Budgeting for that gap matters more than the early arrival.</p>
<p>The bank holidays of Scotland and Northern Ireland are not the same as those of England and Wales. St Andrew’s Day and the early August holiday apply in Scotland, St Patrick’s Day and the Battle of the Boyne holiday in Northern Ireland. If you live there, check the date against your own nation’s list.</p>

<h2>What lands in your account each time</h2>
<p>Every payment is four weeks of your weekly award. Here are the six usual combinations at the 2026/27 rates from the ${h.src('dwpRates', 'DWP rates table')}.</p>
${h.table(['Award', 'A week', 'Each payment', 'Thirteen payments'], combos.map(([l, w]) => [l, h.gbp(w, 2), h.gbp(w * every, 2), h.gbp(w * every * 13)]), 'PIP paid every four weeks, rates from April 2026', ['l', 'r', 'r', 'r'])}
<p>A cycle that starts on ${h.date('2026-04-06')} fits ${pipPaydaysInTaxYear('2026-04-06')} paydays into the tax year, the last one on ${h.date('2027-04-05')}. Most cycles fit thirteen. The extra payment is not a bonus: it is simply four weeks that the calendar squeezed in, and the year after will have thirteen again.</p>

<h2>The first payment and the decision letter</h2>
<p>Because PIP is paid in arrears, nothing arrives on the day of the decision. The first payment comes on the date printed in the letter and can include money for the weeks between the start of the award and the decision. From there the regular cycle begins. If the date passes and nothing has arrived, check the bank details the DWP holds before anything else; a closed account is the commonest reason for a missing payment. Changes of address, bank or doctor go to the PIP enquiry line, which ${h.src('govPipChanges', 'GOV.UK lists with the other changes you must report')}.</p>

<h2>Terminal illness and very small awards</h2>
<p>Two groups do not follow the four-week rhythm. Someone claiming under the special rules for end of life can be paid weekly in advance under regulation 48(2), so money arrives at the start of each week rather than at the end of four. At the other end, if the amount payable is less than ${h.gbp(pip.smallAwardWeekly)} a week, for instance because Constant Attendance Allowance reduces the daily living part, the DWP may pay it at longer intervals, up to every ${pip.smallAwardMaxMonths} months.</p>

<h2>When an amount changes mid-cycle</h2>
<p>The April up-rating, a review that raises or lowers the award, or the end of an award rarely coincide with your payday. Regulation 49 deals with this by paying the days on each side of the change at one seventh of the relevant weekly rate. A payment straddling a rise from the standard to the enhanced daily living rate, with the change taking effect after 10 of the 28 days, is worth ${h.gbp((pip.dailyStandard * 10 + pip.dailyEnhanced * 18) / 7, 2)} instead of ${h.gbp(pip.dailyStandard * every, 2)} or ${h.gbp(pip.dailyEnhanced * every, 2)}. That odd figure is not an error.</p>

<h2>Scotland and Northern Ireland</h2>
<p>In Scotland, new claims are for ${h.a('adult-disability-payment-scotland', 'Adult Disability Payment')}, which Social Security Scotland also pays every four weeks, with the first payment after the first four weeks of entitlement. In Northern Ireland, PIP is paid by the Department for Communities at the same rates. For the amounts themselves, see ${h.a('pip-rates', 'PIP rates for 2026/27')}; for whether a payday also affects Universal Credit, it does not, as PIP is ignored as income, unlike the dates explained in ${h.a('universal-credit-payment-dates', 'Universal Credit payment dates')}.</p>
`,
});
