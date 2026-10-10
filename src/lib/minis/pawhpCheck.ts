/** Pension Age Winter Heating Payment 2026/27 (Scotland). */
import { pawhp } from '../engine/winter-scot';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';
export default (): MiniSpec => ({
  title: 'Your Pension Age Winter Heating Payment',
  cta: 'Winter Fuel Payment (England, Wales, NI)',
  inputs: [
    { id: 'age', label: 'Born', def: 0, options: [{ value: '0', label: '28 Sept 1946 to 27 June 1960' }, { value: '1', label: 'Before 28 Sept 1946' }, { value: '2', label: 'After 27 June 1960' }] },
    { id: 'liv', label: 'In 21 to 27 September 2026', def: 0, options: [{ value: '0', label: 'Lived alone or no one else eligible' }, { value: '1', label: 'With someone eligible, born 1946 to 1960' }, { value: '2', label: 'With someone eligible, born before 28 Sept 1946' }] },
    { id: 'inc', label: 'Your own income in 2026/27', def: 21000, unit: '£', max: 10000000 },
  ],
  run: ({ age, liv, inc }) => {
    const dob = age === 1 ? '1940-01-01' : age === 2 ? '1961-01-01' : '1952-01-01';
    const r = pawhp({ dob, living: liv === 0 ? 'alone' : 'withEligible', partnerOlder: liv === 2, income: inc });
    return { head: ['Payment for winter 2026 to 2027', gbp(r.amount, 2)], rows: [['Kept after HMRC recovery', gbp(r.net, 2)], ['Paid from', 'November 2026']], note: r.reclaimed ? 'Income over £35,000: HMRC takes it back.' : undefined };
  },
});
