/** Scotland: Carer Support Payment after overlapping benefits, Scottish Carer Supplement and Carer Additional Person Payment. */
import { scottishCarerPackage } from '../engine/carers-extra';
import { P } from '../engine/params';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'Your Scottish carer payments',
  cta: `Check the ${gbp(P.carers.earningsLimit)} earnings test`,
  inputs: [
    { id: 'ov', label: 'State Pension or other overlapping benefit a week', def: 0, unit: '£', max: 1000, decimals: 2 },
    { id: 'add', label: 'Other people you care for 20 hours a week or more', def: 0, max: 6 },
  ],
  run: ({ ov, add }) => {
    const r = scottishCarerPackage({ overlapping: ov, additionalPeople: add });
    return {
      head: [`Every ${P.scotland.cspPaidEveryWeeks} weeks`, gbp(r.fourWeekly, 2)],
      rows: [['Carer Support Payment a week', gbp(r.csp, 2)], ['Scottish Carer Supplement a week', gbp(r.supplement, 2)], ['Carer Additional Person Payment a week', gbp(r.capp, 2)], ['A year', gbp(r.yearly)]],
      note: r.csp === 0 ? `A ${gbp(0)} award (underlying entitlement) carries neither the supplement nor the additional person payment, but can still raise Pension Credit or Universal Credit.` : undefined,
    };
  },
});
