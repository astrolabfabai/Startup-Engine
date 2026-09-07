import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import {
  StartupPhase,
  StartupStep,
  StepStatus,
} from '../types';
import {
  computeStepBlockStatus,
  getAllDependencyLinks,
  getTopBottlenecks,
  StepBlockStatus,
} from '../services/stepDependencies';
import {
  Network,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Flame,
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  Check,
  X,
  Sliders,
  Filter,
  Eye,
  Crosshair,
  GitFork,
  CheckSquare,
} from 'lucide-react';

interface LifecycleMiniMapProps {
  phases: StartupPhase[];
  onSelectStep?: (step: StartupStep) => void;
  onUpdateStepStatus?: (stepNumber: number, newStatus: StepStatus) => void;
  selectedStepNumber?: number | null;
  onOpenStepModal?: (step: StartupStep) => void;
}

// 10 Distinct Phase Theme Colors
const PHASE_THEME_COLORS = [
  '#00ff9d', // Phase 1: Neon Emerald
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

interface NodeDatum extends d3.SimulationNodeDatum {
  id: number;
  step: StartupStep;
  phaseIndex: number;
  phaseName: string;
  blockStatus: StepBlockStatus;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

interface LinkDatum extends d3.SimulationLinkDatum<NodeDatum> {
  source: NodeDatum | number;
  target: NodeDatum | number;
  isSatisfied: boolean;
}

export const LifecycleMiniMap: React.FC<LifecycleMiniMapProps> = ({
  phases,
  onSelectStep,
  onUpdateStepStatus,
  selectedStepNumber,
  onOpenStepModal,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [activeViewMode, setActiveViewMode] = useState<'matrix' | 'network' | 'bottlenecks'>('matrix');
  const [internalSelectedStep, setInternalSelectedStep] = useState<number>(selectedStepNumber || 1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all'); // all, blocked, ready, in_progress, completed, bottleneck
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<number | 'all'>('all');
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  // Sync external selected step
  useEffect(() => {
    if (selectedStepNumber && selectedStepNumber !== internalSelectedStep) {
      setInternalSelectedStep(selectedStepNumber);
    }
  }, [selectedStepNumber]);

  // Flatten all steps
  const allSteps = useMemo(() => phases.flatMap((p) => p.steps), [phases]);

  // Map step number to step object
  const stepMap = useMemo(() => {
    const map = new Map<number, StartupStep>();
    allSteps.forEach((s) => map.set(s.step, s));
    return map;
  }, [allSteps]);

  // Compute live block statuses for all steps
  const blockStatusMap = useMemo(() => {
    const map = new Map<number, StepBlockStatus>();
    allSteps.forEach((s) => {
      map.set(s.step, computeStepBlockStatus(s.step, allSteps));
    });
    return map;
  }, [allSteps]);

  // Currently focused step data
  const currentStep = useMemo(() => stepMap.get(internalSelectedStep) || allSteps[0], [stepMap, internalSelectedStep, allSteps]);
  const currentBlockStatus = useMemo(() => blockStatusMap.get(internalSelectedStep) || computeStepBlockStatus(internalSelectedStep, allSteps), [blockStatusMap, internalSelectedStep, allSteps]);

  // Top bottlenecks list
  const topBottlenecks = useMemo(() => getTopBottlenecks(allSteps, 8), [allSteps]);

  // All dependency links
  const dependencyLinks = useMemo(() => getAllDependencyLinks(allSteps), [allSteps]);

  // Stats calculation
  const totalCompleted = useMemo(() => allSteps.filter((s) => s.status === 'completed').length, [allSteps]);
  const totalBlocked = useMemo(() => allSteps.filter((s) => s.status !== 'completed' && (blockStatusMap.get(s.step)?.isBlocked ?? false)).length, [allSteps, blockStatusMap]);
  const totalReady = useMemo(() => allSteps.filter((s) => s.status !== 'completed' && !(blockStatusMap.get(s.step)?.isBlocked ?? false)).length, [allSteps, blockStatusMap]);

  // Handle select step
  const handleSelectStep = useCallback((stepNum: number) => {
    setInternalSelectedStep(stepNum);
    const targetStep = stepMap.get(stepNum);
    if (targetStep && onSelectStep) {
      onSelectStep(targetStep);
    }
  }, [stepMap, onSelectStep]);

  // Toggle status of a step
  const handleToggleStatus = (stepNum: number) => {
    const step = stepMap.get(stepNum);
    if (!step || !onUpdateStepStatus) return;

    let nextStatus: StepStatus = 'in_progress';
    if (step.status === 'pending') nextStatus = 'in_progress';
    else if (step.status === 'in_progress') nextStatus = 'completed';
    else if (step.status === 'completed') nextStatus = 'pending';
    else nextStatus = 'pending';

    onUpdateStepStatus(stepNum, nextStatus);
  };

  // SVG D3 Network Renderer
  useEffect(() => {
    if (!svgRef.current || !containerRef.current || activeViewMode !== 'network') return;

    const width = containerRef.current.clientWidth || 900;
    const height = 560;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg.attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', height);

    // Definitions for markers (arrows & filters)
    const defs = svg.append('defs');

    // Arrow marker satisfied
    defs.append('marker')
      .attr('id', 'arrow-satisfied')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 22)
      .attr('refY', 0)
      .attr('markerWidth', 5)
      .attr('markerHeight', 5)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-4L8,0L0,4')
      .attr('fill', '#00ff9d');

    // Arrow marker blocked/pending
    defs.append('marker')
      .attr('id', 'arrow-blocked')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 22)
      .attr('refY', 0)
      .attr('markerWidth', 5)
      .attr('markerHeight', 5)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-4L8,0L0,4')
      .attr('fill', '#f43f5e');

    // Arrow marker default
    defs.append('marker')
      .attr('id', 'arrow-default')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('markerWidth', 4)
      .attr('markerHeight', 4)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-4L8,0L0,4')
      .attr('fill', '#475569');

    // Zoom container
    const g = svg.append('g').attr('class', 'main-zoom-group');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3.5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Prepare Node and Link data
    const nodes: NodeDatum[] = allSteps.map((step) => {
      const pIndex = phases.findIndex((p) => p.phase_id === step.phase_id);
      const bStatus = blockStatusMap.get(step.step) || computeStepBlockStatus(step.step, allSteps);
      
      // Position nodes in initial column lanes across phases
      const laneWidth = (width - 120) / 10;
      const initialX = 60 + pIndex * laneWidth + (Math.random() * 20 - 10);
      const stepInPhase = (step.step - 1) % 15;
      const initialY = 60 + (stepInPhase / 15) * (height - 120) + (Math.random() * 20 - 10);

      return {
        id: step.step,
        step,
        phaseIndex: pIndex >= 0 ? pIndex : 0,
        phaseName: step.phase_name,
        blockStatus: bStatus,
        x: initialX,
        y: initialY,
      };
    });

    const nodeById = new Map<number, NodeDatum>(nodes.map((d) => [d.id, d]));

    const links: LinkDatum[] = dependencyLinks
      .filter((l) => nodeById.has(l.source) && nodeById.has(l.target))
      .map((l) => ({
        source: nodeById.get(l.source)!,
        target: nodeById.get(l.target)!,
        isSatisfied: l.isSatisfied,
      }));

    // D3 Simulation
    const simulation = d3.forceSimulation<NodeDatum>(nodes)
      .force('link', d3.forceLink<NodeDatum, LinkDatum>(links).id((d) => d.id).distance(45).strength(0.3))
      .force('charge', d3.forceManyBody().strength(-90).distanceMax(250))
      .force('x', d3.forceX<NodeDatum>((d) => 70 + d.phaseIndex * ((width - 140) / 9)).strength(0.85))
      .force('y', d3.forceY(height / 2).strength(0.12))
      .force('collision', d3.forceCollide().radius(16).strength(0.7));

    // Draw Links
    const linkGroup = g.append('g').attr('class', 'links-layer');
    const linkElements = linkGroup.selectAll<SVGPathElement, LinkDatum>('path')
      .data(links)
      .enter()
      .append('path')
      .attr('fill', 'none')
      .attr('stroke-width', (d) => {
        const srcId = typeof d.source === 'object' ? d.source.id : d.source;
        const tgtId = typeof d.target === 'object' ? d.target.id : d.target;
        if (srcId === internalSelectedStep || tgtId === internalSelectedStep) return 2.5;
        return 1.2;
      })
      .attr('stroke', (d) => {
        const srcId = typeof d.source === 'object' ? d.source.id : d.source;
        const tgtId = typeof d.target === 'object' ? d.target.id : d.target;
        if (tgtId === internalSelectedStep) {
          return d.isSatisfied ? '#00ff9d' : '#f43f5e';
        }
        if (srcId === internalSelectedStep) {
          return '#38bdf8';
        }
        return d.isSatisfied ? 'rgba(0, 255, 157, 0.2)' : 'rgba(100, 116, 139, 0.25)';
      })
      .attr('stroke-dasharray', (d) => (d.isSatisfied ? 'none' : '3,3'))
      .attr('marker-end', (d) => {
        const tgtId = typeof d.target === 'object' ? d.target.id : d.target;
        if (tgtId === internalSelectedStep) {
          return d.isSatisfied ? 'url(#arrow-satisfied)' : 'url(#arrow-blocked)';
        }
        return 'url(#arrow-default)';
      })
      .attr('opacity', (d) => {
        const srcId = typeof d.source === 'object' ? d.source.id : d.source;
        const tgtId = typeof d.target === 'object' ? d.target.id : d.target;
        if (!internalSelectedStep) return 0.5;
        if (srcId === internalSelectedStep || tgtId === internalSelectedStep) return 1.0;
        return 0.15;
      });

    // Draw Nodes
    const nodeGroup = g.append('g').attr('class', 'nodes-layer');
    const nodeElements = nodeGroup.selectAll<SVGGElement, NodeDatum>('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('cursor', 'pointer')
      .on('click', (_, d) => {
        handleSelectStep(d.id);
      })
      .on('mouseenter', (_, d) => {
        setHoveredStep(d.id);
      })
      .on('mouseleave', () => {
        setHoveredStep(null);
      });

    // Drag behavior
    const drag = d3.drag<SVGGElement, NodeDatum>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    nodeElements.call(drag);

    // Node outer ring / halo for selected & bottlenecks
    nodeElements.append('circle')
      .attr('r', (d) => (d.id === internalSelectedStep ? 18 : d.blockStatus.isBottleneck ? 14 : 11))
      .attr('fill', (d) => {
        if (d.id === internalSelectedStep) return 'rgba(0, 255, 157, 0.2)';
        if (d.blockStatus.isBottleneck) return 'rgba(244, 63, 94, 0.18)';
        return 'transparent';
      })
      .attr('stroke', (d) => {
        if (d.id === internalSelectedStep) return '#00ff9d';
        if (d.blockStatus.isBottleneck) return '#f43f5e';
        return 'transparent';
      })
      .attr('stroke-width', (d) => (d.id === internalSelectedStep ? 2 : 1))
      .attr('stroke-dasharray', (d) => (d.blockStatus.isBottleneck && d.id !== internalSelectedStep ? '2,2' : 'none'));

    // Node Main Core Circle
    nodeElements.append('circle')
      .attr('r', 10)
      .attr('fill', (d) => {
        if (d.step.status === 'completed') return '#00ff9d';
        if (d.step.status === 'in_progress') return '#fbbf24';
        if (d.blockStatus.isBlocked) return '#1e293b';
        return '#0f172a';
      })
      .attr('stroke', (d) => {
        if (d.step.status === 'completed') return '#059669';
        if (d.step.status === 'in_progress') return '#d97706';
        if (d.blockStatus.isBlocked) return '#f43f5e';
        return PHASE_THEME_COLORS[d.phaseIndex] || '#38bdf8';
      })
      .attr('stroke-width', 2);

    // Node Step Number Label
    nodeElements.append('text')
      .text((d) => d.id)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', '9px')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('font-weight', 'bold')
      .attr('fill', (d) => {
        if (d.step.status === 'completed') return '#052e16';
        if (d.step.status === 'in_progress') return '#451a03';
        return '#e2e8f0';
      });

    // Tick update
    simulation.on('tick', () => {
      linkElements.attr('d', (d) => {
        const src = d.source as NodeDatum;
        const tgt = d.target as NodeDatum;
        const dx = tgt.x! - src.x!;
        const dy = tgt.y! - src.y!;
        const dr = Math.sqrt(dx * dx + dy * dy) * 1.2;
        return `M${src.x},${src.y}A${dr},${dr} 0 0,1 ${tgt.x},${tgt.y}`;
      });

      nodeElements.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [activeViewMode, allSteps, dependencyLinks, internalSelectedStep, phases, blockStatusMap, handleSelectStep]);

  // Filtered steps for Matrix view
  const displayMatrixSteps = useMemo(() => {
    return allSteps.filter((step) => {
      const bStatus = blockStatusMap.get(step.step);

      if (selectedPhaseFilter !== 'all') {
        const pIndex = phases.findIndex((p) => p.phase_id === step.phase_id);
        if (pIndex !== selectedPhaseFilter) return false;
      }

      if (filterStatus === 'completed' && step.status !== 'completed') return false;
      if (filterStatus === 'in_progress' && step.status !== 'in_progress') return false;
      if (filterStatus === 'blocked' && (step.status === 'completed' || !bStatus?.isBlocked)) return false;
      if (filterStatus === 'ready' && (step.status === 'completed' || bStatus?.isBlocked)) return false;
      if (filterStatus === 'bottleneck' && !bStatus?.isBottleneck) return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchNum = step.step.toString().includes(q);
        const matchName = step.name.toLowerCase().includes(q);
        const matchPhase = step.phase_name.toLowerCase().includes(q);
        if (!matchNum && !matchName && !matchPhase) return false;
      }

      return true;
    });
  }, [allSteps, blockStatusMap, selectedPhaseFilter, filterStatus, searchQuery, phases]);

  return (
    <div className="bg-[#0e1116] border border-[#1f2228] rounded-2xl overflow-hidden shadow-2xl flex flex-col mb-6">
      
      {/* Top Header & Navigation Bar */}
      <div className="p-4 sm:px-6 bg-[#08090a] border-b border-[#1f2228] flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#00ff9d]/10 border border-[#00ff9d]/30 text-[#00ff9d] shadow-[0_0_12px_rgba(0,255,157,0.2)]">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                Lifecycle Step Mini-Map & Dependency Network
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30">
                145 Steps Linked
              </span>
            </div>
            <p className="text-xs text-[#888e96] mt-0.5">
              Visualize prerequisite gating, upstream blockers, downstream unlocks, and execution velocity bottlenecks across all 10 phases.
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#121417] border border-[#1f2228] rounded-xl font-mono text-xs">
          <button
            onClick={() => setActiveViewMode('matrix')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeViewMode === 'matrix'
                ? 'bg-[#00ff9d] text-black shadow-[0_0_8px_rgba(0,255,157,0.3)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Phase Grid (145)</span>
          </button>

          <button
            onClick={() => setActiveViewMode('network')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeViewMode === 'network'
                ? 'bg-[#00ff9d] text-black shadow-[0_0_8px_rgba(0,255,157,0.3)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>D3 Topology DAG</span>
          </button>

          <button
            onClick={() => setActiveViewMode('bottlenecks')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeViewMode === 'bottlenecks'
                ? 'bg-[#00ff9d] text-black shadow-[0_0_8px_rgba(0,255,157,0.3)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>Bottlenecks ({topBottlenecks.length})</span>
          </button>
        </div>

      </div>

      {/* Filter & Metric Summary Bar */}
      <div className="p-3 sm:px-6 bg-[#0a0d11] border-b border-[#1f2228] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        
        {/* Search & Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#888e96] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search step #, name, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#121417] border border-[#1f2228] focus:border-[#00ff9d] rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder:text-slate-500 focus:outline-none w-48 sm:w-60"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 bg-[#121417] border border-[#1f2228] rounded-lg p-0.5">
            {[
              { id: 'all', label: 'All (145)' },
              { id: 'ready', label: `Ready (${totalReady})`, color: 'text-cyan-400' },
              { id: 'blocked', label: `Blocked (${totalBlocked})`, color: 'text-rose-400' },
              { id: 'in_progress', label: 'In Progress', color: 'text-amber-400' },
              { id: 'completed', label: `Done (${totalCompleted})`, color: 'text-[#00ff9d]' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setFilterStatus(st.id)}
                className={`px-2 py-1 rounded-md text-[11px] transition-colors ${
                  filterStatus === st.id
                    ? 'bg-[#1f2228] text-white font-bold'
                    : 'text-[#888e96] hover:text-white'
                }`}
              >
                <span className={st.color}>{st.label}</span>
              </button>
            ))}
          </div>

        </div>

        {/* Phase Filter Quick Pills */}
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          <button
            onClick={() => setSelectedPhaseFilter('all')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
              selectedPhaseFilter === 'all'
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            All Phases
          </button>
          {phases.map((p, idx) => (
            <button
              key={p.phase_id}
              onClick={() => setSelectedPhaseFilter(selectedPhaseFilter === idx ? 'all' : idx)}
              style={{
                borderColor: selectedPhaseFilter === idx ? PHASE_THEME_COLORS[idx] : undefined,
                color: selectedPhaseFilter === idx ? PHASE_THEME_COLORS[idx] : undefined,
              }}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                selectedPhaseFilter === idx
                  ? 'bg-white/5 border-current'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
              title={p.phase_name}
            >
              P{idx + 1}
            </button>
          ))}
        </div>

      </div>

      {/* Main Interactive Stage */}
      <div className="flex flex-col lg:flex-row min-h-[500px] max-h-[750px]">
        
        {/* Left/Top Interactive Visualization Canvas */}
        <div
          ref={containerRef}
          className="flex-1 bg-[#0a0c0f] relative overflow-hidden flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#1f2228]"
        >
          {/* VIEW MODE 1: COMPACT PHASE GRID & BEZIER CONNECTIONS */}
          {activeViewMode === 'matrix' && (
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
              
              {/* Legend & Summary Info */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[#888e96] bg-[#121417]/80 p-2.5 rounded-xl border border-[#1f2228]">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00ff9d] inline-block shadow-[0_0_6px_#00ff9d]" /> Completed
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block shadow-[0_0_6px_#fbbf24]" /> In Progress
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block border border-cyan-400/50" /> Ready to Execute
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block shadow-[0_0_6px_#f43f5e]" /> Blocked (Missing Prereq)
                  </span>
                </div>
                <div className="text-slate-400">
                  Click any micro-node to inspect blocking upstream & downstream relationships.
                </div>
              </div>

              {/* 10 Phase Horizontal Lanes with Micro-Nodes */}
              <div className="space-y-2.5">
                {phases.map((phase, pIdx) => {
                  if (selectedPhaseFilter !== 'all' && selectedPhaseFilter !== pIdx) return null;
                  
                  const phaseColor = PHASE_THEME_COLORS[pIdx] || '#38bdf8';
                  const phaseSteps = phase.steps;
                  const completedInPhase = phaseSteps.filter((s) => s.status === 'completed').length;
                  const percentInPhase = Math.round((completedInPhase / phaseSteps.length) * 100);

                  return (
                    <div
                      key={phase.phase_id}
                      className="p-3 rounded-xl bg-[#121417] border border-[#1f2228] hover:border-slate-700 transition-all space-y-2"
                    >
                      {/* Phase Header Line */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: phaseColor, boxShadow: `0 0 8px ${phaseColor}` }}
                          />
                          <h4 className="text-xs font-bold text-white tracking-tight truncate">
                            {phase.phase_name}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 text-[10px] font-mono text-[#888e96]">
                          <span>{completedInPhase}/{phaseSteps.length} Steps</span>
                          <span style={{ color: phaseColor }} className="font-bold">({percentInPhase}%)</span>
                        </div>
                      </div>

                      {/* Micro-nodes Row */}
                      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-15 gap-1.5">
                        {phaseSteps.map((st) => {
                          const isSelected = st.step === internalSelectedStep;
                          const bStatus = blockStatusMap.get(st.step);
                          const isBlocked = st.status !== 'completed' && (bStatus?.isBlocked ?? false);
                          const isReady = st.status !== 'completed' && !isBlocked;
                          const isPrereqOfSelected = currentBlockStatus.unmetPrereqs.some((p) => p.step === st.step) || currentBlockStatus.metPrereqs.some((p) => p.step === st.step);
                          const isDownstreamOfSelected = currentBlockStatus.downstreamSteps.some((d) => d.step === st.step);

                          let statusBg = 'bg-[#08090a]';
                          let statusBorder = 'border-[#1f2228]';
                          let statusText = 'text-slate-400';

                          if (st.status === 'completed') {
                            statusBg = 'bg-[#00ff9d]/20';
                            statusBorder = 'border-[#00ff9d]';
                            statusText = 'text-[#00ff9d] font-bold';
                          } else if (st.status === 'in_progress') {
                            statusBg = 'bg-amber-500/20';
                            statusBorder = 'border-amber-400';
                            statusText = 'text-amber-400 font-bold';
                          } else if (isBlocked) {
                            statusBg = 'bg-rose-950/30';
                            statusBorder = 'border-rose-500/50';
                            statusText = 'text-rose-400';
                          } else if (isReady) {
                            statusBg = 'bg-cyan-950/30';
                            statusBorder = 'border-cyan-500/50';
                            statusText = 'text-cyan-300';
                          }

                          return (
                            <button
                              key={st.step}
                              onClick={() => handleSelectStep(st.step)}
                              onMouseEnter={() => setHoveredStep(st.step)}
                              onMouseLeave={() => setHoveredStep(null)}
                              className={`p-1.5 rounded-lg border text-[11px] font-mono transition-all flex flex-col items-center justify-center relative select-none ${statusBg} ${statusBorder} ${
                                isSelected
                                  ? 'ring-2 ring-[#00ff9d] scale-105 shadow-[0_0_12px_rgba(0,255,157,0.4)] z-10'
                                  : isPrereqOfSelected
                                  ? 'ring-2 ring-amber-400/80 animate-pulse'
                                  : isDownstreamOfSelected
                                  ? 'ring-2 ring-cyan-400/80'
                                  : 'hover:scale-102 hover:border-slate-500'
                              }`}
                              title={`Step #${st.step}: ${st.name} (${st.status})`}
                            >
                              <span className={statusText}>#{st.step}</span>
                              
                              {/* Bottleneck Marker */}
                              {bStatus?.isBottleneck && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_4px_#f43f5e]" />
                              )}

                              {/* Selected Pointer */}
                              {isSelected && (
                                <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#00ff9d]" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* VIEW MODE 2: D3 TOPOLOGY DAG CANVAS */}
          {activeViewMode === 'network' && (
            <div className="relative w-full h-full flex-1 flex flex-col">
              <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
              
              {/* Bottom Floating Canvas Overlay Controls */}
              <div className="absolute bottom-3 left-3 bg-[#121417]/90 backdrop-blur-md border border-[#1f2228] rounded-xl p-2 flex items-center gap-2 text-xs font-mono text-[#888e96]">
                <span>Pan: <strong className="text-white">Click + Drag</strong></span>
                <span className="text-slate-600">|</span>
                <span>Zoom: <strong className="text-white">Scroll Wheel</strong></span>
                <span className="text-slate-600">|</span>
                <span>Pins: <strong className="text-white">Drag Nodes</strong></span>
              </div>
            </div>
          )}

          {/* VIEW MODE 3: CRITICAL BOTTLENECK RADAR */}
          {activeViewMode === 'bottlenecks' && (
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
              <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/40 text-rose-200 text-xs font-mono space-y-1">
                <div className="flex items-center gap-2 font-bold text-rose-400">
                  <Flame className="w-4 h-4" /> Startup Bottleneck Velocity Engine
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  The steps below currently block the highest number of downstream tasks. Completing these high-leverage steps unlocks maximum lifecycle execution speed.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {topBottlenecks.map(({ step, blockStatus }, rank) => {
                  const pIndex = phases.findIndex((p) => p.phase_id === step.phase_id);
                  const pColor = PHASE_THEME_COLORS[pIndex] || '#38bdf8';
                  const isSelected = step.step === internalSelectedStep;

                  return (
                    <div
                      key={step.step}
                      onClick={() => handleSelectStep(step.step)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                        isSelected
                          ? 'bg-[#121417] border-[#00ff9d] shadow-[0_0_15px_rgba(0,255,157,0.15)] ring-1 ring-[#00ff9d]'
                          : 'bg-[#121417]/70 border-[#1f2228] hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-400 font-mono font-bold text-xs flex items-center justify-center">
                            #{rank + 1}
                          </span>
                          <div>
                            <span className="text-[10px] font-mono font-bold uppercase" style={{ color: pColor }}>
                              {step.phase_name}
                            </span>
                            <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                              Step #{step.step}: {step.name}
                            </h4>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
                          Blocks {blockStatus.downstreamCount} Steps
                        </span>
                      </div>

                      <div className="p-2 rounded-lg bg-[#08090a] border border-[#1f2228] flex items-center justify-between text-[11px] font-mono">
                        <span className="text-[#888e96]">
                          Prerequisites: <strong className={blockStatus.isBlocked ? 'text-rose-400' : 'text-[#00ff9d]'}>
                            {blockStatus.completedPrereqs}/{blockStatus.totalPrereqs} Met
                          </strong>
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStatus(step.step);
                          }}
                          className="px-2 py-0.5 rounded bg-[#00ff9d] text-black font-bold text-[10px] hover:bg-[#00e68d] transition-colors"
                        >
                          Mark Complete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Right/Bottom Step Blocking Inspector Drawer */}
        <div className="w-full lg:w-96 bg-[#121417] p-4 sm:p-5 flex flex-col justify-between overflow-y-auto space-y-4">
          
          {/* Active Step Header Card */}
          <div className="space-y-3">
            
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30 font-bold">
                  {currentStep.phase_name}
                </span>
                <h3 className="text-sm sm:text-base font-black text-white tracking-tight mt-1.5 flex items-center gap-1.5">
                  Step #{currentStep.step}: {currentStep.name}
                </h3>
              </div>

              <span
                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold shrink-0 ${
                  currentStep.status === 'completed'
                    ? 'bg-[#00ff9d]/15 text-[#00ff9d] border border-[#00ff9d]/30'
                    : currentStep.status === 'in_progress'
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                {currentStep.status}
              </span>
            </div>

            {/* Gating Status Verdict Banner */}
            <div
              className={`p-3 rounded-xl border text-xs font-mono flex items-center gap-2.5 ${
                currentStep.status === 'completed'
                  ? 'bg-[#00ff9d]/10 border-[#00ff9d]/40 text-[#00ff9d]'
                  : currentBlockStatus.isBlocked
                  ? 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                  : 'bg-cyan-950/30 border-cyan-500/50 text-cyan-200'
              }`}
            >
              {currentStep.status === 'completed' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#00ff9d] shrink-0" />
                  <div>
                    <strong className="text-white block font-bold">Step Completed & Satisfied</strong>
                    <span className="text-[11px] text-slate-300">All deliverables generated & verified.</span>
                  </div>
                </>
              ) : currentBlockStatus.isBlocked ? (
                <>
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                  <div>
                    <strong className="text-rose-400 block font-bold">
                      Gating Blocked: {currentBlockStatus.unmetPrereqs.length} Missing Requirements
                    </strong>
                    <span className="text-[11px] text-slate-300">Must satisfy upstream prerequisite steps before proceeding.</span>
                  </div>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <strong className="text-cyan-300 block font-bold">Ready for Immediate Execution</strong>
                    <span className="text-[11px] text-slate-300">All {currentBlockStatus.totalPrereqs} prerequisite dependencies are clear.</span>
                  </div>
                </>
              )}
            </div>

          </div>

          {/* Upstream Prerequisites (Blockers) Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <h4 className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
                Upstream Prerequisites ({currentBlockStatus.completedPrereqs}/{currentBlockStatus.totalPrereqs})
              </h4>
              <span className="text-[10px] text-[#888e96]">
                {currentBlockStatus.isBlocked ? (
                  <span className="text-rose-400 font-bold">Blocked</span>
                ) : (
                  <span className="text-[#00ff9d] font-bold">Cleared</span>
                )}
              </span>
            </div>

            {currentBlockStatus.totalPrereqs === 0 ? (
              <div className="p-2.5 rounded-lg bg-[#08090a] border border-[#1f2228] text-[11px] font-mono text-[#888e96]">
                Root task: No upstream prerequisites required.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {/* Unmet Prerequisites first */}
                {currentBlockStatus.unmetPrereqs.map((prereq) => (
                  <div
                    key={prereq.step}
                    onClick={() => handleSelectStep(prereq.step)}
                    className="p-2 rounded-lg bg-rose-950/20 border border-rose-500/40 hover:border-rose-400 transition-all cursor-pointer flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[11px] font-mono font-bold text-white block truncate">
                          Step #{prereq.step}: {prereq.name}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400 block truncate">
                          {prereq.phase}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(prereq.step);
                      }}
                      className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white text-[9px] font-mono font-bold border border-rose-500/30 transition-colors shrink-0"
                      title="Quick-mark prerequisite as completed"
                    >
                      Resolve
                    </button>
                  </div>
                ))}

                {/* Met Prerequisites */}
                {currentBlockStatus.metPrereqs.map((prereq) => (
                  <div
                    key={prereq.step}
                    onClick={() => handleSelectStep(prereq.step)}
                    className="p-2 rounded-lg bg-[#08090a] border border-[#1f2228] hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff9d] shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[11px] font-mono text-slate-300 block truncate">
                          Step #{prereq.step}: {prereq.name}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500 block truncate">
                          {prereq.phase}
                        </span>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-[#00ff9d] font-bold shrink-0">
                      Satisfied
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Downstream Unlocked Steps Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <h4 className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                Downstream Tasks Unlocked ({currentBlockStatus.downstreamCount})
              </h4>
              <span className="text-[10px] text-[#888e96]">
                {currentStep.status === 'completed' ? 'Active' : 'Waiting'}
              </span>
            </div>

            {currentBlockStatus.downstreamCount === 0 ? (
              <div className="p-2.5 rounded-lg bg-[#08090a] border border-[#1f2228] text-[11px] font-mono text-[#888e96]">
                Terminal milestone: No direct downstream steps waiting.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {currentBlockStatus.downstreamSteps.map((downstream) => (
                  <div
                    key={downstream.step}
                    onClick={() => handleSelectStep(downstream.step)}
                    className="p-2 rounded-lg bg-[#08090a] border border-[#1f2228] hover:border-cyan-500/40 transition-all cursor-pointer flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[11px] font-mono text-slate-300 block truncate">
                          Step #{downstream.step}: {downstream.name}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500 block truncate">
                          {downstream.phase}
                        </span>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 shrink-0 capitalize">
                      {downstream.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Action Controls */}
          <div className="pt-3 border-t border-[#1f2228] space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleToggleStatus(currentStep.step)}
                className={`w-full py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 ${
                  currentStep.status === 'completed'
                    ? 'bg-white/10 hover:bg-white/15 text-slate-200 border border-white/20'
                    : 'bg-[#00ff9d] hover:bg-[#00e68d] text-black shadow-[0_0_10px_rgba(0,255,157,0.3)]'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{currentStep.status === 'completed' ? 'Reopen Step' : 'Mark Completed'}</span>
              </button>

              {onOpenStepModal && (
                <button
                  onClick={() => onOpenStepModal(currentStep)}
                  className="w-full py-2 rounded-xl bg-[#08090a] hover:bg-[#121417] text-white border border-[#1f2228] hover:border-[#00ff9d]/40 text-xs font-mono font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#00ff9d]" />
                  <span>Inspect Substeps</span>
                </button>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
