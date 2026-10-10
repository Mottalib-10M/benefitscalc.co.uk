import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { computeUc } from '../../lib/engine/uc';
import { niTwiceMonthly } from '../../lib/engine/support';
import { formatMoney, displayDate } from '../../lib/format';

const g = (n: number, d = 2) => formatMoney(n, d);
const C = P.benefitCap;
// Worked example: lone parent in Derry, two children, part-time pay £700 a month, housing association rent £480 a month.
const uc = computeUc({ couple: false, age: 34, children: 2, earnings: 700, housing: 'social', rent: 480 });
const split = niTwiceMonthly(uc.award, Math.min(480, uc.award));

export default definePage({
  id: 'benefits-in-northern-ireland',
  group: 'nations',
  order: 30,
  mini: 'niUcSplit',
  miniHref: 'universal-credit-calculator',
  related: ['universal-credit-calculator', 'universal-credit-payment-dates', 'benefit-cap-calculator', 'bedroom-tax', 'universal-credit-two-child-limit', 'benefits-in-scotland'],
  sources: ['nidUcPaid', 'nidUcHousing', 'nidWelfare', 'nidHbChanges', 'nidCap', 'nidTwoChild', 'nidRateRebate', 'nidDiscretionary'],
  slug: 'benefits-in-northern-ireland',
  nav: 'Benefits in Northern Ireland',
  card: 'Twice-monthly Universal Credit, rent paid to the landlord, Welfare Supplementary Payments and Rate Rebate.',
  title: 'Benefits in Northern Ireland 2026/27: How the System Differs',
  description: `Benefits in Northern Ireland 2026/27: Universal Credit paid twice a month, housing costs to the landlord, Welfare Supplementary Payments, a ${g(C.weekly.restFamily)} weekly cap.`,
  h1: 'Benefits in Northern Ireland: same rates, different delivery',
  intro: 'The Department for Communities pays the same amounts as DWP, but the timing, the rent and the safety nets work differently.',
  resume: `Northern Ireland has its own social security system, run by the Department for Communities rather than DWP, with the same 2026/27 rates: a Universal Credit standard allowance of ${g(P.uc.standard.single25)} a month at 25 or over, PIP from ${g(P.pip.mobilityStandard)} to ${g(P.pip.dailyEnhanced + P.pip.mobilityEnhanced)} a week, Carer’s Allowance of ${g(P.carers.allowance)}. The differences lie in delivery. Universal Credit is paid twice a month by default, the first payment being half the monthly amount about five weeks after the claim, and the housing element goes straight to the landlord. Welfare Supplementary Payments, unique to Northern Ireland, make up losses from the benefit cap for families with children, from the social sector size criteria (the bedroom tax), and from changes linked to PIP and Carer’s Allowance. The benefit cap is ${g(C.weekly.restFamily)} a week for a couple or lone parent and ${g(C.weekly.restSingle)} for a single adult, with no London rate. Private rents are capped by ${P.lha.niAreas} Housing Executive rental areas, homes pay domestic rates instead of Council Tax, and Universal Credit claimants claim a Rate Rebate separately. The two-child limit ended here too on ${displayDate(P.uc.twoChildLimitEnded, 'en-GB')}.`,
  faqs: [
    { q: 'Can I get Universal Credit paid once a month in Northern Ireland?', a: 'Yes. Twice-monthly payment is the default, but after making your claim you can ask for a single monthly payment by sending a message to your work coach through your online account. A couple on a joint claim can also ask for the payment to be split between the two partners in the same way.' },
    { q: 'Can I have the Universal Credit housing element paid to me instead of my landlord?', a: 'Possibly. nidirect says the housing element is paid directly to your landlord, but that you can ask for it to be paid to you if you meet certain conditions, so that you pay your own rent. If you then stop paying, your landlord can ask for future housing payments, and any unpaid ones, to be sent to them.' },
    { q: 'How long do Welfare Supplementary Payments for the bedroom tax last?', a: 'They continue while you are still affected by the social sector size criteria, including after you move from Housing Benefit to Universal Credit, without a new application. They are paid every four weeks in arrears, normally to the landlord. Report changes such as a hospital stay, a new address or new bank details, because an overpayment can be recovered from you or your landlord.' },
    { q: 'Does Universal Credit pay my rates in Northern Ireland?', a: 'No. Housing Benefit used to include help with rates, but that stops when you claim Universal Credit, and Universal Credit has no amount for rates. You claim a Rate Rebate online through Land and Property Services instead. Apply soon after Universal Credit is awarded: nidirect warns that waiting more than three months can cost you some backdated rebate.' },
    { q: 'Is there a Warm Home Discount in Northern Ireland?', a: `No. The ${g(P.warmHomeDiscount.amount)} Warm Home Discount covers England, Wales and Scotland only; GOV.UK points Northern Ireland households to the Affordable Warmth scheme instead. The Winter Fuel Payment of ${g(P.winterFuel.base, 0)} or ${g(P.winterFuel.older, 0)} is paid in Northern Ireland to people born on or before ${displayDate(P.winterFuel.bornOnOrBefore, 'en-GB')}, and Cold Weather Payments apply, with a separate postcode checker.` },
  ],
  body: (h) => `
<h2>How a Universal Credit award reaches you</h2>
<p>Take a lone parent in Derry with two children, earning ${h.gbp(700)} a month part time and renting from a housing association for ${h.gbp(480)}. Her monthly award is ${h.gbp(uc.award, 2)}, the same as it would be in Leeds. The ${h.src('nidUcPaid', 'Northern Ireland payment rules')} change what lands where: ${h.gbp(split.toLandlord, 2)} goes to the housing association each month, and the remaining ${h.gbp(split.toYouMonthly, 2)} is paid to her in two instalments of about ${h.gbp(split.eachPayment, 2)}, on the same two dates each month. Someone claiming on 4 July would, following the nidirect example, be paid on 10 August and 24 August, then on the 10th and 24th of each month.</p>
<p>Payments falling on a weekend or bank holiday come on the previous banking day. When a tenant moves, the housing costs go to the landlord recorded at the end of the assessment period, and only to one landlord, so the tenant settles any difference between old and new landlords. A tenant moving from Housing Benefit gets two extra weeks of Housing Benefit after claiming Universal Credit, which must go towards rent arrears if there are any.</p>

<h2>Welfare Supplementary Payments</h2>
<p>Northern Ireland has its own top-ups to soften welfare changes. The ${h.src('nidWelfare', 'Welfare Supplementary Payments')} cover four situations: the benefit cap, Personal Independence Payment, Carer’s Allowance and the changes to Housing Benefit for social tenants with spare bedrooms. A household can receive more than one. They are paid every four weeks in arrears and some are taxable, which recipients must tell HMRC about through their personal tax account.</p>
${h.table(['Change', 'What the payment does', 'Who receives it'], [
  ['Benefit cap', 'Makes up the Housing Benefit or Universal Credit lost to the cap, for households with children', 'Whoever gets the rent support: claimant, landlord or letting agent'],
  ['Social sector size criteria', `Makes up the ${h.pct(P.lha.socialSpareOne, 0)} or ${h.pct(P.lha.socialSpareTwo, 0)} cut for spare bedrooms`, 'Normally the landlord, or you if you pay the rent yourself'],
  ['Personal Independence Payment', 'Helps people who lose out under the PIP changes', 'Set out in the award letter'],
  ['Carer’s Allowance', 'Helps carers who lose out under the changes', 'Set out in the award letter'],
], 'Welfare Supplementary Payments in Northern Ireland (nidirect)', ['l', 'l', 'l'])}
<p>To check eligibility, contact the Welfare Supplementary Payments Team; the decision letter explains how to report changes. Capped households not eligible for a Supplementary Payment may apply for a Discretionary Housing Payment from the Housing Executive.</p>

<h2>Housing costs and the Housing Executive’s rental areas</h2>
<p>For private tenants, the housing element is the lower of the rent and the Local Housing Allowance of one of Northern Ireland’s ${P.lha.niAreas} Broad Rental Market Areas, from Belfast to the South West, which ${h.src('nidUcHousing', 'nidirect')} lists with rates held at their 2025 to 2026 level. These are not in this site’s ${h.a('local-housing-allowance-rates', 'LHA tables')}, which cover Great Britain. Single private tenants under ${P.lha.sarAgeLimit} get the shared room rate unless an exemption applies, much as in Great Britain: a care leaver aged 18 to 24, someone formerly homeless who is receiving resettlement support, a person managed as a risk of serious harm, or someone getting the daily living part of PIP, Attendance Allowance or the middle or highest DLA care rate.</p>
<p>Social tenants of the Housing Executive or a housing association get their actual rent and eligible service charges, reduced for spare bedrooms under the ${h.a('bedroom-tax', 'size criteria')}, with the cut then made up by mitigation payments. ${h.src('nidHbChanges', 'nidirect')} adds exemptions that matter here: tenants in supported or temporary accommodation, houseboats, caravans, mobile homes and shared co-ownership are not affected, and an extra room may be allowed after a recent bereavement. Each adult over 21 living with you who is not your partner reduces the Universal Credit housing amount by ${h.gbp(P.uc.nonDepDeduction, 2)} a month, unless an exemption applies.</p>

<h2>Rates instead of Council Tax</h2>
<p>Northern Ireland has no Council Tax; homes pay domestic rates, collected by Land and Property Services. Universal Credit claimants get help through a separate ${h.src('nidRateRebate', 'Rate Rebate')}, claimed online after creating an account, open to homeowners and tenants of the Housing Executive, housing associations and private landlords, but not to people in supported accommodation. Housing Benefit, still paid to pension-age tenants, can include help with rates.</p>

<h2>The cap, the two-child limit and crisis help</h2>
<p>The ${h.src('nidCap', 'benefit cap')} uses the same weekly levels as Great Britain outside London, ${h.gbp(C.weekly.restFamily, 2)} and ${h.gbp(C.weekly.restSingle, 2)}, the same ${h.gbp(C.earningsExemptMonthly)} earnings exemption and the same ${C.gracePeriodMonths}-month grace period. The ${h.src('nidTwoChild', 'two-child limit')} ended on ${h.date(P.uc.twoChildLimitEnded)}; existing claims were reassessed automatically and increases were paid by June 2026, though the cap can absorb them. For emergencies, ${h.src('nidDiscretionary', 'Discretionary Support')} offers interest-free loans or grants to households with income of up to ${h.gbp(P.ni.dsIncomeLimit, 2)} a year, and a Short-term Benefit Advance is the Northern Ireland route to an advance on benefit. Budgeting Loans from DWP do not apply; Northern Ireland has its own Social Fund version.</p>
`,
});
