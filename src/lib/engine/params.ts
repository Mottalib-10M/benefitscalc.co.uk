/** Typed access to `data/params-2026.json` and the LHA dataset: every benefit figure comes from here (RECETTE §4). */
import raw from '../../data/params-2026.json';
import lhaRaw from '../../data/lha-2026.json';

export const P = raw;
export type Params = typeof raw;
export type SourceKey = keyof typeof raw.sources;
export const LHA = lhaRaw;
export type Nation = 'england' | 'scotland' | 'wales' | 'ni';
export const NATION_LABEL: Record<Nation, string> = { england: 'England', scotland: 'Scotland', wales: 'Wales', ni: 'Northern Ireland' };

/** Round to the penny (benefit amounts are computed in pence and shown in whole pounds). */
export const pence = (x: number) => Math.round(x * 100) / 100;
/** Monthly equivalent of a weekly amount, as DWP converts it for Universal Credit (× 52 ÷ 12). */
export const weeklyToMonthly = (w: number) => (w * 52) / 12;
export const monthlyToWeekly = (m: number) => (m * 12) / 52;
