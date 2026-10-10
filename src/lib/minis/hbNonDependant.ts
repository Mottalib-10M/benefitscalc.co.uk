/** Housing Benefit non-dependant deduction (DWP table 2026/27): what a grown-up son or daughter at home costs the claim. */
import { hbNonDep } from '../engine/pension';
import { P, weeklyToMonthly } from '../engine/params';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'What an adult living with you takes off Housing Benefit',
  cta: 'Work out your full Housing Benefit',
  inputs: [
    { id: 'rent', label: 'Eligible rent a week', def: 140, unit: '£', max: 2000 },
    { id: 'work', label: 'Is the adult in paid work?', def: 1, options: [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }] },
    { id: 'gross', label: 'Their gross pay a week', def: 420, unit: '£', max: 5000 },
  ],
  run: ({ rent, work, gross }) => {
    const d = hbNonDep(work === 1, gross);
    const left = Math.max(0, rent - d);
    return {
      head: ['Deduction a week', gbp(d, 2)],
      rows: [['Rent Housing Benefit can still meet', `${gbp(left, 2)} a week`], ['Deduction a month', gbp(weeklyToMonthly(d), 2)], ['Deduction a year', gbp(d * 52)]],
      note: `Lowest band ${gbp(P.housingBenefit.nonDepNotWorking, 2)}, highest ${gbp(P.housingBenefit.nonDepWorking[P.housingBenefit.nonDepWorking.length - 1][1], 2)}. Your council checks whether an exemption applies to your household.`,
    };
  },
});
