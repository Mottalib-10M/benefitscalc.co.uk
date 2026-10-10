/** Child Benefit 2026/27 by number of children, against 2025/26 (HMRC rates table). */
import { childBenefitWeeklyFor } from '../engine/family-grants';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'Child Benefit for your family in 2026/27',
  cta: 'Check the High Income Child Benefit Charge too',
  inputs: [{ id: 'kids', label: 'Children you claim for', def: 2, unit: 'children', max: 12 }],
  run: ({ kids }) => {
    const w = childBenefitWeeklyFor(kids, '2026');
    const prev = childBenefitWeeklyFor(kids, '2025');
    return {
      head: ['Every 4 weeks', gbp(w * 4, 2)],
      rows: [['A week', gbp(w, 2)], ['A year (52 weeks)', gbp(w * 52, 2)], ['More than in 2025/26', `${gbp((w - prev) * 52, 2)} a year`]],
    };
  },
});
