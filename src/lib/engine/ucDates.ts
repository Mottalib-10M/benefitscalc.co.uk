/**
 * Universal Credit assessment periods and payment dates.
 * - Assessment periods: Universal Credit Regulations 2013, regulation 21(1) and (2): one month from the first
 *   day of entitlement; a claim on the 31st starts each period on the last day of the month; on the 29th or 30th,
 *   that day, except February (27th, or 28th in a leap year).
 * - Payment: GOV.UK "How you're paid": paid 7 days after each assessment period ends (GOV.UK example: claim
 *   10 September, period to 9 October, paid 17 October); a payday on a weekend or bank holiday moves to the working
 *   day before. Bank holidays from GOV.UK bank-holidays.json (params > bankHolidays, 2026 and 2027).
 */
import { P } from './params';
import { addDays, dayOfWeek, type ISO } from './dates';

export type UcNation = 'englandWales' | 'scotland' | 'northernIreland';

const pad = (n: number) => String(n).padStart(2, '0');
const lastDay = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate();
const leap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

/** Day of the month on which an assessment period starts in month m of year y, for a claim made on `claimDay`. */
export function periodStartDay(claimDay: number, y: number, m: number): number {
  if (claimDay === 31) return lastDay(y, m);
  if (claimDay === 29 || claimDay === 30) return m === 2 ? (leap(y) ? 28 : 27) : claimDay;
  return claimDay;
}

/** Start of the n-th assessment period (n = 0 is the claim date itself). */
export function periodStart(claim: ISO, n: number): ISO {
  const [y, m, d] = claim.split('-').map(Number);
  if (n === 0) return claim;
  const t = new Date(Date.UTC(y, m - 1 + n, 1));
  const ty = t.getUTCFullYear(); const tm = t.getUTCMonth() + 1;
  return `${ty}-${pad(tm)}-${pad(periodStartDay(d, ty, tm))}`;
}

/** True for Saturday, Sunday or a bank holiday of the nation (only 2026 and 2027 are listed). */
export function isNonWorking(iso: ISO, nation: UcNation = 'englandWales'): boolean {
  const dow = dayOfWeek(iso);
  return dow === 0 || dow === 6 || (P.bankHolidays[nation] as string[]).includes(iso);
}
/** Working day on or before the date. */
export function workingDayOnOrBefore(iso: ISO, nation: UcNation = 'englandWales'): ISO {
  let d = iso;
  while (isNonWorking(d, nation)) d = addDays(d, -1);
  return d;
}
/** Whether the bank-holiday list covers the date (outside it, only weekends are moved). */
export const holidaysCover = (iso: ISO) => iso >= '2026-01-01' && iso <= '2027-12-31';

export interface UcPayment { periodStart: ISO; periodEnd: ISO; due: ISO; paid: ISO; moved: boolean }

/** The n-th payment (n = 1 is the first): period, scheduled date and the date money arrives. */
export function ucPayment(claim: ISO, n = 1, nation: UcNation = 'englandWales'): UcPayment {
  const start = periodStart(claim, n - 1);
  const next = periodStart(claim, n);
  const due = addDays(next, P.uc.paidDaysAfterPeriod);
  const paid = workingDayOnOrBefore(due, nation);
  return { periodStart: start, periodEnd: addDays(next, -1), due, paid, moved: paid !== due };
}

/** Days from the claim to the first payment. */
export const daysToFirstPayment = (claim: ISO, nation: UcNation = 'englandWales') =>
  Math.round((Date.parse(ucPayment(claim, 1, nation).paid) - Date.parse(claim)) / 86_400_000);
