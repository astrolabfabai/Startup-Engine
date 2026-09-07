import React, { useState } from 'react';
import {
  Zap,
  TrendingUp,
  ShieldCheck,
  Building2,
  Lock,
  DollarSign,
  Briefcase,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Share2,
  RotateCcw,
  Sliders,
  ChevronRight,
  ExternalLink,
  Target,
  Rocket,
  Award,
} from 'lucide-react';

export interface AutonomousSwitchesState {
  fullyAutonomousMode: boolean;
  buildToSaleMode: boolean;
  autoPilotGrants: boolean;
  autoPilotLifecycle: boolean;
  autoPilotTaxDeductions: boolean;
  autoPilotBusinessPlan: boolean;
  autoPilotMunicipalSync: boolean;
  targetExitValuation: number; // in Millions USD (e.g. 75 = $75M)
  targetExitHorizonYears: number; // e.g. 3 years
  selectedAcquirerSectors: string[];
}

interface AutonomousSwitchboardProps {
  businessName?: string;
  activeModelName: string;
  switchesState: AutonomousSwitchesState;
  onUpdateSwitches: (updated: Partial<AutonomousSwitchesState>) => void;
  onExecuteAutomatedCycle?: () => void;
}

export const AutonomousSwitchboard: React.FC<AutonomousSwitchboardProps> = ({
  businessName = 'ASTRO LAB FAB',
  activeModelName,
  switchesState,
  onUpdateSwitches,
  onExecuteAutomatedCycle,
}) => {
  const safeBusinessName = businessName || 'ASTRO LAB FAB';
  const [activeSubTab, setActiveSubTab] = useState<'switches' | 'build_to_sale' | 'acquirers' | 'data_room'>('switches');
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // M&A Acquirers database
  const STRATEGIC_ACQUIRERS = [
    {
      name: 'Tier 1 Enterprise Tech (Alphabet, Microsoft, Oracle, Salesforce)',
      type: 'Strategic Hyperscaler',
      typicalMultiple: '12x - 22x ARR',
      sweetSpotValuation: '$100M - $500M+',
      acquisitionFocus: 'Proprietary AI Models, Autonomous Workflows, Government Cloud footprint, IP patents',
    },
    {
      name: 'Defense Primes & GovTech (Palantir, Booz Allen, General Dynamics, Leidos)',
      type: 'Defense & B2G Integrator',
      typicalMultiple: '8x - 15x ARR',
      sweetSpotValuation: '$50M - $250M',
      acquisitionFocus: 'SAM.gov UEI active contracts, CJIS/FedRAMP compliance, SBIR Phase III sole-source rights',
    },
    {
      name: 'Software Private Equity (Vista Equity, Thoma Bravo, Insight Partners)',
      type: 'Growth Buyout PE',
      typicalMultiple: '15x - 25x EBITDA',
      sweetSpotValuation: '$40M - $200M',
      acquisitionFocus: 'Rule of 40 (Growth% + Profit% > 40%), Net Retention > 115%, High Gross Margins > 80%',
    },
    {
      name: 'Vertical SaaS Aggregators & Municipal Consolidators (Tyler Technologies, Constellation Software)',
      type: 'Vertical Consolidation',
      typicalMultiple: '6x - 12x ARR',
      sweetSpotValuation: '$20M - $100M',
      acquisitionFocus: 'Municipal contracts, county revenue share lock-in, low customer churn (<3%)',
    },
  ];

  const handleCopyTeaser = () => {
    const teaser = `# EXECUTIVE ACQUISITION TEASER — CONFIDENTIAL
**Target Company:** ${safeBusinessName}
**Architecture:** ${activeModelName}
**Target Valuation:** $${switchesState.targetExitValuation}M USD (${switchesState.targetExitHorizonYears}-Year Target Window)
**Core Moats:**
- 145-Step Autonomous Execution Engine
- Proprietary IP Architecture & Clean Room Chain of Title
- Federal Grants & SAM.gov Defense/Municipal Registration Active
- Zero Key-Person Dependency (Standardized SOP Matrix & Automated Pipeline)
- Projected ARR: $8.5M at Exit with 82% Gross Margins

*Prepared for Qualified Strategic & PE Acquirers under Mutual NDA.*`;

    navigator.clipboard.writeText(teaser);
    setCopiedNotification('M&A Teaser copied to clipboard!');
    setTimeout(() => setCopiedNotification(null), 2500);
  };

  return (
    <div className="bg-[#121417] border border-[#1f2228] rounded-2xl p-6 text-slate-100 shadow-2xl space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#1f2228]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> Autonomous Execution Engine
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
              switchesState.buildToSaleMode
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}>
              {switchesState.buildToSaleMode ? '🔥 BUILD-TO-SALE MODE ACTIVE' : 'Organic Scale Mode'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#00ff9d]" />
            Autonomous Master Switchboard & Build-to-Sale War Room
          </h2>
          <p className="text-xs text-[#888e96] mt-0.5">
            Configure fully autonomous execution triggers, grant application bots, and 10x-20x M&A acquisition exit engineering for <span className="text-white font-semibold">{safeBusinessName}</span>.
          </p>
        </div>

        {/* Global Quick Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const allOn = !switchesState.fullyAutonomousMode;
              onUpdateSwitches({
                fullyAutonomousMode: allOn,
                buildToSaleMode: allOn ? true : switchesState.buildToSaleMode,
                autoPilotGrants: allOn,
                autoPilotLifecycle: allOn,
                autoPilotTaxDeductions: allOn,
                autoPilotBusinessPlan: allOn,
                autoPilotMunicipalSync: allOn,
              });
            }}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-lg ${
              switchesState.fullyAutonomousMode
                ? 'bg-[#00ff9d] text-black shadow-[0_0_20px_rgba(0,255,157,0.4)]'
                : 'bg-[#1f2228] text-slate-300 hover:bg-[#282c34] hover:text-white border border-[#2d3139]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {switchesState.fullyAutonomousMode ? '100% AUTONOMOUS (ALL ON)' : 'ACTIVATE 100% AUTONOMOUS'}
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-[#08090a] p-1.5 rounded-xl border border-[#1f2228]">
        <button
          onClick={() => setActiveSubTab('switches')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
            activeSubTab === 'switches'
              ? 'bg-[#00ff9d] text-black shadow-[0_0_12px_rgba(0,255,157,0.3)]'
              : 'text-[#888e96] hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" /> Automated Master Switches
        </button>
        <button
          onClick={() => setActiveSubTab('build_to_sale')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
            activeSubTab === 'build_to_sale'
              ? 'bg-amber-400 text-black shadow-[0_0_12px_rgba(251,191,36,0.3)]'
              : 'text-[#888e96] hover:text-white'
          }`}
        >
          <Target className="w-3.5 h-3.5" /> Build-to-Sale (M&A Strategy)
        </button>
        <button
          onClick={() => setActiveSubTab('acquirers')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
            activeSubTab === 'acquirers'
              ? 'bg-cyan-400 text-black shadow-[0_0_12px_rgba(34,211,238,0.3)]'
              : 'text-[#888e96] hover:text-white'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" /> Strategic Acquirer Matrix
        </button>
        <button
          onClick={() => setActiveSubTab('data_room')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
            activeSubTab === 'data_room'
              ? 'bg-purple-400 text-black shadow-[0_0_12px_rgba(192,132,252,0.3)]'
              : 'text-[#888e96] hover:text-white'
          }`}
        >
          <Lock className="w-3.5 h-3.5" /> M&A Virtual Data Room (VDR)
        </button>
      </div>

      {/* Tab 1: Automated Master Switches */}
      {activeSubTab === 'switches' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Switch 1: Full Autonomy */}
          <div className={`p-4 rounded-xl border transition-all ${
            switchesState.fullyAutonomousMode ? 'bg-[#00ff9d]/5 border-[#00ff9d]/40' : 'bg-[#08090a] border-[#1f2228]'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00ff9d]" />
                <h4 className="text-xs font-bold text-white uppercase font-mono">100% Autonomous Enterprise</h4>
              </div>
              <button
                onClick={() => onUpdateSwitches({ fullyAutonomousMode: !switchesState.fullyAutonomousMode })}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  switchesState.fullyAutonomousMode ? 'bg-[#00ff9d]' : 'bg-[#1f2228]'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-black transition-transform absolute top-1 ${
                  switchesState.fullyAutonomousMode ? 'right-1' : 'left-1'
                }`} />
              </button>
            </div>
            <p className="text-[11px] text-[#888e96] leading-relaxed">
              Auto-coordinates cross-tab state, grants applications, tax optimization, and step milestone validations simultaneously.
            </p>
          </div>

          {/* Switch 2: Build-to-Sale Mode */}
          <div className={`p-4 rounded-xl border transition-all ${
            switchesState.buildToSaleMode ? 'bg-amber-500/5 border-amber-500/40' : 'bg-[#08090a] border-[#1f2228]'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-white uppercase font-mono">Build-to-Sale (M&A Exit)</h4>
              </div>
              <button
                onClick={() => onUpdateSwitches({ buildToSaleMode: !switchesState.buildToSaleMode })}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  switchesState.buildToSaleMode ? 'bg-amber-400' : 'bg-[#1f2228]'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-black transition-transform absolute top-1 ${
                  switchesState.buildToSaleMode ? 'right-1' : 'left-1'
                }`} />
              </button>
            </div>
            <p className="text-[11px] text-[#888e96] leading-relaxed">
              Engineers all operational SOPs, cap table structure, and IP chain of title for a $50M-$250M strategic buyout.
            </p>
          </div>

          {/* Switch 3: Auto-Pilot Grants */}
          <div className={`p-4 rounded-xl border transition-all ${
            switchesState.autoPilotGrants ? 'bg-cyan-500/5 border-cyan-500/40' : 'bg-[#08090a] border-[#1f2228]'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold text-white uppercase font-mono">Auto-Pilot Grants & Paperwork</h4>
              </div>
              <button
                onClick={() => onUpdateSwitches({ autoPilotGrants: !switchesState.autoPilotGrants })}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  switchesState.autoPilotGrants ? 'bg-cyan-400' : 'bg-[#1f2228]'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-black transition-transform absolute top-1 ${
                  switchesState.autoPilotGrants ? 'right-1' : 'left-1'
                }`} />
              </button>
            </div>
            <p className="text-[11px] text-[#888e96] leading-relaxed">
              Automatically pre-fills SF-424, SAM.gov UEI profiles, and generates Playwright automation scripts for Day 1 filings.
            </p>
          </div>

          {/* Switch 4: Auto-Pilot Lifecycle */}
          <div className={`p-4 rounded-xl border transition-all ${
            switchesState.autoPilotLifecycle ? 'bg-emerald-500/5 border-emerald-500/40' : 'bg-[#08090a] border-[#1f2228]'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Rocket className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white uppercase font-mono">Auto-Pilot 145-Step Lifecycle</h4>
              </div>
              <button
                onClick={() => onUpdateSwitches({ autoPilotLifecycle: !switchesState.autoPilotLifecycle })}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  switchesState.autoPilotLifecycle ? 'bg-emerald-400' : 'bg-[#1f2228]'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-black transition-transform absolute top-1 ${
                  switchesState.autoPilotLifecycle ? 'right-1' : 'left-1'
                }`} />
              </button>
            </div>
            <p className="text-[11px] text-[#888e96] leading-relaxed">
              Autonomous phase progression, driver validation calculations, and AI deliverable verification logging.
            </p>
          </div>

          {/* Switch 5: Auto-Pilot Tax Optimizer */}
          <div className={`p-4 rounded-xl border transition-all ${
            switchesState.autoPilotTaxDeductions ? 'bg-purple-500/5 border-purple-500/40' : 'bg-[#08090a] border-[#1f2228]'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-bold text-white uppercase font-mono">Auto-Pilot Tax & S-Corp</h4>
              </div>
              <button
                onClick={() => onUpdateSwitches({ autoPilotTaxDeductions: !switchesState.autoPilotTaxDeductions })}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  switchesState.autoPilotTaxDeductions ? 'bg-purple-400' : 'bg-[#1f2228]'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-black transition-transform absolute top-1 ${
                  switchesState.autoPilotTaxDeductions ? 'right-1' : 'left-1'
                }`} />
              </button>
            </div>
            <p className="text-[11px] text-[#888e96] leading-relaxed">
              Dynamically maps Mark Kohler's Tax Trifecta (S-Corp + Trust + Holding LLC) with live deductions and QBI optimization.
            </p>
          </div>

          {/* Switch 6: Auto-Pilot Business Plan & Municipal Sync */}
          <div className={`p-4 rounded-xl border transition-all ${
            switchesState.autoPilotBusinessPlan ? 'bg-rose-500/5 border-rose-500/40' : 'bg-[#08090a] border-[#1f2228]'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-rose-400" />
                <h4 className="text-xs font-bold text-white uppercase font-mono">Auto-Pilot Municipal Sync</h4>
              </div>
              <button
                onClick={() => onUpdateSwitches({
                  autoPilotBusinessPlan: !switchesState.autoPilotBusinessPlan,
                  autoPilotMunicipalSync: !switchesState.autoPilotMunicipalSync,
                })}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  switchesState.autoPilotBusinessPlan ? 'bg-rose-400' : 'bg-[#1f2228]'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-black transition-transform absolute top-1 ${
                  switchesState.autoPilotBusinessPlan ? 'right-1' : 'left-1'
                }`} />
              </button>
            </div>
            <p className="text-[11px] text-[#888e96] leading-relaxed">
              Auto-compiles complete 8-section enterprise and municipal business plans using live sector metrics and financial forecasts.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Build-to-Sale Strategy Configuration */}
      {activeSubTab === 'build_to_sale' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#08090a] border border-[#1f2228] p-4 rounded-xl">
              <label className="text-xs font-mono uppercase text-[#888e96] block mb-1">Target Exit Valuation ($M USD)</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="10"
                  max="300"
                  step="5"
                  value={switchesState.targetExitValuation}
                  onChange={(e) => onUpdateSwitches({ targetExitValuation: Number(e.target.value) })}
                  className="flex-1 accent-amber-400"
                />
                <span className="text-lg font-bold font-mono text-amber-400">${switchesState.targetExitValuation}M</span>
              </div>
              <p className="text-[10px] text-[#888e96] mt-1">Based on 12x ARR multiple at $6.25M ARR.</p>
            </div>

            <div className="bg-[#08090a] border border-[#1f2228] p-4 rounded-xl">
              <label className="text-xs font-mono uppercase text-[#888e96] block mb-1">Target Exit Window</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 5].map((yrs) => (
                  <button
                    key={yrs}
                    onClick={() => onUpdateSwitches({ targetExitHorizonYears: yrs })}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      switchesState.targetExitHorizonYears === yrs
                        ? 'bg-amber-400 text-black'
                        : 'bg-[#121417] text-[#888e96] hover:text-white border border-[#1f2228]'
                    }`}
                  >
                    {yrs} Year{yrs > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-[#888e96] mt-1">Velocity target: Month 36 strategic auction.</p>
            </div>

            <div className="bg-[#08090a] border border-[#1f2228] p-4 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-[#888e96] block">M&A Readiness Score</span>
                <div className="text-2xl font-bold font-mono text-[#00ff9d] mt-1">94.8 / 100</div>
              </div>
              <span className="text-[10px] text-[#888e96]">Tier-1 Acquisition Gate: PASSED (Clean IP & SOPs)</span>
            </div>
          </div>

          {/* 4 M&A Preparation Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-[#08090a] border border-[#1f2228] p-3.5 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <CheckCircle2 className="w-4 h-4 text-[#00ff9d]" /> 1. Clean IP Chain-of-Title
              </div>
              <p className="text-[11px] text-[#888e96]">All contractor IP assignment agreements executed and verified.</p>
            </div>
            <div className="bg-[#08090a] border border-[#1f2228] p-3.5 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <CheckCircle2 className="w-4 h-4 text-[#00ff9d]" /> 2. Zero Key-Person Risk
              </div>
              <p className="text-[11px] text-[#888e96]">100% of operations mapped to autonomous SOPs & scripts.</p>
            </div>
            <div className="bg-[#08090a] border border-[#1f2228] p-3.5 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <CheckCircle2 className="w-4 h-4 text-[#00ff9d]" /> 3. Rule of 40 Audit
              </div>
              <p className="text-[11px] text-[#888e96]">Projected 65% YoY growth + 20% Net Profit Margin = 85 (Grade A+).</p>
            </div>
            <div className="bg-[#08090a] border border-[#1f2228] p-3.5 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <CheckCircle2 className="w-4 h-4 text-[#00ff9d]" /> 4. Non-Dilutive Grant Moat
              </div>
              <p className="text-[11px] text-[#888e96]">SBIR Phase I/II sole-source rights transfer directly to acquirer.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Strategic Acquirer Matrix */}
      {activeSubTab === 'acquirers' && (
        <div className="space-y-3">
          <p className="text-xs text-[#888e96]">
            Pre-configured strategic and private equity buyers actively acquiring companies in the <span className="text-white font-semibold">{activeModelName}</span> domain:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {STRATEGIC_ACQUIRERS.map((acq, i) => (
              <div key={i} className="bg-[#08090a] border border-[#1f2228] p-4 rounded-xl space-y-2 hover:border-[#00ff9d]/30 transition-all">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-white">{acq.name}</h4>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 whitespace-nowrap">
                    {acq.typicalMultiple}
                  </span>
                </div>
                <div className="text-[11px] text-[#888e96] flex items-center justify-between">
                  <span>Type: <strong className="text-slate-300">{acq.type}</strong></span>
                  <span>Target Range: <strong className="text-[#00ff9d]">{acq.sweetSpotValuation}</strong></span>
                </div>
                <p className="text-[11px] text-slate-400 border-t border-[#1f2228] pt-2">
                  <strong className="text-slate-200">Acquisition Thesis:</strong> {acq.acquisitionFocus}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: M&A Virtual Data Room (VDR) */}
      {activeSubTab === 'data_room' && (
        <div className="bg-[#08090a] border border-[#1f2228] p-5 rounded-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-400" />
                M&A Clean Room & Confidential Teaser Generator
              </h4>
              <p className="text-xs text-[#888e96]">Generate 1-click confidential teasers and data room indices for potential buyers.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyTeaser}
                className="px-3.5 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" /> Copy M&A Teaser
              </button>
            </div>
          </div>

          {copiedNotification && (
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> {copiedNotification}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-[#121417] p-3 rounded-lg border border-[#1f2228]">
              <span className="text-[10px] font-mono text-[#888e96] uppercase">Folder 01</span>
              <h5 className="text-xs font-bold text-white mt-0.5">Corporate & Legal Governance</h5>
              <p className="text-[10px] text-[#888e96] mt-1">Articles of Organization, Cap Table, Operating Agreement, EIN.</p>
            </div>
            <div className="bg-[#121417] p-3 rounded-lg border border-[#1f2228]">
              <span className="text-[10px] font-mono text-[#888e96] uppercase">Folder 02</span>
              <h5 className="text-xs font-bold text-white mt-0.5">IP & Proprietary Tech</h5>
              <p className="text-[10px] text-[#888e96] mt-1">145-Step Engine code, IP assignment, patent disclosures.</p>
            </div>
            <div className="bg-[#121417] p-3 rounded-lg border border-[#1f2228]">
              <span className="text-[10px] font-mono text-[#888e96] uppercase">Folder 03</span>
              <h5 className="text-xs font-bold text-white mt-0.5">Financials & Grants</h5>
              <p className="text-[10px] text-[#888e96] mt-1">P&L Projections, SBIR sole-source certificates, Tax optimization.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
