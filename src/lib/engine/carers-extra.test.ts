import { describe, expect, it } from 'vitest';
import { caAndUc, caAtPensionAge, caWeekly, scottishCarerPackage, carersCredit } from './carers-extra';

describe('Carer’s Allowance and Universal Credit', () => {
  it('CA comes off UC pound for pound: no change while UC is larger than CA', () => {
    const r = caAndUc({ earningsMonthly: 0, rent: 500 });
    expect(r.caMonthly).toBeCloseTo(374.62, 2);
    expect(r.gain).toBeCloseTo(0, 2);
  });
  it('a gain when Universal Credit is smaller than CA', () => {
    const r = caAndUc({ earningsMonthly: 2000, rent: 0 });
    expect(r.ucWith).toBe(0); expect(r.gain).toBeGreaterThan(0);
  });
});

describe('Carer’s Allowance at State Pension age', () => {
  it('underlying entitlement: nothing paid, Pension Credit carer amount £48.15', () => {
    const r = caAtPensionAge({ statePension: 230 });
    expect(r.caPaid).toBe(0); expect(r.underlying).toBe(true);
    expect(r.pcWith - r.pcWithout).toBeCloseTo(48.15, 2);
  });
  it('small pension: CA tops up the difference', () => expect(caAtPensionAge({ statePension: 60 }).caPaid).toBe(26.45));
});

describe('Carer’s Allowance weekly', () => {
  it('35 hours and £204', () => {
    expect(caWeekly({ hours: 35, countedEarnings: 204 }).weekly).toBe(86.45);
    expect(caWeekly({ hours: 34, countedEarnings: 0 }).ok).toBe(false);
  });
});

describe('Scottish carer package', () => {
  it('mygov.scot example: £60 overlapping benefit gives £26.45 + £11.70', () => {
    const r = scottishCarerPackage({ overlapping: 60, additionalPeople: 0 });
    expect(r.csp).toBe(26.45); expect(r.weekly).toBeCloseTo(38.15, 2);
  });
  it('a £0 award loses the supplement and the additional person payment', () => expect(scottishCarerPackage({ overlapping: 100, additionalPeople: 2 }).weekly).toBe(0));
  it('full package with one additional person', () => expect(scottishCarerPackage({ overlapping: 0, additionalPeople: 1 }).weekly).toBeCloseTo(108.55, 2));
});

describe('Carer’s Credit', () => {
  it('20 hours and a qualifying benefit', () => {
    expect(carersCredit({ hours: 20, benefit: 'yes' }).route).toBe('apply');
    expect(carersCredit({ hours: 19, benefit: 'yes' }).eligible).toBe(false);
    expect(carersCredit({ hours: 25, benefit: 'certificate' }).route).toBe('certificate');
    expect(carersCredit({ hours: 25, benefit: 'yes' }).perYear).toBeCloseTo(6.89, 2);
  });
});
