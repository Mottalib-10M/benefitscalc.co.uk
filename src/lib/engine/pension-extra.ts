/** Deferral of the State Pension (GOV.UK, Defer your State Pension) and pension-age helpers. */
import { P, pence } from './params';
const SP = P.statePension;
/** New scheme (State Pension age on or after 6 April 2016): one-off arrears for up to 52 weeks, the rest as extra pension at 1% per 9 weeks. */
export function deferNewScheme(weekly: number, weeks: number, takeLumpSum: boolean) {
  const arrearsWeeks = takeLumpSum ? Math.min(weeks, SP.deferArrearsMaxWeeks) : 0;
  const extraWeeks = weeks - arrearsWeeks;
  const extra = extraWeeks >= SP.deferMinWeeks ? pence(weekly * (extraWeeks / 9) * SP.deferPct9Weeks) : 0;
  return { arrears: pence(weekly * arrearsWeeks), extraWeekly: extra, extraPct: extraWeeks >= SP.deferMinWeeks ? (extraWeeks / 9) * SP.deferPct9Weeks : 0, breakEvenYears: extra ? (weekly * arrearsWeeks === 0 ? (weekly * extraWeeks) / (extra * 52) : 0) : 0 };
}
/** Old scheme (State Pension age before 6 April 2016): 1% for every 5 weeks deferred, at least 5 weeks. */
export const deferOldScheme = (weekly: number, weeks: number) => weeks < SP.oldDeferMinWeeks ? 0 : pence(weekly * (weeks / 5) * SP.oldDeferPct5Weeks);
