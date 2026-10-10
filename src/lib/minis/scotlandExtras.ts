/** Scotland-only payments for a family in 2026/27: Scottish Child Payment and Child Winter Heating Payment. */
import { scotlandExtras } from '../engine/support';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'What Scotland adds for your family this year',
  cta: 'Add up every benefit for your household',
  inputs: [
    { id: 'kids', label: 'Children under 16', def: 2, max: 12, unit: 'children' },
    { id: 'uc', label: 'Universal Credit or another qualifying benefit?', def: 1, options: [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }] },
    { id: 'dis', label: 'Children on the highest care rate of CDP or DLA', def: 0, max: 6, unit: 'children' },
  ],
  run: ({ kids, uc, dis }) => {
    const r = scotlandExtras({ childrenUnder16: kids, qualifyingBenefit: uc === 1, disabledChildren: dis });
    return {
      head: ['Scotland-only payments a year', gbp(r.total)],
      rows: [['Scottish Child Payment every 4 weeks', gbp(r.scpFourWeekly, 2)], ['Scottish Child Payment a year', gbp(r.scpYear)], ['Child Winter Heating Payment', gbp(r.cwhp, 2)]],
      note: uc === 1 ? 'Neither payment reduces Universal Credit or Child Benefit.' : 'Scottish Child Payment needs Universal Credit, income-based JSA, Pension Credit, Income Support or income-related ESA. Child Benefit alone does not qualify.',
    };
  },
});
