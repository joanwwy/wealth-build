import React, { useState } from 'react';
import {
  History,
  TrendingUp,
  Sliders,
  ArrowRight,
  Trash2,
  Copy,
  Download,
  Plus,
  Scale,
  Sparkles,
  Check,
} from 'lucide-react';
import { SimulationResult, UserSettings } from '../types';
import { formatCurrency } from '../utils/simulationEngine';

interface HistoryScreenProps {
  models: SimulationResult[];
  activeModelId: string;
  onSelectModel: (model: SimulationResult) => void;
  onEditInSimulator: (model: SimulationResult) => void;
  onDeleteModel: (id: string) => void;
  onDuplicateModel: (model: SimulationResult) => void;
  onCreateNew: () => void;
  onExportModel: (model: SimulationResult) => void;
  userSettings: UserSettings;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  models,
  activeModelId,
  onSelectModel,
  onEditInSimulator,
  onDeleteModel,
  onDuplicateModel,
  onCreateNew,
  onExportModel,
}) => {
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleCompare = (id: string) => {
    if (selectedForComparison.includes(id)) {
      setSelectedForComparison(selectedForComparison.filter((item) => item !== id));
    } else {
      if (selectedForComparison.length >= 3) {
        setSelectedForComparison([...selectedForComparison.slice(1), id]);
      } else {
        setSelectedForComparison([...selectedForComparison, id]);
      }
    }
  };

  const comparedModels = models.filter((m) => selectedForComparison.includes(m.id));

  return (
    <div className="flex-grow max-w-[1440px] mx-auto w-full px-6 md:px-12 pt-24 pb-16 flex flex-col gap-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#414754] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#ff8c00] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider text-[#ffb77d]">
              Model Archives &amp; Variance Engine
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-[40px] font-semibold text-[#f3dfd1] tracking-tight mb-1">
            Simulation History
          </h1>
          <p className="text-sm md:text-base text-[#ddc1ae]">
            Compare stochastic runs, track parameter sensitivity, and manage portfolio forecasts.
          </p>
        </div>

        <button
          onClick={onCreateNew}
          className="bg-[#ff8c00] text-[#111316] font-semibold text-sm px-4 py-2.5 rounded hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(255,140,0,0.25)] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Simulation Run</span>
        </button>
      </header>

      {/* Side-by-side Comparative Analysis (if 2+ models selected) */}
      {comparedModels.length >= 2 && (
        <section className="bg-[#241912] border border-[#ff8c00]/60 rounded-lg p-6 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#414754]">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#ff8c00]" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#f3dfd1] font-mono">
                Comparative Matrix ({comparedModels.length} Models Selected)
              </h3>
            </div>
            <button
              onClick={() => setSelectedForComparison([])}
              className="text-xs text-[#ddc1ae]/70 hover:text-[#f3dfd1] font-mono"
            >
              Clear Comparison
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {comparedModels.map((m) => (
              <div
                key={m.id}
                className="bg-[#1e2023] border border-[#414754] rounded p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-mono text-[#ffb77d] uppercase">{m.parameters.assetClass}</div>
                  <h4 className="text-base font-bold text-[#f3dfd1] mt-1">{m.name}</h4>
                  
                  <div className="my-3 space-y-1.5 font-mono text-xs text-[#ddc1ae]">
                    <div className="flex justify-between">
                      <span className="text-[#ddc1ae]/60">Final Value:</span>
                      <span className="text-[#ff8c00] font-bold">
                        {formatCurrency(m.projectedFinalValue, true)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#ddc1ae]/60">Total ROI:</span>
                      <span className="text-[#f3dfd1]">{m.totalROI}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#ddc1ae]/60">Max Drawdown:</span>
                      <span className="text-[#ff4d4d]">{m.maxDrawdown}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#ddc1ae]/60">Sharpe Ratio:</span>
                      <span className="text-[#aec6ff]">{m.sharpeRatio}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#ddc1ae]/60">Horizon:</span>
                      <span>{m.parameters.timeHorizon} Years</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectModel(m)}
                  className="w-full mt-2 bg-[#ff8c00]/10 hover:bg-[#ff8c00] hover:text-[#111316] text-[#ff8c00] text-xs font-semibold py-1.5 rounded transition-all flex items-center justify-center gap-1 font-mono"
                >
                  <span>Load into Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Model Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => {
          const isActive = model.id === activeModelId;
          const isComparing = selectedForComparison.includes(model.id);

          return (
            <div
              key={model.id}
              className={`bg-[#1e2023] border rounded-lg p-6 flex flex-col justify-between transition-all duration-200 shadow-xl relative overflow-hidden ${
                isActive
                  ? 'border-[#ff8c00] shadow-[0_0_20px_rgba(255,140,0,0.15)] ring-1 ring-[#ff8c00]'
                  : 'border-[#414754] hover:border-[#ffb77d]/60'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 right-0 bg-[#ff8c00] text-[#111316] text-[10px] font-mono font-bold px-3 py-0.5 rounded-bl">
                  ACTIVE
                </div>
              )}

              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono text-[#ffb77d] uppercase tracking-wider">
                    {model.parameters.assetClass}
                  </span>
                  <span className="text-[11px] font-mono text-[#ddc1ae]/60">
                    {new Date(model.timestamp).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#f3dfd1] mb-2">{model.name}</h3>

                <div className="grid grid-cols-2 gap-3 my-4 p-3 bg-[#111316] rounded border border-[#414754]/60 text-xs font-mono">
                  <div>
                    <span className="text-[#ddc1ae]/60 block text-[10px] uppercase">Final Value</span>
                    <span className="text-lg font-bold text-[#ff8c00]">
                      {formatCurrency(model.projectedFinalValue, true)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#ddc1ae]/60 block text-[10px] uppercase">Expected CAGR</span>
                    <span className="text-lg font-bold text-[#f3dfd1]">
                      {model.expectedCAGR}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[#ddc1ae]/60 block text-[10px] uppercase">Contributions</span>
                    <span className="text-xs text-[#ddc1ae]">
                      {formatCurrency(model.totalContributions, true)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#ddc1ae]/60 block text-[10px] uppercase">Horizon</span>
                    <span className="text-xs text-[#ddc1ae]">
                      {model.parameters.timeHorizon} Years
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#414754]/60">
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleCompare(model.id)}
                    className={`text-xs font-mono px-2.5 py-1.5 rounded border transition-colors flex items-center gap-1 ${
                      isComparing
                        ? 'bg-[#aec6ff] text-[#111316] font-bold border-[#aec6ff]'
                        : 'bg-[#111316] text-[#ddc1ae] border-[#414754] hover:border-[#aec6ff]'
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>{isComparing ? 'Comparing' : 'Compare'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditInSimulator(model)}
                      title="Edit in Simulator"
                      className="p-1.5 rounded text-[#ddc1ae] hover:text-[#ffb77d] hover:bg-[#37393d] transition-colors cursor-pointer"
                    >
                      <Sliders className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDuplicateModel(model)}
                      title="Clone Model"
                      className="p-1.5 rounded text-[#ddc1ae] hover:text-[#ffb77d] hover:bg-[#37393d] transition-colors cursor-pointer"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onExportModel(model)}
                      title="Export Data"
                      className="p-1.5 rounded text-[#ddc1ae] hover:text-[#ffb77d] hover:bg-[#37393d] transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    {models.length > 1 && (
                      <button
                        onClick={() => onDeleteModel(model.id)}
                        title="Delete Run"
                        className="p-1.5 rounded text-[#ddc1ae]/60 hover:text-[#ff4d4d] hover:bg-[#37393d] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onSelectModel(model)}
                  className={`w-full py-2 rounded text-xs font-semibold font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#ff8c00] text-[#111316] shadow-[0_0_10px_rgba(255,140,0,0.3)]'
                      : 'bg-[#37393d]/50 hover:bg-[#ff8c00] hover:text-[#111316] text-[#f3dfd1]'
                  }`}
                >
                  <span>{isActive ? 'Currently Active in Dashboard' : 'Open in Dashboard'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};
