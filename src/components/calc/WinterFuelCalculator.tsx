/** Winter Fuel Payment 2026/27 (England, Wales, Northern Ireland) and the Scottish equivalent. */
import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import { DateField, ResultCard, Actions, Frame, useUrlState } from './kit';
import { winterFuel, type Living } from '../../lib/engine/winter';
import { P } from '../../lib/engine/params';
import { formatMoney } from '../../lib/format';
export default function WinterFuelCalculator({ methodHref }: { methodHref?: string }) {
  const [s, set] = useUrlState({ dob: '1952-03-10', liv: 'alone', po: '0', inc: 22000 });
  const r = useMemo(() => winterFuel({ dob: s.dob, living: s.liv as Living, partnerOlder: s.po === '1', income: s.inc }), [s]);
  const g = (n: number) => formatMoney(n);
  return (
    <Frame>
      <form className="grid gap-x-4 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <DateField id="wf-dob" label="Your date of birth" value={s.dob} onChange={(v) => set('dob', v)} help="On or before 27 June 1960 to qualify" />
        <SelectField id="wf-liv" label="During 21 to 27 September 2026" value={s.liv} onChange={(v) => set('liv', v)} options={[
          { value: 'alone', label: 'I lived alone, or with no one eligible' },
          { value: 'withEligible', label: 'With someone eligible, no means-tested benefit' },
          { value: 'jointMeansTested', label: 'Couple with joint Pension Credit, UC or ESA' },
          { value: 'ownMeansTested', label: 'I get Pension Credit, UC or ESA alone' },
          { value: 'careHome', label: 'In a care home' }]} />
        {(s.liv === 'withEligible' || s.liv === 'jointMeansTested') && <Toggle id="wf-po" label="Other person born before 28 Sept 1946" value={s.po} onChange={(v) => set('po', v)} options={[{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }]} />}
        <NumberField id="wf-inc" label="Your own total income in 2026/27" value={s.inc} onChange={(v) => set('inc', v)} unit="£" max={10000000} help="Partner’s income does not count" />
      </form>
      <div className="mt-6">
        <ResultCard label={`Winter Fuel Payment, winter ${P.winterFuel.winter}`} value={g(r.amount)} sub={r.reclaimed ? `Income over ${g(P.winterFuel.incomeThreshold)}: HMRC takes it back through your tax code or tax return` : r.note || 'Paid automatically to most people in November or December'} methodHref={methodHref}
          lines={[{ label: 'Amount paid', value: g(r.amount) }, { label: 'Kept after HMRC recovery', value: g(r.net), strong: true }]}
          note={<p>Scotland pays Pension Age Winter Heating Payment instead, from {g(P.scotland.pawhp[0])} to {g(P.scotland.pawhp[3])}, with the same £35,000 recovery. Claim deadline for 2026/27 if you are not paid automatically: 31 March 2027.</p>} />
        <Actions summary={() => `Winter Fuel Payment 2026/27: ${g(r.amount)}, kept ${g(r.net)}.`} />
      </div>
    </Frame>
  );
}
