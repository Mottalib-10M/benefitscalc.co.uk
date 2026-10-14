/** Tax-Free Childcare: the government top-up per quarter, with the per-child caps. */
import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import { ResultCard, Actions, Frame, useUrlState } from './kit';
import { taxFreeChildcare } from '../../lib/engine/family';
import { P } from '../../lib/engine/params';
import { formatMoney } from '../../lib/format';
export default function TfcCalculator({ methodHref }: { methodHref?: string }) {
  const [s, set] = useUrlState({ cost: 900, kids: 1, dis: 0 });
  const r = useMemo(() => taxFreeChildcare({ quarterlyCost: s.cost * 3, children: s.kids, disabled: Math.min(s.dis, s.kids) }), [s]);
  const g = (n: number, d = 0) => formatMoney(n, d);
  return (
    <Frame>
      <form className="grid content-start gap-x-4 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <NumberField id="tfc-cost" label="Childcare bill a month" value={s.cost} onChange={(v) => set('cost', v)} unit="£" max={20000} help="Registered or approved provider" />
        <NumberField id="tfc-kids" label="Children in childcare" value={s.kids} onChange={(v) => set('kids', v)} unit="children" max={10} help="Up to 11, or 16 if disabled" />
        <NumberField id="tfc-dis" label="Of whom disabled" value={s.dis} onChange={(v) => set('dis', v)} unit="children" max={10} />
      </form>
      <div className="mt-6">
        <ResultCard label="Government top-up a year" value={g(r.yearTopUp)} sub={`${g(r.topUp, 2)} a quarter; you pay in ${g(r.youPay, 2)}`} methodHref={methodHref}
          lines={[
            { label: 'Bill for 3 months', value: g(s.cost * 3, 2), share: 1 },
            { label: 'Top-up (£2 for every £8 you pay in)', value: g(r.topUp, 2), share: s.cost ? r.topUp / (s.cost * 3) : 0 },
            { label: 'Quarterly cap for your children', value: g(r.capTotal) },
          ]}
          note={<p>Each parent must expect to earn at least {g(P.childcare.minEarnQuarter21, 2)} over the next 3 months (21 or over) and no more than {g(P.childcare.incomeCap)} adjusted net income. You cannot get Tax-Free Childcare and Universal Credit childcare costs together.</p>} />
        <Actions summary={() => `Tax-Free Childcare top-up: ${g(r.yearTopUp)} a year.`} />
      </div>
    </Frame>
  );
}
