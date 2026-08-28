import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Sliders,
  DollarSign,
  Calendar,
  Layers,
  PieChart as PieIcon,
  RefreshCw,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Download,
  Share2,
  GitCompare,
  Percent,
  Activity,
  Award,
  ChevronDown,
  ChevronUp,
  Info,
  HelpCircle,
  Zap,
  Target,
  FileSpreadsheet,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  SimulationParameters,
  SimulationResult,
  UserSettings,
  AssetClassType,
  RebalanceFreq,
} from '../types';
import {
  runSimulation,
  formatCurrency,
  ASSET_CLASS_PROFILES,
} from '../utils/simulationEngine';

interface UnifiedEngineScreenProps {
  userSettings: UserSettings;
  onExportReport: (result: SimulationResult) => void;
}

const PRESET_QUICK_CONFIGS = [
  {
    name: 'Retirement 2050 (30yr)',
    assetClass: 'S&P 500 (100% Equity)' as AssetClassType,
    initial: 25000,
    monthly: 1500,
    years: 30,
    desc: '30-year long-term compounding with index growth',
  },
  {
    name: 'Aggressive FIRE (15yr)',
    assetClass: 'Tech Heavy (QQQ Tilt)' as AssetClassType,
    initial: 50000,
    monthly: 3500,
    years: 15,
    desc: 'High savings rate & growth tilt for rapid financial freedom',
  },
  {
    name: 'Balanced 60/40 (20yr)',
    assetClass: 'Balanced (60/40)' as AssetClassType,
    initial: 40000,
    monthly: 1200,
    years: 20,
    desc: 'Moderated volatility with bonds and equity mix',
  },
  {
    name: 'All-Weather Dalio (25yr)',
    assetClass: 'All-Weather (Ray Dalio)' as AssetClassType,
    initial: 60000,
    monthly: 1800,
    years: 25,
    desc: 'Maximum downside resilience across all market regimes',
  },
];

