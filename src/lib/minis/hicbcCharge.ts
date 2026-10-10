/** High Income Child Benefit Charge: what the higher earner repays, and what a pension contribution saves. */
import { childBenefitYear, hicbc } from '../engine/family';
import { P } from '../engine/params';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'Your High Income Child Benefit Charge for 2026/27',
  cta: 'Child Benefit you keep, with the full calculator',
  inputs: [
    { id: 'inc', label: 'Higher earner’s adjusted net income', def: 68000, unit: '£', max: 1000000 },
    { id: 'kids', label: 'Children you get Child Benefit for', def: 2, unit: 'children', max: 12 },
    { id: 'pen', label: 'Extra pension contribution (gross)', def: 4000, unit: '£', max: 100000 },
  ],
  run: ({ inc, kids, pen }) => {
    const cb = childBenefitYear(kids);
    const now = hicbc(inc, cb);
    const after = hicbc(Math.max(0, inc - pen), cb);
    return {
      head: ['Charge to repay', gbp(now.charge)],
      rows: [
        ['Child Benefit for the year', gbp(cb)],
        ['Share clawed back', `${now.pct}%`],
        ['Charge after the extra pension contribution', gbp(after.charge)],
        ['Saved on the charge alone', gbp(now.charge - after.charge)],
      ],
      note: `1% for every £${P.childBenefit.hicbcPerPct} above ${gbp(P.childBenefit.hicbcThreshold)}; all of it from ${gbp(P.childBenefit.hicbcUpper)}. Income tax relief on the contribution comes on top.`,
    };
  },
});
