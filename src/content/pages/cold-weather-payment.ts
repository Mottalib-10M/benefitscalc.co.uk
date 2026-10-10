import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { formatMoney } from '../../lib/format';

const C = P.coldWeather;
const g = (n: number, d = 0) => formatMoney(n, d);

export default definePage({
  id: 'cold-weather-payment',
  group: 'pension',
  order: 100,
  mini: 'coldWeather',
  miniHref: 'pension-credit-calculator',
  related: ['winter-fuel-payment', 'pension-credit', 'pension-age-winter-heating-payment', 'universal-credit-health-element', 'cost-of-living-payment'],
  sources: ['govColdWeather', 'scotWhp', 'govPc'],
  slug: 'cold-weather-payment',
  nav: 'Cold Weather Payment',
  card: '£25 for each freezing week, and who qualifies through which benefit.',
  title: 'Cold Weather Payment 2026/27: £25 a Week, Who Qualifies',
  description: `Cold Weather Payment 2026/27: ${g(C.payment)} for each 7 days at or below 0°C between 1 November 2026 and 31 March 2027, paid with Pension Credit and some UC claims.`,
  h1: 'Cold Weather Payments: £25 when it freezes for a week',
  intro: 'Triggered by your local weather station, paid automatically, and easy to miss if a change goes unreported.',
  resume: `A Cold Weather Payment of ${g(C.payment)} is paid for each period of seven consecutive days when the average temperature at the weather station linked to your postcode is recorded as, or forecast to be, zero degrees Celsius or below. The scheme runs from 1 November 2026 to 31 March 2027 in England, Wales and Northern Ireland. You do not claim: the payment arrives automatically, usually within 14 working days of the cold spell, if you receive a qualifying benefit. Pension Credit qualifies on its own. Universal Credit qualifies when neither partner is in work and there is a child under five or a health condition assessed as limiting work, or at any time when the claim includes a disabled child amount. Income-related ESA and Support for Mortgage Interest qualify in similar cases. Payments do not reduce other benefits. Scotland has replaced the scheme with an annual Winter Heating Payment of ${g(P.scotland.winterHeating, 2)}.`,
  faqs: [
    { q: 'I work part time and get Universal Credit. Can I get Cold Weather Payments?', a: 'Only if your claim includes a disabled child amount, which qualifies whether or not you or your partner work. Otherwise Universal Credit claimants qualify only when neither partner is employed or gainfully self-employed, and there is a child under five or an assessed limited capability for work.' },
    { q: 'I had a baby in December. Will I now get Cold Weather Payments?', a: 'Possibly, if you get Universal Credit or income-related ESA and the baby is your route to entitlement, but only if you report the birth. A child under five does not trigger payments automatically until DWP knows about them. Report the change through your Universal Credit account or to Jobcentre Plus for ESA.' },
    { q: 'How do I know if a cold weather period has been triggered where I live?', a: 'GOV.UK has a postcode checker for England and Wales and another for Northern Ireland during the winter. It shows whether the weather station linked to your postcode has recorded or forecast seven days at zero degrees or below. Each triggered period means one payment.' },
    { q: 'Is a Cold Weather Payment the same as the Winter Fuel Payment?', a: `No. The Winter Fuel Payment is a single yearly sum of ${g(P.winterFuel.base)} or ${g(P.winterFuel.older)} for everyone born on or before 27 June 1960, regardless of weather. Cold Weather Payments depend on low-income benefits and on actual freezing spells. A pensioner on Pension Credit can receive both in the same winter.` },
  ],
  body: (h) => `
<h2>Who qualifies, benefit by benefit</h2>
${h.table(['Benefit', 'When it qualifies for Cold Weather Payments'], [
  ['Pension Credit', 'Usually always'],
  ['Universal Credit', 'Neither partner employed or gainfully self-employed, and a child under 5 or limited capability for work; or, in or out of work, a disabled child amount'],
  ['Income-related ESA', 'In the work-related activity or support group; otherwise with a severe or enhanced disability premium, a pensioner premium, a disabled child or a child under 5'],
  ['Support for Mortgage Interest', 'Treated as getting a qualifying benefit with a disability or pensioner premium, a disabled child or a child under 5'],
], 'GOV.UK, Cold Weather Payment: eligibility', ['l', 'l'])}
<p>The rule for Universal Credit catches many families out. A single parent on Universal Credit with a three-year-old, not in work, qualifies. The same parent starting a part-time job loses entitlement for future cold spells, unless one of the children has the disabled child amount on the claim. For self-employment, ${h.src('govColdWeather', 'GOV.UK explains')} that you are likely to be treated as gainfully self-employed if it is your main job, you work regularly and you expect to make a profit.</p>

<h2>What a winter can be worth</h2>
<p>A mild winter can pass with no payment at all, while a hard one can trigger several periods in upland areas. Each counts separately, so three separate freezing weeks mean ${h.gbp(C.payment * 3)}. The payment is the same everywhere in England, Wales and Northern Ireland; what varies is how often your station hits the trigger. Payments usually go into the account where your benefit is paid, within 14 working days of the cold period.</p>
${h.table(['Freezing periods this winter', 'Cold Weather Payments'], [1, 2, 3, 4, 6].map((n) => [String(n), h.gbp(n * C.payment)]), `${h.gbp(C.payment)} per 7-day period, ${h.date(C.from)} to ${h.date(C.to)}`, ['l', 'r'])}

<h2>How the trigger works</h2>
<p>Every postcode is linked to a weather station. A period counts when the average temperature at that station over seven consecutive days is recorded at, or forecast to be, zero degrees Celsius or below. Because a forecast can trigger a payment, the money can be on its way before the cold snap ends. What counts is the average across the seven days, not the coldest night: a week of hard frosts with mild afternoons may not reach the trigger, while a long, grey, sub-zero spell will. Each separate period that reaches the trigger gives its own payment.</p>
<p>The scheme is the same for everyone who qualifies in a postcode area, so neighbours on different benefits receive the same ${h.gbp(C.payment)} for the same cold week, provided each meets their own benefit’s condition.</p>

<h2>Changes that affect payments</h2>
<p>Two changes in circumstances matter most. The first is a child: a baby born during the winter, or a child under five coming to live with you, can bring a Universal Credit or ESA household into the scheme, but only once reported. The second is a hospital stay: GOV.UK asks you to tell the Pension Service or Jobcentre Plus, or to add a note to your Universal Credit journal, if you go into hospital, because it can affect payment. Starting work can also end entitlement for a Universal Credit household without a disabled child amount, as explained above.</p>

<h2>If a payment does not arrive</h2>
<p>First check the postcode tool for your area: if no period was triggered, no payment is due. If one was, and you are sure you qualify, contact the office that pays your benefit, the Pension Service for Pension Credit or Universal Credit through your journal. The usual reason for a missed payment is a change DWP does not know about, such as a new baby or a child under five coming to live with you. If you have no online account, the Universal Credit helpline number is on your letters.</p>

<h2>Scotland: a flat payment instead</h2>
<p>People in Scotland cannot get Cold Weather Payments. Social Security Scotland pays a ${h.src('scotWhp', 'Winter Heating Payment')} of ${h.gbp(P.scotland.winterHeating, 2)} once a year, from December, to people on the qualifying low-income benefits, whatever the weather. It is lower than several Cold Weather Payments in a harsh winter and higher than none in a mild one; the trade-off is predictability against a possible larger sum in a hard winter. Pensioners in Scotland also receive ${h.a('pension-age-winter-heating-payment', 'Pension Age Winter Heating Payment')}.</p>

<h2>Other winter help</h2>
<p>Cold Weather Payments sit alongside the ${h.a('winter-fuel-payment', 'Winter Fuel Payment')} for older people and the Warm Home Discount on electricity bills for people on ${h.a('pension-credit', 'Pension Credit')} and some low-income households. For one-off emergencies, councils in England run the Crisis and Resilience Fund, set out with the rest of the 2026/27 picture on ${h.a('cost-of-living-payment', 'the cost of living payments page')}.</p>
`,
});
