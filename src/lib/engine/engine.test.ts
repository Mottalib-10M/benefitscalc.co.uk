/** Engine tests: official examples (GOV.UK, legislation) and the bounds of each rule (RECETTE §17.4). */
import { describe, expect, it } from 'vitest';
import { P } from './params';
import { computeUc, tariffIncome, standardAllowance, childElements, housingElement } from './uc';
import { lhaRate, bedroomCategory, allAreas } from './lha';
import { applyCap } from './cap';
import { computePensionCredit, pcTariff, computeHbPension, newStatePension, deferralIncrease, statePensionAge, hbNonDep } from './pension';
import { scorePip, PIP_ACTIVITIES, pipRate } from './disability';
import { childBenefitWeekly, hicbc, carersEarnings, carersWithPension, taxFreeChildcare, minEarnings3m, maternityAllowance } from './family';
import { winterFuel } from './winter';

const base = { couple: false, age: 30, children: 0, earnings: 0 };
describe('Universal Credit', () => {
  it('standard allowances 2026/27 (DWP)', () => {
    expect(standardAllowance(false, 24)).toBe(338.58); expect(standardAllowance(false, 25)).toBe(424.90);
    expect(standardAllowance(true, 22, 23)).toBe(528.34); expect(standardAllowance(true, 22, 25)).toBe(666.97);
  });
  it('single 25+, no income: the standard allowance', () => expect(computeUc(base).award).toBe(424.90));
  it('every child counts since 6 April 2026; first child born before 2017 gets £47.94 more', () => {
    expect(childElements(3)).toBeCloseTo(911.82, 2); expect(childElements(1, true)).toBeCloseTo(351.88, 2);
  });
  it('lone parent, 2 children, £1,000 earnings, no housing: 1,032.78 − 55% × (1,000 − 710) = 873.28', () => {
    expect(computeUc({ ...base, children: 2, earnings: 1000 }).award).toBe(873.28);
  });
  it('lower work allowance when housing costs are included', () => {
    const r = computeUc({ ...base, children: 1, earnings: 1000, housing: 'social', rent: 500 });
    expect(r.workAllowance).toBe(427); expect(r.earningsDeduction).toBeCloseTo(0.55 * 573, 2);
  });
  it('no work allowance without children or health element: 55% from the first pound', () => {
    expect(computeUc({ ...base, earnings: 100 }).award).toBeCloseTo(424.90 - 55, 2);
  });
  it('capital: £4.35 per £250 or part above £6,000, nothing above £16,000', () => {
    expect(tariffIncome(6000)).toBe(0); expect(tariffIncome(6001)).toBe(4.35); expect(tariffIncome(8000)).toBeCloseTo(34.8, 2);
    expect(computeUc({ ...base, savings: 16001 }).award).toBe(0);
  });
  it('LCWRA: £429.80, or £217.26 for a new health claim from 6 April 2026; no carer element on top', () => {
    expect(computeUc({ ...base, health: 'lcwra' }).maximum).toBeCloseTo(424.90 + 429.80, 2);
    expect(computeUc({ ...base, health: 'lcwraNew' }).maximum).toBeCloseTo(424.90 + 217.26, 2);
    expect(computeUc({ ...base, health: 'lcwra', carer: true }).elements.some((e) => e.key === 'carer')).toBe(false);
  });
  it('childcare: 85% up to £1,071.09 for one child and £1,836.16 for two or more', () => {
    expect(computeUc({ ...base, children: 1, childcareCosts: 2000 }).elements.find((e) => e.key === 'childcare')!.amount).toBe(1071.09);
    expect(computeUc({ ...base, children: 2, childcareCosts: 1000 }).elements.find((e) => e.key === 'childcare')!.amount).toBe(850);
  });
  it('private rent capped by the LHA of the area; social rent cut 14% for one spare room', () => {
    const cap = lhaRate('england', 'Barnsley', 2)!; expect(cap).toBe(450);
    expect(housingElement({ ...base, housing: 'private', rent: 700, nation: 'england', brma: 'Barnsley', bedrooms: 2 }).amount).toBe(450);
    expect(housingElement({ ...base, housing: 'social', rent: 500, spareRooms: 1 }).amount).toBe(430);
    expect(housingElement({ ...base, housing: 'social', rent: 500, nonDependants: 1 }).amount).toBeCloseTo(500 - 96.55, 2);
  });
  it('192 rental areas loaded', () => expect(allAreas().length).toBe(192));
  it('single under 35 without children: shared accommodation rate', () => {
    expect(bedroomCategory({ couple: false, age: 30, children: 0 })).toBe(0);
    expect(bedroomCategory({ couple: false, age: 35, children: 0 })).toBe(1);
    expect(bedroomCategory({ couple: true, age: 30, children: 3 })).toBe(3);
  });
  it('benefit cap outside London: £1,835 a month for families, lifted by £881 earnings', () => {
    expect(applyCap({ familyOrCouple: true, london: false, monthlyBenefits: 2000, earnings: 0, exempt: false }).loss).toBe(165);
    expect(applyCap({ familyOrCouple: true, london: false, monthlyBenefits: 2000, earnings: 881, exempt: false }).loss).toBe(0);
    const r = computeUc({ ...base, children: 5, housing: 'social', rent: 900 });
    expect(r.capped).toBe(true); expect(r.award).toBe(P.benefitCap.monthly.restFamily);
  });
});

