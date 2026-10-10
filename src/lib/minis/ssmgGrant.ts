/** Sure Start Maternity Grant: the amount by babies expected and children already under 16. */
import { ssmgGrant } from '../engine/family-grants';
import { gbp } from './_kit';
import type { MiniSpec } from '../mini-types';

export default (): MiniSpec => ({
  title: 'What the Sure Start Maternity Grant pays you',
  cta: 'See every benefit your family could claim',
  inputs: [
    { id: 'babies', label: 'Babies expected', def: 1, options: [{ value: '1', label: 'One baby' }, { value: '2', label: 'Twins' }, { value: '3', label: 'Triplets' }] },
    { id: 'group', label: 'Children under 16 already in the family', def: 0, options: [{ value: '0', label: 'None' }, { value: '1', label: 'One or more, no multiple births' }, { value: '2', label: 'Twins among them' }, { value: '3', label: 'Triplets among them' }] },
  ],
  run: ({ babies, group }) => {
    const r = ssmgGrant(babies, group);
    return {
      head: ['One-off grant', gbp(r.grant)],
      rows: [['Babies the grant covers', String(r.eligibleBabies)], ['Paid back later', 'Never'], ['Effect on other benefits', 'None']],
      note: 'You or your partner must get Universal Credit, Pension Credit, income-related ESA or a Support for Mortgage Interest loan. Exceptions to the first-child rule are listed on this page.',
    };
  },
});
