/** PIP weekly and 4-weekly amount from the rate of each component (2026/27). */
import { pipWeekly, type PipRate } from '../engine/disability';
import { P } from '../engine/params';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

const RATES: PipRate[] = ['none', 'standard', 'enhanced'];
const opts = [{ value: '0', label: 'Not awarded' }, { value: '1', label: 'Standard rate' }, { value: '2', label: 'Enhanced rate' }];
export default (): MiniSpec => ({
  title: 'What your PIP award pays in 2026/27',
  cta: 'Score yourself on the 12 PIP activities',
  inputs: [
    { id: 'daily', label: 'Daily living part', def: 1, options: opts },
    { id: 'mob', label: 'Mobility part', def: 1, options: opts },
  ],
  run: ({ daily, mob }) => {
    const w = pipWeekly(RATES[daily] ?? 'none', RATES[mob] ?? 'none');
    const prev = (daily === 2 ? P.pip.previous.dailyEnhanced : daily === 1 ? P.pip.previous.dailyStandard : 0) + (mob === 2 ? P.pip.previous.mobilityEnhanced : mob === 1 ? P.pip.previous.mobilityStandard : 0);
    return {
      head: ['PIP every 4 weeks', gbp(w * 4, 2)],
      rows: [['A week', gbp(w, 2)], ['A year (52 weeks)', gbp(w * 52)], ['Rise on 2025/26', `${gbp((w - prev) * 52)} a year`]],
    };
  },
});
