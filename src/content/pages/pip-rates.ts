import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { formatMoney } from '../../lib/format';

const pip = P.pip;
const g = (n: number, d = 2) => formatMoney(n, d);
const max = pip.dailyEnhanced + pip.mobilityEnhanced;
const min = pip.mobilityStandard;

export default definePage({
  id: 'pip-rates',
  group: 'disability',
  order: 20,
  mini: 'pipRates',
  miniHref: 'pip-points-calculator',
  related: ['pip-points-calculator', 'pip-eligibility', 'pip-payment-dates', 'universal-credit-and-pip', 'adult-disability-payment-scotland', 'attendance-allowance'],
  sources: ['dwpRates', 'govPip', 'pipRegs5', 'scotAdp'],
  slug: 'pip-rates',
  nav: 'PIP rates',
  card: 'The four PIP rates for 2026/27, weekly, 4-weekly and yearly.',
  title: 'PIP Rates 2026/27: Weekly, 4-Weekly and Yearly Amounts',
  description: `PIP rates 2026/27: daily living ${g(pip.dailyStandard)} or ${g(pip.dailyEnhanced)} a week, mobility ${g(pip.mobilityStandard)} or ${g(pip.mobilityEnhanced)}. All nine combinations, weekly, every 4 weeks and per year, in a table.`,
  h1: 'PIP rates this year, and what each combination pays',
  intro: 'Two parts, two rates each: nine possible awards, from nothing to the full enhanced rate on both.',
  resume: `Personal Independence Payment rose by 3.8% in April 2026. The daily living part now pays ${g(pip.dailyStandard)} a week at the standard rate and ${g(pip.dailyEnhanced)} at the enhanced rate; the mobility part pays ${g(pip.mobilityStandard)} or ${g(pip.mobilityEnhanced)}. An award can include one part or both, at any mix of rates, so the weekly total runs from ${g(min)} for standard mobility alone to ${g(max)} for both parts at the enhanced rate, which is ${g(max * 4)} every four weeks and about ${formatMoney(max * 52)} a year. Which rate you receive depends only on points: 8 points in a part for the standard rate, 12 for the enhanced rate, scored on ten daily living activities and two mobility activities. PIP is not means-tested and not taxable, does not reduce Universal Credit, and is paid whether or not you work. In Scotland the same rates are paid as Adult Disability Payment.`,
  faqs: [
    { q: 'What is the most PIP anyone can get a week in 2026/27?', a: `${g(max)}: the enhanced daily living rate of ${g(pip.dailyEnhanced)} plus the enhanced mobility rate of ${g(pip.mobilityEnhanced)}. Paid every four weeks, that is ${g(max * 4)}. There is no higher rate for severe conditions; people nearing the end of life receive the enhanced daily living rate automatically, and their mobility award still depends on their needs.` },
    { q: 'Why did my PIP go up in April 2026?', a: `Disability benefits are increased each April in line with the Consumer Prices Index for the previous September, which was 3.8% in September 2025. The standard daily living rate went from ${g(pip.previous.dailyStandard)} to ${g(pip.dailyStandard)} a week and the enhanced mobility rate from ${g(pip.previous.mobilityEnhanced)} to ${g(pip.mobilityEnhanced)}. The increase is applied automatically from the first payment after the change.` },
    { q: 'Is PIP counted as income for Universal Credit or Housing Benefit?', a: 'No. PIP is ignored when Universal Credit, Housing Benefit, Pension Credit and Council Tax Reduction are worked out. It can even raise them: the daily living part can exempt a household from the benefit cap and from the non-dependant deduction, and can qualify a carer for Carer’s Allowance or the Universal Credit carer element.' },
    { q: 'Do I pay tax on PIP?', a: 'No. PIP is not taxable and is not included in your income for the High Income Child Benefit Charge or the Winter Fuel Payment threshold. You do not need to declare it on a Self Assessment return. It is also paid whatever your savings, so a large sum in the bank does not change the rate.' },
    { q: 'Do the Motability scheme and the Blue Badge depend on the rate?', a: 'Yes, mostly on the mobility part. The enhanced mobility rate lets you use your mobility payment to lease a car, scooter or powered wheelchair through the Motability scheme. PIP can also help you get a Blue Badge, a vehicle tax discount or exemption, and local discounts on Council Tax or bus travel, which your council confirms.' },
  ],
  body: (h) => `
<h2>All nine PIP awards in 2026/27</h2>
<p>Each part is assessed separately, so the award letter names a rate for daily living and a rate for mobility, either of which may be nil. The table gives every combination, weekly and as paid every four weeks.</p>
${h.table(['Daily living', 'Mobility', 'A week', 'Every 4 weeks', 'A year'], [
  ['Enhanced', 'Enhanced', h.gbp(max, 2), h.gbp(max * 4, 2), h.gbp(max * 52)],
  ['Enhanced', 'Standard', h.gbp(pip.dailyEnhanced + pip.mobilityStandard, 2), h.gbp((pip.dailyEnhanced + pip.mobilityStandard) * 4, 2), h.gbp((pip.dailyEnhanced + pip.mobilityStandard) * 52)],
  ['Enhanced', 'None', h.gbp(pip.dailyEnhanced, 2), h.gbp(pip.dailyEnhanced * 4, 2), h.gbp(pip.dailyEnhanced * 52)],
  ['Standard', 'Enhanced', h.gbp(pip.dailyStandard + pip.mobilityEnhanced, 2), h.gbp((pip.dailyStandard + pip.mobilityEnhanced) * 4, 2), h.gbp((pip.dailyStandard + pip.mobilityEnhanced) * 52)],
  ['Standard', 'Standard', h.gbp(pip.dailyStandard + pip.mobilityStandard, 2), h.gbp((pip.dailyStandard + pip.mobilityStandard) * 4, 2), h.gbp((pip.dailyStandard + pip.mobilityStandard) * 52)],
  ['Standard', 'None', h.gbp(pip.dailyStandard, 2), h.gbp(pip.dailyStandard * 4, 2), h.gbp(pip.dailyStandard * 52)],
  ['None', 'Enhanced', h.gbp(pip.mobilityEnhanced, 2), h.gbp(pip.mobilityEnhanced * 4, 2), h.gbp(pip.mobilityEnhanced * 52)],
  ['None', 'Standard', h.gbp(pip.mobilityStandard, 2), h.gbp(pip.mobilityStandard * 4, 2), h.gbp(pip.mobilityStandard * 52)],
], 'PIP rates from April 2026 (DWP benefit and pension rates 2026 to 2027)', ['l', 'l', 'r', 'r', 'r'])}
<p>A year is counted as 52 weeks. In practice thirteen four-weekly payments fall in most years, and a fourteenth occasionally lands in the same tax year, which is why a bank statement can show slightly more than the yearly figure here.</p>

<h2>Points decide the rate, the diagnosis does not</h2>
<p>Two people with the same condition often get different awards, because PIP looks at what you can and cannot do, not at the name of the illness. The assessment gives points for each of ten daily living activities, from preparing food to making budgeting decisions, and two mobility activities, planning journeys and moving around. Only the highest-scoring descriptor in each activity counts, and it must apply on more than half of the days. ${h.src('pipRegs5', 'Regulations 5 and 6')} then set the thresholds: 8 points in a part for the standard rate and 12 for the enhanced rate. An activity alone can carry a claim. Being unable to stand and move more than 20 metres scores 12 in moving around and gives the enhanced mobility rate by itself, while needing prompting to wash and dress scores 4 between the two activities and needs points from elsewhere.</p>
<p>The descriptors also have to be met reliably: safely, to an acceptable standard, as often as needed and in a reasonable time, no more than twice as long as someone without your condition. A person who can walk 50 metres once but then needs to rest for an hour does not meet the 50-metre descriptor reliably. ${h.a('pip-points-calculator', 'The PIP points calculator')} lists every descriptor with its points so that you can see where your claim stands before the assessment.</p>

<h2>What a rate means in practice</h2>
<p>The standard daily living rate of ${h.gbp(pip.dailyStandard, 2)} is worth about ${h.gbp(pip.dailyStandard * 52)} a year, enough to pay for a weekly cleaner or regular taxis to appointments. The enhanced rate, ${h.gbp(pip.dailyEnhanced, 2)}, adds roughly ${h.gbp((pip.dailyEnhanced - pip.dailyStandard) * 52)} a year more. On mobility the gap between the two rates is wider: ${h.gbp(pip.mobilityStandard, 2)} against ${h.gbp(pip.mobilityEnhanced, 2)}, a difference of around ${h.gbp((pip.mobilityEnhanced - pip.mobilityStandard) * 52)} a year, and only the enhanced rate opens the Motability scheme.</p>
<p>The daily living part also has knock-on effects that can be worth more than the payment. It lets an unpaid carer claim Carer’s Allowance, ${h.gbp(P.carers.allowance, 2)} a week, or the Universal Credit carer element of ${h.gbp(P.uc.carer, 2)} a month. It exempts the household from the benefit cap and stops Universal Credit deducting ${h.gbp(P.uc.nonDepDeduction, 2)} a month for a grown-up child living at home. For someone over State Pension age on Pension Credit, it can add the severe disability amount of ${h.gbp(P.pensionCredit.severeDisability, 2)} a week when no one is paid to care for them. ${h.a('universal-credit-and-pip', 'PIP and Universal Credit')} goes through these links one by one.</p>

<h2>How and when the money arrives</h2>
<p>PIP is paid every ${pip.paidEveryWeeks} weeks in arrears, into a bank, building society or credit union account, on the same weekday each time. The first payment usually includes arrears back to the date of claim, which is the day you phoned or the day the form was requested, not the day of the decision. ${h.a('pip-payment-dates', 'PIP payment dates')} shows how to work out the next payments from the date on your award letter.</p>
<p>An award lasts between nine months and ten years, and it can be reviewed during that time. If your needs increase, you can ask for a review, though the DWP may lower the award as well as raise it. If you disagree with a decision, you must ask for a mandatory reconsideration, normally within one month of the date on the letter, before you can appeal to a tribunal.</p>

<h2>Scotland and Northern Ireland</h2>
<p>New claims in Scotland go to Social Security Scotland for ${h.src('scotAdp', 'Adult Disability Payment')}, which uses the same activities, points and weekly rates as PIP: ${h.gbp(P.pip.dailyStandard, 2)} and ${h.gbp(P.pip.dailyEnhanced, 2)} for daily living, ${h.gbp(P.pip.mobilityStandard, 2)} and ${h.gbp(P.pip.mobilityEnhanced, 2)} for mobility. The difference is who runs it: Social Security Scotland, an agency of the Scottish Government, decides the claim instead of the DWP, and someone who moves to Scotland must make a new claim for Adult Disability Payment, because PIP stops 13 weeks after the move. In Northern Ireland, PIP is run by the Department for Communities at the same rates.</p>
`,
});
