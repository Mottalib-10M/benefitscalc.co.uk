import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { newStatePension } from '../../lib/engine/pension';
import { formatMoney } from '../../lib/format';

const SP = P.statePension;
const g = (n: number, d = 2) => formatMoney(n, d);

export default definePage({
  id: 'state-pension-amount',
  group: 'pension',
  order: 40,
  tool: 'sp',
  related: ['state-pension-age-calculator', 'state-pension-deferral', 'old-basic-state-pension', 'pension-credit-calculator', 'carers-credit'],
  sources: ['dwpRates', 'govNewSp', 'govDefer', 'govForecast'],
  slug: 'state-pension-amount',
  nav: 'State Pension amount',
  card: 'What your qualifying years are worth at the 2026/27 rate.',
  title: 'State Pension Amount 2026/27: £241.30 a Week and Your Years',
  description: `State Pension amount 2026/27: the full new State Pension is ${g(SP.newFull)} a week. See what your qualifying years give (1/35 each, from 10) and what deferring adds.`,
  h1: 'How much State Pension you will get',
  intro: 'Enter the qualifying years on your National Insurance record; add the weeks you plan to defer.',
  resume: `The full new State Pension is ${g(SP.newFull)} a week from April 2026, up 4.8% from ${g(SP.previous.newFull)} under the triple lock. It applies to men born on or after 6 April 1951 and women born on or after 6 April 1953. Someone whose National Insurance record started after April 2016 needs ${SP.qualifyingYearsFull} qualifying years for the full amount and at least ${SP.qualifyingYearsMin} to get anything; each year in between is worth one thirty-fifth of the full rate, about ${g(SP.newFull / SP.qualifyingYearsFull)} a week. People who were working before 2016 have a starting amount calculated from their old record, which can be above or below that, especially if they were contracted out of the additional State Pension. Delaying your claim adds 1% for every 9 weeks. Your GOV.UK forecast gives your own qualifying years and your personal figure.`,
  faqs: [
    { q: 'How much is a State Pension with 25 qualifying years?', a: `Under the 1/35 rule, 25 years give ${g(newStatePension(25))} a week, about ${formatMoney(newStatePension(25) * 52)} a year, at 2026/27 rates. That applies directly to records starting after April 2016; with an earlier record your forecast may differ because of the starting amount and any contracted-out years.` },
    { q: 'I have fewer than 10 qualifying years. Do I get nothing?', a: 'From the UK alone, yes: the new State Pension needs at least 10 qualifying years. Years of insurance in an EEA country, Switzerland or some other countries can count towards the 10-year minimum, but the amount paid is still based only on the UK years.' },
    { q: 'Why is my forecast above £241.30?', a: 'People with a record from before April 2016 can have a starting amount higher than the full new State Pension, usually because of additional State Pension built up before 2016. The extra is paid as a protected payment on top of the full rate and rises with inflation each April.' },
  ],
  body: (h) => `
<h2>Qualifying years and the weekly amount</h2>
${h.table(['Qualifying years', 'A week', 'A year'], [10, 15, 20, 25, 30, 35].map((y) => [String(y), h.gbp(newStatePension(y), 2), h.gbp(newStatePension(y) * 52)]), 'New State Pension 2026/27 under the 1/35 rule (records starting after April 2016)', ['l', 'r', 'r'])}
<p>A qualifying year is one in which you paid National Insurance on earnings, received National Insurance credits (for example with Child Benefit for a child under 12, Carer’s Allowance or ${h.a('carers-credit', 'Carer’s Credit')}, or Universal Credit), or paid voluntary contributions. ${h.src('govNewSp', 'GOV.UK’s guide to the new State Pension')} explains each route and how gaps can be filled.</p>
<h2>Getting the right input</h2>
<p>The number to enter is on ${h.src('govForecast', 'your State Pension forecast')}, under your National Insurance record. If your record started before April 2016, the forecast is more reliable than this calculator, which cannot rebuild a starting amount. Use it instead to test a scenario: what two more qualifying years would add, or the effect of ${h.a('state-pension-deferral', 'deferring your claim')} for a year. When the pension is low, ${h.a('pension-credit-calculator', 'Pension Credit')} may top it up.</p>
`,
});
