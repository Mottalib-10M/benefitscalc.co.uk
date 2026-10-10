/** Universal Credit health element (LCWRA): higher or lower amount, and the award it gives. */
import { computeUc } from '../engine/uc';
import { P } from '../engine/params';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

const U = P.uc;
export default (): MiniSpec => ({
  title: 'Your Universal Credit health element',
  cta: 'Add rent, children and a partner in the calculator',
  inputs: [
    { id: 'when', label: 'Your situation', def: 1, options: [{ value: '0', label: 'Health condition reported before 6 April 2026' }, { value: '1', label: 'Reported on or after 6 April 2026' }, { value: '2', label: 'Severe lifelong condition or nearing end of life' }] },
    { id: 'pay', label: 'Take-home pay a month', def: 0, unit: '£', max: 4000 },
  ],
  run: ({ when, pay }) => {
    const health = when === 1 ? 'lcwraNew' : 'lcwra';
    const r = computeUc({ couple: false, age: 30, children: 0, earnings: Math.max(0, pay), health });
    const el = health === 'lcwraNew' ? U.lcwraNew2026 : U.lcwra;
    return {
      head: ['Health element a month', gbp(el, 2)],
      rows: [['Single person 25+, no rent: award', gbp(r.award, 2)], ['Work allowance before the taper', gbp(r.workAllowance)], ['Gap between the two rates over a year', gbp((U.lcwra - U.lcwraNew2026) * 12)]],
      note: pay >= U.wcaEarningsThreshold ? `With pay of ${gbp(U.wcaEarningsThreshold)} a month or more, a Work Capability Assessment is not normally carried out.` : undefined,
    };
  },
});
