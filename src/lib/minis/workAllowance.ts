/** How monthly take-home pay reduces Universal Credit: work allowance, then the 55% taper. */
import { computeUc } from '../engine/uc';
import { P } from '../engine/params';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'How much of your pay Universal Credit takes',
  cta: 'Work out the full award with rent and children',
  inputs: [
    { id: 'pay', label: 'Take-home pay in the assessment period', def: 1100, unit: '£', max: 6000 },
    { id: 'wa', label: 'Your situation', def: 2, options: [{ value: '0', label: 'No children, no health element' }, { value: '1', label: 'Children or health element, no rent in the award' }, { value: '2', label: 'Children or health element, rent in the award' }] },
  ],
  run: ({ pay, wa }) => {
    const r = computeUc({ couple: false, age: 30, children: wa > 0 ? 1 : 0, earnings: Math.max(0, pay), housing: wa === 2 ? 'social' : 'none', rent: wa === 2 ? 500 : 0 });
    const counted = Math.max(0, pay - r.workAllowance);
    return {
      head: ['Taken off your Universal Credit', gbp(r.earningsDeduction, 2)],
      rows: [['Work allowance', r.workAllowance ? gbp(r.workAllowance) : 'None'], [`Pay counted at ${Math.round(P.uc.taper * 100)}p in the pound`, gbp(counted, 2)], ['Pay you keep on top of the award', gbp(pay - r.earningsDeduction, 2)]],
    };
  },
});
