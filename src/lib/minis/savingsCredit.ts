/** Savings Credit: amount A (60% above the threshold, capped) less amount B (40% above the guarantee). */
import { computePensionCredit } from '../engine/pension';
import { P } from '../engine/params';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';
export default (): MiniSpec => ({
  title: 'Your Savings Credit in two steps',
  cta: 'Pension Credit calculator with every addition',
  inputs: [
    { id: 'couple', label: 'Household', def: 0, options: [{ value: '0', label: 'Single' }, { value: '1', label: 'Couple' }] },
    { id: 'inc', label: 'Weekly income (pensions)', def: 245, unit: '£', max: 5000, decimals: 2 },
  ],
  run: ({ couple, inc }) => {
    const c = couple === 1; const PC = P.pensionCredit;
    const thr = c ? PC.savingsThresholdCouple : PC.savingsThresholdSingle; const max = c ? PC.savingsMaxCouple : PC.savingsMaxSingle;
    const a = Math.min(max, Math.max(0, inc - thr) * PC.savingsShareA);
    const b = Math.max(0, inc - (c ? PC.guaranteeCouple : PC.guaranteeSingle)) * PC.savingsShareB;
    const r = computePensionCredit({ couple: c, income: inc, spaBefore2016: true });
    return { head: ['Savings Credit a week', gbp(r.savingsCredit, 2)], rows: [['Amount A: 60% above the threshold, capped', gbp(a, 2)], ['Amount B: 40% above the guarantee', gbp(b, 2)], ['Guarantee Credit as well', gbp(r.guarantee, 2)]], note: 'Only if you or your partner reached State Pension age before 6 April 2016.' };
  },
});
