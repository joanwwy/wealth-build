import React, { useState } from 'react';
import {
  Play,
  TrendingUp,
  AlertTriangle,
  Scale,
  Landmark,
  LineChart,
  ArrowRight,
  Sparkles,
  Save,
  RotateCcw,
  Sliders,
  Check,
} from 'lucide-react';
import {
  SimulationParameters,
  SimulationResult,
  AssetClassType,
  RebalanceFreq,
  UserSettings,
} from '../types';
import { runSimulation, formatCurrency, ASSET_CLASS_PROFILES } from '../utils/simulationEngine';

interface SimulatorScreenProps {
  onSimulationComplete: (result: SimulationResult) => void;
  onViewDashboard: (result: SimulationResult) => void;
  userSettings: UserSettings;
  initialParams?: SimulationParameters;
}

export const SimulatorScreen: React.FC<SimulatorScreenProps> = ({
  onSimulationComplete,
  onViewDashboard,
  userSettings,
  initialParams,
}) => {
  const [modelName, setModelName] = useState(initialParams?.name || 'Simulation Run Beta');
  const [assetClass, setAssetClass] = useState<AssetClassType>(
    initialParams?.assetClass || 'S&P 500 (100% Equity)'
  );
  const [initialInvestment, setInitialInvestment] = useState<number>(
    initialParams?.initialInvestment ?? 100000
  );
  const [monthlyContribution, setMonthlyContribution] = useState<number>(
    initialParams?.monthlyContribution ?? 2500
  );
  const [timeHorizon, setTimeHorizon] = useState<number>(initialParams?.timeHorizon ?? 20);
  const [rebalancingFrequency, setRebalancingFrequency] = useState<RebalanceFreq>(
    initialParams?.rebalancingFrequency || 'Annually'
  );

  const [isExecuting, setIsExecuting] = useState(false);
  const [hasExecuted, setHasExecuted] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [activeBandView, setActiveBandView] = useState<'median' | 'confidence' | 'all'>('median');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleExecute = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsExecuting(true);

    setTimeout(() => {
      const params: SimulationParameters = {
        name: modelName,
        assetClass,
        initialInvestment,
        monthlyContribution,
        timeHorizon,
        rebalancingFrequency,
        startYear: 2024,
        startAge: userSettings.startingAge,
      };

      const result = runSimulation(params);
      setSimulationResult(result);
      setHasExecuted(true);
      setIsExecuting(false);
      onSimulationComplete(result);
    }, 350);
  };

  const handleReset = () => {
    setInitialInvestment(100000);
    setMonthlyContribution(2500);
    setTimeHorizon(20);
    setAssetClass('S&P 500 (100% Equity)');
    setRebalancingFrequency('Annually');
    setHasExecuted(false);
    setSimulationResult(null);
  };

  // Helper to generate SVG coordinate paths from simulation trajectory
  const renderChartPaths = () => {
    if (!simulationResult || simulationResult.yearlyData.length === 0) return null;

    const data = simulationResult.yearlyData;
    const maxVal = Math.max(
      ...data.map((d) => Math.max(d.percentile90, d.optimizedValue, d.baselineValue))
    ) * 1.1;

    const width = 100;
    const height = 100;

    const getX = (idx: number) => (idx / (data.length - 1)) * width;
    const getY = (val: number) => height - (val / maxVal) * height;

    // Median line path
    const medianPath = data
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)},${getY(d.optimizedValue)}`)
      .join(' ');

    // Baseline line path
    const baselinePath = data
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)},${getY(d.baselineValue)}`)
      .join(' ');

    // Confidence area polygon (p10 to p90)
    const upperPoints = data.map((d, i) => `${getX(i)},${getY(d.percentile90)}`).join(' ');
    const lowerPoints = [...data]
      .reverse()
      .map((d, i) => `${getX(data.length - 1 - i)},${getY(d.percentile10)}`)
      .join(' ');
    const confidenceArea = `M ${upperPoints} L ${lowerPoints} Z`;

    return { medianPath, baselinePath, confidenceArea, maxVal, getX, getY };
  };

  const chartPaths = renderChartPaths();

  return (
    <div className="flex-grow pt-24 pb-16 px-6 md:px-12 max-w-[1440px] mx-auto w-full flex flex-col gap-8">
      {/* Hero Section */}
      <header className="mb-2">
        <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-[#ffb77d] tracking-tight leading-tight mb-2">
          Master the Markets.
        </h1>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#ddc1ae]">
          Simulate the Future.
        </h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar - Parameters */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-[#1e2023] border border-[#414754] rounded p-6 shadow-xl relative">
            <div className="flex justify-between items-center mb-6 border-t-2 border-[#ffb77d] pt-2">
              <h3 className="text-xl md:text-2xl font-semibold text-[#f3dfd1] tracking-tight">
                Simulation Parameters
              </h3>
              <button
                onClick={handleReset}
                title="Reset to defaults"
                className="text-xs text-[#ddc1ae]/70 hover:text-[#ffb77d] flex items-center gap-1 font-mono cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            <form onSubmit={handleExecute} className="flex flex-col gap-5">
              {/* Model Tag Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#ddc1ae] uppercase tracking-wider font-mono">
                  Model Label / Name
                </label>
                <input
                  type="text"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  className="input-dark w-full rounded border p-2 text-sm font-mono"
                  placeholder="e.g. S&P Long Horizon 2044"
                />
              </div>

              {/* Asset Class */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#ddc1ae] uppercase tracking-wider font-mono">
                  Asset Class Mix
                </label>
                <select
                  value={assetClass}
                  onChange={(e) => setAssetClass(e.target.value as AssetClassType)}
                  className="input-dark w-full rounded border p-2.5 text-sm cursor-pointer"
                >
                  <option value="S&P 500 (100% Equity)">S&P 500 (100% Equity)</option>
                  <option value="Balanced (60/40)">Balanced (60/40)</option>
                  <option value="Aggressive Growth (80/20)">Aggressive Growth (80/20)</option>
                  <option value="Tech Heavy (QQQ Tilt)">Tech Heavy (QQQ Tilt)</option>
                  <option value="All-Weather (Ray Dalio)">All-Weather (Ray Dalio)</option>
                  <option value="Dividend Growth">Dividend Growth</option>
                  <option value="Custom Allocation">Custom Allocation</option>
                </select>
                <span className="text-[11px] text-[#ddc1ae]/70 leading-normal">
                  {ASSET_CLASS_PROFILES[assetClass]?.description}
                </span>
              </div>

              {/* Initial Investment */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#ddc1ae] uppercase tracking-wider font-mono">
                  Initial Investment ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(Number(e.target.value) || 0)}
                  className="input-dark w-full rounded border p-2.5 text-sm font-mono"
                />
              </div>

              {/* Monthly Contribution */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#ddc1ae] uppercase tracking-wider font-mono">
                  Monthly Contribution ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="250"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value) || 0)}
                  className="input-dark w-full rounded border p-2.5 text-sm font-mono"
                />
              </div>

              {/* Time Horizon */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-end">
                  <label className="text-xs font-semibold text-[#ddc1ae] uppercase tracking-wider font-mono">
                    Time Horizon
                  </label>
                  <span className="font-mono text-sm font-bold text-[#ffb77d]">
                    {timeHorizon} Years
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={timeHorizon}
                  onChange={(e) => setTimeHorizon(Number(e.target.value))}
                  className="mt-2"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#ddc1ae]/60">
                  <span>1 yr</span>
                  <span>25 yrs</span>
                  <span>50 yrs</span>
                </div>
              </div>

              {/* Rebalancing Frequency */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#ddc1ae] uppercase tracking-wider font-mono">
                  Rebalancing Frequency
                </label>
                <select
                  value={rebalancingFrequency}
                  onChange={(e) => setRebalancingFrequency(e.target.value as RebalanceFreq)}
                  className="input-dark w-full rounded border p-2.5 text-sm cursor-pointer"
                >
                  <option value="Annually">Annually</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Never">Never</option>
                </select>
              </div>

              {/* Execute Simulation CTA */}
              <button
                type="submit"
                disabled={isExecuting}
                className="mt-4 w-full bg-[#ff8c00] text-[#111316] py-3 rounded text-sm font-semibold hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,140,0,0.3)] cursor-pointer"
              >
                {isExecuting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#111316] border-t-transparent rounded-full animate-spin" />
                    <span>Processing Monte Carlo Nodes...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Execute Simulation</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </aside>

        {/* Right Side - Canvas & Results */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Projection Canvas */}
          <div className="bg-[#1e2023] border border-[#414754] rounded p-6 h-[400px] flex flex-col relative overflow-hidden shadow-xl">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#414754]">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#ddc1ae] font-mono">
                  PROJECTION CANVAS
                </h3>
                {hasExecuted && (
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800 px-2 py-0.5 rounded">
                    CONVERGED
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {hasExecuted && (
                  <div className="flex items-center gap-1.5 bg-[#111316] border border-[#414754] rounded p-0.5">
                    <button
                      onClick={() => setActiveBandView('median')}
                      className={`text-[10px] font-mono px-2 py-1 rounded transition-colors ${
                        activeBandView === 'median'
                          ? 'bg-[#ff8c00] text-[#111316] font-bold'
                          : 'text-[#ddc1ae] hover:text-[#f3dfd1]'
                      }`}
                    >
                      • Median
                    </button>
                    <button
                      onClick={() => setActiveBandView('confidence')}
                      className={`text-[10px] font-mono px-2 py-1 rounded transition-colors ${
                        activeBandView === 'confidence'
                          ? 'bg-[#ff8c00] text-[#111316] font-bold'
                          : 'text-[#ddc1ae] hover:text-[#f3dfd1]'
                      }`}
                    >
                      • 90th/10th
                    </button>
                  </div>
                )}
                <span className="inline-flex items-center gap-1 font-mono text-xs text-[#ddc1ae] bg-[#111316] px-2.5 py-1 rounded border border-[#414754]">
                  <span className="w-2 h-2 rounded-full bg-[#ff8c00] animate-pulse" /> Median
                </span>
              </div>
            </div>

            {/* Canvas Body */}
            {!hasExecuted ? (
              <div className="flex-grow flex items-center justify-center relative border border-[#414754]/30 rounded bg-[#111316]/50">
                {/* Empty state visual */}
                <div className="text-center z-10 flex flex-col items-center opacity-70">
                  <div className="w-12 h-12 rounded-full bg-[#37393d]/40 flex items-center justify-center mb-3 text-[#414754]">
                    <LineChart className="w-6 h-6" />
                  </div>
                  <p className="font-mono text-sm text-[#ddc1ae]">
                    Awaiting Execution Parameters...
                  </p>
                  <p className="font-mono text-xs text-[#ddc1ae]/60 mt-1">
                    Click &quot;Execute Simulation&quot; to run deterministic &amp; stochastic models
                  </p>
                </div>

                {/* Grid lines for terminal aesthetic */}
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-10 pointer-events-none">
                  <div className="border-b border-r border-[#414754]" />
                  <div className="border-b border-r border-[#414754]" />
                  <div className="border-b border-r border-[#414754]" />
                  <div className="border-b border-r border-[#414754]" />
                  <div className="border-b border-r border-[#414754]" />
                  <div className="border-b border-[#414754]" />
                  <div className="border-b border-r border-[#414754]" />
                  <div className="border-b border-r border-[#414754]" />
                  <div className="border-b border-r border-[#414754]" />
                  <div className="border-b border-r border-[#414754]" />
                  <div className="border-b border-r border-[#414754]" />
                  <div className="border-b border-[#414754]" />
                  <div className="border-b border-r border-[#414754]" />
                  <div className="border-b border-r border-[#414754]" />
                  <div className="border-b border-r border-[#414754]" />
                  <div className="border-b border-r border-[#414754]" />
                  <div className="border-b border-r border-[#414754]" />
                  <div className="border-b border-[#414754]" />
                  <div className="border-r border-[#414754]" />
                  <div className="border-r border-[#414754]" />
                  <div className="border-r border-[#414754]" />
                  <div className="border-r border-[#414754]" />
                  <div className="border-r border-[#414754]" />
                  <div />
                </div>
              </div>
            ) : (
              <div className="flex-grow flex flex-col justify-between relative border border-[#414754]/50 rounded bg-[#0d0f12] p-4">
                {/* Active Interactive SVG Plot */}
                <div className="relative w-full h-full flex items-end">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between opacity-15 pointer-events-none">
                    <div className="border-t border-[#414754] w-full" />
                    <div className="border-t border-[#414754] w-full" />
                    <div className="border-t border-[#414754] w-full" />
                    <div className="border-t border-[#414754] w-full" />
                  </div>

                  {chartPaths && (
                    <svg
                      className="absolute inset-0 w-full h-full"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient id="simGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#ff8c00" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#ff8c00" stopOpacity="0.0" />
                        </linearGradient>
                        <linearGradient id="bandGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#aec6ff" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="#aec6ff" stopOpacity="0.02" />
                        </linearGradient>
                      </defs>

                      {/* Confidence Envelope */}
                      {(activeBandView === 'confidence' || activeBandView === 'all') && (
                        <path d={chartPaths.confidenceArea} fill="url(#bandGlow)" />
                      )}

                      {/* Baseline */}
                      <path
                        d={chartPaths.baselinePath}
                        fill="none"
                        stroke="#564334"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                      />

                      {/* Median Growth */}
                      <path
                        d={chartPaths.medianPath}
                        fill="none"
                        stroke="#ff8c00"
                        strokeWidth="2.5"
                        className="drop-shadow-[0_0_8px_rgba(255,140,0,0.6)]"
                      />

                      {/* Data Point Nodes */}
                      {simulationResult?.yearlyData.map((d, idx) => {
                        const cx = chartPaths.getX(idx);
                        const cy = chartPaths.getY(d.optimizedValue);
                        const isHovered = hoveredPointIndex === idx;
                        return (
                          <g key={idx}>
                            <circle
                              cx={cx}
                              cy={cy}
                              r={isHovered ? 4.5 : 2.5}
                              fill={isHovered ? '#ffdcc3' : '#ff8c00'}
                              stroke="#111316"
                              strokeWidth={1}
                              className="transition-all duration-150 cursor-pointer"
                              onMouseEnter={() => setHoveredPointIndex(idx)}
                              onMouseLeave={() => setHoveredPointIndex(null)}
                            />
                          </g>
                        );
                      })}
                    </svg>
                  )}

                  {/* Hover Tooltip Overlay */}
                  {hoveredPointIndex !== null && simulationResult && (
                    <div
                      className="absolute top-2 left-4 bg-[#111316]/95 border border-[#ff8c00] rounded p-2.5 text-xs font-mono shadow-2xl z-30 pointer-events-none"
                    >
                      <div className="text-[#ffb77d] font-bold">
                        Year {simulationResult.yearlyData[hoveredPointIndex].year} (Age{' '}
                        {simulationResult.yearlyData[hoveredPointIndex].age})
                      </div>
                      <div className="text-[#f3dfd1] mt-0.5">
                        Optimized:{' '}
                        <span className="text-[#ff8c00] font-bold">
                          {formatCurrency(
                            simulationResult.yearlyData[hoveredPointIndex].optimizedValue
                          )}
                        </span>
                      </div>
                      <div className="text-[#ddc1ae]/70">
                        Baseline:{' '}
                        {formatCurrency(
                          simulationResult.yearlyData[hoveredPointIndex].baselineValue
                        )}
                      </div>
                      <div className="text-[#aec6ff]">
                        Delta:{' '}
                        +{formatCurrency(simulationResult.yearlyData[hoveredPointIndex].delta)}
                      </div>
                    </div>
                  )}
                </div>

                {/* X Axis Timeline Labels */}
                <div className="flex justify-between items-center text-[10px] font-mono text-[#ddc1ae]/60 pt-2 border-t border-[#414754]/40 mt-1">
                  <span>Year 0 (2024)</span>
                  <span>Year {Math.floor(timeHorizon / 2)}</span>
                  <span>Year {timeHorizon} ({2024 + timeHorizon})</span>
                </div>
              </div>
            )}
          </div>

          {/* Result Cards Bento Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Expected CAGR */}
            <div className="bg-[#1e2023] border border-[#414754] rounded p-4 flex flex-col gap-2 relative overflow-hidden group hover:border-[#ff8c00]/50 transition-colors shadow-lg">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#414754] transition-colors group-hover:bg-[#ff8c00]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#ddc1ae] font-mono">
                EXPECTED CAGR
              </span>
              <div className="text-3xl md:text-4xl font-bold text-[#ffb77d] font-mono">
                {hasExecuted && simulationResult ? `${simulationResult.expectedCAGR}%` : '--%'}
              </div>
              <div className="mt-auto pt-2 border-t border-[#414754]/50 flex justify-between items-center text-[#ddc1ae]">
                <span className="font-mono text-[10px]">Real Return</span>
                <TrendingUp className="w-4 h-4 text-[#ff8c00]" />
              </div>
            </div>

            {/* Max Drawdown */}
            <div className="bg-[#1e2023] border border-[#414754] rounded p-4 flex flex-col gap-2 relative overflow-hidden group hover:border-[#ff4d4d]/50 transition-colors shadow-lg">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#414754] transition-colors group-hover:bg-[#ff4d4d]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#ddc1ae] font-mono">
                MAX DRAWDOWN
              </span>
              <div className="text-3xl md:text-4xl font-bold text-[#ffb77d] font-mono">
                {hasExecuted && simulationResult ? `${simulationResult.maxDrawdown}%` : '--%'}
              </div>
              <div className="mt-auto pt-2 border-t border-[#414754]/50 flex justify-between items-center text-[#ddc1ae]">
                <span className="font-mono text-[10px]">Stress Test</span>
                <AlertTriangle className="w-4 h-4 text-[#ff4d4d]" />
              </div>
            </div>

            {/* Sharpe Ratio */}
            <div className="bg-[#1e2023] border border-[#414754] rounded p-4 flex flex-col gap-2 relative overflow-hidden group hover:border-[#aec6ff]/50 transition-colors shadow-lg">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#414754] transition-colors group-hover:bg-[#aec6ff]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#ddc1ae] font-mono">
                SHARPE RATIO
              </span>
              <div className="text-3xl md:text-4xl font-bold text-[#ffb77d] font-mono">
                {hasExecuted && simulationResult ? `${simulationResult.sharpeRatio}` : '-.--'}
              </div>
              <div className="mt-auto pt-2 border-t border-[#414754]/50 flex justify-between items-center text-[#ddc1ae]">
                <span className="font-mono text-[10px]">Risk Adj.</span>
                <Scale className="w-4 h-4 text-[#aec6ff]" />
              </div>
            </div>

            {/* Final Value (Med) */}
            <div className="bg-[#1e2023] border border-[#414754] rounded p-4 flex flex-col gap-2 relative overflow-hidden group hover:border-[#ff8c00]/50 transition-colors shadow-lg">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#414754] transition-colors group-hover:bg-[#ff8c00]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#ddc1ae] font-mono">
                FINAL VALUE (MED)
              </span>
              <div className="text-3xl md:text-4xl font-bold text-[#ffb77d] font-mono">
                {hasExecuted && simulationResult
                  ? formatCurrency(simulationResult.projectedFinalValue, true)
                  : '$---k'}
              </div>
              <div className="mt-auto pt-2 border-t border-[#414754]/50 flex justify-between items-center text-[#ddc1ae]">
                <span className="font-mono text-[10px]">Nominal</span>
                <Landmark className="w-4 h-4 text-[#ff8c00]" />
              </div>
            </div>
          </div>

          {/* Quick Action when simulation finishes */}
          {hasExecuted && simulationResult && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-[#241912] border border-[#ff8c00]/40 rounded shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-[#ff8c00]" />
                <div>
                  <div className="text-sm font-semibold text-[#f3dfd1]">
                    Simulation complete for &quot;{simulationResult.name}&quot;
                  </div>
                  <div className="text-xs font-mono text-[#ddc1ae]/70">
                    Projected at {formatCurrency(simulationResult.projectedFinalValue)} across {timeHorizon} years.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => onViewDashboard(simulationResult)}
                  className="w-full sm:w-auto bg-[#ff8c00] text-[#111316] font-semibold text-xs md:text-sm px-4 py-2 rounded hover:brightness-110 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Open Full Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
