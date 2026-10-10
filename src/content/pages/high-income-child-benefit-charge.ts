import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { childBenefitYear, hicbc } from '../../lib/engine/family';
import { formatMoney } from '../../lib/format';

const CB = P.childBenefit;
const g = (n: number, d = 0) => formatMoney(n, d);
const two = childBenefitYear(2);
const at = (inc: number, kids = 2) => hicbc(inc, childBenefitYear(kids));
// Example household: two children, higher earner on £71,000.
const exInc = 71000;
const ex = at(exInc);
const exAfter = at(exInc - 5000);

export default definePage({
  id: 'high-income-child-benefit-charge',
  group: 'family',
  order: 30,
  mini: 'hicbcCharge',
  miniHref: 'child-benefit-calculator',
  related: ['child-benefit-calculator', 'child-benefit-rates', 'tax-free-childcare-calculator', '30-hours-free-childcare', 'guardians-allowance'],
  sources: ['govHicbc', 'govHicbcSa', 'govHicbcOptOut', 'hmrcCbRates', 'govCb'],
  slug: 'high-income-child-benefit-charge',
  nav: 'Child Benefit tax charge',
  card: 'How the charge works between £60,000 and £80,000, and the legal ways to reduce it.',
  title: 'High Income Child Benefit Charge 2026/27: £60,000 to £80,000',
  description: `High Income Child Benefit Charge 2026/27: 1% of Child Benefit for every £${CB.hicbcPerPct} of adjusted net income over ${g(CB.hicbcThreshold)}, plus opting out, pensions and Gift Aid.`,
  h1: 'High Income Child Benefit Charge: who pays, how much, and how to cut it',
  intro: 'A tax on the higher earner, not on the parent who receives the money, and one that a pension contribution can shrink.',
  resume: `The High Income Child Benefit Charge claws back Child Benefit from households where one person has adjusted net income above ${g(CB.hicbcThreshold)} in the tax year. For 2026/27 it takes 1% of the year’s Child Benefit for every ${g(CB.hicbcPerPct)} of income over that line, so the whole benefit is repaid once income reaches ${g(CB.hicbcUpper)}. With two children, Child Benefit is worth ${g(two, 2)} a year, so a higher earner on ${g(70000)} repays half, about ${g(at(70000).charge)}. The charge is paid by whichever partner has the higher income, even if the other partner receives the payments, and couples’ incomes are never added together. Adjusted net income is total taxable income, savings interest and dividends included, minus pension contributions and Gift Aid donations, which makes a pension payment the usual way to bring it down. You settle it through your PAYE tax code or a Self Assessment return, or you can opt out of the payments and keep the National Insurance credits.`,
  faqs: [
    { q: 'Does the High Income Child Benefit Charge use household income?', a: `No. Each partner’s adjusted net income is looked at separately, and the charge falls only on the one with the higher figure, provided it is above ${g(CB.hicbcThreshold)}. A couple earning ${g(55000)} each pays nothing, while a single earner on ${g(CB.hicbcUpper)} repays everything. ‘Partner’ means a spouse, civil partner or someone you live with as a couple.` },
    { q: 'Can paying more into my pension stop the Child Benefit charge?', a: `Yes, because pension contributions reduce adjusted net income. A salary sacrifice cuts the salary itself; a personal pension contribution counts at its gross amount, including the basic rate relief the provider claims. Bringing income from ${g(CB.hicbcThreshold + 5000)} down to ${g(CB.hicbcThreshold)} removes the charge and also saves income tax on the same slice.` },
    { q: 'What happens if I never told HMRC about the Child Benefit charge?', a: `You should register for Self Assessment by ${CB.hicbcSaRegisterBy} after the end of the tax year in which you owed the charge, and declare the Child Benefit on the return. HMRC may charge a penalty if you needed to pay through Self Assessment and did not register or declare it. You can pay through PAYE only up to ${CB.hicbcPayeDeadline} after the tax year concerned.` },
    { q: 'Can I find out if my ex-partner earns more and should pay the charge?', a: `Yes. If you lived together or separated during the tax year in question, you can write to HMRC, Pay As You Earn and Self Assessment, BX9 1AS, with your details and adjusted net income. HMRC answers only ‘yes’ or ‘no’ to whether your partner received Child Benefit or had the higher income. It will not disclose their figures or National Insurance number.` },
    { q: 'If I opt out of Child Benefit payments, can I restart them later?', a: `Yes, at any time, online, with the form or by phone, as long as you still qualify. It can take up to ${CB.restartDays} days for the first payment to arrive, and the charge applies again from the restart date if your adjusted net income is over ${g(CB.hicbcThreshold)}. You still owe the charge for any period when payments were made before opting out.` },
  ],
  body: (h) => `
<h2>How the charge is calculated</h2>
<p>Take the higher earner’s adjusted net income for the tax year from 6 April 2026 to 5 April 2027. Subtract ${h.gbp(CB.hicbcThreshold)}, divide what is left by ${h.gbp(CB.hicbcPerPct)} and ignore any fraction: that is the percentage of the year’s Child Benefit you repay, capped at 100%. The charge is then rounded down to the pound. The table runs the rule for one, two and three children at the rates paid this year.</p>
${h.table(['Adjusted net income', 'Share repaid', '1 child', '2 children', '3 children'], [62000, 65000, 68000, 70000, 72000, 75000, 78000, 80000].map((inc) => [h.gbp(inc), `${at(inc).pct}%`, h.gbp(at(inc, 1).charge), h.gbp(at(inc, 2).charge), h.gbp(at(inc, 3).charge)]), 'High Income Child Benefit Charge in 2026/27, by income and number of children (Child Benefit over 52 weeks, HMRC rates)', ['l', 'r', 'r', 'r', 'r'])}
<p>Between ${h.gbp(CB.hicbcThreshold)} and ${h.gbp(CB.hicbcUpper)} the charge behaves like an extra tax on each pound earned. With three children, every ${h.gbp(CB.hicbcPerPct)} of extra income removes about ${h.gbp(childBenefitYear(3) / 100, 2)} of Child Benefit, on top of income tax and National Insurance. That is why the band attracts so much planning. Until 5 April 2024 the charge started at ${h.gbp(CB.hicbcThresholdPre2024)} and took 1% for every ${h.gbp(CB.hicbcPerPctPre2024)}, so a late return for 2023/24 or earlier still uses those older figures.</p>

<h2>What counts as adjusted net income</h2>
<p>Start with all taxable income for the year: salary and bonuses, taxable benefits in kind such as a company car, self-employed profits, rental profits, pensions in payment, savings interest and dividends. Then take off the gross amount of pension contributions that were not already deducted before tax, and the grossed-up value of Gift Aid donations. Personal allowances are not deducted. What remains is the figure ${h.src('govHicbc', 'HMRC uses for the charge')}.</p>
<p>Some income is left out altogether because it is not taxable. Child Benefit itself, ${h.a('guardians-allowance', 'Guardian’s Allowance')}, PIP and Tax-Free Childcare top-ups do not add to adjusted net income. ISA interest is tax-free and does not count either, whereas interest on an ordinary savings account does, even when it falls within the personal savings allowance.</p>

<h2>Three ways to reduce or avoid it</h2>
<h3>Pension contributions</h3>
<p>Take a parent on ${h.gbp(exInc)} with two children. The charge is ${ex.pct}% of ${h.gbp(two, 2)}, which is ${h.gbp(ex.charge)}. A further ${h.gbp(5000)} gross into a pension takes income to ${h.gbp(exInc - 5000)} and the charge to ${h.gbp(exAfter.charge)}. Part of the money that went into the pension comes straight back as Child Benefit kept, the rest as income tax relief. Salary sacrifice, where the employer offers it, saves National Insurance as well.</p>
<h3>Gift Aid</h3>
<p>Charity donations made with Gift Aid are deducted at their grossed-up value, so someone just over the threshold who already gives to charity can bring the gift forward or increase it before 5 April. The higher-rate relief is claimed on the Self Assessment return.</p>
<h3>Changing who earns what</h3>
<p>Where one partner earns well above ${h.gbp(CB.hicbcUpper)} and the other little, nothing short of a large pension payment changes the outcome. Where both partners work in a family business, the split of profits or dividends decides whose income crosses the line, and so who pays. The rule is applied to each partner in turn, and only the higher figure matters.</p>

<h2>Paying it: PAYE or Self Assessment</h2>
<p>Employees and pensioners who have no other reason to file a tax return can pay through their tax code. You register online with your adjusted net income, and HMRC sends a new code to your employer or pension provider so the charge is collected month by month. This route is open only for the current or previous tax year and only up to ${CB.hicbcPayeDeadline} after the end of the year you are paying for.</p>
<p>You must use Self Assessment if you already file a return, for example because you are self-employed, have rental income or untaxed savings interest, or if that ${CB.hicbcPayeDeadline} date has passed. Someone who has never filed has to register by ${CB.hicbcSaRegisterBy} after the end of the tax year: for 2026/27 that means by ${CB.hicbcSaRegisterBy} 2027, with the return and payment due by ${CB.hicbcPayeDeadline} 2028. The ${h.src('govHicbcSa', 'Self Assessment page for the charge')} has the steps. Leaving it undeclared can bring a penalty on top of the charge.</p>

<h2>Opting out without losing the claim</h2>
<p>If your income will clearly be above ${h.gbp(CB.hicbcUpper)}, receiving Child Benefit and repaying it all is pointless paperwork. You can claim and tick the box not to be paid, or ${h.src('govHicbcOptOut', 'opt out of payments')} on an existing claim. The claim stays live. That matters more than it looks: the parent named on it gets National Insurance credits towards the State Pension while a child is under ${CB.niCreditChildUnder}, which protects anyone who stops work or earns too little to pay contributions, and the child receives a National Insurance number before turning 16 without applying.</p>
<p>Opting out is not available while Child Benefit is being used to repay an overpayment. Payments already received before the opt-out still count for the charge, and you must keep reporting changes such as a child leaving education.</p>

<h2>When partners move in together or separate</h2>
<p>The charge follows the household week by week. It applies from the date you start living with someone whose household receives Child Benefit, until you separate permanently or the payments stop; a hospital stay or working away does not count as separation. A new partner on ${h.gbp(75000)} moving in halfway through the year owes the charge on the Child Benefit paid after that date, not for the whole year. If you pay through PAYE and the relationship ends, tell HMRC so your tax code is corrected.</p>
<p>To see what your own household keeps once the charge is taken off, use the ${h.a('child-benefit-calculator', 'Child Benefit calculator')}; the current weekly amounts and their history are on ${h.a('child-benefit-rates', 'the rates page')}. If you also pay for childcare, the ${h.a('tax-free-childcare-calculator', 'Tax-Free Childcare')} limit of ${h.gbp(P.childcare.incomeCap)} uses the same adjusted net income figure.</p>
`,
});
