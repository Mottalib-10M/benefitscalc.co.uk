import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { winterOneOffs, oneOffTotal } from '../../lib/engine/support';
import { formatMoney, displayDate } from '../../lib/format';

const C = P.costOfLiving;
const g = (n: number, d = 0) => formatMoney(n, d);
const d = (iso: string) => displayDate(iso, 'en-GB');
const lowTotal = C.lowIncome.reduce((t, [, a]) => t + (a as number), 0);
const amounts = C.lowIncome.map(([, a]) => g(a as number));
const W = P.winterFuel;
// Examples for the 2026/27 section.
const pensioner = winterOneOffs({ nation: 'ew', pensionAge: true, benefit: 'pc' });
const family = winterOneOffs({ nation: 'ew', pensionAge: false, benefit: 'ucQualifying' });
const scotFamily = winterOneOffs({ nation: 'scotland', pensionAge: false, benefit: 'ucQualifying' });

export default definePage({
  id: 'cost-of-living-payment',
  group: 'housing',
  order: 70,
  mini: 'winterOneOffs',
  miniHref: 'benefits-calculator',
  related: ['winter-fuel-payment', 'cold-weather-payment', 'budgeting-loan', 'pension-age-winter-heating-payment', 'benefits-calculator', 'pension-credit'],
  sources: ['govCostOfLiving', 'govCrf', 'govColHelp', 'govWhd', 'govWfp', 'govColdWeather'],
  slug: 'cost-of-living-payment',
  nav: 'Cost of Living Payment',
  card: 'Why no Cost of Living Payment is coming in 2026/27, what was paid before, and the one-off help that replaced it.',
  title: 'Cost of Living Payment 2026: None Planned, What Replaced It',
  description: `Cost of Living Payment 2026: DWP plans no more after the ${amounts[amounts.length - 1]} of 2024. Now: the Crisis and Resilience Fund, Winter Fuel Payment and a ${g(P.warmHomeDiscount.amount)} Warm Home Discount.`,
  h1: 'Cost of Living Payments: why none are coming, and the help that remains',
  intro: 'The last Cost of Living Payment went out in February 2024. Here is what was paid, and what a household on benefits can still expect in 2026/27.',
  resume: `There is no Cost of Living Payment in 2026/27. GOV.UK states that DWP is not planning to make any more, in guidance updated on 1 April 2026, and a message asking you to apply for one is likely to be a scam. Between July 2022 and February 2024, people on Universal Credit, Pension Credit, income-based JSA, income-related ESA, Income Support or tax credits received five automatic payments, of ${amounts.join(', ')}, ${g(lowTotal)} in all, while disability benefit claimants got ${C.disabilityCount} payments of ${g(C.disability)} and pensioners ${g(C.pensionerLow)} or ${g(C.pensionerHigh)} with the Winter Fuel Payment. In their place, England’s councils have run the Crisis and Resilience Fund since ${d(P.crf.start)}, open to anyone who cannot pay for essentials. The regular winter help continues: Winter Fuel Payment of ${g(W.base)} or ${g(W.older)} for people born on or before ${d(W.bornOnOrBefore)}, Cold Weather Payments of ${g(P.coldWeather.payment)} per cold spell, and a ${g(P.warmHomeDiscount.amount)} Warm Home Discount for households on means-tested benefits in Great Britain.`,
  faqs: [
    { q: 'Will there be a Cost of Living Payment in 2026 or 2027?', a: `Not on current plans. The GOV.UK guidance updated on 1 April 2026 opens with the line that DWP is not planning to make any more Cost of Living Payments, and points to local council help instead. Any new payment would be announced on GOV.UK and paid automatically, as the earlier ones were; you would never need to apply or give bank details.` },
    { q: 'I think I missed a Cost of Living Payment from 2023. Can I still get it?', a: `Possibly. GOV.UK says payments were made automatically, including to people found eligible later, for example after a backdated award. Contact the office that pays the qualifying benefit or tax credits if one is missing. A nil award in the qualifying period, because of earnings, savings or a sanction, meant no payment, unless deductions or a hardship payment had brought it to zero.` },
    { q: 'Who can get help from the Crisis and Resilience Fund?', a: `Anyone in England who is vulnerable or cannot pay for essentials such as energy, water, food or housing costs, whether or not they get benefits. Each council designs its own scheme, so eligibility, how to apply and what is offered differ: some pay through local charities, some limit households to one application a year. A payment does not reduce your benefits.` },
    { q: 'Do I have to apply for the Warm Home Discount this winter?', a: `In England and Wales, usually not: if on ${d(P.warmHomeDiscount.qualifyingDate)} you or your partner got Universal Credit, Housing Benefit, income-related ESA or Pension Credit and your name was on the electricity bill of a participating supplier, the ${g(P.warmHomeDiscount.amount)} comes off the bill automatically. In Scotland some groups must apply to their supplier. The scheme does not run in Northern Ireland.` },
    { q: 'Someone texted me about claiming my Cost of Living Payment. Is it real?', a: `Treat it as a scam. GOV.UK warns that a message asking you to apply or contact someone about the payment might be one. DWP and HMRC paid every Cost of Living Payment automatically into the account used for benefits or tax credits, and none is planned now. Do not reply, click links or share bank details; contact the office that pays your benefit using the number on its letters.` },
  ],
  body: (h) => `
<h2>The five low-income payments, 2022 to 2024</h2>
<p>The Cost of Living Payments were paid automatically to anyone entitled to a qualifying means-tested benefit on a set date, or, for Universal Credit, for an assessment period ending in a set window. A couple on a joint claim got one payment between them. New Style JSA and New Style or contributory ESA alone did not qualify.</p>
${h.table(['Amount', 'Paid to most people from'], C.lowIncome.map(([iso, a]) => [h.gbp(a as number), h.date(iso as string)]), `Low-income Cost of Living Payments (GOV.UK, ${h.gbp(lowTotal)} in total)`, ['r', 'l'])}
<p>Tax credit claimants were paid by HMRC instead, provided their entitlement for the year was at least ${h.gbp(C.taxCreditMin)}; anyone on both tax credits and a DWP benefit was paid once, by DWP. People on PIP, DLA, Attendance Allowance, Adult or Child Disability Payment, Armed Forces Independence Payment and some war pensions received the separate ${h.gbp(C.disability)} Disability Cost of Living Payment in 2022 and again in 2023. Pensioners entitled to a Winter Fuel Payment for winter 2022 to 2023 or 2023 to 2024 had an extra ${h.gbp(C.pensionerLow)} or ${h.gbp(C.pensionerHigh)} added to it. None of these payments was taxable or affected other benefits, and none was repeated after ${h.date(C.lowIncome[C.lowIncome.length - 1][0] as string)}.</p>

<h2>Why the payments stopped</h2>
<p>The ${h.src('govCostOfLiving', 'GOV.UK guidance')} now carries a single line at the top saying DWP is not planning any more, followed by the record of what was paid. Ongoing help has moved to local schemes and the regular benefits themselves, which rose by ${h.pct(P.upratingCPI, 1)} in April 2026, with the new State Pension up ${h.pct(P.statePension.tripleLockIncrease, 1)}.</p>

<h2>What exists in 2026/27 instead</h2>
<h3>Crisis and Resilience Fund (England)</h3>
<p>From ${h.date(P.crf.start)} to ${h.date(P.crf.end)}, DWP funds English councils through the ${h.src('govCrf', 'Crisis and Resilience Fund')} to prevent hardship and to help people facing a financial crisis. GOV.UK also sends English tenants who need extra help with rent to the same fund, where Scotland and Wales use Discretionary Housing Payments. Councils decide how to run it, so help can go towards energy and water bills, food, essential items or housing costs, and some councils offer food vouchers to families in the school holidays. You do not have to be on benefits, and a payment does not affect any benefit you get. Search your council’s website for “Crisis and Resilience Fund”.</p>
<h3>Wales, Scotland and Northern Ireland</h3>
<p>Wales has the Discretionary Assistance Fund, Scotland the Scottish Welfare Fund with Crisis Grants and Community Care Grants, and Northern Ireland Discretionary Support and the Short-term Benefit Advance. Each is a crisis scheme rather than a flat payment, and each decides case by case. Northern Ireland’s Discretionary Support, for instance, is open to households with annual income after deductions of up to ${h.gbp(P.ni.dsIncomeLimit, 2)}, offers up to ${P.ni.dsLoansPerYear} interest-free loans in any 12 months, and can give a grant instead when a loan could not be repaid. Crisis Grants and Community Care Grants in Scotland are grants, so nothing is repaid.</p>
<h3>Winter payments that carry on</h3>
<p>The ${h.src('govWfp', 'Winter Fuel Payment')} for winter 2026 to 2027 is ${h.gbp(W.base)}, or ${h.gbp(W.older)} for those born before ${h.date(W.olderBornBefore)}, paid automatically to anyone in England, Wales or Northern Ireland born on or before ${h.date(W.bornOnOrBefore)}. HMRC takes it back from people whose own income is over ${h.gbp(W.incomeThreshold)}. Scotland pays the ${h.a('pension-age-winter-heating-payment', 'Pension Age Winter Heating Payment')} instead. ${h.a('cold-weather-payment', 'Cold Weather Payments')} of ${h.gbp(P.coldWeather.payment)} are made for each ${P.coldWeather.days}-day spell at or below zero between ${h.date(P.coldWeather.from)} and ${h.date(P.coldWeather.to)} to people on Pension Credit and some on Universal Credit or income-related ESA; Scotland replaces them with a ${h.gbp(P.scotland.winterHeating, 2)} Winter Heating Payment paid whatever the weather. The ${h.src('govWhd', 'Warm Home Discount')} of ${h.gbp(P.warmHomeDiscount.amount)} reopens in October 2026, taken off the electricity bill rather than paid to you.</p>

<h2>What three households can expect this winter</h2>
<p>A pensioner in England on Pension Credit can count on ${h.gbp(oneOffTotal(pensioner))} of fixed one-off help: ${pensioner.filter((x) => x.fixed).map((x) => `${x.name} ${h.gbp(x.amount)}`).join(' and ')}, plus ${h.gbp(P.coldWeather.payment)} for every cold spell. A lone parent in Wales on Universal Credit, not working, with a two-year-old, gets ${h.gbp(oneOffTotal(family))} through the Warm Home Discount and the same cold-spell payments. The same family in Glasgow gets ${h.gbp(oneOffTotal(scotFamily))}, the Winter Heating Payment plus the Warm Home Discount, and no Cold Weather Payments. Families in Scotland with children under 16 also get ${h.a('scottish-child-payment', 'Scottish Child Payment')}, ${h.gbp(P.scotland.childPayment, 2)} a week per child, all year round.</p>
<p>A household in work on Universal Credit with no young child or health element can still qualify for the Warm Home Discount in England and Wales, but not for Cold Weather Payments. Use the checker above for your own case, and ${h.a('benefits-calculator', 'the benefits calculator')} to see whether you are missing a regular benefit, which is usually worth far more than any one-off payment. A ${h.a('budgeting-loan', 'Budgeting Loan or Budgeting Advance')} can cover a single large cost interest free.</p>
`,
});
