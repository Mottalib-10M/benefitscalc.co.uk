import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { formatMoney, formatPercent } from '../../lib/format';

const U = P.uc;
const g = (n: number, d = 2) => formatMoney(n, d);
const cap = formatPercent(U.maxDeductionShare, 0);
const BANDS = [
  ['Single, under 25', 'singleUnder25'],
  ['Single, 25 or over', 'single25'],
  ['Couple, both under 25', 'coupleUnder25'],
  ['Couple, one or both 25 or over', 'couple25'],
] as const;
// Example: Rob, single, 38, repays an advance and has Council Tax arrears and a rent arrears request.
const advance = 25;
const rob = { ct: U.thirdParty.single25, rent: U.rentArrearsMin.single25 };

export default definePage({
  id: 'universal-credit-deductions',
  group: 'uc',
  order: 110,
  mini: 'ucDeductions',
  related: ['universal-credit-payment-dates', 'universal-credit-rates', 'universal-credit-under-25', 'universal-credit-housing-element', 'budgeting-loan'],
  sources: ['govUcDeductions', 'govUcSanctions', 'dwpRates', 'govUcAdvance'],
  slug: 'universal-credit-deductions',
  nav: 'Deductions and sanctions',
  card: `Debts taken from Universal Credit are capped at ${cap} of the standard allowance; sanctions work differently.`,
  title: `Universal Credit Deductions 2026/27: ${cap} Cap and Sanctions`,
  description: `Universal Credit deductions 2026/27: at most ${cap} of the standard allowance, ${g(U.maxDeduction.single25)} a month for a single person 25+. Third-party, rent arrears, sanctions.`,
  h1: 'Money taken off Universal Credit: deductions and sanctions',
  intro: 'Repayments are capped as a share of your standard allowance; a sanction is a daily amount on top.',
  resume: `Universal Credit can take money off your payment to repay an advance, an overpayment, a Budgeting Loan or debts owed to third parties such as your landlord, energy supplier or council. Normally the total taken for debts is capped at ${cap} of your standard allowance: in 2026/27 that is ${g(U.maxDeduction.singleUnder25)} a month for a single person under 25, ${g(U.maxDeduction.single25)} at 25 or over, ${g(U.maxDeduction.coupleUnder25)} for a couple both under 25 and ${g(U.maxDeduction.couple25)} for an older couple. Each third-party debt takes ${formatPercent(U.thirdPartyShare, 0)} of the standard allowance, at most ${U.maxThirdPartyDeductions} at once, and rent arrears ${formatPercent(U.rentArrearsMinShare, 0)} to ${cap}. Only last resort deductions, which prevent eviction, disconnection or missed child maintenance, can go above the cap. A sanction is separate: it cuts the standard allowance by a fixed amount for each day it lasts, ${g(U.sanctionDaily100.single25)} a day for a single person 25 or over, while elements for children and rent continue to be paid.`,
  faqs: [
    { q: 'Can my landlord take rent arrears straight from my Universal Credit?', a: `Your landlord can ask. Universal Credit then gives you ${U.objectionDays} days to sign in and say whether you object, and pauses payments until it decides. You can object if you owe nothing, owe less than ${U.rentArrearsObjectMonths} months’ rent and service charges, or are in a dispute about repairs, and you then have another ${U.objectionDays} days to send evidence such as rent statements. If the deduction goes ahead, it takes between ${formatPercent(U.rentArrearsMinShare, 0)} and ${cap} of your standard allowance.` },
    { q: 'How do I reduce Universal Credit overpayment deductions?', a: `Ask for a financial hardship decision. GOV.UK says you may be considered if money is taken for benefit debt, Budgeting or Crisis Loan repayments, advances, or rent arrears taken at more than ${formatPercent(U.rentArrearsMinShare, 0)} of the standard allowance. If the DWP agrees to lower the rate, the change applies automatically from your next assessment period. Debt Management handles overpayments once your claim ends.` },
    { q: 'How many third-party deductions can Universal Credit make at once?', a: `No more than ${U.maxThirdPartyDeductions}. Each one, for Council Tax, gas, electricity, water, a court fine or similar, is ${formatPercent(U.thirdPartyShare, 0)} of the standard allowance: ${g(U.thirdParty.single25)} a month for a single person aged 25 or over, ${g(U.thirdParty.couple25)} for a couple where one is 25 or over. A journal message tells you when one starts. Child maintenance due from a parent on Universal Credit appears in the DWP table as a fixed ${g(U.childMaintenanceDeduction)}.` },
    { q: 'Does a Universal Credit sanction stop my child element and rent?', a: `No. A sanction reduces only the standard allowance. GOV.UK confirms that extra amounts for children, housing costs and other elements are still paid. If your earnings or other income have already shrunk the award so far that the daily reduction cannot all be taken, the payment falls to nil and the sanction is treated as fully applied. If you cannot afford rent, heating, food or hygiene, you can ask for a hardship payment.` },
    { q: 'Do I have to repay a Universal Credit hardship payment?', a: `Yes, in most cases. A hardship payment made because a sanction or fraud penalty reduced your award is recoverable: once the sanction ends, your Universal Credit is reduced by up to ${cap} of the standard allowance each month until it is repaid, and the agreed rate cannot then be changed. It sits within the same overall ceiling as your other debt deductions.` },
  ],
  body: (h) => `
<h2>The ceilings for 2026/27</h2>
<p>Every deduction is a share of the standard allowance, not of your whole award. A lone parent whose Universal Credit is ${h.gbp(1800)} a month because of rent and children faces the same ceiling as a single person on the bare allowance of the same age band. The ${h.src('dwpRates', 'DWP rates table')} converts each share into pounds:</p>
${h.table(['Household', `Third-party debt (${h.pct(U.thirdPartyShare, 0)})`, `Rent arrears minimum (${h.pct(U.rentArrearsMinShare, 0)})`, `Overall ceiling (${h.pct(U.maxDeductionShare, 0)})`], BANDS.map(([label, k]) => [label, h.gbp(U.thirdParty[k], 2), h.gbp(U.rentArrearsMin[k], 2), h.gbp(U.maxDeduction[k], 2)]), 'Universal Credit deduction amounts a month, 2026/27', ['l', 'r', 'r', 'r'])}
<p>The overall ceiling was once ${h.pct(U.maxDeductionSharePrevious, 0)} of the standard allowance; the DWP table now records it as ${h.pct(U.maxDeductionShare, 0)} for overall deductions, fraud overpayments and ordinary overpayments alike. For a single person aged 25 or over it rose from ${h.gbp(U.previous.maxDeductionSingle25, 2)} last year to ${h.gbp(U.maxDeduction.single25, 2)}, simply because the allowance went up.</p>

<h2>What can be deducted</h2>
<ul>
<li><strong>Advances</strong>, including the advance on your first payment, usually repaid over ${U.advanceRepayMonths} months.</li>
<li><strong>Overpayments</strong> of Universal Credit or of older benefits and tax credits, sometimes with a civil penalty added.</li>
<li><strong>Recoverable hardship payments</strong> made during a sanction or fraud penalty.</li>
<li><strong>Budgeting Loans and Crisis Loans</strong>, at the rate agreed when you accepted the loan; see ${h.a('budgeting-loan', 'Budgeting Loans')}.</li>
<li><strong>Third-party deductions</strong> for rent and service charge arrears, Council Tax, gas, electricity, water, court fines and child maintenance, paid straight to whoever you owe.</li>
</ul>
<p>The amount is worked out at the end of each assessment period, so it can change from month to month when your earnings or other benefits change. Your statement lists every item under “What we take off: deductions”.</p>

<h2>A month with three deductions</h2>
<p>Rob is 38, single, and has a ${h.gbp(advance)} a month advance repayment, Council Tax arrears and a rent arrears request from his housing association. The Council Tax deduction is ${h.gbp(rob.ct, 2)} and rent arrears start at ${h.gbp(rob.rent, 2)}. Together with the advance that makes ${h.gbp(advance + rob.ct + rob.rent, 2)}, above his ceiling of ${h.gbp(U.maxDeduction.single25, 2)}. The DWP takes ${h.gbp(U.maxDeduction.single25, 2)} and the rest waits; the debts simply take longer to clear. The mini-simulator above does the same sum for any household.</p>

<h2>A deduction you do not recognise</h2>
<p>Start with the statement line, which names the type of debt. Who to contact depends on that type. An advance or an overpayment of Universal Credit is explained in a journal message in your account. An overpayment of another benefit or of tax credits, including Housing Benefit, comes with its own letter or journal message saying what it is for. A third-party deduction is a debt to someone else, such as the council or an energy supplier, although Universal Credit sets the monthly amount. If you think you were overpaid but have heard nothing, GOV.UK asks you to report it straight away rather than wait for the deduction to start.</p>

<h2>Last resort deductions</h2>
<p>The ${h.pct(U.maxDeductionShare, 0)} ceiling can be exceeded only for “last resort” deductions: payments needed to stop you being evicted, having your gas, electricity or water cut off, or failing to meet child maintenance. They go directly to the landlord, supplier or Child Maintenance Service. If one is in place and money is short, you can still ask for a financial hardship decision on any benefit debt being taken alongside it.</p>

<h2>Sanctions: a daily reduction</h2>
<p>A sanction follows a failure, without good reason, to do something in your claimant commitment. ${h.src('govUcSanctions', 'GOV.UK’s sanctions guide')} sets the daily amounts below. The ${h.pct(U.sanctionReducedShare, 0)} rate applies at 16 or 17 and when your only requirement is to attend appointments about work.</p>
${h.table(['Household', `${h.pct(1, 0)} rate a day`, `${h.pct(U.sanctionReducedShare, 0)} rate a day`], BANDS.map(([label, k]) => [label + (label.startsWith('Couple') ? ' (per sanctioned partner)' : ''), h.gbp(U.sanctionDaily100[k], 2), h.gbp(U.sanctionDaily40[k], 2)]), 'Universal Credit sanction daily reduction rates, 2026/27', ['l', 'r', 'r'])}
${h.table(['Level', 'Typical reason', 'Length for someone 18 or over'], [
  ['Lowest', 'Not attending a work-focused appointment when that is your only requirement', 'Until the day before you contact the DWP to arrange a new appointment'],
  ['Low', 'Missing an appointment, training or a requested action', `Until you comply, plus ${U.sanctionLowExtraDays} days for a first one, rising for repeats`],
  ['Medium', 'Not taking all reasonable steps to look for work, or not being available', `${U.sanctionMediumDays} days, or ${U.sanctionMediumRepeatDays} days for a repeat within a year`],
  ['High', 'Refusing a job offer, or leaving work or losing pay by choice or misconduct', `${U.sanctionHighDays} days, up to ${U.sanctionHighMaxDays} for a repeat within a year`],
], 'Sanction levels (GOV.UK, Universal Credit sanctions)', ['l', 'l', 'l'])}
<p>A ${U.sanctionMediumDays}-day medium sanction for a single person aged 25 or over therefore costs ${h.gbp(U.sanctionDaily100.single25 * U.sanctionMediumDays, 2)}. Sanctions do not overlap, but they can run back to back. People caring for young children or disabled people, pregnant women close to the due date and new parents may have less taken off. If you disagree, ask for a mandatory reconsideration through your journal.</p>
`,
});
