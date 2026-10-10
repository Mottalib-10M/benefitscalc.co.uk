/** Housing Benefit for a tenant over State Pension age, 2026/27 (65% taper). */
import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import Toggle from '../ui/Toggle';
import { ResultCard, Actions, Frame, useUrlState } from './kit';
import { computeHbPension } from '../../lib/engine/pension';
import { formatMoney } from '../../lib/format';
const yes = [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }];
export default function HbCalculator({ methodHref }: { methodHref?: string }) {
  const [s, set] = useUrlState({ hh: 'single', late: '1', rent: 130, inc: 260, save: 0, gc: '0', nd: 0 });
  const r = useMemo(() => computeHbPension({ couple: s.hh === 'couple', spaAfterApril2021: s.late === '1', rent: s.rent, income: s.inc, savings: s.save, guaranteeCredit: s.gc === '1', nonDepDeductions: s.nd }), [s]);
  const g = (n: number) => formatMoney(n, 2);
  return (
    <Frame>
      <form className="grid gap-x-4 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <Toggle id="hb-hh" label="Household" value={s.hh} onChange={(v) => set('hh', v)} options={[{ value: 'single', label: 'Single' }, { value: 'couple', label: 'Couple' }]} />
        <Toggle id="hb-late" label="State Pension age reached after 1 April 2021" value={s.late} onChange={(v) => set('late', v)} options={yes} />
        <NumberField id="hb-rent" label="Eligible rent a week" value={s.rent} onChange={(v) => set('rent', v)} unit="£" max={5000} decimals={2} help="Private rent: capped at the LHA rate" />
        <NumberField id="hb-inc" label="Weekly income" value={s.inc} onChange={(v) => set('inc', v)} unit="£" max={5000} decimals={2} help="Pensions, earnings, most benefits (not PIP or AA)" />
        <NumberField id="hb-save" label="Savings" value={s.save} onChange={(v) => set('save', v)} unit="£" max={10000000} help="£10,000 ignored; over £16,000 no HB unless on Guarantee Credit" />
        <Toggle id="hb-gc" label="You get Guarantee Credit" value={s.gc} onChange={(v) => set('gc', v)} options={yes} />
        <NumberField id="hb-nd" label="Non-dependant deductions a week" value={s.nd} onChange={(v) => set('nd', v)} unit="£" max={1000} decimals={2} help="£20.40 to £131.45 per adult living with you" />
      </form>
      <div className="mt-6">
        <ResultCard label="Housing Benefit a week (estimate)" value={g(r.hb)} sub={r.reason === 'guarantee' ? 'Guarantee Credit: your full eligible rent less deductions' : r.reason === 'capital' ? 'Savings over £16,000: no Housing Benefit' : `About ${formatMoney(r.hb * 52)} a year`} methodHref={methodHref}
          lines={r.reason === 'means' ? [
            { label: 'Maximum Housing Benefit', value: g(r.maxHb), share: 1 },
            { label: 'Your applicable amount', value: g(r.applicable) },
            { label: 'Income counted (with savings)', value: g(r.income) },
            { label: '65% of income above the applicable amount', value: `−${g(r.excess * 0.65)}`, tone: 'red' as const },
          ] : [{ label: 'Maximum Housing Benefit', value: g(r.maxHb) }]}
          note={<p>Working-age tenants claim Universal Credit for rent instead, except in supported or temporary housing. Disability and carer premiums raise the applicable amount and are not added here.</p>} />
        <Actions summary={() => `Housing Benefit estimate: ${g(r.hb)} a week (2026/27).`} />
      </div>
    </Frame>
  );
}
