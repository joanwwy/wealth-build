import React, { useState } from 'react';
import { Terminal, TrendingUp, Network, Database, Cpu, Copy, Check, Play, Activity, Layers, Server } from 'lucide-react';
import { calculateCompoundGrowth, formatCurrency } from '../utils/simulationEngine';

export const EducationScreen: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [testPrincipal, setTestPrincipal] = useState(100000);
  const [testRate, setTestRate] = useState(12.4);
  const [testTime, setTestTime] = useState(20);
  const [testContributions, setTestContributions] = useState(2500);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [smoothingFactor, setSmoothingFactor] = useState(70);

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

  // Raw vs smoothed simulation data
  const rawBars = [30, 45, 25, 60, 55, 80, 65, 90, 85, 100];
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

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
    <div className="flex-grow pt-24 pb-16 relative overflow-hidden">
      {/* Abstract Grid Background */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
        {/* Hero Header */}
        <header className="mb-16 border-b border-[#414754] pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1e2023] border border-[#414754] rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-[#ff8c00] animate-pulse" />
            <span className="font-mono text-xs text-[#ffb77d] uppercase tracking-wider">
              System Architecture Documentation
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-[#f3dfd1] leading-tight md:leading-[64px] tracking-tight mb-4">
            Engineered for Precision.
            <br />
            <span className="text-[#ff8c00]">Built on Data.</span>
          </h1>

          <p className="text-base md:text-lg text-[#ddc1ae] max-w-3xl leading-relaxed">
            Dive deep into the mechanics of the WealthBuilder simulation engine. Understand how
            deterministic algorithms, stochastic modeling, and high-frequency data ingestion power your
            portfolio forecasts with surgical accuracy.
          </p>
        </header>

        {/* Grid Layout for Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column: Navigation / TOC (Sticky) */}
          <aside className="hidden md:block md:col-span-3">
            <div className="sticky top-28 bg-[#1e2023] border border-[#414754] p-6 rounded-lg shadow-lg">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#ddc1ae] mb-4 border-b border-[#414754] pb-2 font-mono">
                CONTENTS
              </h3>
              <ul className="space-y-3 font-mono text-sm">
                <li>
                  <a
                    href="#compound-engine"
                    className="text-[#ffb77d] flex items-center gap-2 hover:underline transition-colors"
                  >
                    <Terminal className="w-4 h-4 text-[#ff8c00]" />
                    <span>Compound Interest Engine</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#cagr-smoothing"
                    className="text-[#f3dfd1] hover:text-[#ffb77d] transition-colors flex items-center gap-2"
                  >
                    <TrendingUp className="w-4 h-4 text-[#ff8c00]" />
                    <span>CAGR Smoothing</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#data-arch"
                    className="text-[#f3dfd1] hover:text-[#ffb77d] transition-colors flex items-center gap-2"
                  >
                    <Network className="w-4 h-4 text-[#ff8c00]" />
                    <span>Data Architecture</span>
                  </a>
                </li>
              </ul>

              <div className="mt-8 pt-4 border-t border-[#414754]/60">
                <div className="text-[11px] font-mono text-[#ddc1ae]/70 space-y-1.5">
                  <div className="flex justify-between">
                    <span>Engine Standard:</span>
                    <span className="text-[#ffb77d]">Rust 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Arithmetic:</span>
                    <span className="text-[#aec6ff]">IEEE-754 f64</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compounding:</span>
                    <span className="text-[#f3dfd1]">Daily / Sub-period</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Main Content Sections */}
          <div className="col-span-1 md:col-span-9 space-y-16">
            {/* Section 1: Compound Interest Engine */}
            <section className="scroll-mt-28" id="compound-engine">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-[#ff8c00]/10 border border-[#ff8c00]/40 flex items-center justify-center text-[#ff8c00]">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-semibold text-[#f3dfd1] tracking-tight">
                    Compound Interest Engine
                  </h2>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="hidden sm:flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded bg-[#1e2023] border border-[#414754] text-[#ddc1ae] hover:text-[#ffb77d] hover:border-[#ff8c00] transition-colors cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy Rust Code'}</span>
                </button>
              </div>

              <div className="bg-[#1e2023] border border-[#414754] rounded-lg overflow-hidden mb-6 group hover:border-[#ff8c00]/50 transition-colors duration-300 shadow-xl">
                {/* Terminal Header */}
                <div className="bg-[#33281f] border-b border-[#414754] px-4 py-2.5 flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff4d4d]/70" />
                    <div className="w-3 h-3 rounded-full bg-[#ff8c00]/70" />
                    <div className="w-3 h-3 rounded-full bg-[#aec6ff]/70" />
                  </div>
                  <span className="font-mono text-xs text-[#ddc1ae]">core_calc.rs</span>
                  <div className="text-[11px] font-mono text-[#ffb77d]/80">Zero-allocation SIMD</div>
                </div>

                {/* Terminal Body */}
                <div className="p-6 bg-[#0d0f12] font-mono text-xs md:text-sm text-[#aec6ff] overflow-x-auto scanlines relative leading-relaxed">
                  <pre>
                    <code>
                      <span className="text-[#ff8c00]">fn</span> <span className="text-[#c7e7ff] font-semibold">calculate_compound_growth</span>(
                      {'\n    '}principal: <span className="text-[#ff8c00]">f64</span>,
                      {'\n    '}rate: <span className="text-[#ff8c00]">f64</span>,
                      {'\n    '}time: <span className="text-[#ff8c00]">u32</span>,
                      {'\n    '}contributions: <span className="text-[#ff8c00]">f64</span>
                      {'\n'}) -&gt; <span className="text-[#ff8c00]">f64</span> {'{'}
                      {'\n    '}<span className="text-[#ddc1ae]/60">// A = P(1 + r/n)^(nt) + PMT × {'{[(1 + r/n)^(nt) - 1] / (r/n)}'}</span>
                      {'\n    '}<span className="text-[#ff8c00]">let</span> r_n = rate / <span className="text-[#d8e2ff]">12.0</span>;
                      {'\n    '}<span className="text-[#ff8c00]">let</span> nt = (time * <span className="text-[#d8e2ff]">12</span>) <span className="text-[#ff8c00]">as f64</span>;
                      {'\n    '}
                      {'\n    '}<span className="text-[#ff8c00]">let</span> compound_principal = principal * (<span className="text-[#d8e2ff]">1.0</span> + r_n).<span className="text-[#c7e7ff]">powf</span>(nt);
                      {'\n    '}<span className="text-[#ff8c00]">let</span> future_series = contributions * (((<span className="text-[#d8e2ff]">1.0</span> + r_n).<span className="text-[#c7e7ff]">powf</span>(nt) - <span className="text-[#d8e2ff]">1.0</span>) / r_n);
                      {'\n    '}
                      {'\n    '}compound_principal + future_series
                      {'\n}'}
                    </code>
                  </pre>
                </div>
              </div>

              {/* Interactive Calculation Sandbox Tester */}
              <div className="bg-[#1e2023]/60 border border-[#414754] rounded-lg p-5 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Play className="w-4 h-4 text-[#ff8c00]" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#ffb77d] font-mono">
                    Live Rust Formula Sandbox
                  </h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-[#ddc1ae]/70 mb-1 font-mono">Principal ($)</label>
                    <input
                      type="number"
                      value={testPrincipal}
                      onChange={(e) => setTestPrincipal(Number(e.target.value) || 0)}
                      className="w-full bg-[#111316] border border-[#414754] rounded p-2 text-[#f3dfd1] font-mono focus:border-[#ff8c00] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#ddc1ae]/70 mb-1 font-mono">Rate (%/yr)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={testRate}
                      onChange={(e) => setTestRate(Number(e.target.value) || 0)}
                      className="w-full bg-[#111316] border border-[#414754] rounded p-2 text-[#f3dfd1] font-mono focus:border-[#ff8c00] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#ddc1ae]/70 mb-1 font-mono">Time (Years)</label>
                    <input
                      type="number"
                      value={testTime}
                      onChange={(e) => setTestTime(Number(e.target.value) || 1)}
                      className="w-full bg-[#111316] border border-[#414754] rounded p-2 text-[#f3dfd1] font-mono focus:border-[#ff8c00] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#ddc1ae]/70 mb-1 font-mono">Monthly Contrib ($)</label>
                    <input
                      type="number"
                      value={testContributions}
                      onChange={(e) => setTestContributions(Number(e.target.value) || 0)}
                      className="w-full bg-[#111316] border border-[#414754] rounded p-2 text-[#f3dfd1] font-mono focus:border-[#ff8c00] outline-none"
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#414754]/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <span className="font-mono text-xs text-[#ddc1ae]">
                    Evaluated Value at Year {testTime}:
                  </span>
                  <span className="text-xl font-bold font-mono text-[#ff8c00]">
                    {formatCurrency(calculatedRustOutput)}
                  </span>
                </div>
              </div>

              <p className="text-base text-[#ddc1ae] leading-relaxed">
                At the core of WealthBuilder is a high-performance deterministic calculation engine
                written in Rust. It computes daily compounding intervals for immense precision, factoring
                in irregular contribution schedules and dividend reinvestment plans (DRIP) with zero-latency
                execution.
              </p>
            </section>

            {/* Section 2: CAGR Smoothing */}
            <section className="scroll-mt-28" id="cagr-smoothing">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded bg-[#ff8c00]/10 border border-[#ff8c00]/40 flex items-center justify-center text-[#ff8c00]">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold text-[#f3dfd1] tracking-tight">
                  CAGR Smoothing
                </h2>
              </div>

              <p className="text-base text-[#ddc1ae] mb-6 leading-relaxed">
                Raw historical data is volatile. To provide actionable forecasts, our engine applies a
                proprietary Compound Annual Growth Rate (CAGR) smoothing algorithm. This mitigates outlier
                anomalies while preserving the underlying trend vectors necessary for accurate long-term
                modeling.
              </p>

              {/* Chart Simulation Area */}
              <div className="bg-[#1e2023] border border-[#414754] rounded-lg p-6 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff8c00] to-transparent opacity-50" />
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#ddc1ae] font-mono">
                      VOLATILITY VS SMOOTHED TREND
                    </h4>
                    <div className="text-3xl md:text-4xl lg:text-[44px] font-semibold text-[#ffb77d] mt-2 font-mono flex items-baseline gap-2">
                      12.4%{' '}
                      <span className="text-sm font-normal text-[#ddc1ae] font-mono">
                        Adjusted CAGR
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-[3px] bg-[#564334]" />
                      <span className="font-mono text-xs text-[#ddc1ae]">Raw Data</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-[3px] bg-[#ff8c00]" />
                      <span className="font-mono text-xs text-[#ffb77d] font-semibold">Smoothed</span>
                    </div>
                  </div>
                </div>

                {/* CSS + SVG Chart */}
                <div className="h-56 w-full border-b border-l border-[#414754] relative flex items-end px-3 pb-3 gap-2">
                  {/* Horizontal grid lines */}
                  <div className="absolute w-full border-t border-[#414754]/30 bottom-1/4 left-0" />
                  <div className="absolute w-full border-t border-[#414754]/30 bottom-2/4 left-0" />
                  <div className="absolute w-full border-t border-[#414754]/30 bottom-3/4 left-0" />

                  {/* Data points */}
                  {rawBars.map((heightPercent, index) => (
                    <div
                      key={index}
                      onMouseEnter={() => setHoveredBarIndex(index)}
                      onMouseLeave={() => setHoveredBarIndex(null)}
                      className="flex-1 flex flex-col justify-end h-full relative group cursor-pointer"
                    >
                      {hoveredBarIndex === index && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#111316] border border-[#ff8c00] text-[10px] font-mono px-2 py-0.5 rounded text-[#f3dfd1] z-30 whitespace-nowrap shadow-lg">
                          Period {index + 1}: {heightPercent}% Vol
                        </div>
                      )}
                      <div
                        className="w-full transition-all duration-300 rounded-t-sm"
                        style={{
                          height: `${heightPercent}%`,
                          backgroundColor: hoveredBarIndex === index ? '#ff8c00' : '#3f3229',
                          border: '1px solid #564334',
                          borderBottom: 'none',
                          opacity: hoveredBarIndex === index ? 0.9 : 0.7,
                        }}
                      />
                    </div>
                  ))}

                  {/* SVG Line Overlay for Smoothed Trend */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none px-3 pb-3"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 100"
                  >
                    <path
                      className="drop-shadow-[0_0_8px_rgba(255,140,0,0.6)]"
                      d="M 0,70 Q 20,60 40,50 T 70,25 T 100,10"
                      fill="none"
                      stroke="#ff8c00"
                      strokeWidth="2.5"
                    />
                    <circle cx="0" cy="70" r="2.5" fill="#ff8c00" />
                    <circle cx="40" cy="50" r="2.5" fill="#ff8c00" />
                    <circle cx="70" cy="25" r="2.5" fill="#ff8c00" />
                    <circle cx="100" cy="10" r="3" fill="#ff8c00" className="animate-pulse" />
                  </svg>
                </div>

                <div className="flex justify-between items-center mt-3 text-[11px] font-mono text-[#ddc1ae]/60 px-1">
                  <span>T-10 Quarters</span>
                  <span>T-5</span>
                  <span>T-0 Current Vector</span>
                </div>
              </div>
            </section>

            {/* Section 3: Data Architecture */}
            <section className="scroll-mt-28" id="data-arch">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded bg-[#ff8c00]/10 border border-[#ff8c00]/40 flex items-center justify-center text-[#ff8c00]">
                  <Network className="w-5 h-5" />
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold text-[#f3dfd1] tracking-tight">
                  Data Architecture
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-[#1e2023] border border-[#414754] rounded-lg p-6 hover:shadow-[0_0_15px_rgba(255,140,0,0.15)] hover:border-[#ffb77d]/40 transition-all">
                  <div className="w-12 h-12 rounded bg-[#111316] border border-[#414754] flex items-center justify-center mb-4">
                    <Database className="w-6 h-6 text-[#aec6ff]" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2 text-[#f3dfd1]">Ingestion Layer</h4>
                  <p className="text-sm text-[#ddc1ae] leading-relaxed">
                    High-throughput Kafka streams process real-time market ticks, economic indicators, and
                    user telemetry with sub-millisecond latency.
                  </p>
                </div>

                <div className="bg-[#1e2023] border border-[#414754] rounded-lg p-6 hover:shadow-[0_0_15px_rgba(255,140,0,0.15)] hover:border-[#ff8c00]/40 transition-all">
                  <div className="w-12 h-12 rounded bg-[#111316] border border-[#414754] flex items-center justify-center mb-4">
                    <Cpu className="w-6 h-6 text-[#ff8c00]" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2 text-[#f3dfd1]">Processing Grid</h4>
                  <p className="text-sm text-[#ddc1ae] leading-relaxed">
                    Distributed Monte Carlo simulation nodes calculate thousands of probabilistic
                    portfolio outcomes across distributed compute clusters.
                  </p>
                </div>
              </div>

              {/* Network Diagram with interactive node telemetry inspector */}
              <div className="bg-[#241912] border border-[#414754] rounded-lg p-8 flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden shadow-2xl">
                {/* Hotlinked Technical Architecture Diagram Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center w-full h-full opacity-40 mix-blend-screen rounded-lg"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBVGJJ3qjgQb8o4ADrmHiheoYs7eYT3KT0BWQs_MO3--YvZbaloNkjS0oYFUQokPO954Ja-YcXRE0mEB47jpvOKKKcZcJOLzbDM7Q8jqHweA9pzKtgahb8FlnG7oU0sV4G2YvtMO9Vo917bjtQooyoEqxd2psZQDkRKXp9JSXYeHfkr_9p8a5GpkLr3VgNQBO8fX06K_pm6kevtSgU1TCa-lOeIcIs_ViSP8YxsEe6zEwQluyWeBv1v')`,
                  }}
                  title="Architecture Topology"
                />

                <div className="relative z-10 flex flex-col items-center w-full max-w-xl">
                  {/* Top Node */}
                  <button
                    onClick={() => setActiveNode('Market Data API')}
                    className={`bg-[#111316] border px-4 py-2 rounded font-mono text-xs md:text-sm mb-8 transition-all cursor-pointer ${
                      activeNode === 'Market Data API'
                        ? 'border-[#ff8c00] text-[#ff8c00] shadow-[0_0_15px_rgba(255,140,0,0.5)] scale-105'
                        : 'border-[#ffb77d] text-[#ffb77d] hover:border-[#ff8c00] shadow-[0_0_10px_rgba(255,140,0,0.2)]'
                    }`}
                  >
                    Market Data API
                  </button>

                  {/* Middle Tier Nodes */}
                  <div className="flex w-full justify-between items-center relative mb-4 gap-2">
                    {/* Connecting lines */}
                    <div className="absolute top-1/2 left-[15%] right-[15%] h-px bg-[#414754] -z-10" />
                    <div className="absolute top-1/2 left-[8%] w-[18%] h-px bg-[#ff8c00] -z-10" />
                    <div className="absolute top-1/2 right-[8%] w-[18%] h-px bg-[#ff8c00] -z-10" />

                    <button
                      onClick={() => setActiveNode('Kafka Node')}
                      className={`bg-[#111316] border px-3 md:px-4 py-2 rounded font-mono text-xs text-[#f3dfd1] transition-all cursor-pointer ${
                        activeNode === 'Kafka Node'
                          ? 'border-[#aec6ff] text-[#aec6ff] shadow-[0_0_12px_rgba(174,198,255,0.4)] scale-105'
                          : 'border-[#414754] hover:border-[#aec6ff]'
                      }`}
                    >
                      Kafka Node
                    </button>

                    <button
                      onClick={() => setActiveNode('Simulation Engine')}
                      className={`bg-[#37393d] border px-3 md:px-4 py-2 rounded font-mono text-xs md:text-sm font-bold transition-all cursor-pointer ${
                        activeNode === 'Simulation Engine'
                          ? 'border-[#ff8c00] text-[#ff8c00] shadow-[0_0_20px_rgba(255,140,0,0.6)] scale-110'
                          : 'border-[#ff8c00] text-[#ff8c00] shadow-[0_0_10px_rgba(255,140,0,0.3)] hover:scale-105'
                      }`}
                    >
                      Simulation Engine
                    </button>

                    <button
                      onClick={() => setActiveNode('PostgreSQL')}
                      className={`bg-[#111316] border px-3 md:px-4 py-2 rounded font-mono text-xs text-[#f3dfd1] transition-all cursor-pointer ${
                        activeNode === 'PostgreSQL'
                          ? 'border-[#aec6ff] text-[#aec6ff] shadow-[0_0_12px_rgba(174,198,255,0.4)] scale-105'
                          : 'border-[#414754] hover:border-[#aec6ff]'
                      }`}
                    >
                      PostgreSQL
                    </button>
                  </div>

                  {/* Vertical connector */}
                  <div className="h-8 w-px bg-[#ff8c00] mt-2 mb-2" />

                  {/* Bottom Node */}
                  <button
                    onClick={() => setActiveNode('CLIENT DASHBOARD')}
                    className={`bg-[#111316] border px-6 py-2.5 rounded-lg font-mono text-xs uppercase tracking-widest transition-all cursor-pointer ${
                      activeNode === 'CLIENT DASHBOARD'
                        ? 'border-[#ff8c00] text-[#ff8c00] shadow-[0_0_15px_rgba(255,140,0,0.4)] scale-105'
                        : 'border-[#414754] text-[#ddc1ae] hover:text-[#f3dfd1] hover:border-[#ff8c00]'
                    }`}
                  >
                    CLIENT DASHBOARD
                  </button>
                </div>

                {/* Node Telemetry Inspector Card */}
                {activeNode && nodeTelemetry[activeNode] && (
                  <div className="relative z-20 mt-6 w-full max-w-lg bg-[#111316]/95 border border-[#ff8c00]/60 rounded p-4 text-xs font-mono shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex justify-between items-center border-b border-[#414754] pb-2 mb-2">
                      <div className="flex items-center gap-2 text-[#ff8c00] font-bold">
                        <Activity className="w-3.5 h-3.5" />
                        <span>{activeNode} Telemetry</span>
                      </div>
                      <button
                        onClick={() => setActiveNode(null)}
                        className="text-[#ddc1ae]/60 hover:text-[#f3dfd1] text-xs"
                      >
                        ✕ Close
                      </button>
                    </div>
                    <div className="text-[#f3dfd1] font-semibold mb-1">
                      {nodeTelemetry[activeNode].title}
                    </div>
                    <div className="text-[#ddc1ae]/80 mb-2 leading-relaxed">
                      {nodeTelemetry[activeNode].role}
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#414754]/40 text-[11px]">
                      <div>
                        <span className="text-[#ddc1ae]/60">Latency: </span>
                        <span className="text-emerald-400">{nodeTelemetry[activeNode].latency}</span>
                      </div>
                      <div>
                        <span className="text-[#ddc1ae]/60">Throughput: </span>
                        <span className="text-[#aec6ff]">{nodeTelemetry[activeNode].throughput}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
