/** PIP alongside Universal Credit: PIP is not counted, and its daily living part removes deductions and opens the carer element. */
import { pipWeekly, type PipRate } from '../engine/disability';
import { P, weeklyToMonthly } from '../engine/params';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

const RATES: PipRate[] = ['none', 'standard', 'enhanced'];
const opts = [{ value: '0', label: 'Not awarded' }, { value: '1', label: 'Standard rate' }, { value: '2', label: 'Enhanced rate' }];
export default (): MiniSpec => ({
  title: 'What PIP changes in a Universal Credit household',
  cta: 'Score the PIP activities',
  inputs: [
    { id: 'daily', label: 'Your PIP daily living part', def: 1, options: opts },
    { id: 'mob', label: 'Your PIP mobility part', def: 0, options: opts },
    { id: 'nd', label: 'Grown-up children or other adults (21+) living with you', def: 1, max: 4 },
  ],
  run: ({ daily, mob, nd }) => {
    const pipM = weeklyToMonthly(pipWeekly(RATES[daily] ?? 'none', RATES[mob] ?? 'none'));
    const dl = daily > 0;
    const saved = dl ? Math.max(0, Math.round(nd)) * P.uc.nonDepDeduction : 0;
    return {
      head: ['PIP a month, on top of Universal Credit', gbp(pipM, 2)],
      rows: [['Taken off Universal Credit for PIP', gbp(0, 2)], ['Non-dependant deductions no longer made', gbp(saved, 2)], ['A carer could add the carer element', dl ? gbp(P.uc.carer, 2) : 'Not with mobility alone']],
      note: dl || mob > 0 ? 'Any PIP award also exempts the household from the benefit cap.' : undefined,
    };
  },
});
