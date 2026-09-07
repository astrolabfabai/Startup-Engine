import React, { useState, useMemo } from 'react';
import {
  GRANT_OPPORTUNITIES,
  NASDAQ_MARKET_DATA,
  USA_SPENDING_DATA,
} from '../data/startupData';
import {
  INDUSTRY_DECISION_DATABASE,
  TOP_10_SECTORS,
  BOTTOM_5_SECTORS,
  IndustryData,
  IndustryNeed,
  IndustryProduct,
  IndustryService,
} from '../data/industryDecisionData';
import {
  AUTO_BUSINESS_INTELLIGENCE_WORKFLOW,
} from '../data/pipelineData';
import { StartupUpgradesSuite } from './StartupUpgradesSuite';
import { DynamicBusinessScoreCalculator } from './DynamicBusinessScoreCalculator';
import { calculateBusinessViabilityScore } from '../data/viabilityCalculator';
import { FundingPaperworkProcessor } from './FundingPaperworkProcessor';
import { AutomatedExecutionRunner } from './AutomatedExecutionRunner';
import { PlaywrightGrantAutomation } from './PlaywrightGrantAutomation';
import {
  Landmark,
  TrendingUp,
  TrendingDown,
  Search,
  ExternalLink,
  Building2,
  Terminal,
  Play,
  CheckCircle2,
  Layers,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Target,
  AlertTriangle,
  Workflow,
  Zap,
  Filter,
  Award,
  FileText,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  FileCode,
  Gauge,
  Briefcase,
  CheckSquare,
  Square,
  SlidersHorizontal,
  Download,
  ListChecks,
  X,
} from 'lucide-react';

