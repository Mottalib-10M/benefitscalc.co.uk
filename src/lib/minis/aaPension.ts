/** Attendance Allowance and the Pension Credit severe disability amount, for a single pensioner. */
import { aaWithPensionCredit } from '../engine/disability-extra';
import { gbp } from './_kit';
import { P } from '../engine/params';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'What Attendance Allowance adds to your week',
  cta: 'Check your whole Pension Credit',
  inputs: [
    { id: 'rate', label: 'Rate', def: 0, options: [{ value: '0', label: 'Lower rate (day or night)' }, { value: '1', label: 'Higher rate (day and night)' }] },
    { id: 'inc', label: 'Your weekly pensions and other income', def: 230, unit: '£', max: 2000, decimals: 2 },
    { id: 'carer', label: 'Someone is paid Carer’s Allowance for you', def: 0, options: [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }] },
  ],
  run: ({ rate, inc, carer }) => {
    const r = aaWithPensionCredit({ rate: rate === 1 ? 'higher' : 'lower', weeklyIncome: inc, carerPaid: carer === 1 });
    return {
      head: ['More a week in total', gbp(r.weeklyGain, 2)],
      rows: [['Attendance Allowance', gbp(r.aa, 2)], ['Pension Credit before', gbp(r.pcBefore, 2)], ['Pension Credit after', gbp(r.pcAfter, 2)], ['Over a year', gbp(r.weeklyGain * 52)]],
      note: carer === 1 ? 'With Carer’s Allowance paid for looking after you, the severe disability amount usually stops; your carer’s own benefits rise instead.' : `Single person, savings under ${gbp(P.pensionCredit.capitalDisregard)}. Attendance Allowance itself is never counted as income.`,
    };
  },
});
