/** Universal Credit deductions: the 15% overall ceiling, third-party and rent arrears slices (DWP rates 2026/27). */
import { P } from '../engine/params';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

const U = P.uc;
const BANDS = ['singleUnder25', 'single25', 'coupleUnder25', 'couple25'] as const;
export default (): MiniSpec => ({
  title: 'How much can be taken off your Universal Credit',
  cta: 'See the award before deductions',
  inputs: [
    { id: 'hh', label: 'Household', def: 1, options: [{ value: '0', label: 'Single, under 25' }, { value: '1', label: 'Single, 25 or over' }, { value: '2', label: 'Couple, both under 25' }, { value: '3', label: 'Couple, one or both 25 or over' }] },
    { id: 'owed', label: 'Repayments asked for a month (advance, overpayment, bills)', def: 90, unit: '£', max: 1000 },
  ],
  run: ({ hh, owed }) => {
    const b = BANDS[hh] ?? 'single25';
    const max = U.maxDeduction[b];
    const taken = Math.min(Math.max(0, owed), max);
    return {
      head: ['Taken off this month', gbp(taken, 2)],
      rows: [['Ceiling: 15% of the standard allowance', gbp(max, 2)], ['Each third-party debt (5%)', gbp(U.thirdParty[b], 2)], ['Rent arrears: from 10% to 15%', `${gbp(U.rentArrearsMin[b], 2)} to ${gbp(max, 2)}`]],
      note: owed > max ? `${gbp(owed - max, 2)} a month waits: the rest of the debt is collected over more months, except last resort deductions.` : undefined,
    };
  },
});
