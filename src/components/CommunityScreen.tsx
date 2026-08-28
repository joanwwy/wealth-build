import React, { useState } from 'react';
import {
  MessageSquare,
  Users,
  TrendingUp,
  Sparkles,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { DisqusComments } from './DisqusComments';

interface CommunityScreenProps {
  onSelectTopic?: (topicId: string) => void;
}

export const CommunityScreen: React.FC<CommunityScreenProps> = () => {
  const [activeTopic, setActiveTopic] = useState<'general' | 'strategies' | 'cagr' | 'risk'>('general');

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

  const currentTopicData = topics.find((t) => t.id === activeTopic) || topics[0];

  return (
    <div className="flex-grow max-w-[1440px] mx-auto w-full px-6 md:px-12 pt-24 pb-16 flex flex-col gap-8">
      {/* Header */}
      <header className="border-b border-[#414754] pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1e2023] border border-[#414754] rounded-full mb-3">
            <span className="w-2 h-2 rounded-full bg-[#ff8c00] animate-pulse" />
            <span className="font-mono text-xs text-[#ffb77d] uppercase tracking-wider">
              Disqus Community Network
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-[40px] font-bold text-[#f3dfd1] tracking-tight mb-2">
            Investor Forum &amp; Model Discussions
          </h1>
          <p className="text-sm md:text-base text-[#ddc1ae] max-w-3xl leading-relaxed">
            Collaborate with quantitative analysts, long-term wealth builders, and financial modelers.
            Share your portfolio simulations, debate rebalancing strategies, and propose enhancements.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-[#1e2023] border border-[#414754] px-4 py-2.5 rounded-lg text-xs font-mono text-[#ddc1ae]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Moderated Discussions</span>
          </div>
          <div className="w-px h-4 bg-[#414754]" />
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#ff8c00]" />
            <span>Live Sync</span>
          </div>
        </div>
      </header>

      {/* Topic Category Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topics.map((t) => {
          const isSelected = activeTopic === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTopic(t.id)}
              className={`p-5 rounded-lg border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-[#241912] border-[#ff8c00] shadow-[0_0_15px_rgba(255,140,0,0.2)]'
                  : 'bg-[#1e2023] border-[#414754] hover:border-[#ffb77d]/60'
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border font-semibold ${
                      isSelected
                        ? 'bg-[#ff8c00]/20 text-[#ffb77d] border-[#ff8c00]/40'
                        : 'bg-[#111316] text-[#ddc1ae]/70 border-[#414754]'
                    }`}
                  >
                    {t.badge}
                  </span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-[#ff8c00]" />}
                </div>
                <h3 className="font-bold text-[#f3dfd1] text-base mb-1">{t.name}</h3>
                <p className="text-xs text-[#ddc1ae]/80 leading-relaxed line-clamp-2">{t.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#414754]/40 flex items-center justify-between text-xs font-mono">
                <span className={isSelected ? 'text-[#ff8c00] font-bold' : 'text-[#ddc1ae]/60'}>
                  {isSelected ? 'Active Thread' : 'Switch Topic'}
                </span>
                <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-[#ff8c00]' : 'text-[#ddc1ae]/40'}`} />
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
  );
};
