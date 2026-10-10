/** Basic State Pension (State Pension age before 6 April 2016): full rate, Category B and the age 80 addition. */
import { P } from '../engine/params';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';
export default (): MiniSpec => ({
  title: 'Basic State Pension in 2026/27',
  cta: 'Check Pension Credit on top',
  inputs: [
    { id: 'cat', label: 'Your basic pension', def: 0, options: [{ value: '0', label: 'Category A, full record' }, { value: '1', label: 'Category B on a spouse’s record' }, { value: '2', label: 'Category D (80 and over, non-contributory)' }] },
    { id: 'add', label: 'Additional State Pension a week', def: 40, unit: '£', max: 1000, decimals: 2 },
    { id: 'over80', label: 'Aged 80 or over', def: 0, options: [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }] },
  ],
  run: ({ cat, add, over80 }) => {
    const S = P.statePension; const basic = cat === 0 ? S.basicFull : S.basicLower;
    const extra = over80 ? S.age80Addition : 0; const w = basic + add + extra;
    return { head: ['State Pension a week', gbp(w, 2)], rows: [['Basic pension', gbp(basic, 2)], ['Additional State Pension (your figure)', gbp(add, 2)], ['Age 80 addition', gbp(extra, 2)], ['Every 4 weeks', gbp(w * 4, 2)]] };
  },
});