describe('Pension Credit', () => {
  it('guarantee credit tops up to £238 (single) and £363.25 (couple)', () => {
    expect(computePensionCredit({ couple: false, income: 200 }).guarantee).toBe(38);
    expect(computePensionCredit({ couple: true, income: 300 }).guarantee).toBe(63.25);
  });
  it('GOV.UK example: £11,000 of savings counts as £2 a week', () => expect(pcTariff(11000)).toBe(2));
  it('savings credit (60% above £208.07, less 40% above the guarantee), capped at £17.96', () => {
    expect(computePensionCredit({ couple: false, income: 230, spaBefore2016: true }).savingsCredit).toBeCloseTo(13.16, 2);
    expect(computePensionCredit({ couple: false, income: 260, spaBefore2016: true }).savingsCredit).toBeCloseTo(9.16, 2);
    expect(computePensionCredit({ couple: false, income: 230 }).savingsCredit).toBe(0);
  });
  it('severe disability and carer additions', () => {
    expect(computePensionCredit({ couple: false, income: 238, severeDisability: 1, carer: 1 }).guarantee).toBeCloseTo(86.05 + 48.15, 2);
  });
});

describe('Housing Benefit at pension age', () => {
  it('65% of income above the applicable amount', () => {
    expect(computeHbPension({ couple: false, spaAfterApril2021: false, rent: 120, income: 280, savings: 0, guaranteeCredit: false }).hb).toBe(104.4);
  });
  it('Guarantee Credit gives maximum HB', () => expect(computeHbPension({ couple: false, spaAfterApril2021: true, rent: 150, income: 500, savings: 0, guaranteeCredit: true }).hb).toBe(150));
  it('non-dependant deductions by band', () => { expect(hbNonDep(false, 0)).toBe(20.4); expect(hbNonDep(true, 300)).toBe(64.35); expect(hbNonDep(true, 700)).toBe(131.45); });
});

describe('State Pension', () => {
  it('new State Pension: 1/35 a year, nothing under 10 years', () => {
    expect(newStatePension(35)).toBe(241.30); expect(newStatePension(20)).toBeCloseTo(137.89, 2); expect(newStatePension(9)).toBe(0);
  });
  it('deferral: 1% every 9 weeks (GOV.UK rounds 52 weeks to 5.8%)', () => {
    expect(deferralIncrease(241.30, 8)).toBe(0); expect(deferralIncrease(241.30, 9)).toBeCloseTo(2.41, 2); expect(deferralIncrease(241.30, 52)).toBeCloseTo(13.94, 2);
  });
  it('State Pension age: the worked examples of the DWP timetable', () => {
    expect(statePensionAge('1960-07-31').date).toBe('2026-11-30');
    expect(statePensionAge('1960-12-31').date).toBe('2027-09-30');
    expect(statePensionAge('1961-01-31').date).toBe('2027-11-30');
    expect(statePensionAge('1959-05-10').date).toBe('2025-05-10');
    expect(statePensionAge('1970-01-01').label).toBe('67');
    expect(statePensionAge('1977-04-20').date).toBe('2044-05-06');
    expect(statePensionAge('1980-02-02').date).toBe('2048-02-02');
  });
});

