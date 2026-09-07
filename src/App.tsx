import React, { useState, useEffect } from 'react';
import { INITIAL_PHASES, calculateStepValuation, BUSINESS_MODELS } from './data/startupData';
import { StartupPhase, StartupStep } from './types';
import { Header } from './components/Header';
import { NavigationTabs, TabId } from './components/NavigationTabs';
import { LifecycleTab } from './components/LifecycleTab';
import { ValuationTab } from './components/ValuationTab';
import { CreativeStudioTab } from './components/CreativeStudioTab';
import { BusinessPlanTab } from './components/BusinessPlanTab';
import { TaxOptimizerTab } from './components/TaxOptimizerTab';
import { GrantsAndMarketTab } from './components/GrantsAndMarketTab';
import { SOPsTab } from './components/SOPsTab';
import { BusinessFrameworkTab } from './components/BusinessFrameworkTab';
import { MasterTemplatesWorkbookTab } from './components/MasterTemplatesWorkbookTab';
import { StartupUpgradesSuite } from './components/StartupUpgradesSuite';
import { QuickNotesPanel } from './components/QuickNotesPanel';

export default function App() {
  const [phases, setPhases] = useState<StartupPhase[]>(() => {
    const saved = localStorage.getItem('astro_lab_fab_phases');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved phases', e);
      }
    }
    return INITIAL_PHASES;
  });

  const [businessName, setBusinessName] = useState<string>(() => {
    return localStorage.getItem('astro_lab_fab_company_name') || 'ASTRO LAB FAB';
  });

  const [activeModelName, setActiveModelName] = useState<string>(() => {
    return localStorage.getItem('astro_lab_fab_model') || BUSINESS_MODELS[0].model_name;
  });

  const [businessContext, setBusinessContext] = useState<string>(() => {
    return (
      localStorage.getItem('astro_lab_fab_context') ||
      'ASTRO LAB FAB - Autonomous Enterprise Business Execution Engine providing AI startup workflows, tax deduction planning, and valuation decision gates.'
    );
  });

  const [activeTab, setActiveTab] = useState<TabId>('grants');
  const [isQuickNotesOpen, setIsQuickNotesOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Save state changes
  useEffect(() => {
    localStorage.setItem('astro_lab_fab_phases', JSON.stringify(phases));
  }, [phases]);

  useEffect(() => {
    localStorage.setItem('astro_lab_fab_company_name', businessName);
  }, [businessName]);

  useEffect(() => {
    localStorage.setItem('astro_lab_fab_model', activeModelName);
  }, [activeModelName]);

  useEffect(() => {
    localStorage.setItem('astro_lab_fab_context', businessContext);
  }, [businessContext]);

  // Compute metrics
  const allSteps = phases.flatMap((p) => p.steps);
  const totalStepsCount = allSteps.length;
  const completedStepsCount = allSteps.filter((s) => s.status === 'completed').length;

  const totalScoreSum = allSteps.reduce(
    (acc, step) => acc + calculateStepValuation(step.driverScores).score,
    0
  );
  const overallScore = totalScoreSum / (totalStepsCount || 1);

  // Step Handler
  const handleUpdateStep = (stepNumber: number, updatedStep: Partial<StartupStep>) => {
    setPhases((prevPhases) =>
      prevPhases.map((phase) => ({
        ...phase,
        steps: phase.steps.map((step) =>
          step.step === stepNumber ? { ...step, ...updatedStep } : step
        ),
      }))
    );
  };

  // Export State
  const handleExportState = () => {
    const safeName = businessName || 'ASTRO LAB FAB';
    const stateData = {
      appName: 'Astro Lab Fab Startup Engine',
      businessName: safeName,
      exportedAt: new Date().toISOString(),
      activeModelName,
      businessContext,
      phases,
    };
    const blob = new Blob([JSON.stringify(stateData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const sanitizedFilename = safeName.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    a.download = `${sanitizedFilename}_startup_state_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import State
  const handleImportState = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.phases && Array.isArray(json.phases)) {
          setPhases(json.phases);
          if (json.businessName) setBusinessName(json.businessName);
          if (json.activeModelName) setActiveModelName(json.activeModelName);
          if (json.businessContext) setBusinessContext(json.businessContext);
          alert('Startup state imported successfully!');
        } else {
          alert('Invalid state file format.');
        }
      } catch (err) {
        alert('Error parsing state JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // Reset State
  const handleResetState = () => {
    if (confirm('Are you sure you want to reset all steps and state back to defaults?')) {
      setPhases(INITIAL_PHASES);
      setBusinessName('ASTRO LAB FAB');
      setActiveModelName(BUSINESS_MODELS[0].model_name);
      localStorage.removeItem('astro_lab_fab_phases');
      localStorage.removeItem('astro_lab_fab_company_name');
      localStorage.removeItem('astro_lab_fab_model');
      localStorage.removeItem('astro_lab_fab_context');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white flex flex-col">
      
      {/* Sticky Main Header */}
      <Header
        appName="ASTRO LAB FAB Engine"
        businessName={businessName}
        setBusinessName={setBusinessName}
        completedStepsCount={completedStepsCount}
        totalStepsCount={totalStepsCount}
        overallScore={overallScore}
        activeModelName={activeModelName}
        onExport={handleExportState}
        onImport={handleImportState}
        onReset={handleResetState}
        onOpenQuickNotes={() => setIsQuickNotesOpen(true)}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Sticky Quick Notes Slide-Out Panel */}
      <QuickNotesPanel
        activeTab={activeTab}
        isOpen={isQuickNotesOpen}
        onToggle={() => setIsQuickNotesOpen(!isQuickNotesOpen)}
      />

      {/* Main Body Layout with Far Left Sidebar Navigation Tree */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 w-full relative">

        {/* Far Left Tree Navigation Sidebar (Combined Command Center) */}
        <NavigationTabs
          businessName={businessName}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMobileOpen={isMobileMenuOpen}
          setIsMobileOpen={setIsMobileMenuOpen}
          completedStepsCount={completedStepsCount}
          totalStepsCount={totalStepsCount}
          overallScore={overallScore}
          activeModelName={activeModelName}
          onExport={handleExportState}
          onImport={handleImportState}
          onReset={handleResetState}
          onOpenQuickNotes={() => setIsQuickNotesOpen(true)}
        />

        {/* Main View Workspace Area */}
        <main className="flex-1 min-w-0 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'upgrades' && <StartupUpgradesSuite />}

          {activeTab === 'lifecycle' && (
            <LifecycleTab
              phases={phases}
              onUpdateStep={handleUpdateStep}
              businessContext={businessContext}
            />
          )}

          {activeTab === 'master_templates' && <MasterTemplatesWorkbookTab />}

          {activeTab === 'valuation' && <ValuationTab phases={phases} />}

          {activeTab === 'creative' && <CreativeStudioTab />}

          {activeTab === 'plan' && (
            <BusinessPlanTab
              activeModelName={activeModelName}
              setActiveModelName={setActiveModelName}
            />
          )}

          {activeTab === 'tax' && <TaxOptimizerTab />}

          {activeTab === 'grants' && <GrantsAndMarketTab />}

          {activeTab === 'sops' && <SOPsTab />}

          {activeTab === 'framework' && (
            <BusinessFrameworkTab
              phases={phases}
              activeModelName={activeModelName}
              businessContext={businessContext}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>
          ASTRO LAB FAB Business Startup Execution Engine &copy; 2026. Powered by Google Gemini AI & Ollama.
        </p>
      </footer>

    </div>
  );
}
