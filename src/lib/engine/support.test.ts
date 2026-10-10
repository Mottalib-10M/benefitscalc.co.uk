/** Tests for support.ts: GOV.UK examples and rule bounds (RECETTE §17.4). */
import { describe, expect, it } from 'vitest';
import { socialBedroomsNeeded, socialSizeCriteria, budgetingMax, budgetingRepayment, budgetingSavingsLimit, winterOneOffs, oneOffTotal, niTwiceMonthly, scotlandExtras, RATE_TABLE, rateEquivalents } from './support';

describe('social sector size criteria', () => {
  it('GOV.UK example: £100 eligible rent, one spare bedroom → £86', () => {
    expect(socialSizeCriteria({ eligibleRent: 100, bedrooms: 3, needed: 2 }).after).toBe(86);
  });
  it('25% for two or more spare bedrooms, nothing at State Pension age or with no spare room', () => {
    expect(socialSizeCriteria({ eligibleRent: 600, bedrooms: 4, needed: 1 }).reduction).toBe(150);
    expect(socialSizeCriteria({ eligibleRent: 600, bedrooms: 4, needed: 1, pensionAge: true }).reduction).toBe(0);
    expect(socialSizeCriteria({ eligibleRent: 600, bedrooms: 2, needed: 3 }).spare).toBe(0);
  });
  it('rooms needed: claimant or couple, each other adult, children in pairs, overnight carer', () => {
    expect(socialBedroomsNeeded({ otherAdults: 0, children: 0 })).toBe(1);
    expect(socialBedroomsNeeded({ otherAdults: 1, children: 3 })).toBe(4);
    expect(socialBedroomsNeeded({ otherAdults: 0, children: 2, childRooms: 2 })).toBe(3);
    expect(socialBedroomsNeeded({ otherAdults: 0, children: 0, overnightCarer: true })).toBe(2);
  });
});

describe('Budgeting Loan and Budgeting Advance', () => {
  it('maximums £348, £464, £812; minimum £100', () => {
    expect(budgetingMax('single', false).max).toBe(348); expect(budgetingMax('couple', true).max).toBe(464);
    expect(budgetingMax('children', false).max).toBe(812); expect(budgetingMax('children', true).max).toBe(812);
    expect(budgetingMax('single', true).min).toBe(100);
  });
  it('GOV.UK example: £240 advance over 24 months = £10 a month; a loan over 104 weeks', () => {
    expect(budgetingRepayment(240, true).perPeriod).toBe(10);
    expect(budgetingRepayment(520, false).perPeriod).toBe(5);
  });
  it('savings limit £1,000, or £2,000 at 63 or over', () => {
    expect(budgetingSavingsLimit(false)).toBe(1000); expect(budgetingSavingsLimit(true)).toBe(2000);
  });
});

describe('winter one-off payments', () => {
  it('England, pensioner on Pension Credit: Winter Fuel £200, Cold Weather, Warm Home Discount £150', () => {
    const l = winterOneOffs({ nation: 'ew', pensionAge: true, benefit: 'pc' });
    expect(l.map((x) => x.name)).toEqual(['Winter Fuel Payment', 'Cold Weather Payment', 'Warm Home Discount']);
    expect(oneOffTotal(l)).toBe(350);
  });
  it('Scotland: no Cold Weather Payment, Winter Heating Payment £62 instead', () => {
    const l = winterOneOffs({ nation: 'scotland', pensionAge: false, benefit: 'ucQualifying' });
    expect(l.some((x) => x.name === 'Cold Weather Payment')).toBe(false);
    expect(l.find((x) => x.name === 'Winter Heating Payment')?.amount).toBe(62);
  });
  it('Northern Ireland: no Warm Home Discount; working UC claimant gets no cold weather payment', () => {
    expect(winterOneOffs({ nation: 'ni', pensionAge: false, benefit: 'ucWork' })).toEqual([]);
  });
});

describe('Northern Ireland twice-monthly Universal Credit', () => {
  it('housing to the landlord, the rest in two halves', () => {
    const r = niTwiceMonthly(1200, 500);
    expect(r.toLandlord).toBe(500); expect(r.eachPayment).toBe(350); expect(r.eachPayment + r.secondPayment).toBe(700);
  });
});

describe('Scotland-only payments', () => {
  it('Scottish Child Payment £28.20 a week per child with a qualifying benefit, CWHP £265.50 per child', () => {
    const r = scotlandExtras({ childrenUnder16: 2, qualifyingBenefit: true, disabledChildren: 1 });
    expect(r.scpWeekly).toBeCloseTo(56.4, 2); expect(r.scpYear).toBeCloseTo(2932.8, 2); expect(r.cwhp).toBe(265.5);
    expect(scotlandExtras({ childrenUnder16: 2, qualifyingBenefit: false }).scpYear).toBe(0);
  });
});

describe('rates table', () => {
  it('every row has a positive amount; monthly and weekly conversions', () => {
    for (const r of RATE_TABLE) expect(r.amount, r.key).toBeGreaterThan(0);
    expect(rateEquivalents({ amount: 86.45, per: 'week' }).yearly).toBeCloseTo(4495.4, 2);
    expect(rateEquivalents({ amount: 424.9, per: 'month' }).yearly).toBeCloseTo(5098.8, 2);
  });
});
