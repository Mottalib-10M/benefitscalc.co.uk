/**
 * Home checker: one household, every benefit at once. Each line is computed by the engine of the full
 * calculator it links to (never a second calculation) and says what it assumes.
 */
import { useMemo, useRef } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import { Actions, Frame, StickyBar, useBelow, useUrlState } from './kit';
import { computeUc } from '../../lib/engine/uc';
import { computePensionCredit } from '../../lib/engine/pension';
import { childBenefitWeekly, carersEarnings } from '../../lib/engine/family';
import { P, weeklyToMonthly } from '../../lib/engine/params';
import { formatMoney } from '../../lib/format';

interface Row { name: string; amount: number; note: string; href?: string }
const yes = [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }];
export default function BenefitsChecker({ links = {} }: { links?: Record<string, string> }) {
  const [s, set] = useUrlState({ age: 35, hh: 'single', kids: 1, earn: 900, rent: 650, hous: 'private', dis: 'none', car: '0', nat: 'england' });
  const couple = s.hh === 'couple';
  const pension = s.age >= 66;
  const rows = useMemo<Row[]>(() => {
    const out: Row[] = [];
    const cbW = childBenefitWeekly(s.kids);
    if (s.kids > 0) out.push({ name: 'Child Benefit', amount: weeklyToMonthly(cbW), note: `${formatMoney(cbW, 2)} a week; repaid through tax above £60,000 income`, href: links.cb });
    if (!pension) {
      const uc = computeUc({ couple, age: s.age, children: s.kids, earnings: s.earn, housing: s.hous as 'none' | 'private' | 'social', rent: s.rent, carer: s.car === '1', capExempt: s.dis !== 'none' || s.car === '1' });
      out.push({ name: 'Universal Credit', amount: uc.award, note: s.hous === 'private' ? 'rent taken as entered; the full calculator applies your area’s LHA cap' : 'monthly assessment, 55% taper', href: links.uc });
      if (s.dis !== 'none') out.push({ name: s.nat === 'scotland' ? 'Adult Disability Payment (if awarded)' : 'Personal Independence Payment (if awarded)', amount: weeklyToMonthly(s.dis === 'both' ? P.pip.dailyStandard + P.pip.mobilityStandard : P.pip.dailyStandard), note: `standard rate shown; up to ${formatMoney(weeklyToMonthly(P.pip.dailyEnhanced + P.pip.mobilityEnhanced))} a month at the enhanced rates`, href: links.pip });
    } else {
      const pc = computePensionCredit({ couple, income: (s.earn * 12) / 52 });
      out.push({ name: 'Pension Credit', amount: weeklyToMonthly(pc.total), note: 'income entered taken as weekly pension income ÷ 4.33', href: links.pc });
      if (s.dis !== 'none') out.push({ name: s.nat === 'scotland' ? 'Pension Age Disability Payment (if awarded)' : 'Attendance Allowance (if awarded)', amount: weeklyToMonthly(P.aa.lower), note: `lower rate; ${formatMoney(P.aa.higher, 2)} a week if help is needed day and night`, href: links.aa });
      out.push({ name: s.nat === 'scotland' ? 'Pension Age Winter Heating Payment' : 'Winter Fuel Payment', amount: 0, note: s.nat === 'scotland' ? `${formatMoney(P.scotland.pawhp[0], 2)} to ${formatMoney(P.scotland.pawhp[3], 2)} once a year` : `£${P.winterFuel.base} or £${P.winterFuel.older} once a year, if born on or before 27 June 1960`, href: links.wfp });
    }
    if (s.car === '1') {
      const ok = carersEarnings({ netEarnings: (s.earn * 12) / 52 }).eligible;
      out.push({ name: s.nat === 'scotland' ? 'Carer Support Payment' : 'Carer’s Allowance', amount: ok ? weeklyToMonthly(P.carers.allowance) : 0, note: ok ? 'deducted in full from Universal Credit, which adds the carer element' : `earnings above £${P.carers.earningsLimit} a week`, href: links.ca });
    }
    if (s.kids > 0 && s.nat === 'scotland' && !pension) out.push({ name: 'Scottish Child Payment', amount: weeklyToMonthly(P.scotland.childPayment * s.kids), note: `${formatMoney(P.scotland.childPayment, 2)} a week per child under 16, with Universal Credit` });
    return out;
  }, [s, couple, pension, links]);
  const total = rows.reduce((t, r) => t + r.amount, 0);
  const g = (n: number) => formatMoney(n);
  const card = useRef<HTMLDivElement>(null);
  const below = useBelow(card);
  return (
    <Frame>
      <form className="grid content-start gap-x-4 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <NumberField id="ck-age" label="Your age" value={s.age} onChange={(v) => set('age', v)} unit="years" max={120} help="66 or over: pension-age benefits" />
        <Toggle id="ck-hh" label="Household" value={s.hh} onChange={(v) => set('hh', v)} options={[{ value: 'single', label: 'Single' }, { value: 'couple', label: 'Couple' }]} />
        <NumberField id="ck-kids" label="Children" value={s.kids} onChange={(v) => set('kids', v)} unit="children" max={15} />
        <NumberField id="ck-earn" label="Take-home income a month" value={s.earn} onChange={(v) => set('earn', v)} unit="£" max={50000} help="Pay, or pensions if retired" />
        <SelectField id="ck-hous" label="Housing" value={s.hous} onChange={(v) => set('hous', v)} options={[{ value: 'none', label: 'No rent' }, { value: 'private', label: 'Private rent' }, { value: 'social', label: 'Social rent' }]} />
        <NumberField id="ck-rent" label="Rent a month" value={s.rent} onChange={(v) => set('rent', v)} unit="£" max={20000} />
        <SelectField id="ck-dis" label="Disability or long-term condition" value={s.dis} onChange={(v) => set('dis', v)} options={[{ value: 'none', label: 'No' }, { value: 'daily', label: 'Needs help with daily living' }, { value: 'both', label: 'Daily living and getting around' }]} />
        <Toggle id="ck-car" label="Caring 35 hours a week" value={s.car} onChange={(v) => set('car', v)} options={yes} />
        <SelectField id="ck-nat" label="Where you live" value={s.nat} onChange={(v) => set('nat', v)} options={[{ value: 'england', label: 'England' }, { value: 'wales', label: 'Wales' }, { value: 'scotland', label: 'Scotland' }, { value: 'ni', label: 'Northern Ireland' }]} />
      </form>
      <div className="mt-6">
      <div ref={card} aria-live="polite" data-resultat className="result-card p-5">
        <p className="text-sm font-medium text-navy-700">Estimated benefits a month, 2026/27</p>
        <p className="tabular-nums mt-1 text-4xl font-bold text-navy-900">{g(total)}</p>
        <table className="mt-4 w-full text-sm"><tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-t border-accent-100 align-top">
              <td className="py-2 pr-3 text-navy-700">{r.href ? <a href={r.href} className="font-medium text-accent-700 underline">{r.name}</a> : <span className="font-medium text-navy-900">{r.name}</span>}<span className="block text-xs text-navy-600">{r.note}</span></td>
              <td className="tabular-nums py-2 text-right text-navy-900">{r.amount ? g(r.amount) : 'yearly'}</td>
            </tr>
          ))}
        </tbody></table>
      </div>
      <StickyBar show={below} label="Estimated benefits a month, 2026/27" value={g(total)} target={card} />
      <Actions summary={() => `Benefits estimate: ${g(total)} a month (2026/27).`} />
      </div>
    </Frame>
  );
}
