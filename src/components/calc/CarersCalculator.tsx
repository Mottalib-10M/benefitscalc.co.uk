/** Carer's Allowance 2026/27: the £204 earnings test with the deductions GOV.UK allows, and what reaches you. */
import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import Toggle from '../ui/Toggle';
import { ResultCard, Actions, Frame, useUrlState } from './kit';
import { carersEarnings, carersWithPension } from '../../lib/engine/family';
import { P } from '../../lib/engine/params';
import { formatMoney } from '../../lib/format';
const yes = [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }];
export default function CarersCalculator({ methodHref }: { methodHref?: string }) {
  const [s, set] = useUrlState({ net: 180, pen: 0, care: 0, exp: 0, hrs: '1', sp: 0 });
  const e = useMemo(() => carersEarnings({ netEarnings: s.net, pensionContrib: s.pen, careCosts: s.care, otherExpenses: s.exp }), [s]);
  const paid = s.hrs === '1' && e.eligible ? (s.sp > 0 ? carersWithPension(s.sp) : P.carers.allowance) : 0;
  const g = (n: number) => formatMoney(n, 2);
  return (
    <Frame>
      <form className="grid content-start gap-x-4 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <NumberField id="ca-net" label="Weekly earnings after tax and NI" value={s.net} onChange={(v) => set('net', v)} unit="£" max={10000} decimals={2} help="Average over your pay period" />
        <NumberField id="ca-pen" label="Your pension contributions a week" value={s.pen} onChange={(v) => set('pen', v)} unit="£" max={2000} decimals={2} help="Half of them is deducted" />
        <NumberField id="ca-care" label="Paid care while you work, a week" value={s.care} onChange={(v) => set('care', v)} unit="£" max={2000} decimals={2} help="Up to half your earnings; not a close relative" />
        <NumberField id="ca-exp" label="Other work expenses a week" value={s.exp} onChange={(v) => set('exp', v)} unit="£" max={2000} decimals={2} help="Equipment, travel between workplaces" />
        <Toggle id="ca-hrs" label="Caring 35 hours a week or more" value={s.hrs} onChange={(v) => set('hrs', v)} options={yes} />
        <NumberField id="ca-sp" label="State Pension you get a week" value={s.sp} onChange={(v) => set('sp', v)} unit="£" max={2000} decimals={2} help="Leave empty if none" />
      </form>
      <div className="mt-6">
        <ResultCard label="Carer’s Allowance paid a week" value={g(paid)} sub={e.eligible ? `Counted earnings ${g(e.counted)}: ${g(e.headroom)} under the ${g(e.limit)} limit` : `Counted earnings ${g(e.counted)} are over the ${g(e.limit)} limit: no Carer’s Allowance for that week`} methodHref={methodHref}
          lines={[
            { label: 'Earnings after tax and NI', value: g(s.net) },
            ...(s.pen ? [{ label: 'less half of pension contributions', value: `−${g(s.pen / 2)}`, tone: 'red' as const }] : []),
            ...(s.care ? [{ label: 'less care costs (max half of earnings)', value: `−${g(Math.min(s.care, s.net / 2))}`, tone: 'red' as const }] : []),
            ...(s.exp ? [{ label: 'less other expenses', value: `−${g(s.exp)}`, tone: 'red' as const }] : []),
            { label: 'Earnings counted', value: g(e.counted), strong: true, share: Math.min(1, e.counted / e.limit) },
            ...(s.sp > 0 ? [{ label: 'State Pension overlap: only the difference is paid', value: g(carersWithPension(s.sp)) }] : []),
          ]}
          note={<p>The limit is a cliff edge: one penny over and nothing is paid for that week. Carer’s Allowance counts as income for Universal Credit and is taxable. In Scotland the equivalent is Carer Support Payment.</p>} />
        <Actions summary={() => `Carer’s Allowance: ${g(paid)} a week, counted earnings ${g(e.counted)} (limit ${g(e.limit)}).`} />
      </div>
    </Frame>
  );
}
