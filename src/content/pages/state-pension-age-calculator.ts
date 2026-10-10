import { definePage } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { statePensionAge } from '../../lib/engine/pension';
import { displayDate } from '../../lib/format';

const d = (iso: string) => displayDate(iso, 'en-GB');
const a = statePensionAge('1960-07-31'), b = statePensionAge('1961-03-20');

export default definePage({
  id: 'state-pension-age-calculator',
  group: 'pension',
  order: 30,
  tool: 'spa',
  related: ['state-pension-amount', 'state-pension-deferral', 'pension-credit', 'winter-fuel-payment', 'old-basic-state-pension'],
  sources: ['spaTimetable', 'govSpa', 'govForecast'],
  slug: 'state-pension-age-calculator',
  nav: 'State Pension age',
  card: 'The exact date you reach State Pension age, from your date of birth.',
  title: 'State Pension Age Calculator 2026: The Rise from 66 to 67',
  description: 'State Pension age calculator 2026: your exact date from your birthday, with the month-by-month rise from 66 to 67 for those born from 6 April 1960, then 68.',
  h1: 'State Pension age calculator: the day your pension can start',
  intro: 'One date of birth gives the date, the age in years and months, and the dates that follow from it.',
  resume: `State Pension age is 66 for anyone born between 6 October 1954 and 5 April 1960. It is now rising to 67: people born from 6 April 1960 reach it at 66 plus one month, then two, then three, one extra month for each month of birth, until everyone born on or after 6 March 1961 reaches it at 67. Under the Pensions Act 2007 it then rises from 67 to 68 between 2044 and 2046 for those born from 6 April 1977, although that timetable is under review and could change before it takes effect. The age is the same for men and women. Someone born on 31 July 1960 reaches it on ${d(a.date!)}, at ${a.label}; someone born on 20 March 1961 on ${d(b.date!)}. Your State Pension does not start automatically: you claim it, or defer it to get more later.`,
  faqs: [
    { q: 'I was born in summer 1960. Why is my State Pension age not a round number?', a: 'Because the Pensions Act 2014 phases in the move to 67 month by month. Birth dates from 6 April 1960 to 5 March 1961 add between one and eleven months to 66, so someone born in July 1960 waits until 66 years and 4 months. The DWP timetable gives each band.' },
    { q: 'What if my birthday is the 31st and the month I reach the age has no 31st?', a: 'You reach State Pension age on the last day of that month. The DWP timetable gives the examples: born 31 July 1960, reaching 66 years and 4 months on 30 November 2026; born 31 December 1960, reaching 66 years and 9 months on 30 September 2027.' },
    { q: 'Will my State Pension age change again?', a: 'The rise to 67 is fixed in law. The move to 68 between 2044 and 2046 is current law too, but the government reviews State Pension age at least every five years and Parliament could bring it forward. The calculator always applies the law in force.' },
  ],
  body: (h) => `
<h2>The phased rise to 67</h2>
${h.table(['Date of birth', 'State Pension age'], (P.spa.phase67 as Array<[string, string, number]>).map(([f, t, m]) => [`${h.date(f)} to ${h.date(t)}`, `66 years and ${m} month${m > 1 ? 's' : ''}`]).concat([[`${h.date(P.spa.age67From)} to 5 April 1977`, '67']]), 'DWP State Pension age timetable, table 4', ['l', 'l'])}
<h2>What depends on the date</h2>
<p>State Pension age is the first day you can claim the State Pension and the age at which Universal Credit stops being available to a single person, who then claims ${h.a('pension-credit', 'Pension Credit')} instead. You can apply for Pension Credit up to ${P.pensionCredit.applyMonthsBefore} months before. PIP cannot be newly claimed after it; ${h.a('attendance-allowance', 'Attendance Allowance')} takes over. The Winter Fuel Payment for winter 2026 to 2027 is based on being born on or before ${h.date(P.winterFuel.bornOnOrBefore)}, which is the age reached by the qualifying week, so some people get it shortly before their own pension starts.</p>
<p>The calculator follows the ${h.src('spaTimetable', 'DWP State Pension age timetable')} and reproduces its worked examples. To see how much you will get, run ${h.a('state-pension-amount', 'the State Pension amount calculator')} with the qualifying years from ${h.src('govForecast', 'your GOV.UK forecast')}.</p>
`,
});
