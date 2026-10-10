import { definePage } from '../../lib/guide-types';
import { P, weeklyToMonthly } from '../../lib/engine/params';
import { computeUc } from '../../lib/engine/uc';
import { pipWeekly } from '../../lib/engine/disability';
import { formatMoney } from '../../lib/format';

const U = P.uc;
const pip = P.pip;
const g = (n: number, d = 2) => formatMoney(n, d);
// Example: Nadia, 41, housing association rent £500, son of 23 living at home, no earnings; PIP standard daily living + standard mobility.
const nadiaBase = { couple: false, age: 41, children: 0, earnings: 0, housing: 'social' as const, rent: 500 };
const withoutPip = computeUc({ ...nadiaBase, nonDependants: 1 });
const withPip = computeUc({ ...nadiaBase, nonDependants: 0, capExempt: true });
const nadiaPip = weeklyToMonthly(pipWeekly('standard', 'standard'));

export default definePage({
  id: 'universal-credit-and-pip',
  group: 'uc',
  order: 130,
  mini: 'ucAndPip',
  miniHref: 'pip-points-calculator',
  related: ['pip-rates', 'pip-eligibility', 'universal-credit-health-element', 'universal-credit-carer-element', 'universal-credit-housing-element', 'benefit-cap-calculator'],
  sources: ['govUc', 'govPip', 'ucRegsSch4', 'govBenefitCap', 'ucRegs41'],
  slug: 'universal-credit-and-pip',
  nav: 'Universal Credit and PIP',
  card: 'PIP is not counted as income, and its daily living part unlocks several Universal Credit rules.',
  title: 'Universal Credit and PIP 2026/27: How the Two Fit Together',
  description: `Universal Credit and PIP 2026/27: PIP of up to ${g(pip.dailyEnhanced + pip.mobilityEnhanced)} a week is not taken off Universal Credit, lifts the benefit cap and stops the ${g(U.nonDepDeduction)} deduction.`,
  h1: 'Universal Credit and PIP: what one changes in the other',
  intro: 'PIP never reduces Universal Credit. Several Universal Credit rules change once PIP is in payment.',
  resume: `PIP is paid on top of Universal Credit and is not counted as income, so an award of ${g(pip.dailyStandard)} to ${g(pip.dailyEnhanced + pip.mobilityEnhanced)} a week leaves your Universal Credit exactly as it was. It is not a backdoor to the health element: the Work Capability Assessment for Universal Credit and the PIP assessment are separate, and PIP does not give LCWRA automatically. What PIP does is switch on other rules. Any PIP award in the household exempts it from the benefit cap. The daily living part stops the ${g(U.nonDepDeduction)} a month housing deduction for adults living with you, lifts the shared accommodation limit for private renters under ${P.lha.sarAgeLimit}, and lets someone who cares for you for ${P.carers.hoursPerWeek} hours a week receive the carer element of ${g(U.carer)} a month. A disabled young person aged 16 or over in your claim who gets PIP brings the disabled child addition. Unspent PIP built up in the bank does count as savings.`,
  faqs: [
    { q: 'Do I have to tell Universal Credit that I have been awarded PIP?', a: `Yes, report it as a change of circumstances, even though PIP is not taken off your award. The DWP needs to know because PIP changes several calculations: the benefit cap stops applying, non-dependant deductions from your rent may end, and a private renter under ${P.lha.sarAgeLimit} may qualify for the one-bedroom rate. If you do not report it, those increases are not applied, and extra amounts are never added automatically.` },
    { q: 'Does getting PIP mean I should get LCWRA on Universal Credit?', a: `Not automatically. PIP scores daily living and mobility; LCWRA is decided by a Work Capability Assessment of what work you can do. Many people get one and not the other. PIP can help you get assessed, though: regulation 41 normally blocks an assessment when you earn ${g(U.wcaEarningsThreshold, 0)} or more a month, but not when you receive PIP. Medical evidence used for PIP can also support the WCA.` },
    { q: 'Will my Universal Credit go down if my PIP is backdated?', a: `No. A lump sum of PIP arrears is not income for Universal Credit, and GOV.UK lists arrears of benefits among payments ignored as capital for ${U.compensationDisregardMonths} months after you receive them. After that, whatever is left in the bank counts with your other savings, and only affects the award if total capital goes above ${g(U.capitalLower, 0)}.` },
    { q: 'Does PIP mobility on its own help with Universal Credit?', a: `Partly. Any PIP award, including mobility only, exempts the household from the benefit cap. But the rules on non-dependant deductions, the shared accommodation rate and the carer element look for the daily living part of PIP, so a mobility-only award does not unlock them. The enhanced mobility rate of ${g(pip.mobilityEnhanced)} a week also opens the Motability scheme.` },
    { q: 'My son is 17 and gets PIP: does our Universal Credit change?', a: `Yes, if he is still in your claim as a qualifying young person in non-advanced education. Besides the child element of ${g(U.child)}, the disabled child addition is paid: the higher amount of ${g(U.disabledChildHigher)} a month if he gets the enhanced daily living rate of PIP, otherwise the lower amount of ${g(U.disabledChildLower)}. If you care for him ${P.carers.hoursPerWeek} hours a week and he gets daily living, the carer element can be added too.` },
  ],
  body: (h) => `
<h2>Why PIP leaves Universal Credit untouched</h2>
<p>Universal Credit deducts some benefits pound for pound: Carer’s Allowance, New Style ESA and JSA, State Pension, Maternity Allowance and a few others are on ${h.src('govUc', 'GOV.UK’s list')}. PIP is not on it. The same is true of DLA, Attendance Allowance and Adult Disability Payment in Scotland. GOV.UK describes PIP as help with extra living costs for people with a long-term condition or disability, so it sits beside Universal Credit rather than inside it, and ${h.a('pip-rates', 'every PIP rate')} is paid in full whatever your Universal Credit award.</p>
${h.table(['PIP award', 'PIP a week', 'About a month', 'Taken off Universal Credit'], [
  ['Daily living standard', h.gbp(pip.dailyStandard, 2), h.gbp(weeklyToMonthly(pip.dailyStandard), 2), h.gbp(0)],
  ['Daily living enhanced', h.gbp(pip.dailyEnhanced, 2), h.gbp(weeklyToMonthly(pip.dailyEnhanced), 2), h.gbp(0)],
  ['Mobility standard', h.gbp(pip.mobilityStandard, 2), h.gbp(weeklyToMonthly(pip.mobilityStandard), 2), h.gbp(0)],
  ['Mobility enhanced', h.gbp(pip.mobilityEnhanced, 2), h.gbp(weeklyToMonthly(pip.mobilityEnhanced), 2), h.gbp(0)],
], 'PIP rates 2026/27 and their effect on Universal Credit (monthly = weekly × 52 ÷ 12)', ['l', 'r', 'r', 'r'])}

<h2>Five rules that PIP switches on</h2>
<h3>The benefit cap stops</h3>
<p>If you, your partner or a child under 18 living with you gets PIP at any rate, the ${h.src('govBenefitCap', 'benefit cap')} does not apply. For a family with high rent outside London, where the cap is ${h.gbp(P.benefitCap.monthly.restFamily, 2)} a month, this can be worth hundreds of pounds a month. See the ${h.a('benefit-cap-calculator', 'benefit cap calculator')}.</p>
<h3>No housing deduction for adults at home</h3>
<p>Normally ${h.gbp(U.nonDepDeduction, 2)} a month is taken from the rent element for each adult aged 21 or over living with you. ${h.src('ucRegsSch4', 'Schedule 4')} makes no deduction at all when the claimant or partner gets PIP daily living, and none for a non-dependant who gets it. Nadia is 41, rents from a housing association for ${h.gbp(500)} and her son of 23 lives with her. Before her PIP award, her Universal Credit was ${h.gbp(withoutPip.award, 2)}; once she reports standard daily living, it becomes ${h.gbp(withPip.award, 2)}, and the PIP itself adds about ${h.gbp(nadiaPip, 2)} a month on top.</p>
<h3>The one-bedroom rate for under-35s</h3>
<p>A single private renter under ${P.lha.sarAgeLimit} is usually limited to the shared accommodation rate. Receiving PIP daily living is one of the exceptions, so the one-bedroom LHA applies instead, often a few hundred pounds more a month. ${h.a('universal-credit-housing-element', 'The housing element page')} lists the rates.</p>
<h3>A carer can get the carer element</h3>
<p>PIP daily living, at either rate, is a qualifying benefit for the ${h.a('universal-credit-carer-element', 'carer element')}. A partner, parent or friend who cares for you for ${P.carers.hoursPerWeek} hours a week and claims Universal Credit can add ${h.gbp(U.carer, 2)} a month, or claim Carer’s Allowance. In a couple, the partner who cares gets the carer element even if the one with PIP has the health element.</p>
<h3>The disabled child addition for 16 to 19 year olds</h3>
<p>DLA for children stops at 16, when the young person has to apply for PIP. A young person still in your claim who receives PIP brings the disabled child addition: ${h.gbp(U.disabledChildHigher, 2)} with the enhanced daily living rate, ${h.gbp(U.disabledChildLower, 2)} with any other award.</p>

<h2>What PIP does not do</h2>
<p>It does not give the health element. A Work Capability Assessment is still needed for LCWRA, which from ${h.date(U.lcwraReformDate)} pays ${h.gbp(U.lcwraNew2026, 2)} or ${h.gbp(U.lcwra, 2)}; see ${h.a('universal-credit-health-element', 'the health element guide')}. PIP does make an assessment possible for someone earning more than ${h.gbp(U.wcaEarningsThreshold)} a month, under ${h.src('ucRegs41', 'regulation 41')}. On its own, PIP does not change the work allowance, the taper or your work-related requirements either.</p>
<p>Unspent PIP also becomes capital. Universal Credit counts “unspent benefits, for example … Personal Independence Payment” as savings, so a PIP account that grows past ${h.gbp(U.capitalLower)}, together with other savings, starts to reduce the award at ${h.gbp(U.tariffPer250, 2)} per ${h.gbp(250)}. Spending PIP on disability costs, as it is intended, avoids the problem.</p>

<h2>After the PIP letter arrives</h2>
<ol>
<li>Report the award in your Universal Credit account, naming the parts and rates, and upload the decision letter if asked.</li>
<li>With the daily living part, if an adult son, daughter or relative lives with you, check that the ${h.gbp(U.nonDepDeduction, 2)} deduction disappears from the next statement.</li>
<li>With the daily living part, if you rent privately, are single and under ${P.lha.sarAgeLimit}, check that the rent line moves from the shared room rate to the one-bedroom rate.</li>
<li>If your award was being capped, check that the cap line has gone.</li>
<li>Tell anyone who looks after you for ${P.carers.hoursPerWeek} hours a week: they may now get the carer element or Carer’s Allowance.</li>
</ol>

<h2>Scotland and Northern Ireland</h2>
<p>In Scotland, Adult Disability Payment replaces PIP for new claims and has the same effects on Universal Credit: ignored as income, a qualifying benefit for the carer element at the standard or enhanced daily living rate, and an exemption from the benefit cap and from non-dependant deductions. In Northern Ireland, PIP is run by the Department for Communities at the same rates, and nidirect lists it among the benefits that exempt a household from the benefit cap.</p>
`,
});
