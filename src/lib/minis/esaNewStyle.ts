/** New Style ESA 2026/27: weekly rate by phase and age, the private pension rule, and the amount Universal Credit deducts. */
import { newStyleEsa, type EsaPhase } from '../engine/disability-extra';
import { P } from '../engine/params';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

const PH: EsaPhase[] = ['assessment', 'wrag', 'support'];
export default (): MiniSpec => ({
  title: 'Your New Style ESA a week',
  cta: 'See how ESA fits with Universal Credit',
  inputs: [
    { id: 'age', label: 'Your age', def: 34, max: 70 },
    { id: 'ph', label: 'Stage of the claim', def: 0, options: [{ value: '0', label: `Assessment (first ${P.esaJsa.assessmentWeeks} weeks)` }, { value: '1', label: 'Work-related activity group' }, { value: '2', label: 'Support group' }] },
    { id: 'pen', label: 'Private or workplace pension a week', def: 0, unit: '£', max: 2000, decimals: 2 },
  ],
  run: ({ age, ph, pen }) => {
    const r = newStyleEsa({ age, phase: PH[ph] ?? 'assessment', privatePension: pen });
    return {
      head: ['New Style ESA a week', gbp(r.weekly, 2)],
      rows: [[`Paid every ${P.esaJsa.paidEveryWeeks} weeks`, gbp(r.fortnightly, 2)], ['Taken off for pension income', gbp(r.pensionCut, 2)], ['Monthly amount deducted from Universal Credit', gbp(r.monthlyForUc, 2)]],
      note: ph === 1 ? `In the work-related activity group New Style ESA lasts ${P.esaJsa.wragDays} days; the support group has no time limit.` : undefined,
    };
  },
});
