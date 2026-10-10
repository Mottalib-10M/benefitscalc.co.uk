/** Tests of family-grants.ts against the official figures and examples (GOV.UK, HMRC, mygov.scot, nidirect). */
import { describe, expect, it } from 'vitest';
import {
  childBenefitWeeklyFor, guardiansAllowance, ssmgGrant, maternityAllowanceFor, bereavementSupport,
  freeSchoolMeals, freeHoursEarnings, scottishChildPayment, bsgPregnancy, bestStartGrantTotal, bestStartFoods,
} from './family-grants';

describe('Child Benefit by tax year (HMRC table)', () => {
  it('two children: £44.95 in 2026/27, £43.30 in 2025/26, £42.55 in 2024/25', () => {
    expect(childBenefitWeeklyFor(2)).toBeCloseTo(44.95, 2);
    expect(childBenefitWeeklyFor(2, '2025')).toBeCloseTo(43.3, 2);
    expect(childBenefitWeeklyFor(2, '2024')).toBeCloseTo(42.55, 2);
    expect(childBenefitWeeklyFor(0)).toBe(0);
  });
});

describe("Guardian's Allowance", () => {
  it('£22.95 per child on top of Child Benefit', () => {
    const r = guardiansAllowance(1, 1);
    expect(r.gaWeekly).toBe(22.95); expect(r.totalWeekly).toBeCloseTo(50, 2);
    expect(guardiansAllowance(2, 3).gaWeekly).toBeCloseTo(45.9, 2);
  });
});

describe('Sure Start Maternity Grant (GOV.UK table)', () => {
  it('first baby £500; twins with no children £1,000', () => {
    expect(ssmgGrant(1, 0).grant).toBe(500); expect(ssmgGrant(2, 0).grant).toBe(1000);
  });
  it('children already (single births): twins £500, triplets £1,000; second single baby nothing', () => {
    expect(ssmgGrant(2, 1).grant).toBe(500); expect(ssmgGrant(3, 1).grant).toBe(1000); expect(ssmgGrant(1, 1).grant).toBe(0);
  });
  it('already had twins: twins £0, triplets £500; already had triplets: £0', () => {
    expect(ssmgGrant(2, 2).grant).toBe(0); expect(ssmgGrant(3, 2).grant).toBe(500); expect(ssmgGrant(3, 3).grant).toBe(0);
  });
});

describe('Maternity Allowance by status', () => {
  it('employed: 90% of earnings up to £194.32, nil under £30', () => {
    expect(maternityAllowanceFor('employed', 150).weekly).toBe(135);
    expect(maternityAllowanceFor('employed', 400).weekly).toBe(194.32);
    expect(maternityAllowanceFor('employed', 29).weekly).toBe(0);
  });
  it('self-employed: full rate with 13 Class 2 weeks, £27 with none; spouse 14 weeks at £27', () => {
    expect(maternityAllowanceFor('selfFull', 0).total).toBeCloseTo(194.32 * 39, 2);
    expect(maternityAllowanceFor('selfNone', 0).weekly).toBe(27);
    const s = maternityAllowanceFor('spouse', 0); expect(s.weeks).toBe(14); expect(s.total).toBe(378);
  });
  it('Universal Credit reduced by the monthly equivalent', () => {
    expect(maternityAllowanceFor('employed', 400).ucMonthlyReduction).toBeCloseTo((194.32 * 52) / 12, 2);
  });
});

describe('Bereavement Support Payment by claim date', () => {
  it('claim within 3 months: higher £3,500 + 18 × £350 = £9,800; standard £4,300', () => {
    expect(bereavementSupport(true, 2).total).toBe(9800); expect(bereavementSupport(false, 3).total).toBe(4300);
  });
  it('6 months late: lump sum and 15 monthly payments', () => {
    const r = bereavementSupport(true, 6); expect(r.lump).toBe(3500); expect(r.payments).toBe(15);
  });
  it('after 12 months no lump sum; after 21 months nothing', () => {
    expect(bereavementSupport(false, 13).lump).toBe(0); expect(bereavementSupport(false, 13).payments).toBe(8);
    expect(bereavementSupport(true, 22).total).toBe(0);
  });
});

describe('Free school meals by nation (UC household)', () => {
  it('England: every UC child from 2026/27', () => {
    expect(freeSchoolMeals('england', 'secondary', 3000).status).toBe('yes');
  });
  it('Scotland: P1-P5 universal, then UC earned income up to £995 a month; SCP in P6-P7', () => {
    expect(freeSchoolMeals('scotland', 'primary4to5', 5000).status).toBe('yes');
    expect(freeSchoolMeals('scotland', 'secondary', 995).status).toBe('yes');
    expect(freeSchoolMeals('scotland', 'secondary', 996).status).toBe('no');
    expect(freeSchoolMeals('scotland', 'primary6to7', 2000, true).status).toBe('yes');
  });
  it('Wales: all primary; Northern Ireland: £15,900 a year net', () => {
    expect(freeSchoolMeals('wales', 'primary6to7', 4000).status).toBe('yes');
    expect(freeSchoolMeals('wales', 'secondary', 0).status).toBe('check');
    expect(freeSchoolMeals('ni', 'primary1to3', 1325).status).toBe('yes');
    expect(freeSchoolMeals('ni', 'primary1to3', 1326).status).toBe('no');
  });
});

describe('Free Childcare for Working Parents earnings test', () => {
  it('21 or over: 16 hours at £12.71 over 13 weeks = £2,643.68 passes exactly', () => {
    const r = freeHoursEarnings(30, 16, 12.71); expect(r.expected3m).toBeCloseTo(2643.68, 2); expect(r.passes).toBe(true);
    expect(freeHoursEarnings(30, 15, 12.71).passes).toBe(false);
  });
  it('19-year-old needs £2,256.80', () => expect(freeHoursEarnings(19, 16, 10.85).needed).toBe(2256.8));
});

describe('Scottish payments (gov.scot up-rating 2026-27, mygov.scot)', () => {
  it('Scottish Child Payment £28.20 a week per child', () => {
    const r = scottishChildPayment(2); expect(r.weekly).toBeCloseTo(56.4, 2); expect(r.fourWeekly).toBeCloseTo(225.6, 2);
  });
  it('Pregnancy and Baby Payment: twins £1,593.35 / £1,195.05; triplets £1,991.70 / £1,593.40', () => {
    expect(bsgPregnancy(1, false)).toBe(796.65); expect(bsgPregnancy(1, true)).toBe(398.35);
    expect(bsgPregnancy(2, false)).toBeCloseTo(1593.35, 2); expect(bsgPregnancy(2, true)).toBeCloseTo(1195.05, 2);
    expect(bsgPregnancy(3, false)).toBeCloseTo(1991.7, 2); expect(bsgPregnancy(3, true)).toBeCloseTo(1593.4, 2);
  });
  it('three payments for a first child: 796.65 + 331.95 + 331.95', () => {
    expect(bestStartGrantTotal(1, false).total).toBeCloseTo(1460.55, 2);
  });
  it('Best Start Foods every 4 weeks: £22.40 pregnancy, £44.80 under 1, £22.40 from 1 to 3', () => {
    expect(bestStartFoods(true, 0, 0).fourWeekly).toBeCloseTo(22.4, 2);
    expect(bestStartFoods(false, 1, 0).fourWeekly).toBeCloseTo(44.8, 2);
    expect(bestStartFoods(false, 0, 1).fourWeekly).toBeCloseTo(22.4, 2);
  });
});
