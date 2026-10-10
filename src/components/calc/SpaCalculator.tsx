/** State Pension age from a date of birth (DWP timetable, current law), and Winter Fuel status. */
import { useEffect, useMemo, useState } from 'react';
import { DateField, ResultCard, Actions, Frame, useUrlState } from './kit';
import { statePensionAge } from '../../lib/engine/pension';
import { fullYears, fullMonths } from '../../lib/engine/dates';
import { displayDate } from '../../lib/format';
import { P } from '../../lib/engine/params';
declare const __BUILD_DAY__: string;
export default function SpaCalculator({ methodHref }: { methodHref?: string }) {
  const [s, set] = useUrlState({ dob: '1960-09-15' });
  const r = useMemo(() => statePensionAge(s.dob), [s.dob]);
  const [today, setToday] = useState(__BUILD_DAY__);
  useEffect(() => { setToday(new Date().toISOString().slice(0, 10)); }, []);
  const left = r.date && r.date > today ? fullMonths(today, r.date) : 0;
  const d = (iso: string) => displayDate(iso, 'en-GB');
  return (
    <Frame>
      <form className="grid gap-x-4 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <DateField id="spa-dob" label="Date of birth" value={s.dob} onChange={(v) => set('dob', v)} help="Same rule for men and women since November 2018" />
      </form>
      <div className="mt-6">
        <ResultCard label="You reach State Pension age on" value={r.date ? d(r.date) : 'Already reached'} sub={`State Pension age: ${r.label}`} methodHref={methodHref}
          lines={[
            ...(r.date ? [{ label: 'Age on that day', value: `${fullYears(s.dob, r.date)} years ${fullMonths(s.dob, r.date) % 12} months` }] : []),
            ...(left ? [{ label: 'Time from today', value: `${Math.floor(left / 12)} years ${left % 12} months` }] : []),
            ...(r.date ? [{ label: 'Pension Credit: you can apply from', value: d(addMonthsIso(r.date, -P.pensionCredit.applyMonthsBefore)) }] : []),
            { label: `Winter Fuel Payment ${P.winterFuel.winter}`, value: s.dob <= P.winterFuel.bornOnOrBefore ? 'Eligible by age' : 'Not this winter' },
          ]}
          note={<p>Under current law. The rise from 67 to 68 (2044 to 2046) is under review and could move. People born between 6 April 1960 and 5 March 1961 reach State Pension age at 66 plus a number of months.</p>} />
        <Actions summary={() => `State Pension age: ${r.date ? d(r.date) : 'reached'} (${r.label}).`} />
      </div>
    </Frame>
  );
}
function addMonthsIso(iso: string, n: number) { const [y, m, dd] = iso.split('-').map(Number); const t = new Date(Date.UTC(y, m - 1 + n, 1)); const last = new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth() + 1, 0)).getUTCDate(); return new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), Math.min(dd, last))).toISOString().slice(0, 10); }
