export type TabType = 'dashboard' | 'simulator' | 'education' | 'history';

export type AssetClassType = 
  | 'S&P 500 (100% Equity)'
  | 'Balanced (60/40)'
  | 'Aggressive Growth (80/20)'
  | 'Tech Heavy (QQQ Tilt)'
  | 'All-Weather (Ray Dalio)'
  | 'Dividend Growth'
  | 'Custom Allocation';

export type RebalanceFreq = 'Annually' | 'Quarterly' | 'Monthly' | 'Never';

export interface CustomAllocation {
  usEquity: number;
  intlEquity: number;
  bonds: number;
  realEstate: number;
  cash: number;
}

export interface SimulationParameters {
  name: string;
  assetClass: AssetClassType;
  initialInvestment: number;
  monthlyContribution: number;
  timeHorizon: number; // in years
  rebalancingFrequency: RebalanceFreq;
  startYear?: number;
  startAge?: number;
  customAllocation?: CustomAllocation;
}

export interface YearlyDataPoint {
  year: number;
  age: number;
  contributions: number;
  baselineValue: number;
  optimizedValue: number;
  delta: number;
  median: number;
  percentile10: number;
  percentile90: number;
}

export interface MonthlyDataPoint {
  month: number;
  year: number;
  contributions: number;
  baselineValue: number;
  optimizedValue: number;
  percentile10: number;
  percentile90: number;
}

export interface SimulationResult {
  id: string;
  name: string;
  timestamp: string;
  parameters: SimulationParameters;
  projectedFinalValue: number;
  baselineFinalValue: number;
  totalROI: number;
  totalContributions: number;
  expectedCAGR: number;
  maxDrawdown: number;
  sharpeRatio: number;
  yearlyData: YearlyDataPoint[];
  monthlyTrajectory: MonthlyDataPoint[];
}

export interface UserSettings {
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY';
  startingAge: number;
  inflationAdjusted: boolean;
  theme: 'dark';
}
