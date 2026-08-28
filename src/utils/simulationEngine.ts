import { SimulationParameters, SimulationResult, YearlyDataPoint, MonthlyDataPoint, AssetClassType } from '../types';

export const ASSET_CLASS_PROFILES: Record<AssetClassType, {
  baselineReturn: number;
  optimizedReturn: number;
  volatility: number;
  maxDrawdown: number;
  sharpeRatio: number;
  description: string;
}> = {
  'S&P 500 (100% Equity)': {
    baselineReturn: 0.102,
    optimizedReturn: 0.124,
    volatility: 0.162,
    maxDrawdown: -24.5,
    sharpeRatio: 1.42,
    description: '100% Large-Cap US Equities, high historical capital appreciation.'
  },
  'Balanced (60/40)': {
    baselineReturn: 0.076,
    optimizedReturn: 0.092,
    volatility: 0.104,
    maxDrawdown: -14.2,
    sharpeRatio: 1.58,
    description: '60% Global Equities / 40% Fixed Income, moderate risk profile.'
  },
  'Aggressive Growth (80/20)': {
    baselineReturn: 0.094,
    optimizedReturn: 0.116,
    volatility: 0.145,
    maxDrawdown: -20.8,
    sharpeRatio: 1.46,
    description: '80% Growth Equities / 20% Alternative Yield, high target trajectory.'
  },
  'Tech Heavy (QQQ Tilt)': {
    baselineReturn: 0.121,
    optimizedReturn: 0.148,
    volatility: 0.215,
    maxDrawdown: -32.4,
    sharpeRatio: 1.34,
    description: 'Nasdaq-100 index tilt, superior secular growth with elevated variance.'
  },
  'All-Weather (Ray Dalio)': {
    baselineReturn: 0.071,
    optimizedReturn: 0.086,
    volatility: 0.078,
    maxDrawdown: -9.8,
    sharpeRatio: 1.72,
    description: 'Risk-parity diversified across equities, commodities, gold, and long bonds.'
  },
  'Dividend Growth': {
    baselineReturn: 0.084,
    optimizedReturn: 0.105,
    volatility: 0.128,
    maxDrawdown: -16.5,
    sharpeRatio: 1.51,
    description: 'High dividend aristocrats with automated DRIP compounding.'
  },
  'Custom Allocation': {
    baselineReturn: 0.088,
    optimizedReturn: 0.110,
    volatility: 0.135,
    maxDrawdown: -18.0,
    sharpeRatio: 1.48,
    description: 'Tailored multi-asset allocation.'
  }
};

/**
 * Deterministic Rust-formula compound interest calculation:
 * A = P(1 + r/n)^(nt) + PMT * [((1 + r/n)^(nt) - 1) / (r/n)]
 */
export function calculateCompoundGrowth(
  principal: number,
  annualRate: number,
  years: number,
  monthlyContribution: number
): number {
  if (years <= 0) return principal;
  const r_n = annualRate / 12.0;
  const nt = years * 12.0;
  
  if (r_n === 0) {
    return principal + monthlyContribution * nt;
  }

  const compoundPrincipal = principal * Math.pow(1.0 + r_n, nt);
  const futureSeries = monthlyContribution * ((Math.pow(1.0 + r_n, nt) - 1.0) / r_n);
  return compoundPrincipal + futureSeries;
}

