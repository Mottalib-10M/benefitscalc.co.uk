/** Local Housing Allowance 2026/27 by rental area: what Universal Credit pays at most towards private rent. */
import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import { ResultCard, Actions, Frame, useUrlState } from './kit';
import { allAreas, lhaRow, bedroomCategory, CAT_LABEL, type BedroomCat } from '../../lib/engine/lha';
import { formatMoney } from '../../lib/format';
const AREAS = allAreas().sort((a, b) => a.brma.localeCompare(b.brma)).map((a) => ({ value: `${a.nation}|${a.brma}`, label: `${a.brma} (${a.nation[0].toUpperCase()}${a.nation.slice(1)})` }));
export default function LhaTool({ methodHref }: { methodHref?: string }) {
  const [s, set] = useUrlState({ area: 'england|Central London', hh: 'single', age: 30, kids: 0, rent: 1200 });
  const [nation, brma] = s.area.split('|') as ['england' | 'scotland' | 'wales', string];
  const row = lhaRow(nation, brma);
  const cat = bedroomCategory({ couple: s.hh === 'couple', age: s.age, children: s.kids }) as BedroomCat;
  const rates = row ? [row.sar, row.b1, row.b2, row.b3, row.b4] : [0, 0, 0, 0, 0];
  const cap = rates[cat];
  const gap = Math.max(0, s.rent - cap);
  const g = (n: number) => formatMoney(n);
  const all = useMemo(() => allAreas().map((a) => a.b2).sort((x, y) => x - y), []);
  const rank = all.filter((x) => x <= (row?.b2 ?? 0)).length;
  return (
    <Frame>
      <form className="grid gap-x-4 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <SelectField id="lha-area" label="Broad Rental Market Area" value={s.area} onChange={(v) => set('area', v)} options={AREAS} help="Your council’s housing benefit page names your BRMA" />
        <Toggle id="lha-hh" label="Household" value={s.hh} onChange={(v) => set('hh', v)} options={[{ value: 'single', label: 'Single' }, { value: 'couple', label: 'Couple' }]} />
        <NumberField id="lha-age" label="Your age" value={s.age} onChange={(v) => set('age', v)} unit="years" max={120} help="Single and under 35: shared room rate" />
        <NumberField id="lha-kids" label="Children living with you" value={s.kids} onChange={(v) => set('kids', v)} unit="children" max={15} />
        <NumberField id="lha-rent" label="Your rent a month" value={s.rent} onChange={(v) => set('rent', v)} unit="£" max={20000} />
      </form>
      <div className="mt-6">
        <ResultCard label={`Most UC pays towards rent: ${CAT_LABEL[cat].toLowerCase()}`} value={`${g(cap)} a month`} sub={gap > 0 ? `${g(gap)} a month of your rent is not covered` : 'Your rent is within the allowance'} methodHref={methodHref}
          lines={(['Shared accommodation rate', '1 bedroom', '2 bedrooms', '3 bedrooms', '4 bedrooms']).map((l, i) => ({ label: l, value: g(rates[i]), share: rates[4] ? rates[i] / rates[4] : 0, strong: i === cat }))}
          note={<p>{brma}: the 2-bedroom rate ranks {rank} of {all.length} areas in Great Britain. Rates frozen at their April 2024 level for 2026/27; a bedroom rule allows a room for each couple or adult, children sharing in pairs.</p>} />
        <Actions summary={() => `LHA ${brma} ${CAT_LABEL[cat]}: ${g(cap)} a month (2026/27).`} />
      </div>
    </Frame>
  );
}
