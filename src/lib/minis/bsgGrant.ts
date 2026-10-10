/** Best Start Grant: the three payments from pregnancy to school, by babies and older children. */
import { bestStartGrantTotal } from '../engine/family-grants';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'Best Start Grant from pregnancy to school',
  cta: 'Add Scottish Child Payment',
  inputs: [
    { id: 'babies', label: 'Babies expected', def: 1, options: [{ value: '1', label: 'One baby' }, { value: '2', label: 'Twins' }, { value: '3', label: 'Triplets' }] },
    { id: 'older', label: 'Other children under 16 at home', def: 0, options: [{ value: '0', label: 'None' }, { value: '1', label: 'Yes' }] },
  ],
  run: ({ babies, older }) => {
    const r = bestStartGrantTotal(babies, older === 1);
    return {
      head: ['All three payments', gbp(r.total, 2)],
      rows: [['Pregnancy and Baby Payment', gbp(r.pregnancy, 2)], ['Early Learning Payment (age 2 to 3½)', gbp(r.earlyLearning, 2)], ['School Age Payment', gbp(r.schoolAge, 2)]],
      note: 'Later payments use today’s rates; Social Security Scotland raises them with inflation each April.',
    };
  },
});
