/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TabType, SimulationResult, SimulationParameters, UserSettings } from './types';
import { SEED_Q4_MODEL, PRESET_MODELS, runSimulation } from './utils/simulationEngine';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { EducationScreen } from './components/EducationScreen';
import { SimulatorScreen } from './components/SimulatorScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { CommunityScreen } from './components/CommunityScreen';
import { ExportModal, RiskModal, ApiStatusModal } from './components/Modals';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [activeModel, setActiveModel] = useState<SimulationResult>(SEED_Q4_MODEL);
  const [savedModels, setSavedModels] = useState<SimulationResult[]>(PRESET_MODELS);
  const [simulatorParams, setSimulatorParams] = useState<SimulationParameters>(SEED_Q4_MODEL.parameters);

  // Modals state
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isRiskOpen, setIsRiskOpen] = useState(false);
  const [isApiStatusOpen, setIsApiStatusOpen] = useState(false);
  const [exportTargetModel, setExportTargetModel] = useState<SimulationResult | null>(SEED_Q4_MODEL);

  // Global user settings
  const [userSettings, setUserSettings] = useState<UserSettings>({
    currency: 'USD',
    startingAge: 35,
    inflationAdjusted: false,
    theme: 'dark',
  });

  // Handler when a simulation completes in the Simulator screen
  const handleSimulationComplete = (newResult: SimulationResult) => {
    setActiveModel(newResult);
    // Add to saved models if unique
    setSavedModels((prev) => {
      const exists = prev.find((m) => m.id === newResult.id);
      if (exists) {
        return prev.map((m) => (m.id === newResult.id ? newResult : m));
      }
      return [newResult, ...prev];
    });
  };

  // Switch to dashboard with a specific model
  const handleViewDashboard = (result: SimulationResult) => {
    setActiveModel(result);
    setCurrentTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Refine parameters from Dashboard -> goes to Simulator
  const handleRefineParameters = () => {
    setSimulatorParams(activeModel.parameters);
    setCurrentTab('simulator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick run button in navbar
  const handleQuickRun = () => {
    setCurrentTab('simulator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Model management in History
  const handleDeleteModel = (id: string) => {
    setSavedModels((prev) => prev.filter((m) => m.id !== id));
    if (activeModel.id === id && savedModels.length > 1) {
      const remaining = savedModels.filter((m) => m.id !== id);
      setActiveModel(remaining[0]);
    }
  };

  const handleDuplicateModel = (model: SimulationResult) => {
    const clone: SimulationResult = {
      ...model,
      id: `clone_${Date.now()}`,
      name: `${model.name} (Copy)`,
      timestamp: new Date().toISOString(),
    };
    setSavedModels((prev) => [clone, ...prev]);
  };

  const handleCreateNewInHistory = () => {
    setSimulatorParams({
      name: `Model Vector ${savedModels.length + 1}`,
      assetClass: 'S&P 500 (100% Equity)',
      initialInvestment: 100000,
      monthlyContribution: 2500,
      timeHorizon: 20,
      rebalancingFrequency: 'Annually',
      startYear: 2024,
      startAge: userSettings.startingAge,
    });
    setCurrentTab('simulator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExportTrigger = (model: SimulationResult) => {
    setExportTargetModel(model);
    setIsExportOpen(true);
  };

  return (
    <div className="bg-[#111316] text-[#f3dfd1] min-h-screen flex flex-col font-sans selection:bg-[#ff8c00]/30 selection:text-[#ffdcc3]">
      {/* Persistent Global Navigation */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onQuickRun={handleQuickRun}
        userSettings={userSettings}
        onUpdateSettings={setUserSettings}
      />

      {/* Main Screen Router */}
      <main className="flex-grow flex flex-col">
        {currentTab === 'dashboard' && (
          <DashboardScreen
            simulationResult={activeModel}
            onRefineParameters={handleRefineParameters}
            onExportReport={handleExportTrigger}
            userSettings={userSettings}
          />
        )}

        {currentTab === 'simulator' && (
          <SimulatorScreen
            onSimulationComplete={handleSimulationComplete}
            onViewDashboard={handleViewDashboard}
            userSettings={userSettings}
            initialParams={simulatorParams}
          />
        )}

        {currentTab === 'education' && <EducationScreen />}

        {currentTab === 'history' && (
          <HistoryScreen
            models={savedModels}
            activeModelId={activeModel.id}
            onSelectModel={handleViewDashboard}
            onEditInSimulator={(model) => {
              setSimulatorParams(model.parameters);
              setCurrentTab('simulator');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onDeleteModel={handleDeleteModel}
            onDuplicateModel={handleDuplicateModel}
            onCreateNew={handleCreateNewInHistory}
            onExportModel={handleExportTrigger}
            userSettings={userSettings}
          />
        )}

        {currentTab === 'community' && <CommunityScreen />}
      </main>

      {/* Persistent Global Footer */}
      <Footer
        onOpenDocModal={() => {
          setCurrentTab('education');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCommunity={() => {
          setCurrentTab('community');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenRiskModal={() => setIsRiskOpen(true)}
        onOpenApiStatusModal={() => setIsApiStatusOpen(true)}
        onOpenLegalModal={(title, type) => setIsRiskOpen(true)}
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
