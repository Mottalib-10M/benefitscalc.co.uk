/** Winter Fuel Payment 2026/27 (GOV.UK, England, Wales and Northern Ireland) and Pension Age Winter Heating Payment (Scotland). */
import { P } from './params';
const W = P.winterFuel;
export type Living = 'alone' | 'withEligible' | 'jointMeansTested' | 'ownMeansTested' | 'careHome';
/** Born on or before 27 June 1960 to qualify; "older" means born before 28 September 1946. */
export function winterFuel(i: { dob: string; living: Living; partnerOlder?: boolean; income: number }) {
  if (i.dob > W.bornOnOrBefore) return { amount: 0, older: false, reclaimed: false, net: 0, note: 'Born after 27 June 1960: not eligible this winter.' };
  const older = i.dob < W.olderBornBefore;
  let amount = 0;
  switch (i.living) {
    case 'alone': case 'ownMeansTested': amount = older ? W.older : W.base; break;
    case 'jointMeansTested': amount = older || i.partnerOlder ? W.older : W.base; break;
    case 'careHome': amount = older ? W.careHomeOlder : W.careHomeBase; break;
    case 'withEligible': amount = older ? (i.partnerOlder ? W.sharedOlder : W.base) : W.sharedBase; break;
  }
  const reclaimed = i.income > W.incomeThreshold;
  return { amount, older, reclaimed, net: reclaimed ? 0 : amount, note: '' };
}
