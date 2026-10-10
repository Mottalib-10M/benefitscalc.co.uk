/** Free school meals 2026/27 for a Universal Credit household, by nation and school year. */
import { freeSchoolMeals, type FsmNation, type FsmStage } from '../engine/family-grants';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

const N: FsmNation[] = ['england', 'scotland', 'wales', 'ni'];
const ST: FsmStage[] = ['primary1to3', 'primary4to5', 'primary6to7', 'secondary'];
export default (): MiniSpec => ({
  title: 'Can your child get free school meals?',
  cta: 'Check your Universal Credit award',
  inputs: [
    { id: 'n', label: 'Where you live', def: 0, options: [{ value: '0', label: 'England' }, { value: '1', label: 'Scotland' }, { value: '2', label: 'Wales' }, { value: '3', label: 'Northern Ireland' }] },
    { id: 's', label: 'Child’s school year', def: 3, options: [{ value: '0', label: 'First 3 years of primary' }, { value: '1', label: '4th or 5th year of primary' }, { value: '2', label: '6th or 7th year of primary' }, { value: '3', label: 'Secondary school' }] },
    { id: 'earn', label: 'Household take-home pay a month (on Universal Credit)', def: 1400, unit: '£', max: 20000 },
  ],
  run: ({ n, s, earn }) => {
    const r = freeSchoolMeals(N[n] ?? 'england', ST[s] ?? 'secondary', earn);
    return {
      head: ['Free school meals', r.status === 'yes' ? 'Yes' : r.status === 'no' ? 'Not on earnings' : 'Ask the council'],
      rows: [['Rule that applies', r.rule], ['Earnings entered over a year', gbp(earn * 12)]],
      note: 'Reception counts as the first year of primary in England and Wales; P1 in Scotland and Northern Ireland.',
    };
  },
});
