import { definePage } from '../../lib/guide-types';
import { P, weeklyToMonthly } from '../../lib/engine/params';
import { newStyleEsa } from '../../lib/engine/disability-extra';
import { computeUc } from '../../lib/engine/uc';
import { formatMoney } from '../../lib/format';

const E = P.esaJsa;
const g = (n: number, d = 2) => formatMoney(n, d);
const support = newStyleEsa({ age: 30, phase: 'support' });
const wrag = newStyleEsa({ age: 30, phase: 'wrag' });
// Couple: Ellie (38) in the support group, partner takes home £3,000 a month; they rent from a housing association at £650.
const couple = { couple: true, age: 38, children: 0, earnings: 3000, housing: 'social' as const, rent: 650, health: 'lcwraNew' as const };
const ucCouple = computeUc(couple);
const ucCoupleEsa = computeUc({ ...couple, unearned: support.monthlyForUc });
const coupleGain = support.monthlyForUc + ucCoupleEsa.award - ucCouple.award;
// Single man (29) in the support group, no earnings, social rent £520: UC with and without his ESA.
const single = { couple: false, age: 29, children: 0, earnings: 0, housing: 'social' as const, rent: 520, health: 'lcwraNew' as const };
const ucAlone = computeUc(single);
const ucWithEsa = computeUc({ ...single, unearned: support.monthlyForUc });
const pension150 = newStyleEsa({ age: 58, phase: 'wrag', privatePension: 150 });

