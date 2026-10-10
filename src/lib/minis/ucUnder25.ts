/** Universal Credit under 25: standard allowance by age and partner, with what the age band also changes. */
import { standardAllowance } from '../engine/uc';
import { P } from '../engine/params';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

const U = P.uc;
export default (): MiniSpec => ({
  title: 'Your standard allowance under 25',
  cta: 'Add rent and earnings in the calculator',
  inputs: [
    { id: 'age', label: 'Your age', def: 22, max: 30 },
    { id: 'p', label: 'Partner', def: 0, options: [{ value: '0', label: 'No partner' }, { value: '1', label: 'Partner under 25' }, { value: '2', label: 'Partner 25 or over' }] },
  ],
  run: ({ age, p }) => {
    const couple = p > 0;
    const sa = standardAllowance(couple, age, p === 2 ? 25 : p === 1 ? 20 : age);
    const top = couple ? U.standard.couple25 : U.standard.single25;
    const band = sa === top ? (couple ? 'couple25' : 'single25') : (couple ? 'coupleUnder25' : 'singleUnder25');
    return {
      head: ['Standard allowance a month', gbp(sa, 2)],
      rows: [['Less than the 25-or-over rate by', `${gbp(top - sa, 2)} a month`], ['Most taken for debts (15%)', gbp(U.maxDeduction[band as keyof typeof U.maxDeduction], 2)], ['Daily sanction reduction', gbp(U.sanctionDaily100[band as keyof typeof U.sanctionDaily100], 2)]],
    };
  },
});
