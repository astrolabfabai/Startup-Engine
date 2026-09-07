import React, { useState } from 'react';
import {
  INDUSTRY_DECISION_DATABASE,
  IndustryData,
  IndustryNeed,
  IndustryProduct,
} from '../data/industryDecisionData';
import { GRANT_OPPORTUNITIES } from '../data/startupData';
import { GrantOpportunity } from '../types';
import {
  Sparkles,
  DollarSign,
  ShieldCheck,
  Users,
  PieChart,
  Layers,
  Rocket,
  Search,
  CheckSquare,
  Calendar,
  CreditCard,
  FileText,
  ShieldAlert,
  Briefcase,
  TrendingUp,
  Presentation,
  Building2,
  Cpu,
  Target,
  BarChart3,
  Award,
  Download,
  CheckCircle2,
  Bot,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  Flame,
  Zap,
} from 'lucide-react';

interface StartupUpgradesSuiteProps {
  selectedIndustry?: IndustryData;
  selectedNeed?: IndustryNeed | null;
  selectedProduct?: IndustryProduct | null;
  grantOpportunities?: GrantOpportunity[];
}

export const StartupUpgradesSuite: React.FC<StartupUpgradesSuiteProps> = ({
  selectedIndustry: propIndustry,
  selectedNeed: propNeed,
  selectedProduct: propProduct,
  grantOpportunities = GRANT_OPPORTUNITIES,
}) => {
  // Local active industry selector for interactive exploration
  const [internalIndustryId, setInternalIndustryId] = useState<string>(
    propIndustry?.id || INDUSTRY_DECISION_DATABASE[0].id
  );

  const selectedIndustry =
    (propIndustry && propIndustry.id === internalIndustryId ? propIndustry : null) ||
    INDUSTRY_DECISION_DATABASE.find((i) => i.id === internalIndustryId) ||
    INDUSTRY_DECISION_DATABASE[0];

  const selectedNeed =
    propNeed || selectedIndustry.industryNeeds[0] || null;

  const selectedProduct =
    propProduct || selectedIndustry.products[0] || null;

  // Active Upgrade Module Category
  const [activeCategory, setActiveCategory] = useState<
    'ai_grant' | 'finance' | 'market' | 'compliance' | 'gtm' | 'board' | 'all'
  >('all');

  // Active Tool Filter
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Grant for Upgrade #1
  const [selectedGrantForPitch, setSelectedGrantForPitch] = useState<GrantOpportunity>(
    grantOpportunities[0] || {
      id: 'GRANT-001',
      title: 'NSF SBIR Phase I: AI & Emerging Tech',
      agency: 'National Science Foundation',
      amount: '$275,000',
      deadline: 'Rolling 2026',
      category: 'Technology & AI',
      eligibility: 'US Small Business',
      description: 'Seed funding to transform scientific discovery into products.',
      url: 'https://grants.gov',
    }
  );

  // Copy state helper
  const [copiedUpgradeId, setCopiedUpgradeId] = useState<number | null>(null);

  const handleCopyText = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedUpgradeId(id);
    setTimeout(() => setCopiedUpgradeId(null), 2000);
  };

  // State for Upgrade #2: Financial Model & Runway Sliders
  const [monthlyBurn, setMonthlyBurn] = useState(25000);
  const [monthlyRevenue, setMonthlyRevenue] = useState(12000);
  const [startingCapital, setStartingCapital] = useState(300000);
  const netBurn = Math.max(0, monthlyBurn - monthlyRevenue);
  const runwayMonths = netBurn > 0 ? (startingCapital / netBurn).toFixed(1) : 'Infinite (Profitable)';

  // State for Upgrade #5: TAM / SAM / SOM Sliders
  const [tamBillions, setTamBillions] = useState(45);
  const [samPct, setSamPct] = useState(15);
  const [somPct, setSomPct] = useState(2);
  const samVal = (tamBillions * 1000 * (samPct / 100)).toFixed(0);
  const somVal = (parseFloat(samVal) * (somPct / 100)).toFixed(1);

  // State for Upgrade #9: SAM.gov Readiness Checklist
  const [samReadiness, setSamReadiness] = useState({
    samGovReg: true,
    ueiNumber: true,
    cageCode: false,
    dsipAccount: true,
    hipaaCompliant: false,
    smallBizCert: true,
  });

  const readinessScore = Math.round(
    (Object.values(samReadiness).filter(Boolean).length / Object.keys(samReadiness).length) * 100
  );

  // State for Upgrade #14: Cap Table Simulator
  const [cofounderCount, setCofounderCount] = useState(2);
  const [grantFundingStack, setGrantFundingStack] = useState(275000);
  const [angelInvestment, setAngelInvestment] = useState(500000);
  const [postMoneyVal, setPostMoneyVal] = useState(5000000);

  // State for Upgrade #19: Sales Velocity Calculator
  const [targetARR, setTargetARR] = useState(1000000);
  const [avgACV, setAvgACV] = useState(15000);
  const requiredDeals = Math.ceil(targetARR / avgACV);
  const requiredDemos = Math.ceil(requiredDeals * 4);
  const requiredLeads = Math.ceil(requiredDemos * 5);

  // State for Upgrade #24: 30-60-90 Day Execution Checklist
  const [tasks, setTasks] = useState([
    { id: 1, day: 30, text: 'Register UEI on SAM.gov & obtain CAGE Code', done: true },
    { id: 2, day: 30, text: 'Form Delaware C-Corp & apply for EIN', done: true },
    { id: 3, day: 30, text: 'Complete Customer Discovery (20 Interviews)', done: false },
    { id: 4, day: 60, text: 'Draft NSF / DoD SBIR Phase I Proposal', done: false },
    { id: 5, day: 60, text: 'Deploy V1 MVP Prototype to Cloud Infrastructure', done: false },
    { id: 6, day: 90, text: 'Submit Grant Application on Grants.gov', done: false },
    { id: 7, day: 90, text: 'Sign First 3 Design Partner LOIs', done: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  // State for Upgrade #25: AI Board Panel Chat Simulator
  const [selectedAgent, setSelectedAgent] = useState<'CEO' | 'CTO' | 'CFO' | 'CMO' | 'Grant Specialist'>('CEO');
  const [boardQuery, setBoardQuery] = useState('');
  const [boardResponses, setBoardResponses] = useState<
    { agent: string; role: string; response: string; timestamp: string }[]
  >([
    {
      agent: 'CEO Agent',
      role: 'Chief Executive Officer',
      response: `For ${selectedIndustry.name}, prioritize non-dilutive grant funding (${selectedGrantForPitch.amount}) to de-risk technical MVP development before raising equity.`,
      timestamp: '10:00 AM',
    },
    {
      agent: 'Grant Specialist Agent',
      role: 'Federal Funding Director',
      response: `Ensure your proposal addresses the exact ${selectedNeed?.urgency || 'High'} urgency need: "${selectedNeed?.title || selectedIndustry.tagline}".`,
      timestamp: '10:02 AM',
    },
  ]);

  const handleSendBoardQuery = () => {
    if (!boardQuery.trim()) return;

    let responseText = '';
    if (selectedAgent === 'CEO') {
      responseText = `Focus on securing early design partners in ${selectedIndustry.name}. Target buyer: ${selectedProduct?.targetBuyer || 'Enterprise Leads'}.`;
    } else if (selectedAgent === 'CTO') {
      responseText = `Architect a modular microservices tech stack with automated SOC2 logging and zero-trust security.`;
    } else if (selectedAgent === 'CFO') {
      responseText = `With $${netBurn.toLocaleString()}/mo net burn, your current runway is ${runwayMonths} months. Maintain a 6-month buffer before scaling headcount.`;
    } else if (selectedAgent === 'CMO') {
      responseText = `Execute an account-based marketing (ABM) strategy targeting decision makers who suffer from: "${selectedNeed?.marketGap || 'Industry pain points'}".`;
    } else {
      responseText = `Apply directly to ${selectedGrantForPitch.agency} (${selectedGrantForPitch.amount}). Match CFDA requirements and align with non-dilutive SBIR Phase I guidelines.`;
    }

    setBoardResponses([
      ...boardResponses,
      {
        agent: `${selectedAgent} Agent`,
        role: `${selectedAgent} Advisory`,
        response: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setBoardQuery('');
  };

  // Filter 25 Upgrades List
  const upgradesList = [
    { id: 1, title: 'AI Grant Proposal & Elevator Pitch Generator', category: 'ai_grant', icon: Sparkles },
    { id: 2, title: 'Interactive Financial Model & Runway Calculator', category: 'finance', icon: DollarSign },
    { id: 3, title: 'Patent & IP Prior Art Search Simulator', category: 'compliance', icon: ShieldCheck },
    { id: 4, title: 'Target Buyer Persona & ICP Matrix', category: 'gtm', icon: Users },
    { id: 5, title: 'TAM / SAM / SOM Market Sizing Calculator', category: 'market', icon: PieChart },
    { id: 6, title: 'Competitor Battlecard & Differentiation Matrix', category: 'market', icon: Layers },
    { id: 7, title: 'Go-To-Market (GTM) Channel Playbook', category: 'gtm', icon: Rocket },
    { id: 8, title: 'IRS BMF & EIN Verification Checker', category: 'compliance', icon: Search },
    { id: 9, title: 'Grant Readiness & SAM.gov Audit Scorecard', category: 'ai_grant', icon: CheckSquare },
    { id: 10, title: 'Product Roadmap & Sprint Timeline (MoSCoW)', category: 'gtm', icon: Calendar },
    { id: 11, title: 'Pricing Strategy & Unit Economics Engine', category: 'finance', icon: CreditCard },
    { id: 12, title: 'Federal & State Tax Incentive Matrix (IRC §41)', category: 'compliance', icon: FileText },
    { id: 13, title: 'Regulatory & Compliance Scanner (HIPAA/SOC2)', category: 'compliance', icon: ShieldAlert },
    { id: 14, title: 'Founding Team & Advisory Equity Allocator', category: 'board', icon: Briefcase },
    { id: 15, title: 'Capital Stack & Cap Table Simulator', category: 'finance', icon: TrendingUp },
    { id: 16, title: '10-Slide Investor Pitch Deck Blueprint', category: 'board', icon: Presentation },
    { id: 17, title: 'USAspending Federal Contract Lead Finder', category: 'ai_grant', icon: Building2 },
    { id: 18, title: 'Tech Architecture & Cloud Infrastructure Spec', category: 'gtm', icon: Cpu },
    { id: 19, title: 'Sales Funnel & Revenue Velocity Calculator', category: 'gtm', icon: Target },
    { id: 20, title: 'CAC Payback Period Curve Simulator', category: 'finance', icon: BarChart3 },
    { id: 21, title: 'Industry Benchmark & Key Metrics Dashboard', category: 'market', icon: Award },
    { id: 22, title: 'One-Page Lean Canvas Generator', category: 'board', icon: Layers },
    { id: 23, title: 'Export & Startup Dossier Download Hub', category: 'board', icon: Download },
    { id: 24, title: '30-60-90 Day Milestone Execution Checklist', category: 'gtm', icon: CheckCircle2 },
    { id: 25, title: 'Multi-Agent AI Executive Board Panel Simulator', category: 'board', icon: Bot },
  ];

  const filteredUpgrades = upgradesList.filter((u) => {
    const matchesCategory = activeCategory === 'all' || u.category === activeCategory;
    const matchesSearch = !searchQuery || u.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 font-mono">
      {/* HEADER SECTION */}
      <div className="bento-card p-6 space-y-4 border-[#00ff9d]/30 bg-gradient-to-br from-[#08090a] via-[#0d1117] to-[#08090a]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30 px-2 py-0.5 rounded">
                Startup Acceleration Suite
              </span>
              <span className="text-xs text-[#888e96]">25 Integrated Growth & Intelligence Tools</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#00ff9d]" /> 25 Startup Engine Upgrades & Executive Suite
            </h2>
            <p className="text-xs text-[#888e96] max-w-3xl mt-1 leading-relaxed">
              Complete intelligence stack pre-configured for <strong className="text-[#00ff9d]">{selectedIndustry.name}</strong>, incorporating grant proposals, unit economics, regulatory scanners, capital stacks, and multi-agent AI advisors.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-[#888e96] uppercase font-bold">Target Industry</span>
              <select
                value={selectedIndustry.id}
                onChange={(e) => setInternalIndustryId(e.target.value)}
                className="bg-[#08090a] border border-[#00ff9d]/40 rounded-xl px-3 py-1.5 text-xs text-[#00ff9d] font-bold focus:outline-none focus:border-[#00ff9d] shadow-[0_0_10px_rgba(0,255,157,0.15)]"
              >
                {INDUSTRY_DECISION_DATABASE.map((ind) => (
                  <option key={ind.id} value={ind.id} className="bg-[#121417] text-white">
                    {ind.name} ({ind.category})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* CATEGORY FILTER TABS & SEARCH */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-[#1f2228]">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 md:pb-0">
            {[
              { id: 'all', label: 'All 25 Upgrades' },
              { id: 'ai_grant', label: 'Grants & Funding' },
              { id: 'finance', label: 'Financials & Cap Table' },
              { id: 'market', label: 'Market & Benchmarks' },
              { id: 'compliance', label: 'Compliance & IP' },
              { id: 'gtm', label: 'GTM & Sales' },
              { id: 'board', label: 'AI Board & Strategy' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-[#00ff9d] text-black shadow-[0_0_10px_rgba(0,255,157,0.3)]'
                    : 'bg-[#121417] text-[#888e96] hover:text-white border border-[#1f2228]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64 shrink-0">
            <Search className="w-3.5 h-3.5 text-[#888e96] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search 25 upgrades..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#08090a] border border-[#1f2228] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00ff9d]"
            />
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* DETAILED 25 UPGRADE MODULES GRID & INTERACTIVE SUITE */}
      {/* ==================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* UPGRADE #1: AI GRANT PROPOSAL & ELEVATOR PITCH GENERATOR */}
        {(activeCategory === 'all' || activeCategory === 'ai_grant') && (
          <div className="bento-card p-5 space-y-4 border-[#00ff9d]/20 relative">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
              <span className="text-xs font-bold text-[#00ff9d] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00ff9d]" /> #1. AI Grant Proposal & Elevator Pitch Generator
              </span>
              <span className="text-[10px] bg-[#1f2228] text-slate-300 px-2 py-0.5 rounded">Grant & Pitch</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#888e96] block mb-1">Target Federal Grant Solicitations:</label>
                <select
                  value={selectedGrantForPitch.id}
                  onChange={(e) => {
                    const found = grantOpportunities.find((g) => g.id === e.target.value);
                    if (found) setSelectedGrantForPitch(found);
                  }}
                  className="w-full bg-[#08090a] border border-[#1f2228] rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#00ff9d]"
                >
                  {grantOpportunities.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.id}: {g.title} ({g.amount})
                    </option>
                  ))}
                </select>
              </div>

              {/* Pitch Output Box */}
              <div className="bg-[#08090a] p-3.5 rounded-xl border border-[#1f2228] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#00ff9d]">Generated 60-Second Elevator Pitch</span>
                  <button
                    onClick={() =>
                      handleCopyText(
                        `We are building a scalable ${selectedIndustry.name} solution to address ${selectedNeed?.title || 'industry gaps'}. Funded by ${selectedGrantForPitch.agency} (${selectedGrantForPitch.amount}), our product solves ${selectedNeed?.marketGap || 'critical bottlenecks'}.`,
                        1
                      )
                    }
                    className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedUpgradeId === 1 ? <Check className="w-3 h-3 text-[#00ff9d]" /> : <Copy className="w-3 h-3" />}
                    {copiedUpgradeId === 1 ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed italic">
                  "We are developing a high-margin solution in <strong className="text-[#00ff9d]">{selectedIndustry.name}</strong> specifically solving <strong className="text-amber-400">{selectedNeed?.title || 'industry friction'}</strong>. Leveraging non-dilutive <strong className="text-cyan-400">{selectedGrantForPitch.title} ({selectedGrantForPitch.amount})</strong> from {selectedGrantForPitch.agency}, our commercial architecture scales to target buyers with payback periods under 6 months."
                </p>
              </div>
            </div>
          </div>
        )}

        {/* UPGRADE #2: INTERACTIVE FINANCIAL MODEL & RUNWAY CALCULATOR */}
        {(activeCategory === 'all' || activeCategory === 'finance') && (
          <div className="bento-card p-5 space-y-4 border-[#00ff9d]/20">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
              <span className="text-xs font-bold text-[#00ff9d] flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#00ff9d]" /> #2. Financial Model & Runway Calculator
              </span>
              <span className="text-[10px] bg-[#1f2228] text-slate-300 px-2 py-0.5 rounded">36-Month Model</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#888e96] block mb-1">Monthly Operating Burn: ${monthlyBurn.toLocaleString()}</label>
                  <input
                    type="range"
                    min="5000"
                    max="100000"
                    step="5000"
                    value={monthlyBurn}
                    onChange={(e) => setMonthlyBurn(Number(e.target.value))}
                    className="w-full accent-[#00ff9d]"
                  />
                </div>
                <div>
                  <label className="text-[#888e96] block mb-1">Monthly Revenue MRR: ${monthlyRevenue.toLocaleString()}</label>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="2000"
                    value={monthlyRevenue}
                    onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#888e96] block mb-1">Starting Cash / Grant Reserve: ${startingCapital.toLocaleString()}</label>
                <input
                  type="range"
                  min="50000"
                  max="1000000"
                  step="25000"
                  value={startingCapital}
                  onChange={(e) => setStartingCapital(Number(e.target.value))}
                  className="w-full accent-amber-400"
                />
              </div>

              <div className="bg-[#08090a] p-3 rounded-xl border border-[#1f2228] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#888e96] block">Calculated Net Burn</span>
                  <strong className="text-rose-400 text-sm">${netBurn.toLocaleString()}/mo</strong>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#888e96] block">Projected Cash Runway</span>
                  <strong className="text-[#00ff9d] text-sm">{runwayMonths} Months</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* UPGRADE #3: PATENT & IP PRIOR ART SEARCH SIMULATOR */}
        {(activeCategory === 'all' || activeCategory === 'compliance') && (
          <div className="bento-card p-5 space-y-4 border-[#00ff9d]/20">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
              <span className="text-xs font-bold text-[#00ff9d] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#00ff9d]" /> #3. Patent & IP Prior Art Search Simulator
              </span>
              <span className="text-[10px] bg-[#1f2228] text-slate-300 px-2 py-0.5 rounded">USPTO Classes</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-[#08090a] p-3 rounded-xl border border-[#1f2228] space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-white font-bold">USPTO Class 706 / 709: Software & Data Processing</span>
                  <span className="text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/30">
                    Low IP Conflict Risk (84% Clear)
                  </span>
                </div>
                <p className="text-[11px] text-[#888e96]">
                  Primary novel IP lies in proprietary algorithmic pipeline, specialized domain workflows, and proprietary datasets in {selectedIndustry.name}.
                </p>
                <div className="text-[10px] text-cyan-400">Recommended IP Action: File Provisional Patent within 6 months.</div>
              </div>
            </div>
          </div>
        )}

        {/* UPGRADE #4: TARGET BUYER PERSONA & ICP MATRIX */}
        {(activeCategory === 'all' || activeCategory === 'gtm') && (
          <div className="bento-card p-5 space-y-4 border-[#00ff9d]/20">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
              <span className="text-xs font-bold text-[#00ff9d] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#00ff9d]" /> #4. Target Buyer Persona & ICP Matrix
              </span>
              <span className="text-[10px] bg-[#1f2228] text-slate-300 px-2 py-0.5 rounded">Ideal Customer Profile</span>
            </div>

            <div className="bg-[#08090a] p-3.5 rounded-xl border border-[#1f2228] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Target Persona: VP / Director of Operations</span>
                <span className="text-amber-400 font-bold">$50k - $250k Annual Budget</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#888e96] pt-1">
                <div>Primary Trigger: <span className="text-white">{selectedNeed?.title || 'Cost Efficiency'}</span></div>
                <div>Sales Cycle: <span className="text-cyan-400">30 - 60 Days</span></div>
                <div>Key Decision Metric: <span className="text-[#00ff9d]">3x ROI in 90 Days</span></div>
                <div>Tech Stack: <span className="text-white">Cloud APIs / ERP Systems</span></div>
              </div>
            </div>
          </div>
        )}

        {/* UPGRADE #5: TAM / SAM / SOM MARKET SIZING CALCULATOR */}
        {(activeCategory === 'all' || activeCategory === 'market') && (
          <div className="bento-card p-5 space-y-4 border-[#00ff9d]/20">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
              <span className="text-xs font-bold text-[#00ff9d] flex items-center gap-2">
                <PieChart className="w-4 h-4 text-[#00ff9d]" /> #5. TAM / SAM / SOM Market Sizing Calculator
              </span>
              <span className="text-[10px] bg-[#1f2228] text-slate-300 px-2 py-0.5 rounded">Market Sizing</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-[#08090a] p-3 rounded-xl border border-[#1f2228]">
                  <span className="text-[10px] text-[#888e96] block">TAM (Global)</span>
                  <strong className="text-[#00ff9d] text-sm">${tamBillions}B</strong>
                </div>
                <div className="bg-[#08090a] p-3 rounded-xl border border-[#1f2228]">
                  <span className="text-[10px] text-[#888e96] block">SAM ({samPct}%)</span>
                  <strong className="text-cyan-400 text-sm">${samVal}M</strong>
                </div>
                <div className="bg-[#08090a] p-3 rounded-xl border border-[#1f2228]">
                  <span className="text-[10px] text-[#888e96] block">SOM ({somPct}%)</span>
                  <strong className="text-amber-400 text-sm">${somVal}M</strong>
                </div>
              </div>

              <div>
                <label className="text-[#888e96] block mb-1">Target Addressable Market (TAM): ${tamBillions} Billion</label>
                <input
                  type="range"
                  min="5"
                  max="200"
                  value={tamBillions}
                  onChange={(e) => setTamBillions(Number(e.target.value))}
                  className="w-full accent-[#00ff9d]"
                />
              </div>
            </div>
          </div>
        )}

        {/* UPGRADE #6: COMPETITOR BATTLECARD & DIFFERENTIATION MATRIX */}
        {(activeCategory === 'all' || activeCategory === 'market') && (
          <div className="bento-card p-5 space-y-4 border-[#00ff9d]/20">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
              <span className="text-xs font-bold text-[#00ff9d] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#00ff9d]" /> #6. Competitor Battlecard & Differentiation
              </span>
              <span className="text-[10px] bg-[#1f2228] text-slate-300 px-2 py-0.5 rounded">Moat Analysis</span>
            </div>

            <div className="bg-[#08090a] p-3.5 rounded-xl border border-[#1f2228] space-y-2 text-xs">
              <div className="grid grid-cols-3 gap-2 font-bold text-center border-b border-[#1f2228] pb-1.5">
                <span className="text-[#888e96] text-left">Feature / Moat</span>
                <span className="text-rose-400">Legacy Vendors</span>
                <span className="text-[#00ff9d]">Our Startup</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-[11px] py-1 border-b border-[#1f2228]/50">
                <span className="text-white text-left font-bold">Deployment Time</span>
                <span className="text-rose-400">6 - 12 Months</span>
                <span className="text-[#00ff9d] font-bold">Under 24 Hours</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-[11px] py-1 border-b border-[#1f2228]/50">
                <span className="text-white text-left font-bold">AI Autonomy</span>
                <span className="text-rose-400">Manual / Legacy</span>
                <span className="text-[#00ff9d] font-bold">100% Agentic Pipeline</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-[11px] py-1">
                <span className="text-white text-left font-bold">Pricing Model</span>
                <span className="text-rose-400">Expensive Enterprise</span>
                <span className="text-[#00ff9d] font-bold">Flexible Usage Tier</span>
              </div>
            </div>
          </div>
        )}

        {/* UPGRADE #7: GO-TO-MARKET (GTM) CHANNEL PLAYBOOK */}
        {(activeCategory === 'all' || activeCategory === 'gtm') && (
          <div className="bento-card p-5 space-y-4 border-[#00ff9d]/20">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
              <span className="text-xs font-bold text-[#00ff9d] flex items-center gap-2">
                <Rocket className="w-4 h-4 text-[#00ff9d]" /> #7. Go-To-Market (GTM) Channel Playbook
              </span>
              <span className="text-[10px] bg-[#1f2228] text-slate-300 px-2 py-0.5 rounded">GTM Channels</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-[#08090a] p-3 rounded-xl border border-[#1f2228] flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">1. Outbound ABM & LinkedIn Executive Outreach</span>
                  <span className="text-[10px] text-[#888e96]">Targeting key decision makers in {selectedIndustry.name}</span>
                </div>
                <span className="text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded">CAC ~$450</span>
              </div>

              <div className="bg-[#08090a] p-3 rounded-xl border border-[#1f2228] flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">2. Industry Federal Grant & Partner Ecosystem</span>
                  <span className="text-[10px] text-[#888e96]">Co-marketing with SBIR prime contractors</span>
                </div>
                <span className="text-[#00ff9d] font-bold bg-[#00ff9d]/10 px-2 py-0.5 rounded">CAC ~$120</span>
              </div>
            </div>
          </div>
        )}

        {/* UPGRADE #8: IRS BMF & EIN BUSINESS VERIFICATION CHECKER */}
        {(activeCategory === 'all' || activeCategory === 'compliance') && (
          <div className="bento-card p-5 space-y-4 border-[#00ff9d]/20">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
              <span className="text-xs font-bold text-[#00ff9d] flex items-center gap-2">
                <Search className="w-4 h-4 text-[#00ff9d]" /> #8. IRS BMF & EIN Verification Checker
              </span>
              <span className="text-[10px] bg-[#1f2228] text-slate-300 px-2 py-0.5 rounded">IRS & SOS</span>
            </div>

            <div className="bg-[#08090a] p-3.5 rounded-xl border border-[#1f2228] space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#00ff9d] font-bold">
                <span>Delaware Secretary of State Registry: Active</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-[11px] text-[#888e96]">
                Simulated EIN Status: Verified • IRS Business Master File (BMF) Compliance Status: 100% Eligible for Federal Contract & SBIR Grant Awards.
              </div>
            </div>
          </div>
        )}

        {/* UPGRADE #9: GRANT READINESS & SAM.GOV AUDIT SCORECARD */}
        {(activeCategory === 'all' || activeCategory === 'ai_grant') && (
          <div className="bento-card p-5 space-y-4 border-[#00ff9d]/20">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
              <span className="text-xs font-bold text-[#00ff9d] flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#00ff9d]" /> #9. Grant Readiness & SAM.gov Scorecard
              </span>
              <span className="text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded">
                Score: {readinessScore}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(samReadiness).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setSamReadiness({ ...samReadiness, [key]: !val })}
                  className={`p-2 rounded-lg border text-left flex items-center justify-between transition-all ${
                    val
                      ? 'bg-[#00ff9d]/10 border-[#00ff9d] text-white'
                      : 'bg-[#08090a] border-[#1f2228] text-[#888e96]'
                  }`}
                >
                  <span className="text-[11px] capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  {val ? <Check className="w-3.5 h-3.5 text-[#00ff9d]" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* UPGRADE #10: PRODUCT ROADMAP & SPRINT TIMELINE (MOSCOW) */}
        {(activeCategory === 'all' || activeCategory === 'gtm') && (
          <div className="bento-card p-5 space-y-4 border-[#00ff9d]/20">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
              <span className="text-xs font-bold text-[#00ff9d] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#00ff9d]" /> #10. Product Roadmap & Sprint Timeline (MoSCoW)
              </span>
              <span className="text-[10px] bg-[#1f2228] text-slate-300 px-2 py-0.5 rounded">Sprint Plan</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-[#08090a] p-3 rounded-xl border border-[#1f2228] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Q1: Core Pipeline & Authentication MVP</span>
                  <span className="text-[10px] bg-[#00ff9d]/10 text-[#00ff9d] px-2 py-0.5 rounded">Must-Have</span>
                </div>
                <p className="text-[11px] text-[#888e96]">Deploy database schema, API gateway, and core decision algorithms.</p>
              </div>

              <div className="bg-[#08090a] p-3 rounded-xl border border-[#1f2228] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Q2: AI Agentic Automation & Grants Sync</span>
                  <span className="text-[10px] bg-cyan-400/10 text-cyan-400 px-2 py-0.5 rounded">Should-Have</span>
                </div>
                <p className="text-[11px] text-[#888e96]">Integrate real-time Grants.gov XML feeds and automated lead scoring.</p>
              </div>
            </div>
          </div>
        )}

        {/* UPGRADE #11: PRICING STRATEGY & UNIT ECONOMICS ENGINE */}
        {(activeCategory === 'all' || activeCategory === 'finance') && (
          <div className="bento-card p-5 space-y-4 border-[#00ff9d]/20">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
              <span className="text-xs font-bold text-[#00ff9d] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#00ff9d]" /> #11. Pricing Strategy & Unit Economics
              </span>
              <span className="text-[10px] bg-[#1f2228] text-slate-300 px-2 py-0.5 rounded">Unit Economics</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#08090a] p-3 rounded-xl border border-[#1f2228] space-y-1">
                <span className="text-[10px] text-[#888e96] block">Pro Tier SaaS</span>
                <strong className="text-white text-sm">$499 / mo</strong>
                <div className="text-[10px] text-[#00ff9d]">88% Gross Margin</div>
              </div>

              <div className="bg-[#08090a] p-3 rounded-xl border border-[#1f2228] space-y-1">
                <span className="text-[10px] text-[#888e96] block">Enterprise Retainer</span>
                <strong className="text-amber-400 text-sm">$4,500 / mo</strong>
                <div className="text-[10px] text-cyan-400">75% Gross Margin</div>
              </div>
            </div>
          </div>
        )}

        {/* UPGRADE #12: TAX CREDIT & R&D INCENTIVE MATRIX (IRC §41) */}
        {(activeCategory === 'all' || activeCategory === 'compliance') && (
          <div className="bento-card p-5 space-y-4 border-[#00ff9d]/20">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
              <span className="text-xs font-bold text-[#00ff9d] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00ff9d]" /> #12. Federal & State Tax Incentive Matrix (IRC §41)
              </span>
              <span className="text-[10px] bg-[#1f2228] text-slate-300 px-2 py-0.5 rounded">Tax Credits</span>
            </div>

            <div className="bg-[#08090a] p-3.5 rounded-xl border border-[#1f2228] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#00ff9d]">Federal R&D Tax Credit (IRC §41)</span>
                <span className="text-amber-400 font-bold">Up to $500,000 Payroll Offset</span>
              </div>
              <p className="text-[11px] text-[#888e96]">
                Qualified research expenses (QRE) include software engineering salaries, cloud compute costs, and technical contractor labor in {selectedIndustry.name}.
              </p>
            </div>
          </div>
        )}

        {/* UPGRADE #13: REGULATORY & COMPLIANCE SCANNER */}
        {(activeCategory === 'all' || activeCategory === 'compliance') && (
          <div className="bento-card p-5 space-y-4 border-[#00ff9d]/20">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
              <span className="text-xs font-bold text-[#00ff9d] flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#00ff9d]" /> #13. Regulatory & Compliance Scanner
              </span>
              <span className="text-[10px] bg-[#1f2228] text-slate-300 px-2 py-0.5 rounded">Security Specs</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#08090a] p-3 rounded-xl border border-[#1f2228]">
                <span className="font-bold text-white block">SOC 2 Type II</span>
                <span className="text-[10px] text-[#00ff9d]">Required for Enterprise Sales</span>
              </div>
              <div className="bg-[#08090a] p-3 rounded-xl border border-[#1f2228]">
                <span className="font-bold text-white block">FAR / DFARS Defense</span>
                <span className="text-[10px] text-amber-400">Required for DoD Grants</span>
              </div>
            </div>
          </div>
        )}

        {/* UPGRADE #14: FOUNDING TEAM & ADVISORY EQUITY ALLOCATOR */}
        {(activeCategory === 'all' || activeCategory === 'board') && (
          <div className="bento-card p-5 space-y-4 border-[#00ff9d]/20">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
              <span className="text-xs font-bold text-[#00ff9d] flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#00ff9d]" /> #14. Founding Team & Equity Allocator
              </span>
              <span className="text-[10px] bg-[#1f2228] text-slate-300 px-2 py-0.5 rounded">Equity Split</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-[#08090a] p-3 rounded-xl border border-[#1f2228] flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">CEO / Commercial Founder</span>
                  <span className="text-[10px] text-[#888e96]">4-year vesting / 1-year cliff</span>
                </div>
                <strong className="text-[#00ff9d]">45% Equity</strong>
              </div>
              <div className="bg-[#08090a] p-3 rounded-xl border border-[#1f2228] flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">CTO / Technical Lead</span>
                  <span className="text-[10px] text-[#888e96]">4-year vesting / 1-year cliff</span>
                </div>
                <strong className="text-cyan-400">45% Equity</strong>
              </div>
              <div className="bg-[#08090a] p-3 rounded-xl border border-[#1f2228] flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Option Pool & Advisory Board</span>
                  <span className="text-[10px] text-[#888e96]">FAST advisory agreements</span>
                </div>
                <strong className="text-amber-400">10% Option Pool</strong>
              </div>
            </div>
          </div>
        )}

        {/* UPGRADE #15: CAPITAL STACK & CAP TABLE SIMULATOR */}
        {(activeCategory === 'all' || activeCategory === 'finance') && (
          <div className="bento-card p-5 space-y-4 border-[#00ff9d]/20">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
              <span className="text-xs font-bold text-[#00ff9d] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#00ff9d]" /> #15. Capital Stack & Cap Table Simulator
              </span>
              <span className="text-[10px] bg-[#1f2228] text-slate-300 px-2 py-0.5 rounded">Non-Dilutive Stack</span>
            </div>

            <div className="bg-[#08090a] p-3.5 rounded-xl border border-[#1f2228] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#888e96]">Non-Dilutive Grant Capital:</span>
                <strong className="text-[#00ff9d]">$275,000 (0% Dilution)</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#888e96]">Pre-Seed SAFE Note ($5M Cap):</span>
                <strong className="text-cyan-400">$500,000 (9.1% Dilution)</strong>
              </div>
              <div className="pt-2 border-t border-[#1f2228] flex items-center justify-between font-bold">
                <span className="text-white">Total Seed Launch Capital:</span>
                <span className="text-amber-400">$775,000</span>
              </div>
            </div>
          </div>
        )}

        {/* UPGRADE #16: 10-SLIDE INVESTOR PITCH DECK BLUEPRINT */}
        {(activeCategory === 'all' || activeCategory === 'board') && (
          <div className="bento-card p-5 space-y-4 border-[#00ff9d]/20">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
              <span className="text-xs font-bold text-[#00ff9d] flex items-center gap-2">
                <Presentation className="w-4 h-4 text-[#00ff9d]" /> #16. 10-Slide Investor Pitch Deck Blueprint
              </span>
              <span className="text-[10px] bg-[#1f2228] text-slate-300 px-2 py-0.5 rounded">Deck Blueprint</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {['1. Title & Vision', '2. Industry Pain Point', '3. Our Solution', '4. TAM/SAM/SOM', '5. Product Demo', '6. Business Model', '7. GTM Strategy', '8. Competitors', '9. Financials', '10. The Ask & Milestones'].map((s, idx) => (
                <div key={idx} className="bg-[#08090a] p-2 rounded-lg border border-[#1f2228] text-slate-300 font-bold">
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* UPGRADE #17: USASPENDING FEDERAL CONTRACT LEAD FINDER */}
        {(activeCategory === 'all' || activeCategory === 'ai_grant') && (
          <div className="bento-card p-5 space-y-4 border-[#00ff9d]/20">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
              <span className="text-xs font-bold text-[#00ff9d] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#00ff9d]" /> #17. USAspending Prime Contract Lead Finder
              </span>
              <span className="text-[10px] bg-[#1f2228] text-slate-[#00ff9d] px-2 py-0.5 rounded">Subcontracting</span>
            </div>

            <div className="bg-[#08090a] p-3.5 rounded-xl border border-[#1f2228] space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-white">
                <span>Top Prime Contractor: Lockheed Martin / Raytheon</span>
                <span className="text-[#00ff9d]">$1.2M Subcontract Potential</span>
              </div>
              <p className="text-[11px] text-[#888e96]">
                Prime defense and government contractors seeking dual-use technology subcontracts in {selectedIndustry.name}.
              </p>
            </div>
          </div>
        )}

        {/* UPGRADE #18: TECH ARCHITECTURE & CLOUD INFRASTRUCTURE SPEC */}
        {(activeCategory === 'all' || activeCategory === 'gtm') && (
          <div className="bento-card p-5 space-y-4 border-[#00ff9d]/20">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
              <span className="text-xs font-bold text-[#00ff9d] flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#00ff9d]" /> #18. Tech Architecture & Infrastructure Spec
              </span>
              <span className="text-[10px] bg-[#1f2228] text-slate-300 px-2 py-0.5 rounded">Cloud Stack</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-[#08090a] p-2.5 rounded-lg border border-[#1f2228]">
                <span className="text-[#888e96] block">Hosting & Compute:</span>
                <strong className="text-white">Cloud Run / GCP Serverless</strong>
              </div>
              <div className="bg-[#08090a] p-2.5 rounded-lg border border-[#1f2228]">
                <span className="text-[#888e96] block">Database Engine:</span>
                <strong className="text-[#00ff9d]">Cloud SQL PostgreSQL / Firestore</strong>
              </div>
              <div className="bg-[#08090a] p-2.5 rounded-lg border border-[#1f2228]">
                <span className="text-[#888e96] block">AI & LLM Model:</span>
                <strong className="text-cyan-400">Gemini Pro API Server-Side</strong>
              </div>
              <div className="bg-[#08090a] p-2.5 rounded-lg border border-[#1f2228]">
                <span className="text-[#888e96] block">Auth & Security:</span>
                <strong className="text-amber-400">Firebase Auth + JWT OAuth</strong>
              </div>
            </div>
          </div>
        )}

        {/* UPGRADE #19: SALES FUNNEL & REVENUE VELOCITY CALCULATOR */}
        {(activeCategory === 'all' || activeCategory === 'gtm') && (
          <div className="bento-card p-5 space-y-4 border-[#00ff9d]/20">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
              <span className="text-xs font-bold text-[#00ff9d] flex items-center gap-2">
                <Target className="w-4 h-4 text-[#00ff9d]" /> #19. Sales Funnel & Revenue Velocity
              </span>
              <span className="text-[10px] bg-[#1f2228] text-slate-300 px-2 py-0.5 rounded">$1M ARR Target</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-[#08090a] p-2.5 rounded-xl border border-[#1f2228]">
                  <span className="text-[10px] text-[#888e96] block">Required Leads</span>
                  <strong className="text-white text-sm">{requiredLeads}</strong>
                </div>
                <div className="bg-[#08090a] p-2.5 rounded-xl border border-[#1f2228]">
                  <span className="text-[10px] text-[#888e96] block">Demos Needed</span>
                  <strong className="text-cyan-400 text-sm">{requiredDemos}</strong>
                </div>
                <div className="bg-[#08090a] p-2.5 rounded-xl border border-[#1f2228]">
                  <span className="text-[10px] text-[#888e96] block">Closed Deals</span>
                  <strong className="text-[#00ff9d] text-sm">{requiredDeals}</strong>
                </div>
              </div>

              <div>
                <label className="text-[#888e96] block mb-1">Target Annual Recurring Revenue (ARR): ${targetARR.toLocaleString()}</label>
                <input
                  type="range"
                  min="250000"
                  max="5000000"
                  step="250000"
                  value={targetARR}
                  onChange={(e) => setTargetARR(Number(e.target.value))}
                  className="w-full accent-[#00ff9d]"
                />
              </div>
            </div>
          </div>
        )}

        {/* UPGRADE #20: CAC PAYBACK PERIOD CURVE SIMULATOR */}
        {(activeCategory === 'all' || activeCategory === 'finance') && (
          <div className="bento-card p-5 space-y-4 border-[#00ff9d]/20">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
              <span className="text-xs font-bold text-[#00ff9d] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#00ff9d]" /> #20. CAC Payback Period Curve Simulator
              </span>
              <span className="text-[10px] bg-[#1f2228] text-slate-300 px-2 py-0.5 rounded">Payback Metrics</span>
            </div>

            <div className="bg-[#08090a] p-3.5 rounded-xl border border-[#1f2228] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#888e96]">Average Acquisition Cost (CAC):</span>
                <strong className="text-rose-400">$1,850</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#888e96]">Average Monthly Contract Value:</span>
                <strong className="text-[#00ff9d]">$450 / mo</strong>
              </div>
              <div className="pt-2 border-t border-[#1f2228] flex items-center justify-between font-bold">
                <span className="text-white">Calculated Payback Period:</span>
                <span className="text-cyan-400">4.1 Months (World Class &lt; 12 mo)</span>
              </div>
            </div>
          </div>
        )}

        {/* UPGRADE #21: INDUSTRY BENCHMARK & KEY METRICS DASHBOARD */}
        {(activeCategory === 'all' || activeCategory === 'market') && (
          <div className="bento-card p-5 space-y-4 border-[#00ff9d]/20">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
              <span className="text-xs font-bold text-[#00ff9d] flex items-center gap-2">
                <Award className="w-4 h-4 text-[#00ff9d]" /> #21. Industry Benchmark & Key Metrics
              </span>
              <span className="text-[10px] bg-[#1f2228] text-slate-300 px-2 py-0.5 rounded">Sector Benchmarks</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#08090a] p-2.5 rounded-lg border border-[#1f2228]">
                <span className="text-[#888e96] block text-[10px]">Target Gross Margin:</span>
                <strong className="text-[#00ff9d] text-sm">&gt; 80%</strong>
              </div>
              <div className="bg-[#08090a] p-2.5 rounded-lg border border-[#1f2228]">
                <span className="text-[#888e96] block text-[10px]">Target LTV : CAC:</span>
                <strong className="text-cyan-400 text-sm">4.5x Ratio</strong>
              </div>
              <div className="bg-[#08090a] p-2.5 rounded-lg border border-[#1f2228]">
                <span className="text-[#888e96] block text-[10px]">Rule of 40 Score:</span>
                <strong className="text-amber-400 text-sm">52% (Growth + Margin)</strong>
              </div>
              <div className="bg-[#08090a] p-2.5 rounded-lg border border-[#1f2228]">
                <span className="text-[#888e96] block text-[10px]">Net Revenue Retention:</span>
                <strong className="text-emerald-400 text-sm">118% / yr</strong>
              </div>
            </div>
          </div>
        )}

        {/* UPGRADE #22: ONE-PAGE LEAN CANVAS GENERATOR */}
        {(activeCategory === 'all' || activeCategory === 'board') && (
          <div className="bento-card p-5 space-y-4 border-[#00ff9d]/20">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
              <span className="text-xs font-bold text-[#00ff9d] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#00ff9d]" /> #22. One-Page Lean Canvas Generator
              </span>
              <span className="text-[10px] bg-[#1f2228] text-slate-300 px-2 py-0.5 rounded">Lean Canvas</span>
            </div>

            <div className="bg-[#08090a] p-3 rounded-xl border border-[#1f2228] text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-[#00ff9d]">
                <span>Auto-Compiled Lean Canvas Ready</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p className="text-[11px] text-[#888e96]">
                Includes Problem, Solution, Key Metrics, Value Proposition, Unfair Advantage, Channels, Customer Segments, Cost Structure, and Revenue Streams for {selectedIndustry.name}.
              </p>
            </div>
          </div>
        )}

        {/* UPGRADE #23: EXPORT & STARTUP DOSSIER DOWNLOAD HUB */}
        {(activeCategory === 'all' || activeCategory === 'board') && (
          <div className="bento-card p-5 space-y-4 border-[#00ff9d]/20">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
              <span className="text-xs font-bold text-[#00ff9d] flex items-center gap-2">
                <Download className="w-4 h-4 text-[#00ff9d]" /> #23. Export & Startup Dossier Download Hub
              </span>
              <span className="text-[10px] bg-[#1f2228] text-slate-300 px-2 py-0.5 rounded">Dossier Hub</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() =>
                  handleCopyText(
                    JSON.stringify(
                      {
                        industry: selectedIndustry.name,
                        need: selectedNeed,
                        grant: selectedGrantForPitch,
                        runwayMonths,
                        readinessScore,
                      },
                      null,
                      2
                    ),
                    23
                  )
                }
                className="w-full bg-[#121417] hover:bg-[#1f2228] border border-[#1f2228] text-white p-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
              >
                {copiedUpgradeId === 23 ? <Check className="w-4 h-4 text-[#00ff9d]" /> : <Copy className="w-4 h-4 text-[#00ff9d]" />}
                {copiedUpgradeId === 23 ? 'JSON Dossier Copied' : 'Export Full JSON Dossier'}
              </button>
            </div>
          </div>
        )}

        {/* UPGRADE #24: 30-60-90 DAY MILESTONE EXECUTION CHECKLIST */}
        {(activeCategory === 'all' || activeCategory === 'gtm') && (
          <div className="bento-card p-5 space-y-4 border-[#00ff9d]/20">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
              <span className="text-xs font-bold text-[#00ff9d] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00ff9d]" /> #24. 30-60-90 Day Milestone Execution
              </span>
              <span className="text-[10px] bg-[#1f2228] text-slate-300 px-2 py-0.5 rounded">Action Roadmap</span>
            </div>

            <div className="space-y-1.5 text-xs max-h-[160px] overflow-y-auto pr-1">
              {tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`w-full p-2 rounded-lg border text-left flex items-center justify-between transition-all ${
                    task.done ? 'bg-[#00ff9d]/10 border-[#00ff9d]/40 text-slate-300 line-through' : 'bg-[#08090a] border-[#1f2228] text-white'
                  }`}
                >
                  <span className="text-[11px] flex items-center gap-2">
                    <span className="text-[9px] font-bold text-[#00ff9d] bg-[#00ff9d]/10 px-1.5 py-0.5 rounded">
                      Day {task.day}
                    </span>
                    {task.text}
                  </span>
                  {task.done ? <Check className="w-3.5 h-3.5 text-[#00ff9d] shrink-0" /> : <div className="w-3.5 h-3.5 rounded border border-slate-600 shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* UPGRADE #25: MULTI-AGENT AI EXECUTIVE BOARD SIMULATOR */}
        {(activeCategory === 'all' || activeCategory === 'board') && (
          <div className="bento-card p-5 space-y-4 border-[#00ff9d]/30 lg:col-span-2 bg-gradient-to-br from-[#08090a] via-[#0d1117] to-[#08090a]">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
              <span className="text-xs font-bold text-[#00ff9d] flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#00ff9d]" /> #25. Multi-Agent AI Executive Board Panel Simulator
              </span>
              <span className="text-[10px] bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30 px-2 py-0.5 rounded font-bold">
                5 Executive AI Advisors Active
              </span>
            </div>

            <div className="space-y-3">
              {/* Agent Role Selector */}
              <div className="flex items-center gap-2 overflow-x-auto text-xs">
                {(['CEO', 'CTO', 'CFO', 'CMO', 'Grant Specialist'] as const).map((agent) => (
                  <button
                    key={agent}
                    onClick={() => setSelectedAgent(agent)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all border ${
                      selectedAgent === agent
                        ? 'bg-[#00ff9d] text-black border-[#00ff9d]'
                        : 'bg-[#121417] text-[#888e96] border-[#1f2228] hover:text-white'
                    }`}
                  >
                    AI {agent}
                  </button>
                ))}
              </div>

              {/* Chat Thread */}
              <div className="bg-[#08090a] p-3 rounded-xl border border-[#1f2228] space-y-2.5 max-h-[180px] overflow-y-auto">
                {boardResponses.map((res, idx) => (
                  <div key={idx} className="text-xs space-y-1 bg-[#121417] p-2.5 rounded-lg border border-[#1f2228]">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-[#00ff9d]">{res.agent} ({res.role})</span>
                      <span className="text-[#888e96]">{res.timestamp}</span>
                    </div>
                    <p className="text-[#888e96] leading-relaxed">{res.response}</p>
                  </div>
                ))}
              </div>

              {/* Query Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Ask AI ${selectedAgent} a strategic question about ${selectedIndustry.name}...`}
                  value={boardQuery}
                  onChange={(e) => setBoardQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendBoardQuery()}
                  className="w-full bg-[#08090a] border border-[#1f2228] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00ff9d]"
                />
                <button
                  onClick={handleSendBoardQuery}
                  className="px-4 py-2 bg-[#00ff9d] hover:bg-[#00ff9d]/90 text-black font-bold text-xs rounded-xl shrink-0 transition-all"
                >
                  Consult AI Board
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
