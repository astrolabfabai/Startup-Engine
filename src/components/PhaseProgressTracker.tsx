import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { StartupPhase } from '../types';
import {
  CheckCircle2,
  Clock,
  Target,
  BarChart3,
  Sparkles,
  PieChart as PieChartIcon,
  Filter,
  Layers,
  ChevronRight,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { ProjectedTimeline } from './ProjectedTimeline';

interface PhaseProgressTrackerProps {
  phases: StartupPhase[];
  selectedPhaseId: string;
  onSelectPhase: (phaseId: string) => void;
}

// 10 Distinct neon theme colors for the 10 phases
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

export const PhaseProgressTracker: React.FC<PhaseProgressTrackerProps> = ({
  phases,
  selectedPhaseId,
  onSelectPhase,
}) => {
  const [activeTab, setActiveTab] = useState<'ring' | 'phases' | 'timeline'>('ring');
  const [hoveredPhase, setHoveredPhase] = useState<string | null>(null);

  // Overall totals across all 145 steps
  const allSteps = phases.flatMap((p) => p.steps);
  const totalStepsCount = allSteps.length;
  const totalCompletedCount = allSteps.filter((s) => s.status === 'completed').length;
  const totalInProgressCount = allSteps.filter((s) => s.status === 'in_progress').length;
  const totalPendingCount = allSteps.filter((s) => s.status === 'pending' || s.status === 'skipped').length;
  const overallPercentage = totalStepsCount > 0 
    ? Math.round((totalCompletedCount / totalStepsCount) * 100) 
    : 0;

  // Process data for each of the 10 phases
  const phaseStats = phases.map((phase, idx) => {
    const total = phase.steps.length;
    const completed = phase.steps.filter((s) => s.status === 'completed').length;
    const inProgress = phase.steps.filter((s) => s.status === 'in_progress').length;
    const pending = total - completed - inProgress;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Extract short clean title
    const cleanTitle = phase.phase_name.includes(':')
      ? phase.phase_name.split(':')[1].trim()
      : phase.phase_name;

    return {
      id: phase.phase_id,
      index: idx + 1,
      phaseName: `P${idx + 1}: ${cleanTitle}`,
      fullName: phase.phase_name,
      total,
      completed,
      inProgress,
      pending,
      pct,
      color: PHASE_COLORS[idx % PHASE_COLORS.length],
    };
  });

  // Recharts Data - Outer Donut Ring (Phase Completed Weight / Step Count)
  const outerRingData = phaseStats.map((p) => ({
    name: p.phaseName,
    fullName: p.fullName,
    phaseId: p.id,
    value: p.total,
    completed: p.completed,
    pct: p.pct,
    color: p.color,
  }));

  // Recharts Data - Inner Ring (Overall Status Breakdown)
  const innerRingData = [
    { name: 'Completed Steps', value: totalCompletedCount || 1, color: '#00ff9d', isActual: totalCompletedCount > 0 },
    { name: 'In Progress', value: totalInProgressCount || (totalCompletedCount === 0 ? 0 : 0.1), color: '#fbbf24', isActual: totalInProgressCount > 0 },
    { name: 'Pending', value: totalPendingCount || 1, color: '#1e293b', isActual: totalPendingCount > 0 },
  ];

  // Custom Recharts Tooltip Component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#08090a] border border-[#00ff9d]/40 p-3 rounded-xl shadow-2xl font-mono text-xs text-white space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-[#00ff9d]">
            <Sparkles className="w-3.5 h-3.5" />
            {data.fullName || data.name}
          </div>
          {data.pct !== undefined ? (
            <>
              <div className="text-slate-300">
                Completed: <strong className="text-[#00ff9d]">{data.completed} / {data.value} steps</strong>
              </div>
              <div className="text-amber-400 font-bold">
                Completion: {data.pct}%
              </div>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-[#1f2228]">
                Click slice to filter steps
              </div>
            </>
          ) : (
            <div className="text-slate-300">
              Count: <strong>{data.value} steps</strong>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#08090a] p-5 rounded-2xl border border-[#00ff9d]/30 font-mono text-slate-100 space-y-5 shadow-2xl relative overflow-hidden">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1f2228] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00ff9d]/10 border border-[#00ff9d]/30 flex items-center justify-center text-[#00ff9d]">
            <PieChartIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                10-Phase Lifecycle Ring Progress Tracker
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#00ff9d]/20 text-[#00ff9d] border border-[#00ff9d]/30">
                Live Recharts Engine
              </span>
            </div>
            <p className="text-xs text-[#888e96] mt-0.5">
              Visual completion breakdown across all 10 startup execution phases (145 steps)
            </p>
          </div>
        </div>

        {/* View Toggle Buttons & Clear Filter */}
        <div className="flex items-center gap-2">
          {selectedPhaseId !== 'all' && (
            <button
              onClick={() => onSelectPhase('all')}
              className="px-3 py-1.5 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-400 hover:text-black transition-all"
            >
              <Filter className="w-3.5 h-3.5" /> Showing Filtered Phase (Reset)
            </button>
          )}

          <div className="flex bg-[#121417] p-1 rounded-xl border border-[#1f2228]">
            <button
              onClick={() => setActiveTab('ring')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'ring'
                  ? 'bg-[#00ff9d] text-black shadow-[0_0_12px_rgba(0,255,157,0.3)]'
                  : 'text-[#888e96] hover:text-white'
              }`}
            >
              <PieChartIcon className="w-3.5 h-3.5" /> Ring Chart
            </button>
            <button
              onClick={() => setActiveTab('phases')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'phases'
                  ? 'bg-[#00ff9d] text-black shadow-[0_0_12px_rgba(0,255,157,0.3)]'
                  : 'text-[#888e96] hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> 10-Phase Grid
            </button>
            <button
              id="btn-tracker-timeline-view"
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'timeline'
                  ? 'bg-[#00ff9d] text-black shadow-[0_0_12px_rgba(0,255,157,0.3)]'
                  : 'text-[#888e96] hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Projected Timeline
            </button>
          </div>
        </div>
      </div>

      {/* OVERALL METRICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#121417] p-3.5 rounded-xl border border-[#1f2228] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#888e96] uppercase block font-bold">Overall Progress</span>
            <div className="text-xl font-bold text-[#00ff9d] font-mono mt-0.5">
              {overallPercentage}%
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-[#00ff9d]/10 border border-[#00ff9d]/30 flex items-center justify-center text-[#00ff9d]">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-[#121417] p-3.5 rounded-xl border border-[#1f2228] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#888e96] uppercase block font-bold">Completed Steps</span>
            <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">
              {totalCompletedCount} <span className="text-xs text-slate-500">/ {totalStepsCount}</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-[#121417] p-3.5 rounded-xl border border-[#1f2228] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#888e96] uppercase block font-bold">In Progress</span>
            <div className="text-xl font-bold text-amber-400 font-mono mt-0.5">
              {totalInProgressCount}
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-[#121417] p-3.5 rounded-xl border border-[#1f2228] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#888e96] uppercase block font-bold">Pending Steps</span>
            <div className="text-xl font-bold text-slate-400 font-mono mt-0.5">
              {totalPendingCount}
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
            <Target className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: RECHARTS DUAL CONCENTRIC RING CHART */}
      {activeTab === 'ring' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Ring Chart Centerpiece */}
          <div className="lg:col-span-6 h-72 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                
                {/* INNER RING: Overall Status Breakdown */}
                <Pie
                  data={innerRingData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                >
                  {innerRingData.map((entry, index) => (
                    <Cell key={`inner-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>

                {/* OUTER RING: 10 Startup Phases */}
                <Pie
                  data={outerRingData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={85}
                  outerRadius={115}
                  paddingAngle={2}
                  startAngle={90}
                  endAngle={-270}
                  stroke="#08090a"
                  strokeWidth={2}
                  cursor="pointer"
                  onClick={(entry: any) => {
                    if (entry && entry.phaseId) {
                      onSelectPhase(entry.phaseId);
                    }
                  }}
                  onMouseEnter={(entry: any) => {
                    if (entry && entry.phaseId) {
                      setHoveredPhase(entry.phaseId);
                    }
                  }}
                  onMouseLeave={() => setHoveredPhase(null)}
                >
                  {outerRingData.map((entry) => {
                    const isSelected = selectedPhaseId === entry.phaseId;
                    const isHovered = hoveredPhase === entry.phaseId;
                    return (
                      <Cell
                        key={`outer-cell-${entry.phaseId}`}
                        fill={entry.color}
                        opacity={
                          selectedPhaseId === 'all'
                            ? isHovered ? 1 : 0.85
                            : isSelected ? 1 : 0.35
                        }
                        stroke={isSelected ? '#00ff9d' : '#08090a'}
                        strokeWidth={isSelected ? 3 : 1}
                      />
                    );
                  })}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* CENTER OVERLAY BADGE */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-bold text-[#888e96] uppercase tracking-wider">
                Lifecycle
              </span>
              <div className="text-2xl font-black text-[#00ff9d] font-mono">
                {overallPercentage}%
              </div>
              <span className="text-[9px] text-slate-400">
                {totalCompletedCount}/{totalStepsCount} Done
              </span>
            </div>
          </div>

          {/* 10-Phase Legend & Quick Selector */}
          <div className="lg:col-span-6 space-y-2">
            <div className="text-xs font-bold text-slate-300 uppercase flex items-center justify-between pb-1 border-b border-[#1f2228]">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#00ff9d]" /> 10 Phases Breakdown:
              </span>
              <span className="text-[10px] text-[#888e96]">Click slice/badge to filter</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
              {phaseStats.map((p) => {
                const isSelected = selectedPhaseId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => onSelectPhase(p.id)}
                    className={`p-2 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-[#00ff9d]/20 border-[#00ff9d] text-white shadow-[0_0_12px_rgba(0,255,157,0.2)]'
                        : 'bg-[#121417] border-[#1f2228] text-slate-300 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: p.color }}
                      />
                      <span className="font-semibold truncate">{p.phaseName}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 text-[10px]">
                      <span className="text-[#888e96]">
                        {p.completed}/{p.total}
                      </span>
                      <span
                        className="font-mono font-bold px-1.5 py-0.2 rounded"
                        style={{
                          backgroundColor: `${p.color}20`,
                          color: p.color,
                        }}
                      >
                        {p.pct}%
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* VIEW MODE 2: FULL 10-PHASE GRID CARDS */}
      {activeTab === 'phases' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {phaseStats.map((p) => {
            const isSelected = selectedPhaseId === p.id;
            return (
              <div
                key={p.id}
                onClick={() => onSelectPhase(p.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-2.5 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#00ff9d]/15 border-[#00ff9d] text-white shadow-[0_0_15px_rgba(0,255,157,0.2)]'
                    : 'bg-[#121417] border-[#1f2228] text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-[#888e96] mb-1">
                    <span
                      className="px-1.5 py-0.5 rounded text-black font-black"
                      style={{ backgroundColor: p.color }}
                    >
                      P{p.index}
                    </span>
                    <span className="font-mono text-[#00ff9d]">{p.pct}% Done</span>
                  </div>

                  <h3 className="text-xs font-bold text-white line-clamp-2">
                    {p.fullName}
                  </h3>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full h-1.5 bg-[#08090a] rounded-full overflow-hidden border border-[#1f2228]">
                    <div
                      className="h-full transition-all duration-500 rounded-full"
                      style={{
                        width: `${p.pct}%`,
                        backgroundColor: p.color,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#888e96]">
                    <span>Steps: {p.completed} / {p.total}</span>
                    <ChevronRight className="w-3 h-3 text-slate-500" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 3: PROJECTED TIMELINE & VELOCITY ENGINE */}
      {activeTab === 'timeline' && (
        <div className="pt-2">
          <ProjectedTimeline
            phases={phases}
            onSelectPhase={onSelectPhase}
          />
        </div>
      )}

    </div>
  );
};
