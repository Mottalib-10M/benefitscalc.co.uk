/** Benefit cap 2026/27 (DWP rates; GOV.UK benefit cap; nidirect for Northern Ireland, same amounts as the rest of GB). */
import { P } from './params';
const C = P.benefitCap;
export const benefitCapMonthly = (familyOrCouple: boolean, london: boolean) =>
  london ? (familyOrCouple ? C.monthly.londonFamily : C.monthly.londonSingle) : (familyOrCouple ? C.monthly.restFamily : C.monthly.restSingle);
export const benefitCapWeekly = (familyOrCouple: boolean, london: boolean) =>
  london ? (familyOrCouple ? C.weekly.londonFamily : C.weekly.londonSingle) : (familyOrCouple ? C.weekly.restFamily : C.weekly.restSingle);
export interface CapInput { familyOrCouple: boolean; london: boolean; monthlyBenefits: number; earnings: number; exempt: boolean; graceMonthsLeft?: number }
export function applyCap(i: CapInput) {
  const level = benefitCapMonthly(i.familyOrCouple, i.london);
  const reason = i.exempt ? 'exempt' : i.earnings >= C.earningsExemptMonthly ? 'earnings' : (i.graceMonthsLeft ?? 0) > 0 ? 'grace' : '';
  const loss = reason ? 0 : Math.max(0, i.monthlyBenefits - level);
  return { level, loss: Math.round(loss * 100) / 100, after: i.monthlyBenefits - loss, reason };
}
