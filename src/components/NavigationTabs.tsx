import React, { useState } from 'react';
import {
  ListChecks,
  Calculator,
  Palette,
  Briefcase,
  Receipt,
  Landmark,
  FileCode2,
  FolderTree,
  BookOpenCheck,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  Search,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  CornerDownRight,
  SlidersHorizontal,
  FileText,
  Building2,
  TrendingUp,
  Sparkles,
  Zap,
  StickyNote,
  Download,
  Upload,
  RefreshCw,
  Rocket,
  ShieldCheck,
  Award,
  Layers,
  PieChart,
  Target,
  Radio,
} from 'lucide-react';
import { TabId } from '../types';

export type { TabId };

export interface TreeCategory {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
  color: string;
  items: TreeItem[];
}

export interface TreeItem {
  id: TabId;
  label: string;
  icon: React.ElementType;
  badge?: string;
  highlight?: boolean;
  subNodes?: { id: string; label: string }[];
}

interface NavigationTabsProps {
  businessName?: string;
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
  completedStepsCount?: number;
  totalStepsCount?: number;
  overallScore?: number;
  activeModelName?: string;
  onExport?: () => void;
  onImport?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset?: () => void;
  onOpenQuickNotes?: () => void;
}

export const TREE_CATEGORIES: TreeCategory[] = [
  {
    id: 'executive_suite',
    label: '1. Executive Suite & Upgrades',
    icon: Zap,
    description: '25 high-throughput intelligence & acceleration tools',
    color: 'text-[#00ff9d]',
    items: [
      {
        id: 'upgrades',
        label: '25 Startup Engine Upgrades & Executive Suite',
        icon: Zap,
        badge: '25 Live Tools',
        highlight: true,
        subNodes: [
          { id: 'u1', label: '#1. AI Grant Proposal & Pitch Generator' },
          { id: 'u2', label: '#2. Financial Model & Runway Calculator' },
          { id: 'u3', label: '#3. Patent & IP Prior Art Search' },
          { id: 'u4', label: '#4. Target Buyer Persona & ICP Matrix' },
          { id: 'u5', label: '#5. TAM / SAM / SOM Market Sizing' },
          { id: 'u6', label: '#6. Competitor Battlecard & Diff Matrix' },
          { id: 'u7', label: '#7. GTM Channel Playbook' },
          { id: 'u8', label: '#8. IRS BMF & EIN Verification Checker' },
          { id: 'u9', label: '#9. SAM.gov Audit & Readiness Scorecard' },
          { id: 'u10', label: '#10. Product Roadmap (MoSCoW)' },
          { id: 'u11', label: '#11. Pricing Strategy & Unit Economics' },
          { id: 'u12', label: '#12. Federal & State Tax Matrix (IRC §41)' },
          { id: 'u13', label: '#13. Regulatory Scanner (HIPAA/SOC2)' },
          { id: 'u14', label: '#14. Equity Allocator & Advisory' },
          { id: 'u15', label: '#15. Cap Table & Capital Stack Sim' },
          { id: 'u16', label: '#16. 10-Slide Pitch Deck Blueprint' },
          { id: 'u17', label: '#17. USAspending Federal Contract Finder' },
          { id: 'u18', label: '#18. Tech Architecture & Cloud Spec' },
          { id: 'u19', label: '#19. Sales Funnel & Velocity Calculator' },
          { id: 'u20', label: '#20. CAC Payback Period Curve' },
          { id: 'u21', label: '#21. Industry Benchmark & Metrics' },
          { id: 'u22', label: '#22. One-Page Lean Canvas Generator' },
          { id: 'u23', label: '#23. Startup Dossier Export Hub' },
          { id: 'u24', label: '#24. 30-60-90 Day Execution Checklist' },
          { id: 'u25', label: '#25. Multi-Agent AI Executive Board' },
        ],
      },
    ],
  },
  {
    id: 'market_strategy',
    label: '2. Market & Strategy',
    icon: Landmark,
    description: 'Industry data, grants, viability scores & models',
    color: 'text-cyan-400',
    items: [
      {
        id: 'grants',
        label: 'Grants Pool & Funding Engine',
        icon: Landmark,
        badge: 'Grants.gov + Playwright Bot',
        highlight: true,
        subNodes: [
          { id: 'grants_solicitations', label: 'Grants.gov Federal Pool & Multi-Select' },
          { id: 'paperwork_filings', label: 'Secure Business Documents & Enclave Auto-Apply' },
          { id: 'playwright_scripts', label: 'Playwright Headless Automation & Scripts' },
          { id: 'post_grants_gov', label: 'Post-Grants.gov Full Lifecycle Engine' },
          { id: 'industry_needs', label: 'Market Needs & Unmet Industry Gaps' },
          { id: 'viability_calculator', label: 'Dynamic Business Viability Scorecard' },
        ],
      },
      {
        id: 'plan',
        label: 'Business Models & Auto-Plan Generator',
        icon: Briefcase,
        badge: 'Municipal & Build-to-Sale',
        subNodes: [
          { id: 'model_architectures', label: '10 Models (Municipal, P3, GovTech, Build-to-Sale)' },
          { id: 'auto_plan_gen', label: 'Auto-Generate Full 8-Section Plan' },
          { id: 'build_to_sale_section', label: 'Build-to-Sale M&A Playbook' },
        ],
      },
    ],
  },
  {
    id: 'execution_lifecycle',
    label: '3. Execution Lifecycle',
    icon: ListChecks,
    description: '145 steps, 11 framework modules & SOPs',
    color: 'text-emerald-400',
    items: [
      {
        id: 'lifecycle',
        label: '145-Step Lifecycle Engine',
        icon: ListChecks,
        badge: '10 Phases + Auto-Pilot',
        subNodes: [
          { id: 'sequential_phases', label: '10 Sequential Startup Phases' },
          { id: 'auto_pilot_runner', label: 'Autonomous Batch Phase Advance' },
          { id: 'milestone_deliverables', label: 'Key Milestones & Deliverables' },
          { id: 'driver_scores', label: 'Decision Gates & Drivers' },
        ],
      },
      {
        id: 'framework',
        label: 'Business Framework JSON',
        icon: FolderTree,
        badge: '11 Modules & Substeps',
        subNodes: [
          { id: 'framework_modules', label: '11 Strategic Execution Modules' },
          { id: 'framework_substeps', label: 'Actionable Sub-step Trees' },
        ],
      },
      {
        id: 'sops',
        label: 'SOP & Workflow Library',
        icon: FileCode2,
        badge: 'CLI Prompts',
        subNodes: [
          { id: 'sops_standard', label: 'Standard Operating Procedures' },
          { id: 'cli_generators', label: 'CLI Prompt Generators' },
        ],
      },
    ],
  },
  {
    id: 'workbooks_assets',
    label: '4. Workbooks & Assets',
    icon: BookOpenCheck,
    description: 'Master manual, 11 forms & AI creative studio',
    color: 'text-purple-400',
    items: [
      {
        id: 'master_templates',
        label: 'Master Templates & Workbook',
        icon: BookOpenCheck,
        badge: 'Plan, Manual & 11 Forms',
        subNodes: [
          { id: 'manual_guide', label: 'Business Plan Manual Guide' },
          { id: 'forms_11', label: '11 Interactive Form Blueprints' },
        ],
      },
      {
        id: 'creative',
        label: 'Creative AI Asset Studio',
        icon: Palette,
        badge: 'UHD 8K Studio Quality',
        subNodes: [
          { id: 'brand_cards', label: 'UHD Business Cards & 4K Ad Studio' },
          { id: 'logo_generator', label: 'Brand & Logo Generator (300 DPI)' },
        ],
      },
    ],
  },
  {
    id: 'finance_valuation',
    label: '5. Valuation & Governance',
    icon: Calculator,
    description: '10 driver rubric & tax deduction engine',
    color: 'text-amber-400',
    items: [
      {
        id: 'valuation',
        label: 'Valuation & Decision Gates',
        icon: Calculator,
        badge: 'Score Rubric',
        subNodes: [
          { id: 'valuation_drivers', label: '10 Valuation Driver Scores' },
          { id: 'decision_gates', label: 'Decision Gate Scorecard' },
        ],
      },
      {
        id: 'tax',
        label: 'IRS Tax & Mark Kohler Trifecta',
        icon: Receipt,
        badge: "Mark's Tax Chart",
        subNodes: [
          { id: 'kohler_chart', label: "Mark Kohler Tax & Legal Trifecta Chart" },
          { id: 'tax_deductions', label: 'S-Corp Accountable Plan & Deductions' },
          { id: 'schedule_c', label: 'Schedule C & QBI 20% Optimization' },
        ],
      },
    ],
  },
];

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  businessName = 'ASTRO LAB FAB',
  activeTab,
  setActiveTab,
  isMobileOpen = false,
  setIsMobileOpen,
  completedStepsCount = 0,
  totalStepsCount = 145,
  overallScore = 0,
  activeModelName = 'SaaS',
  onExport,
  onImport,
  onReset,
  onOpenQuickNotes,
}) => {
  // Tree folder open/close state
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    executive_suite: true,
    market_strategy: true,
    execution_lifecycle: true,
    workbooks_assets: true,
    finance_valuation: true,
  });

  // Sidebar collapsed state for desktop
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Search filter inside tree
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected sub-node highlight state
  const [selectedSubNode, setSelectedSubNode] = useState<string | null>(null);

  // Find active category and item label for real-time tracking
  let activeCategoryLabel = 'Active Module';
  let activeItemLabel = 'Active Tab';
  for (const cat of TREE_CATEGORIES) {
    for (const item of cat.items) {
      if (item.id === activeTab) {
        activeCategoryLabel = cat.label.replace(/^[0-9.]+\s*/, '');
        activeItemLabel = item.label;
        break;
      }
    }
  }

  const toggleCategory = (catId: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const expandAll = () => {
    setOpenCategories({
      executive_suite: true,
      market_strategy: true,
      execution_lifecycle: true,
      workbooks_assets: true,
      finance_valuation: true,
    });
  };

  const collapseAll = () => {
    setOpenCategories({
      executive_suite: false,
      market_strategy: false,
      execution_lifecycle: false,
      workbooks_assets: false,
      finance_valuation: false,
    });
  };

  // Check if search matches an item
  const matchesSearch = (text: string) => {
    if (!searchQuery.trim()) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  const percent = Math.round((completedStepsCount / (totalStepsCount || 1)) * 100) || 0;

  return (
    <>
      {/* MOBILE OVERLAY BACKDROP */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen?.(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* SIDEBAR TREE CONTAINER */}
      <aside
        className={`fixed lg:sticky top-0 z-40 h-screen bg-[#0d0f12] border-r border-[#1f2228] font-mono text-slate-100 flex flex-col transition-all duration-300 shadow-2xl shrink-0 ${
          isCollapsed ? 'lg:w-20' : 'lg:w-84'
        } ${
          isMobileOpen ? 'translate-x-0 w-84' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* SIDEBAR HEADER / BRANDING & TOGGLE */}
        <div className="p-3.5 border-b border-[#1f2228] flex items-center justify-between bg-[#121417]/90 shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-[#00ff9d] text-black font-black flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(0,255,157,0.3)]">
              <FolderTree className="w-4 h-4 text-black" />
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-white uppercase tracking-wider truncate">
                    {businessName}
                  </span>
                  <span className="text-[9px] bg-[#00ff9d]/20 text-[#00ff9d] px-1.5 py-0.2 rounded border border-[#00ff9d]/30 shrink-0">
                    Live
                  </span>
                </div>
                <p className="text-[10px] text-[#888e96] truncate">
                  Astro Lab Fab Control Plane
                </p>
              </div>
            )}
          </div>

          {/* Desktop Collapse Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 text-[#888e96] hover:text-white hover:bg-[#1f2228] rounded-lg transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-[#00ff9d]" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileOpen?.(false)}
            className="lg:hidden p-1.5 text-[#888e96] hover:text-white hover:bg-[#1f2228] rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* REAL-TIME ACTIVE STATION TRACKER (Always informs user where they are in real-time) */}
        {!isCollapsed && (
          <div className="px-3 py-2 bg-[#08090a] border-b border-[#1f2228] shrink-0">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff9d] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00ff9d]"></span>
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[9px] text-[#888e96] uppercase font-bold flex items-center justify-between">
                  <span>REALTIME STATION:</span>
                  <span className="text-[#00ff9d] font-mono">{activeTab.toUpperCase()}</span>
                </div>
                <div className="text-[11px] font-bold text-white truncate">
                  {activeItemLabel}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COMBINED EXECUTIVE CONTROLS STRIP (Only visible when expanded) */}
        {!isCollapsed && (
          <div className="p-3 border-b border-[#1f2228] bg-[#08090a]/60 space-y-2.5 shrink-0">
            {/* Quick Status Bar */}
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-[#121417] p-2 rounded-lg border border-[#1f2228]">
                <div className="text-[#888e96] text-[9px] uppercase font-bold flex items-center gap-1">
                  <span className="status-glow"></span> Lifecycle
                </div>
                <div className="font-bold text-white mt-0.5">
                  {completedStepsCount}/{totalStepsCount} <span className="text-[#00ff9d]">({percent}%)</span>
                </div>
              </div>

              <div className="bg-[#121417] p-2 rounded-lg border border-[#1f2228]">
                <div className="text-[#888e96] text-[9px] uppercase font-bold flex items-center gap-1">
                  <TrendingUp className="w-2.5 h-2.5 text-amber-400" /> Valuation
                </div>
                <div className="font-bold text-amber-400 mt-0.5 flex items-center justify-between">
                  <span>{overallScore.toFixed(2)}/10</span>
                  <span
                    className={`text-[8px] font-mono font-bold px-1 rounded ${
                      overallScore >= 7.0
                        ? 'bg-[#00ff9d]/20 text-[#00ff9d]'
                        : overallScore >= 5.0
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {overallScore >= 7.0 ? 'GO' : overallScore >= 5.0 ? 'REV' : 'STOP'}
                  </span>
                </div>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#888e96] absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Filter 25 upgrades & menus..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#121417] border border-[#1f2228] rounded-lg pl-7 pr-3 py-1 text-[11px] text-slate-100 placeholder-[#888e96] focus:outline-none focus:border-[#00ff9d] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1.5 text-[#888e96] hover:text-white text-xs"
                >
                  ×
                </button>
              )}
            </div>

            {/* Tree Expand / Collapse Controls */}
            <div className="flex items-center justify-between text-[10px] text-[#888e96] px-1">
              <span className="flex items-center gap-1 font-semibold text-slate-400">
                <SlidersHorizontal className="w-2.5 h-2.5 text-[#00ff9d]" /> Left Menu Hub
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={expandAll}
                  className="hover:text-[#00ff9d] transition-colors"
                  title="Expand All Folders"
                >
                  + Expand
                </button>
                <span>|</span>
                <button
                  onClick={collapseAll}
                  className="hover:text-amber-400 transition-colors"
                  title="Collapse All Folders"
                >
                  - Collapse
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TREE VIEW SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2.5 scrollbar-none">
          {TREE_CATEGORIES.map((category) => {
            const isCategoryOpen = openCategories[category.id] || searchQuery.length > 0;
            const CategoryIcon = category.icon;

            // Check if category has items matching search
            const matchingItems = category.items.filter((item) => {
              if (!searchQuery) return true;
              const matchesItem = matchesSearch(item.label) || matchesSearch(item.badge || '');
              const matchesSub = item.subNodes?.some((sub) => matchesSearch(sub.label));
              return matchesItem || matchesSub;
            });

            if (searchQuery && matchingItems.length === 0) return null;

            return (
              <div
                key={category.id}
                className="rounded-xl border border-[#1f2228] bg-[#121417]/50 overflow-hidden transition-all"
              >
                {/* CATEGORY FOLDER HEADER */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className={`w-full text-left p-2.5 flex items-center justify-between transition-all hover:bg-[#1f2228]/80 ${
                    isCollapsed ? 'justify-center' : ''
                  }`}
                  title={category.label}
                >
                  <div className="flex items-center gap-2 truncate">
                    {/* Folder Icon */}
                    <div className="text-slate-400 shrink-0">
                      {isCategoryOpen ? (
                        <FolderOpen className={`w-4 h-4 ${category.color}`} />
                      ) : (
                        <Folder className="w-4 h-4 text-slate-500" />
                      )}
                    </div>

                    {!isCollapsed && (
                      <div className="truncate">
                        <span className="text-xs font-bold text-slate-200 block truncate">
                          {category.label}
                        </span>
                        <span className="text-[9px] text-[#888e96] block truncate font-sans">
                          {category.description}
                        </span>
                      </div>
                    )}
                  </div>

                  {!isCollapsed && (
                    <div className="text-[#888e96] shrink-0 ml-1">
                      {isCategoryOpen ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </div>
                  )}
                </button>

                {/* CATEGORY TREE BRANCHES & LEAF ITEMS */}
                {isCategoryOpen && (
                  <div className={`py-1 pr-1 border-t border-[#1f2228]/60 bg-[#08090a]/60 ${
                    isCollapsed ? 'px-1' : 'pl-3'
                  }`}>
                    <div className="border-l border-slate-800 space-y-1 pl-2">
                      {matchingItems.map((item) => {
                        const ItemIcon = item.icon;
                        const isActive = activeTab === item.id;

                        return (
                          <div key={item.id} className="space-y-1">
                            {/* TAB LEAF BUTTON */}
                            <button
                              onClick={() => {
                                setActiveTab(item.id);
                                setSelectedSubNode(null);
                                setIsMobileOpen?.(false);
                              }}
                              className={`w-full text-left p-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-all group ${
                                isCollapsed ? 'justify-center px-1' : ''
                              } ${
                                isActive
                                  ? 'bg-[#00ff9d] text-black font-bold shadow-[0_0_15px_rgba(0,255,157,0.3)] ring-1 ring-[#00ff9d]'
                                  : item.highlight
                                  ? 'bg-[#00ff9d]/10 text-white hover:bg-[#00ff9d]/20 border border-[#00ff9d]/40'
                                  : 'text-slate-300 hover:text-white hover:bg-[#1f2228] border border-transparent'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                {/* Visual Branch Connector */}
                                {!isCollapsed && (
                                  <span className={`text-[10px] ${isActive ? 'text-black font-bold' : 'text-slate-600'}`}>
                                    {isActive ? '▶' : '├─'}
                                  </span>
                                )}

                                <ItemIcon
                                  className={`w-3.5 h-3.5 shrink-0 ${
                                    isActive
                                      ? 'text-black'
                                      : item.highlight
                                      ? 'text-[#00ff9d]'
                                      : 'text-slate-400 group-hover:text-[#00ff9d]'
                                  }`}
                                />

                                {!isCollapsed && (
                                  <span className="truncate">{item.label}</span>
                                )}
                              </div>

                              {!isCollapsed && item.badge && (
                                <span
                                  className={`text-[9px] px-1.5 py-0.5 rounded font-mono shrink-0 ml-1 ${
                                    isActive
                                      ? 'bg-black/20 text-black font-bold'
                                      : item.highlight
                                      ? 'bg-[#00ff9d]/20 text-[#00ff9d] border border-[#00ff9d]/40'
                                      : 'bg-[#1f2228] text-[#888e96] border border-slate-800'
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </button>

                            {/* SUB-NODES BRANCH TREE (Only shown when category open & tab active or expanded) */}
                            {!isCollapsed && item.subNodes && (isActive || searchQuery.length > 0) && (
                              <div className="pl-4 space-y-0.5 border-l border-slate-800/80 my-1 max-h-64 overflow-y-auto">
                                {item.subNodes.map((sub) => {
                                  const isSubSelected = selectedSubNode === sub.id && isActive;
                                  return (
                                    <button
                                      key={sub.id}
                                      onClick={() => {
                                        setActiveTab(item.id);
                                        setSelectedSubNode(sub.id);
                                        setIsMobileOpen?.(false);
                                      }}
                                      className={`w-full text-left px-2 py-1 rounded text-[10px] flex items-center gap-1.5 transition-all ${
                                        isSubSelected
                                          ? 'text-[#00ff9d] font-bold bg-[#00ff9d]/10 border-l-2 border-[#00ff9d]'
                                          : 'text-[#888e96] hover:text-slate-200 hover:bg-[#1f2228]/40'
                                      }`}
                                    >
                                      <CornerDownRight className="w-2.5 h-2.5 text-slate-600 shrink-0" />
                                      <span className="truncate">{sub.label}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* SIDEBAR FOOTER / SUMMARY METRIC */}
        {!isCollapsed && (
          <div className="p-2.5 border-t border-[#1f2228] bg-[#08090a] shrink-0 space-y-1.5 text-[10px] text-[#888e96]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 font-bold text-slate-300">
                <Sparkles className="w-3 h-3 text-amber-400" /> Active View:
              </span>
              <span className="text-[#00ff9d] font-mono font-bold uppercase">
                {activeTab}
              </span>
            </div>
            <div className="bg-[#121417] p-1.5 rounded border border-[#1f2228] flex items-center justify-between text-[9px]">
              <span>Model: <strong className="text-white">{activeModelName}</strong></span>
              <span className="text-[#00ff9d]">● Live Sync</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
