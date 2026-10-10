/** Universal Credit maximum before income: standard allowance + child elements, 2026/27 against 2025/26. */
import { standardAllowance, childElements } from '../engine/uc';
import { P } from '../engine/params';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

const U = P.uc;
const HOUSEHOLDS: Array<[boolean, number, number]> = [[false, 22, 22], [false, 30, 30], [true, 22, 22], [true, 30, 30]];
const PREV = [U.previous.singleUnder25, U.previous.single25, U.previous.coupleUnder25, U.previous.couple25];
export default (): MiniSpec => ({
  title: 'Your Universal Credit rates for 2026/27',
  cta: 'Add rent, earnings and health in the full calculator',
  inputs: [
    { id: 'hh', label: 'Household', def: 1, options: [{ value: '0', label: 'Single, under 25' }, { value: '1', label: 'Single, 25 or over' }, { value: '2', label: 'Couple, both under 25' }, { value: '3', label: 'Couple, one or both 25 or over' }] },
    { id: 'kids', label: 'Children living with you', def: 1, max: 8 },
    { id: 'pre', label: 'Eldest child born before 6 April 2017?', def: 0, options: [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }] },
  ],
  run: ({ hh, kids, pre }) => {
    const [couple, a, b] = HOUSEHOLDS[hh] ?? HOUSEHOLDS[1];
    const n = Math.max(0, Math.round(kids));
    const sa = standardAllowance(couple, a, b);
    const ch = childElements(n, n > 0 && pre === 1);
    const prev = (PREV[hh] ?? PREV[1]) + (n > 0 ? n * U.previous.child + (pre === 1 ? U.previous.firstChildPre2017 - U.previous.child : 0) : 0);
    return {
      head: ['Monthly amount before income', gbp(sa + ch, 2)],
      rows: [['Standard allowance', gbp(sa, 2)], ['Child elements', gbp(ch, 2)], ['Rise on 2025/26', `${gbp(sa + ch - prev, 2)} a month`]],
      note: 'Rent, health, carer and childcare elements are added on top; earnings and savings are taken off.',
    };
  },
});
