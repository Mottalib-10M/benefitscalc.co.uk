import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { scotlandExtras } from '../../lib/engine/support';
import { areas } from '../../lib/engine/lha';
import { formatMoney } from '../../lib/format';

const S = P.scotland;
const g = (n: number, d = 2) => formatMoney(n, d);
// Worked example: couple in Dundee on Universal Credit, children aged 1, 6 and 12; the 6-year-old gets the highest care rate of Child Disability Payment.
const ex = scotlandExtras({ childrenUnder16: 3, qualifyingBenefit: true, disabledChildren: 1, winterHeating: true });

export default definePage({
  id: 'benefits-in-scotland',
  group: 'nations',
  order: 20,
  mini: 'scotlandExtras',
  miniHref: 'benefits-calculator',
  related: ['scottish-child-payment', 'best-start-grant', 'adult-disability-payment-scotland', 'carer-support-payment-scotland', 'pension-age-winter-heating-payment', 'bedroom-tax'],
  sources: ['scotUprating', 'scotChoices', 'scotHousingCosts', 'scotScpWho', 'scotCwhpWho', 'scotCsp', 'scotBsg', 'scotWhpElig', 'scotYcg', 'scotFsp'],
  slug: 'benefits-in-scotland',
  nav: 'Benefits in Scotland',
  card: 'Which benefits Social Security Scotland pays instead of DWP, the payments only Scotland has, and the Universal Credit choices.',
  title: 'Benefits in Scotland 2026/27: Social Security Scotland Guide',
  description: `Benefits in Scotland 2026/27: ADP, Carer Support Payment and Scottish Child Payment of ${g(S.childPayment)} a week, Best Start Grants, winter payments and UC choices.`,
  h1: 'Benefits in Scotland: what Social Security Scotland pays, and what stays with DWP',
  intro: 'Same Universal Credit, same State Pension, but a different agency for disability and carer benefits and a set of payments found nowhere else.',
  resume: `Scotland runs two benefit systems side by side. DWP still pays Universal Credit, the State Pension, Pension Credit, New Style JSA and ESA, while HMRC pays Child Benefit, all at the same rates as in England and Wales. Social Security Scotland, an agency of the Scottish Government, has replaced PIP with Adult Disability Payment, Attendance Allowance with Pension Age Disability Payment, child DLA with Child Disability Payment, Carer’s Allowance with Carer Support Payment, and the Winter Fuel Payment with the Pension Age Winter Heating Payment, worth ${g(S.pawhp[0])} to ${g(S.pawhp[3])}. The weekly rates mirror the DWP ones, but carers also get the Scottish Carer Supplement of ${g(S.carerSupplement)} a week. On top come payments with no equivalent elsewhere: Scottish Child Payment of ${g(S.childPayment)} a week for each child under 16 in a low-income family, three Best Start Grants, Best Start Foods, a Child Winter Heating Payment of ${g(S.childWinterHeating)}, a Winter Heating Payment of ${g(S.winterHeating)} instead of Cold Weather Payments, and a Funeral Support Payment with a flat ${g(S.funeralSupport)} towards funeral costs. Universal Credit can be paid twice a month and the rent sent to your landlord, and the bedroom tax is fully mitigated.`,
  faqs: [
    { q: 'Can I get Scottish Child Payment if I only get Child Benefit?', a: `No. Child Benefit on its own does not qualify. You or your partner must get Universal Credit or income-based JSA, or you must be named yourself on Pension Credit, Income Support or income-related ESA. You can apply while a claim for one of these is pending. The payment is ${g(S.childPayment)} a week for each child under 16, paid every four weeks, and it does not reduce any other benefit.` },
    { q: 'How do I ask for Universal Credit twice a month in Scotland?', a: 'New claimants in Scotland are offered the choice after their first payment, which is always for a full month. If you are already claiming and were never asked, tell your work coach. The second month is then split in two, half paid a month after the first payment and half 15 days later, so there is a gap of about six weeks before the full second month has arrived.' },
    { q: 'Do I need to apply for Child Winter Heating Payment?', a: `Usually not. A child or young person under ${S.cwhpAgeUnder} living in Scotland qualifies automatically if they got the highest care rate of Child Disability Payment or child DLA, or the enhanced daily living rate of PIP or Adult Disability Payment, on at least one day of the qualifying week in late September 2026. The ${g(S.childWinterHeating)} is paid into the same account, and each qualifying child in the household gets one.` },
    { q: 'Does Carer Support Payment pay more than Carer’s Allowance?', a: `The base rate is the same, ${g(S.carerSupport)} a week. What differs is the package: Social Security Scotland adds the Scottish Carer Supplement of ${g(S.carerSupplement)} a week automatically, plus a Carer Additional Person Payment of ${g(S.carerAdditionalPerson)} a week for each extra person you care for who gets a qualifying benefit. Neither addition reduces other benefits; the base payment is still deducted from Universal Credit.` },
    { q: 'What happens to the bedroom tax and benefit cap in Scotland?', a: `They still reduce Housing Benefit or Universal Credit, because both are UK rules. The Scottish Government then funds councils to pay them back through Discretionary Housing Payments, and says it fully mitigates the bedroom tax and mitigates the benefit cap as far as devolved powers allow. Apply to your council; for the bedroom tax you should receive one.` },
  ],
  body: (h) => `
<h2>DWP benefits and their Scottish replacements</h2>
<p>Each devolved benefit was built to pay the same weekly rates as the one it replaced, so moving to Scotland, or the transfer of an existing award, does not change the amount. What changes is the agency, the forms and some of the rules on assessment, which Social Security Scotland runs itself.</p>
${h.table(['DWP benefit (rest of the UK)', 'Scotland instead', '2026/27 rates'], [
  ['Personal Independence Payment', h.a('adult-disability-payment-scotland', 'Adult Disability Payment'), `${h.gbp(P.pip.dailyStandard, 2)} or ${h.gbp(P.pip.dailyEnhanced, 2)} daily living; ${h.gbp(P.pip.mobilityStandard, 2)} or ${h.gbp(P.pip.mobilityEnhanced, 2)} mobility, a week`],
  ['Attendance Allowance', 'Pension Age Disability Payment', `${h.gbp(P.aa.lower, 2)} or ${h.gbp(P.aa.higher, 2)} a week`],
  ['Disability Living Allowance for children', 'Child Disability Payment', `care ${h.gbp(P.dla.careLowest, 2)} to ${h.gbp(P.dla.careHighest, 2)}; mobility ${h.gbp(P.dla.mobilityLower, 2)} or ${h.gbp(P.dla.mobilityHigher, 2)} a week`],
  ['Carer’s Allowance', h.a('carer-support-payment-scotland', 'Carer Support Payment'), `${h.gbp(S.carerSupport, 2)} a week, plus ${h.gbp(S.carerSupplement, 2)} Scottish Carer Supplement`],
  ['Winter Fuel Payment', h.a('pension-age-winter-heating-payment', 'Pension Age Winter Heating Payment'), `${h.gbp(S.pawhp[0], 2)} to ${h.gbp(S.pawhp[3], 2)} once a year`],
  ['Cold Weather Payment', 'Winter Heating Payment', `${h.gbp(S.winterHeating, 2)} once a year, whatever the weather`],
  ['Sure Start Maternity Grant', h.a('best-start-grant', 'Best Start Grant, Pregnancy and Baby Payment'), `${h.gbp(S.bsgPregnancyFirst, 2)} first child, ${h.gbp(S.bsgPregnancySubsequent, 2)} later children`],
], 'Devolved benefits in Scotland, 2026/27 (Scottish Government up-rating report; DWP rates)', ['l', 'l', 'l'])}
<p>People in Scotland who already got Attendance Allowance are moved to Pension Age Disability Payment without applying, and DWP keeps paying until the switch. Someone who already gets Adult Disability Payment stays on it after State Pension age rather than switching to Pension Age Disability Payment. Like PIP, none of the disability payments is means-tested or taxed.</p>

<h2>Payments that exist only in Scotland</h2>
${h.table(['Payment', 'Amount 2026/27', 'Who it is for'], [
  [h.a('scottish-child-payment', 'Scottish Child Payment'), `${h.gbp(S.childPayment, 2)} a week per child`, 'Children under 16, parent on Universal Credit or another qualifying benefit'],
  ['Best Start Grant, Early Learning Payment', h.gbp(S.bsgEarlyLearning, 2), 'Child aged 2 to 3½, same benefits'],
  ['Best Start Grant, School Age Payment', h.gbp(S.bsgSchoolAge, 2), 'Child first old enough to start primary school'],
  ['Child Winter Heating Payment', h.gbp(S.childWinterHeating, 2), `Under ${S.cwhpAgeUnder}, highest care rate or enhanced daily living rate`],
  ['Funeral Support Payment', `${h.gbp(S.funeralSupport, 2)} flat rate, plus some associated costs`, 'Person paying for a funeral in Scotland, if no other government funeral payment was made'],
  ['Young Carer Grant', `${h.gbp(S.youngCarerGrant, 2)} a year`, `Carers aged 16 to 19, ${S.ycgHours} hours a week on average for 3 months`],
  ['Job Start Payment', `${h.gbp(S.jobStart, 2)}, or ${h.gbp(S.jobStartHigher, 2)} with children`, 'Young people and care leavers starting a job after time out of work, on certain benefits'],
], 'Scotland-only payments, 2026/27 (Scottish Government; mygov.scot)', ['l', 'r', 'l'])}
<p>The family payments add up. A couple in Dundee on Universal Credit, with children aged 1, 6 and 12, get Scottish Child Payment of ${h.gbp(ex.scpWeekly, 2)} a week, ${h.gbp(ex.scpYear)} a year. If the 6-year-old gets the highest care rate of Child Disability Payment, ${h.gbp(S.childWinterHeating, 2)} arrives each winter for her, and the household’s Universal Credit can bring the ${h.gbp(S.winterHeating, 2)} Winter Heating Payment as well: ${h.gbp(ex.total)} in a year, none of it reducing Universal Credit. The toddler also brings ${h.src('scotBsg', 'Best Start Foods')} and, at two, the Early Learning Payment.</p>

<h2>Universal Credit with Scottish choices</h2>
<p>Universal Credit itself is reserved to Westminster, but the ${h.src('scotChoices', 'Scottish choices')} give claimants in Scotland two options that the rest of Great Britain only gets in exceptional cases. You can be paid twice a month instead of monthly, and you can have the housing element paid directly to your landlord. DWP delivers both on the Scottish Government’s behalf, and both have been open to every claimant since 2018.</p>
<p>The twice-monthly option smooths a budget once it has started, but the first two months are leaner: the first payment covers a full month, then the second month arrives in two halves, one a month later and one 15 days after that. In a joint claim both halves go to the household. Elsewhere in Great Britain a split or twice-monthly payment needs an alternative payment arrangement, granted for reasons such as rent arrears or debt problems.</p>

<h2>Help with rent and crises</h2>
<p>Councils in Scotland still run Discretionary Housing Payments, which the ${h.src('scotHousingCosts', 'Scottish Government funds')}. They are used to pay back the ${h.a('bedroom-tax', 'bedroom tax')} in full and to soften the benefit cap, and you need to be getting Housing Benefit or Universal Credit with a housing element to apply. Crisis Grants and Community Care Grants from the Scottish Welfare Fund cover emergencies and setting up a home; they are grants and are not repaid. Cold Weather Payments do not exist in Scotland: the Winter Heating Payment, based on the benefits you got in the qualifying week of ${h.src('scotWhpElig', '2 to 8 November 2026')}, takes their place.</p>

<h2>What stays the same as in England and Wales</h2>
<p>Universal Credit rates, the ${h.pct(P.uc.taper, 0)} taper and the benefit cap, Child Benefit, the State Pension and Pension Credit are identical. The Local Housing Allowance for Scotland’s ${areas('scotland').length} rental areas is set by the same DWP file; the ${h.a('local-housing-allowance-rates', 'Scottish rates table')} lists them. Moving between Scotland and England means claiming the other nation’s disability or carer benefit, so tell both agencies before you move.</p>
`,
});
