import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { computeUc, breakEvenEarnings } from '../../lib/engine/uc';
import { formatMoney, formatPercent } from '../../lib/format';

const U = P.uc;
const g = (n: number, d = 2) => formatMoney(n, d);
const taper = formatPercent(U.taper, 0);
// Payslip examples used in the text.
const lone = { couple: false, age: 29, children: 1, housing: 'social' as const, rent: 520 };
const a0 = computeUc({ ...lone, earnings: 0 });
const a1 = computeUc({ ...lone, earnings: 1000 });
const solo0 = computeUc({ couple: false, age: 40, children: 0, earnings: 0 });
const solo = computeUc({ couple: false, age: 40, children: 0, earnings: 600 });
const cpl = { couple: true, age: 38, partnerAge: 36, children: 2 };
const cplOne = computeUc({ ...cpl, earnings: 1400 });
const cplTwo = computeUc({ ...cpl, earnings: 2800 });
const beLone = breakEvenEarnings(a0.maximum, a0.workAllowance);

export default definePage({
  id: 'universal-credit-work-allowance',
  group: 'uc',
  order: 40,
  mini: 'workAllowance',
  related: ['universal-credit-calculator', 'universal-credit-rates', 'universal-credit-payment-dates', 'universal-credit-childcare-costs', 'universal-credit-health-element'],
  sources: ['govUcWages', 'ucRegs22', 'ucRegs55', 'dwpRates', 'govUcPaid'],
  slug: 'universal-credit-work-allowance',
  nav: 'Work allowance and taper',
  card: `How wages reduce Universal Credit: the ${g(U.workAllowanceLower, 0)} or ${g(U.workAllowanceHigher, 0)} work allowance, then ${taper} of each pound above it.`,
  title: 'Universal Credit Work Allowance 2026/27: How Wages Count',
  description: `Universal Credit work allowance 2026/27: ${g(U.workAllowanceLower, 0)} or ${g(U.workAllowanceHigher, 0)} a month of pay ignored, then ${taper} of the rest taken off. Who qualifies, with three worked payslips.`,
  h1: 'How your wages reduce Universal Credit',
  intro: `Two numbers decide it: the work allowance, if you have one, and the ${Math.round(U.taper * 100)}p taken from every pound above it.`,
  resume: `Universal Credit falls by ${Math.round(U.taper * 100)}p for every ${g(1, 0)} of take-home pay above your work allowance, so working more always leaves you better off. The work allowance is the amount you can earn each month before any reduction starts, and only some households get one: those responsible for a child, and those where a claimant has limited capability for work. In 2026/27 it is ${g(U.workAllowanceLower, 0)} a month if your award includes help with rent, or if the council has placed you in temporary accommodation, and ${g(U.workAllowanceHigher, 0)} if it does not. A single person or couple without children or a health condition has no work allowance, and the ${taper} taper applies from the first pound. Pay is counted after income tax, National Insurance and pension contributions, in the monthly assessment period when your employer reports it, which is why two paydays in one period can shrink a single payment. There is no limit on the hours you can work while claiming.`,
  faqs: [
    { q: 'Do couples get a work allowance each in Universal Credit?', a: `No. A couple gets one work allowance for the household, ${g(U.workAllowanceLower, 0)} or ${g(U.workAllowanceHigher, 0)} a month, and their combined take-home pay is set against it. It does not matter which partner earns it. If only one partner has a health condition that limits work and there are no children, the couple still qualifies for the allowance, and the second earner’s pay is tapered at ${taper} along with the first.` },
    { q: 'Why does help with rent lower my Universal Credit work allowance?', a: `Regulation 22 of the Universal Credit Regulations sets two figures: the higher one of ${g(U.workAllowanceHigher, 0)} for awards with no housing costs element and the lower one of ${g(U.workAllowanceLower, 0)} when rent is included. The difference of ${g(U.workAllowanceHigher - U.workAllowanceLower, 0)} costs a renting household up to ${g((U.workAllowanceHigher - U.workAllowanceLower) * U.taper)} a month once wages pass the lower figure, but the rent element itself is usually worth far more.` },
    { q: 'Is pension contribution taken off before Universal Credit counts my wages?', a: `Yes. Universal Credit counts take-home pay: gross earnings minus income tax, National Insurance and contributions to a registered pension scheme. So paying ${g(100, 0)} a month more into a workplace pension lowers the earnings figure by ${g(100, 0)} and raises Universal Credit by up to ${g(100 * U.taper, 0)}, if your pay is above the work allowance. Regulation 55 of the Universal Credit Regulations is the rule behind it.` },
    { q: 'What happens to Universal Credit when I earn too much for it?', a: `Payments stop and you are told. GOV.UK says that if your pay then falls within ${U.reclaimMonths} months of your last payment, Universal Credit restarts automatically without a new claim; after that you have to reapply. A one-off high month, such as a bonus or holiday pay landing in one assessment period, can therefore stop a single payment without ending your claim.` },
    { q: 'Does a second job or overtime count towards Universal Credit earnings?', a: `Yes, all employed earnings count, from every job, including overtime and bonuses. Regulation 55 also treats statutory sick pay, maternity, paternity, adoption and shared parental pay as earnings, so they are tapered rather than deducted in full. They are added together for the assessment period in which each employer reports them, and the work allowance and ${taper} taper are applied to the total. Self-employed income follows separate rules, including a minimum income floor, not covered here.` },
  ],
  body: (h) => `
<h2>Who gets a work allowance</h2>
<p>${h.src('ucRegs22', 'Regulation 22')} gives a work allowance to a single claimant, or a couple, who is responsible for at least one child or qualifying young person, or where a claimant has limited capability for work. Everyone else has a work allowance of nil.</p>
${h.table(['Your household', 'Work allowance a month', 'Taper'], [
  ['Children or limited capability for work, no housing costs in the award', h.gbp(U.workAllowanceHigher), h.pct(U.taper, 0)],
  ['Children or limited capability for work, housing costs in the award (or council temporary accommodation)', h.gbp(U.workAllowanceLower), h.pct(U.taper, 0)],
  ['No children, no limited capability for work', 'None', h.pct(U.taper, 0) + ' from the first pound'],
], 'Universal Credit work allowances 2026/27 (DWP rates table; GOV.UK how your wages affect your payments)', ['l', 'r', 'r'])}
<p>Last year the figures were ${h.gbp(U.previous.workAllowanceLower)} and ${h.gbp(U.previous.workAllowanceHigher)}. A health condition counts only once the DWP has decided you have limited capability for work, after a Work Capability Assessment; a fit note alone does not open the allowance. ${h.a('universal-credit-health-element', 'The health element page')} covers that assessment.</p>

<h2>Three payslips worked through</h2>
<h3>A lone parent renting from a housing association</h3>
<p>Aisha is 29, has one child and pays ${h.gbp(520)} rent. Her maximum Universal Credit is ${h.gbp(a0.maximum, 2)}. Her work allowance is ${h.gbp(a1.workAllowance)} because rent is in the award. In a month when she takes home ${h.gbp(1000)}, ${h.gbp(1000 - a1.workAllowance)} is above the allowance and ${h.pct(U.taper, 0)} of it, ${h.gbp(a1.earningsDeduction, 2)}, comes off. Universal Credit is ${h.gbp(a1.award, 2)}, and her income for the month is ${h.gbp(1000 + a1.award, 2)} against ${h.gbp(a0.award, 2)} if she did not work. Her award would only run out at take-home pay of about ${h.gbp(beLone)} a month.</p>
<h3>A single man without children</h3>
<p>Dev is 40 and lives with his parents, paying no rent. With no children and no health condition he has no work allowance. Out of work his Universal Credit is the standard allowance, ${h.gbp(solo0.award, 2)}. Taking home ${h.gbp(600)} from a part-time job, he loses ${h.gbp(solo.earningsDeduction, 2)} and receives ${h.gbp(solo.award, 2)}, so his month brings ${h.gbp(600 + solo.award, 2)} in all: ${h.gbp(600 - solo.earningsDeduction, 2)} better off than not working.</p>
<h3>A couple where both start working</h3>
<p>Ben and Chloe, 38 and 36, have two children and own their home outright. With one of them taking home ${h.gbp(1400)}, the higher work allowance of ${h.gbp(cplOne.workAllowance)} applies and their award is ${h.gbp(cplOne.award, 2)}. When the second partner starts work and household take-home pay doubles to ${h.gbp(2800)}, the award falls to ${h.gbp(cplTwo.award, 2)}: the extra ${h.gbp(1400)} in wages costs ${h.gbp(cplOne.award - cplTwo.award, 2)} of Universal Credit, which is ${h.pct(U.taper, 0)}, and leaves them ${h.gbp(1400 - (cplOne.award - cplTwo.award), 2)} better off each month.</p>

<h2>Assessment periods and the timing of pay</h2>
<p>Universal Credit is worked out for monthly assessment periods that start on the day you claimed. Your employer reports each payday to HMRC through payroll, and the DWP counts the pay in the period in which it is reported. ${h.src('govUcWages', 'GOV.UK warns')} that the award changes when you are not paid during a period, paid more than once in a period, or paid a different amount each time. Someone paid every four weeks gets thirteen paydays a year, so once a year two of them fall in the same assessment period: that month’s Universal Credit drops sharply, sometimes to nothing, and the following month returns to the usual level. Weekly and fortnightly pay produce the same effect with four or five paydays per period. Seeing a low payment after a double payday is normal; it is not an overpayment. ${h.a('universal-credit-payment-dates', 'Universal Credit payment dates')} shows how to find the dates of your own periods.</p>

<h2>Why working more always pays</h2>
<p>Because the taper is ${h.pct(U.taper, 0)}, every extra pound earned above the work allowance leaves ${h.gbp(1 - U.taper, 2)} in your pocket, before any tax or National Insurance on that pound. Income tax and National Insurance on the gross pound come off first, because the taper works on take-home pay, so the real gain is lower still. It is a modest reward, but it is never negative. Childcare costs can tip the balance the other way, which is why Universal Credit refunds ${h.pct(U.childcareShare, 0)} of them; see ${h.a('universal-credit-childcare-costs', 'childcare costs in Universal Credit')}.</p>

<h2>Earnings and the benefit cap</h2>
<p>Wages do a second job in Universal Credit: once the household takes home ${h.gbp(P.benefitCap.earningsExemptMonthly)} a month or more between you, the benefit cap no longer applies. For a family with high rent this threshold can matter more than the taper. Going from ${h.gbp(800)} to ${h.gbp(900)} a month of take-home pay costs ${h.gbp(100 * U.taper)} of Universal Credit through the taper, but if the award was being capped it can also release the whole amount the cap was holding back. Someone who stops work after a year of earning at least that much gets a grace period of ${P.benefitCap.gracePeriodMonths} months before the cap starts.</p>

<h2>Reporting earnings</h2>
<p>Most employees do not report pay at all: it flows from payroll. Check the earnings figure on each statement against your payslip, because a late or wrong employer report is the most common reason a statement looks odd. If the figure is wrong, tell Universal Credit through your journal with the payslip attached. Self-employed claimants report their own earnings each month and follow different rules.</p>
`,
});
