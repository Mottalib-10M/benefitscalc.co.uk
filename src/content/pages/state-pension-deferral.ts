import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { deferNewScheme, deferOldScheme } from '../../lib/engine/pension-extra';
import { formatMoney, formatNumber } from '../../lib/format';

const SP = P.statePension;
const g = (n: number, d = 2) => formatMoney(n, d);
const full = SP.newFull;
const y1 = deferNewScheme(full, 52, false);
const y2 = deferNewScheme(full, 104, false);
const mix = deferNewScheme(full, 78, true);

export default definePage({
  id: 'state-pension-deferral',
  group: 'pension',
  order: 50,
  mini: 'deferral',
  miniHref: 'state-pension-amount',
  related: ['state-pension-amount', 'state-pension-age-calculator', 'old-basic-state-pension', 'pension-credit', 'winter-fuel-payment'],
  sources: ['govDefer', 'govNewSp', 'dwpRates'],
  slug: 'state-pension-deferral',
  nav: 'Deferring the State Pension',
  card: 'Extra pension or a lump sum: what a year’s delay is worth.',
  title: 'State Pension Deferral 2026/27: 1% Every 9 Weeks Explained',
  description: `State Pension deferral 2026/27: 1% extra for every 9 weeks, about ${g(y1.extraWeekly)} a week after a year on the full ${g(full)}, or arrears of up to 52 weeks as a lump sum.`,
  h1: 'Deferring the State Pension: what waiting adds, and how long it takes to pay back',
  intro: 'Your pension defers automatically if you do not claim it. The question is how you want the deferred money back.',
  resume: `If you do not claim your State Pension when you reach State Pension age, it is deferred automatically. Under the new State Pension, for people reaching State Pension age on or after 6 April 2016, every 9 weeks of deferral adds 1% to the weekly pension for life, which is one ninth of one per cent for each week, or about 5.78% for a full year. On the full rate of ${g(full)} that means roughly ${g(y1.extraWeekly)} more a week after 52 weeks. Instead, you can take up to 52 weeks of missed payments as a one-off arrears payment, ${g(full * 52)} for a year of the full rate, with no interest; any deferral beyond 52 weeks then becomes extra weekly pension. Older pensioners, who reached State Pension age before April 2016, earned 1% for every 5 weeks and could choose a lump sum with interest. Deferring rarely suits anyone on Pension Credit or Universal Credit, because no extra builds up while certain benefits are paid.`,
  faqs: [
    { q: 'How long does it take for deferring a year to pay off?', a: `On the full new State Pension, a year of deferral gives up ${g(full * 52, 0)} and adds about ${g(y1.extraWeekly)} a week. Ignoring tax and future increases, it takes around ${formatNumber((full * 52) / (y1.extraWeekly * 52), 1)} years to get the money back, which GOV.UK puts at over 15 years. Each extra year deferred adds roughly a year to that wait.` },
    { q: 'Is the extra State Pension from deferring increased every year?', a: 'Usually yes. Once you claim, the extra amount from deferring rises each April with the Consumer Prices Index, not with the triple lock that applies to the main pension. It is frozen for some people who live abroad, in countries where the State Pension is not uprated.' },
    { q: 'Can I defer while I am getting other benefits?', a: 'You can defer, but you cannot build up extra pension while you or your partner receive certain benefits, Pension Credit among them. For someone on a low income, deferring can simply mean losing pension that would have been paid, so claim on time and check Pension Credit instead.' },
    { q: 'Do I pay tax on a deferred State Pension lump sum?', a: 'The arrears payment and the extra weekly pension are both taxable. The arrears payment counts as income in the tax year you receive it, so a year of arrears paid while you are still earning can push part of your income into a higher tax band. Timing the claim for a tax year with lower income can reduce the bill.' },
  ],
  body: (h) => `
<h2>What a delay is worth on the full new State Pension</h2>
${h.table(['Weeks deferred', 'Increase', 'Extra a week', 'Extra a year', 'Or arrears lump sum'], [9, 26, 52, 104, 156].map((w) => {
  const r = deferNewScheme(full, w, false);
  return [String(w), `${h.num(r.extraPct * 100, 2)}%`, h.gbp(r.extraWeekly, 2), h.gbp(r.extraWeekly * 52), h.gbp(full * Math.min(w, SP.deferArrearsMaxWeeks), 2)];
}), `Full new State Pension of ${h.gbp(full, 2)} a week, 2026/27 rate, before tax`, ['l', 'r', 'r', 'r', 'r'])}
<p>The table uses the exact rule of one ninth of one per cent per week. ${h.src('govDefer', 'GOV.UK rounds')} the yearly increase to 5.8% and quotes ${h.gbp(13.99, 2)} for 52 weeks and ${h.gbp(27.99, 2)} for 104; the exact figures are ${h.gbp(y1.extraWeekly, 2)} and ${h.gbp(y2.extraWeekly, 2)}. The difference is a few pence, and the Pension Service applies the rule in the regulations.</p>

<h2>Lump sum, extra pension, or both</h2>
<p>People reaching State Pension age since April 2016 can take the deferred money in three ways. A one-off arrears payment pays back up to 52 weeks of missed pension in one go. Extra weekly pension pays the percentage increase for life. And a combination lets you backdate the claim by 52 weeks and turn anything beyond that into extra pension. GOV.UK’s example of 78 weeks of deferral gives arrears of ${h.gbp(mix.arrears, 2)} plus ${h.gbp(mix.extraWeekly, 2)} a week for the other 26 weeks, an increase of ${h.num(mix.extraPct * 100, 2)}%.</p>
<p>The choice comes down to health, tax and other income. The lump sum has no interest added, so it is simply your own pension paid late. The extra weekly pension pays more in total only if you live long enough, about fifteen years after claiming. Someone in poor health, or who needs the money, is usually better off claiming on time or taking the arrears.</p>

<h2>Three people, three decisions</h2>
<p><strong>Still working full time.</strong> A 66-year-old engineer earning a salary that already uses her basic-rate band would pay higher-rate tax on much of her State Pension if she claimed it now. Deferring for two years adds ${h.gbp(y2.extraWeekly, 2)} a week for life, taxed later when her income has dropped. If she prefers cash, she can claim at 67 and take 52 weeks of arrears in a tax year when she has stopped work.</p>
<p><strong>Retired on a small pension.</strong> A man with a part record worth ${h.gbp(160)} a week and little else would leave money on the table by deferring: he is likely to qualify for ${h.a('pension-credit', 'Pension Credit')}, which treats the unclaimed pension as income anyway, and nothing builds up while he receives it. Claiming on time is the right move.</p>
<p><strong>Undecided.</strong> Someone not sure whether they need the money can simply wait. The deferred amount accumulates, and the choice between arrears and extra pension is made only when claiming. Within the first 52 weeks, taking the arrears leaves them exactly where they would have been had they claimed on time, minus any tax effect.</p>

<h2>How to defer, and how to claim later</h2>
<p>You do not have to tell anyone that you are deferring: if you do not claim when you reach State Pension age, the pension defers by itself and keeps building up until you do. When you decide to claim, you apply in the usual way; you can ask for your claim to start from an earlier date, up to 52 weeks back, which is how the arrears payment works. In Northern Ireland, and for people living abroad, the claim goes through a different office, as ${h.src('govDefer', 'GOV.UK explains')}.</p>

<h2>If you reached State Pension age before April 2016</h2>
<p>The older scheme was more generous. Each 5 weeks of deferral added 1% to the basic and additional State Pension, about 10.4% a year: on the full basic State Pension of ${h.gbp(SP.basicFull, 2)}, a year of deferral adds ${h.gbp(deferOldScheme(SP.basicFull, 52), 2)} a week. After at least ${SP.oldLumpSumMinMonths} months of deferral you could instead take a lump sum including interest at 2% above the Bank of England base rate. You can have one or the other, not both, unless you reached State Pension age and deferred before 2005. When you claim, the Pension Service writes to ask which you prefer and gives three months to decide. ${h.a('old-basic-state-pension', 'The basic State Pension page')} covers the rest of that scheme.</p>

<h2>Effects on other money</h2>
<p>Deferring changes more than the pension. A State Pension you could claim but have not is still counted as income for ${h.a('pension-credit', 'Pension Credit')}, so a low-income pensioner who defers loses money twice: no pension and no extra Pension Credit. Weeks in which you or your partner receive Pension Credit or certain other benefits do not build up any extra. Prison time does not count either. The Winter Fuel Payment can need a claim if you have deferred since your last payment, as ${h.a('winter-fuel-payment', 'the Winter Fuel Payment page')} explains.</p>
<p>To see what your own record is worth before deciding, start from ${h.a('state-pension-amount', 'the State Pension amount calculator')} and the qualifying years on your GOV.UK forecast.</p>
`,
});
