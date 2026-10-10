import { describe, expect, it } from 'vitest';
import { pipNextPayments, pipPaydaysInTaxYear, paydayName, pipRequiredPeriod, aaQualifyFrom, aaWithPensionCredit, dlaChild, dwpStopsAfterMove, newStyleEsa } from './disability-extra';

describe('PIP payment dates', () => {
  it('every 4 weeks on the same weekday', () => {
    const p = pipNextPayments('2026-10-06', 3);
    expect(p.map((x) => x.due)).toEqual(['2026-11-03', '2026-12-01', '2026-12-29']);
    expect(paydayName('2026-10-06')).toBe('Tuesday');
  });
  it('a payday on a bank holiday is paid before it (28 December 2026 is a bank holiday)', () => {
    const p = pipNextPayments('2026-11-30', 1)[0];
    expect(p.due).toBe('2026-12-28'); expect(p.paid).toBe('2026-12-24'); expect(p.moved).toBe(true);
  });
  it('13 or 14 paydays in a tax year', () => {
    const n = pipPaydaysInTaxYear('2026-10-06');
    expect([13, 14]).toContain(n);
    expect(pipPaydaysInTaxYear('2026-04-06')).toBe(14); // 6 April 2026 and 22 March 2027 + 4 weeks = 5 April 2027
  });
});

describe('Required periods', () => {
  it('PIP: 3 months back, 9 months ahead (reg. 12)', () => {
    expect(pipRequiredPeriod('2026-02-15')).toEqual({ qualifyFrom: '2026-05-15', mustLastUntil: '2027-02-15' });
  });
  it('Attendance Allowance: 6 months', () => expect(aaQualifyFrom('2026-03-31')).toBe('2026-09-30'));
  it('DWP payments stop 13 weeks after a move to Scotland', () => expect(dwpStopsAfterMove('2026-11-02')).toBe('2027-02-01'));
});

describe('Attendance Allowance and Pension Credit', () => {
  it('severe disability amount of £86.05 unless a carer is paid', () => {
    const a = aaWithPensionCredit({ rate: 'lower', weeklyIncome: 230, carerPaid: false });
    expect(a.pcBefore).toBeCloseTo(8, 2); expect(a.pcAfter).toBeCloseTo(94.05, 2); expect(a.weeklyGain).toBeCloseTo(76.7 + 86.05, 2);
    expect(aaWithPensionCredit({ rate: 'higher', weeklyIncome: 230, carerPaid: true }).pcGain).toBe(0);
  });
});

describe('DLA for children', () => {
  it('mobility age limits: lower rate from 5, higher from 3', () => {
    expect(dlaChild('middle', 'lower', 4).mobilityWeekly).toBe(0);
    expect(dlaChild('middle', 'higher', 3).mobilityWeekly).toBe(80);
    expect(dlaChild('highest', 'higher', 8).weekly).toBeCloseTo(194.6, 2);
    expect(dlaChild('lowest', 'none', 8).carerQualifies).toBe(false);
  });
});

describe('New Style ESA', () => {
  it('assessment rate by age, then £95.55 or £145.90', () => {
    expect(newStyleEsa({ age: 22, phase: 'assessment' }).weekly).toBe(75.65);
    expect(newStyleEsa({ age: 22, phase: 'wrag' }).weekly).toBe(95.55);
    expect(newStyleEsa({ age: 40, phase: 'support' }).weekly).toBeCloseTo(145.9, 2);
  });
  it('GOV.UK example: £100 private pension takes off £7.50', () => expect(newStyleEsa({ age: 40, phase: 'wrag', privatePension: 100 }).pensionCut).toBe(7.5));
});
