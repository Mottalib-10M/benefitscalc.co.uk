/** Scottish Child Payment 2026/27 by number of children under 16. */
import { scottishChildPayment } from '../engine/family-grants';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'Scottish Child Payment for your children',
  cta: 'Check the Universal Credit that qualifies you',
  inputs: [{ id: 'kids', label: 'Children under 16 you look after', def: 2, unit: 'children', max: 12 }],
  run: ({ kids }) => {
    const r = scottishChildPayment(kids);
    return {
      head: ['Every 4 weeks', gbp(r.fourWeekly, 2)],
      rows: [['A week', gbp(r.weekly, 2)], ['A year (52 weeks)', gbp(r.year, 2)], ['Rise on 2025/26', `${gbp(r.year - r.prevYear, 2)} a year`]],
      note: 'Paid on top of Universal Credit and Child Benefit, which it does not reduce.',
    };
  },
});
