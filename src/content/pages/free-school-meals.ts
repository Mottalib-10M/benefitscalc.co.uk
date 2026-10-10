import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { formatMoney } from '../../lib/format';

const S = P.schoolMeals;
const g = (n: number, d = 0) => formatMoney(n, d);

export default definePage({
  id: 'free-school-meals',
  group: 'family',
  order: 80,
  mini: 'schoolMeals',
  miniHref: 'universal-credit-calculator',
  related: ['universal-credit-calculator', 'scottish-child-payment', 'benefits-in-scotland', 'benefits-in-northern-ireland', 'child-benefit-rates', 'cost-of-living-payment'],
  sources: ['govFsm', 'scotSchoolMeals', 'walesUpfsm', 'walesSchoolCosts', 'nidSchoolMeals'],
  slug: 'free-school-meals',
  nav: 'Free school meals',
  card: 'Who gets free school meals in England, Scotland, Wales and Northern Ireland in 2026/27.',
  title: 'Free School Meals 2026/27: Universal Credit Rules by Nation',
  description: `Free school meals 2026/27: every Universal Credit child in England, the ${g(S.ucIncomeLimitBefore)} limit gone; Scotland, Wales and Northern Ireland rules and limits compared.`,
  h1: 'Free school meals: who qualifies in each UK nation',
  intro: 'England dropped its earnings test for Universal Credit families this school year; the other three nations draw the line differently.',
  resume: `From the start of the 2026 to 2027 school year, every child in a Universal Credit household in England qualifies for free school meals, whatever the family earns. Until then, a family claiming Universal Credit since April 2018 qualified only if household take-home earnings were ${g(S.ucIncomeLimitBefore)} a year or less, not counting benefits, so many working parents on part-time wages were shut out. Children in Reception, Year 1 and Year 2 at state-funded schools in England get a free lunch anyway, and income-related ESA, the guarantee element of Pension Credit and asylum support under Part VI of the Immigration and Asylum Act 1999 still qualify too. Scotland gives free lunches to every pupil in P1 to P5 and then uses a Universal Credit earnings limit of ${g(S.scotUcEarnedMonthly)} a month. Wales gives every primary pupil a free meal and is extending secondary meals to Universal Credit households. Northern Ireland keeps an earnings test of ${g(S.niUcNetEarningsYear)} a year. In each nation you apply through the council or education authority, not the school.`,
  faqs: [
    { q: 'Does my child get free school meals on Universal Credit if I work full time?', a: `In England, yes, from the 2026 to 2027 school year: the ${g(S.ucIncomeLimitBefore)} earnings limit no longer applies, so any Universal Credit award qualifies, however small. In Scotland, older pupils need earned income of no more than ${g(S.scotUcEarnedMonthly)} a month; in Northern Ireland, household net earnings of no more than ${g(S.niUcNetEarningsYear)} a year. You still have to apply through your local council.` },
    { q: 'Why should I register for free school meals if my infant already gets them?', a: `Because infant meals in England are given to every child in Reception to Year 2, the school only learns that your family qualifies on income grounds if you tell the council. Registering can bring the school extra funding, and it means meals continue without a gap from Year 3. In Wales, registering also opens the School Essentials Grant of up to ${g(S.walesEssentialsGrant)}.` },
    { q: 'Are free school meals available in the holidays?', a: `Not as school lunches, but eligibility opens other help. In England, children entitled to free school meals can join the Holiday Activity and Food Programme, and the council may be able to help with food through its local crisis support. In Scotland, families on the qualifying benefits can apply to the council for help during the holidays, and must apply even for children in P1 to P5.` },
    { q: 'Can my 17-year-old at sixth form get free school meals?', a: `Yes, if they are still at school and the family qualifies. A young person who receives a qualifying benefit such as Universal Credit in their own name, rather than through a parent, can also claim free meals directly: GOV.UK says this for England, mygov.scot for 16 to 18-year-olds in Scotland, and nidirect for Northern Ireland.` },
    { q: 'What if we have no recourse to public funds?', a: `Your child may still get free school meals. In England, GOV.UK tells families with no recourse to public funds to ask the school or local authority whether the child is eligible. In Scotland, councils can give a free lunch where immigration status prevents government help, or while a family waits for its first Universal Credit payment.` },
  ],
  body: (h) => `
<h2>England: the 2026/27 change</h2>
<p>${h.src('govFsm', 'GOV.UK’s free school meals page')} now states that from the start of the 2026 to 2027 academic year a child qualifies if the family gets Universal Credit, regardless of household income. Before that, the test for families on Universal Credit was net earnings of ${h.gbp(S.ucIncomeLimitBefore)} a year or less, after tax and excluding benefits. A lone parent working 20 hours a week at the National Living Wage earned well above that figure and lost the meals; she now keeps them for as long as any Universal Credit is paid.</p>
<p>The other qualifying routes in England stay as they were:</p>
<ul>
<li>income-related Employment and Support Allowance;</li>
<li>the guarantee element of Pension Credit, relevant to grandparents and kinship carers above State Pension age;</li>
<li>support under Part VI of the Immigration and Asylum Act 1999.</li>
</ul>
<p>Children below compulsory school age who are in full-time education qualify on the same terms, and so do young people who receive one of these benefits in their own name. A child entitled to free school meals in England can also take part in the Holiday Activity and Food Programme run by councils.</p>

<h3>Infant free school meals</h3>
<p>Separately, every child in Reception, Year 1 and Year 2 at a government-funded school in England gets a free lunch, whatever the family income. Parents still have reason to tell the council about a qualifying benefit: the school can receive extra funding for the pupil, and the entitlement then carries on without a break into Year 3.</p>

<h2>Scotland: free to P5, then a benefit test</h2>
<p>All pupils in primary 1 to 5 at council schools and schools funded by the Scottish Government get a free lunch in term time, and so do children at special schools of any age. From P6 the family needs a qualifying benefit, set out by ${h.src('scotSchoolMeals', 'mygov.scot')}.</p>
${h.table(['Stage', 'Who qualifies'], [
  ['P1 to P5', 'Every pupil, no test'],
  ['P6 and P7', `${h.a('scottish-child-payment', 'Scottish Child Payment')}, or Universal Credit with earned income up to ${h.gbp(S.scotUcEarnedMonthly)} a month, or Pension Credit, Income Support, income-based JSA or ESA, or Part VI asylum support`],
  ['Secondary', `Universal Credit with earned income up to ${h.gbp(S.scotUcEarnedMonthly)} a month, Pension Credit, Income Support, income-based JSA or ESA, or Part VI asylum support`],
  ['16 to 18', 'Any of the above received in the young person’s own right'],
], 'Free school meals in Scotland, 2026/27 (mygov.scot, updated 1 April 2026)', ['l', 'l'])}
<p>Scottish Child Payment is the widest route for P6 and P7 because it has no earnings limit of its own: a family that gets it through Universal Credit qualifies even if earnings are above ${h.gbp(S.scotUcEarnedMonthly)} a month. In secondary school the earnings test applies. Children in funded early learning and childcare also get a free meal on the days they attend, without applying, and the Scottish Government has said free breakfast clubs will be open to all primary pupils from ${h.date(S.scotBreakfastFrom)}.</p>

<h2>Wales: every primary pupil</h2>
<p>All primary school children in Wales can now have a free lunch under ${h.src('walesUpfsm', 'Universal Primary Free School Meals')}, with no test of income. In secondary school, the Welsh Government says it is extending free meals to every pupil in a household claiming Universal Credit, with no income limit, beginning with years 7 and 8. Check the current year groups with your local authority, because the rollout is moving year by year. Families who qualify on benefit grounds should register even when a primary child already eats for free, because ${h.src('walesSchoolCosts', 'the School Essentials Grant')} of up to ${h.gbp(S.walesEssentialsGrant)} per child, for uniform, kit and equipment, and the school’s Pupil Development Grant depend on it.</p>

<h2>Northern Ireland: an earnings test remains</h2>
<p>Northern Ireland has no universal meals for younger pupils. A child at school, or full-time at pre-school, qualifies if the family gets Universal Credit with household net earnings of no more than ${h.gbp(S.niUcNetEarningsYear)} a year, raised for the 2026 to 2027 school year from ${h.gbp(S.niUcNetEarningsYearPrev)}. Income-related ESA, the guarantee element of State Pension Credit and Part VI asylum support also qualify, as does a statement of special educational needs that requires a special diet. ${h.src('nidSchoolMeals', 'nidirect')} points applicants to the Education Authority. The ${h.a('benefits-in-northern-ireland', 'guide to benefits in Northern Ireland')} covers the other differences there.</p>

<h2>The four nations side by side</h2>
${h.table(['Nation', 'Free for everyone', 'Universal Credit test for the rest'], [
  ['England', 'Reception to Year 2', 'None from 2026/27: any award qualifies'],
  ['Scotland', 'P1 to P5', `Earned income up to ${h.gbp(S.scotUcEarnedMonthly)} a month (or Scottish Child Payment in P6 and P7)`],
  ['Wales', 'All primary years', 'Secondary: being extended to all Universal Credit households'],
  ['Northern Ireland', 'No year group', `Net earnings up to ${h.gbp(S.niUcNetEarningsYear)} a year`],
], 'Free school meals by nation, 2026/27 school year', ['l', 'l', 'l'])}

<h2>How to apply and what to have ready</h2>
<p>Applications go to the local council in England, Scotland and Wales and to the Education Authority in Northern Ireland, usually through a short online form. Have your National Insurance number and your child’s school details to hand, and the date your Universal Credit started. Apply as soon as the award begins rather than waiting for a new term.</p>
<p>Being on Universal Credit is now the key in England, so families who earn too much for meals elsewhere should check whether they would get any Universal Credit at all. The ${h.a('universal-credit-calculator', 'Universal Credit calculator')} shows whether a small award is due, and a small award is enough.</p>
`,
});
