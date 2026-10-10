import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { formatMoney } from '../../lib/format';

const S = P.scotland;
const W = P.winterFuel;
const g = (n: number, d = 2) => formatMoney(n, d);
const [sharedBase, sharedOlder, base, older] = S.pawhp;

export default definePage({
  id: 'pension-age-winter-heating-payment',
  group: 'pension',
  order: 80,
  mini: 'pawhpCheck',
  miniHref: 'winter-fuel-payment',
  related: ['winter-fuel-payment', 'benefits-in-scotland', 'cold-weather-payment', 'pension-credit', 'adult-disability-payment-scotland'],
  sources: ['scotPawhp', 'scotUprating', 'scotWhp', 'govWfp'],
  slug: 'pension-age-winter-heating-payment',
  nav: 'Pension Age Winter Heating Payment',
  card: 'Scotland’s replacement for the Winter Fuel Payment, £105.55 to £316.70.',
  title: 'Pension Age Winter Heating Payment 2026/27: Scotland Amounts',
  description: `Pension Age Winter Heating Payment 2026/27 in Scotland: ${g(sharedBase)} to ${g(older)} if born on or before 27 June 1960, paid from November, recovered above £35,000.`,
  h1: 'Pension Age Winter Heating Payment: Scotland’s winter fuel help',
  intro: 'Paid by Social Security Scotland in place of the Winter Fuel Payment, at slightly higher amounts.',
  resume: `Pension Age Winter Heating Payment is the Scottish version of the Winter Fuel Payment, paid by Social Security Scotland to people who live in Scotland and were born on or before 27 June 1960. For winter 2026 to 2027 it is ${g(base)} for someone living alone, or with nobody else eligible, and ${g(older)} for anyone born before 28 September 1946. Two eligible people sharing a home without a qualifying benefit receive ${g(sharedBase)} each, or ${g(sharedOlder)} each when both are in the older group. The qualifying week is 21 to 27 September 2026, and you must live in Scotland on at least the last day of it. Most people are paid automatically from November 2026, after a letter, into the account used for the State Pension. As in the rest of the UK, HMRC recovers the payment from anyone whose own taxable income is over £35,000. The amounts are about 5.6% higher than the Winter Fuel Payment paid in England, Wales and Northern Ireland.`,
  faqs: [
    { q: 'I moved from England to Scotland in September 2026. Which winter payment do I get?', a: 'Where you live in the qualifying week decides it. Social Security Scotland pays Pension Age Winter Heating Payment if you lived in Scotland on at least the last day of 21 to 27 September 2026. If you were still in England, Wales or Northern Ireland that week, the DWP Winter Fuel Payment applies instead. You cannot receive both for the same winter.' },
    { q: 'Why is the Scottish payment slightly higher than the Winter Fuel Payment?', a: `The Scottish Government raises its payments each year in line with inflation under the Social Security (Scotland) Act 2018, as its up-rating report for 2026-27 explains. The DWP Winter Fuel Payment stayed at ${g(W.base, 0)} and ${g(W.older, 0)}, while the Scottish amounts rose from ${g(S.pawhpPrev[2])} and ${g(S.pawhpPrev[3])} to ${g(base)} and ${g(older)}.` },
    { q: 'I am in a care home in Scotland. Do I get Pension Age Winter Heating Payment?', a: 'Not if all of these applied: you were in residential care for the whole qualifying week, you moved in before 29 June 2026 and you received Pension Credit, Universal Credit, income-based JSA, income-related ESA or Income Support that week. Care home residents who do not meet all three conditions can still qualify.' },
    { q: 'When should I contact Social Security Scotland if I have not been paid?', a: 'Letters go out from November 2026 and payments continue through the winter. If nothing has arrived by the start of March 2027, check whether you needed to apply, then contact Social Security Scotland. Payments show on bank statements with a reference containing PAWHP.' },
  ],
  body: (h) => `
<h2>Every amount for winter 2026 to 2027</h2>
${h.table(['Your situation in the qualifying week', 'Born 28 Sept 1946 to 27 June 1960', 'Born before 28 Sept 1946'], [
  ['Living alone, or nobody you live with is eligible', h.gbp(base, 2), h.gbp(older, 2)],
  ['You get a qualifying benefit on your own', h.gbp(base, 2), h.gbp(older, 2)],
  ['Living with another eligible person, no qualifying benefit', h.gbp(sharedBase, 2), `${h.gbp(sharedOlder, 2)} if they are also older; ${h.gbp(base, 2)} if not`],
], 'mygov.scot, Pension Age Winter Heating Payment: how much you might be paid', ['l', 'r', 'r'])}
<p>The qualifying benefits that change the amount are Pension Credit, Universal Credit, income-based Jobseeker’s Allowance, income-related Employment and Support Allowance and Income Support. A couple with a joint award receives a single payment, made to the main person getting the DWP benefit. Someone born between 28 September 1946 and 27 June 1960 who lives with an older eligible person receives the lower shared figure, ${h.gbp(sharedBase, 2)}, while the older person receives ${h.gbp(base, 2)}.</p>

<h2>How it compares with the rest of the UK</h2>
${h.table(['Situation', 'Scotland', 'England, Wales, NI'], [
  ['Living alone, born 1946 to 1960', h.gbp(base, 2), h.gbp(W.base, 2)],
  ['Living alone, born before 28 Sept 1946', h.gbp(older, 2), h.gbp(W.older, 2)],
  ['Sharing, both born 1946 to 1960', h.gbp(sharedBase, 2), h.gbp(W.sharedBase, 2)],
  ['Sharing, both born before 28 Sept 1946', h.gbp(sharedOlder, 2), h.gbp(W.sharedOlder, 2)],
], 'Winter 2026 to 2027', ['l', 'r', 'r'])}
<p>The structure is the same as the DWP’s ${h.a('winter-fuel-payment', 'Winter Fuel Payment')}: the same birth dates, the same qualifying week, the same £35,000 recovery. Only the amounts and the agency differ.</p>

<h2>The £35,000 recovery</h2>
<p>Since winter 2025 to 2026 the payment has been universal again for people of pension age, but anyone whose individual total income is over £35,000 has it taken back by HMRC, through a tax code change or a Self Assessment return. Joint income does not count: in a couple where one partner has ${h.gbp(40000)} of pension income and the other ${h.gbp(15000)}, only the first loses their payment. You can opt out if you would rather not receive a payment that will be recovered; Social Security Scotland explains how on its opt-out page.</p>

<h2>Other winter help in Scotland</h2>
<p>Scotland has no Cold Weather Payments. People on certain low-income benefits receive a single ${h.src('scotWhp', 'Winter Heating Payment')} of ${h.gbp(S.winterHeating, 2)} instead, whatever the weather, and families of children on the highest disability rates receive the Child Winter Heating Payment of ${h.gbp(S.childWinterHeating, 2)}. A pensioner on Pension Credit can therefore receive both Pension Age Winter Heating Payment and Winter Heating Payment in the same winter. None of these payments affects other benefits. ${h.a('benefits-in-scotland', 'Benefits in Scotland')} lists the rest of the Scottish system, and the amounts are taken from the ${h.src('scotUprating', 'Scottish Government’s 2026-27 up-rating report')}.</p>

<h2>Three households, three amounts</h2>
<p>A widow in Dundee, born in 1949 and living alone on her State Pension, receives ${h.gbp(base, 2)}. Her income is well under £35,000, so she keeps it.</p>
<p>A couple in Inverness, he born in 1944 and she in 1951, neither on Pension Credit, are both eligible and live together. He is in the older group and she is not, so he receives ${h.gbp(base, 2)} and she ${h.gbp(sharedBase, 2)}, ${h.gbp(base + sharedBase, 2)} for the household. Had they had a joint Pension Credit award, a single payment of ${h.gbp(older, 2)} would have gone to the main claimant.</p>
<p>A retired consultant in Edinburgh, born in 1958, with a workplace pension of ${h.gbp(48000)} a year, is paid ${h.gbp(base, 2)} in the winter and has it taken back by HMRC through her tax code during the following tax year, unless she opts out first.</p>

<h2>Who needs to apply</h2>
<p>Most people do not: Social Security Scotland pays automatically and writes first, sending the money to the account used for the State Pension or other Scottish benefits. A small number need to apply, mainly people who do not receive the State Pension or another benefit that would identify them. The eligibility checker on mygov.scot tells you whether you are one of them. People who were in hospital getting free treatment for the whole qualifying week and the 52 weeks before it, or in custody for the whole week, are not eligible.</p>
`,
});
