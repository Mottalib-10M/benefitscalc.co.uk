/** Extra Universal Credit for a third or later child since the two-child limit ended (6 April 2026). */
import { childElements } from '../engine/uc';
import { P } from '../engine/params';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'What the end of the two-child limit adds',
  cta: 'Check the whole award, benefit cap included',
  inputs: [
    { id: 'kids', label: 'Children in your claim', def: 3, max: 10 },
    { id: 'exc', label: 'Children already paid under an exception (twins, adoption, kinship)', def: 0, max: 8 },
  ],
  run: ({ kids, exc }) => {
    const n = Math.max(0, Math.round(kids));
    const oldPaid = Math.min(n, 2 + Math.max(0, Math.round(exc)));
    const now = childElements(n);
    const before = childElements(oldPaid);
    const gain = now - before;
    return {
      head: ['Extra Universal Credit a month', gbp(gain, 2)],
      rows: [['Child elements now', gbp(now, 2)], ['Under the old rule', gbp(before, 2)], ['Extra over a year', gbp(gain * 12)]],
      note: gain > 0 ? `The increase counts towards the benefit cap of ${gbp(P.benefitCap.monthly.restFamily, 2)} a month outside London unless the household is exempt.` : 'No change: every child in the claim was already paid for.',
    };
  },
});
