/** PIP: the required period test (3 months before, 9 months after) and the age rule. */
import { pipRequiredPeriod } from '../engine/disability-extra';
import { P } from '../engine/params';
import { date, iso } from './_kit';
import type { MiniSpec } from '../mini-types';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// Onset months offered: January 2024 to December 2026.
const LIST = Array.from({ length: 36 }, (_, i) => ({ y: 2024 + Math.floor(i / 12), m: (i % 12) + 1 }));
export default (): MiniSpec => ({
  title: 'When the PIP time conditions are met',
  cta: 'Score the 12 PIP activities',
  inputs: [
    { id: 'mon', label: 'Month your difficulties began', def: 31, options: LIST.map((x, i) => ({ value: String(i), label: `${MONTHS[x.m - 1]} ${x.y}` })) },
    { id: 'age', label: 'Your age now', def: 1, options: [{ value: '0', label: `Under ${P.pip.minAge}` }, { value: '1', label: `${P.pip.minAge} to State Pension age` }, { value: '2', label: 'Over State Pension age' }] },
    { id: 'prev', label: `Got PIP or ADP in the last ${P.pip.reclaimAfterSpaMonths} months`, def: 0, options: [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }] },
  ],
  run: ({ mon, age, prev }) => {
    const x = LIST[mon] ?? LIST[0];
    const r = pipRequiredPeriod(iso(x.y, x.m, 1));
    const route = age === 0 ? 'Disability Living Allowance for children, not PIP' : age === 2 && prev !== 1 ? 'Attendance Allowance, not a new PIP claim' : 'PIP, if the points test is met';
    return {
      head: ['Backward test met from', date(r.qualifyFrom)],
      rows: [['Must be expected to last until at least', date(r.mustLastUntil)], ['The benefit to claim', route], ['Points needed', `${P.pip.thresholdStandard} standard, ${P.pip.thresholdEnhanced} enhanced`]],
      note: 'You can phone to start the claim before the backward date: an award cannot begin earlier than it. Under the special rules for end of life, the time conditions do not apply.',
    };
  },
});
