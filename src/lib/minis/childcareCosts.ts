/** Universal Credit childcare costs element: 85% of the bill up to the monthly cap. */
import { childcareElement } from '../engine/uc';
import { P } from '../engine/params';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

const U = P.uc;
export default (): MiniSpec => ({
  title: 'Childcare paid back through Universal Credit',
  cta: 'Put childcare into a full Universal Credit estimate',
  inputs: [
    { id: 'bill', label: 'Childcare paid in the assessment period', def: 950, unit: '£', max: 5000 },
    { id: 'kids', label: 'Children in paid childcare', def: 1, options: [{ value: '1', label: 'One child' }, { value: '2', label: 'Two or more' }] },
  ],
  run: ({ bill, kids }) => {
    const back = childcareElement(Math.max(0, bill), kids);
    const cap = kids >= 2 ? U.childcareMax2 : U.childcareMax1;
    return {
      head: ['Added to your award', gbp(back, 2)],
      rows: [[`${Math.round(U.childcareShare * 100)}% of the bill`, gbp(bill * U.childcareShare, 2)], ['Monthly cap', gbp(cap, 2)], ['Left for you to pay', gbp(bill - back, 2)]],
      note: bill * U.childcareShare > cap ? `The cap bites: the bill would need to be ${gbp(cap / U.childcareShare, 2)} or less for 85% to be paid in full.` : undefined,
    };
  },
});
