import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { dwpStopsAfterMove } from '../../lib/engine/disability-extra';
import { pipWeekly } from '../../lib/engine/disability';
import { formatMoney, formatPercent, displayDate } from '../../lib/format';

const pip = P.pip;
const S = P.scotland;
const g = (n: number, d = 2) => formatMoney(n, d);
const max = pipWeekly('enhanced', 'enhanced');
// Worked example: a man on enhanced daily living and standard mobility PIP moves from Carlisle to Dumfries on 2 November 2026.
const move = '2026-11-02';
const stop = dwpStopsAfterMove(move);
const award = pipWeekly('enhanced', 'standard');

export default definePage({
  id: 'adult-disability-payment-scotland',
  group: 'disability',
  order: 70,
  mini: 'adpMove',
  miniHref: 'pip-points-calculator',
  related: ['pip-rates', 'pip-points-calculator', 'pip-eligibility', 'carer-support-payment-scotland', 'benefits-in-scotland', 'attendance-allowance'],
  sources: ['scotAdp', 'scotAdpWho', 'scotAdpPayments', 'scotUprating', 'scotMove', 'scotCdpToAdp', 'govPip'],
  slug: 'adult-disability-payment-scotland',
  nav: 'Adult Disability Payment (Scotland)',
  card: 'Scotland’s replacement for PIP: same rates and points, a different agency, and the 13-week rule when you move.',
  title: 'Adult Disability Payment 2026/27: Scotland’s PIP Explained',
  description: `Adult Disability Payment 2026/27: ${g(pip.dailyStandard)} or ${g(pip.dailyEnhanced)} daily living, ${g(pip.mobilityStandard)} or ${g(pip.mobilityEnhanced)} mobility, the same as PIP. Moving to Scotland ends PIP after ${pip.moveStopWeeks} weeks.`,
  h1: 'Adult Disability Payment: Scotland’s version of PIP, and moving across the border',
  intro: 'The rates and points match PIP; the agency, the process and the rules for people who move do not.',
  resume: `Adult Disability Payment is the disability benefit for people aged ${pip.minAge} to State Pension age who live in Scotland, paid by Social Security Scotland instead of PIP from the DWP. The money is identical: ${g(pip.dailyStandard)} or ${g(pip.dailyEnhanced)} a week for the daily living part and ${g(pip.mobilityStandard)} or ${g(pip.mobilityEnhanced)} for mobility in 2026/27, up to ${g(max)} in all. The decision uses the same twelve activities and point scores as PIP, and income, savings and work do not count. Differences lie in the process: you can apply online, by phone or on paper, the award runs from the day you submit part one of the application, and payment comes every four weeks after the first four weeks have passed. The border matters most. Someone on PIP who moves to Scotland keeps it for only ${pip.moveStopWeeks} weeks and must make a new claim for Adult Disability Payment; someone leaving Scotland must claim PIP straight away.`,
  faqs: [
    { q: 'Is Adult Disability Payment worth more than PIP?', a: `No. The Scottish Government up-rated it by the same ${formatPercent(P.upratingCPI, 1)} as the DWP in April 2026 and the weekly amounts match PIP exactly: ${g(pip.dailyStandard)} and ${g(pip.dailyEnhanced)} for daily living, ${g(pip.mobilityStandard)} and ${g(pip.mobilityEnhanced)} for mobility. The two can still lead to different outcomes for the same person, because different decision makers weigh the evidence, but the rates and point thresholds are the same.` },
    { q: 'I get Adult Disability Payment and I am moving from Glasgow to Leeds: what do I do?', a: `Tell Social Security Scotland about the move and make a new claim for PIP as soon as you arrive in England. GOV.UK says Social Security Scotland will tell you when your Adult Disability Payment stops, and that a late PIP claim can affect your payments. Have your ADP decision letter to hand: it lists the points awarded for each activity.` },
    { q: 'When does the first Adult Disability Payment reach my bank account?', a: `After the first four weeks of entitlement. Mygov.scot says you are entitled from the earliest possible date, the day you submitted or completed part one of the application, not the day of the decision, and payments then come every four weeks. Someone who is terminally ill is paid weekly in advance and should get a decision in around ${S.adpTerminalDecisionDays} working days.` },
    { q: 'Can my 15-year-old apply for Adult Disability Payment while still getting Child Disability Payment?', a: `Yes, from ${S.adpApplyWeeksBefore16} weeks before the 16th birthday. A young person can choose when to apply at any time up to the 18th birthday and keeps Child Disability Payment meanwhile. If the application goes in before 18, payments do not break; without one, Child Disability Payment usually stops at ${S.cdpUntilAge}.` },
    { q: 'What happens to Adult Disability Payment when I reach State Pension age?', a: `You stay on it. Mygov.scot says people already getting Adult Disability Payment are not moved to Pension Age Disability Payment at State Pension age, so the mobility part continues. New claims after that age are for Pension Age Disability Payment, which, like Attendance Allowance, has two care rates and no mobility part.` },
  ],
  body: (h) => `
<h2>Rates in 2026/27</h2>
${h.table(['Part', 'Standard', 'Enhanced'], [
  ['Daily living, a week', h.gbp(pip.dailyStandard, 2), h.gbp(pip.dailyEnhanced, 2)],
  ['Mobility, a week', h.gbp(pip.mobilityStandard, 2), h.gbp(pip.mobilityEnhanced, 2)],
  ['Daily living, every 4 weeks', h.gbp(pip.dailyStandard * 4, 2), h.gbp(pip.dailyEnhanced * 4, 2)],
  ['Mobility, every 4 weeks', h.gbp(pip.mobilityStandard * 4, 2), h.gbp(pip.mobilityEnhanced * 4, 2)],
], 'Adult Disability Payment from April 2026 (Scottish Government up-rating report, table 5)', ['l', 'r', 'r'])}
<p>The ${h.src('scotUprating', 'Scottish Government’s up-rating report')} raised each rate by ${h.pct(P.upratingCPI, 1)}, from ${h.gbp(S.adpPrev.dailyStandard, 2)}, ${h.gbp(S.adpPrev.dailyEnhanced, 2)}, ${h.gbp(S.adpPrev.mobilityStandard, 2)} and ${h.gbp(S.adpPrev.mobilityEnhanced, 2)}. It also lists a transitional rate of ${h.gbp(S.adpTransitional, 2)}: adults moved across from the lowest care rate of DLA, which has no equivalent in Adult Disability Payment, are paid it until their case is reviewed against the ADP rules.</p>

<h2>Same test, different agency</h2>
<p>The daily living part looks at ten activities, from preparing food and taking nutrition to engaging with people face to face and making budgeting decisions; the mobility part at planning and following journeys and moving around. ${h.src('scotAdp', 'Mygov.scot')} lists them in the same words as the PIP regulations, and the decision letter gives the points for each of the twelve activities with the reasons. The ${h.a('pip-points-calculator', 'PIP points calculator')} therefore works for Adult Disability Payment too: ${h.num(pip.thresholdStandard)} points in a part for the standard rate, ${h.num(pip.thresholdEnhanced)} for the enhanced.</p>
<p>What changes is the experience of claiming. Social Security Scotland is an agency of the Scottish Government, not of the DWP. You can apply online, by phone or on paper, and ${h.src('scotAdpWho', 'it says')} you can apply while still waiting for a diagnosis. Where it needs more information it may invite you to a consultation, and its decision makers can draw on in-house medical practitioners and specialist advisers in health and social care. People living in the EU, Switzerland, Norway, Iceland, Liechtenstein or Gibraltar who have spent a major part of their lives in Scotland can apply from abroad.</p>
<p>If an existing award is reduced or stopped and you challenge the decision, Social Security Scotland can pay short-term assistance while the re-determination or appeal is under way, so that you are not discouraged from challenging by a drop in income.</p>

<h2>Payment</h2>
<p>${h.src('scotAdpPayments', 'Entitlement starts')} from the date you submitted part one online or completed it by phone. The first payment arrives after the first four weeks have passed, and later payments come every four weeks into a bank account. People who are terminally ill are paid weekly in advance and automatically get the enhanced daily living rate.</p>

<h2>Moving from England or Wales to Scotland</h2>
<p>This is the situation that costs people money. ${h.src('scotMove', 'Mygov.scot warns')} that entitlement to DWP disability and carer benefits stops ${h.num(pip.moveStopWeeks)} weeks after the date you move, and ${h.src('govPip', 'GOV.UK')} says the same of PIP. The DWP keeps paying for those weeks, then stops, whatever stage your new claim has reached.</p>
<p>Take a man on the enhanced daily living rate and standard mobility, ${h.gbp(award, 2)} a week, who moves from Carlisle to Dumfries on ${h.date(move)}. His PIP entitlement ends on ${displayDate(stop, 'en-GB')}. Social Security Scotland can take several weeks to process an application, so applying in his first week in Scotland gives him the best chance of no gap; waiting for the DWP’s letter confirming the end date risks weeks with nothing. A successful award can be backdated to the day after PIP ends, but only once Social Security Scotland has his application. The order of steps is simple:</p>
<ol>
<li>Tell the DWP your new address as soon as you move. Check they will pay you for the ${h.num(pip.moveStopWeeks)} weeks and have the right bank details.</li>
<li>Apply to Social Security Scotland straight away (0800 182 2222 or online), without waiting for the DWP letter.</li>
<li>Tell anyone who gets Carer’s Allowance for you: a gap in your disability benefit can stop theirs, and they too must move to Carer Support Payment.</li>
</ol>
<p>The same ${h.num(pip.moveStopWeeks)}-week rule applies to someone moving from Northern Ireland, where the Department for Communities pays PIP.</p>

<h2>Moving from Scotland to England or Wales</h2>
<p>In the other direction, tell Social Security Scotland and claim PIP as soon as you arrive. Social Security Scotland tells you when Adult Disability Payment will stop; GOV.UK warns that delaying the PIP claim can affect your payments. Your ADP decision letter, with points for every activity, is useful evidence for the DWP.</p>

<h2>Young people and pensioners</h2>
<p>Children in Scotland get Child Disability Payment. ${h.src('scotCdpToAdp', 'The move to Adult Disability Payment is not automatic')}: a young person can apply from ${h.num(S.adpApplyWeeksBefore16)} weeks before turning 16 and up to their 18th birthday, keeping Child Disability Payment until the decision. At the other end, someone already on Adult Disability Payment keeps it after State Pension age, while new claims after that age are for Pension Age Disability Payment, Scotland’s version of ${h.a('attendance-allowance', 'Attendance Allowance')}.</p>

<h2>What it opens for a carer</h2>
<p>The daily living part at either rate is a qualifying benefit for a carer. In Scotland the carer claims ${h.a('carer-support-payment-scotland', 'Carer Support Payment')} of ${h.gbp(S.carerSupport, 2)} a week plus the Scottish Carer Supplement; a carer living in England or Wales who looks after someone on Adult Disability Payment claims Carer’s Allowance instead. Like PIP, Adult Disability Payment in the household also exempts it from the benefit cap.</p>
`,
});
