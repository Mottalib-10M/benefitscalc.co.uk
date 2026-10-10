/** Local Housing Allowance for Universal Credit, monthly, 2026/27 (192 Broad Rental Market Areas of GB). */
import { LHA, P } from './params';
export type BedroomCat = 0 | 1 | 2 | 3 | 4; // 0 = shared accommodation rate
type Row = { brma: string; sar: number; b1: number; b2: number; b3: number; b4: number };
export const areas = (nation: 'england' | 'scotland' | 'wales'): Row[] => (LHA.areas as Record<string, Row[]>)[nation] ?? [];
export const allAreas = () => (['england', 'scotland', 'wales'] as const).flatMap((n) => areas(n).map((r) => ({ ...r, nation: n })));
export function lhaRow(nation: 'england' | 'scotland' | 'wales', brma: string): Row | undefined { return areas(nation).find((r) => r.brma === brma); }
export function lhaRate(nation: 'england' | 'scotland' | 'wales', brma: string, cat: BedroomCat): number | undefined {
  const r = lhaRow(nation, brma); if (!r) return undefined;
  return [r.sar, r.b1, r.b2, r.b3, r.b4][cat];
}
/**
 * Bedroom category for a private renter (UC Regulations 2013, Schedule 4, paras 8 to 12 and 28; GOV.UK bedroom rules):
 * one room for the claimant or couple, children share (two under 10 regardless of sex, two under 16 of the same sex),
 * capped at 4. A single person under 35 with no children gets the shared accommodation rate unless an exemption applies.
 */
export function bedroomCategory(o: { couple: boolean; age: number; children: number; childRooms?: number; exempt?: boolean }): BedroomCat {
  if (!o.couple && o.children === 0 && o.age < P.lha.sarAgeLimit && !o.exempt) return 0;
  const rooms = 1 + (o.children > 0 ? (o.childRooms ?? Math.ceil(o.children / 2)) : 0);
  return Math.min(4, Math.max(1, rooms)) as BedroomCat;
}
export const CAT_LABEL: Record<BedroomCat, string> = { 0: 'Shared accommodation rate', 1: '1 bedroom', 2: '2 bedrooms', 3: '3 bedrooms', 4: '4 bedrooms' };
