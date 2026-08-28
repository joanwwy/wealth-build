import React, { useState } from 'react';
import {
  Terminal,
  TrendingUp,
  Network,
  Database,
  Cpu,
  Copy,
  Check,
  Play,
  Activity,
  MessageSquare,
  BookOpen,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Layers,
  HelpCircle,
  Calculator,
} from 'lucide-react';
import { calculateCompoundGrowth, formatCurrency } from '../utils/simulationEngine';
import { DisqusComments } from './DisqusComments';
import { UserSettings } from '../types';

interface AcademyCommunityScreenProps {
  userSettings: UserSettings;
}

export const AcademyCommunityScreen: React.FC<AcademyCommunityScreenProps> = ({ userSettings }) => {
  const isLight = userSettings.theme === 'light';

  const [activeSubTab, setActiveSubTab] = useState<'education' | 'community'>('education');
  const [activeCommunityTopic, setActiveCommunityTopic] = useState<'general' | 'strategies' | 'cagr' | 'risk'>('general');

  // Rust Sandbox State
  const [copiedCode, setCopiedCode] = useState(false);
  const [testPrincipal, setTestPrincipal] = useState(50000);
  const [testRate, setTestRate] = useState(10.5);
  const [testTime, setTestTime] = useState(20);
  const [testContributions, setTestContributions] = useState(1500);
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const rustCode = `fn calculate_compound_growth(
    principal: f64,
    rate: f64,
    time: u32,
    contributions: f64
) -> f64 {
    // A = P(1 + r/n)^(nt) + PMT × {[(1 + r/n)^(nt) - 1] / (r/n)}
    let r_n = rate / 12.0;
    let nt = (time * 12) as f64;
    
    let compound_principal = principal * (1.0 + r_n).powf(nt);
    let future_series = contributions * (((1.0 + r_n).powf(nt) - 1.0) / r_n);
    
    compound_principal + future_series
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(rustCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const calculatedRustOutput = calculateCompoundGrowth(
    testPrincipal,
    testRate / 100,
    testTime,
    testContributions
  );

  const topics = [
    {
      id: 'general' as const,
      name: 'General Wealth Building',
      identifier: 'wealth-builder-general-community',
      title: 'WealthBuilder - General Financial & Portfolio Discussions',
      desc: 'Connect with other investors, share asset allocation milestones, and discuss financial planning principles.',
      badge: 'Open Forum',
    },
    {
      id: 'strategies' as const,
      name: 'Portfolio Strategies & Factor Tilts',
      identifier: 'wealth-builder-strategies',
      title: 'WealthBuilder - Portfolio Strategies & Factor Allocations',
      desc: 'Discuss 60/40, All-Weather, Tech-Heavy tilts, and factor investing backtesting results.',
      badge: 'Alpha Tactics',
    },
    {
      id: 'cagr' as const,
      name: 'CAGR & Monte Carlo Modeling',
      identifier: 'wealth-builder-modeling',
      title: 'WealthBuilder - Monte Carlo & Stochastic Volatility Modeling',
      desc: 'Discussions around Brownian motion variance, geometric drift parameters, and historical sequence risk.',
      badge: 'Quantitative',
    },
    {
      id: 'risk' as const,
      name: 'Drawdown & Rebalancing Rules',
      identifier: 'wealth-builder-risk-management',
      title: 'WealthBuilder - Risk Mitigation & Rebalancing Bands',
      desc: 'Strategies for quarterly vs annual rebalancing bands, tax drag optimization, and tail risk hedging.',
      badge: 'Risk Control',
    },
  ];

  const currentTopicData = topics.find((t) => t.id === activeCommunityTopic) || topics[0];

  const nodeTelemetry: Record<string, { title: string; latency: string; throughput: string; role: string }> = {
    'Market Data API': {
      title: 'Ultra-Low Latency Market Ingress API',
      latency: '0.18ms',
      throughput: '120k ticks/sec',
      role: 'Direct connection to NYSE, NASDAQ, and CBOE OPRA option chains.',
    },
    'Kafka Node': {
      title: 'Distributed Kafka Event Stream (Partition 0-7)',
      latency: '0.42ms',
      throughput: '2.4 GB/s streaming',
      role: 'High-throughput event queue buffering multi-asset volatility ticks.',
    },
    'Simulation Engine': {
      title: 'Rust Core Monte Carlo Vector Engine',
      latency: '0.85ms',
      throughput: '10,000 portfolio paths / sec',
      role: 'SIMD-accelerated math processing deterministic compounding & stochastic geometric Brownian motion.',
    },
    PostgreSQL: {
      title: 'Persistent Financial Schema Matrix',
      latency: '1.2ms read / 2.1ms write',
      throughput: '8,500 ACID tx/s',
      role: 'Historical price action records, portfolio seeds, and time-series aggregates.',
    },
    'CLIENT DASHBOARD': {
      title: 'Client WebGL / Canvas Rendering Grid',
      latency: '60 FPS synchronized',
      throughput: 'Instant interactive updates',
      role: 'Hardware-accelerated charting, confidence envelopes, and scenario modeling.',
    },
  };

  return (
    <div className={`flex-grow w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-20 pb-16 flex flex-col gap-8 transition-colors duration-200`}>
      
      {/* Header with Navigation Switcher */}
      <header className={`rounded-xl border p-6 lg:p-8 shadow-xl relative overflow-hidden transition-all ${
        isLight
          ? 'bg-gradient-to-br from-white via-slate-50 to-indigo-50/40 border-slate-200 text-slate-900 shadow-slate-200/50'
          : 'bg-gradient-to-br from-[#1e2023] via-[#1a1c1f] to-[#151c28] border-[#414754] text-[#f3dfd1] shadow-black/40'
      }`}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-semibold rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                <BookOpen className="w-3.5 h-3.5" />
                Knowledge &amp; Community Hub
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2">
              Financial Engineering &amp; Investor Forum
            </h1>
            <p className={`text-sm sm:text-base max-w-3xl leading-relaxed ${isLight ? 'text-slate-600' : 'text-[#ddc1ae]'}`}>
              Understand the quantitative formulas and Rust SIMD calculation vectors powering our wealth models,
              and connect with fellow investors on asset allocation, factor tilts, and drawdown mitigation.
            </p>
          </div>

          {/* Sub-tab Switcher (Education vs Community) */}
          <div className={`p-1 rounded-lg border flex items-center gap-1 ${
            isLight ? 'bg-slate-100 border-slate-300' : 'bg-[#111316] border-[#414754]'
          }`}>
            <button
              onClick={() => setActiveSubTab('education')}
              className={`px-4 py-2 rounded-md text-xs font-mono font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeSubTab === 'education'
                  ? isLight
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'bg-[#ff8c00] text-slate-950 shadow-md font-bold'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-[#ddc1ae] hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Quantitative Math
            </button>

            <button
              onClick={() => setActiveSubTab('community')}
              className={`px-4 py-2 rounded-md text-xs font-mono font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeSubTab === 'community'
                  ? isLight
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'bg-[#ff8c00] text-slate-950 shadow-md font-bold'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-[#ddc1ae] hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Disqus Forum
            </button>
          </div>
        </div>
      </header>

      {/* Sub-tab 1: Quantitative Education & Architecture */}
      {activeSubTab === 'education' && (
        <div className="space-y-8">
          
          {/* Section 1: The Core Compounding Formula */}
          <section className={`rounded-xl border p-6 shadow-lg transition-all ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#1e2023] border-[#414754] text-[#f3dfd1]'
          }`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-[#414754]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#ff8c00]/10 border border-[#ff8c00]/30 flex items-center justify-center text-[#ff8c00]">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Compound Interest Formula &amp; Rust Engine</h2>
                  <p className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-[#ddc1ae]/70'}`}>
                    Continuous vs monthly discrete compounding arithmetic
                  </p>
                </div>
              </div>

              <button
                onClick={handleCopyCode}
                className={`text-xs font-mono px-3 py-1.5 rounded border flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                    : 'bg-[#111316] hover:bg-[#2a2d32] text-[#ddc1ae] border-[#414754]'
                }`}
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy Rust Code'}</span>
              </button>
            </div>

            {/* Code Block */}
            <div className="bg-[#0f1115] text-[#aec6ff] rounded-lg p-5 font-mono text-xs overflow-x-auto border border-[#414754] mb-6">
              <pre>
                <code>
                  <span className="text-[#ff8c00]">fn</span> <span className="text-[#c7e7ff] font-semibold">calculate_compound_growth</span>(
                  {'\n  '}principal: <span className="text-[#ff8c00]">f64</span>,
                  {'\n  '}rate: <span className="text-[#ff8c00]">f64</span>,
                  {'\n  '}time: <span className="text-[#ff8c00]">u32</span>,
                  {'\n  '}contributions: <span className="text-[#ff8c00]">f64</span>
                  {'\n'}) -&gt; <span className="text-[#ff8c00]">f64</span> {'{'}
                  {'\n  '}<span className="text-[#ddc1ae]/60">// A = P(1 + r/n)^(nt) + PMT * [((1 + r/n)^(nt) - 1) / (r/n)]</span>
                  {'\n  '}<span className="text-[#ff8c00]">let</span> r_n = rate / <span className="text-[#d8e2ff]">12.0</span>;
                  {'\n  '}<span className="text-[#ff8c00]">let</span> nt = (time * <span className="text-[#d8e2ff]">12</span>) <span className="text-[#ff8c00]">as f64</span>;
                  {'\n  '}
                  {'\n  '}<span className="text-[#ff8c00]">let</span> compound_principal = principal * (<span className="text-[#d8e2ff]">1.0</span> + r_n).<span className="text-[#c7e7ff]">powf</span>(nt);
                  {'\n  '}<span className="text-[#ff8c00]">let</span> future_series = contributions * (((<span className="text-[#d8e2ff]">1.0</span> + r_n).<span className="text-[#c7e7ff]">powf</span>(nt) - <span className="text-[#d8e2ff]">1.0</span>) / r_n);
                  {'\n  '}
                  {'\n  '}compound_principal + future_series
                  {'\n}'}
                </code>
              </pre>
            </div>

            {/* Interactive Formula Sandbox */}
            <div className={`p-5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#150c06]/40 border-[#414754]'}`}>
              <div className="flex items-center gap-2 mb-3">
                <Play className="w-4 h-4 text-[#ff8c00]" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#ff8c00] font-mono">
                  Interactive Formula Sandbox
                </h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono mb-4">
                <div>
                  <label className="block text-slate-500 dark:text-[#ddc1ae]/70 mb-1">Principal ($)</label>
                  <input
                    type="number"
                    value={testPrincipal}
                    onChange={(e) => setTestPrincipal(Number(e.target.value) || 0)}
                    className={`w-full px-2.5 py-1.5 rounded border focus:outline-none ${
                      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#111316] border-[#414754] text-white'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-[#ddc1ae]/70 mb-1">Rate (%/yr)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={testRate}
                    onChange={(e) => setTestRate(Number(e.target.value) || 0)}
                    className={`w-full px-2.5 py-1.5 rounded border focus:outline-none ${
                      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#111316] border-[#414754] text-white'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-[#ddc1ae]/70 mb-1">Time (Years)</label>
                  <input
                    type="number"
                    value={testTime}
                    onChange={(e) => setTestTime(Number(e.target.value) || 1)}
                    className={`w-full px-2.5 py-1.5 rounded border focus:outline-none ${
                      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#111316] border-[#414754] text-white'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-[#ddc1ae]/70 mb-1">Monthly Deposit ($)</label>
                  <input
                    type="number"
                    value={testContributions}
                    onChange={(e) => setTestContributions(Number(e.target.value) || 0)}
                    className={`w-full px-2.5 py-1.5 rounded border focus:outline-none ${
                      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#111316] border-[#414754] text-white'
                    }`}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 border-t border-slate-200 dark:border-[#414754]/60 gap-2">
                <span className="text-xs font-mono text-slate-500 dark:text-[#ddc1ae]">
                  Formula Output (Year {testTime}):
                </span>
                <span className="text-xl font-bold font-mono text-[#ff8c00]">
                  {formatCurrency(calculatedRustOutput, false)}
                </span>
              </div>
            </div>
          </section>

          {/* Section 2: Data Architecture & System Topology */}
          <section className={`rounded-xl border p-6 shadow-lg transition-all ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#1e2023] border-[#414754] text-[#f3dfd1]'
          }`}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-[#414754]">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-500">
                <Network className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">System Topology &amp; Ingestion Latency</h2>
                <p className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-[#ddc1ae]/70'}`}>
                  Click any node to inspect latency, throughput, and operational role
                </p>
              </div>
            </div>

            {/* Architecture Nodes Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
              {Object.keys(nodeTelemetry).map((nodeKey) => {
                const isSelected = activeNode === nodeKey;
                return (
                  <button
                    key={nodeKey}
                    onClick={() => setActiveNode(isSelected ? null : nodeKey)}
                    className={`p-3 rounded-lg border text-left font-mono transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#ff8c00] text-slate-950 border-[#ff8c00] font-bold shadow-md'
                        : isLight
                        ? 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                        : 'bg-[#111316] hover:bg-[#2a2d32] text-[#ddc1ae] border-[#414754]'
                    }`}
                  >
                    <div className="text-xs font-bold truncate">{nodeKey}</div>
                    <div className={`text-[10px] mt-1 ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                      {nodeTelemetry[nodeKey].latency}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Node Inspector Drawer */}
            {activeNode && nodeTelemetry[activeNode] && (
              <div className={`p-4 rounded-lg border text-xs font-mono animate-in fade-in duration-200 ${
                isLight ? 'bg-indigo-50/70 border-indigo-200 text-slate-900' : 'bg-[#171f2c] border-indigo-500/40 text-white'
              }`}>
                <div className="flex justify-between items-center mb-2 font-bold text-sm text-[#ff8c00]">
                  <span>{nodeTelemetry[activeNode].title}</span>
                  <button onClick={() => setActiveNode(null)} className="text-slate-400 hover:text-slate-200">
                    ✕
                  </button>
                </div>
                <p className="mb-3 leading-relaxed text-slate-600 dark:text-[#ddc1ae]/90">
                  {nodeTelemetry[activeNode].role}
                </p>
                <div className="flex gap-6 text-[11px] pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-slate-400">Latency: </span>
                    <span className="text-emerald-500 font-semibold">{nodeTelemetry[activeNode].latency}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Throughput: </span>
                    <span className="text-indigo-400 font-semibold">{nodeTelemetry[activeNode].throughput}</span>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Educational Disqus Thread */}
          <DisqusComments
            identifier="wealth-builder-engineering-docs"
            title="WealthBuilder System Architecture & Mathematics"
            categoryName="Architecture, Rust SIMD Engine & Methodology Q&A"
          />
        </div>
      )}

      {/* Sub-tab 2: Disqus Community Forums */}
      {activeSubTab === 'community' && (
        <div className="space-y-8">
          {/* Topic Switcher Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topics.map((t) => {
              const isSelected = activeCommunityTopic === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveCommunityTopic(t.id)}
                  className={`p-5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-[#ff8c00]/10 border-[#ff8c00] shadow-md'
                      : isLight
                      ? 'bg-white border-slate-200 hover:border-slate-400 text-slate-900'
                      : 'bg-[#1e2023] border-[#414754] hover:border-[#ffb77d]/60 text-[#f3dfd1]'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border font-semibold ${
                          isSelected
                            ? 'bg-[#ff8c00] text-slate-950 border-[#ff8c00]'
                            : isLight
                            ? 'bg-slate-100 text-slate-600 border-slate-200'
                            : 'bg-[#111316] text-[#ddc1ae]/70 border-[#414754]'
                        }`}
                      >
                        {t.badge}
                      </span>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-[#ff8c00]" />}
                    </div>
                    <h3 className="font-bold text-base mb-1">{t.name}</h3>
                    <p className={`text-xs leading-relaxed line-clamp-2 ${isLight ? 'text-slate-500' : 'text-[#ddc1ae]/80'}`}>
                      {t.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#414754]/40 flex items-center justify-between text-xs font-mono">
                    <span className={isSelected ? 'text-[#ff8c00] font-bold' : isLight ? 'text-slate-400' : 'text-[#ddc1ae]/60'}>
                      {isSelected ? 'Active Thread' : 'Switch Topic'}
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-[#ff8c00]' : 'text-slate-400'}`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Embedded Disqus Component */}
          <DisqusComments
            identifier={currentTopicData.identifier}
            title={currentTopicData.title}
            categoryName={currentTopicData.name}
          />
        </div>
      )}
    </div>
  );
};
