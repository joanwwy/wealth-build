import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  TrendingUp,
  Sliders,
  DollarSign,
  Calendar,
  Layers,
  CheckCircle2,
  XCircle,
  Split,
  Eye,
  Info,
  Maximize2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
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
import { UserSettings, SimulationParameters, AssetClassType } from '../types';
import { runSimulation, formatCurrency, ASSET_CLASS_PROFILES } from '../utils/simulationEngine';
import { UnifiedEngineScreen } from './UnifiedEngineScreen';

interface ComparisonProps {
  userSettings: UserSettings;
  onSwitchToCurrent: () => void;
}

export const ComparisonBeforeAfterScreen: React.FC<ComparisonProps> = ({
  userSettings,
  onSwitchToCurrent,
}) => {
  const isLight = userSettings.theme === 'light';
  const [activeView, setActiveView] = useState<'split' | 'before' | 'after'>('split');
  const [syncControls, setSyncControls] = useState<boolean>(true);

  // Common demo state for Before and After models
  const [initialCapital, setInitialCapital] = useState<number>(30000);
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(1500);
  const [timeHorizon, setTimeHorizon] = useState<number>(25);
  const [assetClass, setAssetClass] = useState<AssetClassType>('S&P 500 (100% Equity)');

  // Legacy state specific features
  const [legacyCurrency, setLegacyCurrency] = useState<string>('USD ($)');
  const [legacyDiscountInflation, setLegacyDiscountInflation] = useState<boolean>(false);
  const [legacyShowInstructions, setLegacyShowInstructions] = useState<boolean>(true);

  // Simulation calculations
  const simParams: SimulationParameters = useMemo(
    () => ({
      name: 'Strategy Simulation',
      assetClass,
      initialInvestment: initialCapital,
      monthlyContribution: monthlyDeposit,
      timeHorizon,
      rebalancingFrequency: 'Annually',
      startYear: 2026,
      startAge: userSettings.startingAge || 30,
    }),
    [assetClass, initialCapital, monthlyDeposit, timeHorizon, userSettings.startingAge]
  );

  const simResult = useMemo(() => {
    return runSimulation(simParams, null);
  }, [simParams]);

  return (
    <div className="flex-grow w-full max-w-[1720px] mx-auto px-2 sm:px-4 lg:px-6 pt-20 pb-16 flex flex-col gap-6">
      
      {/* Top Comparison Controller Toolbar */}
      <div
        className={`rounded-xl border p-4 sm:p-5 shadow-lg transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900'
            : 'bg-[#1e2023] border-[#414754] text-[#f3dfd1]'
        }`}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-[#ff8c00] text-slate-950">
              LIVE INTERFACE COMPARISON
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-[#ddc1ae]/70">
              Interactive Side-by-Side Simulation
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Before Feedback (Legacy Layout) <span className="text-slate-400 font-normal">vs.</span> After Feedback (Current Layout)
          </h1>
        </div>

        {/* View Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1 p-1 rounded-lg border border-slate-200 dark:border-[#414754] bg-slate-100 dark:bg-[#111316]">
            <button
              onClick={() => setActiveView('split')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeView === 'split'
                  ? 'bg-[#ff8c00] text-slate-950 font-bold shadow-sm'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-[#ddc1ae] hover:text-white'
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              <span>Side-by-Side (50/50)</span>
            </button>
            <button
              onClick={() => setActiveView('before')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeView === 'before'
                  ? 'bg-rose-500 text-white font-bold shadow-sm'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-[#ddc1ae] hover:text-white'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Only Before</span>
            </button>
            <button
              onClick={() => setActiveView('after')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeView === 'after'
                  ? 'bg-emerald-600 text-white font-bold shadow-sm'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-[#ddc1ae] hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Only After (Current)</span>
            </button>
          </div>

          <button
            onClick={onSwitchToCurrent}
            className="px-3.5 py-1.5 rounded-lg bg-[#ff8c00] hover:bg-[#ff9d24] text-slate-950 font-bold text-xs font-mono transition-colors cursor-pointer"
          >
            Launch Fullscreen Engine
          </button>
        </div>
      </div>

      {/* Main Comparative Viewport */}
      <div
        className={`grid gap-6 ${
          activeView === 'split'
            ? 'grid-cols-1 xl:grid-cols-2'
            : 'grid-cols-1'
        }`}
      >
        
        {/* ========================================================================= */}
        {/* 1. BEFORE (LEGACY INTERFACE) - FULL FUNCTIONAL SIMULATION */}
        {/* ========================================================================= */}
        {(activeView === 'split' || activeView === 'before') && (
          <div
            className={`rounded-xl border-2 border-rose-500/40 p-4 sm:p-5 flex flex-col gap-6 shadow-xl relative overflow-hidden transition-all ${
              isLight ? 'bg-slate-100/90 text-slate-900' : 'bg-[#151618] text-[#f3dfd1]'
            }`}
          >
            {/* Legacy Watermark / Header Pill */}
            <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-rose-300 dark:border-rose-900/60">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-md bg-rose-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-sm">
                  <XCircle className="w-3.5 h-3.5" />
                  BEFORE FEEDBACK (Original Architecture)
                </span>
                <span className="text-xs font-mono text-rose-600 dark:text-rose-400 font-semibold">
                  • Hero at Top • Disconnected Guide • Fixed Table
                </span>
              </div>
              <span className="text-[11px] font-mono bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded border border-rose-500/20">
                Legacy Stack
              </span>
            </div>

            {/* 1. [BEFORE] Live Portfolio Growth Engine (Placed prematurely at the very top) */}
            <div
              className={`rounded-xl border p-5 relative overflow-hidden ${
                isLight
                  ? 'bg-gradient-to-br from-white via-slate-50 to-amber-50/40 border-slate-200'
                  : 'bg-gradient-to-br from-[#1e2023] via-[#1a1c1f] to-[#251b14] border-[#414754]'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <span className="px-2.5 py-0.5 text-[11px] font-mono font-semibold rounded-full bg-[#ff8c00]/15 text-[#ff8c00] border border-[#ff8c00]/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Live Portfolio Growth Engine (Top Header)
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-1">
                In <span className="text-[#ff8c00]">{timeHorizon} Years</span>, your portfolio is projected to reach{' '}
                <span className="text-[#ff8c00] underline decoration-[#ff8c00]/40 font-mono">
                  {formatCurrency(simResult.projectedFinalValue, false)}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#ddc1ae]/80">
                Starting with {formatCurrency(initialCapital, false)} + {formatCurrency(monthlyDeposit, false)}/mo in {assetClass}.
              </p>

              {/* Legacy Clutter: 5-Currency Selector and Inflation Toggle */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#414754]/60 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Currency Selector:</span>
                  <select
                    value={legacyCurrency}
                    onChange={(e) => setLegacyCurrency(e.target.value)}
                    className="px-2 py-1 rounded bg-white dark:bg-[#111316] border border-slate-300 dark:border-[#414754] text-xs font-mono"
                  >
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                    <option>SGD (S$)</option>
                    <option>JPY (¥)</option>
                  </select>
                </div>
                <label className="flex items-center gap-1.5 text-slate-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={legacyDiscountInflation}
                    onChange={(e) => setLegacyDiscountInflation(e.target.checked)}
                    className="rounded text-[#ff8c00]"
                  />
                  <span>Discount 2.5% Inflation</span>
                </label>
              </div>
            </div>

            {/* 2. [BEFORE] Isolated Full-Width "How to use" Card */}
            <div
              className={`rounded-xl border p-4 ${
                isLight ? 'bg-white border-slate-200' : 'bg-[#1e2023] border-[#414754]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">How to use the wealthbuilder simulator</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400">
                    Full-Width Isolated Card
                  </span>
                </div>
                <button
                  onClick={() => setLegacyShowInstructions(!legacyShowInstructions)}
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-mono"
                >
                  {legacyShowInstructions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {legacyShowInstructions && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-2.5 rounded bg-slate-50 dark:bg-[#111316] border border-slate-200 dark:border-[#414754]">
                    <div className="font-bold text-[#ff8c00] mb-0.5">1. Starting Capital</div>
                    <div className="text-slate-500 text-[11px]">Set seed savings &amp; monthly deposits.</div>
                  </div>
                  <div className="p-2.5 rounded bg-slate-50 dark:bg-[#111316] border border-slate-200 dark:border-[#414754]">
                    <div className="font-bold text-[#ff8c00] mb-0.5">2. Select Strategy</div>
                    <div className="text-slate-500 text-[11px]">Choose asset profile or equities.</div>
                  </div>
                  <div className="p-2.5 rounded bg-slate-50 dark:bg-[#111316] border border-slate-200 dark:border-[#414754]">
                    <div className="font-bold text-[#ff8c00] mb-0.5">3. Adjust Horizon</div>
                    <div className="text-slate-500 text-[11px]">Drag horizon slider (1-50 yrs).</div>
                  </div>
                  <div className="p-2.5 rounded bg-slate-50 dark:bg-[#111316] border border-slate-200 dark:border-[#414754]">
                    <div className="font-bold text-[#ff8c00] mb-0.5">4. Compare &amp; Export</div>
                    <div className="text-slate-500 text-[11px]">Download JSON or CSV reports.</div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. [BEFORE] Controls Section (Far below the top hero) */}
            <div
              className={`rounded-xl border p-5 ${
                isLight ? 'bg-white border-slate-200' : 'bg-[#1e2023] border-[#414754]'
              }`}
            >
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200 dark:border-[#414754]">
                <span className="font-bold text-sm flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-[#ff8c00]" />
                  Interactive Simulation Controls
                </span>
                <span className="text-[10px] font-mono text-slate-400">Positioned Below Summary</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-slate-400 mb-1">Starting Capital ($)</label>
                  <input
                    type="number"
                    value={initialCapital}
                    onChange={(e) => setInitialCapital(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded bg-slate-50 dark:bg-[#111316] border border-slate-200 dark:border-[#414754] font-bold font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Monthly Deposit ($)</label>
                  <input
                    type="number"
                    value={monthlyDeposit}
                    onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded bg-slate-50 dark:bg-[#111316] border border-slate-200 dark:border-[#414754] font-bold font-mono text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Time Horizon</span>
                    <span className="font-bold text-[#ff8c00]">{timeHorizon} Years</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={50}
                    value={timeHorizon}
                    onChange={(e) => setTimeHorizon(Number(e.target.value))}
                    className="w-full accent-[#ff8c00]"
                  />
                </div>
              </div>
            </div>

            {/* 4. [BEFORE] 4 Disconnected Metric Boxes */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3 rounded-lg border ${isLight ? 'bg-white border-slate-200' : 'bg-[#1e2023] border-[#414754]'}`}>
                <div className="text-[10px] font-mono text-slate-400 uppercase">Projected Wealth</div>
                <div className="text-lg font-bold font-mono text-emerald-500">
                  {formatCurrency(simResult.projectedFinalValue, false)}
                </div>
              </div>
              <div className={`p-3 rounded-lg border ${isLight ? 'bg-white border-slate-200' : 'bg-[#1e2023] border-[#414754]'}`}>
                <div className="text-[10px] font-mono text-slate-400 uppercase">Capital Gain</div>
                <div className="text-lg font-bold font-mono text-[#ff8c00]">
                  +{formatCurrency(simResult.totalGain, false)}
                </div>
              </div>
              <div className={`p-3 rounded-lg border ${isLight ? 'bg-white border-slate-200' : 'bg-[#1e2023] border-[#414754]'}`}>
                <div className="text-[10px] font-mono text-slate-400 uppercase">Annual CAGR</div>
                <div className="text-lg font-bold font-mono text-indigo-400">{simResult.expectedCAGR}%</div>
              </div>
              <div className={`p-3 rounded-lg border ${isLight ? 'bg-white border-slate-200' : 'bg-[#1e2023] border-[#414754]'}`}>
                <div className="text-[10px] font-mono text-slate-400 uppercase">Max Drawdown</div>
                <div className="text-lg font-bold font-mono text-amber-500">{simResult.maxDrawdown}%</div>
              </div>
            </div>

            {/* 5. [BEFORE] Fixed Table titled "Year-by-Year" */}
            <div
              className={`rounded-xl border p-4 ${
                isLight ? 'bg-white border-slate-200' : 'bg-[#1e2023] border-[#414754]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs">Year-by-Year Financial Growth Schedule</span>
                <span className="text-[10px] font-mono text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded">
                  Fixed 5-Yr Sample Only
                </span>
              </div>
              <div className="overflow-x-auto text-[11px] font-mono">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-[#414754] text-slate-400">
                      <th className="pb-1.5">Year</th>
                      <th className="pb-1.5">Deposits</th>
                      <th className="pb-1.5">Total Value</th>
                      <th className="pb-1.5">Net Gain</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#414754]/30">
                    {simResult.yearlyData
                      .filter((_, idx) => idx === 0 || idx % 5 === 0 || idx === simResult.yearlyData.length - 1)
                      .slice(0, 4)
                      .map((row) => (
                        <tr key={row.year} className="py-1">
                          <td className="py-1">Yr {row.year}</td>
                          <td className="py-1 text-blue-400">{formatCurrency(row.contributions, false)}</td>
                          <td className="py-1 font-bold text-[#ff8c00]">{formatCurrency(row.optimizedValue, false)}</td>
                          <td className="py-1 text-emerald-500">+{formatCurrency(row.optimizedValue - row.contributions, false)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. AFTER (CURRENT STREAMLINED INTERFACE) - FULL FUNCTIONAL EMBED */}
        {/* ========================================================================= */}
        {(activeView === 'split' || activeView === 'after') && (
          <div
            className={`rounded-xl border-2 border-emerald-500/50 p-4 sm:p-5 flex flex-col gap-6 shadow-xl relative overflow-hidden transition-all ${
              isLight ? 'bg-slate-50/90 text-slate-900' : 'bg-[#151618] text-[#f3dfd1]'
            }`}
          >
            {/* Current Watermark / Header Pill */}
            <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-emerald-300 dark:border-emerald-900/60">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-md bg-emerald-600 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  AFTER FEEDBACK (Current Live Architecture)
                </span>
                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  • Side-by-Side 7:5 Layout • Unified Summary Banner • 5-Year Schedule with Toggle
                </span>
              </div>
              <button
                onClick={onSwitchToCurrent}
                className="text-[11px] font-mono bg-emerald-600 text-white px-2.5 py-1 rounded hover:bg-emerald-500 font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Live App</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* Embedded Live Unified Engine */}
            <div className="w-full">
              <UnifiedEngineScreen
                userSettings={userSettings}
                onExportReport={() => {}}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
