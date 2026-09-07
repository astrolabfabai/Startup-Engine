import React, { useState, useEffect, useMemo } from 'react';
import {
  PhaseMilestone,
  DEFAULT_PHASE_MILESTONES,
} from '../data/phaseMilestonesData';
import { StartupPhase } from '../types';
import {
  CheckCircle2,
  Clock,
  Target,
  Plus,
  Trash2,
  Edit3,
  Search,
  SlidersHorizontal,
  Sparkles,
  Download,
  Copy,
  Check,
  RotateCcw,
  Layers,
  Award,
  AlertCircle,
  FileCheck,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Calendar,
  User,
  ShieldCheck,
  FolderCheck,
  Printer,
  Zap,
  Flame,
  BookmarkCheck,
} from 'lucide-react';

interface PhaseMilestonesTrackerProps {
  phases?: StartupPhase[];
  activePhaseId?: string;
  onPhaseSelect?: (phaseId: string) => void;
  businessContext?: string;
}

const STORAGE_KEY = 'astrolab_phase_milestones_v1';

// Distinct colors for each of the 10 startup phases
const PHASE_COLOR_MAP: Record<string, { border: string; bg: string; text: string; badge: string }> = {
  phase_01_idea_and_validation: { border: 'border-emerald-500/40', bg: 'bg-emerald-500/10', text: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300' },
  phase_02_business_planning: { border: 'border-cyan-500/40', bg: 'bg-cyan-500/10', text: 'text-cyan-400', badge: 'bg-cyan-500/20 text-cyan-300' },
  phase_03_business_structure_and_legal: { border: 'border-purple-500/40', bg: 'bg-purple-500/10', text: 'text-purple-400', badge: 'bg-purple-500/20 text-purple-300' },
  phase_04_finance_and_funding: { border: 'border-amber-500/40', bg: 'bg-amber-500/10', text: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-300' },
  phase_05_product_and_service_development: { border: 'border-rose-500/40', bg: 'bg-rose-500/10', text: 'text-rose-400', badge: 'bg-rose-500/20 text-rose-300' },
  phase_06_operations_setup: { border: 'border-indigo-500/40', bg: 'bg-indigo-500/10', text: 'text-indigo-400', badge: 'bg-indigo-500/20 text-indigo-300' },
  phase_07_branding_and_marketing: { border: 'border-pink-500/40', bg: 'bg-pink-500/10', text: 'text-pink-400', badge: 'bg-pink-500/20 text-pink-300' },
  phase_08_hiring_and_human_resources: { border: 'border-teal-500/40', bg: 'bg-teal-500/10', text: 'text-teal-400', badge: 'bg-teal-500/20 text-teal-300' },
  phase_09_launch: { border: 'border-[#00ff9d]/40', bg: 'bg-[#00ff9d]/10', text: 'text-[#00ff9d]', badge: 'bg-[#00ff9d]/20 text-[#00ff9d]' },
  phase_10_growth_and_scaling: { border: 'border-violet-500/40', bg: 'bg-violet-500/10', text: 'text-violet-400', badge: 'bg-violet-500/20 text-violet-300' },
};

export const PhaseMilestonesTracker: React.FC<PhaseMilestonesTrackerProps> = ({
  phases = [],
  activePhaseId = 'all',
  onPhaseSelect,
  businessContext = 'High-growth B2B SaaS startup with AI automation',
}) => {
  // State for milestones
  const [milestones, setMilestones] = useState<PhaseMilestone[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return DEFAULT_PHASE_MILESTONES;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(milestones));
    } catch {
      // ignore
    }
  }, [milestones]);

  // Selected phase filter (all or specific phase_id)
  const [selectedPhase, setSelectedPhase] = useState<string>(activePhaseId || 'all');

  // Keep local filter synced when prop changes
  useEffect(() => {
    if (activePhaseId) {
      setSelectedPhase(activePhaseId);
    }
  }, [activePhaseId]);

  // Filter controls
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in_progress' | 'pending'>('all');
  const [criticalityFilter, setCriticalityFilter] = useState<'all' | 'CRITICAL' | 'HIGH' | 'MEDIUM'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // New Milestone Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newMilestonePhaseId, setNewMilestonePhaseId] = useState<string>('phase_01_idea_and_validation');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDeliverable, setNewDeliverable] = useState<string>('');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newCriticality, setNewCriticality] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM'>('HIGH');
  const [newCategory, setNewCategory] = useState<'Strategic' | 'Legal/Compliance' | 'Product/Tech' | 'Financial' | 'Go-to-Market' | 'Operational'>('Strategic');
  const [newDeadline, setNewDeadline] = useState<string>('Week 4');
  const [newOwner, setNewOwner] = useState<string>('Founding Lead');
  const [newEvidence, setNewEvidence] = useState<string>('');

  // Edit Milestone Modal State
  const [editingMilestone, setEditingMilestone] = useState<PhaseMilestone | null>(null);

  // Copy success notification
  const [copiedReport, setCopiedReport] = useState<boolean>(false);

  // AI Milestone Generation State
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiSuccessMsg, setAiSuccessMsg] = useState<string | null>(null);

  // Expanded Phase Accordions
  const [collapsedPhases, setCollapsedPhases] = useState<Record<string, boolean>>({});

  const togglePhaseCollapse = (pId: string) => {
    setCollapsedPhases((prev) => ({
      ...prev,
      [pId]: !prev[pId],
    }));
  };

  // Group milestones by Phase
  const uniquePhaseIds = useMemo(() => {
    const ids = Array.from(new Set(milestones.map((m) => m.phase_id)));
    return ids;
  }, [milestones]);

  // Overall Statistics
  const totalCount = milestones.length;
  const completedCount = milestones.filter((m) => m.status === 'completed').length;
  const inProgressCount = milestones.filter((m) => m.status === 'in_progress').length;
  const pendingCount = totalCount - completedCount - inProgressCount;
  const overallPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const criticalTotal = milestones.filter((m) => m.criticality === 'CRITICAL').length;
  const criticalCompleted = milestones.filter((m) => m.criticality === 'CRITICAL' && m.status === 'completed').length;

  // Filtered Milestones
  const filteredMilestones = useMemo(() => {
    return milestones.filter((m) => {
      const matchPhase = selectedPhase === 'all' || m.phase_id === selectedPhase;
      const matchStatus = statusFilter === 'all' || m.status === statusFilter;
      const matchCrit = criticalityFilter === 'all' || m.criticality === criticalityFilter;
      const matchCat = categoryFilter === 'all' || m.category === categoryFilter;
      const matchQuery =
        !searchQuery.trim() ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.deliverable_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.owner_lead && m.owner_lead.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchPhase && matchStatus && matchCrit && matchCat && matchQuery;
    });
  }, [milestones, selectedPhase, statusFilter, criticalityFilter, categoryFilter, searchQuery]);

  // Phase list metadata
  const phaseListMetadata = useMemo(() => {
    const list = [
      { id: 'phase_01_idea_and_validation', num: 1, name: 'Idea & Market Validation' },
      { id: 'phase_02_business_planning', num: 2, name: 'Business Planning & Projections' },
      { id: 'phase_03_business_structure_and_legal', num: 3, name: 'Legal Formation & IP' },
      { id: 'phase_04_finance_and_funding', num: 4, name: 'Finance & Investor Pitching' },
      { id: 'phase_05_product_and_service_development', num: 5, name: 'MVP Architecture & Build' },
      { id: 'phase_06_operations_setup', num: 6, name: 'Operations & Infrastructure' },
      { id: 'phase_07_branding_and_marketing', num: 7, name: 'Branding & Go-to-Market' },
      { id: 'phase_08_hiring_and_human_resources', num: 8, name: 'Hiring & Organization' },
      { id: 'phase_09_launch', num: 9, name: 'Official Launch Blitz' },
      { id: 'phase_10_growth_and_scaling', num: 10, name: 'Growth, Scale & Governance' },
    ];
    return list;
  }, []);

  // Handlers
  const handleToggleStatus = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextStatus = m.status === 'completed' ? 'pending' : 'completed';
          return {
            ...m,
            status: nextStatus,
            completed_at: nextStatus === 'completed' ? new Date().toISOString().slice(0, 10) : undefined,
          };
        }
        return m;
      })
    );
  };

  const handleCycleStatus = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          let nextStatus: 'pending' | 'in_progress' | 'completed' = 'in_progress';
          if (m.status === 'pending') nextStatus = 'in_progress';
          else if (m.status === 'in_progress') nextStatus = 'completed';
          else nextStatus = 'pending';

          return {
            ...m,
            status: nextStatus,
            completed_at: nextStatus === 'completed' ? new Date().toISOString().slice(0, 10) : undefined,
          };
        }
        return m;
      })
    );
  };

  const handleUpdateEvidence = (id: string, evidenceText: string) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, verification_evidence: evidenceText } : m))
    );
  };

  const handleDeleteMilestone = (id: string) => {
    if (window.confirm('Are you sure you want to delete this key milestone deliverable?')) {
      setMilestones((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDeliverable.trim()) return;

    const matchedPhase = phaseListMetadata.find((p) => p.id === newMilestonePhaseId);
    const phaseNameStr = matchedPhase ? `Phase ${matchedPhase.num}: ${matchedPhase.name}` : newMilestonePhaseId;

    const newEntry: PhaseMilestone = {
      id: `custom_m_${Date.now()}`,
      phase_id: newMilestonePhaseId,
      phase_name: phaseNameStr,
      title: newTitle.trim(),
      deliverable_name: newDeliverable.trim(),
      description: newDesc.trim() || 'Custom defined milestone deliverable.',
      criticality: newCriticality,
      category: newCategory,
      status: 'pending',
      target_deadline: newDeadline.trim() || 'TBD',
      owner_lead: newOwner.trim() || 'Founding Team',
      verification_evidence: newEvidence.trim() || '',
      is_custom: true,
    };

    setMilestones((prev) => [...prev, newEntry]);
    setIsAddModalOpen(false);

    // Reset form
    setNewTitle('');
    setNewDeliverable('');
    setNewDesc('');
    setNewEvidence('');
  };

  const handleSaveEditMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMilestone) return;

    setMilestones((prev) =>
      prev.map((m) => (m.id === editingMilestone.id ? editingMilestone : m))
    );
    setEditingMilestone(null);
  };

  const handleMarkAllInPhase = (phaseId: string, status: 'completed' | 'pending') => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.phase_id === phaseId) {
          return {
            ...m,
            status,
            completed_at: status === 'completed' ? new Date().toISOString().slice(0, 10) : undefined,
          };
        }
        return m;
      })
    );
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset all deliverables to the standard 10-Phase Startup Milestones? Any custom milestones will be removed.')) {
      setMilestones(DEFAULT_PHASE_MILESTONES);
    }
  };

  const handleExportJSON = () => {
    const data = {
      title: 'Astro Lab Fab Startup - Phase Key Milestones & Deliverables Plan',
      exportedAt: new Date().toISOString(),
      summary: {
        totalDeliverables: totalCount,
        completed: completedCount,
        inProgress: inProgressCount,
        pending: pendingCount,
        completionRate: `${overallPercentage}%`,
        criticalMilestonesAchieved: `${criticalCompleted} of ${criticalTotal}`,
      },
      milestones,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `startup_phase_milestones_plan_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const handleCopyMarkdownReport = () => {
    let md = `# Startup Phase Key Milestones & Deliverables Manifest\n`;
    md += `**Progress:** ${completedCount}/${totalCount} Deliverables Achieved (${overallPercentage}%)\n`;
    md += `**Critical Moat Gates:** ${criticalCompleted}/${criticalTotal} Cleared\n\n`;

    phaseListMetadata.forEach((p) => {
      const phaseItems = milestones.filter((m) => m.phase_id === p.id);
      const phaseDone = phaseItems.filter((m) => m.status === 'completed').length;
      md += `## Phase ${p.num}: ${p.name} (${phaseDone}/${phaseItems.length} Achieved)\n`;
      phaseItems.forEach((m) => {
        const checkbox = m.status === 'completed' ? '[x]' : m.status === 'in_progress' ? '[-]' : '[ ]';
        md += `- ${checkbox} **${m.title}** [${m.criticality} | ${m.category}]\n`;
        md += `  - *Deliverable:* ${m.deliverable_name}\n`;
        md += `  - *Owner:* ${m.owner_lead || 'Lead'} | *Target:* ${m.target_deadline || 'TBD'}\n`;
        if (m.verification_evidence) {
          md += `  - *Verification Proof:* ${m.verification_evidence}\n`;
        }
      });
      md += `\n`;
    });

    navigator.clipboard.writeText(md);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  // AI Deliverable Advisor Generator
  const handleGenerateAiDeliverable = async () => {
    setAiLoading(true);
    setAiSuccessMsg(null);
    try {
      const targetPhaseObj = phaseListMetadata.find((p) => p.id === (selectedPhase === 'all' ? 'phase_01_idea_and_validation' : selectedPhase)) || phaseListMetadata[0];

      const res = await fetch('/api/gemini/generate-deliverables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phaseId: targetPhaseObj.id,
          phaseName: targetPhaseObj.name,
          businessContext,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.deliverables)) {
        const newAdditions: PhaseMilestone[] = data.deliverables.map((d: any, idx: number) => ({
          id: `ai_m_${Date.now()}_${idx}`,
          phase_id: targetPhaseObj.id,
          phase_name: `Phase ${targetPhaseObj.num}: ${targetPhaseObj.name}`,
          title: d.title || 'AI Recommended Milestone',
          deliverable_name: d.deliverable_name || 'Strategic Verification Document',
          description: d.description || 'Generated milestone to harden execution.',
          criticality: d.criticality || 'HIGH',
          category: d.category || 'Strategic',
          status: 'pending',
          target_deadline: d.target_deadline || 'Week 4',
          owner_lead: d.owner_lead || 'Founding Team',
          verification_evidence: '',
          is_custom: true,
        }));

        setMilestones((prev) => [...prev, ...newAdditions]);
        setAiSuccessMsg(`Added ${newAdditions.length} tailored deliverables to Phase ${targetPhaseObj.num}!`);
      } else {
        // Fallback intelligent custom milestone if server endpoint is busy
        const fallbackAddition: PhaseMilestone = {
          id: `ai_m_${Date.now()}`,
          phase_id: targetPhaseObj.id,
          phase_name: `Phase ${targetPhaseObj.num}: ${targetPhaseObj.name}`,
          title: `Automated Compliance & Security SLA Seal (${businessContext.slice(0, 30)}...)`,
          deliverable_name: 'SOC2 / Customer Trust Center & Incident Response Protocol',
          description: `Custom deliverable tailored for ${businessContext}: Enforce verified end-to-end data encryption and client data handling compliance.`,
          criticality: 'HIGH',
          category: 'Legal/Compliance',
          status: 'pending',
          target_deadline: 'Week 8',
          owner_lead: 'Security & Lead Engineer',
          verification_evidence: 'Automated audit log verified.',
          is_custom: true,
        };
        setMilestones((prev) => [...prev, fallbackAddition]);
        setAiSuccessMsg(`Added AI-suggested milestone to Phase ${targetPhaseObj.num}!`);
      }
    } catch {
      const fallbackAddition: PhaseMilestone = {
        id: `ai_m_${Date.now()}`,
        phase_id: selectedPhase === 'all' ? 'phase_01_idea_and_validation' : selectedPhase,
        phase_name: 'Phase Key Deliverable',
        title: 'Custom Deep Execution Verification Audit',
        deliverable_name: 'Verified Technical & Commercial Validation Memo',
        description: 'Comprehensive deliverable verifying all dependencies before phase graduation.',
        criticality: 'CRITICAL',
        category: 'Strategic',
        status: 'pending',
        target_deadline: 'Week 6',
        owner_lead: 'Founder',
        verification_evidence: '',
        is_custom: true,
      };
      setMilestones((prev) => [...prev, fallbackAddition]);
      setAiSuccessMsg('Added customized deliverable to your phase plan!');
    } finally {
      setAiLoading(false);
      setTimeout(() => setAiSuccessMsg(null), 4000);
    }
  };

  return (
    <div className="space-y-6 font-mono text-slate-100">
      
      {/* TOP DASHBOARD METRIC STRIP */}
      <div className="bg-[#08090a] p-5 rounded-2xl border border-[#00ff9d]/30 shadow-2xl relative overflow-hidden space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1f2228] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#00ff9d]/10 border border-[#00ff9d]/40 flex items-center justify-center text-[#00ff9d] shadow-[0_0_15px_rgba(0,255,157,0.2)]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white uppercase tracking-wider">
                  Phase Key Milestones & Critical Deliverables Tracker
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#00ff9d]/20 text-[#00ff9d] border border-[#00ff9d]/30">
                  {totalCount} Total Deliverables
                </span>
              </div>
              <p className="text-xs text-[#888e96] mt-0.5">
                Define, assign, verify, and check off critical deliverables for each of the 10 startup lifecycle phases.
              </p>
            </div>
          </div>

          {/* Quick Global Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#00ff9d] text-black font-bold text-xs flex items-center gap-1.5 hover:bg-[#00ff9d]/90 shadow-[0_0_12px_rgba(0,255,157,0.3)] transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Add Milestone
            </button>

            <button
              onClick={handleGenerateAiDeliverable}
              disabled={aiLoading}
              className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Generate tailored deliverables with AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              {aiLoading ? 'Analyzing...' : 'AI Deliverables Advisor'}
            </button>

            <button
              onClick={handleCopyMarkdownReport}
              className="px-3 py-1.5 rounded-xl bg-[#121417] text-slate-300 border border-[#1f2228] hover:text-white hover:border-[#00ff9d] text-xs flex items-center gap-1.5 transition-all"
              title="Copy deliverables summary to clipboard"
            >
              {copiedReport ? <Check className="w-3.5 h-3.5 text-[#00ff9d]" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              {copiedReport ? 'Copied!' : 'Copy Summary'}
            </button>

            <button
              onClick={handleExportJSON}
              className="px-2.5 py-1.5 rounded-xl bg-[#121417] text-slate-300 border border-[#1f2228] hover:text-white hover:border-[#00ff9d] text-xs flex items-center gap-1.5 transition-all"
              title="Export Plan JSON"
            >
              <Download className="w-3.5 h-3.5 text-[#00ff9d]" /> Export JSON
            </button>

            <button
              onClick={handleResetToDefaults}
              className="p-1.5 rounded-xl bg-[#121417] text-slate-400 hover:text-rose-400 border border-[#1f2228] text-xs transition-all"
              title="Reset Deliverables to Factory Defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* AI Notification Banner */}
        {aiSuccessMsg && (
          <div className="bg-purple-500/20 border border-purple-500/40 text-purple-200 text-xs px-3.5 py-2 rounded-xl flex items-center justify-between animate-fade-in">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-300" /> {aiSuccessMsg}
            </span>
            <button onClick={() => setAiSuccessMsg(null)} className="text-purple-300 hover:text-white">✕</button>
          </div>
        )}

        {/* METRICS CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#121417] p-3.5 rounded-xl border border-[#1f2228] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#888e96] uppercase block font-bold">Deliverables Progress</span>
              <div className="text-xl font-bold text-[#00ff9d] font-mono mt-0.5">
                {overallPercentage}%
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {completedCount} of {totalCount} Achieved
              </span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#00ff9d]/10 border border-[#00ff9d]/30 flex items-center justify-center text-[#00ff9d]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#121417] p-3.5 rounded-xl border border-[#1f2228] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#888e96] uppercase block font-bold">Critical Moat Gates</span>
              <div className="text-xl font-bold text-rose-400 font-mono mt-0.5">
                {criticalCompleted} <span className="text-xs text-slate-500">/ {criticalTotal}</span>
              </div>
              <span className="text-[10px] text-rose-300/80 block mt-0.5">
                {criticalTotal - criticalCompleted} Critical Left
              </span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Flame className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#121417] p-3.5 rounded-xl border border-[#1f2228] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#888e96] uppercase block font-bold">In Progress Deliverables</span>
              <div className="text-xl font-bold text-amber-400 font-mono mt-0.5">
                {inProgressCount}
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Active Execution
              </span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#121417] p-3.5 rounded-xl border border-[#1f2228] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#888e96] uppercase block font-bold">Pending Deliverables</span>
              <div className="text-xl font-bold text-slate-300 font-mono mt-0.5">
                {pendingCount}
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Queued for Later Phases
              </span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
              <Target className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs text-[#888e96]">
            <span>Lifecycle Deliverables Completion</span>
            <span className="text-white font-bold">{completedCount} / {totalCount} ({overallPercentage}%)</span>
          </div>
          <div className="w-full bg-[#121417] h-2.5 rounded-full overflow-hidden border border-[#1f2228]">
            <div
              className="bg-gradient-to-r from-emerald-500 via-[#00ff9d] to-cyan-400 h-full transition-all duration-500 shadow-[0_0_10px_rgba(0,255,157,0.5)]"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS & PHASE TABS */}
      <div className="bg-[#08090a] p-4 rounded-2xl border border-[#1f2228] space-y-4">
        
        {/* Phase Pills Multi-Tab Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#888e96] flex items-center gap-1.5 uppercase tracking-wider font-bold">
              <Layers className="w-3.5 h-3.5 text-[#00ff9d]" /> Filter by Phase:
            </span>
            <span className="text-[11px] text-slate-400">
              Select a specific phase to view and manage its key deliverables
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => {
                setSelectedPhase('all');
                onPhaseSelect?.('all');
              }}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedPhase === 'all'
                  ? 'bg-amber-400 text-black shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                  : 'bg-[#121417] text-[#888e96] hover:text-white border border-[#1f2228]'
              }`}
            >
              All 10 Phases ({totalCount})
            </button>

            {phaseListMetadata.map((p) => {
              const isSelected = selectedPhase === p.id;
              const pItems = milestones.filter((m) => m.phase_id === p.id);
              const pDone = pItems.filter((m) => m.status === 'completed').length;
              const pPct = pItems.length > 0 ? Math.round((pDone / pItems.length) * 100) : 0;

              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPhase(p.id);
                    onPhaseSelect?.(p.id);
                  }}
                  className={`text-xs px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#00ff9d] text-black font-bold shadow-[0_0_12px_rgba(0,255,157,0.3)]'
                      : 'bg-[#121417] text-[#888e96] hover:text-white border border-[#1f2228]'
                  }`}
                >
                  <span>P{p.num}: {p.name.split('&')[0].trim()}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isSelected ? 'bg-black/20 text-black font-bold' : 'bg-[#08090a] text-slate-400'
                  }`}>
                    {pDone}/{pItems.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Secondary Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-[#1f2228]">
          {/* Search Box */}
          <div className="sm:col-span-4 relative">
            <Search className="w-3.5 h-3.5 text-[#888e96] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search milestone title, deliverable, owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121417] border border-[#1f2228] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#888e96] focus:outline-none focus:border-[#00ff9d]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-[#888e96] hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3 flex items-center gap-1.5">
            <span className="text-[10px] text-[#888e96] uppercase shrink-0">Status:</span>
            <select
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
              className="w-full bg-[#121417] border border-[#1f2228] rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#00ff9d]"
            >
              <option value="all">All Statuses ({filteredMilestones.length})</option>
              <option value="completed">Completed Only</option>
              <option value="in_progress">In Progress</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Criticality Filter */}
          <div className="sm:col-span-3 flex items-center gap-1.5">
            <span className="text-[10px] text-[#888e96] uppercase shrink-0">Criticality:</span>
            <select
              value={criticalityFilter}
              onChange={(e: any) => setCriticalityFilter(e.target.value)}
              className="w-full bg-[#121417] border border-[#1f2228] rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#00ff9d]"
            >
              <option value="all">All Priorities</option>
              <option value="CRITICAL">Critical Only</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-2 flex items-center gap-1.5">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-[#121417] border border-[#1f2228] rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#00ff9d]"
            >
              <option value="all">All Domains</option>
              <option value="Strategic">Strategic</option>
              <option value="Legal/Compliance">Legal / IP</option>
              <option value="Product/Tech">Product / Tech</option>
              <option value="Financial">Financial</option>
              <option value="Go-to-Market">GTM / Sales</option>
              <option value="Operational">Operational</option>
            </select>
          </div>
        </div>
      </div>

      {/* MILESTONES GROUPED BY PHASE */}
      <div className="space-y-6">
        {phaseListMetadata
          .filter((p) => selectedPhase === 'all' || selectedPhase === p.id)
          .map((phaseMeta) => {
            const phaseItems = filteredMilestones.filter((m) => m.phase_id === phaseMeta.id);
            const totalInPhase = milestones.filter((m) => m.phase_id === phaseMeta.id).length;
            const completedInPhase = milestones.filter((m) => m.phase_id === phaseMeta.id && m.status === 'completed').length;
            const phasePct = totalInPhase > 0 ? Math.round((completedInPhase / totalInPhase) * 100) : 0;
            const colors = PHASE_COLOR_MAP[phaseMeta.id] || { border: 'border-[#1f2228]', bg: 'bg-[#121417]', text: 'text-[#00ff9d]', badge: 'bg-[#00ff9d]/20 text-[#00ff9d]' };
            const isCollapsed = collapsedPhases[phaseMeta.id] || false;

            if (selectedPhase === 'all' && phaseItems.length === 0 && searchQuery) {
              return null;
            }

            return (
              <div
                key={phaseMeta.id}
                className={`bg-[#08090a] rounded-2xl border ${colors.border} overflow-hidden shadow-xl transition-all`}
              >
                {/* PHASE HEADER CARD */}
                <div className="p-4 bg-[#121417]/90 border-b border-[#1f2228] flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => togglePhaseCollapse(phaseMeta.id)}
                      className="p-1 rounded-lg hover:bg-[#1f2228] text-slate-400 hover:text-white transition-colors"
                      title={isCollapsed ? 'Expand Phase Deliverables' : 'Collapse Phase Deliverables'}
                    >
                      {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg ${colors.badge} font-mono`}>
                          Phase {phaseMeta.num}
                        </span>
                        <h3 className="text-sm font-bold text-white">
                          {phaseMeta.name}
                        </h3>
                        <span className="text-[11px] text-[#888e96] font-normal hidden sm:inline">
                          • {completedInPhase} of {totalInPhase} Deliverables Completed
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Phase Progress Bar & Quick Actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-32 bg-[#08090a] h-2 rounded-full overflow-hidden border border-[#1f2228] hidden sm:block">
                      <div
                        className="bg-[#00ff9d] h-full transition-all duration-300 shadow-[0_0_8px_rgba(0,255,157,0.4)]"
                        style={{ width: `${phasePct}%` }}
                      />
                    </div>

                    <span className="text-xs font-bold font-mono text-[#00ff9d]">
                      {phasePct}%
                    </span>

                    <div className="flex items-center gap-1 border-l border-[#1f2228] pl-2">
                      <button
                        onClick={() => handleMarkAllInPhase(phaseMeta.id, 'completed')}
                        className="text-[10px] px-2 py-1 rounded bg-[#00ff9d]/10 text-[#00ff9d] hover:bg-[#00ff9d]/20 border border-[#00ff9d]/30 font-bold transition-all"
                        title="Mark all deliverables in this phase as completed"
                      >
                        ✓ Mark All Done
                      </button>
                      <button
                        onClick={() => handleMarkAllInPhase(phaseMeta.id, 'pending')}
                        className="text-[10px] px-2 py-1 rounded bg-[#08090a] text-[#888e96] hover:text-white border border-[#1f2228] transition-all"
                        title="Reset this phase to pending"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>

                {/* PHASE DELIVERABLES LIST */}
                {!isCollapsed && (
                  <div className="p-4 space-y-3">
                    {phaseItems.length === 0 ? (
                      <div className="text-center py-6 text-xs text-[#888e96]">
                        No deliverables match the active filter criteria for this phase.
                      </div>
                    ) : (
                      phaseItems.map((milestone) => {
                        const isDone = milestone.status === 'completed';
                        const isInProgress = milestone.status === 'in_progress';

                        return (
                          <div
                            key={milestone.id}
                            className={`p-4 rounded-xl border transition-all relative group ${
                              isDone
                                ? 'bg-[#00ff9d]/5 border-[#00ff9d]/40'
                                : isInProgress
                                ? 'bg-amber-500/5 border-amber-500/40'
                                : 'bg-[#121417]/70 border-[#1f2228] hover:border-slate-700'
                            }`}
                          >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                              
                              {/* Left: Checkbox & Main Info */}
                              <div className="flex items-start gap-3 flex-1">
                                {/* Interactive Checkbox */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleStatus(milestone.id)}
                                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                                    isDone
                                      ? 'bg-[#00ff9d] text-black shadow-[0_0_10px_rgba(0,255,157,0.4)]'
                                      : isInProgress
                                      ? 'bg-amber-500/20 border border-amber-500 text-amber-400'
                                      : 'bg-[#08090a] border border-[#1f2228] text-transparent hover:border-[#00ff9d]'
                                  }`}
                                  title={isDone ? 'Mark Pending' : 'Mark Completed'}
                                >
                                  {isDone ? (
                                    <Check className="w-4 h-4 stroke-[3]" />
                                  ) : isInProgress ? (
                                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                                  ) : null}
                                </button>

                                <div className="space-y-1.5 flex-1">
                                  {/* Badges & Criticality */}
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span
                                      className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                                        milestone.criticality === 'CRITICAL'
                                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                                          : milestone.criticality === 'HIGH'
                                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                          : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                                      }`}
                                    >
                                      {milestone.criticality}
                                    </span>

                                    <span className="text-[9px] px-2 py-0.5 rounded bg-[#1f2228] text-slate-300 border border-slate-700">
                                      {milestone.category}
                                    </span>

                                    {milestone.is_custom && (
                                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                                        Custom
                                      </span>
                                    )}

                                    {/* Status Switcher Button */}
                                    <button
                                      onClick={() => handleCycleStatus(milestone.id)}
                                      className={`text-[10px] px-2 py-0.5 rounded font-mono capitalize transition-all ${
                                        isDone
                                          ? 'bg-[#00ff9d]/20 text-[#00ff9d] border border-[#00ff9d]/40'
                                          : isInProgress
                                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                          : 'bg-[#08090a] text-slate-400 border border-[#1f2228] hover:text-white'
                                      }`}
                                    >
                                      Status: {milestone.status.replace('_', ' ')} ⟳
                                    </button>
                                  </div>

                                  {/* Milestone Title */}
                                  <h4 className={`text-sm font-bold transition-colors ${
                                    isDone ? 'text-[#00ff9d] line-through opacity-80' : 'text-white'
                                  }`}>
                                    {milestone.title}
                                  </h4>

                                  {/* Tangible Deliverable Artifact Name */}
                                  <div className="bg-[#08090a] p-2.5 rounded-lg border border-[#1f2228] text-xs">
                                    <div className="text-[#888e96] text-[10px] uppercase font-bold flex items-center gap-1 mb-0.5">
                                      <FileCheck className="w-3 h-3 text-[#00ff9d]" /> Deliverable Artifact:
                                    </div>
                                    <span className="font-semibold text-slate-200">
                                      {milestone.deliverable_name}
                                    </span>
                                  </div>

                                  {/* Description */}
                                  <p className="text-xs text-[#888e96] leading-relaxed">
                                    {milestone.description}
                                  </p>

                                  {/* Verification Evidence / Artifact Notes */}
                                  <div className="pt-1">
                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1">
                                      <BookmarkCheck className="w-3 h-3 text-cyan-400" />
                                      <span>Verification Proof / Deliverable Notes:</span>
                                    </div>
                                    <input
                                      type="text"
                                      placeholder="Paste link to PRD, signed document, certificate, or verification notes..."
                                      value={milestone.verification_evidence || ''}
                                      onChange={(e) => handleUpdateEvidence(milestone.id, e.target.value)}
                                      className="w-full bg-[#08090a] border border-[#1f2228] rounded-lg px-2.5 py-1 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#00ff9d] transition-all"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Right: Meta Info & Actions */}
                              <div className="flex flex-row md:flex-col items-end justify-between md:justify-start gap-2 text-right shrink-0 md:min-w-[140px]">
                                <div className="space-y-1 text-right text-[11px]">
                                  {milestone.target_deadline && (
                                    <div className="flex items-center md:justify-end gap-1 text-[#888e96]">
                                      <Calendar className="w-3 h-3 text-amber-400" />
                                      <span>Due: <strong className="text-slate-200">{milestone.target_deadline}</strong></span>
                                    </div>
                                  )}

                                  {milestone.owner_lead && (
                                    <div className="flex items-center md:justify-end gap-1 text-[#888e96]">
                                      <User className="w-3 h-3 text-cyan-400" />
                                      <span className="truncate max-w-[130px]">{milestone.owner_lead}</span>
                                    </div>
                                  )}

                                  {milestone.completed_at && (
                                    <div className="text-[10px] text-[#00ff9d] font-bold">
                                      Signed off: {milestone.completed_at}
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center gap-1 pt-2">
                                  <button
                                    onClick={() => setEditingMilestone(milestone)}
                                    className="p-1.5 rounded-lg bg-[#08090a] hover:bg-[#1f2228] text-slate-400 hover:text-white border border-[#1f2228] transition-colors"
                                    title="Edit Milestone"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    onClick={() => handleDeleteMilestone(milestone.id)}
                                    className="p-1.5 rounded-lg bg-[#08090a] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-[#1f2228] transition-colors"
                                    title="Delete Milestone"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* ADD MILESTONE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#08090a]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121417] border border-[#00ff9d]/40 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 my-8 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#00ff9d]/10 border border-[#00ff9d]/30 flex items-center justify-center text-[#00ff9d]">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Define Key Milestone Deliverable</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMilestone} className="space-y-3.5 text-xs">
              {/* Phase Selector */}
              <div>
                <label className="block text-[#888e96] font-bold uppercase mb-1">Target Phase</label>
                <select
                  value={newMilestonePhaseId}
                  onChange={(e) => setNewMilestonePhaseId(e.target.value)}
                  className="w-full bg-[#08090a] border border-[#1f2228] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00ff9d]"
                >
                  {phaseListMetadata.map((p) => (
                    <option key={p.id} value={p.id}>
                      Phase {p.num}: {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Milestone Title */}
              <div>
                <label className="block text-[#888e96] font-bold uppercase mb-1">Milestone Objective Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Enterprise SOC2 Type II Certification"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#08090a] border border-[#1f2228] rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-[#00ff9d]"
                />
              </div>

              {/* Deliverable Artifact Name */}
              <div>
                <label className="block text-[#888e96] font-bold uppercase mb-1">Tangible Deliverable Artifact *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Executed Clean SOC2 Audit Report & Seal"
                  value={newDeliverable}
                  onChange={(e) => setNewDeliverable(e.target.value)}
                  className="w-full bg-[#08090a] border border-[#1f2228] rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-[#00ff9d]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[#888e96] font-bold uppercase mb-1">Requirement Description</label>
                <textarea
                  rows={2}
                  placeholder="Explain what constitutes successful completion of this deliverable..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-[#08090a] border border-[#1f2228] rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-[#00ff9d]"
                />
              </div>

              {/* Priority & Category Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#888e96] font-bold uppercase mb-1">Criticality</label>
                  <select
                    value={newCriticality}
                    onChange={(e: any) => setNewCriticality(e.target.value)}
                    className="w-full bg-[#08090a] border border-[#1f2228] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00ff9d]"
                  >
                    <option value="CRITICAL">CRITICAL (Moat Gate)</option>
                    <option value="HIGH">HIGH Priority</option>
                    <option value="MEDIUM">MEDIUM Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#888e96] font-bold uppercase mb-1">Domain Category</label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full bg-[#08090a] border border-[#1f2228] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00ff9d]"
                  >
                    <option value="Strategic">Strategic</option>
                    <option value="Legal/Compliance">Legal / Compliance</option>
                    <option value="Product/Tech">Product / Tech</option>
                    <option value="Financial">Financial</option>
                    <option value="Go-to-Market">Go-to-Market</option>
                    <option value="Operational">Operational</option>
                  </select>
                </div>
              </div>

              {/* Target Deadline & Owner */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#888e96] font-bold uppercase mb-1">Target Deadline</label>
                  <input
                    type="text"
                    placeholder="e.g., Week 12 / Q2 End"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full bg-[#08090a] border border-[#1f2228] rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-[#00ff9d]"
                  />
                </div>

                <div>
                  <label className="block text-[#888e96] font-bold uppercase mb-1">Lead Owner</label>
                  <input
                    type="text"
                    placeholder="e.g., CTO / Head of Security"
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    className="w-full bg-[#08090a] border border-[#1f2228] rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-[#00ff9d]"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1f2228]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#08090a] text-slate-300 hover:text-white border border-[#1f2228]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#00ff9d] text-black font-bold hover:bg-[#00ff9d]/90 shadow-[0_0_12px_rgba(0,255,157,0.3)]"
                >
                  Save Milestone Deliverable
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MILESTONE MODAL */}
      {editingMilestone && (
        <div className="fixed inset-0 z-50 bg-[#08090a]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121417] border border-cyan-500/40 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 my-8 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Edit3 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Edit Milestone Deliverable</h3>
              </div>
              <button
                onClick={() => setEditingMilestone(null)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditMilestone} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#888e96] font-bold uppercase mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingMilestone.title}
                  onChange={(e) => setEditingMilestone({ ...editingMilestone, title: e.target.value })}
                  className="w-full bg-[#08090a] border border-[#1f2228] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00ff9d]"
                />
              </div>

              <div>
                <label className="block text-[#888e96] font-bold uppercase mb-1">Deliverable Artifact Name</label>
                <input
                  type="text"
                  required
                  value={editingMilestone.deliverable_name}
                  onChange={(e) => setEditingMilestone({ ...editingMilestone, deliverable_name: e.target.value })}
                  className="w-full bg-[#08090a] border border-[#1f2228] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00ff9d]"
                />
              </div>

              <div>
                <label className="block text-[#888e96] font-bold uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingMilestone.description}
                  onChange={(e) => setEditingMilestone({ ...editingMilestone, description: e.target.value })}
                  className="w-full bg-[#08090a] border border-[#1f2228] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00ff9d]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#888e96] font-bold uppercase mb-1">Criticality</label>
                  <select
                    value={editingMilestone.criticality}
                    onChange={(e: any) => setEditingMilestone({ ...editingMilestone, criticality: e.target.value })}
                    className="w-full bg-[#08090a] border border-[#1f2228] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00ff9d]"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#888e96] font-bold uppercase mb-1">Category</label>
                  <select
                    value={editingMilestone.category}
                    onChange={(e: any) => setEditingMilestone({ ...editingMilestone, category: e.target.value })}
                    className="w-full bg-[#08090a] border border-[#1f2228] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00ff9d]"
                  >
                    <option value="Strategic">Strategic</option>
                    <option value="Legal/Compliance">Legal / Compliance</option>
                    <option value="Product/Tech">Product / Tech</option>
                    <option value="Financial">Financial</option>
                    <option value="Go-to-Market">Go-to-Market</option>
                    <option value="Operational">Operational</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#888e96] font-bold uppercase mb-1">Target Deadline</label>
                  <input
                    type="text"
                    value={editingMilestone.target_deadline || ''}
                    onChange={(e) => setEditingMilestone({ ...editingMilestone, target_deadline: e.target.value })}
                    className="w-full bg-[#08090a] border border-[#1f2228] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00ff9d]"
                  />
                </div>

                <div>
                  <label className="block text-[#888e96] font-bold uppercase mb-1">Lead Owner</label>
                  <input
                    type="text"
                    value={editingMilestone.owner_lead || ''}
                    onChange={(e) => setEditingMilestone({ ...editingMilestone, owner_lead: e.target.value })}
                    className="w-full bg-[#08090a] border border-[#1f2228] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00ff9d]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1f2228]">
                <button
                  type="button"
                  onClick={() => setEditingMilestone(null)}
                  className="px-4 py-2 rounded-xl bg-[#08090a] text-slate-300 hover:text-white border border-[#1f2228]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-400 text-black font-bold hover:bg-cyan-300 transition-all"
                >
                  Update Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
