/** Universal Credit 2026/27 for one month: six visible fields, the rest under "More circumstances". */
import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import { ResultCard, Actions, Frame, useUrlState } from './kit';
import { computeUc, breakEvenEarnings } from '../../lib/engine/uc';
import { allAreas, bedroomCategory, CAT_LABEL, lhaRate, type BedroomCat } from '../../lib/engine/lha';
import { formatMoney } from '../../lib/format';

const AREAS = allAreas().sort((a, b) => a.brma.localeCompare(b.brma)).map((a) => ({ value: `${a.nation}|${a.brma}`, label: `${a.brma} (${a.nation[0].toUpperCase()}${a.nation.slice(1)})` }));
const yes = [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }];
export default function UcCalculator({ methodHref, compact = false }: { methodHref?: string; compact?: boolean }) {
  const [s, set] = useUrlState({ hh: 'single', age: 30, page: 30, kids: 0, earn: 0, hous: 'none', rent: 0, area: 'england|Birmingham', save: 0, pre: '0', dlo: 0, dhi: 0, hea: 'none', car: '0', cc: 0, une: 0, nd: 0, spare: 0, lon: '0', ex: '0', bed: 'auto', sarx: '0' });
  const couple = s.hh === 'couple';
  const [nation, brma] = s.area.split('|') as ['england' | 'scotland' | 'wales', string];
  const autoCat = bedroomCategory({ couple, age: s.age, children: s.kids, exempt: s.sarx === '1' });
  const cat = (s.bed === 'auto' ? autoCat : Number(s.bed)) as BedroomCat;
  const r = useMemo(() => computeUc({
    couple, age: s.age, partnerAge: couple ? s.page : undefined, children: s.kids, firstChildPre2017: s.pre === '1', disabledChildrenLower: s.dlo, disabledChildrenHigher: s.dhi,
    health: s.hea as 'none' | 'lcwra' | 'lcwraNew', carer: s.car === '1', earnings: s.earn, unearned: s.une, savings: s.save, childcareCosts: s.cc,
    housing: s.hous as 'none' | 'private' | 'social', rent: s.rent, nation, brma, bedrooms: cat, spareRooms: s.spare, nonDependants: s.nd, london: s.lon === '1', capExempt: s.ex === '1',
  }), [s, couple, nation, brma, cat]);
  const lha = s.hous === 'private' ? lhaRate(nation, brma, cat) : undefined;
  const g = (n: number) => formatMoney(n);
  const summary = () => `Universal Credit estimate: ${g(r.award)} a month (2026/27 rates).`;
  return (
    <Frame>
      <form className="grid gap-x-4 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <Toggle id="uc-hh" label="Who is claiming" value={s.hh} onChange={(v) => set('hh', v)} options={[{ value: 'single', label: 'Just me' }, { value: 'couple', label: 'Couple' }]} />
        <NumberField id="uc-age" label={couple ? 'Age of the older partner' : 'Your age'} value={s.age} onChange={(v) => { set('age', v); set('page', v); }} unit="years" max={120} help="25 or over raises the standard allowance" />
        <NumberField id="uc-kids" label="Children living with you" value={s.kids} onChange={(v) => set('kids', v)} unit="children" max={15} help="Every child counts since 6 April 2026" />
        <NumberField id="uc-earn" label="Take-home pay a month (household)" value={s.earn} onChange={(v) => set('earn', v)} unit="£" max={50000} help="After tax, National Insurance and pension" />
        <SelectField id="uc-hous" label="Housing" value={s.hous} onChange={(v) => set('hous', v)} options={[{ value: 'none', label: 'No rent to pay' }, { value: 'private', label: 'Private rent' }, { value: 'social', label: 'Council or housing association' }]} />
        <NumberField id="uc-rent" label="Rent a month" value={s.rent} onChange={(v) => set('rent', v)} unit="£" max={20000} help="Eligible service charges included" />
        {s.hous === 'private' && <SelectField id="uc-area" label="Rental area (BRMA)" value={s.area} onChange={(v) => set('area', v)} options={AREAS} help="Sets the Local Housing Allowance cap" />}
        {s.hous === 'private' && <SelectField id="uc-bed" label="Bedrooms you are allowed" value={s.bed} onChange={(v) => set('bed', v)} options={[{ value: 'auto', label: `Work it out (${CAT_LABEL[autoCat]})` }, ...([0, 1, 2, 3, 4] as BedroomCat[]).map((c) => ({ value: String(c), label: CAT_LABEL[c] }))]} />}
        <NumberField id="uc-save" label="Savings and investments" value={s.save} onChange={(v) => set('save', v)} unit="£" max={10000000} help="Over £6,000 reduces UC; over £16,000 stops it" />
      </form>
      <details className="mt-4 rounded-lg border border-navy-200 px-4 py-3">
        <summary className="cursor-pointer text-sm font-semibold text-navy-800">More circumstances (health, caring, childcare, other income)</summary>
        <div className="mt-4 grid gap-x-4 gap-y-4 sm:grid-cols-2">
          <SelectField id="uc-hea" label="Health condition assessed (LCWRA)" value={s.hea} onChange={(v) => set('hea', v)} options={[{ value: 'none', label: 'No' }, { value: 'lcwra', label: 'Yes: severe, terminal, or reported before 6 April 2026' }, { value: 'lcwraNew', label: 'Yes: new health claim from 6 April 2026' }]} />
          <Toggle id="uc-car" label="Caring 35 hours a week" value={s.car} onChange={(v) => set('car', v)} options={yes} />
          <NumberField id="uc-cc" label="Registered childcare paid a month" value={s.cc} onChange={(v) => set('cc', v)} unit="£" max={20000} />
          <NumberField id="uc-une" label="Other benefits deducted a month" value={s.une} onChange={(v) => set('une', v)} unit="£" max={20000} help="Carer’s Allowance, New Style JSA or ESA, State Pension" />
          <Toggle id="uc-pre" label="Eldest child born before 6 April 2017" value={s.pre} onChange={(v) => set('pre', v)} options={yes} />
          <NumberField id="uc-dlo" label="Disabled children (lower addition)" value={s.dlo} onChange={(v) => set('dlo', v)} unit="children" max={10} />
          <NumberField id="uc-dhi" label="Disabled children (higher addition)" value={s.dhi} onChange={(v) => set('dhi', v)} unit="children" max={10} />
          <NumberField id="uc-nd" label="Other adults 21+ living with you" value={s.nd} onChange={(v) => set('nd', v)} unit="adults" max={10} help="Each reduces housing by £96.55 unless exempt" />
          {s.hous === 'social' && <NumberField id="uc-spare" label="Spare bedrooms (social rent)" value={s.spare} onChange={(v) => set('spare', v)} unit="rooms" max={6} />}
          {s.hous === 'private' && <Toggle id="uc-sarx" label="Under-35 exemption applies" value={s.sarx} onChange={(v) => set('sarx', v)} options={yes} />}
          <Toggle id="uc-lon" label="Living in Greater London" value={s.lon} onChange={(v) => set('lon', v)} options={yes} />
          <Toggle id="uc-ex" label="Someone gets PIP, DLA, AA or Carer’s Allowance" value={s.ex} onChange={(v) => set('ex', v)} options={yes} />
        </div>
      </details>
      <div className="mt-6">
        <ResultCard label="Universal Credit a month (estimate)" value={g(r.award)} sub={r.overCapital ? 'Savings above £16,000: no Universal Credit.' : r.capped ? `Limited by the benefit cap: at most ${g(r.capLevel)} of UC once Child Benefit is counted.` : `Maximum before deductions ${g(r.maximum)}`} methodHref={methodHref}
          lines={[
            ...r.elements.map((e) => ({ label: e.label, value: g(e.amount), share: r.maximum ? e.amount / r.maximum : 0 })),
            ...r.deductions.map((d) => ({ label: `less ${d.label}`, value: `−${g(d.amount)}`, tone: 'red' as const, share: r.maximum ? d.amount / r.maximum : 0 })),
            ...(lha !== undefined ? [{ label: `LHA cap, ${brma}, ${CAT_LABEL[cat].toLowerCase()}`, value: g(lha) }] : []),
            ...(r.rentShortfall > 0 ? [{ label: 'Rent not covered (you pay it)', value: g(r.rentShortfall), tone: 'red' as const }] : []),
            ...(!compact && r.award > 0 ? [{ label: 'Take-home pay at which UC stops', value: g(breakEvenEarnings(r.maximum, r.workAllowance)), strong: true }] : []),
          ]}
          note={<p>Monthly rates from April 2026 (DWP). An estimate: your statement can differ if earnings vary between assessment periods, if an advance or debt is being repaid, or if transitional protection applies.</p>} />
        <Actions summary={summary} />
      </div>
    </Frame>
  );
}
