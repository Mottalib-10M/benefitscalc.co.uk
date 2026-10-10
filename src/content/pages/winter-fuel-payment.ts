import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { formatMoney } from '../../lib/format';

const W = P.winterFuel;
const g = (n: number) => formatMoney(n);

export default definePage({
  id: 'winter-fuel-payment',
  group: 'pension',
  order: 70,
  tool: 'wfp',
  related: ['pension-age-winter-heating-payment', 'cold-weather-payment', 'pension-credit', 'state-pension-age-calculator', 'cost-of-living-payment'],
  sources: ['govWfp', 'scotPawhp', 'govColdWeather'],
  slug: 'winter-fuel-payment',
  nav: 'Winter Fuel Payment',
  card: 'Your 2026/27 amount and whether HMRC takes it back.',
  title: 'Winter Fuel Payment 2026/27: £200 or £300, £35,000 Rule',
  description: `Winter Fuel Payment 2026/27: ${g(W.base)} or ${g(W.older)} if born on or before 27 June 1960, less in shared homes; paid automatically, recovered by HMRC above ${g(W.incomeThreshold)}.`,
  h1: 'Winter Fuel Payment this winter: who gets what',
  intro: 'Your date of birth, who you lived with in the qualifying week and your own income decide it.',
  resume: `For winter 2026 to 2027 the Winter Fuel Payment goes to everyone born on or before ${'27 June 1960'} who usually lives in England, Wales or Northern Ireland, whatever their income. Someone living alone, or with nobody else eligible, receives ${g(W.base)}, or ${g(W.older)} if born before 28 September 1946. Two eligible people sharing a home without a means-tested benefit get ${g(W.sharedBase)} each, or ${g(W.sharedOlder)} each if both are in the older group, and people in care homes get ${g(W.careHomeBase)} or ${g(W.careHomeOlder)}. What counts is your situation in the qualifying week, 21 to 27 September 2026. Most people are paid automatically in November or December. If your own total income for the tax year is over ${g(W.incomeThreshold)}, HMRC takes the payment back through your tax code or tax return; a partner’s income is not added. Scotland pays Pension Age Winter Heating Payment instead.`,
  faqs: [
    { q: 'My income is just over £35,000. Do I lose all of the Winter Fuel Payment?', a: `Yes. The recovery is not tapered: if your own total income for 2026/27 is over ${g(W.incomeThreshold)}, HMRC takes back the whole payment, usually by changing your tax code, or through Self Assessment. Income just under the line keeps it all. Pension contributions or Gift Aid that reduce taxable income may change which side you are on; check with HMRC.` },
    { q: 'Do I need to claim the Winter Fuel Payment?', a: 'Usually not. It is paid automatically if you get the State Pension or another qualifying benefit. You need to claim if you have never received it and get none of those benefits, or if you deferred your State Pension. Claims for winter 2026 to 2027 must reach the Winter Fuel Payment Centre by 31 March 2027.' },
    { q: 'Can I still opt out for this winter?', a: 'No. The window to opt out of the 2026 to 2027 payment has closed; if your income is over the threshold you will receive it and HMRC will recover it. You can opt out of the 2027 to 2028 payment from 21 December 2026, and opt back in for this winter by contacting the payment centre before 31 March 2027.' },
    { q: 'I have not been paid. When should I chase it?', a: 'Letters go out before payment, and most payments arrive in November or December. If nothing has arrived by 27 January 2027, contact the Winter Fuel Payment Centre on the number given on GOV.UK, with your National Insurance number, address and date of birth ready.' },
  ],
  body: (h) => `
<h2>All the amounts for winter 2026 to 2027</h2>
${h.table(['Your situation in the qualifying week', 'Born 28 Sept 1946 to 27 June 1960', 'Born before 28 Sept 1946'], [
  ['Living alone, or nobody else eligible', h.gbp(W.base), h.gbp(W.older)],
  ['You get Pension Credit, UC or income-related ESA on your own', h.gbp(W.base), h.gbp(W.older)],
  ['Couple with a joint award of one of those benefits (paid to one of you)', h.gbp(W.base) + ' if both are in this group', h.gbp(W.older) + ' if either is'],
  ['Sharing with another eligible person, no such benefit', h.gbp(W.sharedBase), `${h.gbp(W.sharedOlder)} if the other person is also older, ${h.gbp(W.base)} if not`],
  ['In a care home', h.gbp(W.careHomeBase), h.gbp(W.careHomeOlder)],
], 'GOV.UK, Winter Fuel Payment, winter 2026 to 2027', ['l', 'r', 'r'])}
<h2>How HMRC recovers it</h2>
<p>Total income here is income before deductions for the whole tax year: pensions, earnings, savings interest and taxable benefits, but not your partner’s. If you pay tax through PAYE, HMRC adjusts your tax code; ${h.src('govWfp', 'GOV.UK gives the example')} of someone repaying two years at once from January 2027, paying roughly £30 to £33 more tax a month for two ${h.gbp(W.base)} payments. On Self Assessment, the amount appears as a Winter Fuel Payment charge.</p>
<h2>Other help with heating</h2>
<p>People on Pension Credit can also get ${h.a('cold-weather-payment', 'Cold Weather Payments')} in very cold spells. In Scotland, ${h.a('pension-age-winter-heating-payment', 'Pension Age Winter Heating Payment')} replaces this payment with slightly higher amounts. None of these is affected by the others, and none reduces other benefits.</p>
`,
});
