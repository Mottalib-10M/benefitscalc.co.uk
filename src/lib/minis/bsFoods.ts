/** Best Start Foods every 4 weeks (Scotland), by pregnancy and children's ages. */
import { bestStartFoods } from '../engine/family-grants';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'Best Start Foods on your card',
  cta: 'Add Scottish Child Payment',
  inputs: [
    { id: 'preg', label: 'Pregnant now', def: 0, options: [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }] },
    { id: 'u1', label: 'Babies under 1', def: 1, unit: 'children', max: 4 },
    { id: 'k13', label: 'Children aged 1 to 3', def: 1, unit: 'children', max: 4 },
  ],
  run: ({ preg, u1, k13 }) => {
    const r = bestStartFoods(preg === 1, u1, k13);
    return {
      head: ['Loaded every 4 weeks', gbp(r.fourWeekly, 2)],
      rows: [['A week', gbp(r.weekly, 2)], ['Over a year', gbp(r.year, 2)]],
      note: 'Paid onto a prepaid card for healthy food such as milk, fruit and vegetables.',
    };
  },
});
