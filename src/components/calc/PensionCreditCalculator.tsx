/** Pension Credit 2026/27: guarantee credit plus savings credit, with the extra amounts. */
import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import Toggle from '../ui/Toggle';
import SelectField from '../ui/SelectField';
import { ResultCard, Actions, Frame, useUrlState } from './kit';
import { computePensionCredit } from '../../lib/engine/pension';
import { formatMoney } from '../../lib/format';
const yes = [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }];
export default function PensionCreditCalculator({ methodHref }: { methodHref?: string }) {
  const [s, set] = useUrlState({ hh: 'single', inc: 200, oth: 0, save: 0, sd: '0', car: '0', kids: 0, old: '0', hc: 0 });
  const couple = s.hh === 'couple';
  const r = useMemo(() => computePensionCredit({ couple, income: s.inc + s.oth, qualifyingIncome: s.inc, savings: s.save, severeDisability: Number(s.sd) as 0 | 1 | 2, carer: Number(s.car) as 0 | 1, children: s.kids, spaBefore2016: s.old === '1', housingCosts: s.hc }), [s, couple]);
  const g = (n: number, d = 2) => formatMoney(n, d);
  return (
    <Frame>
      <form className="grid gap-x-4 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <Toggle id="pc-hh" label="Household" value={s.hh} onChange={(v) => set('hh', v)} options={[{ value: 'single', label: 'Single' }, { value: 'couple', label: 'Couple' }]} />
        <NumberField id="pc-inc" label="State Pension and other pensions a week" value={s.inc} onChange={(v) => set('inc', v)} unit="£" max={5000} decimals={2} help="Before tax; joint for a couple" />
        <NumberField id="pc-oth" label="Other weekly income counted" value={s.oth} onChange={(v) => set('oth', v)} unit="£" max={5000} decimals={2} help="Earnings, Carer’s Allowance. Not PIP, AA or Child Benefit" />
        <NumberField id="pc-save" label="Savings and investments" value={s.save} onChange={(v) => set('save', v)} unit="£" max={10000000} help="First £10,000 ignored, no upper limit" />
        <SelectField id="pc-sd" label="Severe disability addition" value={s.sd} onChange={(v) => set('sd', v)} options={[{ value: '0', label: 'No' }, { value: '1', label: 'Yes (one person)' }, { value: '2', label: 'Yes (both of a couple)' }]} help="AA, PIP daily living or similar, no carer paid for you" />
        <Toggle id="pc-car" label="You get Carer’s Allowance" value={s.car} onChange={(v) => set('car', v)} options={yes} />
        <NumberField id="pc-kids" label="Children you are responsible for" value={s.kids} onChange={(v) => set('kids', v)} unit="children" max={10} />
        <Toggle id="pc-old" label="State Pension age reached before 6 April 2016" value={s.old} onChange={(v) => set('old', v)} options={yes} />
        <NumberField id="pc-hc" label="Ground rent or service charges a week" value={s.hc} onChange={(v) => set('hc', v)} unit="£" max={2000} decimals={2} />
      </form>
      <div className="mt-6">
        <ResultCard label="Pension Credit a week (estimate)" value={g(r.total)} sub={r.total > 0 ? `About ${formatMoney(r.total * 52)} a year` : 'Your income is above your guaranteed amount'} methodHref={methodHref}
          lines={[
            { label: 'Standard minimum guarantee', value: g(r.smg), share: r.appropriate ? r.smg / r.appropriate : 0 },
            ...(r.extras.sd ? [{ label: 'Severe disability addition', value: g(r.extras.sd) }] : []),
            ...(r.extras.carer ? [{ label: 'Carer addition', value: g(r.extras.carer) }] : []),
            ...(r.extras.childAdd ? [{ label: 'Children', value: g(r.extras.childAdd) }] : []),
            { label: 'Your income counted (with savings)', value: `−${g(r.income)}`, tone: 'red' as const },
            ...(r.tariff ? [{ label: 'of which assumed from savings', value: g(r.tariff) }] : []),
            { label: 'Guarantee Credit', value: g(r.guarantee), strong: true },
            { label: 'Savings Credit', value: g(r.savingsCredit), strong: true },
          ]}
          note={<p>Even a few pence of Guarantee Credit opens Housing Benefit at the maximum, Council Tax Reduction, Cold Weather Payments and help with NHS costs.</p>} />
        <Actions summary={() => `Pension Credit estimate: ${g(r.total)} a week (2026/27).`} />
      </div>
    </Frame>
  );
}
