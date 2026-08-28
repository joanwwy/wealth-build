import React, { useState } from 'react';
import {
  TrendingUp,
  Activity,
  Wallet,
  Download,
  SlidersHorizontal,
  FileSpreadsheet,
  ChevronDown,
  Layers,
  Sparkles,
} from 'lucide-react';
import { SimulationResult, UserSettings } from '../types';
import { formatCurrency } from '../utils/simulationEngine';
import { DisqusComments } from './DisqusComments';

interface DashboardScreenProps {
  simulationResult: SimulationResult;
  onRefineParameters: () => void;
  onExportReport: (result: SimulationResult) => void;
  userSettings: UserSettings;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  simulationResult,
  onRefineParameters,
  onExportReport,
  userSettings,
}) => {
  const [hoveredDataPoint, setHoveredDataPoint] = useState<number | null>(null);
  const [intervalFilter, setIntervalFilter] = useState<'4yr' | 'all'>('4yr');

  const {
    name,
    projectedFinalValue,
    baselineFinalValue,
    totalROI,
    totalContributions,
    yearlyData,
  } = simulationResult;

  const baselineDiffPercent = Number(
    (((projectedFinalValue - baselineFinalValue) / baselineFinalValue) * 100).toFixed(1)
  );

  // Filter yearly table rows
  const displayRows =
    intervalFilter === '4yr' && yearlyData.length > 6
      ? yearlyData.filter((_, idx) => idx % 4 === 0 || idx === yearlyData.length - 1)
      : yearlyData;

  // Max value for chart scaling
  const maxChartVal = Math.max(
    ...yearlyData.map((d) => Math.max(d.optimizedValue, d.baselineValue))
  ) * 1.05;

  const getChartY = (val: number) => {
    return 100 - (val / maxChartVal) * 100;
  };

  const getChartX = (idx: number, total: number) => {
    return (idx / (total - 1)) * 100;
  };

  const baselinePath = yearlyData
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getChartX(i, yearlyData.length)},${getChartY(d.baselineValue)}`)
    .join(' ');

  const optimizedPath = yearlyData
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getChartX(i, yearlyData.length)},${getChartY(d.optimizedValue)}`)
    .join(' ');

  return (
    <div className="flex-grow max-w-[1440px] mx-auto w-full px-6 md:px-12 pt-24 pb-16 flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#414754] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#ff8c00] animate-pulse"></span>
            <span className="font-mono text-xs uppercase tracking-wider text-[#ffb77d]">
              Active Simulation Model
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-[40px] font-semibold text-[#f3dfd1] tracking-tight mb-1">
            {name}
          </h1>
          <p className="text-sm md:text-base text-[#ddc1ae]">
            Simulation Results &amp; Performance Analysis
          </p>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <button
            onClick={() => onExportReport(simulationResult)}
            className="flex-1 md:flex-initial border border-[#ff8c00] text-[#ffb77d] px-4 py-2 text-sm rounded font-medium hover:bg-[#ff8c00]/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#ff8c00]" />
            <span>Export Report</span>
          </button>
          <button
            onClick={onRefineParameters}
            className="flex-1 md:flex-initial bg-[#ff8c00] text-[#111316] px-4 py-2 text-sm font-semibold rounded hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(255,140,0,0.25)]"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Refine Parameters</span>
          </button>
        </div>
      </header>

      {/* KPI Metrics Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric Card 1: Projected Final Value */}
        <div className="bg-[#1e2023] border border-[#414754] border-t-2 border-t-[#ff8c00] p-6 flex flex-col gap-2 rounded shadow-xl relative overflow-hidden">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#ddc1ae] font-mono">
            PROJECTED FINAL VALUE
          </span>
          <span className="text-4xl md:text-5xl font-bold text-[#f3dfd1] font-mono">
            {formatCurrency(projectedFinalValue, true)}
          </span>
          <div className="flex items-center gap-1.5 mt-2">
            <TrendingUp className="w-4 h-4 text-[#ff8c00]" />
            <span className="font-mono text-xs font-semibold text-[#ff8c00]">
              +{baselineDiffPercent}% vs baseline
            </span>
          </div>
        </div>

        {/* Metric Card 2: Total ROI */}
        <div className="bg-[#1e2023] border border-[#414754] p-6 flex flex-col gap-2 rounded shadow-xl relative overflow-hidden">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#ddc1ae] font-mono">
            TOTAL ROI
          </span>
          <span className="text-4xl md:text-5xl font-bold text-[#f3dfd1] font-mono">
            {totalROI}%
          </span>
          <div className="flex items-center gap-1.5 mt-2">
            <Activity className="w-4 h-4 text-[#ff8c00]" />
            <span className="font-mono text-xs text-[#ddc1ae]">Annualized return</span>
          </div>
        </div>

        {/* Metric Card 3: Total Contributions */}
        <div className="bg-[#1e2023] border border-[#414754] p-6 flex flex-col gap-2 rounded shadow-xl relative overflow-hidden">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#ddc1ae] font-mono">
            TOTAL CONTRIBUTIONS
          </span>
          <span className="text-4xl md:text-5xl font-bold text-[#f3dfd1] font-mono">
            {formatCurrency(totalContributions, true)}
          </span>
          <div className="flex items-center gap-1.5 mt-2">
            <Wallet className="w-4 h-4 text-[#aec6ff]" />
            <span className="font-mono text-xs text-[#ddc1ae]">Principal investment</span>
          </div>
        </div>
      </section>

      {/* Chart Section */}
      <section className="bg-[#1e2023] border border-[#414754] p-6 h-[420px] flex flex-col rounded shadow-xl mt-2 relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-[#f3dfd1] tracking-tight">
              Performance Trajectory
            </h2>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#ff8c00] rounded-full shadow-[0_0_8px_#ff8c00]" />
              <span className="font-mono text-xs text-[#ddc1ae]">Optimized Growth</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#564334] rounded-full" />
              <span className="font-mono text-xs text-[#ddc1ae]">Baseline</span>
            </div>
          </div>
        </div>

        {/* Mock/Interactive Chart Area */}
        <div className="flex-grow relative border-l border-b border-[#414754] ml-10 mb-8 mt-2">
          {/* Y Axis Labels */}
          <div className="absolute -left-12 bottom-0 h-full flex flex-col justify-between text-right font-mono text-xs text-[#ddc1ae] pb-2 pr-2 select-none">
            <span>{formatCurrency(maxChartVal, true)}</span>
            <span>{formatCurrency(maxChartVal * 0.66, true)}</span>
            <span>{formatCurrency(maxChartVal * 0.33, true)}</span>
            <span>0</span>
          </div>

          {/* X Axis Labels */}
          <div className="absolute -bottom-7 left-0 w-full flex justify-between font-mono text-xs text-[#ddc1ae] select-none px-1">
            {displayRows.map((d) => (
              <span key={d.year}>{d.year}</span>
            ))}
          </div>

          {/* Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between opacity-15 pointer-events-none">
            <div className="border-t border-[#414754] w-full" />
            <div className="border-t border-[#414754] w-full" />
            <div className="border-t border-[#414754] w-full" />
            <div className="border-t border-[#414754] w-full" />
          </div>

          {/* SVG Trajectory Lines */}
          <svg
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            {/* Baseline */}
            <path
              d={baselinePath}
              fill="none"
              stroke="#564334"
              strokeDasharray="4 4"
              strokeWidth="2"
            />

            {/* Optimized */}
            <path
              d={optimizedPath}
              fill="none"
              stroke="#ff8c00"
              strokeWidth="3"
              className="drop-shadow-[0_0_8px_rgba(255,140,0,0.6)]"
            />

            {/* Point nodes */}
            {yearlyData.map((d, i) => {
              const cx = getChartX(i, yearlyData.length);
              const cy = getChartY(d.optimizedValue);
              const isHovered = hoveredDataPoint === i;
              return (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 5 : i === yearlyData.length - 1 ? 4.5 : 3}
                  fill={isHovered ? '#ffdcc3' : '#ff8c00'}
                  stroke="#111316"
                  strokeWidth="1.5"
                  className="cursor-pointer transition-all duration-150"
                  onMouseEnter={() => setHoveredDataPoint(i)}
                  onMouseLeave={() => setHoveredDataPoint(null)}
                />
              );
            })}
          </svg>

          {/* Interactive Point Tooltip Card */}
          {hoveredDataPoint !== null && (
            <div className="absolute top-2 left-6 bg-[#111316]/95 border border-[#ff8c00] rounded p-3 text-xs font-mono shadow-2xl z-30 pointer-events-none">
              <div className="text-[#ffb77d] font-bold text-sm">
                Year {yearlyData[hoveredDataPoint].year} • Age {yearlyData[hoveredDataPoint].age}
              </div>
              <div className="text-[#f3dfd1] mt-1">
                Optimized:{' '}
                <span className="text-[#ff8c00] font-bold">
                  {formatCurrency(yearlyData[hoveredDataPoint].optimizedValue)}
                </span>
              </div>
              <div className="text-[#ddc1ae]/80">
                Baseline: {formatCurrency(yearlyData[hoveredDataPoint].baselineValue)}
              </div>
              <div className="text-[#aec6ff]">
                Principal Contribs: {formatCurrency(yearlyData[hoveredDataPoint].contributions)}
              </div>
              <div className="text-emerald-400 font-semibold mt-0.5">
                Delta: +{formatCurrency(yearlyData[hoveredDataPoint].delta)}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Data Table Section: Yearly Breakdown Matrix */}
      <section className="mt-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#f3dfd1] tracking-tight">
            Yearly Breakdown Matrix
          </h2>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-[#ddc1ae]/70">Step Filter:</span>
            <button
              onClick={() => setIntervalFilter('4yr')}
              className={`px-2.5 py-1 rounded border transition-colors ${
                intervalFilter === '4yr'
                  ? 'bg-[#ff8c00] text-[#111316] font-bold border-[#ff8c00]'
                  : 'bg-[#111316] text-[#ddc1ae] border-[#414754] hover:border-[#ffb77d]'
              }`}
            >
              Milestones (4-Yr)
            </button>
            <button
              onClick={() => setIntervalFilter('all')}
              className={`px-2.5 py-1 rounded border transition-colors ${
                intervalFilter === 'all'
                  ? 'bg-[#ff8c00] text-[#111316] font-bold border-[#ff8c00]'
                  : 'bg-[#111316] text-[#ddc1ae] border-[#414754] hover:border-[#ffb77d]'
              }`}
            >
              All Years ({yearlyData.length})
            </button>
          </div>
        </div>

        <div className="border border-[#414754] rounded bg-[#1a1c1f] overflow-x-auto shadow-2xl">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-[#414754] bg-[#241912] font-mono text-xs uppercase tracking-wider text-[#ddc1ae]">
                <th className="p-4">Year</th>
                <th className="p-4">Age</th>
                <th className="p-4">Contributions</th>
                <th className="p-4">Baseline Value</th>
                <th className="p-4 text-[#ff8c00]">Optimized Value</th>
                <th className="p-4 text-right">Delta</th>
              </tr>
            </thead>
            <tbody className="font-mono text-sm text-[#f3dfd1]">
              {displayRows.map((row, idx) => {
                const isFinal = idx === displayRows.length - 1;
                return (
                  <tr
                    key={row.year}
                    className={`border-b border-[#414754]/50 hover:bg-[#37393d]/50 transition-colors ${
                      isFinal ? 'bg-[#ff8c00]/10 font-bold border-t border-[#ff8c00]/40' : ''
                    }`}
                  >
                    <td className="p-4">{row.year}</td>
                    <td className="p-4 text-[#ddc1ae]">{row.age}</td>
                    <td className="p-4">{formatCurrency(row.contributions)}</td>
                    <td className="p-4 text-[#ddc1ae]">{formatCurrency(row.baselineValue)}</td>
                    <td className="p-4 text-[#ff8c00] font-semibold">
                      {formatCurrency(row.optimizedValue)}
                    </td>
                    <td className="p-4 text-right text-[#ff8c00] font-semibold">
                      +{formatCurrency(row.delta)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Community Strategy Discussion (Disqus) */}
      <DisqusComments
        identifier={`model-${simulationResult.id}`}
        title={`WealthBuilder Model: ${name}`}
        categoryName={`Strategy Discussion for ${name} (${simulationResult.parameters.assetClass})`}
      />
    </div>
  );
};
