import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { computePensionCredit, pcTariff } from '../../lib/engine/pension';
import { formatMoney } from '../../lib/format';

const PC = P.pensionCredit;
const g = (n: number, d = 2) => formatMoney(n, d);
const couple = computePensionCredit({ couple: true, income: 330, savings: 21000 });

export default definePage({
  id: 'pension-credit',
  group: 'pension',
  order: 20,
  mini: 'pcGuarantee',
  related: ['pension-credit-calculator', 'pension-credit-savings-credit', 'housing-benefit-calculator', 'attendance-allowance', 'winter-fuel-payment', 'cold-weather-payment'],
  sources: ['govPc', 'govPcElig', 'dwpRates', 'nidPc'],
  slug: 'pension-credit',
  nav: 'Pension Credit explained',
  card: 'Who qualifies, what counts as income, and what an award unlocks.',
  title: 'Pension Credit 2026/27: Who Qualifies and What It Unlocks',
  description: `Pension Credit 2026/27 tops income up to ${g(PC.guaranteeSingle)} a week single, ${g(PC.guaranteeCouple)} for a couple. Who qualifies, what counts, backdating, and the help it unlocks.`,
  h1: 'Pension Credit: who qualifies, and why a small award is worth claiming',
  intro: 'The pension-age safety net, and the gateway to help with rent, Council Tax, heating and NHS costs.',
  resume: `Pension Credit is a weekly top-up for people over State Pension age on a low income. Its main part, Guarantee Credit, raises income to ${g(PC.guaranteeSingle)} a week for a single person and ${g(PC.guaranteeCouple)} for a couple in 2026/27. The guaranteed amount is higher for someone with a severe disability (${g(PC.severeDisability)} more), a carer (${g(PC.carer)}), people responsible for children and homeowners with service charges or ground rent. Savings up to ${g(PC.capitalDisregard, 0)} are ignored, and there is no upper savings limit: each ${g(500, 0)} above it is treated as ${g(1, 0)} of weekly income. Owning your home does not stop a claim. Both partners must normally have reached State Pension age. The amount is often modest, but the award matters more than the money: it gives maximum Housing Benefit, Council Tax Reduction, Cold Weather Payments, help with NHS dental and optical costs, and a free TV licence from age 75. Claims can be backdated by ${PC.backdateMonths} months.`,
  faqs: [
    { q: 'What counts as income for Pension Credit and what is ignored?', a: 'State Pension, workplace and personal pensions, earnings, and most taxable benefits such as Carer’s Allowance count. Attendance Allowance, PIP, Disability Living Allowance, Adult and Pension Age Disability Payment, Child Benefit, Housing Benefit, Council Tax Reduction, the Christmas Bonus and Winter Fuel Payments are ignored. A pension you could draw but have not claimed is still counted as if you received it.' },
    { q: 'My partner is younger than State Pension age. Can we claim Pension Credit?', a: 'Not usually. Since 15 May 2019 a couple can only start Pension Credit when both partners have reached State Pension age; until then they claim Universal Credit as a couple. People already getting Pension Credit with a younger partner before that date keep it while they stay eligible.' },
    { q: 'Do I lose Pension Credit if I go on holiday abroad?', a: 'Not for a short trip. Pension Credit continues if you are away from Great Britain for four weeks or less. Longer absences can stop it unless an exception applies, such as medical treatment, so tell the Pension Service before you go.' },
    { q: 'Is there a Pension Credit in Northern Ireland?', a: 'Yes. The rules and rates are the same, but claims go to the Pension Service in Northern Ireland, part of the Department for Communities, rather than the DWP. nidirect explains how to apply by phone or by post, and the same passported help with rates, heating and health costs follows an award.' },
    { q: 'Does Pension Credit help with a mortgage?', a: 'Not directly. GOV.UK points homeowners on Pension Credit to Support for Mortgage Interest, a separate scheme with its own conditions. Service charges, ground rent and some site charges, on the other hand, are added to the guaranteed amount and paid as part of Pension Credit itself.' },
  ],
  body: (h) => `
<h2>The guaranteed amount, piece by piece</h2>
<p>Pension Credit starts from the standard minimum guarantee and adds whatever applies to your household. The total is called the appropriate amount; Guarantee Credit pays the gap between it and your income.</p>
${h.table(['Part of the guaranteed amount', 'A week in 2026/27'], [
  ['Single person', h.gbp(PC.guaranteeSingle, 2)],
  ['Couple', h.gbp(PC.guaranteeCouple, 2)],
  ['Severe disability, one person', h.gbp(PC.severeDisability, 2)],
  ['Severe disability, both of a couple', h.gbp(PC.severeDisabilityBoth, 2)],
  ['Carer getting Carer’s Allowance', h.gbp(PC.carer, 2)],
  ['Each child or young person', h.gbp(PC.child, 2)],
  ['First child born before 6 April 2017', h.gbp(PC.firstChildPre2017, 2)],
  ['Disabled child, lower and higher amounts', `${h.gbp(PC.disabledChildLower, 2)} / ${h.gbp(PC.disabledChildHigher, 2)}`],
], 'DWP benefit and pension rates 2026 to 2027', ['l', 'r'])}
<p>The severe disability amount needs a qualifying disability benefit, such as Attendance Allowance or the daily living part of PIP, and usually that nobody is paid Carer’s Allowance or the Universal Credit carer element for looking after you. It is the addition most often missed. A widower with ${h.gbp(225)} of State Pension and Attendance Allowance appears to have income almost at the single guarantee, yet with the severe disability amount his appropriate amount is ${h.gbp(PC.guaranteeSingle + PC.severeDisability, 2)}, and he is entitled to ${h.gbp(PC.guaranteeSingle + PC.severeDisability - 225, 2)} a week.</p>

<h2>Savings: no limit, but a rule</h2>
<p>Unlike Universal Credit, Pension Credit has no savings ceiling. The first ${h.gbp(PC.capitalDisregard)} is ignored. Above it, every ${h.gbp(500)} or part of ${h.gbp(500)} is treated as ${h.gbp(1)} of weekly income. ${h.gbp(15000)} therefore counts as ${h.gbp(pcTariff(15000))} a week and ${h.gbp(30000)} as ${h.gbp(pcTariff(30000))}. A couple with ${h.gbp(330)} of weekly pensions and ${h.gbp(21000)} saved have ${h.gbp(couple.income, 2)} counted against a guarantee of ${h.gbp(PC.guaranteeCouple, 2)}, and qualify for ${h.gbp(couple.guarantee, 2)} a week. The home you live in is not counted. Savings are valued on the date you claim, so a backdated claim uses the figure for the earlier date.</p>

<h2>What an award opens</h2>
<p>For many pensioners Pension Credit is worth more for what comes with it than for the weekly sum. ${h.src('govPc', 'GOV.UK lists the passported help')}: Housing Benefit at the maximum, which for a tenant can be the whole eligible rent; Council Tax Reduction; ${h.a('cold-weather-payment', 'Cold Weather Payments')} of ${h.gbp(P.coldWeather.payment)} for each very cold week; help with NHS dental treatment, glasses and travel to hospital with the Guarantee Credit part; a free TV licence for anyone aged 75 or over; and the Warm Home Discount on electricity bills. A ${h.gbp(3)} award is enough to open every one of these.</p>
<p>The ${h.a('winter-fuel-payment', 'Winter Fuel Payment')} no longer depends on Pension Credit: for winter 2026 to 2027 it is paid to everyone born on or before ${h.date(P.winterFuel.bornOnOrBefore)}, with recovery by HMRC above ${h.gbp(P.winterFuel.incomeThreshold)} of income.</p>

<h2>Claiming, and backdating</h2>
<p>You can apply up to ${PC.applyMonthsBefore} months before reaching State Pension age, online, by phone or by post. A late claim can be backdated by up to ${PC.backdateMonths} months, if you met the conditions throughout that time; you will need your income and savings figures for the backdated date. ${h.src('govPcElig', 'The eligibility page on GOV.UK')} lists what to have ready. Once you are on Pension Credit you must report changes, including a move, a new partner, or savings going over a figure the Pension Service gave you. In Northern Ireland the process is the same through ${h.src('nidPc', 'nidirect')}.</p>

<h2>Four reasons people wrongly think they cannot claim</h2>
<p>The first is home ownership. A mortgage-free house worth several hundred thousand pounds is ignored completely, and so is the fact that you once had a good salary. Only weekly income and savings outside the home matter.</p>
<p>The second is a State Pension that looks too high. Someone on ${h.gbp(250)} a week is above the single guarantee, but if they pay service charges on a retirement flat, those charges are added to the appropriate amount and can bring them back into entitlement. The same is true of the carer and severe disability additions.</p>
<p>The third is savings. Because there is no ceiling, a pensioner with ${h.gbp(20000)} in the bank is treated as having only ${h.gbp(pcTariff(20000))} more a week, and may still qualify.</p>
<p>The fourth is deferral. A State Pension you have chosen not to claim yet is counted as if you were receiving it, and while you or your partner get Pension Credit you cannot build up extra pension by deferring. Anyone thinking of ${h.a('state-pension-deferral', 'deferring the State Pension')} on a low income should check Pension Credit first.</p>

<h2>Savings Credit, for those who reached pension age before April 2016</h2>
<p>A second part, Savings Credit, rewards people who built up a modest private pension. It is closed to anyone who reached State Pension age on or after 6 April 2016, unless their partner reached it earlier. It pays at most ${h.gbp(PC.savingsMaxSingle, 2)} a week single and ${h.gbp(PC.savingsMaxCouple, 2)} for a couple, and can be paid even when income is above the guarantee. ${h.a('pension-credit-savings-credit', 'Savings Credit worked through')} sets out the two-step formula.</p>
<p>To estimate your own award with every addition, use ${h.a('pension-credit-calculator', 'the Pension Credit calculator')}.</p>
`,
});
