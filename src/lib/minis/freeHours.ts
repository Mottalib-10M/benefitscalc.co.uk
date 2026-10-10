/** Free Childcare for Working Parents (England): the 3-month minimum earnings test for one parent. */
import { freeHoursEarnings } from '../engine/family-grants';
import { P } from '../engine/params';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'Do you earn enough for the 30 hours?',
  cta: 'Add Tax-Free Childcare to the free hours',
  inputs: [
    { id: 'age', label: 'Your age', def: 29, unit: 'years', max: 75 },
    { id: 'hours', label: 'Hours you work a week', def: 18, unit: 'hours', max: 80 },
    { id: 'pay', label: 'Hourly pay before tax', def: 13.5, unit: '£', max: 500, decimals: 2 },
  ],
  run: ({ age, hours, pay }) => {
    const r = freeHoursEarnings(age, hours, pay);
    return {
      head: ['Earnings test', r.passes ? 'Passed' : `Short by ${gbp(r.gap, 2)}`],
      rows: [
        ['Your pay over the next 3 months', gbp(r.expected3m, 2)],
        ['Minimum for your age', gbp(r.needed, 2)],
        ['Pay over a year', gbp(r.year)],
      ],
      note: `A partner must pass the same test. Neither of you may expect adjusted net income above ${gbp(P.childcare.incomeCap)}. Self-employed in your first 12 months: no minimum applies.`,
    };
  },
});
