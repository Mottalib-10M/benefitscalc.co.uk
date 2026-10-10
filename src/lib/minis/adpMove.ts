/** Moving from England or Wales to Scotland with PIP: the date PIP stops, and what Adult Disability Payment pays. */
import { dwpStopsAfterMove } from '../engine/disability-extra';
import { pipWeekly, type PipRate } from '../engine/disability';
import { P } from '../engine/params';
import { date, iso, gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const LIST = Array.from({ length: 12 }, (_, i) => { const m0 = 9 + i; return { y: 2026 + Math.floor(m0 / 12), m: (m0 % 12) + 1 }; });
const COMBOS: Array<[PipRate, PipRate, string]> = [['standard', 'none', 'Standard daily living'], ['enhanced', 'none', 'Enhanced daily living'], ['standard', 'standard', 'Standard, both parts'], ['enhanced', 'enhanced', 'Enhanced, both parts'], ['none', 'enhanced', 'Enhanced mobility only']];
export default (): MiniSpec => ({
  title: 'PIP to Adult Disability Payment: your dates',
  cta: 'Check the points behind the rates',
  inputs: [
    { id: 'day', label: 'Day you move to Scotland', def: 1, max: 31 },
    { id: 'mon', label: 'Month', def: 1, options: LIST.map((x, i) => ({ value: String(i), label: `${MONTHS[x.m - 1]} ${x.y}` })) },
    { id: 'award', label: 'Your PIP award', def: 2, options: COMBOS.map((c, i) => ({ value: String(i), label: c[2] })) },
  ],
  run: ({ day, mon, award }) => {
    const x = LIST[mon] ?? LIST[0];
    const last = new Date(Date.UTC(x.y, x.m, 0)).getUTCDate();
    const move = iso(x.y, x.m, Math.min(Math.max(1, Math.round(day)), last));
    const c = COMBOS[award] ?? COMBOS[0];
    const w = pipWeekly(c[0], c[1]);
    return {
      head: ['PIP ends', date(dwpStopsAfterMove(move))],
      rows: [['Weeks of PIP still paid in Scotland', String(P.pip.moveStopWeeks)], ['Adult Disability Payment at the same rates', `${gbp(w, 2)} a week`], ['Lost for each month without an ADP claim', gbp((w * 52) / 12)]],
      note: 'Apply for Adult Disability Payment as soon as you arrive: a successful award can be backdated to the day after PIP ends.',
    };
  },
});
