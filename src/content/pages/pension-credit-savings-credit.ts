import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { computePensionCredit } from '../../lib/engine/pension';
import { formatMoney } from '../../lib/format';

const PC = P.pensionCredit;
const g = (n: number, d = 2) => formatMoney(n, d);
const at = (inc: number, couple = false) => computePensionCredit({ couple, income: inc, spaBefore2016: true });
const peakSingle = PC.guaranteeSingle; // amount B starts above the guarantee
const endSingle = PC.guaranteeSingle + PC.savingsMaxSingle / PC.savingsShareB;

export default definePage({
  id: 'pension-credit-savings-credit',
  group: 'pension',
  order: 25,
  mini: 'savingsCredit',
  miniHref: 'pension-credit-calculator',
  related: ['pension-credit', 'pension-credit-calculator', 'old-basic-state-pension', 'state-pension-amount', 'housing-benefit-calculator'],
  sources: ['spca3', 'spcRegs7', 'govPc', 'dwpRates'],
  slug: 'pension-credit-savings-credit',
  nav: 'Savings Credit',
  card: 'The two-step formula, the 2026/27 thresholds and who can still get it.',
  title: 'Savings Credit 2026/27: Formula, Thresholds, Who Can Get It',
  description: `Savings Credit 2026/27: up to ${g(PC.savingsMaxSingle)} a week single or ${g(PC.savingsMaxCouple)} for a couple, for those over State Pension age before April 2016. The 60% and 40% formula.`,
  h1: 'Savings Credit: the part of Pension Credit that rewards a small private pension',
  intro: 'A closed scheme, still worth a few pounds a week to many people now in their mid-seventies and older.',
  resume: `Savings Credit is the second part of Pension Credit, designed so that people who had saved a little for retirement are not left level with those who had saved nothing. It is only available if you, or your partner, reached State Pension age before 6 April 2016, which in practice means men born before 6 April 1951 and women born before 6 April 1953. In 2026/27 it pays at most ${g(PC.savingsMaxSingle)} a week for a single person and ${g(PC.savingsMaxCouple)} for a couple. The formula has two steps set by the State Pension Credit Act 2002 and regulation 7 of the 2002 regulations: take 60% of your qualifying income above a threshold of ${g(PC.savingsThresholdSingle)} (${g(PC.savingsThresholdCouple)} for a couple), capped at the maximum, then subtract 40% of any income above your guaranteed amount. Savings Credit can be paid on its own, to someone whose income is too high for Guarantee Credit, and still counts as being on Pension Credit for Cold Weather Payments and the free TV licence from age 75.`,
  faqs: [
    { q: 'I reached State Pension age in 2017. Can I get Savings Credit?', a: 'Only through a partner. Savings Credit is closed to people who reached State Pension age on or after 6 April 2016, but a couple qualifies if either partner reached it earlier. Otherwise Guarantee Credit is the part of Pension Credit open to you.' },
    { q: 'Which income counts as qualifying income for Savings Credit?', a: 'Broadly the income you provided for yourself or earned: the State Pension, workplace and personal pensions, earnings and income from savings. Some benefits that count as income for Guarantee Credit are not qualifying income for Savings Credit, which is why the two can produce different figures. The Pension Service applies the full list in the regulations.' },
    { q: 'At what income does Savings Credit stop altogether?', a: `For a single person in 2026/27 the payment falls to nothing at about ${g(endSingle)} a week of income, where 40% of the excess over the guarantee cancels the full ${g(PC.savingsMaxSingle)}. It is highest between ${g(PC.savingsThresholdSingle + PC.savingsMaxSingle / PC.savingsShareA)} and ${g(peakSingle)}. Additions for disability or caring raise the guaranteed amount and move that end point higher.` },
    { q: 'Can Savings Credit and Guarantee Credit be paid together?', a: `Yes. Between the savings credit threshold of ${g(PC.savingsThresholdSingle)} and the guarantee of ${g(PC.guaranteeSingle)} a single person can receive both: Guarantee Credit fills the gap to the guarantee and Savings Credit adds 60% of the income above the threshold, up to the cap. The table on this page shows both columns side by side.` },
  ],
  body: (h) => `
<h2>The two amounts</h2>
<p>Section 3 of the ${h.src('spca3', 'State Pension Credit Act 2002')} defines Savings Credit as amount A minus amount B, and ${h.src('spcRegs7', 'regulation 7')} sets the figures for 2026/27.</p>
<ul>
<li><strong>Amount A</strong> is 60% of qualifying income above the savings credit threshold, ${h.gbp(PC.savingsThresholdSingle, 2)} single or ${h.gbp(PC.savingsThresholdCouple, 2)} for a couple, but never more than the maximum savings credit, ${h.gbp(PC.savingsMaxSingle, 2)} or ${h.gbp(PC.savingsMaxCouple, 2)}.</li>
<li><strong>Amount B</strong> is 40% of all your income above your appropriate amount, the guarantee plus any additions, or nothing if your income is below it.</li>
</ul>
<p>The maximum itself is 60% of the gap between the standard guarantee and the threshold, which is why it moves each April with both. A fraction of a penny in either calculation is rounded in your favour.</p>

<h2>Savings Credit at different incomes</h2>
${h.table(['Weekly income (single)', 'Amount A', 'Amount B', 'Savings Credit', 'Guarantee Credit'], [200, 215, 225, 238, 250, 265, 280].map((i) => {
  const r = at(i);
  const a = Math.min(PC.savingsMaxSingle, Math.max(0, i - PC.savingsThresholdSingle) * PC.savingsShareA);
  const b = Math.max(0, i - PC.guaranteeSingle) * PC.savingsShareB;
  return [h.gbp(i, 2), h.gbp(a, 2), h.gbp(b, 2), h.gbp(r.savingsCredit, 2), h.gbp(r.guarantee, 2)];
}), 'Single person, all income qualifying, no additions, 2026/27', ['r', 'r', 'r', 'r', 'r'])}
<p>The table shows the shape. Below the threshold there is nothing to reward. Just above it, Savings Credit grows by 60p for each extra pound until it reaches the cap, while Guarantee Credit shrinks pound for pound. Once income passes the guarantee, Guarantee Credit has gone and Savings Credit starts to taper at 40p in the pound, reaching zero at about ${h.gbp(endSingle)}.</p>

<h2>A couple’s example</h2>
<p>A married couple, the husband 82 and the wife 79, have ${h.gbp(345)} a week of State Pensions and a small occupational pension between them. Their guarantee is ${h.gbp(PC.guaranteeCouple, 2)}. Amount A is 60% of the ${h.gbp(345 - PC.savingsThresholdCouple, 2)} above the couple threshold, which exceeds the cap, so it is ${h.gbp(PC.savingsMaxCouple, 2)}. Amount B is 40% of their ${h.gbp(345 - PC.guaranteeCouple, 2)} above the guarantee, ${h.gbp((345 - PC.guaranteeCouple) * PC.savingsShareB, 2)}. Their Savings Credit is ${h.gbp(at(345, true).savingsCredit, 2)} a week, about ${h.gbp(at(345, true).savingsCredit * 52)} a year, with no Guarantee Credit. If either received Attendance Allowance and the severe disability amount applied, the guaranteed amount would rise by ${h.gbp(PC.severeDisability, 2)}, amount B would vanish and Guarantee Credit would be paid as well.</p>

<h2>Why a few pounds matter</h2>
<p>A Savings Credit award of under ${h.gbp(5)} a week is common, and it can look hardly worth the paperwork. It is not the sum that counts. ${h.src('govPc', 'GOV.UK notes')} that anyone getting Pension Credit automatically gets Cold Weather Payments and can apply for a free TV licence from 75; the Warm Home Discount also follows. Help with NHS dental treatment, glasses and hospital travel, and maximum Housing Benefit, need the Guarantee Credit part, so it is worth checking whether a disability or carer addition would bring you into it.</p>

<h2>What the April 2026 changes did to Savings Credit</h2>
<p>Each April the guarantee, the threshold and the maximum move together. For 2026/27 the single threshold rose from ${h.gbp(PC.previous.savingsThresholdSingle, 2)} to ${h.gbp(PC.savingsThresholdSingle, 2)}, the maximum from ${h.gbp(PC.previous.savingsMaxSingle, 2)} to ${h.gbp(PC.savingsMaxSingle, 2)} and the guarantee from ${h.gbp(PC.previous.guaranteeSingle, 2)} to ${h.gbp(PC.guaranteeSingle, 2)}. A pensioner whose own income rose by less than the threshold sees amount A shrink, because less of their income sits above the new line. Someone on the full new State Pension is above the threshold on that alone, but in practice most Savings Credit claimants are on the older basic State Pension of ${h.gbp(P.statePension.basicFull, 2)}, which also rose by 4.8%, plus a small private pension that may have risen by less or not at all.</p>
<p>The result is that Savings Credit awards drift down slowly over time for people with a fixed private pension, and a review letter showing a lower figure after April is not necessarily a mistake. The award letter sets out the income the Pension Service used; if a pension figure is out of date, report it, because a correction can run either way.</p>

<h2>Claiming it</h2>
<p>There is no separate claim. Savings Credit is assessed automatically when you apply for Pension Credit, by phone, online or by post, and is backdated with the rest of the claim for up to ${PC.backdateMonths} months. The Pension Service will ask for details of every pension, with the gross weekly or monthly amount, and for savings and investments on the date of claim. If your partner is the one who reached State Pension age before April 2016, make the claim in a way that shows both dates of birth, since entitlement depends on the older partner.</p>

<h2>What the calculator here assumes</h2>
<p>The mini-simulator above treats all the income you enter as qualifying income, which is right for most pensioners whose income is State Pension and private pensions. If you receive a benefit such as Carer’s Allowance, the qualifying income is lower than the total, so enter only pensions there and use ${h.a('pension-credit-calculator', 'the full Pension Credit calculator')}, which keeps the two apart. For the rest of Pension Credit, including the additions and the savings rule, see ${h.a('pension-credit', 'Pension Credit explained')}.</p>
`,
});
