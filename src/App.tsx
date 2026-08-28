/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TabType, SimulationResult, UserSettings } from './types';
import { SEED_Q4_MODEL } from './utils/simulationEngine';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { UnifiedEngineScreen } from './components/UnifiedEngineScreen';
import { AcademyCommunityScreen } from './components/AcademyCommunityScreen';
import { ComparisonBeforeAfterScreen } from './components/ComparisonBeforeAfterScreen';
import { ExportModal, RiskModal, ApiStatusModal } from './components/Modals';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('simulator');
  const [exportTargetModel, setExportTargetModel] = useState<SimulationResult | null>(SEED_Q4_MODEL);

  // Modals state
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isRiskOpen, setIsRiskOpen] = useState(false);
  const [isApiStatusOpen, setIsApiStatusOpen] = useState(false);

  // Global user settings (defaults to sleek Light mode with instant toggle to Dark mode)
  const [userSettings, setUserSettings] = useState<UserSettings>({
    startingAge: 30,
    theme: 'light',
  });

  // Sync theme with HTML class list
  useEffect(() => {
    if (userSettings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [userSettings.theme]);

  const handleExportTrigger = (model: SimulationResult) => {
    setExportTargetModel(model);
    setIsExportOpen(true);
  };

  const isLight = userSettings.theme === 'light';

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 selection:bg-[#ff8c00]/30 selection:text-[#ff8c00] ${
        isLight ? 'bg-slate-100 text-slate-900' : 'bg-[#111316] text-[#f3dfd1]'
      }`}
    >
      {/* Persistent Global Navigation */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        userSettings={userSettings}
        onUpdateSettings={setUserSettings}
      />

      {/* Main View Router */}
      <main className="flex-grow flex flex-col">
        {currentTab === 'simulator' && (
          <UnifiedEngineScreen
            userSettings={userSettings}
            onExportReport={handleExportTrigger}
          />
        )}

        {currentTab === 'comparison' && (
          <ComparisonBeforeAfterScreen
            userSettings={userSettings}
            onSwitchToCurrent={() => {
              setCurrentTab('simulator');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'community' && (
          <AcademyCommunityScreen userSettings={userSettings} />
        )}
      </main>

      {/* Persistent Global Footer */}
      <Footer
        userSettings={userSettings}
        onOpenDocModal={() => {
          setCurrentTab('community');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCommunity={() => {
          setCurrentTab('community');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenComparison={() => {
          setCurrentTab('comparison');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenRiskModal={() => setIsRiskOpen(true)}
        onOpenApiStatusModal={() => setIsApiStatusOpen(true)}
        onOpenLegalModal={() => setIsRiskOpen(true)}
      />

      {/* Global Modals */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        simulationResult={exportTargetModel}
      />

      <RiskModal isOpen={isRiskOpen} onClose={() => setIsRiskOpen(false)} />

      <ApiStatusModal isOpen={isApiStatusOpen} onClose={() => setIsApiStatusOpen(false)} />
    </div>
  );
}
