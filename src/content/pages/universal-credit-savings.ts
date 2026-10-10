import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { tariffIncome } from '../../lib/engine/uc';
import { formatMoney } from '../../lib/format';

const U = P.uc;
const g = (n: number, d = 2) => formatMoney(n, d);
const lo = g(U.capitalLower, 0);
const hi = g(U.capitalUpper, 0);
const t = g(U.tariffPer250);

export default definePage({
  id: 'universal-credit-savings',
  group: 'uc',
  order: 80,
  mini: 'ucSavings',
  related: ['universal-credit-calculator', 'universal-credit-rates', 'universal-credit-deductions', 'pension-credit-savings-credit', 'benefits-calculator'],
  sources: ['govUcSavings', 'govUc', 'dwpRates', 'govUcEligibility'],
  slug: 'universal-credit-savings',
  nav: 'Savings and capital',
  card: `What counts as savings, the ${lo} and ${hi} limits, and the ${t} deducted per £250.`,
  title: `Universal Credit Savings 2026/27: ${lo} and ${hi} Limits`,
  description: `Universal Credit savings 2026/27: nothing changes below ${lo}, ${t} a month off per £250 or part above it, no award over ${hi}. What counts as capital.`,
  h1: 'Savings and Universal Credit: what counts and what it costs',
  intro: 'Three numbers and a long list: the limits, the monthly deduction, and what the DWP treats as capital.',
  resume: `Universal Credit ignores the first ${lo} of savings and other capital. Between ${lo} and ${hi}, the award is cut by ${t} a month for every ${g(250, 0)} above ${lo}, with another ${t} for any part of ${g(250, 0)} left over: ${g(7000, 0)} in the bank costs ${g(tariffIncome(7000))} a month, ${g(12000, 0)} costs ${g(tariffIncome(12000))}. Above ${hi} no Universal Credit is paid at all. The limits are the same for a single person and a couple, whose savings are added together, and they have not changed for 2026/27. Capital means cash, every bank and building society account including the current account, ISAs, Premium Bonds, shares, crypto, and property you own but do not live in. Your own home, personal possessions and savings held in your children’s names are ignored, and some compensation and benefit arrears are disregarded for a time. Wages left unspent at the end of the following assessment period become savings too.`,
  faqs: [
    { q: 'Does money in my current account count as savings for Universal Credit?', a: `Yes. GOV.UK lists money in your bank account, “including your main bank account”, and digital accounts such as PayPal, as capital. What protects your wages is timing: income only turns into savings if it is still unspent at the end of the assessment period after the one in which you received it. A salary paid on the 1st and mostly spent within that time does not push you over ${lo}.` },
    { q: 'Do my children’s savings affect our Universal Credit?', a: `Not if the money belongs to them and is held in their name: Junior ISAs, Child Trust Funds and children’s savings accounts are ignored, and you do not even need to declare them. Savings for children kept in your own name are different: GOV.UK lists them as your capital. Moving such money into an account in the child’s name could be treated as deliberately reducing your savings.` },
    { q: `Can I spend savings to get under the ${hi} Universal Credit limit?`, a: `You can spend money on debts and on goods and services that are reasonable in your circumstances, such as paying off a loan or credit card. If the DWP decides you reduced savings on purpose to get or increase Universal Credit, it treats you as still having the money, called notional capital, and deliberately misleading it about savings can lead to a penalty or prosecution.` },
    { q: 'Does a redundancy payment count as capital for Universal Credit?', a: `Yes. GOV.UK names redundancy pay among the changes to money and savings you must report, alongside inheritances, pension lump sums, compensation and divorce settlements. Once received, it is capital like any other savings: under ${lo} in total it has no effect, between ${lo} and ${hi} it reduces the award by ${t} for each ${g(250, 0)} or part, and above ${hi} the claim stops.` },
    { q: 'Is money from selling my home counted while I look for another one?', a: `Not for ${U.homeSaleDisregardMonths} months. Proceeds from selling the home you lived in are ignored for that time, including when you plan to use them to buy another home, and the period can be extended in special circumstances. You must still tell Universal Credit about the sale. The same ${U.homeSaleDisregardMonths}-month disregard applies to grants or loans for essential repairs or adaptations to your home.` },
  ],
  body: (h) => `
<h2>How the deduction is worked out</h2>
<p>The DWP does not care what interest your savings actually earn. It assumes an income of ${h.gbp(U.tariffPer250, 2)} a month for every ${h.gbp(250)} or part of ${h.gbp(250)} between ${h.gbp(U.capitalLower)} and ${h.gbp(U.capitalUpper)}, and takes that from your award pound for pound, after the earnings taper. ${h.src('govUcSavings', 'GOV.UK’s own examples')}: Sam has ${h.gbp(6300)}, which is ${h.gbp(300)} over, counted as two blocks, so ${h.gbp(tariffIncome(6300), 2)} a month comes off. Leeroy has ${h.gbp(14500)}, ${h.gbp(8500)} over, which is ${h.num(Math.ceil(8500 / 250))} blocks and ${h.gbp(tariffIncome(14500), 2)} a month. Helen has ${h.gbp(17000)} and cannot get Universal Credit.</p>
${h.table(['Savings', 'Taken off a month', 'Taken off a year'], [6000, 6250, 7500, 9000, 10000, 12500, 15000, 16000].map((c) => [h.gbp(c), h.gbp(tariffIncome(c), 2), h.gbp(tariffIncome(c) * 12, 2)]), 'Assumed income from capital, Universal Credit 2026/27 (DWP rates table)', ['l', 'r', 'r'])}
<p>At the top of the band, ${h.gbp(U.capitalUpper)} of savings costs ${h.gbp(tariffIncome(U.capitalUpper), 2)} a month. One pound more and the award goes from that reduced amount to nothing, so a household hovering near the limit should keep a close eye on interest payments and refunds.</p>

<h2>A year of savings in one example</h2>
<p>Priya and Tom have ${h.gbp(11200)} put aside when Tom loses his job. Their savings cost them ${h.gbp(tariffIncome(11200), 2)} of Universal Credit each month. As they live on part of the money, the deduction shrinks step by step: at ${h.gbp(9000)} it is ${h.gbp(tariffIncome(9000), 2)}, at ${h.gbp(7000)} it is ${h.gbp(tariffIncome(7000), 2)}, and below ${h.gbp(U.capitalLower)} it disappears. Each fall in savings is a change to report, and the award follows from the assessment period in which it happened. Savings held at exactly ${h.gbp(U.capitalLower)} or less never reduce the award, however long the claim lasts.</p>

<h2>What the DWP counts</h2>
<p>All money, savings and investments owned in the UK or abroad, by you alone or jointly, are capital. GOV.UK’s list includes:</p>
<ul>
<li>cash, current accounts, digital accounts and every type of savings account, including Help to Save, credit union and NS&amp;I accounts;</li>
<li>ISAs of all kinds, including Lifetime and Help to Buy ISAs, Premium Bonds, shares, dividends and cryptoassets;</li>
<li>property and land you own but do not live in, such as a flat you let out or a share of a relative’s home where your name is on the mortgage;</li>
<li>inheritances, money held in trust in most cases, and money in your name that belongs to someone else;</li>
<li>savings for building work or medical care, and unspent benefits such as Child Benefit or PIP.</li>
</ul>
<p>Debts are not subtracted. A ${h.gbp(9000)} savings account and a ${h.gbp(9000)} credit card balance count as ${h.gbp(9000)} of capital, which is why paying off the card can be the right move.</p>

<h2>What is ignored</h2>
${h.table(['Ignored', 'For how long'], [
  ['The home you live in, and personal possessions', 'Always'],
  ['Savings in your children’s own names (Junior ISA, Child Trust Fund)', 'Always'],
  ['Unpaid life insurance policies and funeral plan contracts', 'Always'],
  ['Payments from listed compensation schemes (infected blood, Grenfell, Post Office Horizon, Windrush and others)', 'Always'],
  ['Personal injury or illness compensation', `${U.compensationDisregardMonths} months, then only if held in a trust or annuity`],
  ['Arrears of benefits, Bereavement Support Payment, council welfare payments', `${U.compensationDisregardMonths} months`],
  ['Proceeds from selling your home, home repair grants or loans', `${U.homeSaleDisregardMonths} months, can be extended`],
  ['Assets of a business you still run, or closed recently', `While trading, then ${U.homeSaleDisregardMonths} months`],
], 'Capital disregarded for Universal Credit (GOV.UK: money, savings and investments)', ['l', 'l'])}
<p>You still have to declare most of these so the DWP can apply the disregard; only the first rows on life insurance, funeral plans, children’s savings and a working business need not be reported.</p>

<h2>When wages become savings</h2>
<p>Income is counted as income in the assessment period it arrives. If any of it is still unspent at the end of the next assessment period, it becomes capital. GOV.UK’s example: Katie’s periods run from the 8th to the 7th. Paid ${h.gbp(2000)} on 1 April, she has spent ${h.gbp(1500)} by 7 May, so from the period starting 8 May the remaining ${h.gbp(500)} is part of her savings. Tax refunds count as income in the same way. For most people this only matters near the ${h.gbp(U.capitalLower)} line.</p>

<h2>Couples, and people moved from tax credits</h2>
<p>A couple’s capital is added together, and the limits do not double: ${h.gbp(U.capitalUpper)} is the ceiling for the household even if only one partner is eligible for Universal Credit. If you separate, report it, and your own savings are then assessed alone. People who moved to Universal Credit from tax credits after a Migration Notice letter can have different savings rules for a period; the letter and the DWP guidance on transitional protection explain them. Those over State Pension age usually claim Pension Credit instead, which has its own rules, set out in ${h.a('pension-credit-savings-credit', 'the Pension Credit savings page')}.</p>
`,
});
