/** Carer's Allowance with Universal Credit: CA deducted in full, carer element kept, the net effect each month. */
import { caAndUc } from '../engine/carers-extra';
import { carersEarnings } from '../engine/family';
import { P, monthlyToWeekly } from '../engine/params';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'Carer’s Allowance and Universal Credit together',
  cta: 'Work out your whole Universal Credit',
  inputs: [
    { id: 'earn', label: 'Your take-home pay a month', def: 400, unit: '£', max: 10000, decimals: 2 },
    { id: 'rent', label: 'Rent a month (social landlord)', def: 520, unit: '£', max: 3000, decimals: 2 },
  ],
  run: ({ earn, rent }) => {
    const r = caAndUc({ earningsMonthly: earn, rent });
    const test = carersEarnings({ netEarnings: monthlyToWeekly(earn) });
    return {
      head: ['Change in income a month', gbp(test.eligible ? r.gain : 0, 2)],
      rows: [['Universal Credit with carer element, no CA', gbp(r.ucWithout, 2)], ['Universal Credit after deducting CA', gbp(r.ucWith, 2)], ['Carer’s Allowance a month', gbp(r.caMonthly, 2)], ['Total with CA', test.eligible ? gbp(r.totalWith, 2) : `CA not payable: earnings over ${gbp(P.carers.earningsLimit)} a week`]],
      note: `Single carer aged 25 or over, caring ${P.carers.hoursPerWeek} hours a week. The carer element is paid either way; claiming Carer’s Allowance adds Class 1 National Insurance credits.`,
    };
  },
});
