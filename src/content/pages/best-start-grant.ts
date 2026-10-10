import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { bsgPregnancy, bestStartGrantTotal, bestStartFoods } from '../../lib/engine/family-grants';
import { formatMoney } from '../../lib/format';

const SC = P.scotland;
const g = (n: number, d = 2) => formatMoney(n, d);
const first = bestStartGrantTotal(1, false);
const W = SC.bsgSchoolAgeWindow;
const W2 = SC.bsgSchoolAgeWindowNext;

export default definePage({
  id: 'best-start-grant',
  group: 'nations',
  order: 40,
  mini: 'bsgGrant',
  miniHref: 'scottish-child-payment',
  related: ['scottish-child-payment', 'sure-start-maternity-grant', 'benefits-in-scotland', 'free-school-meals', 'maternity-allowance'],
  sources: ['scotBsg', 'scotBsgWho', 'scotBsgAuto', 'scotUprating'],
  slug: 'best-start-grant',
  nav: 'Best Start Grant',
  card: 'Scotland’s three payments from pregnancy to school, and Best Start Foods.',
  title: 'Best Start Grant 2026/27: Three Payments and When to Apply',
  description: `Best Start Grant 2026/27 in Scotland: Pregnancy and Baby Payment ${g(SC.bsgPregnancyFirst)}, Early Learning and School Age Payments ${g(SC.bsgSchoolAge)}, plus Best Start Foods rates.`,
  h1: 'Best Start Grant and Best Start Foods: amounts and application windows',
  intro: 'Three one-off payments and a food card from Social Security Scotland for families on low-income benefits.',
  resume: `Best Start Grant is Social Security Scotland’s set of three one-off payments for families on low-income benefits. In 2026/27 the Pregnancy and Baby Payment is ${g(SC.bsgPregnancyFirst)} for a first child and ${g(SC.bsgPregnancySubsequent)} for each later child, the Early Learning Payment is ${g(SC.bsgEarlyLearning)} when a child is between 2 and 3½, and the School Age Payment is ${g(SC.bsgSchoolAge)} in the year a child is first old enough for primary school, up from ${g(SC.bsgPrev.pregnancyFirst)}, ${g(SC.bsgPrev.earlyLearning)} and ${g(SC.bsgPrev.schoolAge)} under the 2026-27 up-rating. A first child can therefore bring ${g(first.total)} across the three. Alongside it, Best Start Foods loads a prepaid card every four weeks: ${g(SC.bsfLowerWeekly * 4)} in pregnancy, ${g(SC.bsfHigherWeekly * 4)} for each baby under one and ${g(SC.bsfLowerWeekly * 4)} for each child aged one to three. You qualify if you live in Scotland, look after the child and you or your partner get Universal Credit, Housing Benefit, Pension Credit, Income Support, income-based JSA or income-related ESA. Each payment has its own application window, so the dates matter as much as the amounts.`,
  faqs: [
    { q: 'When can I apply for the Best Start Grant Pregnancy and Baby Payment?', a: `From the end of the ${SC.bsgPregnancyFromWeek}th week of pregnancy until the day your baby is ${SC.bsgPregnancyToMonths} months old. If the baby is born before 24 weeks, the window opens on the birth date. If you took over looking after a child, for example through adoption or kinship care, you can apply up to the day before the child’s first birthday. Payments for a stillborn baby are allowed up to ${SC.bsgPregnancyToMonths} months after the birth.` },
    { q: 'Do I need to apply for the Early Learning and School Age Payments?', a: `Not if you already get Scottish Child Payment for the child. Social Security Scotland checks those families automatically when the child reaches the right age, sends a text or email, and pays into the bank with the reference ‘SSS BSG’. Families without Scottish Child Payment must apply within each window. You can opt out of automatic payments by phone or webchat.` },
    { q: 'Can I get the Best Start Grant if I am 17 and not on benefits?', a: `Yes. If you are under 18 you do not need any benefit to get Best Start Grant or Best Start Foods. For the Early Learning and School Age Payments you must apply yourself; for the Pregnancy and Baby Payment and Best Start Foods, a parent or carer who gets Child Benefit or Universal Credit for you can apply on your behalf by phone or paper form.` },
    { q: 'Can I get both the Sure Start Maternity Grant and the Pregnancy and Baby Payment?', a: `No, not for the same baby. The Sure Start Maternity Grant of ${g(P.maternity.ssmg, 0)} is for England, Wales and Northern Ireland, and the Pregnancy and Baby Payment replaces it in Scotland. If you received the Sure Start grant before moving to Scotland, the Scottish payment is not available for that baby. Later children in Scotland can still get the ${g(SC.bsgPregnancySubsequent)} payment.` },
  ],
  body: (h) => `
<h2>The three payments at a glance</h2>
${h.table(['Payment', '2026/27 amount', 'When to apply'], [
  ['Pregnancy and Baby Payment', `${h.gbp(SC.bsgPregnancyFirst, 2)} first child; ${h.gbp(SC.bsgPregnancySubsequent, 2)} later children`, `End of week ${SC.bsgPregnancyFromWeek} of pregnancy until the baby is ${SC.bsgPregnancyToMonths} months old`],
  ['Early Learning Payment', h.gbp(SC.bsgEarlyLearning, 2), 'From age 2 until 3 years and 6 months'],
  ['School Age Payment', h.gbp(SC.bsgSchoolAge, 2), 'In the year the child is first old enough to start primary school'],
], 'Best Start Grant from April 2026 (Scottish Government up-rating 2026-27; mygov.scot)', ['l', 'l', 'l'])}
<p>The money can be spent on anything: a pram, cot and clothes for the first payment, toys or trips for the second, school shoes and stationery for the third. A child does not have to attend nursery for the Early Learning Payment, or take up a school place for the School Age Payment. The School Age Payment is separate from the council’s School Clothing Grant, and a family can get both.</p>

<h2>Pregnancy and Baby Payment: first child, later children, twins</h2>
<p>Your first child means your oldest child under 16, including a stepchild or a child you have taken on through adoption or kinship care. If there is none, the payment is ${h.gbp(SC.bsgPregnancyFirst, 2)}; for the second, third and later children it is ${h.gbp(SC.bsgPregnancySubsequent, 2)}. Unlike the Sure Start grant south of the border, later children are still paid.</p>
${h.table(['Babies', 'No other child under 16', 'Other children under 16'], [
  ['One', h.gbp(bsgPregnancy(1, false), 2), h.gbp(bsgPregnancy(1, true), 2)],
  ['Twins', h.gbp(bsgPregnancy(2, false), 2), h.gbp(bsgPregnancy(2, true), 2)],
  ['Triplets', h.gbp(bsgPregnancy(3, false), 2), h.gbp(bsgPregnancy(3, true), 2)],
], 'Pregnancy and Baby Payment for multiple births, including the multiple-birth supplement (mygov.scot)', ['l', 'r', 'r'])}
<p>The higher amount can also be paid for a child who is not your first when, for example, you became responsible for your other children after they were 12 months old without giving birth to them, you left home with your children because of domestic abuse, or you are a refugee, resettled or evacuated to the UK and your older children were born before you arrived. ${h.src('scotBsg', 'mygov.scot lists every case')}; if yours is not on the form, tick ‘Not sure’. You cannot get this payment if you have already received the ${h.a('sure-start-maternity-grant', 'Sure Start Maternity Grant')} for the same baby.</p>

<h2>School Age Payment windows</h2>
<p>The School Age Payment follows the Scottish school intake, which runs from March to February births. You apply in the window for your child’s birth dates, even if you are deferring the start of school or your child will not attend school at all.</p>
${h.table(['Child born between', 'Apply between'], [
  [`${h.date(W.bornFrom)} and ${h.date(W.bornTo)}`, `${h.date(W.applyFrom)} and ${h.date(W.applyTo)}`],
  [`${h.date(W2.bornFrom)} and ${h.date(W2.bornTo)}`, `${h.date(W2.applyFrom)} and ${h.date(W2.applyTo)}`],
], 'School Age Payment application windows (mygov.scot, updated 10 August 2026)', ['l', 'l'])}
<p>The window for children born between March 2020 and February 2021 has closed, and late applications for it are not accepted. A child born in October 2021 is in the current window: apply by ${h.date(W.applyTo)}, unless Scottish Child Payment already triggers the automatic payment.</p>

<h2>Best Start Foods</h2>
<p>Best Start Foods is a prepaid card for healthy food such as milk, fruit and vegetables, topped up every four weeks while you are pregnant and until your child turns 3. The weekly rates for 2026/27 are ${h.gbp(SC.bsfLowerWeekly, 2)} during pregnancy, whatever the number of babies, ${h.gbp(SC.bsfHigherWeekly, 2)} for each child under one and ${h.gbp(SC.bsfLowerWeekly, 2)} for each child from one to three, up from ${h.gbp(SC.bsfHigherWeeklyPrev, 2)} and ${h.gbp(SC.bsfLowerWeeklyPrev, 2)}. A baby born early keeps the higher amount until a year after the due date. Families with no recourse to public funds may still get Best Start Foods for the child.</p>
<!--mini:bsFoods-->
<p>A family with a baby of five months and a toddler of two receives ${h.gbp(bestStartFoods(false, 1, 1).fourWeekly, 2)} on the card every four weeks, about ${h.gbp(bestStartFoods(false, 1, 1).year)} a year. You can apply as soon as you know you are pregnant, on the same form as the grant, and the card can be used in shops and online.</p>

<h2>Who can get it</h2>
<p>${h.src('scotBsgWho', 'You or your partner must')} live in Scotland, be pregnant or look after a child of the right age as the main carer, and normally get one of these: Universal Credit, Housing Benefit, Income Support, Pension Credit, income-based Jobseeker’s Allowance or income-related Employment and Support Allowance. Housing Benefit is on the list, which is not the case for ${h.a('scottish-child-payment', 'Scottish Child Payment')}. Child Benefit alone does not qualify. If you have applied for one of these benefits and are waiting, you can apply now.</p>
<p>Young parents have their own route. Under 18, no benefit is needed at all. At 18 or 19, you can still qualify if your parent or carer gets Child Benefit, Universal Credit child payments or the child addition in Pension Credit for you; that application has to be made by phone or on paper. The main carer can be a parent, grandparent, legal guardian or kinship carer, shown by the child being named on a Child Benefit, Universal Credit or Pension Credit claim, or by a legal order.</p>

<h2>Applying</h2>
<p>One form covers all three grant payments, Best Start Foods and Scottish Child Payment, and you receive a separate decision letter for each. Apply online in 10 to 20 minutes, by phone on 0800 182 2222 or by post; you need your National Insurance number if you have one, your bank details, your partner’s name and date of birth, and details of the children you look after. Do not send a second application for the same child while the first is pending, as that slows the decision. Families moving to Scotland from elsewhere in the UK should compare with the ${h.a('benefits-in-scotland', 'guide to benefits in Scotland')}, and remember that a pregnant woman who stops work may also be due ${h.a('maternity-allowance', 'Maternity Allowance')}.</p>
`,
});
