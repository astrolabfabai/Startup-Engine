import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  TrendingUp,
  Zap,
  Target,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  Sliders,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Download,
  Flame,
  Layers,
  Filter,
  Info,
} from 'lucide-react';
import { StartupPhase, StartupStep } from '../types';

interface ProjectedTimelineProps {
  phases: StartupPhase[];
  onSelectPhase?: (phaseId: string) => void;
}

// Complexity weights per phase for nuanced realistic timeline projection
const PHASE_COMPLEXITY: Record<number, { weight: number; milestone: string; riskFactor: string }> = {
  1: { weight: 1.0, milestone: 'Problem & Opportunity Definition', riskFactor: 'Low' },
  2: { weight: 1.1, milestone: 'Business Model & Unit Economics', riskFactor: 'Low-Med' },
  3: { weight: 1.3, milestone: 'MVP Tech Architecture & Stack', riskFactor: 'Medium' },
  4: { weight: 1.25, milestone: 'Commercial Go-To-Market Launch', riskFactor: 'Med-High' },
  5: { weight: 1.4, milestone: 'Capitalization & Non-Dilutive Grants', riskFactor: 'High' },
  6: { weight: 1.2, milestone: 'Operational Scaling & Automation', riskFactor: 'Medium' },
  7: { weight: 1.35, milestone: 'Governance, Compliance & IP moat', riskFactor: 'Med-High' },
  8: { weight: 1.25, milestone: 'Channel Partnerships & Integrations', riskFactor: 'Medium' },
  9: { weight: 1.3, milestone: 'Market Expansion & Enterprise Moat', riskFactor: 'Medium' },
  10: { weight: 1.5, milestone: 'Autonomous Operations / Strategic Exit', riskFactor: 'High' },
};

// 10 Distinct theme colors for phases
const PHASE_COLORS = [
  '#00ff9d', // Phase 1: Cyan-Emerald
  '#38bdf8', // Phase 2: Sky Blue
  '#a855f7', // Phase 3: Purple
  '#fbbf24', // Phase 4: Amber
  '#f43f5e', // Phase 5: Rose
  '#10b981', // Phase 6: Emerald
  '#ec4899', // Phase 7: Pink
  '#6366f1', // Phase 8: Indigo
  '#f97316', // Phase 9: Orange
  '#06b6d4', // Phase 10: Cyan
];

// Helper to add working days or calendar days
function addDays(startDate: Date, days: number, includeWeekends: boolean = false): Date {
  const result = new Date(startDate);
  if (includeWeekends) {
    result.setDate(result.getDate() + Math.round(days));
    return result;
  }
  let added = 0;
  while (added < Math.floor(days)) {
    result.setDate(result.getDate() + 1);
    const dayOfWeek = result.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      added++;
    }
  }
  return result;
}

