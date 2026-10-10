/** Universal Credit in Northern Ireland: housing element to the landlord, the rest in two payments a month. */
import { niTwiceMonthly } from '../engine/support';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'How a Northern Ireland Universal Credit award is paid out',
  cta: 'Estimate the monthly award first',
  inputs: [
    { id: 'award', label: 'Monthly Universal Credit award', def: 1150, unit: '£', max: 10000 },
    { id: 'housing', label: 'Housing element in it', def: 520, unit: '£', max: 5000 },
  ],
  run: ({ award, housing }) => {
    const r = niTwiceMonthly(award, housing);
    return {
      head: ['Each of your two payments', gbp(r.eachPayment, 2)],
      rows: [['Paid to your landlord each month', gbp(r.toLandlord, 2)], ['Paid to you each month', gbp(r.toYouMonthly, 2)], ['First payment after claiming', `half of the month, ${gbp(r.eachPayment, 2)}`]],
      note: 'You can ask your work coach for one monthly payment instead, or to be paid the housing element yourself if you meet the conditions.',
    };
  },
});