describe('PIP', () => {
  it('12 activities, 10 daily living and 2 mobility', () => expect(PIP_ACTIVITIES.filter((a) => a.part === 'daily').length).toBe(10));
  it('thresholds 8 and 12 points (regulations 5 and 6)', () => { expect(pipRate(7)).toBe('none'); expect(pipRate(8)).toBe('standard'); expect(pipRate(12)).toBe('enhanced'); });
  it('scoring adds the chosen descriptor of each activity', () => {
    const r = scorePip([5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2]);
    expect(r.daily).toBe(8); expect(r.mobility).toBe(8); expect(r.weekly).toBeCloseTo(76.70 + 30.30, 2);
  });
});

describe('Family and carers', () => {
  it('Child Benefit £27.05 + £17.90 each other child', () => expect(childBenefitWeekly(2)).toBeCloseTo(44.95, 2));
  it('HICBC: 1% per £200 above £60,000, all of it from £80,000', () => {
    expect(hicbc(60199, 1406).pct).toBe(0); expect(hicbc(70000, 1406).pct).toBe(50); expect(hicbc(80000, 1406).charge).toBe(1406);
  });
  it('GOV.UK example: £100 earnings, £60 care costs, £50 treated as an expense', () => expect(carersEarnings({ netEarnings: 100, careCosts: 60 }).counted).toBe(50));
  it('earnings limit £204 a week', () => { expect(carersEarnings({ netEarnings: 204 }).eligible).toBe(true); expect(carersEarnings({ netEarnings: 204.01 }).eligible).toBe(false); });
  it('half of pension contributions are deducted', () => expect(carersEarnings({ netEarnings: 220, pensionContrib: 40 }).counted).toBe(200));
  it('Carer’s Allowance with a State Pension: only the difference', () => { expect(carersWithPension(241.30)).toBe(0); expect(carersWithPension(60)).toBe(26.45); });
  it('Tax-Free Childcare: GOV.UK example, £250 bill, £50 top-up; £500 cap per child per quarter', () => {
    expect(taxFreeChildcare({ quarterlyCost: 250, children: 1 }).topUp).toBe(50);
    expect(taxFreeChildcare({ quarterlyCost: 4000, children: 1 }).topUp).toBe(500);
    expect(taxFreeChildcare({ quarterlyCost: 4000, children: 1, disabled: 1 }).topUp).toBe(800);
  });
  it('minimum earnings over 3 months', () => { expect(minEarnings3m(30)).toBe(2643.68); expect(minEarnings3m(19)).toBe(2256.8); });
  it('Maternity Allowance: £194.32 or 90%', () => { expect(maternityAllowance(400)).toBe(194.32); expect(maternityAllowance(150)).toBe(135); expect(maternityAllowance(29)).toBe(0); });
});

describe('Winter Fuel Payment 2026/27', () => {
  it('born on or before 27 June 1960', () => { expect(winterFuel({ dob: '1960-06-28', living: 'alone', income: 0 }).amount).toBe(0); expect(winterFuel({ dob: '1960-06-27', living: 'alone', income: 0 }).amount).toBe(200); });
  it('£300 if born before 28 September 1946', () => expect(winterFuel({ dob: '1946-09-27', living: 'alone', income: 0 }).amount).toBe(300));
  it('shared household without benefits', () => {
    expect(winterFuel({ dob: '1950-01-01', living: 'withEligible', partnerOlder: false, income: 0 }).amount).toBe(100);
    expect(winterFuel({ dob: '1940-01-01', living: 'withEligible', partnerOlder: true, income: 0 }).amount).toBe(150);
    expect(winterFuel({ dob: '1940-01-01', living: 'withEligible', partnerOlder: false, income: 0 }).amount).toBe(200);
  });
  it('reclaimed by HMRC above £35,000', () => expect(winterFuel({ dob: '1950-01-01', living: 'alone', income: 35001 }).net).toBe(0));
});
