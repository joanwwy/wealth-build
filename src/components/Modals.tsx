import React, { useState } from 'react';
import { X, Download, Copy, Check, ShieldAlert, Activity, FileText, CheckCircle2 } from 'lucide-react';
import { SimulationResult } from '../types';
import { formatCurrency } from '../utils/simulationEngine';

// ======================= Export Report Modal =======================
interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  simulationResult: SimulationResult | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, simulationResult }) => {
  const [copied, setCopied] = useState(false);
  const [format, setFormat] = useState<'csv' | 'json' | 'summary'>('csv');

  if (!isOpen || !simulationResult) return null;

  const generateCSV = () => {
    const headers = 'Year,Age,Contributions,BaselineValue,OptimizedValue,Delta\n';
    const rows = simulationResult.yearlyData
      .map(
        (r) =>
          `${r.year},${r.age},${r.contributions},${r.baselineValue},${r.optimizedValue},${r.delta}`
      )
      .join('\n');
    return headers + rows;
  };

  const generateJSON = () => {
    return JSON.stringify(simulationResult, null, 2);
  };

  const generateSummaryText = () => {
    return `WEALTHBUILDER SIMULATION AUDIT REPORT
Model: ${simulationResult.name}
Asset Class: ${simulationResult.parameters.assetClass}
Time Horizon: ${simulationResult.parameters.timeHorizon} Years
Initial Investment: ${formatCurrency(simulationResult.parameters.initialInvestment)}
Monthly Contribution: ${formatCurrency(simulationResult.parameters.monthlyContribution)}
Rebalancing: ${simulationResult.parameters.rebalancingFrequency}

KEY PERFORMANCE INDICATORS:
- Projected Final Value: ${formatCurrency(simulationResult.projectedFinalValue)}
- Baseline Value: ${formatCurrency(simulationResult.baselineFinalValue)}
- Total ROI: ${simulationResult.totalROI}% (Annualized)
- Total Contributions: ${formatCurrency(simulationResult.totalContributions)}
- Expected CAGR: ${simulationResult.expectedCAGR}%
- Max Drawdown: ${simulationResult.maxDrawdown}%
- Sharpe Ratio: ${simulationResult.sharpeRatio}
`;
  };

  const handleDownload = () => {
    let content = '';
    let filename = '';
    let type = '';

    if (format === 'csv') {
      content = generateCSV();
      filename = `${simulationResult.name.replace(/\s+/g, '_')}_matrix.csv`;
      type = 'text/csv';
    } else if (format === 'json') {
      content = generateJSON();
      filename = `${simulationResult.name.replace(/\s+/g, '_')}_model.json`;
      type = 'application/json';
    } else {
      content = generateSummaryText();
      filename = `${simulationResult.name.replace(/\s+/g, '_')}_audit.txt`;
      type = 'text/plain';
    }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    const text =
      format === 'csv'
        ? generateCSV()
        : format === 'json'
        ? generateJSON()
        : generateSummaryText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#1e2023] border border-[#414754] rounded-lg max-w-xl w-full p-6 shadow-2xl relative">
        <div className="flex justify-between items-center pb-4 border-b border-[#414754]">
          <div className="flex items-center gap-2 text-[#ffb77d]">
            <Download className="w-5 h-5 text-[#ff8c00]" />
            <h3 className="font-bold text-lg text-[#f3dfd1]">Export Simulation Report</h3>
          </div>
          <button onClick={onClose} className="text-[#ddc1ae]/60 hover:text-[#f3dfd1]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-5 space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-[#ddc1ae]/80 mb-2">
              Export Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setFormat('csv')}
                className={`py-2 px-3 rounded text-xs font-mono border transition-colors ${
                  format === 'csv'
                    ? 'bg-[#ff8c00] text-[#111316] font-bold border-[#ff8c00]'
                    : 'bg-[#111316] text-[#ddc1ae] border-[#414754]'
                }`}
              >
                CSV Matrix
              </button>
              <button
                onClick={() => setFormat('json')}
                className={`py-2 px-3 rounded text-xs font-mono border transition-colors ${
                  format === 'json'
                    ? 'bg-[#ff8c00] text-[#111316] font-bold border-[#ff8c00]'
                    : 'bg-[#111316] text-[#ddc1ae] border-[#414754]'
                }`}
              >
                JSON Schema
              </button>
              <button
                onClick={() => setFormat('summary')}
                className={`py-2 px-3 rounded text-xs font-mono border transition-colors ${
                  format === 'summary'
                    ? 'bg-[#ff8c00] text-[#111316] font-bold border-[#ff8c00]'
                    : 'bg-[#111316] text-[#ddc1ae] border-[#414754]'
                }`}
              >
                Text Summary
              </button>
            </div>
          </div>

          <div className="bg-[#0d0f12] p-3 rounded border border-[#414754] font-mono text-xs text-[#aec6ff] max-h-48 overflow-y-auto">
            <pre>
              {format === 'csv'
                ? generateCSV()
                : format === 'json'
                ? generateJSON()
                : generateSummaryText()}
            </pre>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-[#414754]">
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded text-xs font-mono border border-[#414754] text-[#ddc1ae] hover:border-[#ff8c00] flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy to Clipboard'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="bg-[#ff8c00] text-[#111316] font-semibold text-xs px-4 py-2 rounded hover:brightness-110 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download File</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ======================= Risk Disclosure Modal =======================
interface RiskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RiskModal: React.FC<RiskModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#1e2023] border border-[#414754] rounded-lg max-w-2xl w-full p-6 shadow-2xl relative">
        <div className="flex justify-between items-center pb-4 border-b border-[#414754]">
          <div className="flex items-center gap-2 text-[#ff4d4d]">
            <ShieldAlert className="w-5 h-5 text-[#ff4d4d]" />
            <h3 className="font-bold text-lg text-[#f3dfd1]">Financial Risk &amp; Modeling Disclosure</h3>
          </div>
          <button onClick={onClose} className="text-[#ddc1ae]/60 hover:text-[#f3dfd1]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-5 text-sm text-[#ddc1ae] space-y-3 max-h-96 overflow-y-auto pr-2 leading-relaxed">
          <p>
            <strong className="text-[#f3dfd1]">Hypothetical and Simulated Performance:</strong> The
            forecasts and projection metrics produced by WealthBuilder are mathematical simulations
            combining deterministic compound interest equations with stochastic Monte Carlo geometric
            Brownian motion.
          </p>
          <p>
            <strong className="text-[#f3dfd1]">No Guarantee of Future Results:</strong> Past performance
            and historical CAGR vectors do not guarantee future returns. Actual returns may vary
            significantly due to macroeconomic shocks, interest rate regimes, inflation spikes, and
            market regime shifts.
          </p>
          <p>
            <strong className="text-[#f3dfd1]">Rebalancing &amp; Tax Drag:</strong> Optimized growth
            estimates assume automated rebalancing within tax-advantaged accounts or tax-loss harvesting
            alpha. Real-world brokerage slippage, commissions, and capital gains taxes may reduce nominal
            yield.
          </p>
        </div>

        <div className="flex justify-end pt-3 border-t border-[#414754]">
          <button
            onClick={onClose}
            className="bg-[#ff8c00] text-[#111316] font-semibold text-xs px-5 py-2 rounded hover:brightness-110"
          >
            Acknowledge &amp; Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

// ======================= API Status Modal =======================
interface ApiStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiStatusModal: React.FC<ApiStatusModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const services = [
    { name: 'Market Data Ingress API', status: 'Operational', latency: '0.18ms', uptime: '99.99%' },
    { name: 'Distributed Kafka Node Cluster (0-7)', status: 'Operational', latency: '0.42ms', uptime: '100.0%' },
    { name: 'Monte Carlo Compute Processing Grid', status: 'Operational', latency: '0.85ms', uptime: '99.98%' },
    { name: 'Rust Core SIMD Compounding Engine', status: 'Operational', latency: '0.04ms', uptime: '100.0%' },
    { name: 'PostgreSQL Schema & Time-Series DB', status: 'Operational', latency: '1.20ms', uptime: '99.99%' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#1e2023] border border-[#414754] rounded-lg max-w-xl w-full p-6 shadow-2xl relative">
        <div className="flex justify-between items-center pb-4 border-b border-[#414754]">
          <div className="flex items-center gap-2 text-[#ffb77d]">
            <Activity className="w-5 h-5 text-[#ff8c00]" />
            <h3 className="font-bold text-lg text-[#f3dfd1]">System Telemetry &amp; API Status</h3>
          </div>
          <button onClick={onClose} className="text-[#ddc1ae]/60 hover:text-[#f3dfd1]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4">
          <div className="flex items-center gap-2 p-3 bg-emerald-950/40 border border-emerald-800/80 rounded mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono text-emerald-300 font-semibold">
              All Simulation Nodes Operating at Peak Frequency (0.42ms Avg Latency)
            </span>
          </div>

          <div className="divide-y divide-[#414754]/60 font-mono text-xs">
            {services.map((svc) => (
              <div key={svc.name} className="py-2.5 flex justify-between items-center">
                <div>
                  <div className="text-[#f3dfd1] font-semibold">{svc.name}</div>
                  <div className="text-[10px] text-[#ddc1ae]/60">Uptime: {svc.uptime}</div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {svc.status}
                  </span>
                  <div className="text-[10px] text-[#aec6ff]">{svc.latency}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-[#414754]">
          <button
            onClick={onClose}
            className="bg-[#111316] border border-[#414754] text-[#ddc1ae] text-xs font-mono px-4 py-2 rounded hover:border-[#ff8c00]"
          >
            Close Telemetry
          </button>
        </div>
      </div>
    </div>
  );
};
