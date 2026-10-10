/** Guardian's Allowance 2026/27 with the Child Benefit it is paid alongside. */
import { guardiansAllowance } from '../engine/family-grants';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'Guardian’s Allowance and Child Benefit together',
  cta: 'Check your Child Benefit',
  inputs: [
    { id: 'ga', label: 'Children whose parents have died (or qualifying cases)', def: 1, unit: 'children', max: 10 },
    { id: 'cb', label: 'All children you get Child Benefit for', def: 2, unit: 'children', max: 12 },
  ],
  run: ({ ga, cb }) => {
    const r = guardiansAllowance(ga, cb);
    return {
      head: ['Guardian’s Allowance a week', gbp(r.gaWeekly, 2)],
      rows: [['With Child Benefit, a week', gbp(r.totalWeekly, 2)], ['Guardian’s Allowance a year', gbp(r.gaYear, 2)], ['Both together a year', gbp(r.totalYear, 2)]],
      note: 'Tax-free, ignored by Universal Credit and outside the benefit cap.',
    };
  },
});
