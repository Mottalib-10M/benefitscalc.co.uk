/** Pension Age Winter Heating Payment 2026/27 (mygov.scot, how much you might be paid): same structure as the Winter Fuel Payment, Scottish amounts. */
import { P } from './params';
import { winterFuel, type Living } from './winter';
const [sharedBase, sharedOlder, base, older] = P.scotland.pawhp;
export function pawhp(i: { dob: string; living: Living; partnerOlder?: boolean; income: number }) {
  const w = winterFuel(i);
  const map: Record<number, number> = { [P.winterFuel.base]: base, [P.winterFuel.older]: older, [P.winterFuel.sharedBase]: sharedBase, [P.winterFuel.sharedOlder]: sharedOlder };
  const amount = w.amount ? map[w.amount] : 0;
  return { amount, net: w.reclaimed ? 0 : amount, reclaimed: w.reclaimed, older: w.older };
}
