/** Carer's Credit: who qualifies at 20 hours a week, and what the credited years are worth in State Pension. */
import { carersCredit } from '../engine/carers-extra';
import { P } from '../engine/params';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

const B = ['yes', 'certificate', 'no'] as const;
export default (): MiniSpec => ({
  title: 'Carer’s Credit and your State Pension',
  cta: 'See whether Carer’s Allowance pays you too',
  inputs: [
    { id: 'hrs', label: 'Hours you care a week, all people together', def: 22, max: 168 },
    { id: 'ben', label: 'The person gets a qualifying disability benefit', def: 0, options: [{ value: '0', label: 'Yes' }, { value: '1', label: 'No, but a professional will sign the Care Certificate' }, { value: '2', label: 'No' }] },
    { id: 'yrs', label: 'Years of caring to cover', def: 5, max: 50 },
  ],
  run: ({ hrs, ben, yrs }) => {
    const r = carersCredit({ hours: hrs, benefit: B[ben] ?? 'no' });
    const y = Math.min(Math.max(0, Math.floor(yrs)), P.statePension.qualifyingYearsFull);
    const label = r.route === 'apply' ? 'Yes: apply with the claim form' : r.route === 'certificate' ? 'Possibly: with a signed Care Certificate' : hrs < P.carersCredit.hoursPerWeek ? `No: under ${P.carersCredit.hoursPerWeek} hours a week` : 'No qualifying benefit';
    return {
      head: ['Carer’s Credit', label],
      rows: [['Each credited year adds, at most', `${gbp(r.perYear, 2)} a week of State Pension`], [`${y} years could add`, r.eligible ? `${gbp(r.perYear * y, 2)} a week, ${gbp(r.perYearAnnual * y)} a year` : gbp(0)], ['Breaks allowed', `Up to ${P.carersCredit.breakWeeks} weeks in a row`]],
      note: `Only years that would otherwise be gaps add anything: the new State Pension stops rising at ${P.statePension.qualifyingYearsFull} qualifying years.`,
    };
  },
});