export const UnifiedEngineScreen: React.FC<UnifiedEngineScreenProps> = ({
  userSettings,
  onExportReport,
}) => {
  const isLight = userSettings.theme === 'light';

  // Instructions collapsed state (open by default for first-time clarity, with a clean toggle)
  const [showInstructions, setShowInstructions] = useState<boolean>(true);

  // Primary Strategy Parameters (Strategy A)
  const [paramsA, setParamsA] = useState<SimulationParameters>({
    name: 'Strategy A (Primary)',
    assetClass: 'S&P 500 (100% Equity)',
    initialInvestment: 30000,
    monthlyContribution: 1500,
    timeHorizon: 25,
    rebalancingFrequency: 'Annually',
    startYear: new Date().getFullYear(),
    startAge: userSettings.startingAge,
  });

  // Strategy Comparison Mode
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [paramsB, setParamsB] = useState<SimulationParameters>({
    name: 'Strategy B (Benchmark)',
    assetClass: 'Balanced (60/40)',
    initialInvestment: 30000,
    monthlyContribution: 1500,
    timeHorizon: 25,
    rebalancingFrequency: 'Quarterly',
    startYear: new Date().getFullYear(),
    startAge: userSettings.startingAge,
  });

  // Advanced Settings Toggle
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [activeChartTab, setActiveChartTab] = useState<'growth' | 'distribution' | 'milestones'>('growth');
  const [showAllYears, setShowAllYears] = useState<boolean>(false);

  // Reactively calculate Simulation Results
  const currentSimulation = useMemo(() => {
    return runSimulation(
      {
        ...paramsA,
        startAge: userSettings.startingAge,
      },
      isComparing
        ? {
            ...paramsB,
            initialInvestment: paramsA.initialInvestment,
            monthlyContribution: paramsA.monthlyContribution,
            timeHorizon: paramsA.timeHorizon,
            startAge: userSettings.startingAge,
          }
        : null
    );
  }, [paramsA, paramsB, isComparing, userSettings]);

  // Secondary simulation for standalone comparison metrics
  const comparisonResult = useMemo(() => {
    if (!isComparing) return null;
    return runSimulation(
      {
        ...paramsB,
        initialInvestment: paramsA.initialInvestment,
        monthlyContribution: paramsA.monthlyContribution,
        timeHorizon: paramsA.timeHorizon,
        startAge: userSettings.startingAge,
      },
      null
    );
  }, [paramsA, paramsB, isComparing, userSettings]);

  // Calculate milestones ($100K, $250K, $500K, $1M, $2M, $5M)
  const milestoneTargets = [100000, 250000, 500000, 1000000, 2000000, 5000000];
  const milestones = useMemo(() => {
    return milestoneTargets.map((target) => {
      const reachedPointA = currentSimulation.yearlyData.find((p) => p.optimizedValue >= target);
      const reachedPointB = comparisonResult?.yearlyData.find((p) => p.optimizedValue >= target);
      return {
        target,
        reachedA: reachedPointA ? { year: reachedPointA.year, age: reachedPointA.age } : null,
        reachedB: reachedPointB ? { year: reachedPointB.year, age: reachedPointB.age } : null,
      };
    });
  }, [currentSimulation, comparisonResult]);

  // Load a quick preset
  const applyPreset = (preset: (typeof PRESET_QUICK_CONFIGS)[0]) => {
    setParamsA((prev) => ({
      ...prev,
      assetClass: preset.assetClass,
      initialInvestment: preset.initial,
      monthlyContribution: preset.monthly,
      timeHorizon: preset.years,
    }));
  };

  const assetClasses: AssetClassType[] = [
    'S&P 500 (100% Equity)',
    'Balanced (60/40)',
    'Aggressive Growth (80/20)',
    'Tech Heavy (QQQ Tilt)',
    'All-Weather (Ray Dalio)',
    'Dividend Growth',
  ];

  const rebalanceFrequencies: RebalanceFreq[] = ['Annually', 'Quarterly', 'Monthly', 'Never'];

  const wealthDifference = comparisonResult
    ? currentSimulation.projectedFinalValue - comparisonResult.projectedFinalValue
    : 0;

  return (
    <div className={`flex-grow w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-20 pb-16 flex flex-col gap-8 transition-colors duration-200`}>
      
      {/* 1. Interactive Simulation Controls & How to Use Guide Side-by-Side (Matched Height) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Interactive Simulation Controls (lg:col-span-7) */}
        <div
          className={`lg:col-span-7 rounded-xl border p-6 shadow-lg transition-all flex flex-col justify-between h-full ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#1e2023] border-[#414754] text-[#f3dfd1]'
          }`}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-[#414754]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#ff8c00]/10 border border-[#ff8c00]/30 flex items-center justify-center text-[#ff8c00]">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight">Interactive Simulation Controls</h2>
                <p className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-[#ddc1ae]/70'}`}>
                  Adjust capital, deposit rate, timeline, and strategy allocation
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`text-xs font-mono flex items-center gap-1.5 px-3 py-1.5 rounded border transition-colors cursor-pointer ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                  : 'bg-[#111316] hover:bg-[#2a2d32] text-[#ddc1ae] border-[#414754]'
              }`}
            >
              <span>{showAdvanced ? 'Hide Advanced' : 'Advanced & Age'}</span>
              {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Primary Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Time Horizon Slider */}
            <div className={`p-4 rounded-lg border ${isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-[#150c06]/40 border-[#414754]/60'}`}>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-mono uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#ff8c00]" /> Time Horizon
                </label>
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-[#ff8c00]/15 text-[#ff8c00]">
                  {paramsA.timeHorizon} Yrs (Age {userSettings.startingAge + paramsA.timeHorizon})
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="45"
                step="1"
                value={paramsA.timeHorizon}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setParamsA((p) => ({ ...p, timeHorizon: val }));
                  setParamsB((p) => ({ ...p, timeHorizon: val }));
                }}
                className="w-full accent-[#ff8c00] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 dark:text-[#ddc1ae]/50 mt-1">
                <span>1 Year</span>
                <span>20 Yrs</span>
                <span>45 Yrs</span>
              </div>
            </div>

            {/* Initial Starting Capital ($) */}
            <div className={`p-4 rounded-lg border ${isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-[#150c06]/40 border-[#414754]/60'}`}>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-mono uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> Starting Capital
                </label>
                <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(paramsA.initialInvestment, true)}
                </span>
              </div>
              <input
                type="number"
                min="0"
                step="5000"
                value={paramsA.initialInvestment}
                onChange={(e) => {
                  const val = Math.max(0, Number(e.target.value));
                  setParamsA((p) => ({ ...p, initialInvestment: val }));
                  setParamsB((p) => ({ ...p, initialInvestment: val }));
                }}
                className={`w-full px-2.5 py-1.5 rounded text-sm font-mono border focus:outline-none focus:ring-2 focus:ring-[#ff8c00] ${
                  isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#111316] border-[#414754] text-[#f3dfd1]'
                }`}
              />
              <input
                type="range"
                min="0"
                max="500000"
                step="5000"
                value={paramsA.initialInvestment}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setParamsA((p) => ({ ...p, initialInvestment: val }));
                  setParamsB((p) => ({ ...p, initialInvestment: val }));
                }}
                className="w-full accent-emerald-500 cursor-pointer mt-2"
              />
            </div>

            {/* Monthly Contribution ($) */}
            <div className={`p-4 rounded-lg border ${isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-[#150c06]/40 border-[#414754]/60'}`}>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-mono uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#ff8c00]" /> Monthly Deposit
                </label>
                <span className="text-xs font-bold font-mono text-[#ff8c00]">
                  {formatCurrency(paramsA.monthlyContribution, false)}/mo
                </span>
              </div>
              <input
                type="number"
                min="0"
                step="100"
                value={paramsA.monthlyContribution}
                onChange={(e) => {
                  const val = Math.max(0, Number(e.target.value));
                  setParamsA((p) => ({ ...p, monthlyContribution: val }));
                  setParamsB((p) => ({ ...p, monthlyContribution: val }));
                }}
                className={`w-full px-2.5 py-1.5 rounded text-sm font-mono border focus:outline-none focus:ring-2 focus:ring-[#ff8c00] ${
                  isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#111316] border-[#414754] text-[#f3dfd1]'
                }`}
              />
              <input
                type="range"
                min="0"
                max="15000"
                step="100"
                value={paramsA.monthlyContribution}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setParamsA((p) => ({ ...p, monthlyContribution: val }));
                  setParamsB((p) => ({ ...p, monthlyContribution: val }));
                }}
                className="w-full accent-[#ff8c00] cursor-pointer mt-2"
              />
            </div>

            {/* Asset Class Selection (Strategy A) */}
            <div className={`p-4 rounded-lg border ${isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-[#150c06]/40 border-[#414754]/60'}`}>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-mono uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <PieIcon className="w-3.5 h-3.5 text-indigo-500" /> Strategy A
                </label>
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {(ASSET_CLASS_PROFILES[paramsA.assetClass]?.optimizedReturn * 100).toFixed(1)}% Return
                </span>
              </div>
              <select
                value={paramsA.assetClass}
                onChange={(e) => setParamsA((p) => ({ ...p, assetClass: e.target.value as AssetClassType }))}
                className={`w-full px-2.5 py-1.5 rounded text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-[#ff8c00] cursor-pointer ${
                  isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#111316] border-[#414754] text-[#f3dfd1]'
                }`}
              >
                {assetClasses.map((ac) => (
                  <option key={ac} value={ac}>
                    {ac}
                  </option>
                ))}
              </select>

              <div className="mt-2.5 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500 dark:text-[#ddc1ae]/70 text-[11px]">Rebalance:</span>
                <select
                  value={paramsA.rebalancingFrequency}
                  onChange={(e) => setParamsA((p) => ({ ...p, rebalancingFrequency: e.target.value as RebalanceFreq }))}
                  className={`px-2 py-0.5 rounded text-xs border focus:outline-none ${
                    isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-[#111316] border-[#414754] text-[#ddc1ae]'
                  }`}
                >
                  {rebalanceFrequencies.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Dual-Strategy Comparison Configuration Bar (When active) */}
          {isComparing && (
            <div className="mt-4 p-3.5 rounded-lg bg-[#ff8c00]/5 border border-[#ff8c00]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded bg-[#ff8c00]/20 text-[#ff8c00] flex items-center justify-center font-bold text-xs">
                  VS
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Strategy B Challenger:</span>
                    <span className="text-[#ff8c00] font-mono text-xs">{paramsB.assetClass}</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-[#ddc1ae]/80 font-mono">
                    Shares capital inputs to isolate strategic allocation differences
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <select
                  value={paramsB.assetClass}
                  onChange={(e) => setParamsB((p) => ({ ...p, assetClass: e.target.value as AssetClassType }))}
                  className={`px-2.5 py-1 rounded text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-[#ff8c00] cursor-pointer ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#111316] border-[#414754] text-[#f3dfd1]'
                  }`}
                >
                  {assetClasses.map((ac) => (
                    <option key={ac} value={ac}>
                      {ac} ({(ASSET_CLASS_PROFILES[ac]?.optimizedReturn * 100).toFixed(1)}%)
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setIsComparing(false)}
                  className="text-xs text-rose-500 hover:underline font-mono px-1 py-1 cursor-pointer"
                >
                  Disable
                </button>
              </div>
            </div>
          )}

          {/* Advanced Settings Drawer */}
          {showAdvanced && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-[#414754]/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className={`p-2.5 rounded border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#111316] border-[#414754]'}`}>
                <label className="block mb-1 font-semibold text-slate-700 dark:text-[#ddc1ae] text-[11px]">
                  Strategy A Return Override (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Historical default"
                  value={paramsA.expectedReturnOverride ?? ''}
                  onChange={(e) =>
                    setParamsA((p) => ({
                      ...p,
                      expectedReturnOverride: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                  className={`w-full px-2 py-1 rounded border text-xs focus:outline-none ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#1e2023] border-[#414754] text-white'
                  }`}
                />
              </div>

              <div className={`p-2.5 rounded border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#111316] border-[#414754]'}`}>
                <label className="block mb-1 font-semibold text-slate-700 dark:text-[#ddc1ae] text-[11px]">
                  Starting Age
                </label>
                <input
                  type="number"
                  min="18"
                  max="80"
                  value={userSettings.startingAge}
                  onChange={(e) => {
                    const age = Number(e.target.value);
                    setParamsA((p) => ({ ...p, startAge: age }));
                    setParamsB((p) => ({ ...p, startAge: age }));
                  }}
                  className={`w-full px-2 py-1 rounded border text-xs focus:outline-none ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#1e2023] border-[#414754] text-white'
                  }`}
                />
              </div>

              <div className={`p-2.5 rounded border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#111316] border-[#414754]'}`}>
                <label className="block mb-1 font-semibold text-slate-700 dark:text-[#ddc1ae] text-[11px]">
                  Rust SIMD Execution
                </label>
                <p className="text-[10px] text-slate-500 dark:text-[#ddc1ae]/80 font-mono">
                  Exact compound formula A = P(1+r/n)^nt
                </p>
                <span className="text-[10px] text-emerald-500 font-semibold block mt-0.5">
                  ✓ 0.42ms instant calc
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Step-by-Step "How to Use" Instructions Guide Card (lg:col-span-5) */}
        <div
          className={`lg:col-span-5 rounded-xl border p-6 shadow-md transition-all flex flex-col justify-between h-full ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#1e2023] border-[#414754] text-[#f3dfd1]'
          }`}
        >
          <div className="flex flex-col flex-1 justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#414754]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-500">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold tracking-tight flex items-center gap-2">
                    <span>How to Use Simulator</span>
                    <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                      4 Simple Steps
                    </span>
                  </h3>
                  <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-[#ddc1ae]/70'}`}>
                    Guide to modeling your trajectory &amp; testing strategies
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 my-3.5 flex-1 justify-between">
              {/* Step 1 */}
              <div className={`p-3 rounded-lg border flex items-start gap-3 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#150c06]/40 border-[#414754]/60'
              }`}>
                <span className="w-5 h-5 shrink-0 rounded-full bg-[#ff8c00] text-slate-950 font-bold text-[11px] flex items-center justify-center font-mono mt-0.5">
                  1
                </span>
                <div>
                  <h4 className="font-bold text-xs text-[#ff8c00]">
                    Set Starting Capital &amp; Monthly Deposit
                  </h4>
                  <p className={`text-[11px] leading-snug mt-0.5 ${isLight ? 'text-slate-600' : 'text-[#ddc1ae]/80'}`}>
                    Input current lump-sum portfolio balance and ongoing monthly savings deposits.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className={`p-3 rounded-lg border flex items-start gap-3 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#150c06]/40 border-[#414754]/60'
              }`}>
                <span className="w-5 h-5 shrink-0 rounded-full bg-[#ff8c00] text-slate-950 font-bold text-[11px] flex items-center justify-center font-mono mt-0.5">
                  2
                </span>
                <div>
                  <h4 className="font-bold text-xs text-[#ff8c00]">
                    Select Asset Allocation Strategy
                  </h4>
                  <p className={`text-[11px] leading-snug mt-0.5 ${isLight ? 'text-slate-600' : 'text-[#ddc1ae]/80'}`}>
                    Choose an asset strategy (S&P 500, Tech Tilt, 60/40, All-Weather) or pick a 1-click preset.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className={`p-3 rounded-lg border flex items-start gap-3 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#150c06]/40 border-[#414754]/60'
              }`}>
                <span className="w-5 h-5 shrink-0 rounded-full bg-[#ff8c00] text-slate-950 font-bold text-[11px] flex items-center justify-center font-mono mt-0.5">
                  3
                </span>
                <div>
                  <h4 className="font-bold text-xs text-[#ff8c00]">
                    Adjust Time Horizon Slider
                  </h4>
                  <p className={`text-[11px] leading-snug mt-0.5 ${isLight ? 'text-slate-600' : 'text-[#ddc1ae]/80'}`}>
                    Slide horizon (1 to 45 yrs) to calculate milestone age and compound growth.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className={`p-3 rounded-lg border flex items-start gap-3 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#150c06]/40 border-[#414754]/60'
              }`}>
                <span className="w-5 h-5 shrink-0 rounded-full bg-[#ff8c00] text-slate-950 font-bold text-[11px] flex items-center justify-center font-mono mt-0.5">
                  4
                </span>
                <div>
                  <h4 className="font-bold text-xs text-[#ff8c00]">
                    Compare 2 Portfolios &amp; Export
                  </h4>
                  <p className={`text-[11px] leading-snug mt-0.5 ${isLight ? 'text-slate-600' : 'text-[#ddc1ae]/80'}`}>
                    Click <strong>"Compare 2 Strategies"</strong> to isolate alpha deltas, and <strong>"Export Report"</strong> to download.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3.5 pt-2.5 border-t border-slate-200 dark:border-[#414754]/50 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-[#ddc1ae]/70">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#ff8c00]" /> Real-Time Engine
            </span>
            <span>Deterministic &amp; Stochastic</span>
          </div>
        </div>
      </section>

      {/* 2. Portfolio Performance Summary & Key Metrics */}
      <section
        className={`rounded-xl border p-6 lg:p-7 shadow-xl relative overflow-hidden transition-all flex flex-col gap-6 ${
          isLight
            ? 'bg-gradient-to-br from-white via-slate-50 to-amber-50/30 border-slate-200 text-slate-900 shadow-slate-200/50'
            : 'bg-gradient-to-br from-[#1e2023] via-[#1a1c1f] to-[#251b14] border-[#414754] text-[#f3dfd1] shadow-black/40'
        }`}
      >
        {/* Executive Headline & Quick Action Toolbar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-semibold rounded-full bg-[#ff8c00]/15 text-[#ff8c00] border border-[#ff8c00]/30">
                <Sparkles className="w-3.5 h-3.5" />
                Portfolio Performance Summary
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-[#ddc1ae]/70">
                {paramsA.assetClass} • {paramsA.timeHorizon}-Year Horizon
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              In <span className="text-[#ff8c00]">{paramsA.timeHorizon} Years</span> (Age {userSettings.startingAge + paramsA.timeHorizon}), your portfolio is projected to reach{' '}
              <span className="text-[#ff8c00] underline decoration-[#ff8c00]/40 underline-offset-4 font-mono font-bold">
                {formatCurrency(currentSimulation.projectedFinalValue, false)}
              </span>
            </h1>

            <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-[#ddc1ae]'}`}>
              Starting with {formatCurrency(paramsA.initialInvestment, false)} plus {formatCurrency(paramsA.monthlyContribution, false)}/month into{' '}
              <strong className={isLight ? 'text-slate-900 font-semibold' : 'text-white font-semibold'}>{paramsA.assetClass}</strong> yields{' '}
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                +{formatCurrency(currentSimulation.totalGain, false)}
              </span>{' '}
              in compounding capital gains (<span className="font-semibold">+{currentSimulation.totalROI}% ROI</span>).
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => setIsComparing(!isComparing)}
              className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border transition-all cursor-pointer shadow-sm ${
                isComparing
                  ? 'bg-[#ff8c00] text-slate-950 border-[#ff8c00] font-bold shadow-[#ff8c00]/20'
                  : isLight
                  ? 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
                  : 'bg-[#2a2d32] text-[#f3dfd1] border-[#414754] hover:bg-[#37393d]'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              {isComparing ? 'Comparing Active' : 'Compare 2 Strategies'}
            </button>

            <button
              onClick={() => onExportReport(currentSimulation)}
              className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                isLight
                  ? 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900'
                  : 'bg-[#ff8c00]/20 hover:bg-[#ff8c00]/30 text-[#ffb77d] border-[#ff8c00]/40'
              }`}
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* 4 Core Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Final Wealth Outcome */}
          <div className={`p-4 sm:p-5 rounded-xl border shadow-sm transition-all ${
            isLight ? 'bg-white/90 border-slate-200 text-slate-900' : 'bg-[#150c06]/50 border-[#414754] text-[#f3dfd1]'
          }`}>
            <div className="flex justify-between items-center text-xs font-mono mb-2">
              <span className="text-slate-500 dark:text-[#ddc1ae]/70 uppercase tracking-wider font-semibold">
                Projected Final Wealth
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400 mb-1">
              {formatCurrency(currentSimulation.projectedFinalValue, false)}
            </div>
            <div className="text-xs font-mono text-slate-500 dark:text-[#ddc1ae]/80 flex items-center justify-between">
              <span>At Year {paramsA.timeHorizon} (Age {userSettings.startingAge + paramsA.timeHorizon})</span>
              {isComparing && comparisonResult && (
                <span className={wealthDifference >= 0 ? 'text-emerald-500 font-bold' : 'text-rose-500 font-bold'}>
                  {wealthDifference >= 0 ? '+' : ''}{formatCurrency(wealthDifference, true)} vs B
                </span>
              )}
            </div>
          </div>

          {/* Card 2: Compound Capital Gain */}
          <div className={`p-4 sm:p-5 rounded-xl border shadow-sm transition-all ${
            isLight ? 'bg-white/90 border-slate-200 text-slate-900' : 'bg-[#150c06]/50 border-[#414754] text-[#f3dfd1]'
          }`}>
            <div className="flex justify-between items-center text-xs font-mono mb-2">
              <span className="text-slate-500 dark:text-[#ddc1ae]/70 uppercase tracking-wider font-semibold">
                Compound Capital Gain
              </span>
              <span className="text-[#ff8c00] font-bold">+{currentSimulation.totalROI}% ROI</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[#ff8c00] mb-1">
              +{formatCurrency(currentSimulation.totalGain, false)}
            </div>
            <div className="text-xs font-mono text-slate-500 dark:text-[#ddc1ae]/80">
              From {formatCurrency(currentSimulation.totalContributions, false)} total deposits
            </div>
          </div>

          {/* Card 3: Expected CAGR */}
          <div className={`p-4 sm:p-5 rounded-xl border shadow-sm transition-all ${
            isLight ? 'bg-white/90 border-slate-200 text-slate-900' : 'bg-[#150c06]/50 border-[#414754] text-[#f3dfd1]'
          }`}>
            <div className="flex justify-between items-center text-xs font-mono mb-2">
              <span className="text-slate-500 dark:text-[#ddc1ae]/70 uppercase tracking-wider font-semibold">
                Annualized CAGR
              </span>
              <span className="text-xs font-mono text-indigo-500 font-semibold">Expected Return</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-indigo-600 dark:text-indigo-400 mb-1">
              {currentSimulation.expectedCAGR}%
            </div>
            <div className="text-xs font-mono text-slate-500 dark:text-[#ddc1ae]/80 flex justify-between">
              <span>Baseline: {(ASSET_CLASS_PROFILES[paramsA.assetClass]?.baselineReturn * 100).toFixed(1)}%</span>
              {isComparing && comparisonResult && (
                <span className="text-[#ffb77d]">Strat B: {comparisonResult.expectedCAGR}%</span>
              )}
            </div>
          </div>

          {/* Card 4: Risk Profile */}
          <div className={`p-4 sm:p-5 rounded-xl border shadow-sm transition-all ${
            isLight ? 'bg-white/90 border-slate-200 text-slate-900' : 'bg-[#150c06]/50 border-[#414754] text-[#f3dfd1]'
          }`}>
            <div className="flex justify-between items-center text-xs font-mono mb-2">
              <span className="text-slate-500 dark:text-[#ddc1ae]/70 uppercase tracking-wider font-semibold">
                Risk &amp; Drawdown
              </span>
              <span className="text-xs font-mono text-amber-500 font-semibold">Sharpe: {currentSimulation.sharpeRatio}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-amber-500 mb-1">
              {currentSimulation.maxDrawdown}%
            </div>
            <div className="text-xs font-mono text-slate-500 dark:text-[#ddc1ae]/80 flex justify-between">
              <span>Historical max drop</span>
              {isComparing && comparisonResult && (
                <span>Strat B: {comparisonResult.maxDrawdown}%</span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Strategy Presets Footer */}
        <div className="pt-3 border-t border-slate-200 dark:border-[#414754]/60 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <span className={`text-xs font-mono uppercase tracking-wider font-semibold ${isLight ? 'text-slate-500' : 'text-[#ddc1ae]/70'}`}>
            Quick Scenarios:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_QUICK_CONFIGS.map((preset) => {
              const isSelected =
                paramsA.assetClass === preset.assetClass &&
                paramsA.timeHorizon === preset.years &&
                paramsA.monthlyContribution === preset.monthly;
              return (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className={`text-xs px-3 py-1 rounded-full border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#ff8c00] text-slate-950 border-[#ff8c00] font-bold shadow-sm'
                      : isLight
                      ? 'bg-white/80 hover:bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                      : 'bg-[#150c06]/60 hover:bg-[#1e2023] text-[#ddc1ae] border-[#414754] hover:border-[#ffb77d]/60'
                  }`}
                  title={preset.desc}
                >
                  {preset.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Main Data Visualizer (Chart + Breakdown Tabs) */}
      <section
        className={`rounded-xl border p-6 shadow-xl transition-all ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#1e2023] border-[#414754] text-[#f3dfd1]'
        }`}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-[#414754]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold tracking-tight">
                {isComparing ? 'Dual-Strategy Comparative Trajectory' : 'Wealth Accumulation Trajectory'}
              </h3>
              {isComparing && (
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#ff8c00]/20 text-[#ff8c00] border border-[#ff8c00]/40 rounded">
                  Comparing 2 Models
                </span>
              )}
            </div>
            <p className={`text-xs font-mono mt-0.5 ${isLight ? 'text-slate-500' : 'text-[#ddc1ae]/70'}`}>
              Projected balance across {paramsA.timeHorizon} years with 10th-90th percentile stochastic confidence range
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveChartTab('growth')}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                activeChartTab === 'growth'
                  ? 'bg-[#ff8c00] text-slate-950 font-bold'
                  : isLight
                  ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  : 'bg-[#111316] text-[#ddc1ae] hover:bg-[#2a2d32]'
              }`}
            >
              Growth Curve
            </button>
            <button
              onClick={() => setActiveChartTab('milestones')}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                activeChartTab === 'milestones'
                  ? 'bg-[#ff8c00] text-slate-950 font-bold'
                  : isLight
                  ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  : 'bg-[#111316] text-[#ddc1ae] hover:bg-[#2a2d32]'
              }`}
            >
              Milestone Timeline
            </button>
          </div>
        </div>

        {/* Chart View */}
        {activeChartTab === 'growth' && (
          <div className="w-full h-[400px] lg:h-[460px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={currentSimulation.yearlyData}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <defs>
                  <linearGradient id="colorOpt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff8c00" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ff8c00" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="colorContrib" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isLight ? '#e2e8f0' : '#414754'}
                  opacity={0.6}
                />

                <XAxis
                  dataKey="year"
                  stroke={isLight ? '#64748b' : '#ddc1ae'}
                  fontSize={12}
                  tickFormatter={(val) => `'${String(val).slice(-2)}`}
                />

                <YAxis
                  stroke={isLight ? '#64748b' : '#ddc1ae'}
                  fontSize={12}
                  tickFormatter={(val) => formatCurrency(val, true)}
                />

                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div
                          className={`p-3.5 rounded-lg border shadow-xl text-xs font-mono ${
                            isLight
                              ? 'bg-white border-slate-200 text-slate-900 shadow-slate-200'
                              : 'bg-[#1e2023] border-[#414754] text-[#f3dfd1]'
                          }`}
                        >
                          <div className="font-bold text-sm mb-2 text-[#ff8c00]">
                            Year {label} (Age {data.age})
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between gap-4">
                              <span className="text-[#ff8c00] font-semibold">Strategy A ({paramsA.assetClass}):</span>
                              <span className="font-bold">{formatCurrency(data.optimizedValue, false)}</span>
                            </div>
                            {isComparing && data.compareOptimizedValue !== undefined && (
                              <div className="flex justify-between gap-4 text-emerald-500">
                                <span className="font-semibold">Strategy B ({paramsB.assetClass}):</span>
                                <span className="font-bold">{formatCurrency(data.compareOptimizedValue, false)}</span>
                              </div>
                            )}
                            <div className="flex justify-between gap-4 text-blue-500">
                              <span>Total Contributed:</span>
                              <span>{formatCurrency(data.contributions, false)}</span>
                            </div>
                            <div className="pt-2 border-t border-slate-200 dark:border-[#414754] flex justify-between gap-4 text-[10px] text-slate-400">
                              <span>90th Percentile Bull:</span>
                              <span>{formatCurrency(data.percentile90, true)}</span>
                            </div>
                            <div className="flex justify-between gap-4 text-[10px] text-slate-400">
                              <span>10th Percentile Bear:</span>
                              <span>{formatCurrency(data.percentile10, true)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Legend wrapperStyle={{ fontSize: '12px', fontFamily: 'monospace' }} />

                {/* Strategy A Area */}
                <Area
                  type="monotone"
                  dataKey="optimizedValue"
                  name={`Strategy A: ${paramsA.assetClass}`}
                  stroke="#ff8c00"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorOpt)"
                />

                {/* Strategy B Line if Comparing */}
                {isComparing && (
                  <Line
                    type="monotone"
                    dataKey="compareOptimizedValue"
                    name={`Strategy B: ${paramsB.assetClass}`}
                    stroke="#10b981"
                    strokeWidth={2.5}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                )}

                {/* Out of pocket deposits */}
                <Area
                  type="monotone"
                  dataKey="contributions"
                  name="Total Principal Deposited"
                  stroke="#3b82f6"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#colorContrib)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Milestone Timeline View */}
        {activeChartTab === 'milestones' && (
          <div className="py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {milestones.map((m) => {
              const hasReachedA = !!m.reachedA;
              const hasReachedB = !!m.reachedB;
              return (
                <div
                  key={m.target}
                  className={`p-4 rounded-lg border flex flex-col justify-between ${
                    hasReachedA
                      ? isLight
                        ? 'bg-emerald-50/60 border-emerald-300 text-slate-900'
                        : 'bg-[#17231c]/60 border-emerald-500/40 text-[#f3dfd1]'
                      : isLight
                      ? 'bg-slate-50 border-slate-200 opacity-70'
                      : 'bg-[#150c06]/30 border-[#414754]/40 opacity-70'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-bold font-mono text-[#ff8c00]">
                        {formatCurrency(m.target, true)} Milestone
                      </span>
                      {hasReachedA ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <span className="text-[10px] font-mono text-slate-400">Beyond Horizon</span>
                      )}
                    </div>

                    <div className="text-xs font-mono space-y-1">
                      <div className="flex justify-between">
                        <span className="font-semibold text-slate-700 dark:text-[#ddc1ae]">Strategy A:</span>
                        <span className={hasReachedA ? 'font-bold text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}>
                          {hasReachedA ? `Year ${m.reachedA?.year} (Age ${m.reachedA?.age})` : 'Not Reached'}
                        </span>
                      </div>

                      {isComparing && (
                        <div className="flex justify-between">
                          <span className="font-semibold text-slate-700 dark:text-[#ddc1ae]">Strategy B:</span>
                          <span className={hasReachedB ? 'font-bold text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}>
                            {hasReachedB ? `Year ${m.reachedB?.year} (Age ${m.reachedB?.age})` : 'Not Reached'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {hasReachedA && (
                    <div className="mt-3 pt-2 border-t border-slate-200 dark:border-[#414754]/40 text-[10px] font-mono text-slate-500 dark:text-[#ddc1ae]/70">
                      Reached in {m.reachedA!.year - new Date().getFullYear()} years of compounding
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 6. 5-Year Milestone Breakdown Table */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-[#414754]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <div>
              <h4 className="text-base font-bold tracking-tight flex items-center gap-2">
                <span>{showAllYears ? 'Annual Financial Growth Schedule' : '5-Year Financial Growth Schedule'}</span>
                <span className="text-xs font-mono text-slate-400 font-normal">
                  {showAllYears ? '(Complete Year-by-Year Ledger)' : '(Sampled at 5-Year Intervallic Milestones)'}
                </span>
              </h4>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-[#ddc1ae]/70'}`}>
                Detailed progression of capital contributions, asset value, and compounding returns
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1.5 p-1 rounded-lg border border-slate-200 dark:border-[#414754] bg-slate-50 dark:bg-[#111316] text-xs font-mono">
              <button
                onClick={() => setShowAllYears(false)}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  !showAllYears
                    ? 'bg-[#ff8c00] text-slate-950 font-bold'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-[#ddc1ae] hover:text-white'
                }`}
              >
                5-Year Intervals
              </button>
              <button
                onClick={() => setShowAllYears(true)}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  showAllYears
                    ? 'bg-[#ff8c00] text-slate-950 font-bold'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-[#ddc1ae] hover:text-white'
                }`}
              >
                All Years ({currentSimulation.yearlyData.length})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className={`border-b ${isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-[#150c06]/60 border-[#414754] text-[#ddc1ae]'}`}>
                  <th className="py-2.5 px-3">Year / Age</th>
                  <th className="py-2.5 px-3">Total Invested</th>
                  <th className="py-2.5 px-3 text-[#ff8c00]">Strategy A ({paramsA.assetClass})</th>
                  {isComparing && (
                    <th className="py-2.5 px-3 text-emerald-500">Strategy B ({paramsB.assetClass})</th>
                  )}
                  {isComparing && <th className="py-2.5 px-3">Alpha Delta</th>}
                  <th className="py-2.5 px-3">Net Capital Gain</th>
                  <th className="py-2.5 px-3">90% Bull Cone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#414754]/40">
                {(showAllYears
                  ? currentSimulation.yearlyData
                  : currentSimulation.yearlyData.filter(
                      (_, idx) => idx === 0 || idx % 5 === 0 || idx === currentSimulation.yearlyData.length - 1
                    )
                ).map((row) => {
                  const gain = row.optimizedValue - row.contributions;
                  return (
                    <tr
                      key={row.year}
                      className={`hover:bg-slate-50 dark:hover:bg-[#251b14]/50 transition-colors ${
                        row.year === currentSimulation.yearlyData[currentSimulation.yearlyData.length - 1].year
                          ? 'font-bold bg-[#ff8c00]/5'
                          : ''
                      }`}
                    >
                      <td className="py-2.5 px-3">
                        {row.year} <span className="text-slate-400 text-[10px]">(Age {row.age})</span>
                      </td>
                      <td className="py-2.5 px-3 text-blue-500 font-semibold">
                        {formatCurrency(row.contributions, false)}
                      </td>
                      <td className="py-2.5 px-3 text-[#ff8c00] font-bold">
                        {formatCurrency(row.optimizedValue, false)}
                      </td>
                      {isComparing && (
                        <td className="py-2.5 px-3 text-emerald-500 font-semibold">
                          {row.compareOptimizedValue !== undefined
                            ? formatCurrency(row.compareOptimizedValue, false)
                            : '—'}
                        </td>
                      )}
                      {isComparing && (
                        <td
                          className={`py-2.5 px-3 font-semibold ${
                            (row.compareDelta ?? 0) >= 0 ? 'text-emerald-500' : 'text-rose-500'
                          }`}
                        >
                          {(row.compareDelta ?? 0) >= 0 ? '+' : ''}
                          {row.compareDelta !== undefined
                            ? formatCurrency(row.compareDelta, false)
                            : '—'}
                        </td>
                      )}
                      <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-semibold">
                        +{formatCurrency(gain, false)}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                        {formatCurrency(row.percentile90, true)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
