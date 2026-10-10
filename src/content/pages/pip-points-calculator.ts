import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { scorePip } from '../../lib/engine/disability';
import { formatMoney } from '../../lib/format';

const pip = P.pip;
const g = (n: number, d = 2) => formatMoney(n, d);
// Worked example: index of the descriptor chosen in each of the 12 activities (Schedule 1 order).
// Preparing food e (4), washing d (2), dressing d (2), budgeting b (2); moving around c (8).
const ex = scorePip([4, 0, 0, 3, 0, 3, 0, 0, 0, 1, 0, 2]);
// Same person, but the 20-50 metres are only managed with a stick: descriptor d (10).
const ex2 = scorePip([4, 0, 0, 3, 0, 3, 0, 0, 0, 1, 0, 3]);

export default definePage({
  id: 'pip-points-calculator',
  group: 'disability',
  order: 10,
  tool: 'pip',
  related: ['pip-rates', 'pip-eligibility', 'pip-payment-dates', 'adult-disability-payment-scotland', 'universal-credit-and-pip'],
  sources: ['pipSch1', 'pipRegs5', 'pipRegs4', 'pipRegs7', 'govPip'],
  slug: 'pip-points-calculator',
  nav: 'PIP points calculator',
  card: 'Pick a descriptor in each of the 12 activities and see the rate your points give.',
  title: 'PIP Points Calculator 2026/27: Score All 12 Activities',
  description: `PIP points calculator 2026/27: choose a descriptor for each of the 12 activities. 8 points gives the standard rate, 12 the enhanced, up to ${g(pip.dailyEnhanced + pip.mobilityEnhanced)} a week.`,
  h1: 'PIP points calculator: score each activity the way the assessor does',
  intro: 'One descriptor per activity, the points added up per part, and the weekly rate those points give.',
  resume: `PIP is decided on points, not on a diagnosis. The assessment looks at ten daily living activities, such as preparing food, washing and managing money, and two mobility activities, planning a journey and physically moving around. In each activity you score the points of the one descriptor that fits you, from 0 up to 12. The scores are added separately for each part: ${pip.thresholdStandard} points or more gives the standard rate and ${pip.thresholdEnhanced} or more the enhanced rate. In 2026/27 that means ${g(pip.dailyStandard)} or ${g(pip.dailyEnhanced)} a week for daily living and ${g(pip.mobilityStandard)} or ${g(pip.mobilityEnhanced)} for mobility. A descriptor only counts if it applies on more than half of the days and if you can do the task reliably: safely, to a decent standard, as often as needed and within twice the normal time. The calculator lists every descriptor from Schedule 1 of the regulations with its points.`,
  faqs: [
    { q: 'Can points from mobility activities be added to my daily living score?', a: `No. The two parts are scored and decided separately. Points from planning journeys and moving around count only towards mobility, and the ten other activities only towards daily living. Someone with 6 daily living points and 10 mobility points gets the standard mobility rate of ${g(pip.mobilityStandard)} and nothing for daily living, even though the total is 16.` },
    { q: 'Do I add up the points of every descriptor that applies in one activity?', a: `No. In each activity only one descriptor counts: the highest-scoring one that applies on more than half of the days. If you need an aid to wash (2 points) and also help getting into the bath (3 points), you score 3 for washing and bathing, not 5. If two descriptors each cover part of your days, regulation 7 takes the one that applies most often.` },
    { q: 'What if my condition varies and some days I can manage alone?', a: `PIP looks at a ${pip.qualifyMonthsPast + pip.qualifyMonthsFuture}-month period. A descriptor applies if you would meet it on more than half of the days. Keep a diary for a few weeks before you fill in the form, noting bad days and what you could not do. Someone who needs help to dress on four days out of seven meets that descriptor; on two days out of seven, they do not.` },
    { q: 'Is the score from this calculator what the DWP will give me?', a: `Only if the assessor and the decision maker read your evidence the same way. The calculator applies the official points and thresholds exactly, but choosing a descriptor is a judgement on evidence: letters from your GP or consultant, care plans and a detailed form. Use the result to check that your form explains the descriptors you believe apply.` },
  ],
  body: (h) => `
<h2>How a score is built</h2>
<p>For each activity, pick the sentence that describes what you can do on most days with any aid you normally use. Activity 11 covers the mental side of getting out, such as anxiety or following a route; activity 12 the physical side. Remember the reliability rule in ${h.src('pipRegs4', 'regulation 4')}: if walking 50 metres leaves you in pain for the rest of the day, you cannot do it repeatedly and that descriptor does not apply.</p>

<h2>A worked example</h2>
<p>Take a 48-year-old with arthritis in both knees and hands. She cannot cook a meal without someone helping her lift pans (4 points), needs help to wash below the waist (2), help to dress her lower body (2) and help with complex budgeting decisions because of medication fog (2). That is ${ex.daily} daily living points: the standard rate. She can walk about 40 metres unaided before stopping, which scores ${ex.mobility} in moving around: standard mobility as well. Her award would be ${h.gbp(ex.weekly, 2)} a week, or ${h.gbp(ex.fourWeekly, 2)} every four weeks.</p>
<p>If she needs a stick for those 40 metres, descriptor 12d scores ${ex2.mobility} instead of ${ex.mobility}: still the standard rate, still ${h.gbp(ex2.weekly, 2)} a week. A single extra 4-point descriptor on daily living, though, would take her to ${h.num(ex.daily + 4)} and the enhanced rate of ${h.gbp(pip.dailyEnhanced, 2)}.</p>
${h.table(['Part', 'Points', 'Rate', 'A week'], [
  ['Daily living', ex.daily, ex.dailyRate, h.gbp(ex.dailyWeekly, 2)],
  ['Mobility', ex.mobility, ex.mobilityRate, h.gbp(ex.mobilityWeekly, 2)],
], 'Worked example scored with Schedule 1 descriptors and the 2026/27 rates', ['l', 'r', 'l', 'r'])}

<h2>What the tool cannot judge</h2>
<p>It cannot tell whether your evidence will persuade a decision maker, whether a descriptor applies on more than half of days (that is ${h.src('pipRegs7', 'regulation 7')}), or whether your difficulties meet the time test of ${h.num(pip.qualifyMonthsPast)} months before the claim and ${h.num(pip.qualifyMonthsFuture)} months after. It does not cover the special rules for end of life, under which the enhanced daily living rate is paid without points. Results from a reassessment can go down as well as up. To see what each combination of rates is worth over a year, use ${h.a('pip-rates', 'the PIP rates table')}; to check the age, residence and time conditions, read ${h.a('pip-eligibility', 'PIP eligibility')}. In Scotland the same activities and points decide ${h.a('adult-disability-payment-scotland', 'Adult Disability Payment')}.</p>
`,
});
