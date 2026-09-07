import React, { useState, useEffect } from 'react';
import {
  FileText,
  X,
  Plus,
  Pin,
  Trash2,
  Edit3,
  Check,
  CheckSquare,
  Square,
  Search,
  Download,
  Copy,
  AlertTriangle,
  HelpCircle,
  Target,
  Sparkles,
  Tag,
  Calendar,
  Filter,
  ChevronRight,
  Layers,
  Clock,
  StickyNote,
} from 'lucide-react';
import { QuickNote, QuickNoteType, QuickNotePriority, TabId } from '../types';

interface QuickNotesPanelProps {
  activeTab: TabId;
  activeStepNumber?: number;
  activeStepName?: string;
  isOpen: boolean;
  onToggle: () => void;
}

const TAB_LABELS: Record<TabId, string> = {
  upgrades: '25 Startup Engine Upgrades & Executive Suite',
  grants: 'Industry Startup Engine & Market Intelligence',
  lifecycle: '145-Step Lifecycle Engine',
  master_templates: 'Master Templates & Workbook',
  framework: 'Business Framework JSON',
  valuation: 'Valuation & Decision Gates',
  creative: 'Creative AI Asset Studio',
  plan: 'Business Models & Plan',
  tax: 'IRS Tax & Expense Optimizer',
  sops: 'SOP & Workflow Library',
};

const DEFAULT_NOTES: QuickNote[] = [
  {
    id: 'note-1',
    title: 'Validate SBIR Phase I Grant Eligibility',
    content: 'Check Grants.gov CFDA #47.084 for NSF Tech Transfer funding eligibility before Q3 deadline.',
    type: 'reminder',
    priority: 'high',
    contextTab: 'grants',
    contextTabLabel: 'Industry Startup Engine & Market Intelligence',
    isPinned: true,
    isCompleted: false,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    tags: ['Grant', 'Funding', 'NSF'],
  },
  {
    id: 'note-2',
    title: 'Cap Table & Valuation Discount Gate',
    content: 'Review 20% SAFE cap discount rate and verify revenue driver multiplier before pitching lead investors.',
    type: 'decision',
    priority: 'medium',
    contextTab: 'valuation',
    contextTabLabel: 'Valuation & Decision Gates',
    isPinned: true,
    isCompleted: false,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    tags: ['Valuation', 'Investors'],
  },
  {
    id: 'note-3',
    title: 'Section 179 Software Depreciation Limit',
    content: 'Log all AI cloud server subscriptions and dev workstation hardware for 100% first-year write-off.',
    type: 'note',
    priority: 'low',
    contextTab: 'tax',
    contextTabLabel: 'IRS Tax & Expense Optimizer',
    isPinned: false,
    isCompleted: true,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    tags: ['IRS', 'Deductions'],
  },
];