export const GrantsAndMarketTab: React.FC = () => {
  // Main Navigation Sub-Tab Mode
  const [activeSubTab, setActiveSubTab] = useState<'industry_flow' | 'paperwork' | 'upgrades' | 'pipeline' | 'stocks' | 'grants'>('industry_flow');

  // Step Navigation in Industry Flow (1: Pick Industry, 2: Needs & Gaps, 3: Grants.gov Funding, 4: Launch Catalog)
  const [activeStep, setActiveStep] = useState<number>(1);

  // Sector Filter (All 15 vs Top 10 vs Bottom 5)
  const [sectorTierFilter, setSectorTierFilter] = useState<'all' | 'top10' | 'bottom5'>('all');

  // Selected Industry State (Default to #1 AI, Multi-Select Supported)
  const [selectedIndustryIds, setSelectedIndustryIds] = useState<string[]>([INDUSTRY_DECISION_DATABASE[0].id]);

  // Selected Industries List derived from selectedIndustryIds
  const selectedIndustries = useMemo(() => {
    const list = INDUSTRY_DECISION_DATABASE.filter(ind => selectedIndustryIds.includes(ind.id));
    return list.length > 0 ? list : [INDUSTRY_DECISION_DATABASE[0]];
  }, [selectedIndustryIds]);

  // Primary selected industry for single-sector components
  const selectedIndustry = selectedIndustries[0];

  // Multi-Selected Needs State
  const [selectedNeedIds, setSelectedNeedIds] = useState<string[]>([
    INDUSTRY_DECISION_DATABASE[0].industryNeeds[0]?.id || 'need_1'
  ]);

  // Primary selected need for legacy subcomponents
  const selectedNeed = useMemo(() => {
    return selectedIndustry.industryNeeds.find(n => selectedNeedIds.includes(n.id)) ||
      selectedIndustry.industryNeeds[0] ||
      null;
  }, [selectedIndustry, selectedNeedIds]);

  // Selected Grants State for Batch Operations
  const [selectedGrantIds, setSelectedGrantIds] = useState<string[]>([]);

  // Multi-Agency Filter State
  const [selectedAgencies, setSelectedAgencies] = useState<string[]>([]);

  // Multi-Selected Stocks State for Comparison
  const [selectedStockSymbols, setSelectedStockSymbols] = useState<string[]>(['NVDA', 'MSFT', 'PLTR']);

  // Auto-Pilot on Industry Choice (Automate to the end)
  const [autoPilotOnChoice, setAutoPilotOnChoice] = useState<boolean>(true);
  const [showAutoRunner, setShowAutoRunner] = useState<boolean>(false);

  // Auto Apply on 1st Day Toggle State
  const [autoApplyOnDay1, setAutoApplyOnDay1] = useState<boolean>(true);

  // 25 Product/Service Active Toggles (Default All ON)
  const [activeOfferings, setActiveOfferings] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    // Pre-populate all industry products and services across database with true
    INDUSTRY_DECISION_DATABASE.forEach(ind => {
      ind.products.forEach(p => { initial[p.id] = true; });
      ind.services.forEach(s => { initial[s.id] = true; });
    });
    // Add extra 5 enterprise upgrades
    for (let i = 1; i <= 5; i++) {
      initial[`core_upgrade_${i}`] = true;
    }
    return initial;
  });

  // Search Filters
  const [productSearch, setProductSearch] = useState('');
  const [stockSearch, setStockSearch] = useState('');
  const [grantSearch, setGrantSearch] = useState('');
  const [showAllGrants, setShowAllGrants] = useState(false);

  // Interactive Execution State for 19-Stage Pipeline
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(-1);
  const [pipelineLogs, setPipelineLogs] = useState<string[]>([]);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [copiedJSON, setCopiedJSON] = useState(false);

  // Toggle single industry selection
  const toggleIndustrySelection = (ind: IndustryData, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedIndustryIds(prev => {
      if (prev.includes(ind.id)) {
        if (prev.length === 1) return prev; // Keep at least one selected
        return prev.filter(id => id !== ind.id);
      } else {
        return [...prev, ind.id];
      }
    });
  };

  // Select only this single industry (exclusive click)
  const selectSingleIndustry = (ind: IndustryData) => {
    setSelectedIndustryIds([ind.id]);
    setSelectedNeedIds([ind.industryNeeds[0]?.id || 'need_1']);
    if (autoPilotOnChoice) {
      setShowAutoRunner(true);
    }
  };

  // Quick Sector Multi-Select Presets
  const selectAllSectors = () => {
    setSelectedIndustryIds(INDUSTRY_DECISION_DATABASE.map(i => i.id));
  };

  const selectTop10Sectors = () => {
    setSelectedIndustryIds(TOP_10_SECTORS.map(i => i.id));
  };

  const selectBottom5Sectors = () => {
    setSelectedIndustryIds(BOTTOM_5_SECTORS.map(i => i.id));
  };

  const clearIndustrySelection = () => {
    setSelectedIndustryIds([INDUSTRY_DECISION_DATABASE[0].id]);
  };

  // Toggle Need Selection
  const toggleNeedSelection = (needId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedNeedIds(prev => {
      if (prev.includes(needId)) {
        if (prev.length === 1) return prev;
        return prev.filter(id => id !== needId);
      } else {
        return [...prev, needId];
      }
    });
  };

  // All Available Needs across all currently selected industries
  const aggregatedIndustryNeeds = useMemo(() => {
    const map = new Map<string, IndustryNeed>();
    selectedIndustries.forEach(ind => {
      ind.industryNeeds.forEach(need => {
        if (!map.has(need.id)) {
          map.set(need.id, need);
        }
      });
    });
    return Array.from(map.values());
  }, [selectedIndustries]);

  const selectAllAggregatedNeeds = () => {
    setSelectedNeedIds(aggregatedIndustryNeeds.map(n => n.id));
  };

  const clearNeedSelection = () => {
    if (aggregatedIndustryNeeds[0]) {
      setSelectedNeedIds([aggregatedIndustryNeeds[0].id]);
    }
  };

  // Toggle Agency Filter
  const toggleAgencyFilter = (agency: string) => {
    if (agency === 'ALL') {
      setSelectedAgencies([]);
      return;
    }
    setSelectedAgencies(prev => {
      if (prev.includes(agency)) {
        return prev.filter(a => a !== agency);
      } else {
        return [...prev, agency];
      }
    });
  };

  // Toggle Grant Selection
  const toggleGrantSelection = (grantId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedGrantIds(prev => {
      if (prev.includes(grantId)) {
        return prev.filter(id => id !== grantId);
      } else {
        return [...prev, grantId];
      }
    });
  };

  // Toggle Stock Selection
  const toggleStockSelection = (symbol: string) => {
    setSelectedStockSymbols(prev => {
      if (prev.includes(symbol)) {
        if (prev.length === 1) return prev;
        return prev.filter(s => s !== symbol);
      } else {
        return [...prev, symbol];
      }
    });
  };

  // Filtered Sectors List
  const displayedSectors = useMemo(() => {
    if (sectorTierFilter === 'top10') return TOP_10_SECTORS;
    if (sectorTierFilter === 'bottom5') return BOTTOM_5_SECTORS;
    return INDUSTRY_DECISION_DATABASE;
  }, [sectorTierFilter]);

  // Handle Sector Tier Change safely without breaking selectedIndustry
  const handleSectorTierChange = (tier: 'all' | 'top10' | 'bottom5') => {
    setSectorTierFilter(tier);
  };

  // Choose industry & optionally automate to the end
  const handleChooseIndustry = (ind: IndustryData, forceAutomate: boolean = false) => {
    selectSingleIndustry(ind);
    if (forceAutomate || autoPilotOnChoice) {
      setShowAutoRunner(true);
    }
  };

  // Toggle single offering on/off
  const toggleOffering = (id: string) => {
    setActiveOfferings(prev => ({
      ...prev,
      [id]: prev[id] === undefined ? false : !prev[id],
    }));
  };

  // Toggle all offerings for selected industry
  const toggleAllOfferings = (enable: boolean) => {
    const nextState = { ...activeOfferings };
    selectedIndustry.products.forEach(p => { nextState[p.id] = enable; });
    selectedIndustry.services.forEach(s => { nextState[s.id] = enable; });
    for (let i = 1; i <= 5; i++) {
      nextState[`core_upgrade_${i}`] = enable;
    }
    setActiveOfferings(nextState);
  };

  // Copy workflow JSON
  const handleCopyWorkflowJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(AUTO_BUSINESS_INTELLIGENCE_WORKFLOW, null, 2));
    setCopiedJSON(true);
    setTimeout(() => setCopiedJSON(false), 2000);
  };

  // Run 19-Stage Pipeline Simulator
  const handleRunPipeline = () => {
    setIsRunningPipeline(true);
    setCurrentStageIndex(0);
    setCompletedStages([]);
    setPipelineLogs([
      '=== INITIATING AUTO BUSINESS INTELLIGENCE PIPELINE (19 STAGES) ===',
      `Target Industry Sector: ${selectedIndustry.name.toUpperCase()}`,
      `Execution Timestamp: ${new Date().toISOString()}`,
      '------------------------------------------------------------------',
    ]);

    let stageIdx = 0;
    const interval = setInterval(() => {
      if (stageIdx >= AUTO_BUSINESS_INTELLIGENCE_WORKFLOW.execution_order.length) {
        clearInterval(interval);
        setIsRunningPipeline(false);
        setCurrentStageIndex(-1);
        setPipelineLogs((prev) => [
          ...prev,
          '------------------------------------------------------------------',
          'SUCCESS: ALL 19 STAGES EXECUTED. DATASETS STORED IN WORKSPACE.',
          `Outputs Ready: nasdaq.csv, grants.csv, incofday, tikofday, secofday, irs_data.csv`,
        ]);
        return;
      }

      const stage = AUTO_BUSINESS_INTELLIGENCE_WORKFLOW.execution_order[stageIdx];
      setCurrentStageIndex(stageIdx);
      setCompletedStages((prev) => [...prev, stage.stage]);

      setPipelineLogs((prev) => [
        ...prev,
        `[STAGE ${stage.stage}/19] ${stage.name.toUpperCase()} - ${stage.purpose}`,
        ...stage.steps.map((st) => `  ↳ Step ${st.step}: ${st.name} ${st.command ? `($ ${st.command})` : ''}`),
        `  ✔ Generated Artifacts: ${stage.outputs.join(', ')}`,
        '------------------------------------------------------------------',
      ]);

      stageIdx++;
    }, 1100);
  };

  // Filtered Stocks
  const topGainers = NASDAQ_MARKET_DATA.filter((s) => s.pctChange.startsWith('+')).sort(
    (a, b) => parseFloat(b.pctChange.replace('+', '').replace('%', '')) - parseFloat(a.pctChange.replace('+', '').replace('%', ''))
  );

  const bottomDecliners = NASDAQ_MARKET_DATA.filter((s) => s.pctChange.startsWith('-')).sort(
    (a, b) => parseFloat(a.pctChange.replace('-', '').replace('%', '')) - parseFloat(b.pctChange.replace('-', '').replace('%', ''))
  );

  const filteredStock = NASDAQ_MARKET_DATA.filter(
    (st) =>
      st.symbol.toLowerCase().includes(stockSearch.toLowerCase()) ||
      st.companyName.toLowerCase().includes(stockSearch.toLowerCase()) ||
      st.sector.toLowerCase().includes(stockSearch.toLowerCase())
  );

  // Industry-Matched Grants.gov Opportunities (Multi-Sector & Multi-Agency supported)
  const industryMatchedGrants = useMemo(() => {
    const selectedIdsSet = new Set(selectedIndustries.map(i => i.id));
    const selectedNamesTokens = selectedIndustries.map(i => i.name.toLowerCase().split(' ')[0]);

    return GRANT_OPPORTUNITIES.filter((g) => {
      const isDirectIndustryMatch = selectedIdsSet.has(g.industryId || '');
      const isCategoryMatch = selectedNamesTokens.some(tok => 
        g.category.toLowerCase().includes(tok) || tok.includes(g.category.toLowerCase())
      );

      if (!showAllGrants && !isDirectIndustryMatch && !isCategoryMatch && selectedIndustries.length > 0) {
        return false;
      }

      const matchesSearch =
        !grantSearch ||
        g.title.toLowerCase().includes(grantSearch.toLowerCase()) ||
        g.agency.toLowerCase().includes(grantSearch.toLowerCase()) ||
        g.category.toLowerCase().includes(grantSearch.toLowerCase()) ||
        g.description.toLowerCase().includes(grantSearch.toLowerCase());

      const matchesAgency =
        selectedAgencies.length === 0 ||
        selectedAgencies.some(ag => g.agency.toLowerCase().includes(ag.toLowerCase()));

      return matchesSearch && matchesAgency;
    });
  }, [selectedIndustries, showAllGrants, grantSearch, selectedAgencies]);

  // Batch Grant Operations
  const handleSelectAllMatchingGrants = () => {
    setSelectedGrantIds(industryMatchedGrants.map(g => g.id));
  };

  const handleClearGrantSelection = () => {
    setSelectedGrantIds([]);
  };

  const handleExportGrantsManifest = () => {
    const selectedList = industryMatchedGrants.filter(g => selectedGrantIds.includes(g.id));
    const payload = selectedList.length > 0 ? selectedList : industryMatchedGrants;
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grants_manifest_${selectedIndustry.id}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Master Unfiltered Grants List for Mode 4
  const masterFilteredGrants = GRANT_OPPORTUNITIES.filter(
    (g) =>
      g.title.toLowerCase().includes(grantSearch.toLowerCase()) ||
      g.category.toLowerCase().includes(grantSearch.toLowerCase()) ||
      g.agency.toLowerCase().includes(grantSearch.toLowerCase())
  );

  // USA Spending Awards for Selected Industry
  const industryUsaSpending = USA_SPENDING_DATA.filter(
    (u) =>
      u.description.toLowerCase().includes(selectedIndustry.name.toLowerCase().split(' ')[0]) ||
      u.awardingAgency.toLowerCase().includes(selectedIndustry.name.toLowerCase().split(' ')[0]) ||
      true
  );

  // Products & Services filtered by search
  const filteredProducts = selectedIndustry.products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.valueProp.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.solvesNeed.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredServices = selectedIndustry.services.filter(
    (s) =>
      s.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      s.valueProp.toLowerCase().includes(productSearch.toLowerCase()) ||
      s.solvesNeed.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Strategic Core Upgrades (5 items to make 25 total: 10 products + 10 services + 5 strategic modules)
  const coreStrategicUpgrades = [
    {
      id: 'core_upgrade_1',
      name: 'Automated Federal Grant Submission Dispatcher',
      type: 'Automation Module',
      valueProp: 'Auto-submits SF-424 & technical research proposals to Grants.gov APIs on Day 1.',
      billingRate: '$1,200 / submission',
      marginPct: '94%',
      externalUrl: 'https://www.grants.gov',
      aiEnhancement: 'Auto-fills Section B federal budget categories based on live team roster',
    },
    {
      id: 'core_upgrade_2',
      name: 'IRS Entity & SAM.gov FastTrack Integration',
      type: 'Compliance Module',
      valueProp: 'Provisions IRS SS-4 EIN and links CAGE code directly to SAM.gov UEI registry.',
      billingRate: '$750 fixed',
      marginPct: '91%',
      externalUrl: 'https://sam.gov/content/entity-registration',
      aiEnhancement: 'Generates NIST SP 800-171 system security plan for prime contracting',
    },
    {
      id: 'core_upgrade_3',
      name: 'Dynamic Algorithmic Viability Score Engine',
      type: 'Intelligence Engine',
      valueProp: 'Calculates real-time [numbers, funding, products, needs] composite metrics.',
      billingRate: '$499 / mo',
      marginPct: '96%',
      externalUrl: 'https://www.sec.gov/edgar',
      aiEnhancement: 'Monitors NASDAQ 10-K disclosures and grants.gov solicitations daily',
    },
    {
      id: 'core_upgrade_4',
      name: 'DCAA-Compliant Chart of Accounts Ledger',
      type: 'Financial Module',
      valueProp: 'Enforces FAR Part 31 direct vs indirect overhead segregation to pass audits.',
      billingRate: '$1,500 / setup',
      marginPct: '89%',
      externalUrl: 'https://www.dcaa.mil',
      aiEnhancement: 'Flags unallowable entertainment/lobbying expenses automatically',
    },
    {
      id: 'core_upgrade_5',
      name: 'Autonomous Multi-Agent Go-to-Market Outbound',
      type: 'Revenue Module',
      valueProp: 'Dispatches targeted B2B enterprise outreach to verified buyer profiles.',
      billingRate: '$1,950 / mo',
      marginPct: '92%',
      externalUrl: 'https://www.sba.gov',
      aiEnhancement: 'Synthesizes domain-specific case studies tailored to target buyer titles',
    },
  ];

  // Calculate active counts out of 25
  const activeProductsCount = selectedIndustry.products.filter(p => activeOfferings[p.id] !== false).length;
  const activeServicesCount = selectedIndustry.services.filter(s => activeOfferings[s.id] !== false).length;
  const activeCoreCount = coreStrategicUpgrades.filter(c => activeOfferings[c.id] !== false).length;
  const totalActiveOfferingsCount = activeProductsCount + activeServicesCount + activeCoreCount;

  // Selected offering names for paperwork generation
  const activeOfferingNames = [
    ...selectedIndustry.products.filter(p => activeOfferings[p.id] !== false).map(p => p.name),
    ...selectedIndustry.services.filter(s => activeOfferings[s.id] !== false).map(s => s.name),
    ...coreStrategicUpgrades.filter(c => activeOfferings[c.id] !== false).map(c => c.name),
  ];

  // Step metadata
  const steps = [
    {
      step: 1,
      title: '1. Choose Sector',
      subtitle: 'Top 10 vs Bottom 5 Verticals',
      badge: `${selectedIndustry.rank ? `#${selectedIndustry.rank}` : ''} ${selectedIndustry.category}`,
    },
    {
      step: 2,
      title: '2. Industry Needs',
      subtitle: 'Analyze pain points & gaps',
      badge: `${selectedIndustry.industryNeeds.length} Needs`,
    },
    {
      step: 3,
      title: '3. Grants & Paperwork',
      subtitle: '12 Federal forms + Auto Apply',
      badge: `${industryMatchedGrants.length} Grants • 12 Docs`,
    },
    {
      step: 4,
      title: '4. Products & Services (25)',
      subtitle: '10 Prod + 10 Serv + 5 Core',
      badge: `${totalActiveOfferingsCount}/25 Active`,
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* ========================================== */}
      {/* DOUBLE-LAYERED TOP CONTROL NAVIGATION MENU */}
      {/* ========================================== */}
      <div className="bg-[#08090a] rounded-2xl border border-[#1f2228] p-4 space-y-4 shadow-xl">
        
        {/* ROW 1: MASTER PLATFORM MODE MENU */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1f2228] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30 px-2 py-0.5 rounded flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Unified Business Engine
              </span>
              <span className="text-xs text-[#888e96] font-mono">Grants.gov • SAM.gov • NASDAQ • IRS BMF</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
              <Target className="w-5 h-5 text-[#00ff9d]" /> Industry Startup Engine & Market Intelligence
            </h2>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center gap-1.5 bg-[#0d1117] p-1.5 rounded-xl border border-[#1f2228] overflow-x-auto shrink-0">
            <button
              id="subtab-industry-flow"
              onClick={() => setActiveSubTab('industry_flow')}
              className={`text-xs px-3.5 py-2 rounded-lg font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeSubTab === 'industry_flow'
                  ? 'bg-[#00ff9d] text-[#08090a] shadow-[0_0_15px_rgba(0,255,157,0.3)]'
                  : 'text-[#888e96] hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" /> 1. Industry Startup Flow
            </button>

            <button
              id="subtab-paperwork"
              onClick={() => setActiveSubTab('paperwork')}
              className={`text-xs px-3.5 py-2 rounded-lg font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeSubTab === 'paperwork'
                  ? 'bg-[#00ff9d] text-[#08090a] shadow-[0_0_15px_rgba(0,255,157,0.3)]'
                  : 'text-[#888e96] hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" /> 2. Funding Paperwork Suite
            </button>

            <button
              id="subtab-upgrades"
              onClick={() => setActiveSubTab('upgrades')}
              className={`text-xs px-3.5 py-2 rounded-lg font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeSubTab === 'upgrades'
                  ? 'bg-[#00ff9d] text-[#08090a] shadow-[0_0_15px_rgba(0,255,157,0.3)]'
                  : 'text-[#888e96] hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4" /> 3. 25 Startup Engine Upgrades
            </button>

            <button
              id="subtab-pipeline"
              onClick={() => setActiveSubTab('pipeline')}
              className={`text-xs px-3.5 py-2 rounded-lg font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeSubTab === 'pipeline'
                  ? 'bg-[#00ff9d] text-[#08090a] shadow-[0_0_15px_rgba(0,255,157,0.3)]'
                  : 'text-[#888e96] hover:text-white'
              }`}
            >
              <Workflow className="w-4 h-4" /> 4. 19-Stage Auto BI Pipeline
            </button>

            <button
              id="subtab-stocks"
              onClick={() => setActiveSubTab('stocks')}
              className={`text-xs px-3.5 py-2 rounded-lg font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeSubTab === 'stocks'
                  ? 'bg-[#00ff9d] text-[#08090a] shadow-[0_0_15px_rgba(0,255,157,0.3)]'
                  : 'text-[#888e96] hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" /> 5. Stocks & Market
            </button>

            <button
              id="subtab-grants"
              onClick={() => setActiveSubTab('grants')}
              className={`text-xs px-3.5 py-2 rounded-lg font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeSubTab === 'grants'
                  ? 'bg-[#00ff9d] text-[#08090a] shadow-[0_0_15px_rgba(0,255,157,0.3)]'
                  : 'text-[#888e96] hover:text-white'
              }`}
            >
              <Landmark className="w-4 h-4" /> 6. Grants.gov Database
            </button>
          </div>
        </div>

        {/* ROW 2: STEPPED PROCESS MENU (WHEN IN INDUSTRY STARTUP FLOW) */}
        {activeSubTab === 'industry_flow' && (
          <div className="space-y-3 pt-1 font-mono">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#888e96] gap-2">
              <span className="flex items-center gap-2 text-white font-bold">
                <Sparkles className="w-4 h-4 text-[#00ff9d]" />
                Guided 4-Step Startup Roadmap: <strong className="text-[#00ff9d]">{selectedIndustry.name}</strong>
              </span>

              <div className="flex items-center gap-3 flex-wrap">
                {/* Auto-Pilot to End Button */}
                <button
                  id="btn-automate-to-end-main"
                  onClick={() => setShowAutoRunner(true)}
                  className="text-[11px] px-3 py-1 bg-[#00ff9d] hover:bg-[#00ff9d]/90 text-black rounded-lg font-bold flex items-center gap-1.5 transition shadow-[0_0_12px_rgba(0,255,157,0.35)]"
                  title="Run autonomous end-to-end launch pipeline for selected sector"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  ⚡ Automate to the End
                </button>

                {/* Auto Apply Toggle Indicator */}
                <button
                  onClick={() => setAutoApplyOnDay1(!autoApplyOnDay1)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border font-bold flex items-center gap-1.5 transition ${
                    autoApplyOnDay1
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                  title="Auto apply to eligible federal grants and SBA registrations on Day 1"
                >
                  <Zap className={`w-3 h-3 ${autoApplyOnDay1 ? 'text-amber-400 fill-amber-400' : 'text-slate-500'}`} />
                  Auto Apply Day 1: {autoApplyOnDay1 ? 'ON' : 'OFF'}
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-cyan-400 font-bold">
                    Step {activeStep}/4 ({activeStep * 25}%)
                  </span>
                  <div className="w-20 h-2 bg-[#121417] rounded-full overflow-hidden border border-[#1f2228]">
                    <div
                      className="h-full bg-gradient-to-r from-[#00ff9d] to-cyan-400 transition-all duration-300"
                      style={{ width: `${activeStep * 25}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Stepper Buttons Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {steps.map((st) => {
                const isActive = activeStep === st.step;
                const isPassed = activeStep > st.step;

                return (
                  <button
                    key={st.step}
                    id={`stepper-step-${st.step}`}
                    onClick={() => setActiveStep(st.step)}
                    className={`p-3 rounded-xl border text-left transition-all relative space-y-1 ${
                      isActive
                        ? 'bg-[#00ff9d]/15 border-[#00ff9d] text-white shadow-[0_0_15px_rgba(0,255,157,0.2)]'
                        : isPassed
                        ? 'bg-[#08090a] border-[#00ff9d]/40 text-slate-300 hover:border-[#00ff9d]'
                        : 'bg-[#0d1117] border-[#1f2228] text-[#888e96] hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span
                          className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                            isActive
                              ? 'bg-[#00ff9d] text-black'
                              : isPassed
                              ? 'bg-[#00ff9d]/20 text-[#00ff9d] border border-[#00ff9d]/40'
                              : 'bg-[#1f2228] text-[#888e96]'
                          }`}
                        >
                          {isPassed ? '✓' : st.step}
                        </span>
                        {st.title}
                      </span>

                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#121417] text-[#00ff9d] border border-[#1f2228]">
                        {st.badge}
                      </span>
                    </div>

                    <p className="text-[10px] text-[#888e96] pl-6">{st.subtitle}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* ==================================================== */}
      {/* MODE 1: INDUSTRY STARTUP DECISION FLOW (4-STEP ROADMAP) */}
      {/* ==================================================== */}
      {activeSubTab === 'industry_flow' && (
        <div className="space-y-8">

          {/* AUTONOMOUS EXECUTION RUNNER (WHEN TRIGGERED OR AUTO-PILOT RUNNING) */}
          {showAutoRunner && (
            <div className="mb-4">
              <AutomatedExecutionRunner
                industry={selectedIndustry}
                grantOpportunities={GRANT_OPPORTUNITIES}
                autoApplyOnDay1={autoApplyOnDay1}
                onToggleAutoApply={setAutoApplyOnDay1}
                onClose={() => setShowAutoRunner(false)}
                onSelectAnotherIndustry={() => {
                  setShowAutoRunner(false);
                  setActiveStep(1);
                }}
              />
            </div>
          )}

          {/* STEP 1: PICK AN INDUSTRY SECTOR (TOP 10 VS BOTTOM 5 FILTER + MULTI-SECTOR SELECTION) */}
          {(activeStep === 1 || activeStep === 0) && (
            <div className="bento-card p-6 space-y-5 border-[#00ff9d]/30">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#1f2228] pb-4 gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#00ff9d] text-[#08090a] font-mono font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <div>
                    <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      Step 1: Choose Your Industry Sector(s)
                      <span className="text-[10px] font-normal text-[#00ff9d] bg-[#00ff9d]/10 px-2 py-0.5 rounded border border-[#00ff9d]/30">
                        {selectedIndustryIds.length} Selected
                      </span>
                    </h3>
                    <p className="text-xs text-[#888e96] mt-0.5 font-mono">
                      Multi-select any combination across <strong className="text-emerald-400">Top 10 High-Growth</strong> and <strong className="text-amber-400">Bottom 5 Turnaround</strong> verticals.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Multi-Select Quick Presets */}
                  <div className="flex items-center gap-1.5 bg-[#0d1117] p-1 rounded-xl border border-[#1f2228] text-xs font-mono">
                    <span className="text-[10px] text-[#888e96] px-1.5 uppercase tracking-wider flex items-center gap-1">
                      <ListChecks className="w-3 h-3 text-[#00ff9d]" /> Multi-Select:
                    </span>
                    <button
                      onClick={selectAllSectors}
                      className="px-2 py-1 rounded bg-[#08090a] text-slate-300 hover:text-white hover:border-[#00ff9d] border border-[#1f2228] text-[11px]"
                    >
                      All 15
                    </button>
                    <button
                      onClick={selectTop10Sectors}
                      className="px-2 py-1 rounded bg-[#08090a] text-blue-300 hover:text-white border border-[#1f2228] text-[11px]"
                    >
                      Top 10
                    </button>
                    <button
                      onClick={selectBottom5Sectors}
                      className="px-2 py-1 rounded bg-[#08090a] text-amber-300 hover:text-white border border-[#1f2228] text-[11px]"
                    >
                      Bottom 5
                    </button>
                    {selectedIndustryIds.length > 1 && (
                      <button
                        onClick={clearIndustrySelection}
                        className="px-2 py-1 rounded text-[#888e96] hover:text-rose-400 text-[11px]"
                        title="Reset to primary sector"
                      >
                        Reset (1)
                      </button>
                    )}
                  </div>

                  {/* Auto-Pilot Toggle */}
                  <div className="flex items-center gap-2 bg-[#0d1117] px-3 py-1.5 rounded-xl border border-[#1f2228] text-xs font-mono">
                    <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-[#888e96] hidden sm:inline">Auto-Pilot:</span>
                    <button
                      id="toggle-autopilot-mode"
                      onClick={() => setAutoPilotOnChoice(!autoPilotOnChoice)}
                      className={`px-2.5 py-0.5 rounded-lg font-bold transition flex items-center gap-1 ${
                        autoPilotOnChoice
                          ? 'bg-[#00ff9d] text-black shadow'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                      title="When ON, choosing an industry immediately automates the entire launch sequence to the end"
                    >
                      {autoPilotOnChoice ? 'ON (Auto-Execute)' : 'OFF (Manual)'}
                    </button>
                  </div>

                  <button
                    onClick={() => handleChooseIndustry(selectedIndustry, true)}
                    className="px-4 py-2 bg-[#00ff9d] hover:bg-[#00ff9d]/90 text-black font-mono font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shrink-0 shadow-[0_0_12px_rgba(0,255,157,0.3)]"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    Automate Launch ({selectedIndustryIds.length} Sector{selectedIndustryIds.length > 1 ? 's' : ''}) <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Multi-Sector Conglomerate Portfolio Banner */}
              {selectedIndustries.length > 1 && (
                <div className="bg-gradient-to-r from-[#00ff9d]/10 via-[#0d1117] to-cyan-500/10 p-4 rounded-xl border border-[#00ff9d]/30 font-mono space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#00ff9d]" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Multi-Sector Conglomerate Portfolio Active ({selectedIndustries.length} Verticals)
                      </span>
                    </div>
                    <span className="text-[11px] text-cyan-400 font-bold">
                      Cross-Industry Synergies Enabled
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {selectedIndustries.map(ind => (
                      <span
                        key={ind.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#08090a] border border-[#00ff9d]/40 text-[#00ff9d] font-bold text-[11px]"
                      >
                        <CheckSquare className="w-3 h-3 text-[#00ff9d]" />
                        {ind.name}
                        <button
                          onClick={(e) => toggleIndustrySelection(ind, e)}
                          className="hover:text-rose-400 ml-1"
                          title="Remove sector"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Viability Score for Currently Selected Industry */}
              <div className="bg-[#08090a] p-4 rounded-xl border border-[#1f2228]">
                <DynamicBusinessScoreCalculator
                  selectedIndustry={selectedIndustry}
                  onSelectIndustry={(ind) => handleChooseIndustry(ind, false)}
                  onProceedToStep3={() => setActiveStep(3)}
                />
              </div>

              {/* Sector Cards Grid with Checkboxes and External Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
                {displayedSectors.map((ind) => {
                  const isSelected = selectedIndustryIds.includes(ind.id);
                  const isPrimary = selectedIndustry.id === ind.id;
                  const isTop10 = ind.tier === 'top10' || (ind.rank && ind.rank <= 10);
                  const sectorScore = calculateBusinessViabilityScore(ind, GRANT_OPPORTUNITIES);
                  const externalReferenceUrl = ind.externalUrl || `https://www.sec.gov/edgar/searchedgar/companysearch`;

                  return (
                    <div
                      key={ind.id}
                      id={`sector-card-${ind.id}`}
                      onClick={() => handleChooseIndustry(ind, false)}
                      className={`text-left p-3.5 rounded-xl border transition-all space-y-2.5 relative font-mono cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#00ff9d]/15 border-[#00ff9d] text-white shadow-[0_0_20px_rgba(0,255,157,0.25)] ring-1 ring-[#00ff9d]'
                          : 'bg-[#08090a] border-[#1f2228] text-[#888e96] hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5">
                            {/* Multi-Select Toggle Checkbox */}
                            <button
                              type="button"
                              onClick={(e) => toggleIndustrySelection(ind, e)}
                              className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'bg-[#00ff9d] text-black'
                                  : 'bg-[#121417] border border-[#1f2228] text-[#888e96] hover:text-white'
                              }`}
                              title={isSelected ? 'Deselect sector from portfolio' : 'Add sector to multi-selection'}
                            >
                              {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Square className="w-3 h-3" />}
                            </button>

                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                              isTop10 
                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            }`}>
                              {ind.rank ? `#${ind.rank}` : ''} {isTop10 ? 'Top 10' : 'Bottom 5'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* Score Chip */}
                            <span className="text-[10px] font-bold text-[#00ff9d] bg-[#00ff9d]/10 px-1.5 py-0.5 rounded">
                              {sectorScore.totalScore}/100
                            </span>

                            {/* External Link on Card */}
                            <a
                              href={externalReferenceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1 bg-[#121417] hover:bg-[#00ff9d] text-slate-400 hover:text-black rounded border border-[#1f2228] transition"
                              title={`View official SEC/Industry filing: ${externalReferenceUrl}`}
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>

                        <div className="text-xs font-bold text-white pt-1.5 leading-snug flex items-center justify-between">
                          <span>{ind.name}</span>
                          {isPrimary && (
                            <span className="text-[9px] text-[#00ff9d] bg-[#00ff9d]/10 px-1 rounded font-bold">
                              PRIMARY
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#888e96] line-clamp-2 leading-relaxed mt-1">{ind.tagline}</p>
                      </div>

                      <div className="pt-2 border-t border-[#1f2228] space-y-1.5 text-[10px]">
                        <div className="flex items-center justify-between text-slate-300">
                          <span>Market: <strong className="text-[#00ff9d]">{ind.marketSize}</strong></span>
                          <span>Growth: <strong className="text-cyan-400">{ind.growthRate}</strong></span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-amber-400/90 truncate text-[9px]">
                            {ind.activeGrantFunding}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleChooseIndustry(ind, true);
                            }}
                            className="px-2 py-0.5 bg-[#00ff9d]/20 hover:bg-[#00ff9d] text-[#00ff9d] hover:text-black rounded text-[9px] font-bold flex items-center gap-1 border border-[#00ff9d]/40 transition shrink-0 shadow-sm"
                            title="Automate entire startup pipeline from start to finish"
                          >
                            <Zap className="w-2.5 h-2.5 fill-current" /> Auto-Execute
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: FIND WHAT THE INDUSTRY NEEDS (MULTI-NEED SELECTION SUPPORTED) */}
          {(activeStep === 2 || activeStep === 0) && (
            <div className="bento-card p-6 space-y-5 border-[#00ff9d]/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1f2228] pb-3 gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#00ff9d] text-[#08090a] font-mono font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <div>
                    <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      Step 2: Unmet Needs & Market Bottlenecks ({selectedNeedIds.length} Selected)
                    </h3>
                    <p className="text-xs text-[#888e96] mt-0.5 font-mono">
                      Multi-select high-urgency pain points across <strong className="text-[#00ff9d]">{selectedIndustries.map(i => i.name).join(', ')}</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={selectAllAggregatedNeeds}
                    className="px-2.5 py-1 bg-[#08090a] hover:bg-[#1f2228] text-slate-300 font-mono text-xs rounded-xl border border-[#1f2228] flex items-center gap-1"
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-[#00ff9d]" /> Select All ({aggregatedIndustryNeeds.length})
                  </button>
                  {selectedNeedIds.length > 1 && (
                    <button
                      onClick={clearNeedSelection}
                      className="px-2 py-1 text-[#888e96] hover:text-amber-400 font-mono text-xs underline"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={() => setActiveStep(1)}
                    className="px-3 py-1.5 bg-[#121417] hover:bg-[#1f2228] text-slate-300 font-mono text-xs rounded-xl flex items-center gap-1 border border-[#1f2228]"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  <button
                    onClick={() => setActiveStep(3)}
                    className="px-4 py-2 bg-[#00ff9d] hover:bg-[#00ff9d]/90 text-black font-mono font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                  >
                    Next: Find Grants & Process Paperwork <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-xs font-mono text-[#888e96] flex flex-wrap items-center gap-4 bg-[#08090a] p-3 rounded-xl border border-[#1f2228]">
                <span>Active Sector(s): <strong className="text-[#00ff9d]">{selectedIndustries.length} Vertical{selectedIndustries.length > 1 ? 's' : ''}</strong></span>
                <span>Total Needs Catalog: <strong className="text-cyan-400">{aggregatedIndustryNeeds.length} Problems</strong></span>
                <span>Active Funding Available: <strong className="text-amber-400">{selectedIndustry.activeGrantFunding}</strong></span>
                <span>Top Tickers: <strong className="text-slate-300">{selectedIndustry.topTickers.join(', ')}</strong></span>
              </div>

              {/* Need Selection Grid with Checkboxes and Multi-Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {aggregatedIndustryNeeds.map((need) => {
                  const isNeedSelected = selectedNeedIds.includes(need.id);
                  const externalNeedLink = need.externalUrl || 'https://www.uspto.gov/patents/apply';
                  return (
                    <div
                      key={need.id}
                      id={`need-card-${need.id}`}
                      onClick={(e) => toggleNeedSelection(need.id, e)}
                      className={`text-left p-3.5 rounded-xl border transition-all space-y-2 font-mono cursor-pointer flex flex-col justify-between ${
                        isNeedSelected
                          ? 'bg-[#00ff9d]/15 border-[#00ff9d] text-white shadow-[0_0_10px_rgba(0,255,157,0.2)] ring-1 ring-[#00ff9d]'
                          : 'bg-[#08090a] border-[#1f2228] text-[#888e96] hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                              isNeedSelected ? 'bg-[#00ff9d] text-black font-bold' : 'bg-[#121417] border border-[#1f2228]'
                            }`}>
                              {isNeedSelected ? '✓' : ''}
                            </span>
                            <span
                              className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
                                need.urgency === 'Critical'
                                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                  : need.urgency === 'High'
                                  ? 'bg-amber-400/10 text-amber-400 border-amber-400/30'
                                  : 'bg-cyan-400/10 text-cyan-400 border-cyan-400/30'
                              }`}
                            >
                              {need.urgency} Need
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-[#00ff9d]" />
                            <a
                              href={externalNeedLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1 bg-[#121417] hover:bg-[#00ff9d] text-slate-400 hover:text-black rounded border border-[#1f2228] transition"
                              title="External patent & standards documentation"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>

                        <div className="text-xs font-bold text-white mt-1">{need.title}</div>
                        <p className="text-[11px] text-[#888e96] line-clamp-2 mt-1">{need.description}</p>
                      </div>

                      <div className="pt-2 border-t border-[#1f2228] text-[10px] text-emerald-400/90 truncate">
                        Solves: {need.targetProductOpportunity}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Multi-Need Problem Matrix (Synthesizing All Selected Needs) */}
              {selectedNeedIds.length > 0 && (
                <div className="bg-[#08090a] p-4 rounded-xl border border-[#1f2228] space-y-3 font-mono">
                  <div className="flex items-center justify-between border-b border-[#1f2228] pb-2">
                    <span className="text-xs font-bold text-[#00ff9d] flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-[#00ff9d]" /> Multi-Problem Opportunity Matrix ({selectedNeedIds.length} Needs Selected)
                    </span>
                    <a
                      href="https://www.nist.gov"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      NIST Standards Ref <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    {aggregatedIndustryNeeds
                      .filter(n => selectedNeedIds.includes(n.id))
                      .map(need => (
                        <div key={need.id} className="bg-[#121417] p-3 rounded-lg border border-[#1f2228] space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-white font-bold">{need.title}</span>
                            <span className="text-[9px] text-rose-400 font-bold">{need.urgency}</span>
                          </div>
                          <p className="text-[11px] text-[#888e96]">{need.marketGap}</p>
                          <div className="text-[10px] text-[#00ff9d] pt-1 border-t border-[#1f2228]/60">
                            Tailwind: {need.federalGrantTailwind}
                          </div>
                          <div className="text-[10px] text-cyan-400">
                            Solution: {need.targetProductOpportunity}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 3: GRANTS.GOV & FEDERAL FUNDING PAPERWORK SUITE */}
          {/* ==================================================== */}
          {(activeStep === 3 || activeStep === 0) && (
            <div className="space-y-6">
              
              {/* Paperwork Automation Header Card */}
              <div className="bento-card p-6 space-y-5 border-[#00ff9d]/30 bg-gradient-to-br from-[#08090a] via-[#0d1117] to-[#08090a]">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1f2228] pb-3 gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#00ff9d] text-[#08090a] font-mono font-bold text-xs flex items-center justify-center">
                      3
                    </span>
                    <div>
                      <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Landmark className="w-4 h-4 text-[#00ff9d]" /> Step 3: Grants.gov Opportunities & Federal Paperwork Automation
                      </h3>
                      <p className="text-xs text-[#888e96] mt-0.5 font-mono">
                        Non-dilutive federal grants, SBIR/STTR packets, and SAM.gov paperwork for <strong className="text-[#00ff9d]">{selectedIndustry.name}</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setActiveStep(2)}
                      className="px-3 py-1.5 bg-[#121417] hover:bg-[#1f2228] text-slate-300 font-mono text-xs rounded-xl flex items-center gap-1 border border-[#1f2228]"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <button
                      onClick={() => setActiveStep(4)}
                      className="px-4 py-2 bg-[#00ff9d] hover:bg-[#00ff9d]/90 text-black font-mono font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                    >
                      Next: 25 Products & Services <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Grants Search & Multi-Agency Filter Controls */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-3 font-mono">
                  
                  {/* Query Input */}
                  <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 text-[#888e96] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder={`Search ${industryMatchedGrants.length} grants...`}
                      value={grantSearch}
                      onChange={(e) => setGrantSearch(e.target.value)}
                      className="w-full bg-[#08090a] border border-[#1f2228] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#00ff9d]"
                    />
                  </div>

                  {/* Multi-Agency Filter Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto shrink-0 text-xs">
                    <span className="text-[10px] text-[#888e96] flex items-center gap-1 shrink-0">
                      <Filter className="w-3 h-3" /> Agencies:
                    </span>
                    <button
                      onClick={() => toggleAgencyFilter('ALL')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        selectedAgencies.length === 0
                          ? 'bg-[#00ff9d] text-black'
                          : 'bg-[#121417] text-[#888e96] hover:text-white border border-[#1f2228]'
                      }`}
                    >
                      ALL
                    </button>
                    {['NSF', 'NIH', 'DOE', 'DoD', 'DARPA', 'USDA', 'DOT', 'DHS'].map((agency) => {
                      const isAgencySelected = selectedAgencies.includes(agency);
                      return (
                        <button
                          key={agency}
                          onClick={() => toggleAgencyFilter(agency)}
                          className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                            isAgencySelected
                              ? 'bg-cyan-400 text-black shadow'
                              : 'bg-[#121417] text-[#888e96] hover:text-white border border-[#1f2228]'
                          }`}
                        >
                          {isAgencySelected && '✓ '}
                          {agency}
                        </button>
                      );
                    })}
                  </div>

                  {/* Batch Selection Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleSelectAllMatchingGrants}
                      className="px-2.5 py-1.5 bg-[#121417] hover:bg-[#1f2228] text-slate-300 border border-[#1f2228] rounded-lg text-xs font-mono flex items-center gap-1"
                    >
                      <CheckSquare className="w-3.5 h-3.5 text-[#00ff9d]" /> Select All ({industryMatchedGrants.length})
                    </button>

                    {/* Toggle Show All vs Industry Filter */}
                    <button
                      onClick={() => setShowAllGrants(!showAllGrants)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border shrink-0 ${
                        showAllGrants
                          ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                          : 'bg-[#121417] text-[#888e96] border-[#1f2228] hover:text-white'
                      }`}
                    >
                      {showAllGrants ? 'All Federal' : 'Sector Match'}
                    </button>
                  </div>
                </div>

                {/* Sticky / Active Batch Action Bar for Selected Grants */}
                {selectedGrantIds.length > 0 && (
                  <div className="bg-[#00ff9d]/10 border border-[#00ff9d]/40 p-3 rounded-xl flex flex-wrap items-center justify-between gap-3 font-mono">
                    <div className="flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-[#00ff9d]" />
                      <span className="text-xs font-bold text-white">
                        {selectedGrantIds.length} Grant Opportunity Package{selectedGrantIds.length > 1 ? 's' : ''} Selected
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleExportGrantsManifest}
                        className="px-3 py-1 bg-[#121417] hover:bg-[#1f2228] text-cyan-300 border border-cyan-400/30 rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" /> Export Manifest (.JSON)
                      </button>
                      <button
                        onClick={handleClearGrantSelection}
                        className="px-2 py-1 text-slate-400 hover:text-rose-400 text-xs"
                      >
                        Deselect All
                      </button>
                    </div>
                  </div>
                )}

                {/* Matching Grants.gov Grid with External Links on Every Card */}
                <div className="space-y-3 font-mono">
                  <div className="flex items-center justify-between text-xs border-b border-[#1f2228] pb-2">
                    <span className="text-white font-bold flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-[#00ff9d]" /> Matched Grants.gov Funding Opportunities ({industryMatchedGrants.length})
                    </span>
                    <span className="text-[10px] text-[#888e96]">Live CFDA & Federal Solicitations</span>
                  </div>

                  {industryMatchedGrants.length === 0 ? (
                    <div className="p-8 text-center bg-[#08090a] rounded-xl border border-[#1f2228] space-y-2">
                      <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
                      <div className="text-xs font-bold text-white">No grants matched your search parameters.</div>
                      <p className="text-[11px] text-[#888e96]">Try clearing search keywords or clicking 'Showing All Federal Grants'.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {industryMatchedGrants.map((g) => {
                        const isGrantSelected = selectedGrantIds.includes(g.id);
                        return (
                          <div
                            key={g.id}
                            id={`grant-card-${g.id}`}
                            onClick={(e) => toggleGrantSelection(g.id, e)}
                            className={`bg-[#08090a] p-5 rounded-xl border transition-all space-y-3 shadow-md relative group cursor-pointer ${
                              isGrantSelected
                                ? 'border-[#00ff9d] bg-[#00ff9d]/10 ring-1 ring-[#00ff9d]'
                                : 'border-[#1f2228] hover:border-[#00ff9d]/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                                  isGrantSelected ? 'bg-[#00ff9d] text-black font-bold' : 'bg-[#121417] border border-[#1f2228]'
                                }`}>
                                  {isGrantSelected ? '✓' : ''}
                                </span>
                                <span className="text-[10px] font-bold text-[#00ff9d] bg-[#00ff9d]/10 px-2 py-0.5 rounded border border-[#00ff9d]/30">
                                  {g.id}
                                </span>
                                {g.cfdaNumber && (
                                  <span className="text-[9px] text-slate-400 bg-[#1f2228] px-1.5 py-0.5 rounded">
                                    CFDA {g.cfdaNumber}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs font-bold text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20">
                                {g.agency}
                              </span>
                            </div>

                            <div className="text-sm font-bold text-white group-hover:text-[#00ff9d] transition-colors leading-snug">
                              {g.title}
                            </div>

                            <p className="text-xs text-[#888e96] leading-relaxed line-clamp-3">
                              {g.description}
                            </p>

                            <div className="bg-[#121417] p-2.5 rounded-lg border border-[#1f2228] text-[11px] text-slate-300 space-y-1">
                              <div className="text-slate-400">Eligibility: <strong className="text-white">{g.eligibility}</strong></div>
                              {g.fundingType && (
                                <div className="text-slate-400">Funding Mechanism: <strong className="text-[#00ff9d]">{g.fundingType}</strong></div>
                              )}
                            </div>

                            <div className="flex items-center justify-between text-xs pt-2 border-t border-[#1f2228]">
                              <div>
                                <span className="text-[10px] text-[#888e96] block">Award Ceiling</span>
                                <strong className="text-[#00ff9d] font-bold text-sm">{g.amount}</strong>
                              </div>

                              <div>
                                <span className="text-[10px] text-[#888e96] block">Closing Date</span>
                                <strong className="text-amber-400 text-xs">{g.deadline}</strong>
                              </div>

                              {/* External Link directly on Grant Card */}
                              <a
                                href={g.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="px-3 py-1.5 bg-[#00ff9d]/10 hover:bg-[#00ff9d] text-[#00ff9d] hover:text-black border border-[#00ff9d]/30 font-bold text-[11px] rounded-lg flex items-center gap-1 transition-all"
                              >
                                Apply on Grants.gov <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* USA Spending Records */}
                <div className="space-y-3 font-mono pt-4 border-t border-[#1f2228]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white font-bold flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-cyan-400" /> Active USAspending Federal Prime Contracts & Awards
                    </span>
                    <a
                      href="https://www.usaspending.gov"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-[#00ff9d] hover:underline flex items-center gap-1"
                    >
                      USAspending.gov Portal <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {industryUsaSpending.map((award) => (
                      <div key={award.awardId} className="bg-[#08090a] p-3.5 rounded-xl border border-[#1f2228] text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                            {award.awardId}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-[#00ff9d] font-bold">{award.amount}</span>
                            <a
                              href="https://www.usaspending.gov/search"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-400 hover:text-white"
                              title="Search award details"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                        <div className="font-bold text-white">{award.recipientName}</div>
                        <p className="text-[11px] text-[#888e96]">{award.description}</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                          <span>Agency: {award.awardingAgency}</span>
                          <span>Awarded: {award.dateAwarded}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* SECURE PLAYWRIGHT AUTO-APPLY, CSV DOWNLOAD & POST-GRANTS.GOV LIFECYCLE ENGINE */}
              <PlaywrightGrantAutomation
                businessName={localStorage.getItem('astro_lab_fab_company_name') || 'ASTRO LAB FAB'}
                selectedGrants={industryMatchedGrants.filter(g => selectedGrantIds.includes(g.id))}
                allMatchedGrants={industryMatchedGrants}
                industryName={selectedIndustry.name}
              />

              {/* EMBEDDED COMPLETE FUNDING PAPERWORK PROCESSOR */}
              <FundingPaperworkProcessor
                industryName={selectedIndustry.name}
                industryId={selectedIndustry.id}
                grantFundingText={selectedIndustry.activeGrantFunding}
                autoApplyOnDay1={autoApplyOnDay1}
                onToggleAutoApply={setAutoApplyOnDay1}
                selectedOfferingsCount={totalActiveOfferingsCount}
                selectedOfferingNames={activeOfferingNames}
              />

            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 4: ALL 25 PRODUCTS & SERVICES (DEFAULT ON WITH TOGGLES) */}
          {/* ==================================================== */}
          {(activeStep === 4 || activeStep === 0) && (
            <div className="space-y-6 font-mono">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1f2228] pb-4 gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#00ff9d] text-[#08090a] font-bold text-xs flex items-center justify-center">
                    4
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Step 4: All 25 Products & Services for {selectedIndustry.name}
                    </h3>
                    <p className="text-xs text-[#888e96] mt-0.5">
                      10 SaaS/Hardware + 10 High-Margin Services + 5 Strategic Modules. Each card has an <strong className="text-emerald-400">[ON / OFF]</strong> toggle (default ON).
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setActiveStep(3)}
                    className="px-3 py-1.5 bg-[#121417] hover:bg-[#1f2228] text-slate-300 text-xs rounded-xl flex items-center gap-1 border border-[#1f2228]"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>

                  {/* Toggle All Button */}
                  <button
                    id="toggle-all-25-offerings-btn"
                    onClick={() => toggleAllOfferings(totalActiveOfferingsCount < 25)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
                  >
                    {totalActiveOfferingsCount === 25 ? (
                      <>Deselect All</>
                    ) : (
                      <>Select All (25/25)</>
                    )}
                  </button>

                  <button
                    id="btn-step4-automate-to-end"
                    onClick={() => setShowAutoRunner(true)}
                    className="px-3.5 py-1.5 bg-[#00ff9d] hover:bg-[#00ff9d]/90 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shrink-0 shadow-[0_0_12px_rgba(0,255,157,0.3)]"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" /> ⚡ Automate to the End
                  </button>

                  <button
                    onClick={() => setActiveSubTab('upgrades')}
                    className="px-3 py-1.5 bg-[#121417] hover:bg-[#1f2228] text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 border border-[#1f2228] transition-all shrink-0"
                  >
                    25 Executive Upgrades
                  </button>

                  <div className="relative w-full sm:w-56">
                    <Search className="w-3.5 h-3.5 text-[#888e96] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Filter offerings..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full bg-[#08090a] border border-[#1f2228] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00ff9d]"
                    />
                  </div>
                </div>
              </div>

              {/* Status Header for 25 Offerings */}
              <div className="bg-[#08090a] p-4 rounded-xl border border-[#1f2228] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-[#00ff9d] font-bold">Scope Execution Status:</span>
                  <span className="text-white">
                    <strong>{totalActiveOfferingsCount}</strong> of <strong>25</strong> Offerings Active (100% Default Enabled)
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span>Products Active: <strong className="text-white">{activeProductsCount}/10</strong></span>
                  <span>•</span>
                  <span>Services Active: <strong className="text-white">{activeServicesCount}/10</strong></span>
                  <span>•</span>
                  <span>Core Modules: <strong className="text-white">{activeCoreCount}/5</strong></span>
                </div>
              </div>

              {/* 3-Column Catalog for All 25 Offerings */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* COLUMN 1: 10 PRODUCTS */}
                <div className="bento-card p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
                    <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#00ff9d]" /> 1. Products Catalog (10)
                    </h4>
                    <span className="text-[10px] text-[#00ff9d] font-bold">{activeProductsCount}/10 Active</span>
                  </div>

                  <div className="space-y-3 max-h-[680px] overflow-y-auto pr-1">
                    {filteredProducts.map((p) => {
                      const isActive = activeOfferings[p.id] !== false;
                      const productExtUrl = p.externalUrl || `https://github.com/topics/${p.type.toLowerCase().replace(' ', '-')}`;
                      return (
                        <div
                          key={p.id}
                          id={`product-card-${p.id}`}
                          className={`p-4 rounded-xl border transition-all space-y-2.5 ${
                            isActive
                              ? 'bg-[#08090a] border-[#1f2228] hover:border-[#00ff9d]/50 text-slate-200'
                              : 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-white">{p.name}</span>
                            
                            {/* Card ON/OFF Toggle */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleOffering(p.id)}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold transition flex items-center gap-1 ${
                                  isActive
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                                }`}
                                title="Toggle item on/off"
                              >
                                {isActive ? 'USE [ON]' : 'SKIP [OFF]'}
                              </button>

                              {/* External Reference Link */}
                              <a
                                href={productExtUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 bg-[#121417] hover:bg-[#00ff9d] text-slate-400 hover:text-black rounded border border-[#1f2228] transition"
                                title="View product architecture spec"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-[10px]">
                            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 font-bold">
                              {p.type}
                            </span>
                            <span className="text-[#00ff9d] font-bold">{p.pricingModel}</span>
                          </div>

                          <p className="text-xs text-[#888e96] leading-relaxed">{p.valueProp}</p>

                          <div className="bg-[#121417] p-2 rounded-lg border border-[#1f2228] text-[10px] text-slate-300 space-y-1">
                            <div>Solves Need: <strong className="text-amber-400">{p.solvesNeed}</strong></div>
                            <div>Target Buyer: <strong className="text-cyan-400">{p.targetBuyer}</strong></div>
                            {p.aiEnhancement && (
                              <div className="text-[#00ff9d]">AI Advantage: <strong>{p.aiEnhancement}</strong></div>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-[10px] pt-1 border-t border-[#1f2228]">
                            <span className="text-[#888e96]">Launch Cost: <strong className="text-white">{p.launchCostEst}</strong></span>
                            <span className="text-[#00ff9d] font-bold">Margin: {p.marginPct}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* COLUMN 2: 10 HIGH-MARGIN SERVICES */}
                <div className="bento-card p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
                    <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                      <Workflow className="w-4 h-4 text-[#00ff9d]" /> 2. Services Catalog (10)
                    </h4>
                    <span className="text-[10px] text-cyan-400 font-bold">{activeServicesCount}/10 Active</span>
                  </div>

                  <div className="space-y-3 max-h-[680px] overflow-y-auto pr-1">
                    {filteredServices.map((s) => {
                      const isActive = activeOfferings[s.id] !== false;
                      const serviceExtUrl = s.externalUrl || `https://www.sba.gov/business-guide/manage-your-business`;
                      return (
                        <div
                          key={s.id}
                          id={`service-card-${s.id}`}
                          className={`p-4 rounded-xl border transition-all space-y-2.5 ${
                            isActive
                              ? 'bg-[#08090a] border-[#1f2228] hover:border-cyan-400/50 text-slate-200'
                              : 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-white">{s.name}</span>
                            
                            {/* Card ON/OFF Toggle */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleOffering(s.id)}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold transition flex items-center gap-1 ${
                                  isActive
                                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                                }`}
                                title="Toggle item on/off"
                              >
                                {isActive ? 'USE [ON]' : 'SKIP [OFF]'}
                              </button>

                              {/* External Reference Link */}
                              <a
                                href={serviceExtUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 bg-[#121417] hover:bg-cyan-400 text-slate-400 hover:text-black rounded border border-[#1f2228] transition"
                                title="View advisory service SLA"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-[10px]">
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold">
                              {s.type}
                            </span>
                            <span className="text-amber-300 font-bold">{s.billingRate}</span>
                          </div>

                          <p className="text-xs text-[#888e96] leading-relaxed">{s.valueProp}</p>

                          <div className="bg-[#121417] p-2 rounded-lg border border-[#1f2228] text-[10px] text-slate-300 space-y-1">
                            <div>Solves Need: <strong className="text-amber-400">{s.solvesNeed}</strong></div>
                            <div>Target Buyer: <strong className="text-cyan-400">{s.targetBuyer}</strong></div>
                            {s.aiEnhancement && (
                              <div className="text-cyan-400">AI Advantage: <strong>{s.aiEnhancement}</strong></div>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-[10px] pt-1 border-t border-[#1f2228]">
                            <span className="text-[#888e96]">Setup Time: <strong className="text-white">{s.setupTime}</strong></span>
                            <span className="text-cyan-400 font-bold">Margin: {s.marginPct}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* COLUMN 3: 5 STRATEGIC CORE MODULES (COMPLETING 25 SCOPE) */}
                <div className="bento-card p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
                    <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" /> 3. Core Modules (5)
                    </h4>
                    <span className="text-[10px] text-amber-400 font-bold">{activeCoreCount}/5 Active</span>
                  </div>

                  <div className="space-y-3 max-h-[680px] overflow-y-auto pr-1">
                    {coreStrategicUpgrades.map((c) => {
                      const isActive = activeOfferings[c.id] !== false;
                      return (
                        <div
                          key={c.id}
                          id={`core-module-card-${c.id}`}
                          className={`p-4 rounded-xl border transition-all space-y-2.5 ${
                            isActive
                              ? 'bg-[#08090a] border-[#1f2228] hover:border-amber-400/50 text-slate-200'
                              : 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-white">{c.name}</span>
                            
                            {/* Card ON/OFF Toggle */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleOffering(c.id)}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold transition flex items-center gap-1 ${
                                  isActive
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                                }`}
                                title="Toggle item on/off"
                              >
                                {isActive ? 'USE [ON]' : 'SKIP [OFF]'}
                              </button>

                              {/* External Reference Link */}
                              <a
                                href={c.externalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 bg-[#121417] hover:bg-amber-400 text-slate-400 hover:text-black rounded border border-[#1f2228] transition"
                                title="View official portal documentation"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-[10px]">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                              {c.type}
                            </span>
                            <span className="text-amber-300 font-bold">{c.billingRate}</span>
                          </div>

                          <p className="text-xs text-[#888e96] leading-relaxed">{c.valueProp}</p>

                          <div className="bg-[#121417] p-2 rounded-lg border border-[#1f2228] text-[10px] text-slate-300">
                            <div className="text-emerald-400">AI Advantage: <strong>{c.aiEnhancement}</strong></div>
                          </div>

                          <div className="flex items-center justify-between text-[10px] pt-1 border-t border-[#1f2228]">
                            <span className="text-[#888e96]">Portal Target: <strong className="text-white">{c.externalUrl.replace('https://', '').split('/')[0]}</strong></span>
                            <span className="text-amber-400 font-bold">Margin: {c.marginPct}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

      {/* ==================================================== */}
      {/* MODE 2: FUNDING PAPERWORK SUITE STANDALONE VIEW */}
      {/* ==================================================== */}
      {activeSubTab === 'paperwork' && (
        <FundingPaperworkProcessor
          industryName={selectedIndustry.name}
          industryId={selectedIndustry.id}
          grantFundingText={selectedIndustry.activeGrantFunding}
          autoApplyOnDay1={autoApplyOnDay1}
          onToggleAutoApply={setAutoApplyOnDay1}
          selectedOfferingsCount={totalActiveOfferingsCount}
          selectedOfferingNames={activeOfferingNames}
        />
      )}

      {/* ==================================================== */}
      {/* MODE 3: 25 STARTUP ENGINE UPGRADES & EXECUTIVE SUITE */}
      {/* ==================================================== */}
      {activeSubTab === 'upgrades' && (
        <StartupUpgradesSuite
          selectedIndustry={selectedIndustry}
          selectedNeed={selectedNeed}
          selectedProduct={selectedIndustry.products[0]}
          grantOpportunities={GRANT_OPPORTUNITIES}
        />
      )}

      {/* ==================================================== */}
      {/* MODE 4: 19-STAGE AUTO BUSINESS INTELLIGENCE PIPELINE */}
      {/* ==================================================== */}
      {activeSubTab === 'pipeline' && (
        <div className="space-y-6 font-mono">
          
          {/* Pipeline Header */}
          <div className="bento-card p-6 space-y-4 border-[#00ff9d]/30 bg-gradient-to-r from-[#08090a] via-[#0d1117] to-[#08090a]">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30 px-2 py-0.5 rounded">
                  v{AUTO_BUSINESS_INTELLIGENCE_WORKFLOW.version} • 19 Execution Stages
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {AUTO_BUSINESS_INTELLIGENCE_WORKFLOW.name}
                </h3>
                <p className="text-xs text-[#888e96] max-w-3xl mt-0.5 leading-relaxed">
                  {AUTO_BUSINESS_INTELLIGENCE_WORKFLOW.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyWorkflowJSON}
                  className="px-3 py-2 bg-[#121417] hover:bg-[#1f2228] border border-[#1f2228] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
                >
                  {copiedJSON ? <Check className="w-3.5 h-3.5 text-[#00ff9d]" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedJSON ? 'JSON Copied' : 'Copy Workflow JSON'}
                </button>

                <button
                  onClick={handleRunPipeline}
                  disabled={isRunningPipeline}
                  className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow ${
                    isRunningPipeline
                      ? 'bg-amber-400 text-black cursor-not-allowed animate-pulse'
                      : 'bg-[#00ff9d] hover:bg-[#00ff9d]/90 text-[#08090a]'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current" />
                  {isRunningPipeline ? `Executing Stage ${currentStageIndex + 1}/19...` : 'Run 19-Stage Pipeline'}
                </button>
              </div>
            </div>

            {/* Inputs & Outputs Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2 border-t border-[#1f2228]">
              <div>
                <span className="text-[#00ff9d] font-bold block">Primary Input Sources:</span>
                <span className="text-[#888e96]">
                  {AUTO_BUSINESS_INTELLIGENCE_WORKFLOW.primary_inputs.join(' • ')}
                </span>
              </div>
              <div>
                <span className="text-cyan-400 font-bold block">Primary Generated Outputs:</span>
                <span className="text-[#888e96]">
                  {AUTO_BUSINESS_INTELLIGENCE_WORKFLOW.primary_outputs.join(' • ')}
                </span>
              </div>
            </div>
          </div>

          {/* Terminal Console Log Output */}
          <div className="bento-card p-4 space-y-2 bg-[#050607]">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-2 text-xs">
              <span className="text-[#00ff9d] font-bold flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#00ff9d]" /> Pipeline Bash Execution Log Console
              </span>
              <span className="text-[10px] text-[#888e96]">
                {pipelineLogs.length} Log Messages Generated
              </span>
            </div>

            <div className="bg-[#08090a] p-3 rounded-xl border border-[#1f2228] text-xs text-[#00ff9d] max-h-[220px] overflow-y-auto space-y-1">
              {pipelineLogs.length === 0 ? (
                <div className="text-[#888e96] italic">
                  Click 'Run 19-Stage Pipeline' to simulate the complete execution sequence and view real-time logs.
                </div>
              ) : (
                pipelineLogs.map((log, idx) => (
                  <div key={idx} className="leading-tight">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 19 Stages Visual Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#00ff9d]" /> Complete 19-Stage Execution Topology
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {AUTO_BUSINESS_INTELLIGENCE_WORKFLOW.execution_order.map((stage, idx) => {
                const isCompleted = completedStages.includes(stage.stage);
                const isCurrent = currentStageIndex === idx;
                const isDisabled = stage.status === 'Disabled';

                return (
                  <div
                    key={stage.stage}
                    className={`p-4 rounded-xl border transition-all space-y-2.5 ${
                      isCurrent
                        ? 'bg-[#00ff9d]/15 border-[#00ff9d] text-white shadow-[0_0_15px_rgba(0,255,157,0.3)] animate-pulse'
                        : isCompleted
                        ? 'bg-[#08090a] border-[#00ff9d]/50 text-white'
                        : isDisabled
                        ? 'bg-[#08090a]/50 border-rose-500/30 text-rose-400 opacity-70'
                        : 'bg-[#08090a] border-[#1f2228] text-[#888e96]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#00ff9d] bg-[#00ff9d]/10 px-2 py-0.5 rounded border border-[#00ff9d]/30">
                        STAGE {stage.stage} OF 19
                      </span>

                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                          isDisabled
                            ? 'bg-rose-500/20 text-rose-400'
                            : isCompleted
                            ? 'bg-[#00ff9d]/20 text-[#00ff9d]'
                            : 'bg-[#1f2228] text-slate-400'
                        }`}
                      >
                        {isDisabled ? 'Disabled (Recon)' : isCompleted ? 'Completed' : 'Pending'}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-white">{stage.name}</div>
                    <p className="text-[10px] text-[#888e96]">{stage.purpose}</p>

                    <div className="space-y-1 pt-1 border-t border-[#1f2228] text-[10px]">
                      <span className="text-slate-300 font-bold block">Steps ({stage.steps.length}):</span>
                      {stage.steps.map((st) => (
                        <div key={st.step} className="text-[#888e96] flex items-center justify-between">
                          <span>{st.step}. {st.name}</span>
                          {st.command && <code className="text-[#00ff9d] text-[9px]">{st.command.slice(0, 20)}...</code>}
                        </div>
                      ))}
                    </div>

                    <div className="text-[10px] text-cyan-400 pt-1 border-t border-[#1f2228]">
                      Outputs: {stage.outputs.join(', ')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ==================================================== */}
      {/* MODE 5: NASDAQ STOCKS & MARKET DATA (MULTI-STOCK SELECTION) */}
      {/* ==================================================== */}
      {activeSubTab === 'stocks' && (
        <div className="space-y-6 font-mono">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 text-[#888e96] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search symbol, company name, or sector..."
                value={stockSearch}
                onChange={(e) => setStockSearch(e.target.value)}
                className="w-full bg-[#08090a] border border-[#1f2228] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#00ff9d]"
              />
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-[#00ff9d] font-bold">
                {selectedStockSymbols.length} Tickers Selected
              </span>
              <span className="text-[#888e96]">
                Showing {filteredStock.length} NASDAQ Tickers
              </span>
            </div>
          </div>

          {/* Multi-Stock Comparison Matrix */}
          {selectedStockSymbols.length > 0 && (
            <div className="bento-card p-4 space-y-3 bg-[#08090a] border-[#00ff9d]/30">
              <div className="flex items-center justify-between border-b border-[#1f2228] pb-2 text-xs">
                <span className="text-white font-bold flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-[#00ff9d]" /> Multi-Stock Comparison Portfolio ({selectedStockSymbols.length})
                </span>
                <span className="text-[10px] text-cyan-400">Live NASDAQ Feed</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {NASDAQ_MARKET_DATA.filter(st => selectedStockSymbols.includes(st.symbol)).map((st) => (
                  <div key={st.symbol} className="bg-[#121417] p-3 rounded-xl border border-[#00ff9d]/40 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white flex items-center gap-1">
                        {st.symbol}
                        <a
                          href={`https://www.nasdaq.com/market-activity/stocks/${st.symbol.toLowerCase()}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-[#00ff9d]"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </span>
                      <button
                        onClick={() => toggleStockSelection(st.symbol)}
                        className="text-[10px] text-slate-400 hover:text-rose-400"
                        title="Remove from comparison"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="text-[10px] text-[#888e96] truncate">{st.companyName}</div>
                    <div className="flex items-center justify-between pt-1 border-t border-[#1f2228]">
                      <span className="font-bold text-white">${st.lastSale}</span>
                      <span className={`font-bold text-[11px] ${st.pctChange.startsWith('+') ? 'text-[#00ff9d]' : 'text-rose-400'}`}>
                        {st.pctChange}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Top Gainers */}
            <div className="bento-card p-5 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2 border-b border-[#1f2228] pb-3">
                <TrendingUp className="w-4 h-4 text-[#00ff9d]" /> Top Stock Gainers (Click to Multi-Select)
              </h3>

              <div className="space-y-2">
                {topGainers.map((st) => {
                  const isStockSelected = selectedStockSymbols.includes(st.symbol);
                  return (
                    <div
                      key={st.symbol}
                      onClick={() => toggleStockSelection(st.symbol)}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition ${
                        isStockSelected
                          ? 'bg-[#00ff9d]/10 border-[#00ff9d]'
                          : 'bg-[#08090a] border-[#1f2228] hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                          isStockSelected ? 'bg-[#00ff9d] text-black font-bold' : 'bg-[#121417] border border-[#1f2228]'
                        }`}>
                          {isStockSelected ? '✓' : ''}
                        </span>
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            {st.symbol} - {st.companyName}
                            <a
                              href={`https://www.nasdaq.com/market-activity/stocks/${st.symbol.toLowerCase()}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-slate-400 hover:text-[#00ff9d]"
                              title="Open NASDAQ stock quote"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          <div className="text-[10px] text-[#888e96]">{st.sector}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-white">${st.lastSale}</div>
                        <div className="text-[#00ff9d] font-bold text-[11px]">{st.pctChange}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Decliners */}
            <div className="bento-card p-5 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2 border-b border-[#1f2228] pb-3">
                <TrendingDown className="w-4 h-4 text-rose-400" /> Bottom Stock Decliners (Click to Multi-Select)
              </h3>

              <div className="space-y-2">
                {bottomDecliners.map((st) => {
                  const isStockSelected = selectedStockSymbols.includes(st.symbol);
                  return (
                    <div
                      key={st.symbol}
                      onClick={() => toggleStockSelection(st.symbol)}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition ${
                        isStockSelected
                          ? 'bg-rose-500/10 border-rose-500/50'
                          : 'bg-[#08090a] border-[#1f2228] hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                          isStockSelected ? 'bg-rose-500 text-white font-bold' : 'bg-[#121417] border border-[#1f2228]'
                        }`}>
                          {isStockSelected ? '✓' : ''}
                        </span>
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            {st.symbol} - {st.companyName}
                            <a
                              href={`https://www.nasdaq.com/market-activity/stocks/${st.symbol.toLowerCase()}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-slate-400 hover:text-rose-400"
                              title="Open NASDAQ stock quote"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          <div className="text-[10px] text-[#888e96]">{st.sector}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-white">${st.lastSale}</div>
                        <div className="text-rose-400 font-bold text-[11px]">{st.pctChange}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODE 6: GRANTS.GOV MASTER DATABASE & IRS BMF */}
      {/* ==================================================== */}
      {activeSubTab === 'grants' && (
        <div className="space-y-6 font-mono">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 text-[#888e96] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search federal grants by agency, title, or category..."
                value={grantSearch}
                onChange={(e) => setGrantSearch(e.target.value)}
                className="w-full bg-[#08090a] border border-[#1f2228] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#00ff9d]"
              />
            </div>

            <span className="text-xs text-[#888e96]">
              Showing {masterFilteredGrants.length} Master Grant Opportunities
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {masterFilteredGrants.map((g) => (
              <div key={g.id} className="bento-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#00ff9d] bg-[#00ff9d]/10 px-2 py-0.5 rounded border border-[#00ff9d]/30">
                    {g.id}
                  </span>
                  <span className="text-xs text-[#888e96] font-bold">{g.agency}</span>
                </div>

                <div className="text-sm font-bold text-white">{g.title}</div>
                <p className="text-xs text-[#888e96] leading-relaxed line-clamp-2">{g.description}</p>
                <div className="text-xs text-[#888e96]">Category: <strong className="text-slate-300">{g.category}</strong></div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#1f2228]">
                  <span>Total Funding: <strong className="text-[#00ff9d]">{g.amount}</strong></span>
                  <span>Close Date: <strong className="text-amber-400">{g.deadline}</strong></span>
                  <a
                    href={g.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#00ff9d] underline flex items-center gap-1 font-bold"
                  >
                    View on Grants.gov <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
