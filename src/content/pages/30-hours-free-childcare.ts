import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { freeHoursEarnings } from '../../lib/engine/family-grants';
import { formatMoney } from '../../lib/format';

const C = P.childcare;
const g = (n: number, d = 0) => formatMoney(n, d);
const freeYear = C.freeHoursWorking * C.weeksPerYear;
// Example parent: 21 or over, 15 hours a week at the National Living Wage (minimum ÷ 16 hours).
const nlw = C.minEarnWeekly21 / C.minEarnHours;
const exShort = freeHoursEarnings(32, 15, nlw);

export default definePage({
  id: '30-hours-free-childcare',
  group: 'family',
  order: 50,
  mini: 'freeHours',
  miniHref: 'tax-free-childcare-calculator',
  related: ['tax-free-childcare-calculator', 'universal-credit-childcare-costs', 'child-benefit-calculator', 'high-income-child-benefit-charge', 'benefits-in-scotland'],
  sources: ['govFreeChildcare', 'govFreeChildcareElig', 'govFreeChildcareWhen', 'govTfc', 'scotSchoolMeals'],
  slug: '30-hours-free-childcare',
  nav: '30 hours free childcare',
  card: 'Who qualifies for the 30 hours in England, the earnings test and the deadline for each term.',
  title: '30 Hours Free Childcare 2026/27: Who Qualifies and Deadlines',
  description: `30 hours free childcare 2026/27 in England: children aged 9 months to 4, each parent earning ${g(C.minEarnQuarter21, 2)} over 3 months, income under ${g(C.incomeCap)}, term deadlines.`,
  h1: '30 hours of free childcare: who qualifies and when to apply',
  intro: 'The scheme is called Free Childcare for Working Parents, it runs in England only, and a missed deadline costs a whole term.',
  resume: `Working parents in England can get ${C.freeHoursWorking} hours of free childcare a week for ${C.weeksPerYear} weeks a year, ${freeYear.toLocaleString('en-GB')} hours in all, for a child aged ${C.freeHoursFromMonths} months to 4 years, through the government scheme officially called Free Childcare for Working Parents. Each parent in the household must expect to earn at least ${g(C.minEarnQuarter21, 2)} over the next three months if aged 21 or over, which is ${C.minEarnHours} hours a week at the National Living Wage, and neither can expect adjusted net income above ${g(C.incomeCap)} in the tax year. You can apply once your child is ${C.applyFromWeeks} weeks old, but the hours only start on 1 January, 1 April or 1 September after the child turns ${C.freeHoursFromMonths} months, and the application must be in by the end of the month before. Approval gives an ${C.codeDigits}-digit code for the nursery or childminder, and you must reconfirm it every ${C.reconfirmMonths} months. Scotland, Wales and Northern Ireland run their own, different schemes.`,
  faqs: [
    { q: 'What is the deadline to apply for 30 hours free childcare for a January start?', a: `31 December, for a child who turns ${C.freeHoursFromMonths} months between 1 September and 31 December. For an April start the deadline is 31 March, and for September it is 31 August. Applying earlier is safer: HMRC decides most applications at once but can take up to ${C.decisionDays} days when extra checks are needed, and the nursery needs your code before the term begins.` },
    { q: 'Do both parents have to work to get the 30 free hours?', a: `Usually yes: each partner living in the household must expect to earn at least the minimum for their age over the next three months. There are exceptions. A partner who is not working can still let the family qualify if they get Carer’s Allowance, the Universal Credit carer or limited capability for work element, contribution-based ESA, Incapacity Benefit, Severe Disablement Allowance or National Insurance credits.` },
    { q: 'Can I get 30 hours free childcare if I am on maternity leave?', a: `Yes, if you will return to work in time. Parents on maternity, paternity, adoption or shared parental leave can apply, and the start of the hours depends on the return date: returning between 1 October and 31 January gives hours from 1 January, as long as you apply between 1 September and 31 December. Paid annual leave taken before going back counts as having returned.` },
    { q: 'Can the nursery charge me extra on top of the 30 free hours?', a: `A provider can ask you to pay for extras such as meals, nappies, trips and any hours beyond the free ones, but the free hours themselves cost nothing. If you do not want to pay for the extras, the provider should offer another arrangement, such as bringing your own food or nappies. If it refuses, GOV.UK advises contacting your local council.` },
    { q: 'What happens if my earnings fall below the minimum after I get the code?', a: `You confirm your details every ${C.reconfirmMonths} months, and if you no longer meet the conditions at that point the code is not renewed and the free hours come to an end; ask the provider and the council when the place stops being funded. If a temporary drop in income is caused by irregular pay or a new self-employed business, you may be able to use your average expected earnings over the tax year instead.` },
  ],
  body: (h) => `
<h2>What the scheme gives, by age</h2>
<p>The working-parent entitlement is ${C.freeHoursWorking} hours a week for ${C.weeksPerYear} weeks of the year. Many nurseries let you spread the ${freeYear.toLocaleString('en-GB')} hours over more weeks, taking fewer hours each week across most of the year; ask your provider whether it offers this. The hours must be with a registered provider, such as a nursery, childminder, playgroup or nursery class at a school.</p>
${h.table(['Child’s age', 'Working parents (England)', 'Other routes'], [
  [`${C.freeHoursFromMonths} months to 2 years`, `${C.freeHoursWorking} hours a week`, 'No other free hours listed by GOV.UK'],
  ['2 years', `${C.freeHoursWorking} hours a week`, `${C.extraSupportHours2yo} hours a week if the family gets extra support, such as Universal Credit with household take-home pay of ${h.gbp(C.ucFreeChildcareIncomeLimit)} a year or less`],
  ['3 and 4 years', `${C.freeHoursWorking} hours a week`, `${C.freeHoursUniversal3to4} hours a week for every child, whatever the parents earn`],
], 'Free childcare in England by age, 38 weeks a year (GOV.UK, Free Childcare for Working Parents)', ['l', 'l', 'l'])}
<p>A two-year-old whose family gets extra support and also meets the working-parent test can combine the two routes: ${C.extraSupportHours2yo} hours through the council scheme and ${C.extraSupportHours2yo} through Free Childcare for Working Parents. Speak to the council’s early years team first in that case. Extra support also covers a child with an Education, Health and Care plan, one receiving ${h.a('dla-for-children', 'Disability Living Allowance')}, or one who has left care through adoption, special guardianship or a child arrangements order.</p>

<h2>The earnings test, parent by parent</h2>
<p>The test looks forward, at what each parent expects to earn before tax over the three months after applying. It is ${C.minEarnHours} hours a week at the minimum wage for the parent’s age, and each partner is judged on their own age, so a couple of 19 and 22 face two different figures.</p>
${h.table(['Parent’s age', 'Over the next 3 months', 'Weekly equivalent'], [
  ['21 or over', h.gbp(C.minEarnQuarter21, 2), h.gbp(C.minEarnWeekly21, 2)],
  ['18 to 20', h.gbp(C.minEarnQuarter18, 2), h.gbp(C.minEarnWeekly18, 2)],
  ['Under 18 or apprentice', h.gbp(C.minEarnQuarterUnder18, 2), h.gbp(C.minEarnWeeklyUnder18, 2)],
], 'Minimum expected earnings for the 30 hours, before tax (GOV.UK)', ['l', 'r', 'r'])}
<p>A parent aged 32 working 15 hours a week at the National Living Wage of ${h.gbp(nlw, 2)} an hour would expect ${h.gbp(exShort.expected3m, 2)} over three months, ${h.gbp(exShort.gap, 2)} short of the minimum; one extra hour a week closes the gap. People with irregular pay, and self-employed people with a slow quarter, may use the average they expect over the tax year instead: ${h.gbp(C.minEarnYear21, 2)} a year at 21 or over. If your business started less than 12 months ago, there is no minimum at all. Earnings from several jobs can be added together, but dividends, interest, rental income and pensions do not count. Company directors may be asked for payslips, bank statements or an accountant’s letter each time they reconfirm.</p>
<p>The upper limit is ${h.gbp(C.incomeCap)} of adjusted net income for each parent, including foreign income. It is the same income measure used by the ${h.a('high-income-child-benefit-charge', 'High Income Child Benefit Charge')}, so pension contributions bring it down. One parent above it makes the whole household ineligible.</p>

<h2>When to apply: the term-by-term calendar</h2>
<p>You can apply from the time your child is ${C.applyFromWeeks} weeks old. The hours start at the beginning of the term after your child turns ${C.freeHoursFromMonths} months, and ${h.src('govFreeChildcareWhen', 'GOV.UK sets three deadlines')}.</p>
${h.table([`Child turns ${C.freeHoursFromMonths} months`, 'Hours start', 'Apply by'], [
  ['1 September to 31 December', '1 January', '31 December'],
  ['1 January to 31 March', '1 April', '31 March'],
  ['1 April to 31 August', '1 September', '31 August'],
], 'Free Childcare for Working Parents: start dates and deadlines', ['l', 'l', 'l'])}
<p>A baby born on 10 March turns ${C.freeHoursFromMonths} months on 10 December and can have hours from 1 January if the parents apply by 31 December. Leave it until January and the hours start on 1 April instead, three months of nursery fees later. For parents returning from leave or starting a new job, the date of return decides the term: back between 1 May and 30 September gives hours from 1 September with an application made between 1 April and 31 August.</p>
<p>If you apply more than ${C.reconfirmMonths} months before the hours start, you will need to reconfirm before the code can be used. Give the code to the provider with your National Insurance number and your child’s date of birth.</p>

<h2>Applying, and what you get with it</h2>
<p>The application is made once, online, and takes around 20 minutes. You need both partners’ National Insurance numbers, a Unique Taxpayer Reference if self-employed, your child’s birth certificate reference and your work start date. A partner who lives elsewhere for more than six months, or is in prison, is left out of the test. Separated parents decide which of them applies; if they cannot agree, HMRC chooses. Foster carers cannot use the online service and apply through their social worker and local authority.</p>
<p>The same application checks you for ${h.a('tax-free-childcare-calculator', 'Tax-Free Childcare')}, which adds ${h.gbp(8 * C.tfcTopUpRate)} for every ${h.gbp(8)} you pay towards hours and extras the free entitlement does not cover. Families on Universal Credit choose between Tax-Free Childcare and ${h.a('universal-credit-childcare-costs', 'the Universal Credit childcare element')}, which repays ${Math.round(P.uc.childcareShare * 100)}% of costs; they can keep the free hours either way.</p>

<h2>Scotland, Wales and Northern Ireland</h2>
<p>The 30-hour working-parent scheme is England’s alone. In Scotland, all 3 and 4-year-olds and eligible 2-year-olds can get up to ${P.schoolMeals.scotElcHours.toLocaleString('en-GB')} hours a year of funded early learning and childcare without any earnings test, with a free meal on the days they attend, as ${h.src('scotSchoolMeals', 'mygov.scot explains')}; the ${h.a('benefits-in-scotland', 'guide to benefits in Scotland')} covers the rest of the Scottish system. Wales and Northern Ireland run separate schemes with their own rules, which GOV.UK points to rather than describing, so check the Welsh Government or nidirect before relying on any figure.</p>
`,
});
