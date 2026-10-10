import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { caAndUc } from '../../lib/engine/carers-extra';
import { formatMoney, formatPercent } from '../../lib/format';

const CA = P.carers;
const U = P.uc;
const g = (n: number, d = 2) => formatMoney(n, d);
// Couple aged 25+, no children, social rent £650; the carer has no earnings, the partner's take-home pay varies.
const RENT = 650;
const rows = [0, 1500, 2300, 2800].map((e) => ({ e, r: caAndUc({ couple: true, age: 41, earningsMonthly: e, rent: RENT }) }));
const caM = rows[0].r.caMonthly;
const mid = rows[2].r;

export default definePage({
  id: 'carers-allowance-and-universal-credit',
  group: 'carers',
  order: 40,
  mini: 'caUniversalCredit',
  miniHref: 'universal-credit-calculator',
  related: ['universal-credit-carer-element', 'carers-allowance', 'universal-credit-calculator', 'carers-allowance-calculator', 'universal-credit-work-allowance'],
  sources: ['govCaEffect', 'govUc', 'ucRegs30', 'dwpRates', 'scotCspEffect'],
  slug: 'carers-allowance-and-universal-credit',
  nav: 'Carer’s Allowance and Universal Credit',
  card: 'Carer’s Allowance comes off Universal Credit in full, the carer element stays: when the pair leaves you better off.',
  title: 'Carer’s Allowance and Universal Credit 2026/27: Net Effect',
  description: `Carer’s Allowance and Universal Credit 2026/27: ${g(CA.allowance)} a week comes off UC in full, the ${g(U.carer)} carer element stays. Here is when claiming both pays off.`,
  h1: 'Carer’s Allowance and Universal Credit: what you really gain by claiming both',
  intro: 'Two rules decide the outcome: a full deduction, and a carer element that does not depend on Carer’s Allowance.',
  resume: `When you get Carer’s Allowance and Universal Credit together, the allowance is treated as unearned income and taken off Universal Credit pound for pound. At ${g(CA.allowance)} a week that is about ${g(caM)} a month in 2026/27. The carer element of ${g(U.carer)} a month stays in the Universal Credit award either way: it depends on caring at least ${CA.hoursPerWeek} hours a week for someone on a qualifying benefit, not on claiming Carer’s Allowance, and it is paid even if your earnings are too high for the allowance. So for most carers on a full Universal Credit award, claiming Carer’s Allowance changes how the money arrives, not how much. The household gains only when Universal Credit is smaller than the allowance, typically because a partner works. The allowance still brings Class 1 National Insurance credits, a weekly or four-weekly payment that does not depend on household income, and an exemption from the benefit cap. The person you care for may lose a severe disability premium when you claim.`,
  faqs: [
    { q: 'Why did my Universal Credit drop as soon as my Carer’s Allowance was awarded?', a: `Because Carer’s Allowance is deducted from Universal Credit in full. ${g(CA.allowance)} a week is counted as about ${g(caM)} a month of unearned income. GOV.UK says your total benefit usually goes up or stays the same: the drop in Universal Credit matches the allowance, unless your Universal Credit was smaller than it to begin with, in which case you gain.` },
    { q: 'Can I get the Universal Credit carer element if I earn too much for Carer’s Allowance?', a: `Yes. Regulation 30 of the Universal Credit Regulations treats you as having caring responsibilities if you meet the Carer’s Allowance conditions, or would meet them but for earnings above the ${g(CA.earningsLimit, 0)} limit, whether or not you claim it. Your wages then reduce Universal Credit through the ${formatPercent(U.taper, 0)} taper as usual.` },
    { q: 'Is it worth claiming Carer’s Allowance if it only replaces part of my Universal Credit?', a: `Usually yes. Carer’s Allowance brings Class 1 National Insurance credits, which count for the State Pension and other contributory benefits; Universal Credit alone gives Class 3 credits, which count for the State Pension only. It also keeps paying if a pay rise or a partner’s new job ends your Universal Credit, since it ignores household income.` },
    { q: 'My partner and I both care for our son: do we get two carer elements?', a: `No. GOV.UK says a couple who both care for the same person get only one carer element. Only one of you can get Carer’s Allowance for him either. If you also care for different people, for example one of you for your son and the other for a parent, each caring role can count separately for Carer’s Allowance.` },
    { q: 'Does Carer’s Allowance use up my Universal Credit work allowance?', a: `No. The work allowance and the ${formatPercent(U.taper, 0)} taper apply to earnings only. Carer’s Allowance is unearned income and comes off in full, from the first pound. The carer element does not give you a work allowance by itself: that needs a child in the household or a health condition that limits your work.` },
  ],
  body: (h) => `
<h2>The two rules</h2>
<p>${h.src('govCaEffect', 'GOV.UK’s Carer’s Allowance guide')} states the first: your Universal Credit payment will be reduced by an amount equal to your Carer’s Allowance. The second is in ${h.src('ucRegs30', 'regulation 30 of the Universal Credit Regulations')}: the carer element is added if you meet the Carer’s Allowance conditions, or would but for your earnings, whether or not you have claimed the allowance. ${h.src('govUc', 'GOV.UK’s Universal Credit guide')} confirms the carer element is ${h.gbp(U.carer, 2)} a month and that you may also be eligible for Carer’s Allowance on top. Put together, the allowance replaces part of the Universal Credit award; it does not replace the carer element.</p>

<h2>When claiming both leaves you better off</h2>
<p>Universal Credit can only fall to nil. If the allowance is larger than the Universal Credit you would get without it, the excess is a real gain. That happens most often in couples where one partner works. The table follows a couple in their forties, renting from a housing association for ${h.gbp(RENT)} a month, with no children. One partner cares full time for her father; the other’s take-home pay changes from row to row.</p>
${h.table(['Partner’s take-home pay', 'UC without CA', 'UC with CA', 'Total with CA', 'Gain a month'], rows.map(({ e, r }) => [h.gbp(e), h.gbp(r.ucWithout, 2), h.gbp(r.ucWith, 2), h.gbp(r.totalWith, 2), h.gbp(r.gain, 2)]), 'Couple aged 25 or over, carer element included, Carer’s Allowance of ' + h.gbp(caM, 2) + ' a month (rates 2026/27)', ['l', 'r', 'r', 'r', 'r'])}
<p>With no earnings or modest earnings, the allowance simply swaps with Universal Credit. At ${h.gbp(2300)} a month the couple’s Universal Credit without the allowance is only ${h.gbp(mid.ucWithout, 2)}, so the allowance lifts their income by ${h.gbp(mid.gain, 2)} a month. At ${h.gbp(2800)} Universal Credit has already gone, and the whole ${h.gbp(caM, 2)} is extra. Because the carer has no earnings of her own, the ${h.gbp(CA.earningsLimit)} weekly test is no obstacle: Carer’s Allowance looks at the carer’s own earnings, never the partner’s.</p>

<h2>Why claim when the cash is the same</h2>
<p>For a carer whose Universal Credit is larger than the allowance, the total does not change, but other things do.</p>
<ul>
<li><strong>National Insurance.</strong> Carer’s Allowance gives Class 1 credits, which count towards the State Pension and help with contributory benefits such as New Style ESA. Universal Credit gives Class 3 credits, which count for the State Pension only.</li>
<li><strong>Independence from household income.</strong> If a partner moves in, gets a pay rise or finds work, Universal Credit can stop overnight; Carer’s Allowance carries on.</li>
<li><strong>Rhythm.</strong> The allowance is paid weekly in advance or every four weeks, which some carers find easier than one monthly payment.</li>
<li><strong>Benefit cap.</strong> Anyone getting Carer’s Allowance is outside the cap, though the carer element in Universal Credit already exempts the household.</li>
</ul>

<h2>Two earnings tests, side by side</h2>
<p>The two benefits look at work very differently. Carer’s Allowance has a weekly cliff edge of ${h.gbp(CA.earningsLimit)} on your own earnings after tax, National Insurance and allowable expenses. Universal Credit looks at the whole household’s monthly take-home pay and takes ${h.pct(U.taper, 0)} of it away, after a work allowance of ${h.gbp(U.workAllowanceLower)} or ${h.gbp(U.workAllowanceHigher)} only if the household has a child or someone with limited capability for work. A carer taking home ${h.gbp(1000)} a month, about ${h.gbp(1000 * 12 / 52)} a week, with no expenses to deduct, fails the Carer’s Allowance test but keeps the carer element in Universal Credit. ${h.a('universal-credit-work-allowance', 'The work allowance page')} explains who gets one.</p>

<h2>When the health element gets in the way</h2>
<p>A claimant whose Universal Credit includes the health element for limited capability for work and work-related activity cannot also have the carer element. If that claimant still meets the caring conditions and claims Carer’s Allowance, the allowance is deducted in full with no carer element to offset, so the household only gains if Universal Credit was already small. For couples, the carer element can sometimes go to the other partner instead; ${h.a('universal-credit-carer-element', 'the carer element guide')} covers that case.</p>

<h2>The person you care for</h2>
<p>GOV.UK’s Universal Credit guide says that if the person you care for gets the severe disability premium, it will stop when you claim the carer element. Carer’s Allowance has the same effect, and also usually ends the severe disability amount in their Pension Credit. Check what they stand to lose before claiming.</p>

<h2>Reporting, and the Scottish version</h2>
<p>Report the Carer’s Allowance award in your Universal Credit journal as soon as the decision arrives. A backdated award creates arrears of allowance and, until Universal Credit catches up, an overpayment of Universal Credit that the DWP will recover. ${h.src('scotCspEffect', 'Mygov.scot warns')} of the same effect with Carer Support Payment in Scotland, which is also counted as income for Universal Credit; its Scottish Carer Supplement and Carer Additional Person Payment are not. ${h.a('carers-allowance', 'The Carer’s Allowance guide')} covers the other conditions.</p>
`,
});
