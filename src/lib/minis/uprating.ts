/** April 2026 up-rating: last year's weekly amount → this year's, for the main benefits. */
import { P } from '../engine/params';
import { gbp, pct } from './_kit';
import type { MiniSpec } from '../mini-types';
const ROWS: Array<[string, number, number]> = [
  ['New State Pension (week)', P.statePension.previous.newFull, P.statePension.newFull],
  ['Pension Credit, single (week)', P.pensionCredit.previous.guaranteeSingle, P.pensionCredit.guaranteeSingle],
  ['UC standard allowance, single 25+ (month)', P.uc.previous.single25, P.uc.standard.single25],
  ['UC child element (month)', P.uc.previous.child, P.uc.child],
  ['PIP enhanced daily living (week)', P.pip.previous.dailyEnhanced, P.pip.dailyEnhanced],
  ['Carer’s Allowance (week)', P.carers.previous.allowance, P.carers.allowance],
  ['Child Benefit, eldest child (week)', P.childBenefit.previous.eldest, P.childBenefit.eldest],
];
export default (): MiniSpec => ({
  title: 'How much your benefit rose in April 2026',
  cta: 'All 2026/27 rates',
  inputs: [{ id: 'b', label: 'Benefit', def: 0, options: ROWS.map(([l], i) => ({ value: String(i), label: l })) }],
  run: ({ b }) => {
    const [, was, now] = ROWS[b] ?? ROWS[0];
    return { head: ['2026/27 rate', gbp(now, 2)], rows: [['2025/26 rate', gbp(was, 2)], ['Increase', `${gbp(now - was, 2)} (${pct((now - was) / was, 1)})`]] };
  },
});
