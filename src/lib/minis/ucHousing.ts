/** Universal Credit housing element for social tenants: spare-room cut and non-dependant deductions. */
import { housingElement } from '../engine/uc';
import { P } from '../engine/params';
import { gbp, pct } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'Housing element for a council or housing association home',
  cta: 'Private renter? Check the LHA of your area',
  inputs: [
    { id: 'rent', label: 'Eligible rent and service charges a month', def: 600, unit: '£', max: 3000 },
    { id: 'spare', label: 'Bedrooms you are not allowed for', def: 0, options: [{ value: '0', label: 'None' }, { value: '1', label: 'One' }, { value: '2', label: 'Two or more' }] },
    { id: 'nd', label: 'Adults 21+ living with you who pay the deduction', def: 0, max: 5 },
  ],
  run: ({ rent, spare, nd }) => {
    const h = housingElement({ couple: false, age: 30, children: 0, earnings: 0, housing: 'social', rent: Math.max(0, rent), spareRooms: spare, nonDependants: Math.max(0, Math.round(nd)) });
    const cut = spare >= 2 ? P.lha.socialSpareTwo : spare === 1 ? P.lha.socialSpareOne : 0;
    return {
      head: ['Housing element a month', gbp(h.amount, 2)],
      rows: [[`Spare-room cut (${pct(cut, 0)})`, gbp(rent * cut, 2)], ['Non-dependant deductions', gbp(Math.round(nd) * P.uc.nonDepDeduction, 2)], ['Rent left to find yourself', gbp(h.shortfall, 2)]],
    };
  },
});
