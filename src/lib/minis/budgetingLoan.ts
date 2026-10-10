/** Budgeting Loan or Budgeting Advance 2026/27: highest amount and even repayment. */
import { budgetingMax, budgetingRepayment, type BudgetHousehold } from '../engine/support';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

const HH: BudgetHousehold[] = ['single', 'couple', 'children'];
export default (): MiniSpec => ({
  title: 'How much you can borrow, and what comes off each payment',
  cta: 'Check every benefit your household can get',
  inputs: [
    { id: 'uc', label: 'Benefit you get', def: 1, options: [{ value: '0', label: 'Pension Credit, income-based JSA, income-related ESA or Income Support' }, { value: '1', label: 'Universal Credit' }] },
    { id: 'hh', label: 'Household', def: 2, options: [{ value: '0', label: 'Single' }, { value: '1', label: 'Couple' }, { value: '2', label: 'Children (Child Benefit claimed)' }] },
    { id: 'want', label: 'Amount you need', def: 400, unit: '£', max: 2000 },
  ],
  run: ({ uc, hh, want }) => {
    const onUc = uc === 1;
    const m = budgetingMax(HH[hh] ?? 'single', onUc);
    const amount = want < m.min ? 0 : Math.min(want, m.max);
    const r = budgetingRepayment(amount, onUc);
    return {
      head: [`Most you could get (${m.scheme})`, gbp(m.max)],
      rows: [['Amount you could borrow', amount ? gbp(amount) : `below the ${gbp(m.min)} minimum`], [`Taken off each ${r.period}`, gbp(r.perPeriod, 2)], ['Repayments', r.periods ? `${r.periods} ${r.period}s` : 'none']],
      note: 'An estimate of an even repayment. DWP sets the real amount from your income and what you can afford, and may offer less than you ask for.',
    };
  },
});
