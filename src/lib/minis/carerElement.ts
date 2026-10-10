/** Universal Credit carer element: conditions checked one by one, then the monthly amount. */
import { computeUc } from '../engine/uc';
import { P } from '../engine/params';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

const yn = [{ value: '1', label: 'Yes' }, { value: '0', label: 'No' }];
export default (): MiniSpec => ({
  title: 'Does your claim include the carer element?',
  cta: 'See the whole award with the carer element',
  inputs: [
    { id: 'hours', label: 'Hours of care a week', def: 35, max: 168 },
    { id: 'qual', label: 'The person gets PIP daily living, AA, DLA care (middle or highest) or ADP', def: 1, options: yn },
    { id: 'lcwra', label: 'You have the health element (LCWRA)', def: 0, options: yn },
  ],
  run: ({ hours, qual, lcwra }) => {
    const ok = hours >= P.carers.hoursPerWeek && qual === 1;
    const r = computeUc({ couple: false, age: 30, children: 0, earnings: 0, carer: ok, health: lcwra === 1 ? 'lcwra' : 'none' });
    const carer = r.elements.find((e) => e.key === 'carer')?.amount ?? 0;
    const why = !qual ? 'The person cared for needs a qualifying disability benefit' : hours < P.carers.hoursPerWeek ? `Fewer than ${P.carers.hoursPerWeek} hours a week` : lcwra === 1 ? 'The health element is paid instead' : 'Conditions met';
    return {
      head: ['Carer element a month', gbp(carer, 2)],
      rows: [['Result', why], ['Over a year', gbp(carer * 12)], ['Single person 25+, no other income: award', gbp(r.award, 2)]],
    };
  },
});
