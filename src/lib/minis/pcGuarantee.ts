/** Pension Credit Guarantee Credit from weekly income and savings (2026/27). */
import { computePensionCredit } from '../engine/pension';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';
export default (): MiniSpec => ({
  title: 'Is your income below the Pension Credit guarantee?',
  cta: 'Full Pension Credit calculator',
  inputs: [
    { id: 'couple', label: 'Household', def: 0, options: [{ value: '0', label: 'Single' }, { value: '1', label: 'Couple' }] },
    { id: 'inc', label: 'Pension income a week', def: 210, unit: '£', max: 5000, decimals: 2 },
    { id: 'save', label: 'Savings', def: 8000, unit: '£', max: 10000000 },
  ],
  run: ({ couple, inc, save }) => {
    const r = computePensionCredit({ couple: couple === 1, income: inc, savings: save });
    return { head: ['Guarantee Credit a week', gbp(r.guarantee, 2)], rows: [['Guaranteed amount', gbp(r.smg, 2)], ['Income counted with savings', gbp(r.income, 2)], ['A year', gbp(r.guarantee * 52)]], note: r.guarantee > 0 ? 'Any award also opens maximum Housing Benefit and Council Tax Reduction.' : 'Above the guarantee: disability, caring or housing costs can still raise it.' };
  },
});