// Format date nicely
function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatShortDate(d: Date): string {
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export const ProjectedTimeline: React.FC<ProjectedTimelineProps> = ({
  phases,
  onSelectPhase,
}) => {
  // Settings & Controls
  const [velocityMode, setVelocityMode] = useState<'historical' | 'standard' | 'sprint' | 'blitz' | 'custom'>('historical');
  const [customVelocity, setCustomVelocity] = useState<number>(3.0); // steps per day
  const [includeWeekends, setIncludeWeekends] = useState<boolean>(false);
  const [projectStartDate, setProjectStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 14); // 14 days ago baseline
    return d.toISOString().slice(0, 10);
  });
  const [selectedScenario, setSelectedScenario] = useState<'nominal' | 'optimistic' | 'pessimistic'>('nominal');
  const [activeViewMode, setActiveViewMode] = useState<'gantt' | 'roadmap' | 'scenarios'>('gantt');

  // Aggregated Step Counts
  const allSteps = useMemo(() => phases.flatMap((p) => p.steps), [phases]);
  const totalSteps = allSteps.length;
  const completedSteps = useMemo(
    () => allSteps.filter((s) => s.status === 'completed').length,
    [allSteps]
  );
  const inProgressSteps = useMemo(
    () => allSteps.filter((s) => s.status === 'in_progress').length,
    [allSteps]
  );
  const remainingSteps = totalSteps - completedSteps;

  // Compute Observed Historical Velocity
  const historicalVelocity = useMemo(() => {
    const start = new Date(projectStartDate);
    const today = new Date();
    const diffTime = Math.max(1, today.getTime() - start.getTime());
    const diffDays = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));
    
    // If completed steps exist, compute rate, else default to realistic 2.5 steps/day
    if (completedSteps > 0) {
      const workingDaysElapsed = includeWeekends ? diffDays : Math.max(1, Math.round(diffDays * (5 / 7)));
      const rate = completedSteps / workingDaysElapsed;
      return Math.max(0.5, Math.min(15.0, Number(rate.toFixed(2))));
    }
    return 2.5;
  }, [projectStartDate, completedSteps, includeWeekends]);

  // Effective Base Velocity (steps / day)
  const effectiveVelocity = useMemo(() => {
    switch (velocityMode) {
      case 'historical':
        return historicalVelocity;
      case 'standard':
        return 2.0; // 2 steps/day
      case 'sprint':
        return 4.5; // 4.5 steps/day
      case 'blitz':
        return 8.0; // 8.0 steps/day (AI assisted)
      case 'custom':
        return customVelocity;
      default:
        return historicalVelocity;
    }
  }, [velocityMode, historicalVelocity, customVelocity]);

  // Scenario Multiplier
  const scenarioMultiplier = useMemo(() => {
    if (selectedScenario === 'optimistic') return 1.35; // 35% faster
    if (selectedScenario === 'pessimistic') return 0.70; // 30% slower
    return 1.0;
  }, [selectedScenario]);

  const activeDailyRate = effectiveVelocity * scenarioMultiplier;

  // Project Phase Timeline Projections
  const projectedTimelineData = useMemo(() => {
    const today = new Date();
    let currentCursorDate = new Date(today);

    // Calculate elapsed historical progress
    return phases.map((phase, idx) => {
      const phaseNum = idx + 1;
      const phaseTotal = phase.steps.length;
      const phaseCompleted = phase.steps.filter((s) => s.status === 'completed').length;
      const phaseInProgress = phase.steps.filter((s) => s.status === 'in_progress').length;
      const phaseRemaining = phaseTotal - phaseCompleted;
      const isPhaseFullyCompleted = phaseCompleted === phaseTotal && phaseTotal > 0;
      const isPhaseInProgress = phaseInProgress > 0 || (phaseCompleted > 0 && !isPhaseFullyCompleted);
      const isPhasePending = phaseCompleted === 0 && phaseInProgress === 0;

      const complexity = PHASE_COMPLEXITY[phaseNum] || { weight: 1.0, milestone: 'Milestone Gate', riskFactor: 'Medium' };
      const adjustedRate = Math.max(0.2, activeDailyRate / complexity.weight);

      // Clean title
      const cleanTitle = phase.phase_name.includes(':')
        ? phase.phase_name.split(':')[1].trim()
        : phase.phase_name;

      let estimatedDaysNeeded = 0;
      let phaseStartDate: Date;
      let phaseFinishDate: Date;

      if (isPhaseFullyCompleted) {
        // Historical phase: finished before or around today
        const historicalStart = new Date(projectStartDate);
        const daysAgo = Math.max(0, 14 - idx * 2);
        phaseStartDate = new Date(historicalStart);
        phaseStartDate.setDate(phaseStartDate.getDate() + (idx * 2));
        phaseFinishDate = new Date(today);
        phaseFinishDate.setDate(phaseFinishDate.getDate() - daysAgo);
        if (phaseFinishDate < phaseStartDate) phaseFinishDate = new Date(phaseStartDate);
        estimatedDaysNeeded = 0;
      } else if (isPhaseInProgress) {
        // Active phase: started previously, ends forward from today
        phaseStartDate = new Date(today);
        phaseStartDate.setDate(phaseStartDate.getDate() - 2); // started 2 days ago
        // Remaining steps to finish
        const stepsLeft = Math.max(1, phaseRemaining);
        estimatedDaysNeeded = Math.max(1, Math.ceil(stepsLeft / adjustedRate));
        phaseFinishDate = addDays(today, estimatedDaysNeeded, includeWeekends);
        currentCursorDate = new Date(phaseFinishDate);
      } else {
        // Future phase: starts when previous phase finishes
        phaseStartDate = new Date(currentCursorDate);
        estimatedDaysNeeded = Math.max(1, Math.ceil(phaseTotal / adjustedRate));
        phaseFinishDate = addDays(phaseStartDate, estimatedDaysNeeded, includeWeekends);
        currentCursorDate = new Date(phaseFinishDate);
      }

      const progressPct = phaseTotal > 0 ? Math.round((phaseCompleted / phaseTotal) * 100) : 0;

      return {
        id: phase.phase_id,
        index: phaseNum,
        name: `P${phaseNum}: ${cleanTitle}`,
        fullName: phase.phase_name,
        total: phaseTotal,
        completed: phaseCompleted,
        inProgress: phaseInProgress,
        remaining: phaseRemaining,
        isFullyCompleted: isPhaseFullyCompleted,
        isInProgress: isPhaseInProgress,
        isPending: isPhasePending,
        progressPct,
        milestone: complexity.milestone,
        riskFactor: complexity.riskFactor,
        complexityWeight: complexity.weight,
        color: PHASE_COLORS[idx % PHASE_COLORS.length],
        startDate: phaseStartDate,
        finishDate: phaseFinishDate,
        durationDays: estimatedDaysNeeded,
      };
    });
  }, [phases, activeDailyRate, includeWeekends, projectStartDate]);

  // Overall Projected Launch Date (finish date of Phase 10)
  const finalProjectedDate = useMemo(() => {
    if (projectedTimelineData.length === 0) return new Date();
    return projectedTimelineData[projectedTimelineData.length - 1].finishDate;
  }, [projectedTimelineData]);

  // Days remaining from today until final launch
  const totalDaysRemaining = useMemo(() => {
    const today = new Date();
    const diff = finalProjectedDate.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [finalProjectedDate]);

  // 3-Point Estimates for Project Finish Date
  const scenarioEstimates = useMemo(() => {
    const today = new Date();
    const remainingCount = Math.max(1, remainingSteps);
    
    // Best Case: +35% velocity
    const bestDays = Math.ceil(remainingCount / (effectiveVelocity * 1.35));
    const bestDate = addDays(today, bestDays, includeWeekends);

    // Nominal: Base velocity
    const nominalDays = Math.ceil(remainingCount / effectiveVelocity);
    const nominalDate = addDays(today, nominalDays, includeWeekends);

    // Worst Case: -30% velocity + friction buffer
    const worstDays = Math.ceil(remainingCount / (effectiveVelocity * 0.70));
    const worstDate = addDays(today, worstDays, includeWeekends);

    return {
      best: { days: bestDays, date: bestDate, rate: (effectiveVelocity * 1.35).toFixed(1) },
      nominal: { days: nominalDays, date: nominalDate, rate: effectiveVelocity.toFixed(1) },
      worst: { days: worstDays, date: worstDate, rate: (effectiveVelocity * 0.70).toFixed(1) },
    };
  }, [remainingSteps, effectiveVelocity, includeWeekends]);

  // Gantt Chart Range Math
  const ganttHorizon = useMemo(() => {
    const today = new Date();
    const start = new Date(projectStartDate);
    const end = new Date(finalProjectedDate);
    const totalDurationMs = Math.max(86400000, end.getTime() - start.getTime());
    
    const todayPosPct = Math.max(0, Math.min(100, ((today.getTime() - start.getTime()) / totalDurationMs) * 100));

    return {
      start,
      end,
      totalDurationMs,
      todayPosPct,
    };
  }, [projectStartDate, finalProjectedDate]);

  // Handle Export of Timeline Projection Report
  const handleExportTimeline = () => {
    const report = {
      title: 'Astro Lab Fab Startup - Lifecycle Projected Timeline',
      generatedAt: new Date().toISOString(),
      velocityModel: {
        mode: velocityMode,
        effectiveDailyVelocity: activeDailyRate,
        workingDaysModel: includeWeekends ? '7-Day Calendar' : '5-Day Business Week',
        projectAnchorStartDate: projectStartDate,
        projectedLaunchDate: finalProjectedDate.toISOString(),
        totalDaysRemaining,
      },
      scenarioAnalysis: scenarioEstimates,
      phases: projectedTimelineData.map((p) => ({
        phaseIndex: p.index,
        phaseName: p.fullName,
        milestoneGate: p.milestone,
        progress: `${p.completed}/${p.total} (${p.progressPct}%)`,
        estimatedStartDate: p.startDate.toISOString().slice(0, 10),
        estimatedFinishDate: p.finishDate.toISOString().slice(0, 10),
        durationDays: p.durationDays,
        riskLevel: p.riskFactor,
      })),
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `projected_timeline_forecast_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <div className="bg-[#08090a] p-5 rounded-2xl border border-[#00ff9d]/30 font-mono text-slate-100 space-y-6 shadow-2xl relative overflow-hidden">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1f2228] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00ff9d]/10 border border-[#00ff9d]/30 flex items-center justify-center text-[#00ff9d]">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Visual Projected Timeline & Completion Velocity
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#00ff9d]/20 text-[#00ff9d] border border-[#00ff9d]/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Predictive Forecast
              </span>
            </div>
            <p className="text-xs text-[#888e96] mt-0.5">
              Monte Carlo velocity forecasting engine predicting estimated finish dates for remaining phases
            </p>
          </div>
        </div>

        {/* Action Controls & Sub-View Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sub-View Tabs */}
          <div className="flex bg-[#121417] p-1 rounded-xl border border-[#1f2228] text-xs">
            <button
              onClick={() => setActiveViewMode('gantt')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeViewMode === 'gantt'
                  ? 'bg-[#00ff9d] text-black shadow-[0_0_12px_rgba(0,255,157,0.3)]'
                  : 'text-[#888e96] hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Gantt Horizon
            </button>
            <button
              onClick={() => setActiveViewMode('roadmap')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeViewMode === 'roadmap'
                  ? 'bg-[#00ff9d] text-black shadow-[0_0_12px_rgba(0,255,157,0.3)]'
                  : 'text-[#888e96] hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Phase Milestones
            </button>
            <button
              onClick={() => setActiveViewMode('scenarios')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeViewMode === 'scenarios'
                  ? 'bg-[#00ff9d] text-black shadow-[0_0_12px_rgba(0,255,157,0.3)]'
                  : 'text-[#888e96] hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Scenarios (3-Point)
            </button>
          </div>

          {/* Export Forecast Report */}
          <button
            onClick={handleExportTimeline}
            className="px-3 py-1.5 bg-[#121417] hover:bg-[#1f2228] border border-[#1f2228] text-slate-300 hover:text-white text-xs rounded-xl font-bold flex items-center gap-1.5 transition-all"
            title="Download JSON Forecast Manifest"
          >
            <Download className="w-3.5 h-3.5 text-[#00ff9d]" /> Export
          </button>
        </div>
      </div>

      {/* TOP SUMMARY STATS DECK */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Estimated Launch Date */}
        <div className="bg-[#121417] p-3.5 rounded-xl border border-[#00ff9d]/30 relative overflow-hidden">
          <div className="flex items-center justify-between text-[10px] text-[#888e96] uppercase font-bold">
            <span>Target Final Launch</span>
            <Target className="w-3.5 h-3.5 text-[#00ff9d]" />
          </div>
          <div className="text-base sm:text-lg font-black text-[#00ff9d] mt-1 truncate">
            {formatDate(finalProjectedDate)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            in <strong className="text-amber-400">{totalDaysRemaining} days</strong> ({remainingSteps} steps left)
          </div>
        </div>

        {/* Current Completion Velocity */}
        <div className="bg-[#121417] p-3.5 rounded-xl border border-[#1f2228]">
          <div className="flex items-center justify-between text-[10px] text-[#888e96] uppercase font-bold">
            <span>Execution Velocity</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-base sm:text-lg font-black text-amber-400 mt-1">
            {activeDailyRate.toFixed(1)} <span className="text-xs text-slate-400 font-normal">steps/day</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 capitalize">
            Mode: <strong className="text-slate-200">{velocityMode}</strong>
          </div>
        </div>

        {/* Historical Steps Completed */}
        <div className="bg-[#121417] p-3.5 rounded-xl border border-[#1f2228]">
          <div className="flex items-center justify-between text-[10px] text-[#888e96] uppercase font-bold">
            <span>Completed Progress</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-base sm:text-lg font-black text-emerald-400 mt-1">
            {completedSteps} <span className="text-xs text-slate-400 font-normal">/ {totalSteps}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {Math.round((completedSteps / (totalSteps || 1)) * 100)}% overall completion
          </div>
        </div>

        {/* Velocity Health Status */}
        <div className="bg-[#121417] p-3.5 rounded-xl border border-[#1f2228]">
          <div className="flex items-center justify-between text-[10px] text-[#888e96] uppercase font-bold">
            <span>Forecast Confidence</span>
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-base sm:text-lg font-black text-cyan-400 mt-1">
            {completedSteps > 15 ? 'High (88%)' : completedSteps > 5 ? 'Moderate (74%)' : 'Heuristic (65%)'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {includeWeekends ? '7-Day Calendar' : '5-Day Work Week'}
          </div>
        </div>
      </div>

      {/* VELOCITY ENGINE CONTROLLER BAR */}
      <div className="bg-[#121417] p-4 rounded-xl border border-[#1f2228] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#00ff9d]" />
            <span className="font-bold text-slate-200 uppercase">Velocity Modeler:</span>
            <span className="text-[#888e96]">Adjust pace to simulate different execution scenarios</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Speed Presets */}
            {(
              [
                { id: 'historical', label: `Observed (${historicalVelocity.toFixed(1)}/d)` },
                { id: 'standard', label: 'Standard (2.0/d)' },
                { id: 'sprint', label: 'Sprint (4.5/d)' },
                { id: 'blitz', label: 'AI Blitz (8.0/d)' },
                { id: 'custom', label: 'Custom' },
              ] as { id: typeof velocityMode; label: string }[]
            ).map((m) => (
              <button
                key={m.id}
                onClick={() => setVelocityMode(m.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  velocityMode === m.id
                    ? 'bg-[#00ff9d] text-black shadow-[0_0_8px_rgba(0,255,157,0.3)]'
                    : 'bg-[#08090a] text-[#888e96] hover:text-white border border-[#1f2228]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Velocity Slider (When custom is picked) */}
        {velocityMode === 'custom' && (
          <div className="flex items-center gap-4 bg-[#08090a] p-3 rounded-lg border border-[#1f2228]">
            <span className="text-xs text-slate-300 whitespace-nowrap">
              Custom Daily Velocity: <strong className="text-[#00ff9d]">{customVelocity.toFixed(1)} steps / day</strong>
            </span>
            <input
              type="range"
              min="0.5"
              max="15.0"
              step="0.5"
              value={customVelocity}
              onChange={(e) => setCustomVelocity(parseFloat(e.target.value))}
              className="w-full accent-[#00ff9d] bg-[#121417] rounded-lg h-2"
            />
          </div>
        )}

        {/* Working Day Toggle & Project Start Date Anchor */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#1f2228]/60 text-xs text-[#888e96]">
          <div className="flex items-center gap-3">
            <span>Working Schedule:</span>
            <button
              onClick={() => setIncludeWeekends(!includeWeekends)}
              className={`px-2 py-0.5 rounded text-[11px] font-bold border transition ${
                includeWeekends
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                  : 'bg-[#08090a] text-[#00ff9d] border-[#00ff9d]/30'
              }`}
            >
              {includeWeekends ? '7-Day Week (Weekends Included)' : '5-Day Week (Mon-Fri Only)'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span>Baseline Anchor Date:</span>
            <input
              type="date"
              value={projectStartDate}
              onChange={(e) => setProjectStartDate(e.target.value)}
              className="bg-[#08090a] border border-[#1f2228] text-slate-200 text-[11px] rounded px-2 py-0.5 font-mono focus:border-[#00ff9d] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: INTERACTIVE GANTT HORIZON VIEW */}
      {activeViewMode === 'gantt' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-bold uppercase flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#00ff9d]" /> 10-Phase Horizon & Estimated Finish Milestones
            </span>
            <div className="flex items-center gap-3 text-[11px] text-[#888e96]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#00ff9d]" /> Completed
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" /> In Flight
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm border border-dashed border-slate-400 bg-slate-800" /> Projected
              </span>
            </div>
          </div>

          {/* Gantt Horizon Canvas */}
          <div className="bg-[#121417] p-4 rounded-xl border border-[#1f2228] space-y-3.5 overflow-x-auto">
            
            {/* Timeline Horizon Header with Start, Today, and End */}
            <div className="relative h-6 border-b border-[#1f2228] text-[10px] font-bold text-[#888e96] flex items-center justify-between">
              <span>Start: {formatShortDate(ganttHorizon.start)}</span>
              <div
                className="absolute text-amber-400 flex items-center gap-1 -top-1"
                style={{ left: `${ganttHorizon.todayPosPct}%`, transform: 'translateX(-50%)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                <span>TODAY ({formatShortDate(new Date())})</span>
              </div>
              <span className="text-[#00ff9d]">Projected Finish: {formatShortDate(ganttHorizon.end)}</span>
            </div>

            {/* Phase Bars */}
            <div className="space-y-2.5 relative">
              {/* Vertical "Today" line marker */}
              <div
                className="absolute top-0 bottom-0 w-[1px] bg-amber-400/50 z-10 pointer-events-none border-r border-dashed border-amber-400"
                style={{ left: `${ganttHorizon.todayPosPct}%` }}
              />

              {projectedTimelineData.map((phase) => {
                // Calculate position relative to timeline
                const phaseStartMs = phase.startDate.getTime() - ganttHorizon.start.getTime();
                const phaseDurationMs = Math.max(86400000, phase.finishDate.getTime() - phase.startDate.getTime());
                const leftPct = Math.max(0, Math.min(95, (phaseStartMs / ganttHorizon.totalDurationMs) * 100));
                const widthPct = Math.max(5, Math.min(100 - leftPct, (phaseDurationMs / ganttHorizon.totalDurationMs) * 100));

                return (
                  <div
                    key={phase.id}
                    onClick={() => onSelectPhase && onSelectPhase(phase.id)}
                    className="group bg-[#08090a] p-2.5 rounded-xl border border-[#1f2228] hover:border-[#00ff9d]/50 transition-all cursor-pointer space-y-1.5"
                  >
                    {/* Phase Label & Milestone */}
                    <div className="flex items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: phase.color }}
                        />
                        <span className="font-bold text-white group-hover:text-[#00ff9d] transition-colors truncate">
                          {phase.name}
                        </span>
                        <span className="text-[10px] text-[#888e96] hidden sm:inline truncate">
                          • {phase.milestone}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 text-[10px]">
                        <span className="text-slate-400">
                          {phase.completed}/{phase.total} steps ({phase.progressPct}%)
                        </span>
                        <span className="text-[#00ff9d] font-bold">
                          Est. {formatShortDate(phase.finishDate)}
                        </span>
                      </div>
                    </div>

                    {/* Visual Gantt Bar Track */}
                    <div className="relative w-full h-4 bg-[#121417] rounded-md overflow-hidden border border-[#1f2228]">
                      {/* Sub-bar positioned within overall horizon */}
                      <div
                        className="absolute h-full rounded transition-all duration-500 flex items-center justify-end px-1 text-[9px] font-bold"
                        style={{
                          left: `${leftPct}%`,
                          width: `${widthPct}%`,
                          backgroundColor: phase.isFullyCompleted
                            ? `${phase.color}35`
                            : phase.isInProgress
                            ? `${phase.color}25`
                            : '#1e293b',
                          border: `1px solid ${phase.isFullyCompleted ? phase.color : phase.isInProgress ? '#fbbf24' : '#334155'}`,
                        }}
                      >
                        {/* Progress Fill inside this phase */}
                        <div
                          className="absolute top-0 bottom-0 left-0 rounded"
                          style={{
                            width: `${phase.progressPct}%`,
                            backgroundColor: phase.color,
                            opacity: 0.85,
                          }}
                        />

                        <span className="relative z-10 text-[9px] text-white font-mono drop-shadow px-1">
                          {phase.isFullyCompleted ? '✓ Done' : phase.isInProgress ? `${phase.progressPct}%` : `${phase.durationDays}d`}
                        </span>
                      </div>
                    </div>

                    {/* Date Bounds footer */}
                    <div className="flex items-center justify-between text-[9px] text-slate-500 pt-0.5">
                      <span>Start: {formatDate(phase.startDate)}</span>
                      <span>Target Finish: <strong className="text-slate-300">{formatDate(phase.finishDate)}</strong> ({phase.durationDays} days)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: PHASE ROADMAP & DECISION GATES VIEW */}
      {activeViewMode === 'roadmap' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-300 font-bold uppercase flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#00ff9d]" /> Sequential Execution Pipeline & Decision Gate Dates
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {projectedTimelineData.map((phase) => (
              <div
                key={phase.id}
                onClick={() => onSelectPhase && onSelectPhase(phase.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                  phase.isFullyCompleted
                    ? 'bg-[#00ff9d]/10 border-[#00ff9d]/50'
                    : phase.isInProgress
                    ? 'bg-amber-500/10 border-amber-500/50'
                    : 'bg-[#121417] border-[#1f2228] hover:border-slate-700'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded text-black font-black text-xs"
                      style={{ backgroundColor: phase.color }}
                    >
                      P{phase.index}
                    </span>
                    <span className="font-bold text-white text-xs">{phase.name}</span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      phase.isFullyCompleted
                        ? 'bg-[#00ff9d]/20 text-[#00ff9d] border-[#00ff9d]/40'
                        : phase.isInProgress
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {phase.isFullyCompleted ? 'COMPLETED' : phase.isInProgress ? 'IN PROGRESS' : 'PROJECTED'}
                  </span>
                </div>

                {/* Milestone & Decision Gate */}
                <div className="bg-[#08090a] p-2.5 rounded-lg border border-[#1f2228] text-xs space-y-1">
                  <div className="text-[10px] text-[#888e96] uppercase font-bold">Milestone Objective:</div>
                  <div className="text-slate-200 font-semibold">{phase.milestone}</div>
                </div>

                {/* Date & Effort Breakdown */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#08090a] p-2 rounded-lg border border-[#1f2228]">
                    <span className="text-[10px] text-[#888e96] block uppercase">Est. Start Date</span>
                    <span className="text-slate-300 font-mono">{formatDate(phase.startDate)}</span>
                  </div>

                  <div className="bg-[#08090a] p-2 rounded-lg border border-[#1f2228]">
                    <span className="text-[10px] text-[#888e96] block uppercase">Est. Finish Date</span>
                    <span className="text-[#00ff9d] font-mono font-bold">{formatDate(phase.finishDate)}</span>
                  </div>
                </div>

                {/* Progress Bar & Steps Count */}
                <div className="space-y-1">
                  <div className="w-full h-1.5 bg-[#08090a] rounded-full overflow-hidden border border-[#1f2228]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${phase.progressPct}%`,
                        backgroundColor: phase.color,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#888e96]">
                    <span>Steps: {phase.completed} / {phase.total}</span>
                    <span>{phase.durationDays} Working Days Remaining</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW MODE 3: 3-POINT MONTE CARLO SCENARIOS VIEW */}
      {activeViewMode === 'scenarios' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-300 font-bold uppercase flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" /> 3-Point Velocity Forecast & Confidence Envelope
            </span>
            <span className="text-[10px] text-[#888e96]">Monte Carlo simulated bounds</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* OPTIMISTIC / SPRINT SCENARIO */}
            <div
              onClick={() => setSelectedScenario('optimistic')}
              className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                selectedScenario === 'optimistic'
                  ? 'bg-emerald-500/15 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)] ring-1 ring-emerald-400'
                  : 'bg-[#121417] border-[#1f2228] hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase">Optimistic Scenario</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-500/30">
                  +35% Velocity
                </span>
              </div>

              <div>
                <div className="text-2xl font-black text-white font-mono">
                  {formatDate(scenarioEstimates.best.date)}
                </div>
                <div className="text-xs text-emerald-400 font-bold mt-0.5">
                  Launch in {scenarioEstimates.best.days} days ({scenarioEstimates.best.rate} steps/day)
                </div>
              </div>

              <p className="text-xs text-[#888e96] leading-relaxed">
                Assumes AI automation copilot handling SOP generation, zero blocking dependencies, and rapid approval cycles.
              </p>
            </div>

            {/* NOMINAL / EXPECTED SCENARIO */}
            <div
              onClick={() => setSelectedScenario('nominal')}
              className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                selectedScenario === 'nominal'
                  ? 'bg-[#00ff9d]/15 border-[#00ff9d] shadow-[0_0_15px_rgba(0,255,157,0.25)] ring-1 ring-[#00ff9d]'
                  : 'bg-[#121417] border-[#1f2228] hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#00ff9d] uppercase">Expected (Nominal)</span>
                <span className="text-[10px] bg-[#00ff9d]/20 text-[#00ff9d] px-2 py-0.5 rounded font-bold border border-[#00ff9d]/30">
                  Target Baseline
                </span>
              </div>

              <div>
                <div className="text-2xl font-black text-white font-mono">
                  {formatDate(scenarioEstimates.nominal.date)}
                </div>
                <div className="text-xs text-[#00ff9d] font-bold mt-0.5">
                  Launch in {scenarioEstimates.nominal.days} days ({scenarioEstimates.nominal.rate} steps/day)
                </div>
              </div>

              <p className="text-xs text-[#888e96] leading-relaxed">
                Based on measured historical cadence with standard validation checks and normal review turnaround times.
              </p>
            </div>

            {/* PESSIMISTIC / CONSERVATIVE SCENARIO */}
            <div
              onClick={() => setSelectedScenario('pessimistic')}
              className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                selectedScenario === 'pessimistic'
                  ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.25)] ring-1 ring-amber-400'
                  : 'bg-[#121417] border-[#1f2228] hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase">Conservative (Buffer)</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold border border-amber-500/30">
                  -30% Velocity
                </span>
              </div>

              <div>
                <div className="text-2xl font-black text-white font-mono">
                  {formatDate(scenarioEstimates.worst.date)}
                </div>
                <div className="text-xs text-amber-400 font-bold mt-0.5">
                  Launch in {scenarioEstimates.worst.days} days ({scenarioEstimates.worst.rate} steps/day)
                </div>
              </div>

              <p className="text-xs text-[#888e96] leading-relaxed">
                Accounts for regulatory delays, grant filing review backlogs, and multi-stakeholder feedback iterations.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* FOOTER INFORMATIONAL NOTE */}
      <div className="bg-[#121417] p-3.5 rounded-xl border border-[#1f2228] flex items-center justify-between text-xs text-[#888e96]">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#00ff9d] shrink-0" />
          <span>
            Projections dynamically re-estimate in real-time as steps are marked <span className="text-emerald-400 font-bold">Completed</span> or <span className="text-amber-400 font-bold">In Progress</span> in the Lifecycle step tracker.
          </span>
        </div>
        <div className="text-[10px] text-slate-400 shrink-0 font-bold hidden sm:block">
          145 Step Lifecycle Engine
        </div>
      </div>

    </div>
  );
};