export const QuickNotesPanel: React.FC<QuickNotesPanelProps> = ({
  activeTab,
  activeStepNumber,
  activeStepName,
  isOpen,
  onToggle,
}) => {
  const [notes, setNotes] = useState<QuickNote[]>(() => {
    const saved = localStorage.getItem('astro_lab_fab_quick_notes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved quick notes', e);
      }
    }
    return DEFAULT_NOTES;
  });

  // Filter & Search states
  const [filterMode, setFilterMode] = useState<'all' | 'context' | 'pinned' | 'reminders'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // New Note Form states
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState<QuickNoteType>('note');
  const [newPriority, setNewPriority] = useState<QuickNotePriority>('medium');
  const [newTagsInput, setNewTagsInput] = useState('');

  // Editing state
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editType, setEditType] = useState<QuickNoteType>('note');
  const [editPriority, setEditPriority] = useState<QuickNotePriority>('medium');

  // Copy indicator
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('astro_lab_fab_quick_notes', JSON.stringify(notes));
  }, [notes]);

  // Keyboard shortcut (Alt+N or Ctrl+N)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        onToggle();
      }
      if (e.key === 'Escape' && isOpen) {
        onToggle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onToggle]);

  const currentTabLabel = TAB_LABELS[activeTab] || 'General Context';

  // Count context notes
  const currentContextNotesCount = notes.filter(
    (n) => n.contextTab === activeTab || (activeStepNumber && n.contextStepNumber === activeStepNumber)
  ).length;

  // Add Note Handler
  const handleAddNote = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTitle.trim() && !newContent.trim()) return;

    const tags = newTagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newNote: QuickNote = {
      id: `note-${Date.now()}`,
      title: newTitle.trim() || 'Untitled Note',
      content: newContent.trim(),
      type: newType,
      priority: newPriority,
      contextTab: activeTab,
      contextTabLabel: currentTabLabel,
      contextStepNumber: activeStepNumber,
      contextStepName: activeStepName,
      isPinned: false,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: tags.length > 0 ? tags : [activeTab],
    };

    setNotes((prev) => [newNote, ...prev]);

    // Reset Form
    setNewTitle('');
    setNewContent('');
    setNewType('note');
    setNewPriority('medium');
    setNewTagsInput('');
    setIsAddingNote(false);
  };

  // Preset Template Quick Fill
  const handleApplyTemplate = (type: QuickNoteType, titlePrefix: string, sampleContent: string) => {
    setIsAddingNote(true);
    setNewType(type);
    const stepPrefix = activeStepNumber ? `[Step ${activeStepNumber}] ` : '';
    setNewTitle(`${stepPrefix}${titlePrefix}`);
    setNewContent(sampleContent);
  };

  // Toggle Pin
  const handleTogglePin = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned, updatedAt: new Date().toISOString() } : n))
    );
  };

  // Toggle Completed
  const handleToggleCompleted = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isCompleted: !n.isCompleted, updatedAt: new Date().toISOString() } : n))
    );
  };

  // Delete Note
  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // Start Edit Note
  const handleStartEdit = (note: QuickNote) => {
    setEditingNoteId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditType(note.type);
    setEditPriority(note.priority);
  };

  // Save Edit Note
  const handleSaveEdit = (id: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              title: editTitle.trim() || 'Untitled Note',
              content: editContent.trim(),
              type: editType,
              priority: editPriority,
              updatedAt: new Date().toISOString(),
            }
          : n
      )
    );
    setEditingNoteId(null);
  };

  // Export as Markdown
  const handleExportMarkdown = () => {
    let md = `# ASTRO LAB FAB - Quick Context Notes & Reminders\n`;
    md += `Exported At: ${new Date().toLocaleString()}\n\n`;

    notes.forEach((note, idx) => {
      md += `### ${idx + 1}. [${note.type.toUpperCase()}] ${note.title}\n`;
      md += `- **Context**: ${note.contextTabLabel}${
        note.contextStepNumber ? ` (Step #${note.contextStepNumber}: ${note.contextStepName || ''})` : ''
      }\n`;
      md += `- **Priority**: ${note.priority.toUpperCase()} | **Status**: ${
        note.isCompleted ? 'Completed ✅' : 'Pending ⏳'
      }\n`;
      md += `- **Created**: ${new Date(note.createdAt).toLocaleString()}\n`;
      if (note.tags && note.tags.length > 0) {
        md += `- **Tags**: ${note.tags.map((t) => `#${t}`).join(', ')}\n`;
      }
      md += `\n${note.content || '*No detailed description*'}\n\n---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quick_notes_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
  };

  // Copy All Notes to Clipboard
  const handleCopyNotes = () => {
    const text = notes
      .map(
        (n) =>
          `[${n.type.toUpperCase()}] ${n.title}\nContext: ${n.contextTabLabel}\n${n.content}\n`
      )
      .join('\n---\n\n');
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  // Filter logic
  const filteredNotes = notes.filter((note) => {
    // Mode filter
    if (filterMode === 'context') {
      const isTabMatch = note.contextTab === activeTab;
      const isStepMatch = activeStepNumber ? note.contextStepNumber === activeStepNumber : false;
      if (!isTabMatch && !isStepMatch) return false;
    } else if (filterMode === 'pinned') {
      if (!note.isPinned) return false;
    } else if (filterMode === 'reminders') {
      if (note.type !== 'reminder') return false;
    }

    // Type filter
    if (typeFilter !== 'all' && note.type !== typeFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = note.title.toLowerCase().includes(q);
      const matchContent = note.content.toLowerCase().includes(q);
      const matchTab = note.contextTabLabel.toLowerCase().includes(q);
      const matchStep = note.contextStepName ? note.contextStepName.toLowerCase().includes(q) : false;
      const matchTags = note.tags ? note.tags.some((t) => t.toLowerCase().includes(q)) : false;
      return matchTitle || matchContent || matchTab || matchStep || matchTags;
    }

    return true;
  });

  // Sort notes: Pinned first, then newest
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const getTypeBadge = (type: QuickNoteType) => {
    switch (type) {
      case 'risk':
        return { label: 'Risk', bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30', icon: AlertTriangle };
      case 'decision':
        return { label: 'Decision', bg: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30', icon: Target };
      case 'reminder':
        return { label: 'Reminder', bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', icon: Clock };
      case 'question':
        return { label: 'Question', bg: 'bg-purple-500/15 text-purple-400 border-purple-500/30', icon: HelpCircle };
      default:
        return { label: 'Note', bg: 'bg-slate-800 text-slate-300 border-slate-700', icon: FileText };
    }
  };

  const getPriorityBadge = (priority: QuickNotePriority) => {
    switch (priority) {
      case 'high':
        return 'text-red-400 bg-red-950/40 border-red-800/40';
      case 'medium':
        return 'text-amber-400 bg-amber-950/40 border-amber-800/40';
      case 'low':
        return 'text-slate-400 bg-slate-800/40 border-slate-700/40';
    }
  };

  return (
    <>
      {/* Sticky Trigger Button on Right Edge */}
      {!isOpen && (
        <button
          onClick={onToggle}
          title="Quick Context Notes (Alt+N)"
          className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-[#121417] hover:bg-[#1a1d23] text-slate-100 border-l-2 border-t border-b border-[#00ff9d] rounded-l-xl px-2.5 py-4 shadow-[0_0_20px_rgba(0,255,157,0.2)] flex flex-col items-center gap-2 group transition-all duration-200 hover:pr-3.5"
        >
          <div className="relative">
            <StickyNote className="w-5 h-5 text-[#00ff9d] group-hover:scale-110 transition-transform" />
            {notes.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#00ff9d] text-black text-[10px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {notes.length}
              </span>
            )}
          </div>
          <span className="[writing-mode:vertical-lr] text-xs font-mono font-bold text-slate-300 group-hover:text-white uppercase tracking-wider">
            Quick Notes
          </span>
          {currentContextNotesCount > 0 && (
            <span
              className="text-[9px] bg-[#00ff9d]/20 text-[#00ff9d] border border-[#00ff9d]/40 rounded px-1 font-mono mt-1"
              title={`${currentContextNotesCount} notes for current tab`}
            >
              {currentContextNotesCount}
            </span>
          )}
        </button>
      )}

      {/* Slide-out Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity animate-in fade-in"
        />
      )}

      {/* Slide-out Panel Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[480px] lg:w-[540px] z-50 bg-[#0c0e11] text-slate-100 border-l border-[#1f2228] shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Panel Header */}
        <div className="p-4 bg-[#121417] border-b border-[#1f2228] flex flex-col gap-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#00ff9d]/10 border border-[#00ff9d]/30 text-[#00ff9d]">
                <StickyNote className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base text-white flex items-center gap-2">
                  Sticky Quick Notes
                  <span className="text-[10px] font-mono font-bold bg-[#00ff9d]/20 text-[#00ff9d] px-2 py-0.5 rounded-full border border-[#00ff9d]/30">
                    Alt + N
                  </span>
                </h2>
                <p className="text-xs text-slate-400">Context-aware thoughts, action items & reminders</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleExportMarkdown}
                title="Export all notes to Markdown"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1 font-mono"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopyNotes}
                title="Copy all notes to clipboard"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1 font-mono relative"
              >
                <Copy className="w-4 h-4" />
                {copiedNotification && (
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#00ff9d] text-black text-[9px] px-1.5 py-0.5 rounded font-mono font-bold whitespace-nowrap shadow">
                    Copied!
                  </span>
                )}
              </button>
              <button
                onClick={onToggle}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Current Active Context Badge */}
          <div className="bg-[#181b20] border border-[#262a33] rounded-xl p-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-[#00ff9d] shrink-0 animate-pulse" />
              <div className="min-w-0">
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Active Location Context</p>
                <p className="text-xs font-semibold text-white truncate">
                  {currentTabLabel}
                  {activeStepNumber && (
                    <span className="text-[#00ff9d] font-mono ml-1.5">
                      → Step #{activeStepNumber}: {activeStepName || ''}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setFilterMode(filterMode === 'context' ? 'all' : 'context');
              }}
              className={`text-[10px] font-mono px-2 py-1 rounded-lg border transition-all shrink-0 ${
                filterMode === 'context'
                  ? 'bg-[#00ff9d] text-black border-[#00ff9d] font-bold'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-[#00ff9d]/50'
              }`}
            >
              {filterMode === 'context' ? 'Showing This Tab' : 'Filter This Tab'}
            </button>
          </div>
        </div>

        {/* Action Controls & Quick Preset Templates */}
        <div className="p-3 bg-[#0f1115] border-b border-[#1f2228] flex flex-col gap-2 shrink-0">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsAddingNote(!isAddingNote)}
              className="w-full py-2 px-3 bg-[#00ff9d] hover:bg-[#00ff9d]/90 text-black font-mono font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,255,157,0.2)]"
            >
              <Plus className="w-4 h-4" /> {isAddingNote ? 'Cancel Note Creation' : 'Add Context Note / Reminder'}
            </button>
          </div>

          {/* Quick Preset Buttons if not adding */}
          {!isAddingNote && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-mono">
              <span className="text-[10px] text-slate-500 shrink-0 uppercase tracking-wider">Quick Presets:</span>
              <button
                onClick={() =>
                  handleApplyTemplate('reminder', 'Action Item: ', 'Task to complete for this startup phase.')
                }
                className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 whitespace-nowrap flex items-center gap-1"
              >
                <Clock className="w-3 h-3" /> +Action
              </button>
              <button
                onClick={() =>
                  handleApplyTemplate('risk', 'Risk Identified: ', 'Potential bottleneck or compliance risk to mitigate.')
                }
                className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 whitespace-nowrap flex items-center gap-1"
              >
                <AlertTriangle className="w-3 h-3" /> +Risk
              </button>
              <button
                onClick={() =>
                  handleApplyTemplate('decision', 'Key Decision: ', 'Strategic decision made regarding business model or feature.')
                }
                className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-indigo-400 border border-indigo-500/30 whitespace-nowrap flex items-center gap-1"
              >
                <Target className="w-3 h-3" /> +Decision
              </button>
              <button
                onClick={() =>
                  handleApplyTemplate('question', 'Advisor Question: ', 'Question to review with mentor, tax advisor, or legal counsel.')
                }
                className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-purple-400 border border-purple-500/30 whitespace-nowrap flex items-center gap-1"
              >
                <HelpCircle className="w-3 h-3" /> +Question
              </button>
            </div>
          )}

          {/* Inline Add Note Form */}
          {isAddingNote && (
            <form onSubmit={handleAddNote} className="bg-[#15181e] border border-[#262a33] rounded-xl p-3 flex flex-col gap-2.5 mt-1 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#00ff9d] font-mono flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> New Note attached to {activeTab}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {activeStepNumber ? `Step #${activeStepNumber}` : 'General Tab'}
                </span>
              </div>

              <input
                type="text"
                placeholder="Note title or task summary..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-[#0c0e11] border border-[#262a33] rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00ff9d]"
                autoFocus
              />

              <textarea
                rows={3}
                placeholder="Write detailed context, metrics, reminders, or instructions..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full bg-[#0c0e11] border border-[#262a33] rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00ff9d] resize-none"
              />

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">Category Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as QuickNoteType)}
                    className="w-full bg-[#0c0e11] border border-[#262a33] rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-[#00ff9d]"
                  >
                    <option value="note">📝 General Note</option>
                    <option value="reminder">⏰ Action / Reminder</option>
                    <option value="decision">🎯 Strategic Decision</option>
                    <option value="risk">⚠️ Risk / Bottleneck</option>
                    <option value="question">❓ Advisor Question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">Priority Level</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as QuickNotePriority)}
                    className="w-full bg-[#0c0e11] border border-[#262a33] rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-[#00ff9d]"
                  >
                    <option value="low">🟢 Low Priority</option>
                    <option value="medium">🟡 Medium Priority</option>
                    <option value="high">🔴 High Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Funding, CapTable, IRS, Q3"
                  value={newTagsInput}
                  onChange={(e) => setNewTagsInput(e.target.value)}
                  className="w-full bg-[#0c0e11] border border-[#262a33] rounded-lg px-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00ff9d]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingNote(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#00ff9d] text-black font-mono font-bold text-xs rounded-lg hover:bg-[#00ff9d]/90 flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Save Note
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Filter Toolbar */}
        <div className="px-3 py-2 bg-[#0c0e11] border-b border-[#1f2228] flex flex-col gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search notes, tags, or context..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#15181e] border border-[#262a33] rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00ff9d]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                >
                  ×
                </button>
              )}
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-[#15181e] border border-[#262a33] rounded-lg px-2 py-1 text-xs text-slate-300 font-mono focus:outline-none focus:border-[#00ff9d]"
            >
              <option value="all">All Types</option>
              <option value="reminder">⏰ Reminders</option>
              <option value="risk">⚠️ Risks</option>
              <option value="decision">🎯 Decisions</option>
              <option value="question">❓ Questions</option>
              <option value="note">📝 Notes</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[10px] font-mono">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-lg border transition-all whitespace-nowrap ${
                filterMode === 'all'
                  ? 'bg-slate-800 text-white border-slate-600 font-bold'
                  : 'bg-transparent text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              All Notes ({notes.length})
            </button>
            <button
              onClick={() => setFilterMode('context')}
              className={`px-2.5 py-1 rounded-lg border transition-all whitespace-nowrap ${
                filterMode === 'context'
                  ? 'bg-[#00ff9d]/20 text-[#00ff9d] border-[#00ff9d]/50 font-bold'
                  : 'bg-transparent text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Current Tab ({currentContextNotesCount})
            </button>
            <button
              onClick={() => setFilterMode('pinned')}
              className={`px-2.5 py-1 rounded-lg border transition-all whitespace-nowrap ${
                filterMode === 'pinned'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                  : 'bg-transparent text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              📌 Pinned ({notes.filter((n) => n.isPinned).length})
            </button>
            <button
              onClick={() => setFilterMode('reminders')}
              className={`px-2.5 py-1 rounded-lg border transition-all whitespace-nowrap ${
                filterMode === 'reminders'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                  : 'bg-transparent text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              ⏰ Action Items ({notes.filter((n) => n.type === 'reminder' && !n.isCompleted).length})
            </button>
          </div>
        </div>

        {/* Scrollable Notes List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-slate-800">
          {sortedNotes.length === 0 ? (
            <div className="p-8 text-center bg-[#121417]/50 rounded-2xl border border-dashed border-[#262a33] my-4">
              <StickyNote className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">No notes found for this filter</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                {filterMode === 'context'
                  ? `No notes attached to "${currentTabLabel}". Click "Add Context Note" to write one.`
                  : 'Try clearing your search or adding a new context note.'}
              </p>
              <button
                onClick={() => setIsAddingNote(true)}
                className="mt-4 px-3.5 py-1.5 bg-[#00ff9d] text-black font-mono font-bold text-xs rounded-xl hover:bg-[#00ff9d]/90 inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Create Note Now
              </button>
            </div>
          ) : (
            sortedNotes.map((note) => {
              const typeBadge = getTypeBadge(note.type);
              const TypeIcon = typeBadge.icon;
              const priorityStyle = getPriorityBadge(note.priority);
              const isEditing = editingNoteId === note.id;

              return (
                <div
                  key={note.id}
                  className={`bg-[#13161c] border rounded-2xl p-3.5 transition-all flex flex-col gap-2 relative group ${
                    note.isPinned
                      ? 'border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.08)] bg-[#171a22]'
                      : 'border-[#222630] hover:border-[#323847]'
                  } ${note.isCompleted ? 'opacity-60' : ''}`}
                >
                  {/* Card Top Row: Context & Action Icons */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full border flex items-center gap-1 ${typeBadge.bg}`}
                      >
                        <TypeIcon className="w-3 h-3" /> {typeBadge.label}
                      </span>

                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase ${priorityStyle}`}>
                        {note.priority}
                      </span>

                      {/* Location Badge */}
                      <span
                        className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 rounded px-2 py-0.5 truncate max-w-[200px]"
                        title={note.contextTabLabel}
                      >
                        {note.contextStepNumber ? `Step #${note.contextStepNumber}` : note.contextTab}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {/* Checkbox for Reminders */}
                      {note.type === 'reminder' && (
                        <button
                          onClick={() => handleToggleCompleted(note.id)}
                          title={note.isCompleted ? 'Mark incomplete' : 'Mark completed'}
                          className={`p-1 rounded hover:bg-slate-800 transition-colors ${
                            note.isCompleted ? 'text-emerald-400' : 'text-slate-500 hover:text-emerald-400'
                          }`}
                        >
                          {note.isCompleted ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                        </button>
                      )}

                      {/* Pin Toggle */}
                      <button
                        onClick={() => handleTogglePin(note.id)}
                        title={note.isPinned ? 'Unpin note' : 'Pin note to top'}
                        className={`p-1 rounded hover:bg-slate-800 transition-colors ${
                          note.isPinned ? 'text-amber-400' : 'text-slate-600 hover:text-slate-300'
                        }`}
                      >
                        <Pin className="w-3.5 h-3.5 fill-current" />
                      </button>

                      {/* Edit Toggle */}
                      <button
                        onClick={() => (isEditing ? setEditingNoteId(null) : handleStartEdit(note))}
                        title="Edit note"
                        className="p-1 text-slate-600 hover:text-white rounded hover:bg-slate-800 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Note */}
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        title="Delete note"
                        className="p-1 text-slate-600 hover:text-red-400 rounded hover:bg-slate-800 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Card Content OR Editing View */}
                  {isEditing ? (
                    <div className="bg-[#0a0b0e] border border-[#262a33] rounded-xl p-2.5 flex flex-col gap-2 my-1">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full bg-[#13161c] border border-slate-700 rounded px-2 py-1 text-xs text-white"
                      />
                      <textarea
                        rows={3}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full bg-[#13161c] border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 resize-none"
                      />
                      <div className="flex items-center justify-between text-xs pt-1">
                        <select
                          value={editType}
                          onChange={(e) => setEditType(e.target.value as QuickNoteType)}
                          className="bg-[#13161c] border border-slate-700 rounded px-2 py-0.5 text-xs text-slate-300"
                        >
                          <option value="note">📝 Note</option>
                          <option value="reminder">⏰ Reminder</option>
                          <option value="decision">🎯 Decision</option>
                          <option value="risk">⚠️ Risk</option>
                          <option value="question">❓ Question</option>
                        </select>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingNoteId(null)}
                            className="text-xs text-slate-400 hover:text-white font-mono"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEdit(note.id)}
                            className="px-2.5 py-1 bg-[#00ff9d] text-black font-mono font-bold text-xs rounded hover:bg-[#00ff9d]/90"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3
                        className={`text-xs font-bold text-white leading-snug ${
                          note.isCompleted ? 'line-through text-slate-400' : ''
                        }`}
                      >
                        {note.title}
                      </h3>

                      {note.content && (
                        <p
                          className={`text-xs text-slate-300 whitespace-pre-wrap leading-relaxed ${
                            note.isCompleted ? 'line-through text-slate-500' : ''
                          }`}
                        >
                          {note.content}
                        </p>
                      )}

                      {/* Card Footer: Tags & Date */}
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-800/60 mt-1">
                        <div className="flex items-center gap-1 flex-wrap">
                          {note.tags &&
                            note.tags.map((tag) => (
                              <span key={tag} className="text-slate-400 hover:text-[#00ff9d]">
                                #{tag}
                              </span>
                            ))}
                        </div>
                        <span className="flex items-center gap-1 text-[9px] text-slate-500">
                          <Clock className="w-2.5 h-2.5" />
                          {new Date(note.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Panel Footer */}
        <div className="p-3 bg-[#121417] border-t border-[#1f2228] flex items-center justify-between text-[11px] font-mono text-slate-400 shrink-0">
          <span>{notes.length} total saved thoughts</span>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to clear all quick notes?')) {
                setNotes([]);
              }
            }}
            className="text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" /> Clear All
          </button>
        </div>
      </div>
    </>
  );
};
