/** Universal Credit: first assessment period and payment dates from the claim date (reg. 21; GOV.UK how you're paid). */
import { ucPayment, holidaysCover, type UcNation } from '../engine/ucDates';
import { diffDays } from '../engine/dates';
import { date, iso } from './_kit';
import type { MiniSpec } from '../mini-types';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// Claim months offered: October 2026 to September 2027 (bank holidays known to the end of 2027).
const LIST = Array.from({ length: 12 }, (_, i) => { const m0 = 9 + i; return { y: 2026 + Math.floor(m0 / 12), m: (m0 % 12) + 1 }; });
const NATIONS: UcNation[] = ['englandWales', 'scotland', 'northernIreland'];
export default (): MiniSpec => ({
  title: 'When your first Universal Credit payment lands',
  cta: 'Estimate how much the payment will be',
  inputs: [
    { id: 'day', label: 'Day you submitted the claim', def: 10, max: 31 },
    { id: 'mon', label: 'Month', def: 0, options: LIST.map((x, i) => ({ value: String(i), label: `${MONTHS[x.m - 1]} ${x.y}` })) },
    { id: 'nat', label: 'Where you live', def: 0, options: [{ value: '0', label: 'England or Wales' }, { value: '1', label: 'Scotland' }, { value: '2', label: 'Northern Ireland' }] },
  ],
  run: ({ day, mon, nat }) => {
    const x = LIST[mon] ?? LIST[0];
    const last = new Date(Date.UTC(x.y, x.m, 0)).getUTCDate();
    const claim = iso(x.y, x.m, Math.min(Math.max(1, Math.round(day)), last));
    const nation = NATIONS[nat] ?? 'englandWales';
    const p1 = ucPayment(claim, 1, nation); const p2 = ucPayment(claim, 2, nation);
    return {
      head: ['First payment', date(p1.paid)],
      rows: [['First assessment period', `${date(p1.periodStart)} to ${date(p1.periodEnd)}`], ['Days from claim to money', String(diffDays(claim, p1.paid))], ['Second payment', date(p2.paid)]],
      note: p1.moved ? `The usual date, ${date(p1.due)}, is a weekend or bank holiday, so the money comes on the working day before.` : holidaysCover(p1.due) ? undefined : 'Bank holidays after 2027 are not listed; only weekends are moved.',
    };
  },
});
