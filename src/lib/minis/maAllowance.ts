/** Maternity Allowance 2026/27 by work status and average weekly earnings. */
import { maternityAllowanceFor, type MaStatus } from '../engine/family-grants';
import { P } from '../engine/params';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

const S: MaStatus[] = ['employed', 'selfFull', 'selfNone', 'spouse'];
export default (): MiniSpec => ({
  title: 'Your Maternity Allowance in 2026/27',
  cta: 'Work out Universal Credit alongside it',
  inputs: [
    { id: 'st', label: 'Your situation', def: 0, options: [{ value: '0', label: 'Employed, no SMP' }, { value: '1', label: 'Self-employed, 13+ Class 2 weeks' }, { value: '2', label: 'Self-employed, no Class 2 paid' }, { value: '3', label: 'Unpaid work in spouse’s business' }] },
    { id: 'avg', label: 'Average gross pay a week', def: 180, unit: '£', max: 5000 },
  ],
  run: ({ st, avg }) => {
    const r = maternityAllowanceFor(S[st] ?? 'employed', avg);
    return {
      head: ['Maternity Allowance a week', gbp(r.weekly, 2)],
      rows: [
        [`Over ${r.weeks} weeks`, gbp(r.total)],
        ['Universal Credit reduced by', `${gbp(r.ucMonthlyReduction, 2)} a month`],
      ],
      note: r.weekly === 0 ? `Average pay under ${gbp(P.maternity.maThreshold)} a week does not qualify.` : `Average pay counts only for employees; the self-employed rate depends on Class 2 contributions.`,
    };
  },
});
