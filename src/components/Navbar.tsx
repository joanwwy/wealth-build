import React, { useState } from 'react';
import { Landmark, Bell, User, Play, CheckCircle2, ShieldAlert, Cpu, Sparkles, X } from 'lucide-react';
import { TabType, UserSettings } from '../types';

interface NavbarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onQuickRun: () => void;
  userSettings: UserSettings;
  onUpdateSettings: (settings: UserSettings) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onQuickRun,
  userSettings,
  onUpdateSettings,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const notifications = [
    {
      id: 1,
      title: 'Monte Carlo Convergence Reached',
      time: '2 mins ago',
      desc: '10,000 portfolio paths converged with 99.4% confidence score.',
      icon: Cpu,
      unread: true,
    },
    {
      id: 2,
      title: 'CAGR Smoother Calibration',
      time: '14 mins ago',
      desc: 'S&P 500 drift parameters updated with Q4 real-time market data ticks.',
      icon: Sparkles,
      unread: true,
    },
    {
      id: 3,
      title: 'Rebalancing Alert',
      time: '1 hour ago',
      desc: 'Model Alpha drifted +2.4% above equity target allocation band.',
      icon: ShieldAlert,
      unread: true,
    },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-[#111316]/80 backdrop-blur-xl border-b border-[#414754]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between h-16">
          {/* Brand Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => onTabChange('dashboard')}
              className="font-semibold text-2xl tracking-tight text-[#ffb77d] flex items-center gap-2.5 hover:opacity-90 transition-opacity cursor-pointer text-left"
            >
              <div className="w-8 h-8 rounded bg-[#ff8c00]/10 border border-[#ff8c00]/40 flex items-center justify-center text-[#ff8c00]">
                <Landmark className="w-5 h-5" />
              </div>
              <span className="font-bold tracking-tight">WealthBuilder</span>
            </button>

            <div className="hidden md:flex items-center gap-1 ml-4 h-16">
              <button
                onClick={() => onTabChange('dashboard')}
                className={`font-medium text-sm transition-all px-3 py-2 rounded h-full flex items-center relative cursor-pointer ${
                  currentTab === 'dashboard'
                    ? 'text-[#ffb77d]'
                    : 'text-[#ddc1ae]/80 hover:text-[#f3dfd1] hover:bg-[#37393d]/30'
                }`}
              >
                Dashboard
                {currentTab === 'dashboard' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ffb77d] shadow-[0_0_8px_#ff8c00]" />
                )}
              </button>

              <button
                onClick={() => onTabChange('simulator')}
                className={`font-medium text-sm transition-all px-3 py-2 rounded h-full flex items-center relative cursor-pointer ${
                  currentTab === 'simulator'
                    ? 'text-[#ffb77d]'
                    : 'text-[#ddc1ae]/80 hover:text-[#f3dfd1] hover:bg-[#37393d]/30'
                }`}
              >
                Simulator
                {currentTab === 'simulator' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ffb77d] shadow-[0_0_8px_#ff8c00]" />
                )}
              </button>

              <button
                onClick={() => onTabChange('education')}
                className={`font-medium text-sm transition-all px-3 py-2 rounded h-full flex items-center relative cursor-pointer ${
                  currentTab === 'education'
                    ? 'text-[#ffb77d]'
                    : 'text-[#ddc1ae]/80 hover:text-[#f3dfd1] hover:bg-[#37393d]/30'
                }`}
              >
                Education
                {currentTab === 'education' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ffb77d] shadow-[0_0_8px_#ff8c00]" />
                )}
              </button>

              <button
                onClick={() => onTabChange('history')}
                className={`font-medium text-sm transition-all px-3 py-2 rounded h-full flex items-center relative cursor-pointer ${
                  currentTab === 'history'
                    ? 'text-[#ffb77d]'
                    : 'text-[#ddc1ae]/80 hover:text-[#f3dfd1] hover:bg-[#37393d]/30'
                }`}
              >
                History
                {currentTab === 'history' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ffb77d] shadow-[0_0_8px_#ff8c00]" />
                )}
              </button>
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-3">
            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowAccountModal(false);
                  setUnreadCount(0);
                }}
                className="p-2 text-[#ddc1ae]/80 hover:text-[#f3dfd1] hover:bg-[#37393d]/40 transition-colors rounded-full relative cursor-pointer"
                title="System Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ff8c00] animate-pulse" />
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 md:w-96 bg-[#1e2023] border border-[#414754] rounded-lg shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-[#414754]/80">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#ff8c00]"></span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#ffb77d] font-mono">
                        Engine Telemetry
                      </span>
                    </div>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-[#ddc1ae]/60 hover:text-[#f3dfd1] p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="divide-y divide-[#414754]/50 my-2">
                    {notifications.map((n) => {
                      const Icon = n.icon;
                      return (
                        <div key={n.id} className="py-3 px-1 hover:bg-[#37393d]/20 rounded transition-colors">
                          <div className="flex items-start gap-3">
                            <div className="p-1.5 rounded bg-[#111316] border border-[#414754] text-[#ff8c00] mt-0.5">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <h4 className="text-xs font-semibold text-[#f3dfd1]">{n.title}</h4>
                                <span className="text-[10px] font-mono text-[#ddc1ae]/60">{n.time}</span>
                              </div>
                              <p className="text-xs text-[#ddc1ae]/80 mt-1 leading-relaxed">{n.desc}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-[#414754]/60 text-center">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        onTabChange('education');
                      }}
                      className="text-xs text-[#ffb77d] hover:underline font-mono"
                    >
                      View Live Kafka & Node Status →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Settings Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowAccountModal(!showAccountModal);
                  setShowNotifications(false);
                }}
                className="p-2 text-[#ddc1ae]/80 hover:text-[#f3dfd1] hover:bg-[#37393d]/40 transition-colors rounded-full cursor-pointer"
                title="Account Settings"
                aria-label="User Profile"
              >
                <User className="w-5 h-5" />
              </button>

              {/* Account Dropdown Modal */}
              {showAccountModal && (
                <div className="absolute right-0 mt-3 w-72 bg-[#1e2023] border border-[#414754] rounded-lg shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-[#414754]/80">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#ff8c00]/20 border border-[#ff8c00] flex items-center justify-center text-[11px] font-bold text-[#ff8c00]">
                        WB
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#f3dfd1]">Financial Terminal</div>
                        <div className="text-[10px] font-mono text-[#ddc1ae]/60">Tier 1 Analytics Node</div>
                      </div>
                    </div>
                    <button onClick={() => setShowAccountModal(false)} className="text-[#ddc1ae]/60 hover:text-[#f3dfd1]">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4 my-4 text-xs">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#ddc1ae]/70 mb-1.5 font-mono">
                        Reporting Currency
                      </label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {(['USD', 'EUR', 'GBP', 'JPY'] as const).map((curr) => (
                          <button
                            key={curr}
                            onClick={() => onUpdateSettings({ ...userSettings, currency: curr })}
                            className={`py-1.5 text-center font-mono rounded border text-xs transition-colors ${
                              userSettings.currency === curr
                                ? 'bg-[#ff8c00] text-[#111316] font-bold border-[#ff8c00]'
                                : 'bg-[#111316] text-[#ddc1ae] border-[#414754] hover:border-[#ffb77d]'
                            }`}
                          >
                            {curr === 'USD' ? '$' : curr === 'EUR' ? '€' : curr === 'GBP' ? '£' : '¥'} {curr}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#ddc1ae]/70 mb-1.5 font-mono">
                        Base Starting Age
                      </label>
                      <input
                        type="number"
                        min="18"
                        max="80"
                        value={userSettings.startingAge}
                        onChange={(e) =>
                          onUpdateSettings({ ...userSettings, startingAge: Number(e.target.value) || 35 })
                        }
                        className="w-full bg-[#111316] border border-[#414754] rounded px-3 py-1.5 text-[#f3dfd1] font-mono focus:border-[#ff8c00] outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-[#ddc1ae]">Inflation-Adjusted (Real $)</span>
                      <input
                        type="checkbox"
                        checked={userSettings.inflationAdjusted}
                        onChange={(e) =>
                          onUpdateSettings({ ...userSettings, inflationAdjusted: e.target.checked })
                        }
                        className="rounded border-[#414754] text-[#ff8c00] focus:ring-[#ff8c00] h-4 w-4 bg-[#111316]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#414754]/60 flex items-center justify-between text-[11px] font-mono text-[#ddc1ae]/70">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#ff8c00]" /> Latency: 0.42ms
                    </span>
                    <span className="text-[#ffb77d]">v2.4.0 Engine</span>
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            <button
              onClick={onQuickRun}
              className="bg-[#ff8c00] text-[#111316] font-semibold text-xs md:text-sm px-4 py-2 rounded hover:brightness-110 active:scale-95 transition-all duration-150 flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,140,0,0.25)] cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Simulation</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub Navigation Bar */}
        <div className="md:hidden flex items-center justify-around border-t border-[#414754]/60 bg-[#111316] py-2 px-2">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`text-xs py-1 px-2.5 rounded font-medium ${
              currentTab === 'dashboard' ? 'text-[#ffb77d] bg-[#ff8c00]/10 font-bold' : 'text-[#ddc1ae]'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onTabChange('simulator')}
            className={`text-xs py-1 px-2.5 rounded font-medium ${
              currentTab === 'simulator' ? 'text-[#ffb77d] bg-[#ff8c00]/10 font-bold' : 'text-[#ddc1ae]'
            }`}
          >
            Simulator
          </button>
          <button
            onClick={() => onTabChange('education')}
            className={`text-xs py-1 px-2.5 rounded font-medium ${
              currentTab === 'education' ? 'text-[#ffb77d] bg-[#ff8c00]/10 font-bold' : 'text-[#ddc1ae]'
            }`}
          >
            Education
          </button>
          <button
            onClick={() => onTabChange('history')}
            className={`text-xs py-1 px-2.5 rounded font-medium ${
              currentTab === 'history' ? 'text-[#ffb77d] bg-[#ff8c00]/10 font-bold' : 'text-[#ddc1ae]'
            }`}
          >
            History
          </button>
        </div>
      </nav>
    </>
  );
};
