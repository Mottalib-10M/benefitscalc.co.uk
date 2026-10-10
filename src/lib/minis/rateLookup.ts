/** Look up a 2026/27 benefit rate and see it weekly, monthly and yearly. */
import { RATE_TABLE, rateEquivalents } from '../engine/support';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'One benefit rate, in every period',
  cta: 'Check which benefits your household can get',
  inputs: [
    { id: 'rate', label: 'Benefit and rate', def: RATE_TABLE.findIndex((r) => r.key === 'carers'), options: RATE_TABLE.map((r, i) => ({ value: String(i), label: `${r.group}: ${r.label}` })) },
  ],
  run: ({ rate }) => {
    const r = RATE_TABLE[rate] ?? RATE_TABLE[0];
    const e = rateEquivalents(r);
    return {
      head: [r.label, `${gbp(r.amount, 2)} a ${r.per}`],
      rows: [['A week', gbp(e.weekly, 2)], ['A month', gbp(e.monthly, 2)], ['A year', gbp(e.yearly)]],
      note: r.per === 'month' ? 'Published as a monthly rate; the weekly figure is the month × 12 ÷ 52.' : 'Published as a weekly rate; the monthly figure is the week × 52 ÷ 12, the way Universal Credit converts it.',
    };
  },
});
