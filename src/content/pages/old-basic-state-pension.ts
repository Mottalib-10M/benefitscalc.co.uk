import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { formatMoney } from '../../lib/format';

const SP = P.statePension;
const g = (n: number, d = 2) => formatMoney(n, d);
const perYear30 = SP.basicFull / 30;

export default definePage({
  id: 'old-basic-state-pension',
  group: 'pension',
  order: 60,
  mini: 'basicSp',
  miniHref: 'pension-credit-calculator',
  related: ['state-pension-amount', 'state-pension-deferral', 'pension-credit-savings-credit', 'pension-credit', 'attendance-allowance'],
  sources: ['dwpRates', 'govBasicSp', 'govOver80', 'govDefer'],
  slug: 'old-basic-state-pension',
  nav: 'Basic State Pension',
  card: 'The pre-2016 pension: full rate, spouse’s rate and the age 80 addition.',
  title: 'Basic State Pension 2026/27: £184.90, Spouse Rate and Age 80',
  description: `Basic State Pension 2026/27: ${g(SP.basicFull)} a week in full, ${g(SP.basicLower)} on a spouse’s record or over 80 without contributions, plus the 25p age addition and payment days.`,
  h1: 'The basic State Pension: rates, the spouse’s pension and payment days',
  intro: 'For men born before 6 April 1951 and women born before 6 April 1953, who reached State Pension age under the old rules.',
  resume: `The basic State Pension is the old scheme for people who reached State Pension age before 6 April 2016: men born before 6 April 1951 and women born before 6 April 1953. Everyone eligible for it has now reached pension age. The full basic State Pension is ${g(SP.basicFull)} a week in 2026/27, up from ${g(SP.previous.basicFull)} under the triple lock. A married person or civil partner with too few years of their own can receive up to ${g(SP.basicLower)} a week on their spouse’s record, the Category B pension, and anyone aged 80 or over who reached pension age before April 2016 and has little or no basic pension can claim the same amount as the non-contributory over 80 pension. On top of the basic pension many people receive an Additional State Pension (SERPS or State Second Pension) earned through earnings, and everyone gets 25 pence a week more from their 80th birthday. The full amount needed 30 qualifying years for most people in this group.`,
  faqs: [
    { q: 'How many years did I need for the full basic State Pension?', a: 'Men born between 1945 and 6 April 1951 and women born between 1950 and 6 April 1953 needed 30 qualifying years; one qualifying year was enough for some pension. Men born before 1945 needed 44 years and women born before 1950 needed 39, with 11 and 10 years respectively as the minimum for any pension.' },
    { q: 'What is the 25p age addition and do I need to claim it?', a: `It is an extra ${g(SP.age80Addition)} a week paid with the State Pension from age 80. The DWP rates table shows it at the same ${g(SP.age80Addition)} in 2025/26 and 2026/27: unlike the pension itself, it is not uprated each April. The Pension Service adds it to the pension of people who qualify.` },
    { q: 'Which day of the week is my basic State Pension paid?', a: 'It depends on the last two digits of your National Insurance number: 00 to 19 on Monday, 20 to 39 on Tuesday, 40 to 59 on Wednesday, 60 to 79 on Thursday and 80 to 99 on Friday. Payment is usually every four weeks in arrears into the account you chose.' },
    { q: 'Can I get more basic State Pension through my husband or wife?', a: `Possibly, if your own basic pension is below ${g(SP.basicLower)} a week. A married person or civil partner who reached State Pension age before April 2016 can top up to that amount using their spouse’s record, and a widow, widower or surviving civil partner may inherit up to the full ${g(SP.basicFull)}. The Pension Service checks the conditions, which depend on both partners’ dates.` },
  ],
  body: (h) => `
<h2>The 2026/27 rates of the old State Pension</h2>
${h.table(['Part', 'A week', 'Every 4 weeks', 'A year'], [
  ['Basic State Pension, full (Category A or B)', h.gbp(SP.basicFull, 2), h.gbp(SP.basicFull * 4, 2), h.gbp(SP.basicFull * 52)],
  ['Category B lower rate, on a spouse’s or civil partner’s record', h.gbp(SP.basicLower, 2), h.gbp(SP.basicLower * 4, 2), h.gbp(SP.basicLower * 52)],
  ['Category C or D, non-contributory', h.gbp(SP.basicLower, 2), h.gbp(SP.basicLower * 4, 2), h.gbp(SP.basicLower * 52)],
  ['Age addition from 80', h.gbp(SP.age80Addition, 2), h.gbp(SP.age80Addition * 4, 2), h.gbp(SP.age80Addition * 52)],
  ['Maximum Additional State Pension (own and inherited)', h.gbp(SP.maxAdditionalPension, 2), h.gbp(SP.maxAdditionalPension * 4, 2), h.gbp(SP.maxAdditionalPension * 52)],
], 'DWP benefit and pension rates 2026 to 2027', ['l', 'r', 'r', 'r'])}
<p>The basic pension rises each April by the highest of earnings growth, price inflation and 2.5%, the triple lock; for April 2026 that was 4.8%. The Additional State Pension, by contrast, rises with prices only, by 3.8% this year, and so does any extra pension from deferral.</p>

<h2>A part record</h2>
<p>For the group that needed 30 years, each qualifying year is worth one thirtieth of the full rate, about ${h.gbp(perYear30, 2)} a week. A woman born in 1952 with 22 qualifying years of her own receives about ${h.gbp(perYear30 * 22, 2)}. If her husband has a full record and reached pension age under the old rules, the Category B rule can lift her basic pension to ${h.gbp(SP.basicLower, 2)}; her own Additional State Pension and any graduated retirement benefit are paid on top. When he dies, she may be able to inherit enough of his basic pension to reach the full ${h.gbp(SP.basicFull, 2)}, as well as part of his Additional State Pension.</p>
<p>A qualifying year counted if you paid National Insurance on earnings, received credits while unemployed, sick, a parent or a carer, or paid voluntary contributions. Older records are hard to rebuild from memory; the Pension Service holds the official count, and its uprating letter each spring shows how the basic and additional parts are split.</p>

<h2>The Category D pension at 80</h2>
<p>Someone aged 80 or over whose basic State Pension is below ${h.gbp(SP.basicLower, 2)}, or who has none, can claim the ${h.src('govOver80', 'over 80 pension')}, which tops their pension up to that figure without any contribution record. GOV.UK’s example: a basic pension of ${h.gbp(45)} topped up by ${h.gbp(SP.basicLower - 45, 2)}. The conditions are residence, not contributions: at least 10 years in the UK out of a 20-year period that includes the day before the 80th birthday or later, and ordinary residence in the UK, the Isle of Man or Gibraltar on the birthday or the date of claim. It cannot be claimed by anyone who reached State Pension age on or after 6 April 2016. You can claim from three months before turning 80. It is taxable and counts as income for ${h.a('pension-credit', 'Pension Credit')}.</p>

<h2>Payment day and frequency</h2>
${h.table(['Last 2 digits of National Insurance number', 'Payment day'], [['00 to 19', 'Monday'], ['20 to 39', 'Tuesday'], ['40 to 59', 'Wednesday'], ['60 to 79', 'Thursday'], ['80 to 99', 'Friday']], 'GOV.UK, basic State Pension: when you’re paid', ['l', 'l'])}
<p>The pension is normally paid every four weeks to a bank, building society or credit union account of your choice; tell the Pension Service to change the account. Your annual uprating letter shows the amounts after each April increase.</p>

<h2>Tax on the basic State Pension</h2>
<p>The State Pension is taxable but paid without tax taken off. The full basic pension comes to about ${h.gbp(SP.basicFull * 52)} a year, below the Personal Allowance of ${h.gbp(P.tax.personalAllowance)} for 2026/27, so a pensioner with no other income pays nothing. Tax arises when a workplace pension, earnings or savings interest push total income above the allowance; HMRC then usually collects the tax on the State Pension through the tax code applied to the other pension. Someone with a basic pension, a full Additional State Pension and a modest company pension can find most of the company pension taxed at ${h.pct(P.tax.basicRate, 0)}, because the State Pension has already used up much of the allowance. The over 80 pension is taxable in the same way.</p>

<h2>More than the basic pension</h2>
<p>Besides the Additional State Pension, two routes add money. Deferral under the old scheme added 1% for every 5 weeks, about 10.4% a year, or a lump sum with interest; ${h.a('state-pension-deferral', 'deferring the State Pension')} compares the two schemes. And for those on a low income, ${h.a('pension-credit-savings-credit', 'Savings Credit')} is still open to this group, because it is reserved for people who reached State Pension age before April 2016. Anyone who needs help with personal care should also look at ${h.a('attendance-allowance', 'Attendance Allowance')}, which is not means-tested and also raises Pension Credit through the severe disability amount.</p>
`,
});
