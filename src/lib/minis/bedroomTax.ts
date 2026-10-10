/** Social sector size criteria 2026/27: the 14% or 25% cut to eligible rent for spare bedrooms. */
import { socialSizeCriteria } from '../engine/support';
import { gbp, pct } from './_kit';
import type { MiniSpec } from '../mini-types';

const rooms = (n: number) => Array.from({ length: n }, (_, i) => ({ value: String(i + 1), label: `${i + 1} bedroom${i ? 's' : ''}` }));
export default (): MiniSpec => ({
  title: 'Your spare room cut in 2026/27',
  cta: 'Estimate your Universal Credit with this rent',
  inputs: [
    { id: 'rent', label: 'Rent and eligible service charges a month', def: 480, unit: '£', max: 5000 },
    { id: 'beds', label: 'Bedrooms in your home', def: 3, options: rooms(6) },
    { id: 'need', label: 'Bedrooms your household is allowed', def: 2, options: rooms(5) },
  ],
  run: ({ rent, beds, need }) => {
    const r = socialSizeCriteria({ eligibleRent: rent, bedrooms: beds, needed: need });
    return {
      head: ['Cut to your eligible rent a month', gbp(r.reduction, 2)],
      rows: [['Spare bedrooms counted', String(r.spare)], ['Rate applied', r.pct ? pct(r.pct, 0) : 'None'], ['Rent still covered', `${gbp(r.after, 2)} a month`], ['Lost over a year', gbp(r.yearly)]],
      note: 'Working-age council and housing association tenants only. Nothing is cut once you, or both of you as a couple, have reached State Pension age.',
    };
  },
});
