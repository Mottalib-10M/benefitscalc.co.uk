import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { carersWithPension } from '../../lib/engine/family';
import { caAtPensionAge } from '../../lib/engine/carers-extra';
import { formatMoney } from '../../lib/format';

const CA = P.carers;
const PC = P.pensionCredit;
const SP = P.statePension;
const g = (n: number, d = 2) => formatMoney(n, d);
// Worked example: Pat, 68, single, £215 a week of State Pension, cares for her brother two streets away.
const pat = caAtPensionAge({ statePension: 215 });
// Her friend Gordon: full new State Pension plus a £70 works pension.
const gordon = caAtPensionAge({ statePension: SP.newFull, otherIncome: 70 });
// Small pension: £60 a week of State Pension.
const small = caAtPensionAge({ statePension: 60 });

export default definePage({
  id: 'carers-allowance-and-state-pension',
  group: 'carers',
  order: 30,
  mini: 'caStatePension',
  miniHref: 'pension-credit-calculator',
  related: ['carers-allowance', 'pension-credit', 'pension-credit-calculator', 'state-pension-amount', 'state-pension-deferral', 'attendance-allowance'],
  sources: ['govCa', 'govCaEffect', 'govCaClaim', 'govPc', 'dwpRates', 'scotCspOverlap'],
  slug: 'carers-allowance-and-state-pension',
  nav: 'Carer’s Allowance and State Pension',
  card: `Why most pensioners get no Carer’s Allowance payment, and how the claim can still add ${g(PC.carer)} to Pension Credit.`,
  title: 'Carer’s Allowance and State Pension 2026/27: The Overlap',
  description: `Carer’s Allowance and State Pension 2026/27: a pension of ${g(CA.allowance)} or more stops the payment, but the claim can still add ${g(PC.carer)} a week to Pension Credit.`,
  h1: 'Carer’s Allowance and the State Pension: why the claim still counts',
  intro: 'The overlapping benefits rule takes the payment away; underlying entitlement gives some of it back through Pension Credit.',
  resume: `You cannot be paid the full Carer’s Allowance and the full State Pension at the same time. Both replace income, so the overlapping benefits rule pays only the larger: if your State Pension is ${g(CA.allowance)} a week or more, which it is for almost everyone with a full or near-full record, no Carer’s Allowance is paid; if it is less, Carer’s Allowance tops it up to ${g(CA.allowance)}. The claim is still worth making. A pensioner who meets the caring conditions but is not paid because of the State Pension has what is called an underlying entitlement, and GOV.UK confirms that this adds a carer amount of ${g(PC.carer)} a week to the guarantee in Pension Credit. For someone on a modest pension that can turn a small award into a much larger one, or create an entitlement where there was none, with the help that Pension Credit unlocks. Both partners can get the carer amount if both care. Weeks of Carer’s Allowance cannot be used to build up extra State Pension through deferral.`,
  faqs: [
    { q: 'My State Pension is £215 a week: is there any point claiming Carer’s Allowance?', a: `Yes, if your income is near the Pension Credit level. Nothing will be paid as Carer’s Allowance, but the underlying entitlement adds ${g(PC.carer)} a week to the amount Pension Credit tops you up to. On ${g(215, 0)} a week, a single carer’s Pension Credit rises from ${g(pat.pcWithout)} to ${g(pat.pcWith)}. With income well above ${g(PC.guaranteeSingle + PC.carer)}, the claim adds nothing.` },
    { q: 'What does underlying entitlement to Carer’s Allowance mean?', a: `It means you meet every condition for Carer’s Allowance, the ${CA.hoursPerWeek} hours, the qualifying benefit and the earnings limit, but receive ${g(0)} because another benefit, usually the State Pension, pays as much or more. The decision letter confirms it. GOV.UK says this still entitles you to the Pension Credit carer amount, as if the allowance were being paid.` },
    { q: 'Can my husband and I both get the Pension Credit carer amount?', a: `Yes, if each of you has claimed Carer’s Allowance for caring for someone. GOV.UK says that when both partners have claimed or are getting Carer’s Allowance, both can get the extra amount, ${g(PC.carer * 2)} a week in all. You cannot both claim for caring for the same person, so this usually applies when each partner cares for a different relative.` },
    { q: 'I already get Carer’s Allowance: what happens when my State Pension starts?', a: `The overlap rule applies from then on. If your State Pension is ${g(CA.allowance)} a week or more, Carer’s Allowance stops being paid; if it is less, you get only the difference. Keep the Carer’s Allowance award in place: it becomes an underlying entitlement, which keeps the carer amount in Pension Credit if you qualify for it.` },
    { q: 'Could I defer my State Pension and keep getting Carer’s Allowance in full?', a: `You could, but GOV.UK warns that you cannot build up extra State Pension during any period in which you get Carer’s Allowance. Deferring would swap a State Pension of up to ${g(SP.newFull)} a week for an allowance of ${g(CA.allowance)}, with no deferral increase for those weeks, which leaves almost everyone worse off.` },
  ],
  body: (h) => `
<h2>How the overlap works in figures</h2>
<p>${h.src('govCa', 'GOV.UK puts it simply')}: with a pension of ${h.gbp(CA.allowance, 2)} a week or more you will not get a Carer’s Allowance payment; with less, Carer’s Allowance makes up the difference. The table shows what that means for typical pensions in 2026/27.</p>
${h.table(['Weekly State Pension', 'Carer’s Allowance paid', 'Total of the two'], [
  [h.gbp(60, 2), h.gbp(carersWithPension(60), 2), h.gbp(60 + carersWithPension(60), 2)],
  [`${h.gbp(SP.basicLower, 2)} (basic, spouse’s rate)`, h.gbp(carersWithPension(SP.basicLower), 2), h.gbp(SP.basicLower + carersWithPension(SP.basicLower), 2)],
  [`${h.gbp(SP.basicFull, 2)} (full basic)`, h.gbp(carersWithPension(SP.basicFull), 2), h.gbp(SP.basicFull, 2)],
  [`${h.gbp(SP.newFull, 2)} (full new)`, h.gbp(carersWithPension(SP.newFull), 2), h.gbp(SP.newFull, 2)],
], 'Overlapping benefits: Carer’s Allowance with a State Pension (DWP rates 2026/27)', ['l', 'r', 'r'])}
<p>Only someone with a very short National Insurance record, or who has not yet claimed their State Pension, receives anything. A woman with ${h.gbp(60)} of State Pension gets ${h.gbp(small.caPaid, 2)} of Carer’s Allowance on top, bringing her to ${h.gbp(CA.allowance, 2)}. Occupational and private pensions are not part of the overlap at all; they only matter for Pension Credit.</p>

<h2>Underlying entitlement and the carer amount</h2>
<p>When the State Pension wipes out the payment, the DWP still decides the claim. If you meet the conditions, you are awarded Carer’s Allowance at ${h.gbp(0)}: an underlying entitlement. ${h.src('govPc', 'GOV.UK’s Pension Credit page')} lists three routes to the extra ${h.gbp(PC.carer, 2)} a week for carers: getting Carer’s Allowance, getting Carer Support Payment in Scotland, or having claimed Carer’s Allowance without being paid because another benefit pays more. The third is the one that matters to pensioners.</p>
<p>Pat is 68, single, with ${h.gbp(215)} a week of State Pension. She spends most days with her brother, who lives two streets away and gets the daily living part of PIP. Without a claim, her Pension Credit is the gap between ${h.gbp(PC.guaranteeSingle, 2)} and her pension: ${h.gbp(pat.pcWithout, 2)} a week. With an underlying entitlement, the guarantee becomes ${h.gbp(PC.guaranteeSingle + PC.carer, 2)} and she gets ${h.gbp(pat.pcWith, 2)}, an extra ${h.gbp(pat.weeklyGain, 2)} a week or about ${h.gbp(pat.weeklyGain * 52)} a year, though no Carer’s Allowance is ever paid. Her friend Gordon has the full new State Pension and a ${h.gbp(70)} works pension; even with the carer amount his income is above the guarantee, and the claim gains him ${h.gbp(gordon.weeklyGain, 2)}.</p>

<h2>Why the extra Pension Credit matters more than it looks</h2>
<p>The gain is not only the weekly sum. An award of Guarantee Credit, even a small one, brings maximum Housing Benefit for tenants, Council Tax Reduction, help with NHS dental and optical costs, Cold Weather Payments and, from age 75, a free TV licence. For a pensioner whose income sat a few pounds above the guarantee, the carer amount can be what opens all of these. ${h.a('pension-credit', 'Pension Credit explained')} lists them, and ${h.a('pension-credit-calculator', 'the Pension Credit calculator')} lets you add the carer amount to your own figures.</p>

<h2>Couples, and the person you care for</h2>
<p>A couple where both partners care for someone, each for a different person, can both claim and both get the carer amount, ${h.gbp(PC.carer * 2, 2)} a week in all. A couple where one partner cares for the other is the commonest case and needs more thought. The disabled partner’s Attendance Allowance or PIP may bring a severe disability amount of ${h.gbp(PC.severeDisability, 2)} into their joint Pension Credit, and ${h.src('govCaEffect', 'GOV.UK warns')} that the extra amount for severe disability usually stops when someone gets Carer’s Allowance for looking after that person. Whether an underlying entitlement, with nothing actually paid, has the same effect depends on the details of the award, so ask the Pension Service to work out both versions before the carer claims.</p>

<h2>Deferral, Carer’s Credit and the earnings limit</h2>
<p>Three side rules complete the picture. First, deferring the State Pension does not help: GOV.UK says you cannot build up extra State Pension during any period you get Carer’s Allowance, and ${h.a('state-pension-deferral', 'deferral')} is rarely worth it for a carer. Second, Carer’s Credit is only available under State Pension age, so it plays no part once you have reached it. Third, the earnings limit of ${h.gbp(CA.earningsLimit)} a week still applies to anyone who works past pension age, but pensions themselves are not earnings: a retired carer with a large works pension passes the earnings test, even if the overlap means nothing is paid.</p>

<h2>Claiming when nothing will be paid</h2>
<p>The claim is made in the ordinary way, online or on the paper form, even though you expect a ${h.gbp(0)} award. ${h.src('govCaClaim', 'GOV.UK’s list of what to have ready')} even notes that you do not need to give bank details if you already get your State Pension. Give the details of the person you care for and their qualifying benefit, and answer the hours and earnings questions as usual. A Carer’s Allowance claim can be backdated by up to ${h.num(CA.backdateMonths)} months. When the letter confirming the underlying entitlement arrives, tell the Pension Service if your Pension Credit has not changed, or claim Pension Credit if you do not yet get it: Pension Credit itself can be backdated by ${h.num(PC.backdateMonths)} months. Keep reporting changes to the Carer’s Allowance Unit, such as the person you care for going into hospital, because the carer amount ends with the underlying entitlement.</p>

<h2>Scotland</h2>
<p>Carer Support Payment follows the same overlap. ${h.src('scotCspOverlap', 'Mygov.scot’s examples')} show a carer with more than ${h.gbp(P.scotland.carerSupport, 2)} of State Pension awarded Carer Support Payment at ${h.gbp(0)}, which also rules out the Scottish Carer Supplement and Carer Additional Person Payment, though it can still raise Pension Credit. ${h.a('carer-support-payment-scotland', 'Carer Support Payment in Scotland')} covers the Scottish package.</p>
`,
});
