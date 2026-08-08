// lib/stateData.ts

export interface StateTaxConfig {
  code: string;
  name: string;
  hasStateTax: boolean;
  has529Deduction: boolean;
  max529DeductionMFJ: number;
  max529DeductionSingle: number;
  stateTaxRateMax: number;
  planName: string;
  summary: string;
}

// 1. Full 50-State Name Map
export const STATE_NAMES: Record<string, string> = {
  al: 'Alabama', ak: 'Alaska', az: 'Arizona', ar: 'Arkansas', ca: 'California',
  co: 'Colorado', ct: 'Connecticut', de: 'Delaware', fl: 'Florida', ga: 'Georgia',
  hi: 'Hawaii', id: 'Idaho', il: 'Illinois', in: 'Indiana', ia: 'Iowa',
  ks: 'Kansas', ky: 'Kentucky', la: 'Louisiana', me: 'Maine', md: 'Maryland',
  ma: 'Massachusetts', mi: 'Michigan', mn: 'Minnesota', ms: 'Mississippi', mo: 'Missouri',
  mt: 'Montana', ne: 'Nebraska', nv: 'Nevada', nh: 'New Hampshire', nj: 'New Jersey',
  nm: 'New Mexico', ny: 'New York', nc: 'North Carolina', nd: 'North Dakota', oh: 'Ohio',
  ok: 'Oklahoma', or: 'Oregon', pa: 'Pennsylvania', ri: 'Rhode Island', sc: 'South Carolina',
  sd: 'South Dakota', tn: 'Tennessee', tx: 'Texas', ut: 'Utah', vt: 'Vermont',
  va: 'Virginia', wa: 'Washington', wv: 'West Virginia', wi: 'Wisconsin', wy: 'Wyoming',
  dc: 'Washington D.C.'
};

// 2. States with NO State Personal Income Tax (Tier 2)
const NO_INCOME_TAX_STATES = new Set(['tx', 'fl', 'wa', 'nv', 'wy', 'sd', 'tn', 'ak']);

// 3. States with Income Tax but NO 529 State Tax Deduction (Tier 3)
const NO_529_DEDUCTION_STATES = new Set(['ca', 'nc', 'nj', 'de', 'hi', 'ky', 'nh']);

// 4. Custom Tier 1 Max Deduction Overrides (MFJ / Single)
const TIER_1_SPECIAL_LIMITS: Record<string, { mfj: number; single: number; rate: number; plan: string }> = {
  va: { mfj: 8000, single: 4000, rate: 0.0575, plan: 'Invest529' },
  ny: { mfj: 10000, single: 5000, rate: 0.0685, plan: 'Direct Plan (NY 529)' },
  il: { mfj: 20000, single: 10000, rate: 0.0495, plan: 'Bright Start College Savings' },
  pa: { mfj: 36000, single: 18000, rate: 0.0307, plan: 'PA 529 College Savings' },
  in: { mfj: 7500, single: 7500, rate: 0.0305, plan: 'CollegeChoice 529' },
  oh: { mfj: 4000, single: 4000, rate: 0.0375, plan: 'CollegeAdvantage 529' },
  md: { mfj: 5000, single: 2500, rate: 0.0575, plan: 'Maryland College Investment' },
  ga: { mfj: 8000, single: 4000, rate: 0.0549, plan: 'Path2College 529 Plan' },
  co: { mfj: 30000, single: 20000, rate: 0.0440, plan: 'Direct Portfolio College Savings' },
  mi: { mfj: 10000, single: 5000, rate: 0.0425, plan: 'Michigan Education Savings Program' },
};

// 5. Universal 50-State Config Resolver
export function getStateConfig(stateCode: string): StateTaxConfig {
  const code = stateCode.toLowerCase();
  const name = STATE_NAMES[code] || stateCode.toUpperCase();

  // Tier 2: No Income Tax States
  if (NO_INCOME_TAX_STATES.has(code)) {
    return {
      code: code.toUpperCase(),
      name,
      hasStateTax: false,
      has529Deduction: false,
      max529DeductionMFJ: 0,
      max529DeductionSingle: 0,
      stateTaxRateMax: 0,
      planName: `${name} Direct 529 Plan`,
      summary: `${name} has no state personal income tax. While contributions do not offer a state tax deduction, investment growth and withdrawals are 100% federal tax-free.`
    };
  }

  // Tier 3: Has Income Tax, but No 529 Deduction
  if (NO_529_DEDUCTION_STATES.has(code)) {
    return {
      code: code.toUpperCase(),
      name,
      hasStateTax: true,
      has529Deduction: false,
      max529DeductionMFJ: 0,
      max529DeductionSingle: 0,
      stateTaxRateMax: 0.05,
      planName: `${name} Direct 529 Plan`,
      summary: `${name} does not currently offer a state income tax deduction for 529 contributions. However, account earnings grow tax-deferred and withdraw tax-free for qualified education costs.`
    };
  }

  // Tier 1: Has State Income Tax AND 529 Deduction
  const override = TIER_1_SPECIAL_LIMITS[code];
  const mfj = override ? override.mfj : 5000;
  const single = override ? override.single : 2500;
  const rate = override ? override.rate : 0.05;
  const plan = override ? override.plan : `${name} 529 College Savings Plan`;

  return {
    code: code.toUpperCase(),
    name,
    hasStateTax: true,
    has529Deduction: true,
    max529DeductionMFJ: mfj,
    max529DeductionSingle: single,
    stateTaxRateMax: rate,
    planName: plan,
    summary: `${name} allows state income tax deductions up to $${mfj.toLocaleString()} per year for joint filers ($${single.toLocaleString()} for single filers) on qualified 529 contributions.`
  };
}