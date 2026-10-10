/** Benefit cap 2026/27: is your household over it, and by how much. */
import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import Toggle from '../ui/Toggle';
import { ResultCard, Actions, Frame, useUrlState } from './kit';
import { applyCap } from '../../lib/engine/cap';
import { P } from '../../lib/engine/params';
import { formatMoney } from '../../lib/format';
const yes = [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }];
export default function CapCalculator({ methodHref }: { methodHref?: string }) {
  const [s, set] = useUrlState({ fam: '1', lon: '0', ben: 1900, earn: 0, ex: '0', gr: 0 });
  const r = useMemo(() => applyCap({ familyOrCouple: s.fam === '1', london: s.lon === '1', monthlyBenefits: s.ben, earnings: s.earn, exempt: s.ex === '1', graceMonthsLeft: s.gr }), [s]);
  const g = (n: number, d = 2) => formatMoney(n, d);
  return (
    <Frame>
      <form className="grid gap-x-4 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <Toggle id="cap-fam" label="Couple, or children living with you" value={s.fam} onChange={(v) => set('fam', v)} options={yes} />
        <Toggle id="cap-lon" label="Greater London" value={s.lon} onChange={(v) => set('lon', v)} options={yes} />
        <NumberField id="cap-ben" label="Benefits that count, a month" value={s.ben} onChange={(v) => set('ben', v)} unit="£" max={20000} help="UC (with housing), Child Benefit, New Style JSA or ESA" />
        <NumberField id="cap-earn" label="Household take-home pay a month" value={s.earn} onChange={(v) => set('earn', v)} unit="£" max={50000} help={`£${P.benefitCap.earningsExemptMonthly} or more lifts the cap`} />
        <Toggle id="cap-ex" label="PIP, DLA, AA, Carer’s Allowance or LCWRA" value={s.ex} onChange={(v) => set('ex', v)} options={yes} />
        <NumberField id="cap-gr" label="Months left of a grace period" value={s.gr} onChange={(v) => set('gr', v)} unit="months" max={9} />
      </form>
      <div className="mt-6">
        <ResultCard label="Benefit lost to the cap each month" value={g(r.loss)} sub={r.reason === 'exempt' ? 'Exempt: the cap does not apply' : r.reason === 'earnings' ? 'Earnings at or above the threshold: the cap does not apply' : r.reason === 'grace' ? 'Grace period: the cap is not applied yet' : `Cap for your household: ${g(r.level)} a month`} methodHref={methodHref}
          lines={[{ label: 'Benefits counted', value: g(s.ben), share: 1 }, { label: 'Cap', value: g(r.level), share: s.ben ? Math.min(1, r.level / s.ben) : 0 }, { label: 'Paid after the cap', value: g(r.after), strong: true }]}
          note={<p>Cap amounts unchanged from 2025/26: {formatMoney(P.benefitCap.annual.restFamily)} a year for families outside London, {formatMoney(P.benefitCap.annual.londonFamily)} in London. Child Benefit counts towards it even though it is paid in full.</p>} />
        <Actions summary={() => `Benefit cap: ${g(r.loss)} a month lost (2026/27).`} />
      </div>
    </Frame>
  );
}
