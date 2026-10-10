/** PIP points test: one descriptor per activity, as in Schedule 1 of the PIP Regulations 2013. */
import { useMemo } from 'react';
import SelectField from '../ui/SelectField';
import { ResultCard, Actions, Frame, useUrlState } from './kit';
import { PIP_ACTIVITIES, scorePip } from '../../lib/engine/disability';
import { P } from '../../lib/engine/params';
import { formatMoney } from '../../lib/format';
const label = { none: 'no award', standard: 'standard rate', enhanced: 'enhanced rate' } as const;
export default function PipCalculator({ methodHref }: { methodHref?: string }) {
  const defaults = Object.fromEntries(PIP_ACTIVITIES.map((a) => [`a${a.n}`, 0])) as Record<string, number>;
  const [s, set] = useUrlState(defaults);
  const choice = PIP_ACTIVITIES.map((a) => Number(s[`a${a.n}`] ?? 0));
  const r = useMemo(() => scorePip(choice), [s]); // eslint-disable-line react-hooks/exhaustive-deps
  const g = (n: number) => formatMoney(n, 2);
  const block = (part: 'daily' | 'mobility') => PIP_ACTIVITIES.filter((a) => a.part === part).map((a) => (
    <SelectField key={a.n} id={`pip-${a.n}`} label={`${a.n}. ${a.name}`} value={String(s[`a${a.n}`] ?? 0)} onChange={(v) => set(`a${a.n}`, Number(v))} options={a.d.map((d, i) => ({ value: String(i), label: `${d.code}. ${d.text} (${d.points})` }))} />
  ));
  return (
    <Frame>
      <p className="mb-3 text-sm font-semibold text-navy-800">Daily living activities</p>
      <form className="grid gap-x-4 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>{block('daily')}</form>
      <p className="mb-3 mt-6 text-sm font-semibold text-navy-800">Mobility activities</p>
      <form className="grid gap-x-4 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>{block('mobility')}</form>
      <div className="mt-6">
        <ResultCard label="PIP a week if the assessment agrees" value={g(r.weekly)} sub={`${formatMoney(r.fourWeekly, 2)} every 4 weeks`} methodHref={methodHref}
          lines={[
            { label: `Daily living: ${r.daily} points, ${label[r.dailyRate]}`, value: g(r.dailyWeekly), share: Math.min(1, r.daily / P.pip.thresholdEnhanced) },
            { label: `Mobility: ${r.mobility} points, ${label[r.mobilityRate]}`, value: g(r.mobilityWeekly), share: Math.min(1, r.mobility / P.pip.thresholdEnhanced) },
          ]}
          note={<p>8 points in a component give the standard rate, 12 the enhanced rate. A descriptor counts if it applies on more than half of the days over the required period; only the highest-scoring descriptor of each activity is counted.</p>} />
        <Actions summary={() => `PIP points: daily living ${r.daily}, mobility ${r.mobility}: ${g(r.weekly)} a week (2026/27).`} />
      </div>
    </Frame>
  );
}
