/** Child Benefit 2026/27 and the High Income Child Benefit Charge. */
import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import { ResultCard, Actions, Frame, useUrlState } from './kit';
import { childBenefitWeekly, childBenefitYear, hicbc } from '../../lib/engine/family';
import { P } from '../../lib/engine/params';
import { formatMoney } from '../../lib/format';
export default function ChildBenefitCalculator({ methodHref }: { methodHref?: string }) {
  const [s, set] = useUrlState({ kids: 2, inc: 45000 });
  const r = useMemo(() => { const y = childBenefitYear(s.kids); return { w: childBenefitWeekly(s.kids), y, h: hicbc(s.inc, y) }; }, [s]);
  const g = (n: number, d = 0) => formatMoney(n, d);
  return (
    <Frame>
      <form className="grid gap-x-4 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <NumberField id="cb-kids" label="Children you claim for" value={s.kids} onChange={(v) => set('kids', v)} unit="children" max={15} help="Under 16, or under 20 in approved education" />
        <NumberField id="cb-inc" label="Higher earner’s adjusted net income" value={s.inc} onChange={(v) => set('inc', v)} unit="£" max={10000000} help="A year, before personal allowance, after pension contributions" />
      </form>
      <div className="mt-6">
        <ResultCard label="Child Benefit you keep in 2026/27" value={g(r.h.net)} sub={`${g(r.w, 2)} a week, paid every 4 weeks (${g(r.w * 4, 2)})`} methodHref={methodHref}
          lines={[
            { label: 'Child Benefit for the year (52 weeks)', value: g(r.y, 2), share: 1 },
            { label: `High Income Child Benefit Charge (${r.h.pct}%)`, value: `−${g(r.h.charge)}`, tone: 'red' as const, share: r.y ? r.h.charge / r.y : 0 },
          ]}
          note={<p>The charge takes 1% of the year’s Child Benefit for every £{P.childBenefit.hicbcPerPct} of income above {g(P.childBenefit.hicbcThreshold)}, all of it at {g(P.childBenefit.hicbcUpper)}. Claim anyway if you opt out of payments: the claim gives National Insurance credits while a child is under 12.</p>} />
        <Actions summary={() => `Child Benefit ${g(r.y, 2)} a year, charge ${g(r.h.charge)}, kept ${g(r.h.net)}.`} />
      </div>
    </Frame>
  );
}
