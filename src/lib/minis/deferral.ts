/** Deferring the new State Pension: lump sum of up to 52 weeks or extra weekly pension. */
import { deferNewScheme } from '../engine/pension-extra';
import { P } from '../engine/params';
import { gbp, num } from './_kit';
import type { MiniSpec } from '../mini-types';
export default (): MiniSpec => ({
  title: 'What deferring your State Pension is worth',
  cta: 'State Pension amount calculator',
  inputs: [
    { id: 'w', label: 'Weekly State Pension', def: P.statePension.newFull, unit: '£', max: 2000, decimals: 2 },
    { id: 'wk', label: 'Weeks deferred', def: 52, unit: 'weeks', max: 520 },
    { id: 'lump', label: 'How you take it', def: 0, options: [{ value: '0', label: 'Extra weekly pension' }, { value: '1', label: 'Lump sum (up to 52 weeks)' }] },
  ],
  run: ({ w, wk, lump }) => {
    const r = deferNewScheme(w, wk, lump === 1);
    const given = w * wk;
    return {
      head: [lump ? 'One-off arrears payment' : 'Extra pension a week', lump ? gbp(r.arrears, 2) : gbp(r.extraWeekly, 2)],
      rows: [['Pension given up while deferring', gbp(given)], ['Increase', `${num(r.extraPct * 100, 2)}%`], ...(r.extraWeekly ? [['Years to recover what you gave up', num(r.breakEvenYears || (given - r.arrears) / (r.extraWeekly * 52), 1)] as [string, string]] : [])],
      note: 'New State Pension rules (State Pension age on or after 6 April 2016). Extra pension and lump sums are taxable.',
    };
  },
});
