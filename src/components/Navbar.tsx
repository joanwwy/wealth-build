import React, { useState } from 'react';
import {
  Landmark,
  Bell,
  User,
  Sliders,
  CheckCircle2,
  Cpu,
  Sparkles,
  X,
  Sun,
  Moon,
  DollarSign,
  BookOpen,
  GitCompare,
  Percent,
} from 'lucide-react';
import { TabType, UserSettings } from '../types';

interface NavbarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  userSettings: UserSettings;
  onUpdateSettings: (settings: UserSettings) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  userSettings,
  onUpdateSettings,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const isLight = userSettings.theme === 'light';

  const toggleTheme = () => {
    onUpdateSettings({
      ...userSettings,
      theme: isLight ? 'dark' : 'light',
    });
  };

  const notifications = [
    {
      id: 1,
      title: 'Multi-Strategy Comparison Ready',
      time: 'Live',
      desc: 'Compare Strategy A vs Strategy B with dual stochastic trajectory curves.',
      icon: GitCompare,
    },
    {
      id: 2,
      title: 'CAGR Smoother Calibration',
      time: 'Updated',
      desc: 'S&P 500 drift parameters updated with Q4 real-time market data ticks.',
      icon: Sparkles,
    },
    {
      id: 3,
      title: 'Rust SIMD Zero-Latency Engine',
      time: '0.42ms',
      desc: 'High-speed deterministic compounding running at 60 FPS.',
      icon: Cpu,
    },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 backdrop-blur-xl border-b transition-colors duration-200 ${
          isLight
            ? 'bg-white/90 border-slate-200 text-slate-900 shadow-sm'
            : 'bg-[#111316]/90 border-[#414754] text-[#f3dfd1]'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between h-16">
          {/* Brand Logo & Streamlined Nav */}
          <div className="flex items-center gap-6 sm:gap-8">
            <button
              onClick={() => onTabChange('simulator')}
              className="font-semibold text-xl sm:text-2xl tracking-tight text-[#ff8c00] flex items-center gap-2.5 hover:opacity-90 transition-opacity cursor-pointer text-left"
            >
              <div className="w-8 h-8 rounded bg-[#ff8c00]/10 border border-[#ff8c00]/40 flex items-center justify-center text-[#ff8c00]">
                <Landmark className="w-5 h-5" />
              </div>
              <span className="font-bold tracking-tight">WealthBuilder</span>
            </button>

            {/* Streamlined Tab Navigation */}
            <div className="hidden sm:flex items-center gap-1 h-16">
              <button
                onClick={() => onTabChange('simulator')}
                className={`font-medium text-xs sm:text-sm transition-all px-3 py-2 rounded h-full flex items-center gap-1.5 relative cursor-pointer ${
                  currentTab === 'simulator'
                    ? isLight
                      ? 'text-[#ff8c00] font-bold'
                      : 'text-[#ffb77d] font-bold'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    : 'text-[#ddc1ae]/80 hover:text-[#f3dfd1] hover:bg-[#37393d]/30'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Simulator &amp; Analytics</span>
                {currentTab === 'simulator' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff8c00] shadow-[0_0_8px_#ff8c00]" />
                )}
              </button>

              <button
                onClick={() => onTabChange('comparison')}
                className={`font-medium text-xs sm:text-sm transition-all px-3 py-2 rounded h-full flex items-center gap-1.5 relative cursor-pointer ${
                  currentTab === 'comparison'
                    ? isLight
                      ? 'text-[#ff8c00] font-bold'
                      : 'text-[#ffb77d] font-bold'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    : 'text-[#ddc1ae]/80 hover:text-[#f3dfd1] hover:bg-[#37393d]/30'
                }`}
              >
                <GitCompare className="w-4 h-4" />
                <span>Before vs After</span>
                {currentTab === 'comparison' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff8c00] shadow-[0_0_8px_#ff8c00]" />
                )}
              </button>

              <button
                onClick={() => onTabChange('community')}
                className={`font-medium text-xs sm:text-sm transition-all px-3 py-2 rounded h-full flex items-center gap-1.5 relative cursor-pointer ${
                  currentTab === 'community'
                    ? isLight
                      ? 'text-[#ff8c00] font-bold'
                      : 'text-[#ffb77d] font-bold'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    : 'text-[#ddc1ae]/80 hover:text-[#f3dfd1] hover:bg-[#37393d]/30'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Academy &amp; Community</span>
                {currentTab === 'community' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff8c00] shadow-[0_0_8px_#ff8c00]" />
                )}
              </button>
            </div>
          </div>

          {/* Right Action Tools & Theme Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle (Light / Dark) */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center gap-1 text-xs font-mono ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                  : 'bg-[#1e2023] hover:bg-[#2a2d32] text-[#ffb77d] border-[#414754]'
              }`}
              title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              aria-label="Toggle Theme"
            >
              {isLight ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-[#ff8c00]" />}
              <span className="hidden md:inline">{isLight ? 'Dark' : 'Light'}</span>
            </button>

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowAccountModal(false);
                }}
                className={`p-2 rounded-lg border transition-colors relative cursor-pointer ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                    : 'bg-[#1e2023] hover:bg-[#2a2d32] text-[#ddc1ae] border-[#414754]'
                }`}
                title="System Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ff8c00] animate-pulse" />
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div
                  className={`absolute right-0 mt-3 w-80 md:w-96 rounded-xl border shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-150 ${
                    isLight
                      ? 'bg-white border-slate-200 text-slate-900 shadow-slate-300'
                      : 'bg-[#1e2023] border-[#414754] text-[#f3dfd1]'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#414754]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#ff8c00]"></span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#ff8c00] font-mono">
                        Engine Status
                      </span>
                    </div>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-[#414754]/50 my-2">
                    {notifications.map((n) => {
                      const Icon = n.icon;
                      return (
                        <div
                          key={n.id}
                          className="py-3 px-1 hover:bg-slate-50 dark:hover:bg-[#37393d]/20 rounded transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-1.5 rounded bg-[#ff8c00]/10 text-[#ff8c00] mt-0.5">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <h4 className="text-xs font-semibold">{n.title}</h4>
                                <span className="text-[10px] font-mono text-slate-400">{n.time}</span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-[#ddc1ae]/80 mt-1 leading-relaxed">
                                {n.desc}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* User Settings Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowAccountModal(!showAccountModal);
                  setShowNotifications(false);
                }}
                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                    : 'bg-[#1e2023] hover:bg-[#2a2d32] text-[#ddc1ae] border-[#414754]'
                }`}
                title="Model Settings"
                aria-label="Settings"
              >
                <User className="w-4 h-4" />
              </button>

              {/* Account Dropdown Modal */}
              {showAccountModal && (
                <div
                  className={`absolute right-0 mt-3 w-72 rounded-xl border shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-150 ${
                    isLight
                      ? 'bg-white border-slate-200 text-slate-900 shadow-slate-300'
                      : 'bg-[#1e2023] border-[#414754] text-[#f3dfd1]'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#414754]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#ff8c00]/20 border border-[#ff8c00] flex items-center justify-center text-[11px] font-bold text-[#ff8c00]">
                        WB
                      </div>
                      <div>
                        <div className="text-xs font-semibold">Model Preferences</div>
                        <div className="text-[10px] font-mono text-slate-400">Global Parameters</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAccountModal(false)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4 my-4 text-xs font-mono">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-slate-500 dark:text-[#ddc1ae]/70 mb-1.5 font-semibold">
                        Default Starting Age
                      </label>
                      <input
                        type="number"
                        min="18"
                        max="80"
                        value={userSettings.startingAge}
                        onChange={(e) =>
                          onUpdateSettings({
                            ...userSettings,
                            startingAge: Number(e.target.value) || 30,
                          })
                        }
                        className={`w-full px-3 py-1.5 rounded border focus:outline-none ${
                          isLight
                            ? 'bg-slate-50 border-slate-300 text-slate-900'
                            : 'bg-[#111316] border-[#414754] text-white'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-[#414754]/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-500">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Deterministic
                    </span>
                    <span>v3.0 Ultra</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Tab Bar */}
        <div className="sm:hidden flex items-center justify-around border-t border-slate-200 dark:border-[#414754]/60 py-2 px-3">
          <button
            onClick={() => onTabChange('simulator')}
            className={`text-xs py-1.5 px-3 rounded-lg font-medium flex items-center gap-1.5 ${
              currentTab === 'simulator'
                ? 'bg-[#ff8c00] text-slate-950 font-bold'
                : isLight
                ? 'text-slate-600'
                : 'text-[#ddc1ae]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Simulator &amp; Analytics
          </button>
          <button
            onClick={() => onTabChange('community')}
            className={`text-xs py-1.5 px-3 rounded-lg font-medium flex items-center gap-1.5 ${
              currentTab === 'community'
                ? 'bg-[#ff8c00] text-slate-950 font-bold'
                : isLight
                ? 'text-slate-600'
                : 'text-[#ddc1ae]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Academy &amp; Community
          </button>
        </div>
      </nav>
    </>
  );
};
