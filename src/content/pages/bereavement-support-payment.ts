import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { bereavementSupport } from '../../lib/engine/family-grants';
import { formatMoney, displayDate } from '../../lib/format';

const B = P.bereavement;
const g = (n: number, d = 0) => formatMoney(n, d);
const hiMax = B.higherLump + B.months * B.higherMonthly;
const loMax = B.standardLump + B.months * B.standardMonthly;
const late = (m: number, hi = true) => bereavementSupport(hi, m);
const h_year = (iso: string) => iso.slice(0, 4);
const h_date = (iso: string) => displayDate(iso, 'en-GB');

export default definePage({
  id: 'bereavement-support-payment',
  group: 'family',
  order: 100,
  mini: 'bspPayment',
  miniHref: 'benefits-calculator',
  related: ['guardians-allowance', 'child-benefit-rates', 'universal-credit-calculator', 'benefits-calculator', 'state-pension-amount'],
  sources: ['govBereavement', 'govBereavementWhat', 'govBereavementElig', 'dwpRates', 'cpRegs19'],
  slug: 'bereavement-support-payment',
  nav: 'Bereavement Support Payment',
  card: 'The lump sum and 18 monthly payments after a partner’s death, and the deadline that cuts them.',
  title: 'Bereavement Support Payment 2026/27: Rates and Time Limits',
  description: `Bereavement Support Payment 2026/27: higher rate ${g(B.higherLump)} plus ${B.months} monthly payments of ${g(B.higherMonthly)}, standard ${g(B.standardLump)} plus ${g(B.standardMonthly)} a month. Claim within ${B.fullClaimMonths} months for it all.`,
  h1: 'Bereavement Support Payment: what you get after a partner dies',
  intro: 'A lump sum and 18 monthly payments for a widowed partner under State Pension age, whatever their income, if the claim is made in time.',
  resume: `Bereavement Support Payment is paid by the DWP to someone whose husband, wife, civil partner or cohabiting partner has died, if they were under State Pension age at the time. The higher rate, for a parent getting Child Benefit or a woman who was pregnant, is a one-off ${g(B.higherLump)} followed by ${B.months} monthly payments of ${g(B.higherMonthly)}, ${g(hiMax)} in all. The standard rate is ${g(B.standardLump)} plus ${B.months} payments of ${g(B.standardMonthly)}, ${g(loMax)} in all. The rates were not raised in April 2026. It is not means-tested, so earnings and savings make no difference, and the partner who died must have paid National Insurance contributions in any one tax year since ${h_year(B.niSince)} or have died from an accident at work or industrial disease. Timing is critical: the full amount needs a claim within ${B.fullClaimMonths} months of the death, the lump sum is lost after ${B.lumpSumClaimMonths} months and nothing is paid after ${B.maxClaimMonths} months. For a year after the first payment it does not affect other benefits.`,
  faqs: [
    { q: 'Can I get Bereavement Support Payment if we were not married?', a: `Yes, if you lived together as if you were married. Unless the claim is for a backdated payment, cohabiting partners must have been getting Child Benefit for a child living with them, been entitled to it, or been pregnant when the partner died. They then receive the higher rate of ${g(B.higherLump)} plus ${B.months} payments of ${g(B.higherMonthly)}.` },
    { q: 'How much Bereavement Support Payment do I lose by claiming six months after the death?', a: `On our reading of the claim rules, monthly payments can be backdated by only ${B.fullClaimMonths} months, so a claim six months after the death keeps the lump sum but loses about three monthly payments: ${g(late(6).total)} instead of ${g(hiMax)} at the higher rate, a loss of ${g(hiMax - late(6).total)}. The Bereavement Service confirms the exact figure. Claim even while still gathering paperwork.` },
    { q: 'Does Bereavement Support Payment affect Universal Credit?', a: `Not for the first year. The lump sum and the monthly payments are ignored for ${B.benefitDisregardMonths} months after the first payment. After that, any of the lump sum still in the bank can count as savings when a benefit is renewed or a new claim made. Tell your benefits office, such as the Universal Credit journal or Jobcentre Plus, when payments start.` },
    { q: 'My partner died before April 2017. Is there anything I can claim?', a: `Bereavement Support Payment covers deaths from ${h_date(B.schemeFrom)}. For an earlier death, a parent may be able to get Widowed Parent’s Allowance, which is ${g(B.widowedParentsAllowance, 2)} a week in 2026/27; anyone already receiving it keeps it while they remain eligible. Contact the Bereavement Service if you are unsure which scheme applies to your partner’s date of death.` },
  ],
  body: (h) => `
<h2>The two rates</h2>
${h.table(['Rate', 'Who gets it', 'One-off payment', 'Monthly payments', 'Most you can get'], [
  ['Higher', 'Married or civil partners with Child Benefit for a child at home, or pregnant; all eligible cohabiting partners', h.gbp(B.higherLump), `${B.months} × ${h.gbp(B.higherMonthly)}`, h.gbp(hiMax)],
  ['Standard', 'Married or civil partners without a child getting Child Benefit', h.gbp(B.standardLump), `${B.months} × ${h.gbp(B.standardMonthly)}`, h.gbp(loMax)],
], 'Bereavement Support Payment rates, unchanged in 2026/27 (DWP benefit and pension rates 2026 to 2027)', ['l', 'l', 'r', 'r', 'r'])}
<p>The higher rate depends on the Child Benefit position at the date of death. It applies if you were getting Child Benefit for a child living with you, if the Child Benefit Office had told you that you were entitled to it even if you chose not to be paid, or if you were pregnant. A widow whose youngest child had already left education a month before the death gets the standard rate. If your partner was the one receiving Child Benefit, make a new Child Benefit claim in your own name before claiming Bereavement Support Payment.</p>
<p>The amounts are fixed sums and were not up-rated in April 2026, unlike most benefits. They are paid into a bank, building society or credit union account.</p>
<p>Two households show the gap between the rates. Sarah, 41, was married with two children at primary school when her husband died; she claims within a month and receives ${h.gbp(B.higherLump)} straight away, then ${h.gbp(B.higherMonthly)} a month for a year and a half, ${h.gbp(hiMax)} altogether. David, 58, whose wife died after their children had grown up, gets ${h.gbp(B.standardLump)} and ${h.gbp(B.standardMonthly)} a month, ${h.gbp(loMax)} in all, even though his loss of household income may be just as large.</p>

<h2>Who can claim</h2>
<p>${h.src('govBereavementElig', 'The eligibility rules')} require that, when your partner died, you were under State Pension age, living in the UK or a country that pays UK bereavement benefits, and married, in a civil partnership or living together as if married. You cannot claim while in prison. Your partner must have either paid a certain level of Class 1 or Class 2 National Insurance contributions in any one tax year since ${h.date(B.niSince)}, or died because of an accident at work or a disease caused by work.</p>
<p>The contribution test looks at any single tax year, not a whole working life. If you are not sure whether your partner paid enough, claim anyway: the Bereavement Service checks the record and tells you. Nothing about your own earnings, savings or other income is looked at, which is why a widow on a good salary gets the same as one with no income.</p>

<h2>The claim deadlines and what they cost</h2>
<p>The single most common way to lose money is to claim late. ${h.src('govBereavementWhat', 'GOV.UK sets three cut-offs')}: within ${B.fullClaimMonths} months of the death you get the lump sum and all ${B.months} monthly payments; between ${B.fullClaimMonths} and ${B.lumpSumClaimMonths} months you still get the lump sum but only some monthly payments; between ${B.lumpSumClaimMonths} and ${B.maxClaimMonths} months the lump sum is gone and only some monthly payments remain; after ${B.maxClaimMonths} months you usually get nothing. The reason is that monthly payments can be backdated by ${B.fullClaimMonths} months under ${h.src('cpRegs19', 'regulation 19 of the Claims and Payments Regulations')}, so each month of delay beyond that removes a payment. The table shows our estimate at the higher rate.</p>
${h.table(['Claim made after the death', 'One-off payment', 'Monthly payments', 'Total'], [2, 5, 9, 13, 18, 22].map((m) => { const r = late(m); return [`${m} months`, h.gbp(r.lump), String(r.payments), h.gbp(r.total)]; }), 'Bereavement Support Payment at the higher rate by claim date (estimate from the GOV.UK cut-offs and the 3-month backdating rule)', ['l', 'r', 'r', 'r'])}
<p>There is one exception to the ${B.maxClaimMonths}-month limit: if the cause of death was only recently confirmed, for example after a long inquest, a later claim may still be accepted. Ring the Bereavement Service helpline in that case.</p>

<h2>Reaching State Pension age during the payments</h2>
<p>If you reach State Pension age within ${B.months} months of your partner’s death, GOV.UK warns that you may get fewer monthly payments. A widower close to that age should still claim at once: the lump sum is unaffected, and the ${h.a('state-pension-amount', 'State Pension amount')} page covers what he will receive once his pension starts.</p>

<h2>Effect on other benefits</h2>
<p>For ${B.benefitDisregardMonths} months from the first payment, Bereavement Support Payment does not affect means-tested benefits such as Universal Credit and Housing Benefit. After that year, money left over from the lump sum can count as capital if you renew or start a claim. A parent who receives ${h.gbp(B.higherLump)} and keeps it in a savings account would see it treated as savings from the second year, which matters only if total capital then passes the Universal Credit threshold of ${h.gbp(P.uc.capitalLower)}. Report the payments to your benefits office when they begin.</p>

<h2>How to claim</h2>
<p>You can claim online, by phone through the Bereavement Service helpline or by post on form BSP1. You need your National Insurance number, your partner’s National Insurance number, the date of death and your bank details. If you are abroad, the International Pension Centre takes the claim. Northern Ireland has its own phone and postal route.</p>
<p>A parent should also check ${h.a('child-benefit-rates', 'Child Benefit')} is in their name and report the death on any ${h.a('universal-credit-calculator', 'Universal Credit')} claim, since the award will be reassessed. If the children are being brought up by a relative after both parents have died, ${h.a('guardians-allowance', 'Guardian’s Allowance')} is the payment to look at.</p>
`,
});