export function runSimulation(params: SimulationParameters): SimulationResult {
  const profile = ASSET_CLASS_PROFILES[params.assetClass] || ASSET_CLASS_PROFILES['S&P 500 (100% Equity)'];
  
  // Rebalancing alpha bonus factor
  const rebalanceBonus = 
    params.rebalancingFrequency === 'Annually' ? 0.005 :
    params.rebalancingFrequency === 'Quarterly' ? 0.007 :
    params.rebalancingFrequency === 'Monthly' ? 0.008 : 0;

  const baselineRate = profile.baselineReturn;
  const optimizedRate = profile.optimizedReturn + rebalanceBonus;

  const startYear = params.startYear || 2024;
  const startAge = params.startAge || 35;
  const horizon = Math.max(1, params.timeHorizon);

  const yearlyData: YearlyDataPoint[] = [];
  const monthlyTrajectory: MonthlyDataPoint[] = [];

  // Pre-generate monthly steps
  const totalMonths = horizon * 12;
  for (let m = 0; m <= totalMonths; m++) {
    const yr = m / 12;
    const currentYearNum = startYear + Math.floor(yr);
    const contributions = params.initialInvestment + params.monthlyContribution * m;

    const baseVal = calculateCompoundGrowth(params.initialInvestment, baselineRate, yr, params.monthlyContribution);
    const optVal = calculateCompoundGrowth(params.initialInvestment, optimizedRate, yr, params.monthlyContribution);

    // Stochastic volatility spread for confidence intervals
    const varianceFactor = Math.sqrt(Math.max(0.1, yr)) * profile.volatility;
    const p10 = optVal * Math.exp(-1.28 * varianceFactor);
    const p90 = optVal * Math.exp(1.28 * varianceFactor);

    monthlyTrajectory.push({
      month: m,
      year: currentYearNum,
      contributions: Math.round(contributions),
      baselineValue: Math.round(baseVal),
      optimizedValue: Math.round(optVal),
      percentile10: Math.round(p10),
      percentile90: Math.round(p90)
    });
  }

  // Generate yearly data steps (matching 4-year stepping if 16-20+ years, or annual)
  for (let y = 0; y <= horizon; y++) {
    const currentYear = startYear + y;
    const currentAge = startAge + y;
    const months = y * 12;
    const contributions = params.initialInvestment + params.monthlyContribution * months;
    
    const baselineVal = calculateCompoundGrowth(params.initialInvestment, baselineRate, y, params.monthlyContribution);
    const optimizedVal = calculateCompoundGrowth(params.initialInvestment, optimizedRate, y, params.monthlyContribution);
    
    const varianceFactor = Math.sqrt(Math.max(0.1, y)) * profile.volatility;
    const p10 = optimizedVal * Math.exp(-1.28 * varianceFactor);
    const p90 = optimizedVal * Math.exp(1.28 * varianceFactor);

    yearlyData.push({
      year: currentYear,
      age: currentAge,
      contributions: Math.round(contributions),
      baselineValue: Math.round(baselineVal),
      optimizedValue: Math.round(optimizedVal),
      delta: Math.round(optimizedVal - baselineVal),
      median: Math.round(optimizedVal),
      percentile10: Math.round(p10),
      percentile90: Math.round(p90)
    });
  }

  const finalYearData = yearlyData[yearlyData.length - 1];
  const projectedFinalValue = finalYearData.optimizedValue;
  const baselineFinalValue = finalYearData.baselineValue;
  const totalContributions = finalYearData.contributions;

  // Annualized CAGR
  const totalROI = Number(((optimizedRate) * 100).toFixed(1));
  const expectedCAGR = Number((optimizedRate * 100).toFixed(1));

  return {
    id: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    name: params.name || 'Model Run',
    timestamp: new Date().toISOString(),
    parameters: params,
    projectedFinalValue,
    baselineFinalValue,
    totalROI,
    totalContributions,
    expectedCAGR,
    maxDrawdown: profile.maxDrawdown,
    sharpeRatio: profile.sharpeRatio,
    yearlyData,
    monthlyTrajectory
  };
}

/**
 * Seed initial model matching "Q4 Model Alpha" from the reference screens
 */
export const SEED_Q4_MODEL: SimulationResult = {
  id: 'q4_model_alpha',
  name: 'Q4 Model Alpha',
  timestamp: '2024-10-15T14:30:00.000Z',
  parameters: {
    name: 'Q4 Model Alpha',
    assetClass: 'S&P 500 (100% Equity)',
    initialInvestment: 50000,
    monthlyContribution: 2500,
    timeHorizon: 16,
    rebalancingFrequency: 'Annually',
    startYear: 2024,
    startAge: 35
  },
  projectedFinalValue: 2400000,
  baselineFinalValue: 1850000,
  totalROI: 14.2,
  totalContributions: 500000,
  expectedCAGR: 12.4,
  maxDrawdown: -22.8,
  sharpeRatio: 1.42,
  yearlyData: [
    { year: 2024, age: 35, contributions: 50000, baselineValue: 105000, optimizedValue: 112000, delta: 7000, median: 112000, percentile10: 95000, percentile90: 135000 },
    { year: 2028, age: 39, contributions: 150000, baselineValue: 320000, optimizedValue: 365000, delta: 45000, median: 365000, percentile10: 290000, percentile90: 460000 },
    { year: 2032, age: 43, contributions: 250000, baselineValue: 680000, optimizedValue: 820000, delta: 140000, median: 820000, percentile10: 640000, percentile90: 1080000 },
    { year: 2036, age: 47, contributions: 350000, baselineValue: 1200000, optimizedValue: 1550000, delta: 350000, median: 1550000, percentile10: 1180000, percentile90: 2100000 },
    { year: 2040, age: 51, contributions: 500000, baselineValue: 1850000, optimizedValue: 2400000, delta: 550000, median: 2400000, percentile10: 1750000, percentile90: 3300000 },
  ],
  monthlyTrajectory: Array.from({ length: 193 }).map((_, idx) => {
    const yr = idx / 12;
    const progress = idx / 192;
    const contrib = 50000 + progress * 450000;
    const base = 105000 + Math.pow(progress, 1.4) * (1850000 - 105000);
    const opt = 112000 + Math.pow(progress, 1.35) * (2400000 - 112000);
    return {
      month: idx,
      year: 2024 + Math.floor(yr),
      contributions: Math.round(contrib),
      baselineValue: Math.round(base),
      optimizedValue: Math.round(opt),
      percentile10: Math.round(opt * 0.73),
      percentile90: Math.round(opt * 1.38)
    };
  })
};

