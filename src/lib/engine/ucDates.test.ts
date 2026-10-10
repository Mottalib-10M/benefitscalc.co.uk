/** Universal Credit dates: GOV.UK example (Sam) and the month-end rule of regulation 21(2). */
import { describe, expect, it } from 'vitest';
import { periodStart, periodStartDay, ucPayment, workingDayOnOrBefore, daysToFirstPayment } from './ucDates';

describe('Universal Credit assessment periods and payment dates', () => {
  it('GOV.UK example: claim 10 September, period to 9 October, paid 17 October', () => {
    const p = ucPayment('2026-09-10', 1);
    expect(p.periodEnd).toBe('2026-10-09'); expect(p.due).toBe('2026-10-17');
    // 17 October 2026 is a Saturday: paid on Friday 16 October.
    expect(p.paid).toBe('2026-10-16'); expect(p.moved).toBe(true);
    expect(ucPayment('2026-09-10', 2).due).toBe('2026-11-17');
  });
  it('claim on the 31st: periods start on the last day of each month', () => {
    expect(periodStart('2026-10-31', 1)).toBe('2026-11-30');
    expect(periodStart('2026-10-31', 4)).toBe('2027-02-28');
  });
  it('claim on the 29th or 30th: 27th of February, 28th in a leap year', () => {
    expect(periodStartDay(30, 2027, 2)).toBe(27); expect(periodStartDay(29, 2028, 2)).toBe(28);
    expect(periodStart('2026-11-30', 3)).toBe('2027-02-27'); expect(periodStart('2026-11-30', 4)).toBe('2027-03-30');
  });
  it('weekends and bank holidays move the payment back', () => {
    expect(workingDayOnOrBefore('2026-12-28')).toBe('2026-12-24'); // Bank holiday Monday after Christmas weekend
    expect(workingDayOnOrBefore('2026-11-30', 'scotland')).toBe('2026-11-27'); // St Andrew's Day
    expect(workingDayOnOrBefore('2026-11-30', 'englandWales')).toBe('2026-11-30');
    expect(workingDayOnOrBefore('2027-03-17', 'northernIreland')).toBe('2027-03-16');
  });
  it('about five weeks to the first payment', () => {
    const d = daysToFirstPayment('2026-11-04');
    expect(d).toBeGreaterThanOrEqual(34); expect(d).toBeLessThanOrEqual(38);
  });
});
