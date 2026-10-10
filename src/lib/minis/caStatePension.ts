/** Carer's Allowance at State Pension age: the overlapping benefits rule and the Pension Credit carer amount. */
import { caAtPensionAge } from '../engine/carers-extra';
import { P } from '../engine/params';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'Carer’s Allowance once you get a State Pension',
  cta: 'Check your full Pension Credit',
  inputs: [
    { id: 'sp', label: 'Your State Pension a week', def: 195, unit: '£', max: 1000, decimals: 2 },
    { id: 'oth', label: 'Other pensions a week', def: 0, unit: '£', max: 2000, decimals: 2 },
  ],
  run: ({ sp, oth }) => {
    const r = caAtPensionAge({ statePension: sp, otherIncome: oth });
    return {
      head: ['Better off a week by claiming', gbp(r.weeklyGain, 2)],
      rows: [['Carer’s Allowance actually paid', r.underlying ? `${gbp(0, 2)} (underlying entitlement)` : gbp(r.caPaid, 2)], ['Pension Credit without a claim', gbp(r.pcWithout, 2)], ['Pension Credit with the carer amount', gbp(r.pcWith, 2)], ['Over a year', gbp(r.weeklyGain * 52)]],
      note: r.weeklyGain === 0 ? `Income is above the Pension Credit level even with the ${gbp(P.pensionCredit.carer, 2)} carer amount: a claim gains nothing here unless rent or Council Tax help comes into play.` : undefined,
    };
  },
});
