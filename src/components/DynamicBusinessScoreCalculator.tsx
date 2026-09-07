import React, { useState, useMemo } from 'react';
import {
  INDUSTRY_DECISION_DATABASE,
  IndustryData,
} from '../data/industryDecisionData';
import {
  calculateBusinessViabilityScore,
  ViabilityWeights,
  ViabilityScoreBreakdown,
  LEAN_STARTUP_TASK_MATRIX,
  FORTUNE_500_REFERENCE,
} from '../data/viabilityCalculator';
import { GRANT_OPPORTUNITIES } from '../data/startupData';
import {
  Calculator,
  TrendingUp,
  Landmark,
  Layers,
  AlertTriangle,
  Sliders,
  Sparkles,
  Trophy,
  CheckCircle2,
  ArrowRight,
  Info,
  DollarSign,
  Briefcase,
  Building2,
  ShieldAlert,
  Zap,
} from 'lucide-react';

interface DynamicBusinessScoreCalculatorProps {
  selectedIndustry?: IndustryData;
  onSelectIndustry?: (industry: IndustryData) => void;
  onProceedToStep3?: () => void;
}

export const DynamicBusinessScoreCalculator: React.FC<DynamicBusinessScoreCalculatorProps> = ({
  selectedIndustry: propIndustry,
  onSelectIndustry,
  onProceedToStep3,
}) => {
  const selectedIndustry = propIndustry || INDUSTRY_DECISION_DATABASE[0];

  // Weights state (default equal 25 pts each = 100 total)
  const [weights, setWeights] = useState<ViabilityWeights>({
    numbers: 25,
    funding: 25,
    products: 25,
    needs: 25,
  });

  const [activeView, setActiveView] = useState<'calculator' | 'lean_matrix' | 'fortune500'>('calculator');
  const [searchFilter, setSearchFilter] = useState('');

  // Preset Strategy Weight Profiles
  const applyPresetProfile = (type: 'balanced' | 'grants' | 'saas' | 'urgency') => {
    switch (type) {
      case 'balanced':
        setWeights({ numbers: 25, funding: 25, products: 25, needs: 25 });
        break;
      case 'grants':
        setWeights({ numbers: 15, funding: 40, products: 20, needs: 25 });
        break;
      case 'saas':
        setWeights({ numbers: 30, funding: 10, products: 45, needs: 15 });
        break;
      case 'urgency':
        setWeights({ numbers: 20, funding: 15, products: 20, needs: 45 });
        break;
    }
  };

  // Calculate scores for ALL industries dynamically
  const rankedIndustries = useMemo(() => {
    return INDUSTRY_DECISION_DATABASE.map((ind) => {
      const breakdown = calculateBusinessViabilityScore(ind, GRANT_OPPORTUNITIES, weights);
      return {
        industry: ind,
        breakdown,
      };
    }).sort((a, b) => b.breakdown.totalScore - a.breakdown.totalScore);
  }, [weights]);

  // Current selected industry's breakdown
  const currentBreakdown: ViabilityScoreBreakdown = useMemo(() => {
    return calculateBusinessViabilityScore(selectedIndustry, GRANT_OPPORTUNITIES, weights);
  }, [selectedIndustry, weights]);

  // #1 Top Recommended Industry
  const topChoice = rankedIndustries[0];

  return (
    <div className="space-y-6 font-mono text-slate-100">
      
      {/* HEADER BAR & VIEW MODE SWITCHER */}
      <div className="bg-[#08090a] p-5 rounded-2xl border border-[#00ff9d]/30 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1f2228] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00ff9d]/10 border border-[#00ff9d]/30 flex items-center justify-center text-[#00ff9d]">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white uppercase tracking-wider">
                  Dynamic Business Viability Engine
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#00ff9d]/20 text-[#00ff9d] border border-[#00ff9d]/30">
                  Live Mathematical Scorecard
                </span>
              </div>
              <p className="text-xs text-[#888e96] mt-0.5">
                Evaluates business selection using 4 dynamic pillars: <strong className="text-cyan-400">[Numbers + Funding + Products + Needs]</strong>
              </p>
            </div>
          </div>

          {/* View Toggles */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveView('calculator')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'calculator'
                  ? 'bg-[#00ff9d] text-black shadow-[0_0_15px_rgba(0,255,157,0.3)]'
                  : 'bg-[#121417] text-[#888e96] hover:text-white border border-[#1f2228]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" /> Industry Score Calculator
            </button>

            <button
              onClick={() => setActiveView('lean_matrix')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'lean_matrix'
                  ? 'bg-[#00ff9d] text-black shadow-[0_0_15px_rgba(0,255,157,0.3)]'
                  : 'bg-[#121417] text-[#888e96] hover:text-white border border-[#1f2228]'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" /> Lean Startup Task Matrix
            </button>

            <button
              onClick={() => setActiveView('fortune500')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'fortune500'
                  ? 'bg-[#00ff9d] text-black shadow-[0_0_15px_rgba(0,255,157,0.3)]'
                  : 'bg-[#121417] text-[#888e96] hover:text-white border border-[#1f2228]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" /> Fortune 500 Benchmarks
            </button>
          </div>
        </div>

        {/* TOP RECOMMENDED BUSINESS CHOICE BANNER */}
        {topChoice && (
          <div className="bg-gradient-to-r from-amber-500/10 via-[#0d1117] to-cyan-500/10 p-4 rounded-xl border border-amber-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-400 text-black flex items-center justify-center font-bold shrink-0 shadow-[0_0_15px_rgba(251,191,36,0.4)]">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                    #1 Ranked Business Recommendation
                  </span>
                  <span className="text-[10px] text-slate-300 bg-[#1f2228] px-2 py-0.5 rounded">
                    Score: <strong className="text-[#00ff9d]">{topChoice.breakdown.totalScore} / 100</strong>
                  </span>
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {topChoice.industry.name}
                </div>
                <p className="text-[11px] text-[#888e96] mt-0.5">
                  Highest overall score based on current weights ({weights.numbers}% Numbers, {weights.funding}% Funding, {weights.products}% Products, {weights.needs}% Needs).
                </p>
              </div>
            </div>

            {selectedIndustry.id !== topChoice.industry.id ? (
              <button
                onClick={() => onSelectIndustry?.(topChoice.industry)}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shrink-0 shadow-lg"
              >
                Switch to #1 Industry <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="px-3 py-1.5 bg-[#00ff9d]/20 text-[#00ff9d] border border-[#00ff9d]/40 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-4 h-4" /> Currently Selected
              </div>
            )}
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* MODE 1: DYNAMIC CALCULATOR & PILLAR BREAKDOWN */}
      {/* ==================================================== */}
      {activeView === 'calculator' && (
        <div className="space-y-6">

          {/* WEIGHT TUNING STRATEGY CONTROLS */}
          <div className="bg-[#08090a] p-5 rounded-2xl border border-[#1f2228] space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1f2228] pb-3">
              <span className="text-xs font-bold text-white uppercase flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#00ff9d]" /> Step 2: Dynamic Weight Tuning Controls
              </span>
              
              {/* Preset Buttons */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[10px] text-[#888e96] mr-1">Strategy Profiles:</span>
                <button
                  onClick={() => applyPresetProfile('balanced')}
                  className="px-2.5 py-1 bg-[#121417] hover:bg-[#1f2228] text-slate-300 hover:text-white rounded-lg text-[10px] border border-[#1f2228]"
                >
                  Balanced (25/25/25/25)
                </button>
                <button
                  onClick={() => applyPresetProfile('grants')}
                  className="px-2.5 py-1 bg-[#121417] hover:bg-[#1f2228] text-amber-300 hover:text-white rounded-lg text-[10px] border border-[#1f2228]"
                >
                  Grants Seeker (40% Funding)
                </button>
                <button
                  onClick={() => applyPresetProfile('saas')}
                  className="px-2.5 py-1 bg-[#121417] hover:bg-[#1f2228] text-cyan-300 hover:text-white rounded-lg text-[10px] border border-[#1f2228]"
                >
                  SaaS Launch (45% Products)
                </button>
                <button
                  onClick={() => applyPresetProfile('urgency')}
                  className="px-2.5 py-1 bg-[#121417] hover:bg-[#1f2228] text-rose-300 hover:text-white rounded-lg text-[10px] border border-[#1f2228]"
                >
                  Urgent Pain (45% Needs)
                </button>
              </div>
            </div>

            {/* Weight Sliders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              
              {/* Numbers Weight Slider */}
              <div className="bg-[#121417] p-3.5 rounded-xl border border-[#1f2228] space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-cyan-400 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> Numbers Weight
                  </span>
                  <span className="text-white font-mono">{weights.numbers}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="5"
                  value={weights.numbers}
                  onChange={(e) => setWeights({ ...weights, numbers: Number(e.target.value) })}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <span className="text-[10px] text-[#888e96] block">Market Size, YoY Growth & Margins</span>
              </div>

              {/* Funding Weight Slider */}
              <div className="bg-[#121417] p-3.5 rounded-xl border border-[#1f2228] space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-amber-400 flex items-center gap-1">
                    <Landmark className="w-3.5 h-3.5" /> Funding Weight
                  </span>
                  <span className="text-white font-mono">{weights.funding}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="5"
                  value={weights.funding}
                  onChange={(e) => setWeights({ ...weights, funding: Number(e.target.value) })}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <span className="text-[10px] text-[#888e96] block">Grants.gov, SBIR/STTR & Non-dilutive</span>
              </div>

              {/* Products Weight Slider */}
              <div className="bg-[#121417] p-3.5 rounded-xl border border-[#1f2228] space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-[#00ff9d] flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" /> Products Weight
                  </span>
                  <span className="text-white font-mono">{weights.products}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="5"
                  value={weights.products}
                  onChange={(e) => setWeights({ ...weights, products: Number(e.target.value) })}
                  className="w-full accent-[#00ff9d] cursor-pointer"
                />
                <span className="text-[10px] text-[#888e96] block">Launch Cost, Catalog & AI Leverage</span>
              </div>

              {/* Needs Weight Slider */}
              <div className="bg-[#121417] p-3.5 rounded-xl border border-[#1f2228] space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-rose-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Needs Weight
                  </span>
                  <span className="text-white font-mono">{weights.needs}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="5"
                  value={weights.needs}
                  onChange={(e) => setWeights({ ...weights, needs: Number(e.target.value) })}
                  className="w-full accent-rose-400 cursor-pointer"
                />
                <span className="text-[10px] text-[#888e96] block">Unmet Market Gaps & Urgency</span>
              </div>

            </div>
          </div>

          {/* ACTIVE SCORECARD FOR SELECTED INDUSTRY */}
          <div className="bg-[#08090a] p-6 rounded-2xl border border-[#00ff9d]/40 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#1f2228] pb-4 gap-4">
              <div>
                <span className="text-[10px] font-bold text-[#00ff9d] uppercase tracking-wider block">
                  Active Business Viability Analysis
                </span>
                <h3 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
                  {selectedIndustry.name}
                  <span className="text-xs font-normal text-slate-400 bg-[#1f2228] px-2 py-0.5 rounded">
                    Category: {selectedIndustry.category}
                  </span>
                </h3>
              </div>

              {/* Total Score Display Badge */}
              <div className="flex items-center gap-4 bg-[#121417] p-3.5 rounded-xl border border-[#00ff9d]/30 shrink-0">
                <div>
                  <span className="text-[10px] text-[#888e96] block">Total Dynamic Score</span>
                  <div className="text-2xl font-bold text-[#00ff9d] font-mono">
                    {currentBreakdown.totalScore} <span className="text-xs text-slate-400">/ 100</span>
                  </div>
                </div>

                <div className="w-12 h-12 rounded-xl bg-[#00ff9d]/10 border border-[#00ff9d]/40 flex items-center justify-center text-[#00ff9d] font-bold text-sm">
                  {currentBreakdown.totalScore >= 80 ? 'A+' : currentBreakdown.totalScore >= 70 ? 'A' : 'B'}
                </div>
              </div>
            </div>

            {/* LIVE FORMULA EXPRESSION BAR */}
            <div className="bg-[#121417] p-3.5 rounded-xl border border-[#1f2228] text-xs font-mono space-y-1">
              <div className="text-[#888e96] text-[10px] flex items-center justify-between">
                <span>Active Formula Math Breakdown:</span>
                <span>Sum = {currentBreakdown.totalScore} pts</span>
              </div>
              <div className="text-white flex flex-wrap items-center gap-2 pt-1 font-bold">
                <span className="text-cyan-400">Numbers ({currentBreakdown.numbersScore}/{weights.numbers}pts)</span>
                <span className="text-[#888e96]">+</span>
                <span className="text-amber-400">Funding ({currentBreakdown.fundingScore}/{weights.funding}pts)</span>
                <span className="text-[#888e96]">+</span>
                <span className="text-[#00ff9d]">Products ({currentBreakdown.productsScore}/{weights.products}pts)</span>
                <span className="text-[#888e96]">+</span>
                <span className="text-rose-400">Needs ({currentBreakdown.needsScore}/{weights.needs}pts)</span>
                <span className="text-[#888e96]">=</span>
                <span className="text-[#00ff9d] underline decoration-[#00ff9d]">{currentBreakdown.totalScore} / 100</span>
              </div>
            </div>

            {/* THE 4 PILLARS DETAILED METRIC CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Pillar 1: Numbers */}
              <div className="bg-[#121417] p-4 rounded-xl border border-cyan-500/30 space-y-3 relative">
                <div className="flex items-center justify-between border-b border-[#1f2228] pb-2">
                  <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" /> 1. Numbers
                  </span>
                  <span className="text-xs font-bold text-white bg-cyan-400/20 px-2 py-0.5 rounded border border-cyan-400/30">
                    {currentBreakdown.numbersScore} pts
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#888e96]">Market Size:</span>
                    <strong className="text-white">{selectedIndustry.marketSize}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888e96]">YoY Growth Rate:</span>
                    <strong className="text-cyan-400">{selectedIndustry.growthRate}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888e96]">Avg Margin:</span>
                    <strong className="text-[#00ff9d]">{currentBreakdown.avgMarginPct}%</strong>
                  </div>
                </div>

                <div className="text-[10px] text-[#888e96] pt-2 border-t border-[#1f2228]">
                  High market size and growth yield stronger revenue potential.
                </div>
              </div>

              {/* Pillar 2: Funding */}
              <div className="bg-[#121417] p-4 rounded-xl border border-amber-500/30 space-y-3 relative">
                <div className="flex items-center justify-between border-b border-[#1f2228] pb-2">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Landmark className="w-4 h-4" /> 2. Funding
                  </span>
                  <span className="text-xs font-bold text-white bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/30">
                    {currentBreakdown.fundingScore} pts
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#888e96]">Active Grants Pool:</span>
                    <strong className="text-amber-400">{selectedIndustry.activeGrantFunding}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888e96]">Matched Solicitations:</span>
                    <strong className="text-white">{currentBreakdown.grantCount} Grants</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888e96]">Key Agencies:</span>
                    <strong className="text-slate-300">NSF, DARPA, DOE</strong>
                  </div>
                </div>

                <div className="text-[10px] text-[#888e96] pt-2 border-t border-[#1f2228]">
                  Non-dilutive federal capital accelerates R&D without diluting equity.
                </div>
              </div>

              {/* Pillar 3: Products */}
              <div className="bg-[#121417] p-4 rounded-xl border border-[#00ff9d]/30 space-y-3 relative">
                <div className="flex items-center justify-between border-b border-[#1f2228] pb-2">
                  <span className="text-xs font-bold text-[#00ff9d] flex items-center gap-1.5">
                    <Layers className="w-4 h-4" /> 3. Products
                  </span>
                  <span className="text-xs font-bold text-white bg-[#00ff9d]/20 px-2 py-0.5 rounded border border-[#00ff9d]/30">
                    {currentBreakdown.productsScore} pts
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#888e96]">Catalog Ready:</span>
                    <strong className="text-white">{currentBreakdown.productCount} Products</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888e96]">Avg Launch Cost:</span>
                    <strong className="text-[#00ff9d]">${currentBreakdown.avgLaunchCostEst}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888e96]">AI Advantage:</span>
                    <strong className="text-cyan-400">Gemini 1.5 Pro</strong>
                  </div>
                </div>

                <div className="text-[10px] text-[#888e96] pt-2 border-t border-[#1f2228]">
                  Low launch costs and high SaaS margins ensure fast payback periods.
                </div>
              </div>

              {/* Pillar 4: Needs */}
              <div className="bg-[#121417] p-4 rounded-xl border border-rose-500/30 space-y-3 relative">
                <div className="flex items-center justify-between border-b border-[#1f2228] pb-2">
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> 4. Needs
                  </span>
                  <span className="text-xs font-bold text-white bg-rose-400/20 px-2 py-0.5 rounded border border-rose-400/30">
                    {currentBreakdown.needsScore} pts
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#888e96]">Critical Pain Points:</span>
                    <strong className="text-rose-400">{currentBreakdown.criticalCount} Critical</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888e96]">High Pain Points:</span>
                    <strong className="text-amber-400">{currentBreakdown.highCount} High</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888e96]">Total Gaps Identified:</span>
                    <strong className="text-white">{currentBreakdown.totalNeedsCount} Needs</strong>
                  </div>
                </div>

                <div className="text-[10px] text-[#888e96] pt-2 border-t border-[#1f2228]">
                  High urgency indicates immediate customer budget allocation.
                </div>
              </div>

            </div>

            {/* EXPLANATION BULLETS */}
            <div className="bg-[#121417] p-4 rounded-xl border border-[#1f2228] space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[#00ff9d]" /> Dynamic Calculation Notes for {selectedIndustry.name}:
              </span>
              <ul className="space-y-1.5 text-xs text-[#888e96]">
                {currentBreakdown.explanation.map((exp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#00ff9d] font-bold">✓</span>
                    <span>{exp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ACTION FOOTER */}
            {onProceedToStep3 && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={onProceedToStep3}
                  className="px-5 py-2.5 bg-[#00ff9d] hover:bg-[#00ff9d]/90 text-black font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,255,157,0.3)]"
                >
                  Proceed to Step 3: Grants.gov Search for {selectedIndustry.name} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

          {/* ALL INDUSTRIES COMPARISON RANKINGS TABLE */}
          <div className="bg-[#08090a] p-5 rounded-2xl border border-[#1f2228] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
              <span className="text-xs font-bold text-white uppercase flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" /> Full Industry Viability Score Rankings ({rankedIndustries.length} Sectors)
              </span>
              <span className="text-[10px] text-[#888e96]">Re-ranked dynamically on weight changes</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {rankedIndustries.map((item, index) => {
                const isSelected = item.industry.id === selectedIndustry.id;
                return (
                  <button
                    key={item.industry.id}
                    onClick={() => onSelectIndustry?.(item.industry)}
                    className={`p-4 rounded-xl border text-left transition-all space-y-2.5 relative ${
                      isSelected
                        ? 'bg-[#00ff9d]/15 border-[#00ff9d] text-white shadow-[0_0_15px_rgba(0,255,157,0.2)]'
                        : 'bg-[#121417] border-[#1f2228] text-[#888e96] hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1f2228] text-slate-300">
                        #{index + 1} {item.industry.category}
                      </span>
                      <span className="text-xs font-bold text-[#00ff9d] font-mono">
                        {item.breakdown.totalScore} / 100
                      </span>
                    </div>

                    <div className="text-xs font-bold text-white line-clamp-1">{item.industry.name}</div>

                    <div className="grid grid-cols-4 gap-1 text-[9px] pt-1 border-t border-[#1f2228]">
                      <div className="text-cyan-400">Num: <strong>{item.breakdown.numbersScore}</strong></div>
                      <div className="text-amber-400">Fund: <strong>{item.breakdown.fundingScore}</strong></div>
                      <div className="text-[#00ff9d]">Prod: <strong>{item.breakdown.productsScore}</strong></div>
                      <div className="text-rose-400">Need: <strong>{item.breakdown.needsScore}</strong></div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ==================================================== */}
      {/* MODE 2: LEAN STARTUP TASK EXECUTION MATRIX */}
      {/* ==================================================== */}
      {activeView === 'lean_matrix' && (
        <div className="bg-[#08090a] p-6 rounded-2xl border border-[#1f2228] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1f2228] pb-3 gap-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#00ff9d]" /> Lean Startup Execution Matrix
              </h3>
              <p className="text-xs text-[#888e96] mt-0.5">
                Task breakdown across 10 digital business models: Affiliate, Freelancing, Blogging, Digital Products, Print-on-Demand, Courses, Dropshipping, Social Media, Content, VA.
              </p>
            </div>

            <input
              type="text"
              placeholder="Filter tasks or model..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="bg-[#121417] border border-[#1f2228] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00ff9d] w-full sm:w-64"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-1">
            {LEAN_STARTUP_TASK_MATRIX.filter(t => 
              t.startupName.toLowerCase().includes(searchFilter.toLowerCase()) ||
              t.mainTask.toLowerCase().includes(searchFilter.toLowerCase()) ||
              t.subTask.toLowerCase().includes(searchFilter.toLowerCase()) ||
              t.subSubTask.toLowerCase().includes(searchFilter.toLowerCase())
            ).map((task, idx) => (
              <div key={idx} className="bg-[#121417] p-4 rounded-xl border border-[#1f2228] space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-[#1f2228] pb-2">
                  <span className="text-[10px] font-bold text-[#00ff9d] bg-[#00ff9d]/10 px-2 py-0.5 rounded border border-[#00ff9d]/30">
                    {task.startupName}
                  </span>
                  <span className="text-[10px] text-[#888e96]">Task #{idx + 1}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block">Main Objective:</span>
                  <strong className="text-white text-xs">{task.mainTask}</strong>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-[#08090a] p-2.5 rounded-lg border border-[#1f2228] text-[11px]">
                  <div>
                    <span className="text-cyan-400 font-bold block text-[10px]">Sub-Task:</span>
                    <span className="text-slate-300">{task.subTask}</span>
                  </div>
                  <div>
                    <span className="text-amber-400 font-bold block text-[10px]">Action Step:</span>
                    <span className="text-slate-300">{task.subSubTask}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODE 3: FORTUNE 500 BENCHMARK REFERENCE INDEX */}
      {/* ==================================================== */}
      {activeView === 'fortune500' && (
        <div className="bg-[#08090a] p-6 rounded-2xl border border-[#1f2228] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1f2228] pb-3 gap-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                <Building2 className="w-4 h-4 text-cyan-400" /> Fortune 500 Enterprise Reference Index
              </h3>
              <p className="text-xs text-[#888e96] mt-0.5">
                Market valuation, annual revenue, net profits, and enterprise tickers for industry comparison.
              </p>
            </div>

            <input
              type="text"
              placeholder="Search ticker, company..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="bg-[#121417] border border-[#1f2228] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00ff9d] w-full sm:w-64"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#121417] text-[#888e96] uppercase text-[10px]">
                <tr>
                  <th className="p-3">Rank</th>
                  <th className="p-3">Company</th>
                  <th className="p-3">Ticker</th>
                  <th className="p-3">Industry</th>
                  <th className="p-3">Revenue</th>
                  <th className="p-3">Profits</th>
                  <th className="p-3">Valuation</th>
                  <th className="p-3">CEO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f2228]">
                {FORTUNE_500_REFERENCE.filter(c => 
                  c.company.toLowerCase().includes(searchFilter.toLowerCase()) ||
                  c.ticker.toLowerCase().includes(searchFilter.toLowerCase()) ||
                  c.industry.toLowerCase().includes(searchFilter.toLowerCase())
                ).map((comp) => (
                  <tr key={comp.rank} className="hover:bg-[#121417]">
                    <td className="p-3 font-bold text-amber-400">#{comp.rank}</td>
                    <td className="p-3 font-bold text-white">{comp.company}</td>
                    <td className="p-3"><span className="bg-[#1f2228] text-[#00ff9d] px-2 py-0.5 rounded font-bold">{comp.ticker}</span></td>
                    <td className="p-3 text-[#888e96]">{comp.industry}</td>
                    <td className="p-3 font-bold text-white">${(comp.revenueMillions / 1000).toFixed(1)}B</td>
                    <td className="p-3 font-bold text-[#00ff9d]">${(comp.profitsMillions / 1000).toFixed(1)}B</td>
                    <td className="p-3 font-bold text-cyan-400">${(comp.valuationMillions / 1000).toFixed(1)}B</td>
                    <td className="p-3 text-slate-400">{comp.ceo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
