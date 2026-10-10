/** Universal Credit and savings: assumed income of £4.35 per £250 or part between £6,000 and £16,000. */
import { tariffIncome } from '../engine/uc';
import { P } from '../engine/params';
import { gbp, num } from './_kit';
import type { MiniSpec } from '../mini-types';

const U = P.uc;
export default (): MiniSpec => ({
  title: 'What your savings take off Universal Credit',
  cta: 'Include savings in a full estimate',
  inputs: [{ id: 'cap', label: 'Savings, investments and other capital', def: 9000, unit: '£', max: 30000 }],
  run: ({ cap }) => {
    const c = Math.max(0, cap);
    if (c > U.capitalUpper) return { head: ['Universal Credit', 'Not payable'], rows: [['Above the upper limit by', gbp(c - U.capitalUpper)], ['Limit', gbp(U.capitalUpper)]], note: 'Spending on debts or reasonable goods is allowed; deliberately getting rid of money is not.' };
    const t = tariffIncome(c);
    return {
      head: ['Taken off each month', gbp(t, 2)],
      rows: [['Blocks of £250 (or part) counted', num(Math.round(t / U.tariffPer250))], ['Over a year', gbp(t * 12, 2)], ['Room before the upper limit', gbp(U.capitalUpper - c)]],
    };
  },
});
