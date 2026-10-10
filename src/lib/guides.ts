/** Registry of content pages: every file of `src/content/pages/` is loaded here. */
import type { PageDef, Group } from './guide-types';

const mods = import.meta.glob<{ default: PageDef }>('../content/pages/*.ts', { eager: true });

export const PAGES: PageDef[] = Object.entries(mods)
  .map(([file, m]) => {
    const g = m.default;
    const base = file.split('/').pop()!.replace(/\.ts$/, '');
    if (g.id !== base) throw new Error(`${file}: id “${g.id}” differs from the file name`);
    return g;
  })
  .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));

export const GROUPS: Group[] = ['uc', 'disability', 'carers', 'pension', 'family', 'housing', 'nations'];
/** Main calculator of each group: default target of the mini-simulators' button. */
export const GROUP_TOOL: Record<Group, string> = { uc: 'universal-credit-calculator', disability: 'pip-points-calculator', carers: 'carers-allowance-calculator', pension: 'pension-credit-calculator', family: 'child-benefit-calculator', housing: 'local-housing-allowance-rates', nations: 'benefits-calculator' };
export const pageById = (id: string) => PAGES.find((p) => p.id === id);
/** Links of the home checker lines to the full calculators (only pages that exist). */
export function checkerLinks(): Record<string, string> {
  const map: Record<string, string> = { uc: 'universal-credit-calculator', cb: 'child-benefit-calculator', pip: 'pip-points-calculator', pc: 'pension-credit-calculator', aa: 'attendance-allowance', wfp: 'winter-fuel-payment', ca: 'carers-allowance-calculator' };
  return Object.fromEntries(Object.entries(map).filter(([, id]) => pageById(id)).map(([k, id]) => [k, `/en/${pageById(id)!.slug}/`]));
}
