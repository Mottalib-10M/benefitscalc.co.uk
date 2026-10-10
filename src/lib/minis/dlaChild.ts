/** DLA for children: weekly and 4-weekly amount from the two components, with the mobility age limits. */
import { dlaChild, type DlaCare, type DlaMobility } from '../engine/disability-extra';
import { P } from '../engine/params';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

const CARE: DlaCare[] = ['none', 'lowest', 'middle', 'highest'];
const MOB: DlaMobility[] = ['none', 'lower', 'higher'];
export default (): MiniSpec => ({
  title: 'DLA for your child in 2026/27',
  cta: 'See the carer’s side: Carer’s Allowance',
  inputs: [
    { id: 'age', label: 'Child’s age (years)', def: 4, max: 15 },
    { id: 'care', label: 'Care component', def: 2, options: [{ value: '0', label: 'None' }, { value: '1', label: 'Lowest' }, { value: '2', label: 'Middle' }, { value: '3', label: 'Highest' }] },
    { id: 'mob', label: 'Mobility component', def: 2, options: [{ value: '0', label: 'None' }, { value: '1', label: 'Lower' }, { value: '2', label: 'Higher' }] },
  ],
  run: ({ age, care, mob }) => {
    const r = dlaChild(CARE[care] ?? 'none', MOB[mob] ?? 'none', Math.max(0, Math.floor(age)));
    const mobNote = !r.mobAllowed ? `Not before age ${mob === 1 ? P.dla.mobilityLowerFromAge : P.dla.mobilityHigherFromAge}` : gbp(r.mobilityWeekly, 2);
    return {
      head: [`Every ${P.dla.paidEveryWeeks} weeks`, gbp(r.fourWeekly, 2)],
      rows: [['Care component a week', gbp(r.careWeekly, 2)], ['Mobility component a week', mobNote], ['A year', gbp(r.yearly)], ['Parent can claim Carer’s Allowance', r.carerQualifies ? `Yes, if caring ${P.carers.hoursPerWeek} hours a week` : 'No: needs the middle or highest care rate']],
    };
  },
});
