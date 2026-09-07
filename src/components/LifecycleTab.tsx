import React, { useState, useMemo } from 'react';
import {
  StartupPhase,
  StartupStep,
  StepStatus,
  ValuationDriver,
  DriverScores,
} from '../types';
import { calculateStepValuation } from '../data/startupData';
import { createDefaultSubstep } from '../data/businessFrameworkData';
import { PhaseProgressTracker } from './PhaseProgressTracker';
import { ProjectedTimeline } from './ProjectedTimeline';
import { PhaseMilestonesTracker } from './PhaseMilestonesTracker';
import { LifecycleMiniMap } from './LifecycleMiniMap';
import {
  Search,
  SlidersHorizontal,
  Bot,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Calendar,
  Layers,
  LayoutGrid,
  CheckSquare,
  Square,
  ListChecks,
  Download,
  Trash2,
  Play,
  Zap,
  Filter,
  Check,
  Award,
  Flag,
  GitFork,
} from 'lucide-react';

interface LifecycleTabProps {
  phases: StartupPhase[];
  onUpdateStep: (stepNumber: number, updatedStep: Partial<StartupStep>) => void;
  businessContext: string;
}

export const LifecycleTab: React.FC<LifecycleTabProps> = ({
  phases,
  onUpdateStep,
  businessContext,
}) => {
  // Multi-Phase selection: empty array or 'all' means all phases selected
  const [selectedPhaseIds, setSelectedPhaseIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  // Multi-Status selection: empty array means all statuses
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  // Multi-Step selection for batch operations
  const [selectedStepNumbers, setSelectedStepNumbers] = useState<number[]>([]);

  const [activeStep, setActiveStep] = useState<StartupStep | null>(null);
  const [modalTab, setModalTab] = useState<'plan' | 'substeps'>('plan');
  const [activeSubstepIndex, setActiveSubstepIndex] = useState<number>(1);
  const [lifecycleView, setLifecycleView] = useState<'combined' | 'minimap' | 'milestones' | 'timeline' | 'steps'>('combined');

  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [batchAiLoading, setBatchAiLoading] = useState<boolean>(false);

  // Flatten all steps
  const allSteps = useMemo(() => phases.flatMap((p) => p.steps), [phases]);

  // Filter steps according to active multi-select filters
  const filteredSteps = useMemo(() => {
    return allSteps.filter((step) => {
      const matchesPhase =
        selectedPhaseIds.length === 0 ||
        selectedPhaseIds.includes('all') ||
        selectedPhaseIds.includes(step.phase_id);

      const matchesStatus =
        selectedStatuses.length === 0 ||
        selectedStatuses.includes('all') ||
        selectedStatuses.includes(step.status);

      const matchesQuery =
        !searchQuery ||
        step.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        step.step.toString().includes(searchQuery);

      return matchesPhase && matchesStatus && matchesQuery;
    });
  }, [allSteps, selectedPhaseIds, selectedStatuses, searchQuery]);

  // Phase Multi-Select helpers
  const togglePhaseId = (phaseId: string) => {
    if (phaseId === 'all') {
      setSelectedPhaseIds([]);
      return;
    }
    setSelectedPhaseIds((prev) => {
      const isCurrentlySelected = prev.includes(phaseId);
      if (isCurrentlySelected) {
        return prev.filter((id) => id !== phaseId && id !== 'all');
      } else {
        return [...prev.filter((id) => id !== 'all'), phaseId];
      }
    });
  };

  const selectAllPhases = () => {
    setSelectedPhaseIds(phases.map((p) => p.phase_id));
  };

  const clearPhaseSelection = () => {
    setSelectedPhaseIds([]);
  };

  // Status Multi-Select helpers
  const toggleStatus = (st: string) => {
    if (st === 'all') {
      setSelectedStatuses([]);
      return;
    }
    setSelectedStatuses((prev) => {
      const isSelected = prev.includes(st);
      if (isSelected) {
        return prev.filter((s) => s !== st && s !== 'all');
      } else {
        return [...prev.filter((s) => s !== 'all'), st];
      }
    });
  };

  // Step Multi-Select Checkbox helpers
  const toggleStepSelection = (stepNumber: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedStepNumbers((prev) => {
      if (prev.includes(stepNumber)) {
        return prev.filter((n) => n !== stepNumber);
      } else {
        return [...prev, stepNumber];
      }
    });
  };

  const selectAllFilteredSteps = () => {
    setSelectedStepNumbers(filteredSteps.map((s) => s.step));
  };

  const clearStepSelection = () => {
    setSelectedStepNumbers([]);
  };

  // Batch Status Update
  const handleBatchStatusUpdate = (newStatus: StepStatus) => {
    selectedStepNumbers.forEach((stepNum) => {
      onUpdateStep(stepNum, { status: newStatus });
    });
    if (activeStep && selectedStepNumbers.includes(activeStep.step)) {
      setActiveStep({ ...activeStep, status: newStatus });
    }
  };

  // Batch AI Execution
  const handleBatchAiGuidance = async () => {
    if (selectedStepNumbers.length === 0) return;
    setBatchAiLoading(true);
    setAiError(null);
    try {
      const stepsToRun = allSteps.filter((s) => selectedStepNumbers.includes(s.step));
      for (const step of stepsToRun) {
        try {
          const res = await fetch('/api/gemini/step-execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              stepNumber: step.step,
              stepName: step.name,
              phaseName: step.phase_name,
              businessContext,
              valuationDriver: step.valuation_driver,
            }),
          });
          const data = await res.json();
          if (res.ok && data.success) {
            onUpdateStep(step.step, { aiOutput: data.output, status: 'completed' });
          }
        } catch {
          // continue batch
        }
      }
    } catch (err: any) {
      setAiError(err.message || 'Batch AI Execution encountered an issue');
    } finally {
      setBatchAiLoading(false);
    }
  };

  // Batch Export Selected Steps
  const handleBatchExport = () => {
    const selectedStepsData = allSteps.filter((s) => selectedStepNumbers.includes(s.step));
    const exportPacket = {
      title: 'Astro Lab Fab Startup - Selected Steps Execution Manifest',
      exportedAt: new Date().toISOString(),
      stepCount: selectedStepsData.length,
      steps: selectedStepsData.map((s) => ({
        stepNumber: s.step,
        phase: s.phase_name,
        name: s.name,
        decisionFocus: s.decision_focus,
        valuationDriver: s.valuation_driver,
        status: s.status,
        scores: s.driverScores,
        valuationScore: s.calculatedScore,
        decisionGate: s.decisionGate,
        aiGuidance: s.aiOutput || null,
        userNotes: s.userNotes || null,
      })),
    };

    const blob = new Blob([JSON.stringify(exportPacket, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lifecycle_selected_${selectedStepsData.length}_steps_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const handleDriverChange = (
    stepNumber: number,
    driver: keyof DriverScores,
    value: number
  ) => {
    if (!activeStep) return;
    const updatedScores = {
      ...activeStep.driverScores,
      [driver]: value,
    };
    const { score, gate } = calculateStepValuation(updatedScores);
    const updated = {
      driverScores: updatedScores,
      calculatedScore: score,
      decisionGate: gate,
    };
    setActiveStep({ ...activeStep, ...updated });
    onUpdateStep(stepNumber, updated);
  };

  const handleStatusChange = (stepNumber: number, newStatus: StepStatus) => {
    onUpdateStep(stepNumber, { status: newStatus });
    if (activeStep && activeStep.step === stepNumber) {
      setActiveStep({ ...activeStep, status: newStatus });
    }
  };

  const handleNotesChange = (stepNumber: number, notes: string) => {
    onUpdateStep(stepNumber, { userNotes: notes });
    if (activeStep && activeStep.step === stepNumber) {
      setActiveStep({ ...activeStep, userNotes: notes });
    }
  };

  const executeAiGuidance = async (step: StartupStep) => {
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch('/api/gemini/step-execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stepNumber: step.step,
          stepName: step.name,
          phaseName: step.phase_name,
          businessContext,
          valuationDriver: step.valuation_driver,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to execute AI step guidance');
      }

      onUpdateStep(step.step, { aiOutput: data.output });
      if (activeStep && activeStep.step === step.step) {
        setActiveStep({ ...activeStep, aiOutput: data.output });
      }
    } catch (err: any) {
      setAiError(err.message || 'Error communicating with AI server');
    } finally {
      setAiLoading(false);
    }
  };

  // Primary selected phase for single-phase tracker compatibility
  const primarySelectedPhaseId = selectedPhaseIds.length === 1 ? selectedPhaseIds[0] : 'all';

  return (
    <div className="space-y-6">
      
      {/* Top View Mode Navigation Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1117] p-2.5 rounded-2xl border border-[#1f2228]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-300 uppercase px-2 flex items-center gap-1.5">
            <LayoutGrid className="w-3.5 h-3.5 text-[#00ff9d]" /> View Mode:
          </span>
          <div className="flex bg-[#08090a] p-1 rounded-xl border border-[#1f2228] text-xs font-mono">
            <button
              id="view-combined"
              onClick={() => setLifecycleView('combined')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                lifecycleView === 'combined'
                  ? 'bg-[#00ff9d] text-black shadow-[0_0_12px_rgba(0,255,157,0.3)]'
                  : 'text-[#888e96] hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Combined Overview
            </button>
            <button
              id="view-minimap-only"
              onClick={() => setLifecycleView('minimap')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                lifecycleView === 'minimap'
                  ? 'bg-[#00ff9d] text-black shadow-[0_0_12px_rgba(0,255,157,0.3)]'
                  : 'text-[#888e96] hover:text-white'
              }`}
            >
              <GitFork className="w-3.5 h-3.5" /> Dependency Mini-Map
            </button>
            <button
              id="view-milestones-only"
              onClick={() => setLifecycleView('milestones')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                lifecycleView === 'milestones'
                  ? 'bg-[#00ff9d] text-black shadow-[0_0_12px_rgba(0,255,157,0.3)]'
                  : 'text-[#888e96] hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" /> Key Milestones
            </button>
            <button
              id="view-timeline-only"
              onClick={() => setLifecycleView('timeline')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                lifecycleView === 'timeline'
                  ? 'bg-[#00ff9d] text-black shadow-[0_0_12px_rgba(0,255,157,0.3)]'
                  : 'text-[#888e96] hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Timeline & Velocity
            </button>
            <button
              id="view-steps-only"
              onClick={() => setLifecycleView('steps')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                lifecycleView === 'steps'
                  ? 'bg-[#00ff9d] text-black shadow-[0_0_12px_rgba(0,255,157,0.3)]'
                  : 'text-[#888e96] hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> 145 Step Grid
            </button>
          </div>
        </div>

        <div className="text-[11px] font-mono text-[#888e96] flex items-center gap-2 pr-2">
          <span>Showing: <strong className="text-white">{filteredSteps.length}</strong> of 145 Steps</span>
          <span>•</span>
          <span>Phases: <strong className="text-[#00ff9d]">{selectedPhaseIds.length === 0 ? 'All 10 Selected' : `${selectedPhaseIds.length} Selected`}</strong></span>
        </div>
      </div>

      {/* Interactive D3 Step Mini-Map & Dependency Network */}
      {(lifecycleView === 'combined' || lifecycleView === 'minimap') && (
        <LifecycleMiniMap
          phases={phases}
          selectedStepNumber={activeStep?.step ?? 1}
          onSelectStep={(step) => {
            setActiveStep(step);
          }}
          onUpdateStepStatus={(stepNum, newStatus) => {
            onUpdateStep(stepNum, { status: newStatus });
            if (activeStep && activeStep.step === stepNum) {
              setActiveStep({ ...activeStep, status: newStatus });
            }
          }}
          onOpenStepModal={(step) => {
            setActiveStep(step);
            setModalTab('substeps');
          }}
        />
      )}

      {/* 10-Phase Visual Progress Tracker with Recharts Ring Chart */}
      {(lifecycleView === 'combined' || lifecycleView === 'steps') && (
        <PhaseProgressTracker
          phases={phases}
          selectedPhaseId={primarySelectedPhaseId}
          onSelectPhase={(phaseId) => togglePhaseId(phaseId)}
        />
      )}

      {/* Phase Key Milestones & Critical Deliverables Tracker */}
      {(lifecycleView === 'combined' || lifecycleView === 'milestones') && (
        <PhaseMilestonesTracker
          phases={phases}
          activePhaseId={primarySelectedPhaseId}
          onPhaseSelect={(phaseId) => togglePhaseId(phaseId)}
          businessContext={businessContext}
        />
      )}

      {/* Projected Timeline Horizon & Velocity Engine (Dedicated or Combined) */}
      {(lifecycleView === 'combined' || lifecycleView === 'timeline') && (
        <ProjectedTimeline
          phases={phases}
          onSelectPhase={(phaseId) => togglePhaseId(phaseId)}
        />
      )}

      {/* Steps List & Filters (when combined or steps view) */}
      {(lifecycleView === 'combined' || lifecycleView === 'steps') && (
        <>
          {/* Top Filter Bar */}
          <div className="bento-card p-4 space-y-4">
            
            {/* Search & Status Filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-[#888e96] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search step # or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#08090a] border border-[#1f2228] text-slate-200 text-xs rounded-lg pl-9 pr-3 py-2 font-mono focus:outline-none focus:border-[#00ff9d]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                <span className="text-xs text-[#888e96] font-mono flex items-center gap-1 uppercase tracking-wider">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#00ff9d]" /> Status Filter (Multi-Select):
                </span>
                {['pending', 'in_progress', 'completed', 'skipped'].map((st) => {
                  const isChecked = selectedStatuses.includes(st);
                  return (
                    <button
                      key={st}
                      onClick={() => toggleStatus(st)}
                      className={`text-xs px-2.5 py-1 rounded-lg capitalize font-mono transition-colors flex items-center gap-1.5 ${
                        isChecked
                          ? 'bg-[#00ff9d] text-[#08090a] font-bold shadow-[0_0_8px_rgba(0,255,157,0.3)]'
                          : 'bg-[#08090a] text-[#888e96] hover:text-slate-200 border border-[#1f2228]'
                      }`}
                    >
                      {isChecked ? <CheckSquare className="w-3 h-3 text-black" /> : <Square className="w-3 h-3 text-[#888e96]" />}
                      {st.replace('_', ' ')}
                    </button>
                  );
                })}
                {selectedStatuses.length > 0 && (
                  <button
                    onClick={() => setSelectedStatuses([])}
                    className="text-[11px] font-mono text-[#888e96] hover:text-amber-400 underline ml-1"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Phase Pills Selector (Multi-Select Enabled) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#888e96] flex items-center gap-1 uppercase tracking-wider">
                  <Layers className="w-3.5 h-3.5 text-[#00ff9d]" /> Filter by Phases (Multi-Select Enabled):
                </span>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <button
                    onClick={selectAllPhases}
                    className="text-[#00ff9d] hover:underline"
                  >
                    Select All 10
                  </button>
                  <span className="text-[#1f2228]">|</span>
                  <button
                    onClick={clearPhaseSelection}
                    className="text-[#888e96] hover:text-white hover:underline"
                  >
                    View All (Default)
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setSelectedPhaseIds([])}
                  className={`text-xs px-3 py-1.5 rounded-lg font-mono font-bold whitespace-nowrap transition-colors ${
                    selectedPhaseIds.length === 0
                      ? 'bg-amber-400 text-[#08090a] shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                      : 'bg-[#08090a] text-[#888e96] hover:text-slate-200 border border-[#1f2228]'
                  }`}
                >
                  All 145 Steps ({allSteps.length})
                </button>
                {phases.map((p, idx) => {
                  const isSelected = selectedPhaseIds.includes(p.phase_id);
                  const completedInPhase = p.steps.filter((s) => s.status === 'completed').length;
                  return (
                    <button
                      key={p.phase_id}
                      onClick={() => togglePhaseId(p.phase_id)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-mono whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                        isSelected
                          ? 'bg-[#00ff9d] text-[#08090a] font-bold shadow-[0_0_10px_rgba(0,255,157,0.3)]'
                          : 'bg-[#08090a] text-[#888e96] hover:text-slate-200 border border-[#1f2228]'
                      }`}
                    >
                      {isSelected && <CheckSquare className="w-3 h-3 text-black" />}
                      <span>Phase {idx + 1}</span>
                      <span className="text-[10px] opacity-75">
                        ({completedInPhase}/{p.steps.length})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Sticky Multi-Select Batch Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1117] p-3 rounded-xl border border-[#1f2228] text-xs font-mono">
            <div className="flex items-center gap-3">
              <button
                onClick={selectedStepNumbers.length === filteredSteps.length && filteredSteps.length > 0 ? clearStepSelection : selectAllFilteredSteps}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#08090a] border border-[#1f2228] text-slate-200 hover:text-white hover:border-[#00ff9d] transition-all font-bold"
              >
                {selectedStepNumbers.length > 0 && selectedStepNumbers.length === filteredSteps.length ? (
                  <>
                    <CheckSquare className="w-4 h-4 text-[#00ff9d]" /> Deselect All ({filteredSteps.length})
                  </>
                ) : (
                  <>
                    <Square className="w-4 h-4 text-[#888e96]" /> Select All Filtered ({filteredSteps.length})
                  </>
                )}
              </button>

              {selectedStepNumbers.length > 0 && (
                <span className="bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30 px-2.5 py-1 rounded-md font-bold">
                  {selectedStepNumbers.length} Step{selectedStepNumbers.length > 1 ? 's' : ''} Selected
                </span>
              )}
            </div>

            {selectedStepNumbers.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[#888e96] text-[11px] uppercase tracking-wider mr-1">Batch Actions:</span>
                
                <button
                  onClick={() => handleBatchStatusUpdate('completed')}
                  className="px-2.5 py-1 rounded bg-[#00ff9d]/20 text-[#00ff9d] border border-[#00ff9d]/40 hover:bg-[#00ff9d] hover:text-black transition-all flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
                </button>

                <button
                  onClick={() => handleBatchStatusUpdate('in_progress')}
                  className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-400 hover:text-black transition-all flex items-center gap-1"
                >
                  <Clock className="w-3.5 h-3.5" /> Mark In Progress
                </button>

                <button
                  onClick={() => handleBatchStatusUpdate('pending')}
                  className="px-2.5 py-1 rounded bg-[#08090a] text-slate-300 border border-[#1f2228] hover:text-white transition-all"
                >
                  Mark Pending
                </button>

                <button
                  onClick={handleBatchAiGuidance}
                  disabled={batchAiLoading}
                  className="px-3 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500 hover:text-white transition-all flex items-center gap-1.5 font-bold"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                  {batchAiLoading ? 'Executing Batch AI...' : 'Batch AI Guidance'}
                </button>

                <button
                  onClick={handleBatchExport}
                  className="px-2.5 py-1 rounded bg-[#08090a] text-slate-300 border border-[#1f2228] hover:text-white hover:border-[#00ff9d] transition-all flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5 text-[#00ff9d]" /> Export JSON
                </button>

                <button
                  onClick={clearStepSelection}
                  className="p-1 rounded text-[#888e96] hover:text-rose-400 ml-1"
                  title="Clear Selection"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Step Grid Cards with Selection Checkboxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSteps.map((step) => {
              const { score, gate } = calculateStepValuation(step.driverScores);
              const isCompleted = step.status === 'completed';
              const isInProgress = step.status === 'in_progress';
              const isCardSelected = selectedStepNumbers.includes(step.step);

              return (
                <div
                  key={step.step}
                  onClick={() => setActiveStep(step)}
                  className={`group bento-card p-4 cursor-pointer transition-all flex flex-col justify-between relative ${
                    isCardSelected
                      ? 'ring-2 ring-[#00ff9d] bg-[#00ff9d]/10'
                      : isCompleted
                      ? 'border-[#00ff9d]/40 bg-[#00ff9d]/5'
                      : isInProgress
                      ? 'border-amber-500/40 bg-amber-500/5'
                      : 'border-[#1f2228]'
                  }`}
                >
                  <div>
                    {/* Step Header with Selection Checkbox */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => toggleStepSelection(step.step, e)}
                          className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
                            isCardSelected
                              ? 'bg-[#00ff9d] text-black shadow-[0_0_8px_rgba(0,255,157,0.4)]'
                              : 'bg-[#08090a] border border-[#1f2228] text-[#888e96] hover:text-[#00ff9d] hover:border-[#00ff9d]'
                          }`}
                          title="Select / Multi-Select Step"
                        >
                          {isCardSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <span className="font-mono text-[10px]">#{step.step}</span>}
                        </button>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#08090a] text-[#888e96] border border-[#1f2228]">
                          {step.phase_name.split(':')[0] || 'Phase'}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                          gate === 'GO'
                            ? 'bg-[#00ff9d]/10 text-[#00ff9d] border-[#00ff9d]/30'
                            : gate === 'REVISE'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        Score: {score} ({gate})
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-sm text-slate-100 group-hover:text-[#00ff9d] transition-colors line-clamp-2 mb-2">
                      {step.name}
                    </h3>

                    <p className="text-xs text-[#888e96] line-clamp-2 mb-3">
                      Driver Focus: <span className="text-slate-300">{step.decision_focus}</span>
                    </p>
                  </div>

                  {/* Step Footer */}
                  <div className="pt-3 border-t border-[#1f2228] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded capitalize ${
                          step.status === 'completed'
                            ? 'bg-[#00ff9d]/10 text-[#00ff9d]'
                            : step.status === 'in_progress'
                            ? 'bg-amber-500/10 text-amber-400'
                            : step.status === 'skipped'
                            ? 'bg-[#08090a] text-[#888e96]'
                            : 'bg-[#08090a] text-[#888e96]'
                        }`}
                      >
                        {step.status === 'completed' && <span className="status-glow"></span>}
                        {step.status === 'in_progress' && <span className="status-glow-amber"></span>}
                        {step.status.replace('_', ' ')}
                      </span>

                      {step.aiOutput && (
                        <span className="text-[10px] text-[#00ff9d] bg-[#00ff9d]/10 px-1.5 py-0.5 rounded border border-[#00ff9d]/30 flex items-center gap-1 font-mono">
                          <Sparkles className="w-2.5 h-2.5" /> AI Executed
                        </span>
                      )}
                    </div>

                    <div className="text-[#888e96] group-hover:text-[#00ff9d] flex items-center gap-0.5 text-xs font-mono">
                      Inspect <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredSteps.length === 0 && (
            <div className="text-center py-12 bento-card">
              <AlertCircle className="w-8 h-8 text-[#888e96] mx-auto mb-2" />
              <p className="text-[#888e96] text-xs font-mono">No steps match your active filter criteria.</p>
            </div>
          )}
        </>
      )}

      {/* Step Detail Modal */}
      {activeStep && (
        <div className="fixed inset-0 z-50 bg-[#08090a]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121417] border border-[#1f2228] rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative my-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#1f2228] pb-4 gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-[#00ff9d] text-[#08090a] font-mono font-bold text-xs px-2 py-0.5 rounded">
                    Step #{activeStep.step}
                  </span>
                  <span className="text-xs text-[#888e96] font-mono">
                    {activeStep.phase_name}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white">{activeStep.name}</h2>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-[#08090a] p-1 rounded-xl border border-[#1f2228]">
                  <button
                    onClick={() => setModalTab('plan')}
                    className={`text-xs px-3 py-1 rounded-lg font-mono font-bold transition-all ${
                      modalTab === 'plan'
                        ? 'bg-[#00ff9d] text-[#08090a]'
                        : 'text-[#888e96] hover:text-white'
                    }`}
                  >
                    AI Plan & Drivers
                  </button>
                  <button
                    onClick={() => setModalTab('substeps')}
                    className={`text-xs px-3 py-1 rounded-lg font-mono font-bold transition-all ${
                      modalTab === 'substeps'
                        ? 'bg-[#00ff9d] text-[#08090a]'
                        : 'text-[#888e96] hover:text-white'
                    }`}
                  >
                    33-Field Substep
                  </button>
                </div>

                <button
                  onClick={() => setActiveStep(null)}
                  className="p-1.5 text-[#888e96] hover:text-white bg-[#08090a] hover:bg-[#1f2228] border border-[#1f2228] rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {modalTab === 'plan' ? (
              <>
                {/* Status & Valuation Score Panel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#08090a] p-4 rounded-xl border border-[#1f2228]">
                  
                  {/* Status Picker */}
                  <div>
                    <label className="text-xs font-mono uppercase text-[#888e96] block mb-1.5">
                      Execution Status
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {(['pending', 'in_progress', 'completed', 'skipped'] as StepStatus[]).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(activeStep.step, st)}
                          className={`text-xs px-3 py-1.5 rounded-lg capitalize font-mono transition-colors ${
                            activeStep.status === st
                              ? 'bg-[#00ff9d] text-[#08090a] font-bold shadow-[0_0_8px_rgba(0,255,157,0.3)]'
                              : 'bg-[#121417] text-[#888e96] hover:text-slate-200 border border-[#1f2228]'
                          }`}
                        >
                          {st.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Live Formula Score */}
                  <div className="flex items-center justify-between md:justify-end gap-4">
                    <div className="text-right">
                      <div className="text-[10px] text-[#888e96] uppercase font-mono">
                        Valuation Score
                      </div>
                      <div className="text-xl font-extrabold font-mono text-amber-400">
                        {calculateStepValuation(activeStep.driverScores).score}{' '}
                        <span className="text-xs text-[#888e96] font-normal">/ 10</span>
                      </div>
                    </div>

                    <div
                      className={`px-3 py-2 rounded-xl text-center font-bold text-xs border font-mono ${
                        calculateStepValuation(activeStep.driverScores).gate === 'GO'
                          ? 'bg-[#00ff9d]/10 text-[#00ff9d] border-[#00ff9d]/30'
                          : calculateStepValuation(activeStep.driverScores).gate === 'REVISE'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      <div className="text-[9px] uppercase tracking-wider opacity-80">Gate</div>
                      <div className="text-base">{calculateStepValuation(activeStep.driverScores).gate}</div>
                    </div>
                  </div>

                </div>

                {/* Valuation Driver Sliders */}
                <div className="space-y-3">
                  <h3 className="text-xs font-mono font-bold uppercase text-slate-300 tracking-wider flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-[#00ff9d]" /> Valuation Drivers (0 - 10)
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#08090a] p-4 rounded-xl border border-[#1f2228]">
                    {(
                      [
                        { key: 'revenue_impact', label: 'Revenue Impact (25%)' },
                        { key: 'risk_reduction', label: 'Risk Reduction (20%)' },
                        { key: 'strategic_fit', label: 'Strategic Fit (20%)' },
                        { key: 'time_to_value', label: 'Time to Value (15%)' },
                        { key: 'operational_leverage', label: 'Operational Leverage (10%)' },
                        { key: 'cost_to_complete', label: 'Cost to Complete (-10%)' },
                      ] as { key: keyof DriverScores; label: string }[]
                    ).map(({ key, label }) => (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-300 font-mono">
                          <span>{label}</span>
                          <span className="font-bold text-[#00ff9d]">
                            {activeStep.driverScores[key]}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          step="1"
                          value={activeStep.driverScores[key]}
                          onChange={(e) =>
                            handleDriverChange(activeStep.step, key, parseInt(e.target.value))
                          }
                          className="w-full accent-[#00ff9d] bg-[#121417] rounded-lg h-2"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* User Notes */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold uppercase text-slate-300 tracking-wider block">
                    User Step Notes & Internal Logs
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Add custom notes, links, or internal thoughts for this step..."
                    value={activeStep.userNotes || ''}
                    onChange={(e) => handleNotesChange(activeStep.step, e.target.value)}
                    className="w-full bg-[#08090a] border border-[#1f2228] rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#00ff9d]"
                  />
                </div>

                {/* AI Step Execution Output Section */}
                <div className="space-y-3 pt-2 border-t border-[#1f2228]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-mono font-bold uppercase text-slate-200 tracking-wider flex items-center gap-2">
                      <Bot className="w-4 h-4 text-[#00ff9d]" /> AI Executive Execution Plan
                    </h3>

                    <button
                      onClick={() => executeAiGuidance(activeStep)}
                      disabled={aiLoading}
                      className="bg-[#00ff9d] hover:bg-[#00ff9d]/90 text-[#08090a] px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 shadow-[0_0_12px_rgba(0,255,157,0.3)] transition-all disabled:opacity-50"
                    >
                      {aiLoading ? (
                        <>
                          <RotateCcw className="w-3.5 h-3.5 animate-spin" /> Generating AI Plan...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" /> Execute AI Guidance
                        </>
                      )}
                    </button>
                  </div>

                  {aiError && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-mono">
                      {aiError}
                    </div>
                  )}

                  {activeStep.aiOutput ? (
                    <div className="bg-[#08090a] border border-[#1f2228] rounded-xl p-4 text-slate-200 text-xs space-y-2 max-h-80 overflow-y-auto font-mono whitespace-pre-wrap leading-relaxed">
                      {activeStep.aiOutput}
                    </div>
                  ) : (
                    <div className="bg-[#08090a]/50 border border-dashed border-[#1f2228] rounded-xl p-6 text-center text-xs text-[#888e96] font-mono">
                      Click <span className="text-[#00ff9d] font-semibold">"Execute AI Guidance"</span> above to generate step SOPs, deliverables, and risk mitigations via Gemini AI.
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Substeps Breakdown Tab */
              (() => {
                const sub = createDefaultSubstep(activeStep.step, activeSubstepIndex, activeStep.name, activeStep.phase_name);
                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
                      <span className="text-xs font-mono font-bold text-slate-200 uppercase">
                        Select Substep Index
                      </span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveSubstepIndex(idx)}
                            className={`w-7 h-7 rounded font-mono text-xs font-bold ${
                              activeSubstepIndex === idx
                                ? 'bg-[#00ff9d] text-[#08090a]'
                                : 'bg-[#08090a] text-[#888e96] hover:text-white border border-[#1f2228]'
                            }`}
                          >
                            #{idx}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#08090a] p-4 rounded-xl border border-[#1f2228] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[#00ff9d]">{sub.id}: {sub.title}</span>
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">{sub.difficulty}</span>
                      </div>
                      <p className="text-xs text-[#888e96]">{sub.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                      <div className="bg-[#08090a] p-3 rounded-xl border border-[#1f2228] space-y-1">
                        <span className="text-[10px] text-[#00ff9d] uppercase block font-bold">Execution Scripts</span>
                        <div className="text-[10px] text-slate-300">Bash: <code className="text-[#00ff9d]">{sub.bash_script.slice(0, 45)}...</code></div>
                        <div className="text-[10px] text-slate-300">SQL: <code className="text-cyan-400">{sub.sql_script.slice(0, 45)}...</code></div>
                      </div>

                      <div className="bg-[#08090a] p-3 rounded-xl border border-[#1f2228] space-y-1">
                        <span className="text-[10px] text-[#00ff9d] uppercase block font-bold">AI Model & Validation</span>
                        <div className="text-[10px] text-slate-300">Primary: {sub.primary_model}</div>
                        <div className="text-[10px] text-slate-300">Fallback: {sub.fallback_model}</div>
                      </div>
                    </div>

                    <div className="bg-[#08090a] p-3 rounded-xl border border-[#1f2228] space-y-1 text-xs">
                      <span className="text-[10px] font-mono font-bold text-[#00ff9d] uppercase block">5-Point Quality Checklist</span>
                      <ul className="list-disc list-inside text-[11px] text-[#888e96] font-mono space-y-0.5">
                        {sub.quality_checklist.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })()
            )}

          </div>
        </div>
      )}

    </div>
  );
};
