/** Carer's Allowance: the weekly payment from the hours and earnings tests, and what it can cost the person cared for. */
import { caWeekly } from '../engine/carers-extra';
import { P } from '../engine/params';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'Carer’s Allowance for your household',
  cta: 'Check the earnings test in detail',
  inputs: [
    { id: 'hrs', label: 'Hours you care a week', def: 40, max: 168 },
    { id: 'earn', label: 'Your earnings a week after tax, NI and expenses', def: 120, unit: '£', max: 5000, decimals: 2 },
    { id: 'sda', label: 'The person you care for gets a severe disability premium or amount', def: 0, options: [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }] },
  ],
  run: ({ hrs, earn, sda }) => {
    const r = caWeekly({ hours: hrs, countedEarnings: earn });
    const why = r.ok ? `Paid: ${gbp(r.headroom, 2)} under the earnings limit` : r.hoursShort > 0 ? `Not paid: ${r.hoursShort} hours short of ${P.carers.hoursPerWeek}` : `Not paid: earnings over ${gbp(P.carers.earningsLimit)} a week`;
    return {
      head: ['Carer’s Allowance a week', gbp(r.weekly, 2)],
      rows: [['Result', why], ['A year', gbp(r.yearly)], ['Every 4 weeks', gbp(r.weekly * 4, 2)], ['Effect on the person you care for', r.ok && sda === 1 ? `Their severe disability addition usually stops (Pension Credit: ${gbp(P.pensionCredit.severeDisability, 2)} a week)` : 'None on their disability benefit']],
    };
  },
});
