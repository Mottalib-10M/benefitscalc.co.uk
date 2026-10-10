import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { applyCap } from '../../lib/engine/cap';
import { computeUc } from '../../lib/engine/uc';
import { childBenefitWeekly } from '../../lib/engine/family';
import { weeklyToMonthly } from '../../lib/engine/params';
import { formatMoney, formatPercent } from '../../lib/format';

const C = P.benefitCap;
const g = (n: number, d = 2) => formatMoney(n, d);
// Worked example: lone parent aged 29, four children, not working, housing association rent £1,100 a month, outside London.
const uc = computeUc({ couple: false, age: 29, children: 4, earnings: 0, housing: 'social', rent: 1100 });
const cb = weeklyToMonthly(childBenefitWeekly(4));
const ex = applyCap({ familyOrCouple: true, london: false, monthlyBenefits: uc.maximum + cb, earnings: 0, exempt: false });

export default definePage({
  id: 'benefit-cap-calculator',
  group: 'housing',
  order: 20,
  tool: 'cap',
  related: ['benefit-rates', 'universal-credit-calculator', 'local-housing-allowance-rates', 'universal-credit-two-child-limit', 'housing-benefit', 'benefits-in-northern-ireland'],
  sources: ['govBenefitCap', 'dwpRates', 'nidCap', 'scotHousingCosts'],
  slug: 'benefit-cap-calculator',
  nav: 'Benefit cap calculator',
  card: 'How much of your Universal Credit or Housing Benefit the cap removes, and the ways out of it.',
  title: 'Benefit Cap Calculator 2026/27: London and Rest of GB',
  description: `Benefit cap calculator 2026/27: ${g(C.monthly.restFamily, 0)} a month for families outside London, ${g(C.monthly.londonFamily)} inside, exemptions, the ${g(C.earningsExemptMonthly, 0)} earnings test and the ${C.gracePeriodMonths}-month grace period.`,
  h1: 'Benefit cap calculator: what the limit takes from your household',
  intro: 'Enter the benefits that count and your take-home pay; the calculator shows the cap for your household and any amount lost.',
  resume: `The benefit cap limits the total a working-age household can receive from most benefits. In 2026/27 it is ${g(C.annual.restFamily, 0)} a year outside Greater London for a couple or a lone parent whose children live with them, which is ${g(C.monthly.restFamily)} a month or ${g(C.weekly.restFamily)} a week, and ${g(C.annual.restSingle, 0)} for a single adult (${g(C.monthly.restSingle)} a month). In Greater London the levels are ${g(C.annual.londonFamily, 0)} and ${g(C.annual.londonSingle, 0)}. The levels are the same as in 2025/26, while the benefits inside them rose by ${formatPercent(P.upratingCPI, 1)}. Universal Credit, Child Benefit, Housing Benefit, New Style JSA and ESA and Maternity Allowance all count. The cap does not apply if household take-home pay reaches ${g(C.earningsExemptMonthly, 0)} a month (up from ${g(C.earningsExemptMonthlyPrev, 0)} on 1 April 2026), if anyone gets PIP, DLA, Attendance Allowance, Carer’s Allowance or the Universal Credit LCWRA or carer element, or for ${C.gracePeriodMonths} months after a job ends for someone who earned at least the threshold in each of the previous ${C.graceQualifyingMonths} months.`,
  faqs: [
    { q: 'Does Child Benefit count towards the benefit cap even though it is paid by HMRC?', a: `Yes. GOV.UK lists Child Benefit among the benefits added up, so a large family can reach the cap with Universal Credit alone plus Child Benefit. The cap is then taken from Universal Credit or Housing Benefit, never from Child Benefit itself. Since the two-child limit ended in April 2026, extra child elements count too, which is why some families saw no increase.` },
    { q: `How does the ${C.gracePeriodMonths}-month grace period work if I find work and lose it again?`, a: `The grace period starts on the day after you last worked, or from the assessment period in which earnings fell below ${g(C.earningsExemptMonthly, 0)}. It keeps running if you stop claiming and claim again. GOV.UK gives the example of a grace period starting on 1 February, a job from 1 May, a new claim on 1 August and the grace period still ending on 31 October.` },
    { q: 'Which payments are left out when the cap is worked out?', a: `Disability and carer benefits do not count and also exempt the whole household. Only benefits on the official list are added, so Scottish Child Payment is not, and nidirect confirms that one-off payments such as Cold Weather Payments, Winter Fuel Payments and bereavement payments are left out. Pension Credit and the State Pension are outside the cap because it only applies below State Pension age; a mixed-age couple can still be capped.` },
    { q: 'Is there help with rent if the cap leaves a shortfall?', a: `In England, ask your council about its Crisis and Resilience Fund; in Scotland and Wales, apply for a Discretionary Housing Payment. The Scottish Government funds councils to mitigate the cap through these payments. In Northern Ireland a Welfare Supplementary Payment can cover the loss for capped households with children, paid every four weeks.` },
  ],
  body: (h) => `
<h2>A capped household, worked through</h2>
<p>A lone parent aged 29 with four children, not working, rents a housing association home for ${h.gbp(1100)} a month outside London. Universal Credit before the cap is ${h.gbp(uc.maximum, 2)}: the standard allowance, four child elements of ${h.gbp(P.uc.child, 2)} and the rent. Child Benefit adds about ${h.gbp(cb, 2)} a month. The total, ${h.gbp(uc.maximum + cb, 2)}, is above the family cap of ${h.gbp(C.monthly.restFamily, 2)}, so Universal Credit is reduced by ${h.gbp(ex.loss, 2)} a month. Earning ${h.gbp(C.earningsExemptMonthly)} a month after tax would remove the cap entirely, and so would a DLA award for one of the children.</p>

<h2>What to enter</h2>
<p>Under “benefits that count”, add the monthly Universal Credit shown on your statement before any cap line, including the housing element, plus Child Benefit (weekly × 52 ÷ 12) and any New Style JSA or ESA, Maternity Allowance or Housing Benefit. For take-home pay, enter what both partners earned in the assessment period after tax, National Insurance and pension contributions. If you are in a grace period, enter the months left; the calculator then shows no loss until it ends.</p>
${h.table(['Household', 'Outside London a month', 'Greater London a month', 'Outside London a week'], [
  ['Couple, or lone parent with children', h.gbp(C.monthly.restFamily, 2), h.gbp(C.monthly.londonFamily, 2), h.gbp(C.weekly.restFamily, 2)],
  ['Single adult, no children living with them', h.gbp(C.monthly.restSingle, 2), h.gbp(C.monthly.londonSingle, 2), h.gbp(C.weekly.restSingle, 2)],
], 'Benefit cap 2026/27 (DWP benefit and pension rates; GOV.UK)', ['l', 'r', 'r', 'r'])}
<p>A couple who do not live together are each treated as single. ${h.src('govBenefitCap', 'GOV.UK')} lists the exempt benefits in full, including the support component of ESA, Guardian’s Allowance, war pensions and the Scottish disability payments. Northern Ireland applies the same weekly amounts through Housing Benefit or Universal Credit, as ${h.src('nidCap', 'nidirect')} explains. For a complete Universal Credit figure before the cap, use ${h.a('universal-credit-calculator', 'the Universal Credit calculator')}.</p>
`,
});
