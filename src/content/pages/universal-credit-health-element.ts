import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { computeUc } from '../../lib/engine/uc';
import { formatMoney, displayDate } from '../../lib/format';

const U = P.uc;
const g = (n: number, d = 2) => formatMoney(n, d);
const d = (iso: string) => displayDate(iso, 'en-GB');
const reform = d(U.lcwraReformDate);
// Example: single, 45, housing association rent £600, no earnings; and the same person earning £500.
const ex = { couple: false, age: 45, children: 0, housing: 'social' as const, rent: 600 };
const hi = computeUc({ ...ex, earnings: 0, health: 'lcwra' });
const lo = computeUc({ ...ex, earnings: 0, health: 'lcwraNew' });
const loWork = computeUc({ ...ex, earnings: 500, health: 'lcwraNew' });

export default definePage({
  id: 'universal-credit-health-element',
  group: 'uc',
  order: 50,
  mini: 'healthElement',
  related: ['universal-credit-rates', 'universal-credit-and-pip', 'universal-credit-carer-element', 'new-style-esa', 'pip-eligibility', 'universal-credit-calculator'],
  sources: ['govUcHealthAmount', 'govUcHealth', 'dwpRates', 'ucRegs41', 'ucRegsSch9', 'govUc'],
  slug: 'universal-credit-health-element',
  nav: 'Health element (LCWRA)',
  card: 'The LCWRA amount now has two rates: who keeps the higher one and who gets the lower.',
  title: 'Universal Credit Health Element 2026/27: Two LCWRA Rates',
  description: `Universal Credit health element 2026/27: LCWRA pays ${g(U.lcwra)} or, for most new claims since ${reform}, ${g(U.lcwraNew2026)} a month. Severe conditions and the WCA.`,
  h1: 'The Universal Credit health element and its two rates',
  intro: 'When you first told the DWP about your condition now decides how much the health element pays.',
  resume: `The Universal Credit health element, officially the LCWRA amount, is paid on top of the standard allowance when a Work Capability Assessment finds you have limited capability for work and work-related activity. Since ${reform} it has two rates. The higher rate of ${g(U.lcwra)} a month is kept by everyone who reported their health condition before ${reform}, whatever the date of the decision, by people who already had LCWRA or the ESA support group, and it is paid to anyone with a severe lifelong condition or nearing the end of life, whenever they claim. Most people who report a condition from ${reform} onwards receive the lower rate of ${g(U.lcwraNew2026)}, about half. A couple gets one health element, at the higher rate if either partner qualifies for it. The element also opens the work allowance, exempts the household from the benefit cap and removes work search, and you may still work. People whose claim began before ${d(U.lcwPre2017Date)} may instead keep the old LCW amount of ${g(U.lcw)}.`,
  faqs: [
    { q: 'I reported my condition in March 2026 but my WCA was after April: which LCWRA rate do I get?', a: `The higher rate of ${g(U.lcwra)}. GOV.UK says the higher amount applies if you told the DWP about your health condition or disability before ${reform}, “regardless of the date of the LCWRA decision”. What counts is the date of the report, usually when you declared the condition in your claim or reported it as a change, not the date of the assessment or of the letter.` },
    { q: 'What makes a condition severe and lifelong for the higher LCWRA rate?', a: `A health professional reviews your medical evidence during the Work Capability Assessment. You are treated as meeting the severe conditions criteria when the condition means you cannot work, will last your whole life, will not get better and has been officially diagnosed. If so, the decision letter says so, you receive ${g(U.lcwra)} even on a claim made after ${reform}, and you will not usually be reassessed.` },
    { q: 'How do I get the Universal Credit health element if I am terminally ill?', a: `Ask a doctor, nurse or other medical professional for form SR1, which says you may have ${U.endOfLifeMonths} months or less to live. Then say so in your Universal Credit claim or report it as a change. You get the higher rate of ${g(U.lcwra)} without a Work Capability Assessment and without a claimant commitment. If you already sent an SR1 for PIP, you do not need another.` },
    { q: `Can I lose the health element by earning over ${g(U.wcaEarningsThreshold, 0)} a month?`, a: `Earning ${g(U.wcaEarningsThreshold, 0)} a month or more does not take away an LCWRA decision you already have. It matters before the decision: regulation 41 says the DWP will not normally carry out a Work Capability Assessment while monthly earnings are at or above that threshold, which equals ${U.wcaThresholdHours} hours a week at the National Living Wage, unless you get PIP, DLA, Attendance Allowance or a Scottish disability payment.` },
    { q: `Is the old limited capability for work amount of ${g(U.lcw)} still paid?`, a: `Only to people whose health-related Universal Credit or ESA claim started before ${d(U.lcwPre2017Date)} and who were found to have limited capability for work. They receive ${g(U.lcw)} a month, a figure that did not rise in April 2026. For everyone else, a finding of limited capability for work brings no extra money, but it does give a work allowance and lighter work-related requirements.` },
  ],
  body: (h) => `
<h2>Higher rate or lower rate: the test</h2>
<p>${h.src('govUcHealthAmount', 'GOV.UK’s guidance on the change')}, published on ${h.date(U.lcwraReformDate)}, sets out the rule that follows the Universal Credit Act 2025. Read it as a sequence of questions: the first “yes” decides the higher rate.</p>
${h.table(['Your situation', 'Monthly health element'], [
  [`You told the DWP about the condition before ${h.date(U.lcwraReformDate)}`, h.gbp(U.lcwra, 2)],
  [`You already received LCWRA before ${h.date(U.lcwraReformDate)}`, h.gbp(U.lcwra, 2)],
  [`You had the ESA support group before ${h.date(U.lcwraReformDate)} and kept it until claiming Universal Credit`, h.gbp(U.lcwra, 2)],
  ['You meet the severe conditions criteria (claim at any date)', h.gbp(U.lcwra, 2)],
  ['You are nearing the end of life (claim at any date)', h.gbp(U.lcwra, 2)],
  ['Your partner is entitled to the higher amount', h.gbp(U.lcwra, 2) + ' (one amount per couple)'],
  [`None of the above, condition reported on or after ${h.date(U.lcwraReformDate)}`, h.gbp(U.lcwraNew2026, 2)],
], 'LCWRA amounts from 6 April 2026 (DWP rates 2026 to 2027; GOV.UK guidance)', ['l', 'r'])}
<p>Over a year the gap between the two is ${h.gbp((U.lcwra - U.lcwraNew2026) * 12)}. Take a single man of 45 renting a housing association flat for ${h.gbp(600)}, out of work. On the higher rate his award is ${h.gbp(hi.award, 2)} a month; on the lower rate, ${h.gbp(lo.award, 2)}. If he manages a few hours of work bringing in ${h.gbp(500)}, the lower work allowance of ${h.gbp(loWork.workAllowance)} applies and his award on the lower rate becomes ${h.gbp(loWork.award, 2)}.</p>

<h2>Getting to a decision: fit notes and the assessment</h2>
<p>Report the condition in your claim or as a change of circumstances. If it stops you working for more than ${U.fitNoteDays} days you need a fit note, which a GP, hospital doctor, registered nurse, occupational therapist, pharmacist or physiotherapist can issue. If it lasts longer than ${U.wcaDays} days you may be sent the ${h.src('govUcHealth', 'Capability for Work questionnaire')} (WCA50) and then called to a Work Capability Assessment, in person, by video or by phone. Keep sending fit notes until the decision arrives, or the DWP may expect you to look for work.</p>
<p>While you wait, a new claim is paid the standard allowance only, plus any other elements such as children or rent. Someone already on Universal Credit who reports a new condition keeps the same amount. The assessment ends in one of four outcomes: fit for work; limited capability for work, where you prepare for work but get no extra money unless you are in the pre-2017 group; LCWRA; or LCWRA with a severe lifelong condition.</p>

<h2>People treated as having LCWRA without the usual points</h2>
<p>${h.src('ucRegsSch9', 'Schedule 9 of the Universal Credit Regulations')} lists situations in which a claimant is treated as having limited capability for work and work-related activity. They include terminal illness, receiving or recovering from chemotherapy or radiotherapy for cancer, or being likely to receive it within ${U.cancerTreatmentMonths} months, a pregnancy where working would seriously risk the health of the mother or baby, and a condition where finding you capable would create a substantial risk to anyone’s health. Ask your GP or consultant to say clearly in the evidence which of these applies.</p>

<h2>What the health element does besides the money</h2>
<ul>
<li>It opens the work allowance: ${h.gbp(U.workAllowanceHigher)} a month of take-home pay ignored, or ${h.gbp(U.workAllowanceLower)} if rent is in the award. See ${h.a('universal-credit-work-allowance', 'how wages reduce Universal Credit')}.</li>
<li>It exempts the household from the benefit cap.</li>
<li>It removes all work search and work preparation requirements, so there are no sanctions for missing job-search activity, yet you may still work if you feel able.</li>
<li>It cannot be paid together with the carer element of ${h.gbp(U.carer, 2)} for the same person; the health element is paid instead. ${h.a('universal-credit-carer-element', 'The carer element page')} explains how couples arrange this.</li>
</ul>

<h2>PIP is a different test</h2>
<p>PIP looks at daily living and mobility, not at capability for work, and an award of PIP does not give the health element automatically. The two assessments can reach different conclusions about the same person. PIP does matter in one place: someone receiving it can be assessed even when earning above ${h.gbp(U.wcaEarningsThreshold)} a month. ${h.a('universal-credit-and-pip', 'PIP and Universal Credit')} covers how the two benefits interact.</p>

<h2>If you disagree with the decision</h2>
<p>Ask for a mandatory reconsideration through your journal, normally within one month of the decision, adding any medical evidence the assessor did not see. If the decision stands, you can appeal to an independent tribunal. If you reported the condition before ${h.date(U.lcwraReformDate)} and win LCWRA on reconsideration or appeal, the higher rate should follow, because GOV.UK ties the rate to the date you told the DWP, not to the date of the decision.</p>
`,
});
