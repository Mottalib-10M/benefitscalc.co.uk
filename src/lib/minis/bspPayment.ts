/** Bereavement Support Payment: what you get by rate and by how long after the death you claim. */
import { bereavementSupport } from '../engine/family-grants';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'Bereavement Support Payment: what a claim brings',
  cta: 'See what else you can claim now',
  inputs: [
    { id: 'rate', label: 'Rate', def: 1, options: [{ value: '1', label: 'Higher (child or pregnancy)' }, { value: '0', label: 'Standard' }] },
    { id: 'm', label: 'Months since the death when you claim', def: 2, unit: 'months', max: 30 },
  ],
  run: ({ rate, m }) => {
    const r = bereavementSupport(rate === 1, m);
    return {
      head: ['Total you would receive', gbp(r.total)],
      rows: [['One-off payment', gbp(r.lump)], ['Monthly payments', `${r.payments} × ${gbp(r.monthly)}`], ['Lost by claiming late', gbp(r.max - r.total)]],
      note: 'Our estimate from the GOV.UK claim limits; the Bereavement Service decides the exact number of payments.',
    };
  },
});
