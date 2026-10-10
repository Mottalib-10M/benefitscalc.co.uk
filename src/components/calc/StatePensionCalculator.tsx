/** New State Pension 2026/27 from qualifying years, with the deferral increase. */
import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import { ResultCard, Actions, Frame, useUrlState } from './kit';
import { newStatePension, deferralIncrease } from '../../lib/engine/pension';
import { P } from '../../lib/engine/params';
import { formatMoney } from '../../lib/format';
export default function StatePensionCalculator({ methodHref }: { methodHref?: string }) {
  const [s, set] = useUrlState({ yrs: 30, def: 0 });
  const r = useMemo(() => { const w = newStatePension(s.yrs); const ex = deferralIncrease(w, s.def); return { w, ex, tot: w + ex }; }, [s]);
  const g = (n: number, d = 2) => formatMoney(n, d);
  const missing = Math.max(0, P.statePension.qualifyingYearsFull - s.yrs);
  return (
    <Frame>
      <form className="grid gap-x-4 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <NumberField id="sp-yrs" label="Qualifying years on your NI record" value={s.yrs} onChange={(v) => set('yrs', v)} unit="years" max={60} help="Your forecast on GOV.UK shows them" />
        <NumberField id="sp-def" label="Weeks you put off claiming" value={s.def} onChange={(v) => set('def', v)} unit="weeks" max={520} help="9 weeks minimum for an increase" />
      </form>
      <div className="mt-6">
        <ResultCard label="New State Pension a week" value={g(r.tot)} sub={`${formatMoney(r.tot * 52)} a year · ${g(r.tot * 4)} every 4 weeks`} methodHref={methodHref}
          lines={[
            { label: `${Math.min(s.yrs, 35)} of ${P.statePension.qualifyingYearsFull} years × ${g(P.statePension.newFull)}`, value: g(r.w), share: r.w / P.statePension.newFull },
            ...(r.ex ? [{ label: `Deferral: 1% for every 9 weeks (${s.def} weeks)`, value: `+${g(r.ex)}` }] : []),
            ...(missing && s.yrs >= 10 ? [{ label: `Each extra year adds`, value: `${g(P.statePension.newFull / 35)} a week` }] : []),
          ]}
          note={<p>{s.yrs < P.statePension.qualifyingYearsMin ? 'Fewer than 10 qualifying years: no new State Pension. ' : ''}This applies the 1/35 rule for records that started after April 2016. Records that began earlier use a starting amount (and may include a protected payment or a contracted-out deduction): your forecast is the reliable figure.</p>} />
        <Actions summary={() => `New State Pension: ${g(r.tot)} a week (${s.yrs} years, 2026/27).`} />
      </div>
    </Frame>
  );
}