export default definePage({
  id: 'new-style-esa',
  group: 'disability',
  order: 80,
  mini: 'esaNewStyle',
  miniHref: 'universal-credit-calculator',
  related: ['universal-credit-health-element', 'universal-credit-calculator', 'pip-eligibility', 'universal-credit-and-pip', 'benefit-cap-calculator'],
  sources: ['govEsa', 'govEsaElig', 'govEsaClaim', 'govEsaWork', 'dwpRates', 'cpRegs51', 'wrwa15', 'govBenefitCap'],
  slug: 'new-style-esa',
  nav: 'New Style ESA',
  card: 'The contribution-based sickness benefit: assessment rate, the two groups, payment days and Universal Credit.',
  title: 'New Style ESA 2026/27: Rates, Groups and Universal Credit',
  description: `New Style ESA 2026/27: ${g(E.under25)} or ${g(E.over25)} a week while assessed, then ${g(wrag.weekly)} in the work-related activity group or ${g(support.weekly)} in the support group, paid fortnightly.`,
  h1: 'New Style ESA: what you get, for how long, and how it sits with Universal Credit',
  intro: 'The sickness benefit you earn through National Insurance, paid whatever your partner earns.',
  resume: `New Style Employment and Support Allowance is a fortnightly benefit for people under State Pension age whose disability or health condition limits how much they can work, and who have paid enough National Insurance, usually in the last two to three tax years. For the first ${E.assessmentWeeks} weeks it pays an assessment rate of ${g(E.under25)} a week under 25 or ${g(E.over25)} from 25. After the Work Capability Assessment you join one of two groups: the work-related activity group, at ${g(wrag.weekly)} a week for up to ${E.wragDays} days, or the support group, at ${g(support.weekly)} with no time limit. It is paid every ${E.paidEveryWeeks} weeks in arrears and earns Class 1 National Insurance credits. Savings and a partner’s earnings do not reduce it, but a private pension above ${g(E.pensionThreshold, 0)} a week does. It can be paid with Universal Credit, which is then reduced pound for pound, so the two together are often worth the same as Universal Credit alone, but arrive more regularly.`,
  faqs: [
    { q: 'My partner works full time: can I still get New Style ESA?', a: `Yes. New Style ESA depends on your own National Insurance record, not on household income. GOV.UK lists household income and savings of ${g(E.capitalReport, 0)} or more as things that affect only the old income-related ESA. A couple where one partner earns well and the other is too ill to work may get no Universal Credit at all, yet New Style ESA is paid in full.` },
    { q: 'How long does New Style ESA last if I am in the work-related activity group?', a: `${E.wragDays} days. GOV.UK says New Style and contribution-based ESA end after ${E.wragDays} days in the work-related activity group; there is no time limit in the support group. After it ends you may qualify again with fresh contributions from the last two full tax years, or if your health worsens and you are placed in the support group.` },
    { q: 'Which day of the week is New Style ESA paid?', a: `It depends on the last two digits of your National Insurance number. Regulation 51 of the Claims and Payments Regulations 2013 pays ESA fortnightly in arrears on Monday for 00 to 19, Tuesday for 20 to 39, Wednesday for 40 to 59, Thursday for 60 to 79 and Friday for 80 to 99. The DWP can arrange a different day in individual cases.` },
    { q: 'Can I claim New Style ESA while my employer pays Statutory Sick Pay?', a: `No, but you can apply in advance. GOV.UK says you cannot get New Style ESA while receiving Statutory Sick Pay, and that you can apply up to ${E.applyBeforeSspEndsMonths} months before your SSP ends; ESA then starts as soon as SSP stops. Give the date your SSP ends in the application to avoid a gap between the two.` },
    { q: 'Why is the New Style ESA assessment rate lower for under-25s?', a: `The assessment rate follows the old personal allowance split: ${g(E.under25)} under 25 and ${g(E.over25)} from 25. Once you are placed in a group the age difference disappears and everyone gets at least ${g(E.over25)}. If the assessment takes longer than ${E.assessmentWeeks} weeks you stay on the assessment rate, and any money owed is backdated after the decision.` },
  ],
  body: (h) => `
<h2>Rates for 2026/27</h2>
${h.table(['Stage', 'A week', 'Every two weeks', 'A month (as Universal Credit counts it)'], [
  ['Assessment, under 25', h.gbp(E.under25, 2), h.gbp(E.under25 * 2, 2), h.gbp(weeklyToMonthly(E.under25), 2)],
  ['Assessment, 25 or over', h.gbp(E.over25, 2), h.gbp(E.over25 * 2, 2), h.gbp(weeklyToMonthly(E.over25), 2)],
  ['Work-related activity group', h.gbp(wrag.weekly, 2), h.gbp(wrag.fortnightly, 2), h.gbp(wrag.monthlyForUc, 2)],
  ['Support group', h.gbp(support.weekly, 2), h.gbp(support.fortnightly, 2), h.gbp(support.monthlyForUc, 2)],
], 'New Style ESA from April 2026 (DWP benefit and pension rates 2026 to 2027; GOV.UK)', ['l', 'r', 'r', 'r'])}
<p>The support group amount is the basic ${h.gbp(E.over25, 2)} plus the support component of ${h.gbp(E.esaSupport, 2)}. The ${h.src('dwpRates', 'DWP rates table')} also lists a work-related activity component of ${h.gbp(E.esaWra, 2)}, but ${h.src('wrwa15', 'section 15 of the Welfare Reform and Work Act 2016')} removed it for claims from ${h.date(E.wraComponentEnded)}. It survives only in older awards, which is why GOV.UK quotes ${h.gbp(wrag.weekly, 2)} for the work-related activity group today.</p>

<h2>Who can claim</h2>
<p>${h.src('govEsaElig', 'GOV.UK’s conditions')} are short. You must be under State Pension age, have a disability or health condition that affects how much you can work, have worked as an employee or been self-employed, and have paid enough National Insurance contributions, usually in the last two to three years. National Insurance credits, for example from an earlier period of illness or caring, count too. You can apply in or out of work, but not while getting Jobseeker’s Allowance or Statutory Sick Pay. Have a fit note ready if you have been unable to work for more than a week in a row. The old income-related ESA is closed to new claims; low-income support now comes through Universal Credit.</p>

<h2>Assessment, then one of two groups</h2>
<p>For the first ${h.num(E.assessmentWeeks)} weeks you receive the assessment rate while the DWP arranges a Work Capability Assessment, starting with the capability for work questionnaire. If you claim both benefits, one assessment serves for New Style ESA and Universal Credit. ${h.src('govEsaClaim', 'Afterwards')} you are placed in the work-related activity group if you are expected to be able to work in future, with regular work coach interviews, or in the support group if your condition severely limits what you can do, with no conditions attached. People nearing the end of life go straight into the support group.</p>
<p>The group decides more than the weekly amount. In the work-related activity group New Style ESA stops after ${h.num(E.wragDays)} days, and missing agreed activity can lead to a sanction. In the support group there is neither a time limit nor a sanction, and ${h.src('govBenefitCap', 'GOV.UK confirms')} that ESA with the support component exempts the household from the benefit cap.</p>

<h2>Payment day and frequency</h2>
<p>ESA is paid every ${h.num(E.paidEveryWeeks)} weeks in arrears. ${h.src('cpRegs51', 'Regulation 51')} fixes the weekday from the last two digits of your National Insurance number:</p>
${h.table(['Last two digits', 'Payday'], E.paydayByNino.map(([a, b, d]) => [`${a} to ${b}`, d]), 'ESA paydays (Claims and Payments Regulations 2013, regulation 51)', ['l', 'l'])}

<h2>New Style ESA and Universal Credit</h2>
<p>You can get Universal Credit at the same time as New Style ESA, or instead of it. When you get both, Universal Credit is reduced by the full amount of ESA, converted to a monthly figure. For a single man of 29 in the support group with no earnings and ${h.gbp(520)} rent to a housing association, Universal Credit alone would be ${h.gbp(ucAlone.award, 2)} a month. With New Style ESA of ${h.gbp(support.monthlyForUc, 2)} a month, Universal Credit drops to ${h.gbp(ucWithEsa.award, 2)}: the total is the same. Claiming ESA still has advantages: payments come every fortnight rather than monthly, and you get Class 1 credits that help with other contributory benefits as well as the State Pension.</p>
<p>The real gain comes where Universal Credit is small or nil. Ellie, 38, is in the support group; her partner takes home ${h.gbp(3000)} a month and they pay ${h.gbp(650)} rent. His wages leave them only ${h.gbp(ucCouple.award, 2)} a month of Universal Credit, health element included. Her New Style ESA ignores his wages and pays ${h.gbp(support.weekly, 2)} a week, about ${h.gbp(support.monthlyForUc)} a month; Universal Credit falls to ${h.gbp(ucCoupleEsa.award, 2)}, and the household ends up ${h.gbp(coupleGain, 2)} a month better off. ${h.a('universal-credit-health-element', 'The Universal Credit health element')} explains the amount used here.</p>

<h2>Working and pensions while on ESA</h2>
<p>${h.src('govEsaWork', 'You can usually work')} while claiming if you work less than ${h.num(E.permittedWorkHours)} hours a week and earn no more than ${h.gbp(E.permittedWorkLimit, 2)} a week, and you can volunteer for as many hours as you like. Tell Jobcentre Plus first, using the permitted work form if you are already claiming.</p>
<p>A private or workplace pension is treated differently. ${h.src('govEsa', 'GOV.UK says')} half of any pension income over ${h.gbp(E.pensionThreshold)} a week is taken off ESA. A 58-year-old in the work-related activity group with an early pension of ${h.gbp(150)} a week loses ${h.gbp(pension150.pensionCut, 2)} and receives ${h.gbp(pension150.weekly, 2)}. A large enough pension wipes ESA out completely, though the Class 1 credits continue.</p>

<h2>Changes, PIP and challenges</h2>
<p>Report changes straight away: a new job or different hours, a stay in hospital, a partner moving in, or someone starting to claim Carer’s Allowance for you. New Style ESA and ${h.a('pip-eligibility', 'PIP')} are separate: PIP pays for extra costs and has its own assessment, and you can get both. If you disagree with a decision, such as being placed in the work-related activity group, ask for mandatory reconsideration within ${h.num(P.challenge.mrMonths)} month of the decision.</p>
`,
});
