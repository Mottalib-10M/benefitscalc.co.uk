import { definePage } from '../../lib/guide-types';
import { P, weeklyToMonthly } from '../../lib/engine/params';
import { maternityAllowance } from '../../lib/engine/family';
import { formatMoney } from '../../lib/format';

const M = P.maternity;
const g = (n: number, d = 2) => formatMoney(n, d);
// Full rate reached at average pay of maStandard ÷ 90%.
const fullFrom = M.maStandard / M.maShare;
const exPay = 160;
const exMa = maternityAllowance(exPay);
const class2Max = M.maEarningsWeeks * M.maClass2Weekly;

export default definePage({
  id: 'maternity-allowance',
  group: 'family',
  order: 70,
  mini: 'maAllowance',
  miniHref: 'universal-credit-calculator',
  related: ['sure-start-maternity-grant', 'universal-credit-calculator', 'child-benefit-rates', 'best-start-grant', 'universal-credit-childcare-costs'],
  sources: ['govMa', 'govMaElig', 'govMaClaim', 'dwpRates', 'cpRegs19'],
  slug: 'maternity-allowance',
  nav: 'Maternity Allowance',
  card: 'Up to 39 weeks of pay for mothers who cannot get Statutory Maternity Pay, self-employed included.',
  title: 'Maternity Allowance 2026/27: Weekly Rate, Test and Claim',
  description: `Maternity Allowance 2026/27: ${g(M.maStandard)} a week or 90% of average pay for up to ${M.maWeeks} weeks, the 26-in-66-week test, the self-employed ${g(M.maLow, 0)} rate and Universal Credit.`,
  h1: 'Maternity Allowance: how much, who qualifies and how to claim',
  intro: 'The DWP’s payment for mothers whose employer cannot pay Statutory Maternity Pay, and for the self-employed.',
  resume: `Maternity Allowance replaces earnings for up to ${M.maWeeks} weeks around the birth for women who cannot get Statutory Maternity Pay from an employer, including the self-employed and those who recently stopped work. In 2026/27 an employee receives ${g(M.maStandard)} a week or 90% of average weekly earnings, whichever is less, up from ${g(M.maPrevious)} last year; average pay of about ${g(fullFrom)} a week or more gives the full rate. To qualify you must have been employed or registered as self-employed for at least ${M.maQualifyWeeks} of the ${M.maTestWeeks} weeks before the week the baby is due, and as an employee have earned at least ${g(M.maThreshold, 0)} a week in ${M.maEarningsWeeks} of those weeks. Self-employed women get between ${g(M.maLow, 0)} and ${g(M.maStandard)} a week depending on how many Class 2 National Insurance contributions they paid, with the full rate after ${M.maEarningsWeeks} weeks. You can claim once you are ${M.maClaimFromPregnancyWeek} weeks pregnant. Universal Credit is reduced pound for pound by Maternity Allowance, so the gain shows mainly for families not on Universal Credit.`,
  faqs: [
    { q: 'How is Maternity Allowance worked out for a part-time employee?', a: `The DWP takes your average gross weekly earnings over ${M.maEarningsWeeks} weeks of the test period and pays 90% of that figure, capped at ${g(M.maStandard)}. Someone averaging ${g(exPay, 0)} a week receives ${g(exMa)}. If the average is below ${g(M.maThreshold, 0)}, there is no Maternity Allowance at all, and Universal Credit is the usual place to look for help instead.` },
    { q: 'Do I get Maternity Allowance if I have not paid Class 2 contributions?', a: `Yes, but at the lowest rate of ${g(M.maLow, 0)} a week for ${M.maWeeks} weeks, provided you were registered as self-employed for ${M.maQualifyWeeks} weeks of the test period. After you apply, HMRC tells you how many voluntary Class 2 contributions, at ${g(M.maClass2Weekly)} a week, would raise the award; once they are linked, payments go up and are backdated, which can take several weeks.` },
    { q: 'Can I get Maternity Allowance and Statutory Maternity Pay at the same time?', a: `No. Maternity Allowance is for women who do not qualify for Statutory Maternity Pay. If your employer refuses SMP, it should give you form SMP1 explaining why, and you send that with your MA1 claim. If you become entitled to SMP later, for example from a new job, you must report it, because the allowance would then stop or be reduced.` },
    { q: 'How late can I claim Maternity Allowance without losing money?', a: `Claim within ${M.maBackdateMonths} months of the date your Maternity Allowance is due to start, which is the latest point that still gives the full amount. Payments can start any time from the ${M.maStartWeeksBefore}th week before the due week up to the day after the birth. A claim made later than ${M.maBackdateMonths} months after that start date loses the weeks that fall outside the backdating limit.` },
    { q: 'Can I work keeping in touch days while on Maternity Allowance?', a: `Yes, up to ${M.maKitDays} keeping in touch days with your employer without any change to the allowance, but you must report each day you work. Working more than that, starting a new job or returning to unpaid work in your spouse’s business must also be reported straight away. Failing to report can lead to repayment and a ${g(M.maFine, 0)} penalty.` },
  ],
  body: (h) => `
<h2>The rates for 2026/27</h2>
${h.table(['Your situation', 'Weekly amount', 'For how long'], [
  ['Employed, or recently stopped work', `90% of average pay, up to ${h.gbp(M.maStandard, 2)}`, `${M.maWeeks} weeks`],
  [`Self-employed with ${M.maEarningsWeeks} or more weeks of Class 2`, h.gbp(M.maStandard, 2), `${M.maWeeks} weeks`],
  ['Self-employed with fewer Class 2 weeks', `Between ${h.gbp(M.maLow, 2)} and ${h.gbp(M.maStandard, 2)}`, `${M.maWeeks} weeks`],
  ['Self-employed with no Class 2 paid', h.gbp(M.maLow, 2), `${M.maWeeks} weeks`],
  ['Unpaid work in a spouse’s or civil partner’s business', h.gbp(M.maLow, 2), `${M.maSpouseWeeks} weeks`],
], 'Maternity Allowance rates from April 2026 (DWP benefit and pension rates 2026 to 2027; GOV.UK)', ['l', 'l', 'r'])}
<p>The allowance is aimed at women who miss Statutory Maternity Pay, for example because they changed job late in pregnancy, earn through several short contracts or work for themselves. Over the full ${M.maWeeks} weeks the maximum is ${h.gbp(M.maStandard * M.maWeeks)}. Since maternity leave can last ${M.smpLeaveWeeks} weeks, the last ${M.smpLeaveWeeks - M.maWeeks} weeks of a full year off are unpaid.</p>

<h2>The test period: ${M.maQualifyWeeks} weeks out of ${M.maTestWeeks}</h2>
<p>The test period is the ${M.maTestWeeks} weeks before the week the baby is due. Within it you need at least ${M.maQualifyWeeks} weeks in which you were employed or registered as self-employed, and the weeks do not have to be consecutive or with the same employer. Gaps between jobs and spells of unemployment do not matter as long as the total is reached. Employees must also have earned, or been treated as earning, ${h.gbp(M.maThreshold)} a week or more in ${M.maEarningsWeeks} of the weeks; those ${M.maEarningsWeeks} weeks set the average used for the 90% calculation.</p>
<p>A woman due in late March who worked in a café from the previous January to September and then left would usually pass if she earned at least ${h.gbp(M.maThreshold)} in ${M.maEarningsWeeks} of those weeks: her employment covers more than ${M.maQualifyWeeks} weeks of the test period, even though she has stopped work. ${h.src('govMaElig', 'GOV.UK’s eligibility page')} links to a test period calculator that gives the exact dates from the due date.</p>
<p>A pregnancy that ends early does not necessarily end the claim. The allowance can still be paid if the baby is stillborn from the start of the 24th week of pregnancy, or born alive at any point.</p>

<h2>Self-employed: how Class 2 decides the rate</h2>
<p>For the self-employed, earnings play no part. What matters is registration with HMRC for ${M.maQualifyWeeks} weeks of the test period and the number of Class 2 contributions paid in it. ${M.maEarningsWeeks} weeks of contributions give the full ${h.gbp(M.maStandard, 2)}; none gives ${h.gbp(M.maLow, 2)}; anything in between gives a rate calculated on the weeks paid. Those short of the weeks can pay voluntary contributions after claiming. At ${h.gbp(M.maClass2Weekly, 2)} a week, ${M.maEarningsWeeks} weeks cost ${h.gbp(class2Max, 2)}, against a possible increase of ${h.gbp((M.maStandard - M.maLow) * M.maWeeks)} over the life of the award. Few payments in the benefit system repay themselves so quickly.</p>
<p>Expect ${h.gbp(M.maLow, 2)} a week for the first few payments while HMRC links the contributions to the claim; the difference is then paid as arrears.</p>

<h2>Helping in a spouse’s business</h2>
<p>A woman who is neither employed nor self-employed but has done unpaid work for her husband’s, wife’s or civil partner’s business for ${M.maQualifyWeeks} weeks of the test period can receive ${h.gbp(M.maLow, 2)} a week for ${M.maSpouseWeeks} weeks. Her partner must have been registered as self-employed and paying Class 2 contributions over the same weeks. The claim needs extra details about the business and the work done.</p>

<h2>Maternity Allowance and Universal Credit</h2>
<p>Maternity Allowance counts as unearned income for Universal Credit, so the award falls by the full monthly equivalent: the standard rate takes about ${h.gbp(weeklyToMonthly(M.maStandard), 2)} a month off. A family entitled to more Universal Credit than that still gets the difference, and the work allowance does not apply to Maternity Allowance the way it does to wages. ${h.a('universal-credit-calculator', 'The Universal Credit calculator')} lets you enter the allowance as other income to see the result.</p>
<p>Other benefits move too: Jobseeker’s Allowance stops, and Housing Benefit, Council Tax Reduction, Carer’s Allowance and ESA can change, though GOV.UK notes that the total usually rises or stays level. Maternity Allowance also brings Class 1 National Insurance credits automatically, protecting your State Pension record during the leave, and it can bring the household under the benefit cap.</p>

<h2>Claiming, step by step</h2>
<ol>
<li>Wait until you are ${M.maClaimFromPregnancyWeek} weeks pregnant, then get form MA1, online or by post.</li>
<li>Attach original payslips for the weeks you rely on, proof of the due date such as a MAT B1 or a midwife’s letter, and form SMP1 if your employer refused SMP.</li>
<li>Choose a start date between the ${M.maStartWeeksBefore}th week before the due week and the day after the birth, and post the claim within ${M.maBackdateMonths} months of that date.</li>
</ol>
<p>A decision normally follows within ${M.maDecisionWorkingDays} working days, and payments arrive every two or four weeks. The ${h.src('cpRegs19', 'three-month time limit')} is set in the Claims and Payments Regulations. If you are refused, a mandatory reconsideration is the first step. For a first baby on a low income, also claim the ${h.a('sure-start-maternity-grant', 'Sure Start Maternity Grant')} of ${h.gbp(M.ssmg)}, or in Scotland the ${h.a('best-start-grant', 'Best Start Grant')}.</p>
`,
});
