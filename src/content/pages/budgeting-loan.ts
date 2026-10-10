import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { budgetingRepayment } from '../../lib/engine/support';
import { formatMoney } from '../../lib/format';

const BL = P.budgetingLoan;
const BA = P.budgetingAdvance;
const g = (n: number, d = 0) => formatMoney(n, d);
// Worked examples: £600 for a cooker and a bed, borrowed by a pensioner on Pension Credit and by a tenant on Universal Credit.
const loan = budgetingRepayment(600, false);
const adv = budgetingRepayment(600, true);

export default definePage({
  id: 'budgeting-loan',
  group: 'housing',
  order: 60,
  mini: 'budgetingLoan',
  miniHref: 'benefits-calculator',
  related: ['universal-credit-deductions', 'cost-of-living-payment', 'pension-credit', 'universal-credit-payment-dates', 'benefits-in-northern-ireland', 'benefits-calculator'],
  sources: ['govBudgeting', 'govUcAdvance', 'nidDiscretionary', 'govColHelp'],
  slug: 'budgeting-loan',
  nav: 'Budgeting Loan',
  card: `Interest-free loans of up to ${g(BL.withChildBenefit)} for household costs, and the Universal Credit Budgeting Advance that replaces them.`,
  title: `Budgeting Loan 2026/27: Up to ${g(BL.withChildBenefit)}, or a Budgeting Advance`,
  description: `Budgeting Loan 2026/27: borrow ${g(BL.min)} to ${g(BL.withChildBenefit)} interest free after ${BL.qualifyingMonths} months on Pension Credit or legacy benefits; on Universal Credit, a Budgeting Advance instead.`,
  h1: 'Budgeting Loans and Budgeting Advances: borrowing from DWP without interest',
  intro: 'For a cooker, a bed, a deposit or a funeral: how much DWP lends, who qualifies, and what comes off your benefit afterwards.',
  resume: `A Budgeting Loan is an interest-free loan from DWP for one-off costs such as furniture, white goods, clothes, rent in advance, moving costs or a funeral. You can borrow from ${g(BL.min)} up to ${g(BL.single)} if you are single, ${g(BL.couple)} with a partner and ${g(BL.withChildBenefit)} if you or your partner claim Child Benefit. You must have been getting Pension Credit, income-based JSA, income-related ESA or Income Support for the past ${BL.qualifyingMonths} months. Savings over ${g(BL.savingsLimit)}, or ${g(BL.savingsLimit63)} if either of you is 63 or over, reduce what you are offered, and owing more than ${g(BL.debtLimit)} in Budgeting and Crisis Loans rules you out. Repayments come straight off your benefit, normally within ${BL.repayWeeks} weeks. If you get Universal Credit you cannot have a Budgeting Loan: the equivalent is a Budgeting Advance, with the same ${g(BA.min)} to ${g(BA.children)} range, repaid over ${BA.repayMonths} months, and refused if you earned more than ${g(BA.earningsLimit6m)} (${g(BA.earningsLimit6mCouple)} for a couple) in the last ${BA.qualifyingMonths} months.`,
  faqs: [
    { q: 'Can I get a Budgeting Loan if I am on Universal Credit?', a: `No. GOV.UK says anyone currently getting Universal Credit should apply for a Budgeting Advance instead, through the journal, a work coach or the helpline. The amounts are the same, ${g(BA.min)} to ${g(BA.children)}. If you have moved from Universal Credit to Pension Credit, the time on Universal Credit counts towards the ${BL.qualifyingMonths} months needed for a Budgeting Loan.` },
    { q: 'How long does a Budgeting Loan decision take?', a: `Applying online, you hear within ${BL.decisionDaysOnline} days if you choose a decision by text or email, or ${BL.decisionDaysPost} days by letter. A paper application on form SF500 takes up to ${BL.decisionDaysPost} days. Once you accept, the money arrives within ${BL.decisionDaysOnline} days of accepting online, or ${BL.decisionDaysPost} days after DWP receives your postal acceptance.` },
    { q: 'What can a Budgeting Advance not be used for?', a: `GOV.UK excludes ongoing costs such as food, household bills such as gas and electricity, rent and paying off debts. It is meant for one-off items: furniture, a cooker or washing machine, clothes, home repairs or security, funeral costs, a tenancy deposit or removal costs. A TV is allowed only in some circumstances. Only one Budgeting Advance can be held at a time.` },
    { q: 'How do I challenge a Budgeting Loan refusal or a low offer?', a: `Write to the address at the top of the decision letter within ${BL.reviewDays} days, giving your name, National Insurance number, contact details and why you disagree. DWP replies with a fresh decision. If you are still unhappy, the Independent Case Examiner can review it, again within ${BL.reviewDays} days of the second letter.` },
  ],
  body: (h) => `
<h2>Which loan you can get</h2>
<p>DWP runs two schemes that look alike from the outside. The ${h.src('govBudgeting', 'Budgeting Loan')} belongs to the older means-tested benefits and Pension Credit; the ${h.src('govUcAdvance', 'Budgeting Advance')} belongs to Universal Credit. Which one you apply for depends only on the benefit you get today.</p>
${h.table(['', 'Budgeting Loan', 'Budgeting Advance'], [
  ['Benefit you get', 'Pension Credit, income-based JSA, income-related ESA or Income Support', 'Universal Credit'],
  ['Time on benefit', `The past ${BL.qualifyingMonths} months`, `${BA.qualifyingMonths} months on Universal Credit, ESA or Pension Credit, or money needed to start or keep a job`],
  ['Single', h.gbp(BL.single), h.gbp(BA.single)],
  ['Couple', h.gbp(BL.couple), h.gbp(BA.couple)],
  ['With children', `${h.gbp(BL.withChildBenefit)} (Child Benefit claimed)`, h.gbp(BA.children)],
  ['Minimum', h.gbp(BL.min), h.gbp(BA.min)],
  ['Shuts you out', `Debts over ${h.gbp(BL.debtLimit)} to the Social Fund; strike action; New Style JSA or ESA only`, `Earnings over ${h.gbp(BA.earningsLimit6m)} (couple ${h.gbp(BA.earningsLimit6mCouple)}) in ${BA.qualifyingMonths} months; an advance still unpaid`],
  ['Repayment', `From your benefit, normally within ${BL.repayWeeks} weeks`, `From Universal Credit, usually over ${BA.repayMonths} months`],
], 'Budgeting Loan and Budgeting Advance, 2026/27 (GOV.UK)', ['l', 'l', 'l'])}
<p>People on New Style JSA or New Style ESA alone, without an income-related benefit, cannot get either a Budgeting Loan or, unless they also get Universal Credit, a Budgeting Advance. The amounts are maximums, not entitlements: DWP offers what it thinks you can repay.</p>

<h2>What the money can pay for</h2>
<p>The Budgeting Loan list is broad. It covers furniture and household items such as a washing machine, clothes and shoes, rent in advance and the costs of moving, maintenance, improvements or security for your home, travel within the UK, the costs of getting a new job, maternity costs and funeral costs. It can also clear hire purchase loans, or loans you took out earlier for any of these. A household moving from a hostel into an unfurnished council flat, for example, could use a loan for a bed, a fridge and the van on moving day. The Budgeting Advance list is similar but excludes ongoing bills, rent and old debts.</p>

<h2>What a ${h.gbp(600)} loan costs each week or month</h2>
<p>Say a pensioner on Pension Credit needs ${h.gbp(600)} to replace a broken cooker and a bed. Spread evenly over ${BL.repayWeeks} weeks, the deduction would be about ${h.gbp(loan.perPeriod, 2)} a week, roughly ${h.gbp(loan.monthly, 2)} a month. DWP sets the real figure in its offer, based on income and what you can afford, so the weekly amount in your letter may differ from this even split. Nothing is added in interest: you repay exactly ${h.gbp(600)}.</p>
<p>A tenant on Universal Credit borrowing the same ${h.gbp(600)} as a Budgeting Advance repays ${h.gbp(adv.perPeriod, 2)} a month over ${BA.repayMonths} months, taken from each statement. The ${h.src('govUcAdvance', 'GOV.UK example')} uses ${h.gbp(240)} repaid at ${h.gbp(10)} a month. If the deductions become unaffordable, you can ask for them to be paused for up to ${BA.delayMonthsMax} months. The repayment appears on your statement next to any other ${h.a('universal-credit-deductions', 'deductions from Universal Credit')}, such as rent arrears or an overpayment.</p>

<h2>Savings, debts and what reduces the offer</h2>
<p>For a Budgeting Loan, DWP looks at three things besides your benefit: whether you can pay it back, whether you have savings over ${h.gbp(BL.savingsLimit)} (or ${h.gbp(BL.savingsLimit63)} if you or your partner are 63 or over), and whether you are still repaying an earlier Budgeting Loan or Crisis Loan. A couple aged 64 and 60 with ${h.gbp(1500)} in the bank are under the higher limit; at 58 and 60 they would be over the lower one, and the offer would shrink. Crisis Loans no longer exist, but old Crisis Loan debt still counts towards the ${h.gbp(BL.debtLimit)} limit.</p>

<h2>Applying</h2>
<p>Budgeting Loans are claimed online or on paper with form SF500. Online is quicker, the offer letter or message shows the weekly repayment before you accept, and you can choose to get the decision by email, text or letter. The loan is paid into the account your benefit goes into, so change that account first if you want it paid elsewhere. Do not apply twice while waiting; the Social Fund Enquiry Line can amend an application already made. A Budgeting Advance is requested through your Universal Credit journal, a work coach or the Universal Credit helpline, and repayments start from the next Universal Credit payment.</p>
<p>If you stop getting benefits before the loan is repaid, DWP Debt Management writes to arrange repayment, in full or by monthly payments. The same happens with an unpaid advance after a Universal Credit claim ends.</p>

<h2>Scotland, Wales and Northern Ireland</h2>
<p>Budgeting Loans and Advances are available in Scotland and Wales on the same terms. Each nation also has its own crisis help, usually as grants rather than loans: the Scottish Welfare Fund offers Crisis Grants and Community Care Grants, and the Discretionary Assistance Fund does the same in Wales. In England, councils help through the Crisis and Resilience Fund, open whether or not you get benefits, as ${h.src('govColHelp', 'GOV.UK explains')}.</p>
<p>Northern Ireland runs its own Social Fund Budgeting Loan and a separate ${h.src('nidDiscretionary', 'Discretionary Support scheme')} through the Department for Communities. Discretionary Support offers interest-free loans or grants in a crisis, with up to three loans in a 12-month period, and is closed to anyone whose household owes ${h.gbp(BL.debtLimit)} or more in government debt. ${h.a('benefits-in-northern-ireland', 'Benefits in Northern Ireland')} covers the other differences, from twice-monthly Universal Credit to rates rebates.</p>

<h2>Grants that do not need repaying</h2>
<p>Before borrowing, check whether a grant would cover the cost. A first baby can bring a Sure Start Maternity Grant in England, Wales and Northern Ireland, or a Best Start Grant in Scotland. Universal Credit claimants starting a job can ask a work coach for help with job expenses such as a uniform, travel to an interview or childcare before the first wage, which usually does not need to be paid back. ${h.a('cost-of-living-payment', 'Help with the cost of living in 2026/27')} lists the one-off payments that remain now that Cost of Living Payments have stopped.</p>
`,
});
