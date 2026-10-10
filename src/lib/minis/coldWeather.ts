/** Cold Weather Payments: £25 per 7-day period at or below zero, 1 Nov 2026 to 31 Mar 2027. */
import { P } from '../engine/params';
import { gbp, num } from './_kit';
import type { MiniSpec } from '../mini-types';
export default (): MiniSpec => ({
  title: 'Cold Weather Payments for this winter',
  cta: 'Check Pension Credit, which qualifies you',
  inputs: [
    { id: 'n', label: 'Periods of 7 freezing days at your weather station', def: 2, unit: 'periods', max: 21 },
    { id: 'q', label: 'You get', def: 0, options: [{ value: '0', label: 'Pension Credit' }, { value: '1', label: 'UC with a child under 5 or LCW, not working' }, { value: '2', label: 'UC while working, no disabled child' }, { value: '3', label: 'I live in Scotland' }] },
  ],
  run: ({ n, q }) => {
    const ok = q === 0 || q === 1; const C = P.coldWeather;
    return { head: ['Cold Weather Payments', ok ? gbp(n * C.payment) : gbp(0)], rows: [['Per 7-day period', gbp(C.payment)], ['Periods counted', num(ok ? n : 0)]], note: q === 3 ? `Scotland: an annual Winter Heating Payment of ${gbp(P.scotland.winterHeating, 2)} instead, whatever the weather.` : q === 2 ? 'Working UC claimants qualify only with a disabled child amount.' : undefined };
  },
});