export const PRESET_MODELS: SimulationResult[] = [
  SEED_Q4_MODEL,
  {
    id: 'retirement_2045',
    name: 'Retirement 2045 Conservative',
    timestamp: '2024-09-28T09:15:00.000Z',
    parameters: {
      name: 'Retirement 2045 Conservative',
      assetClass: 'Balanced (60/40)',
      initialInvestment: 75000,
      monthlyContribution: 1800,
      timeHorizon: 20,
      rebalancingFrequency: 'Quarterly',
      startYear: 2024,
      startAge: 40
    },
    projectedFinalValue: 1620000,
    baselineFinalValue: 1310000,
    totalROI: 9.4,
    totalContributions: 507000,
    expectedCAGR: 9.2,
    maxDrawdown: -14.2,
    sharpeRatio: 1.58,
    yearlyData: [
      { year: 2024, age: 40, contributions: 75000, baselineValue: 75000, optimizedValue: 75000, delta: 0, median: 75000, percentile10: 68000, percentile90: 84000 },
      { year: 2029, age: 45, contributions: 183000, baselineValue: 242000, optimizedValue: 265000, delta: 23000, median: 265000, percentile10: 220000, percentile90: 318000 },
      { year: 2034, age: 50, contributions: 291000, baselineValue: 495000, optimizedValue: 570000, delta: 75000, median: 570000, percentile10: 460000, percentile90: 710000 },
      { year: 2039, age: 55, contributions: 399000, baselineValue: 860000, optimizedValue: 1020000, delta: 160000, median: 1020000, percentile10: 810000, percentile90: 1320000 },
      { year: 2044, age: 60, contributions: 507000, baselineValue: 1310000, optimizedValue: 1620000, delta: 310000, median: 1620000, percentile10: 1250000, percentile90: 2150000 },
    ],
    monthlyTrajectory: []
  },
  {
    id: 'aggressive_tech',
    name: 'Aggressive Tech Growth 2035',
    timestamp: '2024-11-02T18:45:00.000Z',
    parameters: {
      name: 'Aggressive Tech Growth 2035',
      assetClass: 'Tech Heavy (QQQ Tilt)',
      initialInvestment: 120000,
      monthlyContribution: 3500,
      timeHorizon: 15,
      rebalancingFrequency: 'Monthly',
      startYear: 2024,
      startAge: 32
    },
    projectedFinalValue: 3180000,
    baselineFinalValue: 2240000,
    totalROI: 14.8,
    totalContributions: 750000,
    expectedCAGR: 14.8,
    maxDrawdown: -32.4,
    sharpeRatio: 1.34,
    yearlyData: [
      { year: 2024, age: 32, contributions: 120000, baselineValue: 120000, optimizedValue: 120000, delta: 0, median: 120000, percentile10: 100000, percentile90: 150000 },
      { year: 2027, age: 35, contributions: 246000, baselineValue: 380000, optimizedValue: 440000, delta: 60000, median: 440000, percentile10: 310000, percentile90: 620000 },
      { year: 2031, age: 39, contributions: 414000, baselineValue: 860000, optimizedValue: 1100000, delta: 240000, median: 1100000, percentile10: 720000, percentile90: 1680000 },
      { year: 2035, age: 43, contributions: 582000, baselineValue: 1550000, optimizedValue: 2150000, delta: 600000, median: 2150000, percentile10: 1350000, percentile90: 3400000 },
      { year: 2039, age: 47, contributions: 750000, baselineValue: 2240000, optimizedValue: 3180000, delta: 940000, median: 3180000, percentile10: 1950000, percentile90: 5200000 },
    ],
    monthlyTrajectory: []
  }
];

export function formatCurrency(val: number, compact = false, currency = '$'): string {
  if (compact) {
    if (Math.abs(val) >= 1_000_000) {
      return `${currency}${(val / 1_000_000).toFixed(1)}M`;
    }
    if (Math.abs(val) >= 1_000) {
      return `${currency}${Math.round(val / 1_000)}K`;
    }
    return `${currency}${Math.round(val)}`;
  }
  return `${currency}${val.toLocaleString('en-US')}`;
}
