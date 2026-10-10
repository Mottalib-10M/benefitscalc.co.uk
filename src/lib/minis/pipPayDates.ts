/** PIP: the next payment dates from the last normal payday (every 4 weeks, bank holidays paid before). */
import { pipNextPayments, pipPaydaysInTaxYear, paydayName, holidaysCover } from '../engine/disability-extra';
import { P } from '../engine/params';
import { date, iso, gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// Months offered for the last payment: July 2026 to June 2027 (bank holidays known to the end of 2027).
const LIST = Array.from({ length: 12 }, (_, i) => { const m0 = 6 + i; return { y: 2026 + Math.floor(m0 / 12), m: (m0 % 12) + 1 }; });
const RATES = [
  { value: '0', label: 'Standard daily living only' }, { value: '1', label: 'Enhanced daily living only' },
  { value: '2', label: 'Both parts, standard rates' }, { value: '3', label: 'Both parts, enhanced rates' },
];
const weekly = (r: number) => [P.pip.dailyStandard, P.pip.dailyEnhanced, P.pip.dailyStandard + P.pip.mobilityStandard, P.pip.dailyEnhanced + P.pip.mobilityEnhanced][r] ?? P.pip.dailyStandard;
export default (): MiniSpec => ({
  title: 'Your next PIP paydays',
  cta: 'Check which PIP rate your points give',
  inputs: [
    { id: 'day', label: 'Day of your last PIP payment', def: 6, max: 31 },
    { id: 'mon', label: 'Month', def: 3, options: LIST.map((x, i) => ({ value: String(i), label: `${MONTHS[x.m - 1]} ${x.y}` })) },
    { id: 'rate', label: 'Your award', def: 2, options: RATES },
  ],
  run: ({ day, mon, rate }) => {
    const x = LIST[mon] ?? LIST[0];
    const last = new Date(Date.UTC(x.y, x.m, 0)).getUTCDate();
    const paid = iso(x.y, x.m, Math.min(Math.max(1, Math.round(day)), last));
    const next = pipNextPayments(paid, 3);
    const moved = next.find((p) => p.moved);
    const fmt = (p: { paid: string; moved: boolean }) => `${date(p.paid)}${p.moved ? ' (moved for a bank holiday)' : ''}`;
    return {
      head: ['Next payment', date(next[0].paid)],
      rows: [['Then', `${fmt(next[1])} and ${fmt(next[2])}`], ['Usual payday', `${paydayName(paid)}, every ${P.pip.paidEveryWeeks} weeks`], ['Each payment', gbp(weekly(rate) * P.pip.paidEveryWeeks, 2)], ['Paydays in 2026/27', String(pipPaydaysInTaxYear(paid))]],
      note: moved ? `${date(moved.due)} is a bank holiday in England and Wales, so the money usually arrives on the working day before.` : holidaysCover(next[2].due) ? 'Bank holidays of England and Wales are checked. Scotland and Northern Ireland have a few different ones.' : 'Bank holidays after 2027 are not listed yet.',
    };
  },
});
