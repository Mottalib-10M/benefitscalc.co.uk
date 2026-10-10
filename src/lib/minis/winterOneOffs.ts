/** Which one-off payments of winter 2026 to 2027 a household can expect, by nation and benefit. */
import { winterOneOffs, oneOffTotal, type OneOffNation, type OneOffBenefit } from '../engine/support';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

const NAT: OneOffNation[] = ['ew', 'scotland', 'ni'];
const BEN: OneOffBenefit[] = ['none', 'ucWork', 'ucQualifying', 'ucOther', 'pc'];
export default (): MiniSpec => ({
  title: 'One-off payments you can expect this winter',
  cta: 'See every benefit your household can claim',
  inputs: [
    { id: 'nat', label: 'Where you live', def: 0, options: [{ value: '0', label: 'England or Wales' }, { value: '1', label: 'Scotland' }, { value: '2', label: 'Northern Ireland' }] },
    { id: 'ben', label: 'Means-tested benefit', def: 4, options: [{ value: '0', label: 'None' }, { value: '1', label: 'Universal Credit, in work' }, { value: '2', label: 'Universal Credit, not working, health element or child under 5' }, { value: '3', label: 'Universal Credit, not working, neither' }, { value: '4', label: 'Pension Credit' }] },
    { id: 'old', label: 'Born on or before 27 June 1960?', def: 1, options: [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }] },
  ],
  run: ({ nat, ben, old }) => {
    const l = winterOneOffs({ nation: NAT[nat] ?? 'ew', benefit: BEN[ben] ?? 'none', pensionAge: old === 1 });
    const rows: Array<[string, string]> = l.slice(0, 4).map((x) => [x.name, x.fixed ? gbp(x.amount) : `${gbp(x.amount)} per cold spell`]);
    if (!rows.length) rows.push(['Automatic payments', 'none on these answers']);
    return {
      head: ['Fixed one-off payments', gbp(oneOffTotal(l))],
      rows,
      note: 'No Cost of Living Payment is planned for 2026/27. In England your council’s Crisis and Resilience Fund can help in a crisis, with or without benefits.',
    };
  },
});
