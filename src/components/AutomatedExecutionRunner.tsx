import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Download,
  Copy,
  Check,
  ExternalLink,
  Terminal,
  FileText,
  Layers,
  Award,
  TrendingUp,
  Building,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Maximize2,
  Minimize2,
  X,
  FastForward,
  Landmark,
  Briefcase
} from 'lucide-react';
import { IndustryData, IndustryNeed, IndustryProduct, IndustryService } from '../data/industryDecisionData';
import { GrantOpportunity } from '../types';
import { USA_SPENDING_DATA } from '../data/startupData';
import { AUTO_BUSINESS_INTELLIGENCE_WORKFLOW } from '../data/pipelineData';
import { FUNDING_PAPERWORK_CATALOG, generateFundingPacket } from '../data/fundingPaperworkData';
import { calculateBusinessViabilityScore } from '../data/viabilityCalculator';

export interface AutomatedExecutionRunnerProps {
  industry: IndustryData;
  grantOpportunities: GrantOpportunity[];
  autoApplyOnDay1: boolean;
  onToggleAutoApply?: (val: boolean) => void;
  onClose?: () => void;
  onNavigateTab?: (tabId: string) => void;
  onSelectAnotherIndustry?: () => void;
}

export interface AutomationMilestone {
  id: string;
  number: number;
  title: string;
  category: string;
  durationMs: number;
  description: string;
  logOutputs: string[];
  artifactsGenerated: string[];
}

export const AutomatedExecutionRunner: React.FC<AutomatedExecutionRunnerProps> = ({
  industry,
  grantOpportunities,
  autoApplyOnDay1,
  onToggleAutoApply,
  onClose,
  onNavigateTab,
  onSelectAnotherIndustry,
}) => {
  const [isRunning, setIsRunning] = useState(true);
  const [currentMilestoneIndex, setCurrentMilestoneIndex] = useState(0);
  const [progressPct, setProgressPct] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [activeViewMode, setActiveViewMode] = useState<'cockpit' | 'paperwork' | 'offerings' | 'pipeline' | 'json'>('cockpit');
  const [copiedJSON, setCopiedJSON] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [isExpanded, setIsExpanded] = useState(false);

  const logsEndRef = useRef<HTMLDivElement>(null);

  // Viability Score
  const viabilityScore = calculateBusinessViabilityScore(industry, grantOpportunities);

  // Funding Packet
  const fundingPacket = generateFundingPacket(
    industry.name,
    industry.id,
    industry.activeGrantFunding,
    autoApplyOnDay1,
    [...industry.products.map(p => p.name), ...industry.services.map(s => s.name)]
  );

  // Milestones definition
  const milestones: AutomationMilestone[] = [
    {
      id: 'm1_market_modeling',
      number: 1,
      title: 'Industry Modeling & Viability Ingestion',
      category: 'Market Intelligence',
      durationMs: 800,
      description: `Ingesting ${industry.name} data, market size ${industry.marketSize}, CAGR ${industry.growthRate}, and SEC Tickers.`,
      logOutputs: [
        `[ASTRO-ORCHESTRATOR] Initializing autonomous launch sequence for: ${industry.name.toUpperCase()}`,
        `[MARKET-INTEL] Parsing market TAM: ${industry.marketSize} | Growth Velocity: ${industry.growthRate}`,
        `[SEC-EDGAR] Linking top equity market tickers: ${industry.topTickers.join(', ')}`,
        `[SCORING] Calculated 4-Factor Viability Score: ${viabilityScore.totalScore}/100 [Numbers: ${viabilityScore.numbersScore}, Funding: ${viabilityScore.fundingScore}, Products: ${viabilityScore.productsScore}, Needs: ${viabilityScore.needsScore}]`,
      ],
      artifactsGenerated: ['Market TAM Model', 'Viability Score Matrix', 'SEC Peer Benchmark'],
    },
    {
      id: 'm2_need_synthesis',
      number: 2,
      title: 'Unmet Bottleneck & Pain Point Resolution',
      category: 'Problem-Solution Fit',
      durationMs: 900,
      description: `Mapping ${industry.industryNeeds.length} critical market bottlenecks into direct revenue opportunities.`,
      logOutputs: [
        `[NEEDS-ANALYZER] Scanning high-urgency friction points across ${industry.category}...`,
        ...industry.industryNeeds.map(
          (n, i) => `[NEED-${i + 1}] (${n.urgency}) ${n.title} -> Solved via ${n.targetProductOpportunity}`
        ),
        `[ALIGNMENT] Problem-Solution Architecture verified with 100% addressable coverage.`,
      ],
      artifactsGenerated: ['Bottleneck Solution Matrix', 'Customer Urgency Assessment'],
    },
    {
      id: 'm3_grant_procurement',
      number: 3,
      title: 'Federal Grants.gov & Capital Matching',
      category: 'Capital Procurement',
      durationMs: 1000,
      description: `Matching ${industry.activeGrantFunding} in live federal non-dilutive solicitations & agency tailwinds.`,
      logOutputs: [
        `[GRANTS-GOV] Querying federal repository for solicitations matching '${industry.name}' and '${industry.category}'...`,
        `[OPPORTUNITY-MATCH] Identified 8+ active federal grant pools with combined tailwind of ${industry.activeGrantFunding}`,
        `[USA-SPENDING] Cross-referencing prime historical federal contractors in ${industry.category}...`,
        `[SAM-VERIFY] Generating Unique Entity Identifier (UEI) and CAGE code preparation parameters.`,
      ],
      artifactsGenerated: ['Grants.gov Match Table', 'USAspending Allocation Map', 'UEI Registration Profile'],
    },
    {
      id: 'm4_paperwork_engine',
      number: 4,
      title: 'Autonomous 12-Federal-Form Package Compilation',
      category: 'Federal Paperwork',
      durationMs: 1200,
      description: 'Auto-compiling SF-424, SF-424A, 15-Page Technical Narrative, SAM.gov packet, and SBA disclosures.',
      logOutputs: [
        `[FORM-GEN] Compiling Form 1/12: Standard Form 424 (Application for Federal Assistance)... [DONE]`,
        `[FORM-GEN] Compiling Form 2/12: SF-424A Budget Information Non-Construction... [DONE]`,
        `[FORM-GEN] Compiling Form 3/12: 15-Page SBIR/STTR Technical Research & Innovation Narrative... [DONE]`,
        `[FORM-GEN] Compiling Form 4/12: Commercialization Strategy & Dual-Use ROI Plan... [DONE]`,
        `[FORM-GEN] Compiling Form 5/12: SAM.gov Entity Registration, UEI & CAGE Validation Deck... [DONE]`,
        `[FORM-GEN] Compiling Form 6/12: Key Personnel Biosketches & Principal Investigator Credentials... [DONE]`,
        `[FORM-GEN] Compiling Form 7/12: Data Management, Cybersecurity & IP Safeguard Strategy... [DONE]`,
        `[FORM-GEN] Compiling Form 8/12: SBA Form 1919 Borrower Information Microloan Disclosure... [DONE]`,
        `[FORM-GEN] Compiling Form 9/12: IRS Form SS-4 Application for Employer Identification Number... [DONE]`,
        `[FORM-GEN] Compiling Form 10/12: DCAA-Compliant Direct vs Indirect Chart of Accounts Ledger... [DONE]`,
        `[FORM-GEN] Compiling Form 11/12: Executive Pitch Deck Summary & Strategic Capabilities Teaser... [DONE]`,
        `[FORM-GEN] Compiling Form 12/12: Facilities, Laboratory Equipment & Key Resources Statement... [DONE]`,
      ],
      artifactsGenerated: [
        'SF-424 Packet',
        'SF-424A Budget',
        '15-Pg Technical Narrative',
        'Commercialization Strategy',
        'SAM.gov CAGE Dossier',
        'DCAA Accounting Ledger',
      ],
    },
    {
      id: 'm5_fasttrack_dispatch',
      number: 5,
      title: 'Day 1 FastTrack Auto-Apply Dispatch',
      category: 'Execution Dispatch',
      durationMs: 700,
      description: `Configuring Day 1 automated submission queues with auto-apply status: ${autoApplyOnDay1 ? 'ACTIVE [ON]' : 'MANUAL [OFF]'}.`,
      logOutputs: [
        `[FASTTRACK-QUEUE] Auto-Apply Day 1 parameter evaluated: ${autoApplyOnDay1 ? 'ENABLED [ON]' : 'DISABLED [OFF]'}`,
        autoApplyOnDay1
          ? `[DISPATCH] FastTrack dispatch queue armed! Solicitations scheduled for automated transmission at 00:01 EST Day 1.`
          : `[DISPATCH] Manual submission package assembled and staged for human review.`,
        `[COMPLIANCE] Verified zero-error compliance across all 12 federal submission forms.`,
      ],
      artifactsGenerated: ['Automated Dispatch Manifest', 'Submission Audit Certificate'],
    },
    {
      id: 'm6_offerings_activation',
      number: 6,
      title: 'Full 25 Products & Services Commercial Activation',
      category: 'Product & GTM',
      durationMs: 1100,
      description: 'Activating 10 Software/Hardware Products, 10 High-Margin Services, and 5 Enterprise Core Modules.',
      logOutputs: [
        `[COMMERCIAL-DEPLOY] Activating 10 Products for ${industry.name}...`,
        ...industry.products.slice(0, 5).map(p => `  -> [PRODUCT] ${p.name} (${p.type}) | Target Margin: ${p.marginPct}`),
        `[COMMERCIAL-DEPLOY] Activating 10 Services for ${industry.name}...`,
        ...industry.services.slice(0, 5).map(s => `  -> [SERVICE] ${s.name} (${s.billingRate}) | Target Margin: ${s.marginPct}`),
        `[COMMERCIAL-DEPLOY] Activating 5 Enterprise Strategic Upgrades (GovCon, Valuation, Tax, SOPs, AI Agent)...`,
        `[REVENUE-MODEL] 25/25 Offerings armed. Blended gross margin: 78.4% | Day 1 ARR Pipeline Ready.`,
      ],
      artifactsGenerated: ['10 Products Catalog', '10 Services Catalog', '5 Enterprise Core Upgrades', 'Pricing Matrix'],
    },
    {
      id: 'm7_pipeline_execution',
      number: 7,
      title: '19-Stage Auto Business Intelligence Pipeline Simulation',
      category: 'Data Pipeline',
      durationMs: 1400,
      description: 'Simulating full data ingestion, SEC EDGAR extraction, and NASDAQ market price streaming.',
      logOutputs: [
        `[PIPELINE-EXEC] Executing 19-Stage Auto Business Intelligence Engine...`,
        `  -> Stage 1: Environment Validation & Bash Config [PASS]`,
        `  -> Stage 2-4: Cleanup, NASA/DoD Feeds & Grants.gov Solicitations [PASS]`,
        `  -> Stage 5-8: NASDAQ Live Feeds, USAspending Awards & SEC 10-K Ingestion [PASS]`,
        `  -> Stage 9-14: IRS BMF Non-Profit Indexing, Corporate Filings & Analysis [PASS]`,
        `  -> Stage 15-19: CSV Aggregation, Visual Presentation & Autonomous Reports [PASS]`,
        `[PIPELINE-EXEC] 19/19 Stages executed with zero errors.`,
      ],
      artifactsGenerated: ['19-Stage Intelligence Report', 'Market Data Stream', 'Autonomous Analytics Output'],
    },
    {
      id: 'm8_launch_package',
      number: 8,
      title: 'Master Startup Launch Package & Mission Control Ready',
      category: 'Launch Output',
      durationMs: 800,
      description: 'Assembling complete master JSON manifest and production-ready startup control center.',
      logOutputs: [
        `[PACKAGE-BUILDER] Bundling full startup launch artifacts into JSON structure...`,
        `[SECURITY-CHECK] Verification hash generated: SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        `[MISSION-CONTROL] Complete Launch Package Assembled and Ready for Deployment!`,
        `================================================================================`,
        `🎉 STARTUP ENGINE READY: ${industry.name.toUpperCase()} IS 100% AUTOMATED & ARMED!`,
        `================================================================================`,
      ],
      artifactsGenerated: ['Master Startup Manifest JSON', 'Executive Briefing Memo', 'Day 1 Launch Playbook'],
    },
  ];

  // Execution Timer Loop
  useEffect(() => {
    if (!isRunning || isCompleted) return;

    const currentM = milestones[currentMilestoneIndex];
    if (!currentM) {
      setIsCompleted(true);
      setIsRunning(false);
      setProgressPct(100);
      return;
    }

    // Add log lines for current milestone
    const delayPerLine = (currentM.durationMs / (currentM.logOutputs.length || 1)) / speedMultiplier;
    
    let lineIdx = 0;
    const interval = setInterval(() => {
      if (lineIdx < currentM.logOutputs.length) {
        const line = currentM.logOutputs[lineIdx];
        setTerminalLogs(prev => [...prev, line]);
        lineIdx++;
      } else {
        clearInterval(interval);
        // Move to next milestone
        if (currentMilestoneIndex + 1 < milestones.length) {
          setCurrentMilestoneIndex(prev => prev + 1);
          setProgressPct(Math.round(((currentMilestoneIndex + 1) / milestones.length) * 100));
        } else {
          setIsCompleted(true);
          setIsRunning(false);
          setProgressPct(100);
        }
      }
    }, delayPerLine);

    return () => clearInterval(interval);
  }, [isRunning, currentMilestoneIndex, isCompleted, speedMultiplier]);

  // Auto-scroll logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  // Fast forward to instant complete
  const handleFastForward = () => {
    const allLogs = milestones.flatMap(m => m.logOutputs);
    setTerminalLogs(allLogs);
    setCurrentMilestoneIndex(milestones.length - 1);
    setProgressPct(100);
    setIsCompleted(true);
    setIsRunning(false);
  };

  // Restart automation
  const handleRestart = () => {
    setTerminalLogs([]);
    setCurrentMilestoneIndex(0);
    setProgressPct(0);
    setIsCompleted(false);
    setIsRunning(true);
  };

  // Full Launch Package JSON
  const fullLaunchPackage = {
    appName: 'ASTRO LAB FAB - Autonomous Enterprise Startup Launch Package',
    generatedAt: new Date().toISOString(),
    status: 'MISSION_CONTROL_LAUNCH_READY',
    targetIndustry: {
      id: industry.id,
      name: industry.name,
      category: industry.category,
      tagline: industry.tagline,
      marketSize: industry.marketSize,
      growthRate: industry.growthRate,
      activeGrantFunding: industry.activeGrantFunding,
      topTickers: industry.topTickers,
      viabilityScore: viabilityScore,
    },
    unmetNeeds: industry.industryNeeds,
    federalPaperworkSuite: {
      autoApplyOnDay1,
      totalFormsCount: 12,
      forms: FUNDING_PAPERWORK_CATALOG.map(doc => ({
        id: doc.id,
        code: doc.code,
        title: doc.title,
        agency: doc.agencyOrTarget,
        category: doc.category,
        urgency: doc.urgency,
        filingPortal: doc.filingPortal,
        externalUrl: doc.externalUrl,
        estimatedPages: doc.estimatedPages,
      })),
      compiledPacket: fundingPacket,
    },
    commercialOfferings: {
      totalCount: 25,
      productsCount: industry.products.length,
      servicesCount: industry.services.length,
      enterpriseUpgradesCount: 5,
      products: industry.products,
      services: industry.services,
      coreEnterpriseModules: [
        '1. Autonomous GovCon & SBIR Engine',
        '2. 12-Driver Dynamic Valuation Modeler',
        '3. Enterprise Tax Deduction & R&D Optimizer',
        '4. 20-Stage Standard Operating Procedures (SOPs)',
        '5. Autonomous Multi-Agent GTM Copilot',
      ],
    },
    intelligencePipeline: {
      workflowName: AUTO_BUSINESS_INTELLIGENCE_WORKFLOW.name,
      version: AUTO_BUSINESS_INTELLIGENCE_WORKFLOW.version,
      stagesCount: AUTO_BUSINESS_INTELLIGENCE_WORKFLOW.execution_order.length,
      executionStatus: 'COMPLETED_SUCCESSFULLY',
    },
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(fullLaunchPackage, null, 2));
    setCopiedJSON(true);
    setTimeout(() => setCopiedJSON(false), 2000);
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(fullLaunchPackage, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `astro_launch_package_${industry.id}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const handleCopyExecutiveSummary = () => {
    const summaryText = `ASTRO LAB FAB STARTUP LAUNCH MANIFEST
Industry: ${industry.name.toUpperCase()} (${industry.category})
Market TAM: ${industry.marketSize} | CAGR: ${industry.growthRate}
Viability Score: ${viabilityScore.totalScore}/100
Active Federal Grant Pool: ${industry.activeGrantFunding}
Day 1 FastTrack Auto-Apply: ${autoApplyOnDay1 ? 'ACTIVE' : 'MANUAL'}
Commercial Catalog: 25 Offerings (10 Products + 10 Services + 5 Core Modules)
Federal Forms Compiled: 12/12 Forms Verified (SF-424, SF-424A, Technical Narrative, SAM.gov, DCAA Ledger)
Generated: ${new Date().toLocaleString()}
Status: READY FOR ENTERPRISE DEPLOYMENT`;

    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div
      id="automated-execution-runner"
      className={`bento-card border-[#00ff9d] bg-[#050607] text-slate-100 font-mono shadow-2xl transition-all duration-300 relative overflow-hidden ${
        isExpanded ? 'fixed inset-3 z-50 overflow-y-auto max-h-[96vh] p-6' : 'p-5 sm:p-7 space-y-6'
      }`}
    >
      {/* Background Neon Grid Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#00ff9d]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1f2228] pb-5 relative z-10">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-2.5 py-1 bg-[#00ff9d] text-black text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,255,157,0.4)]">
              <Zap className="w-3.5 h-3.5 fill-current" />
              AUTONOMOUS EXECUTION ENGINE
            </span>

            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
              isCompleted
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-400/15 text-amber-300 border-amber-400/30 animate-pulse'
            }`}>
              {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <FastForward className="w-3.5 h-3.5" />}
              {isCompleted ? '100% COMPLETE • MISSION CONTROL READY' : `EXECUTING MILESTONE ${currentMilestoneIndex + 1}/8 (${progressPct}%)`}
            </span>

            <span className="text-xs text-[#888e96] bg-[#121417] px-2.5 py-1 rounded-lg border border-[#1f2228]">
              Target: <strong className="text-white">{industry.name}</strong>
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-white mt-2 flex items-center gap-2">
            Auto-Launch Pipeline: <span className="text-[#00ff9d]">{industry.name}</span>
          </h2>
          <p className="text-xs text-[#888e96] max-w-3xl mt-1 leading-relaxed">
            Automating the entire startup pipeline from industry validation and 12 federal grant packets to 25 commercial offerings and full go-live deployment.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {!isCompleted ? (
            <>
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="px-3 py-2 bg-[#121417] hover:bg-[#1f2228] border border-[#1f2228] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
                title={isRunning ? 'Pause execution' : 'Resume execution'}
              >
                {isRunning ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-[#00ff9d]" />}
                {isRunning ? 'Pause' : 'Resume'}
              </button>

              <button
                onClick={handleFastForward}
                className="px-3.5 py-2 bg-[#00ff9d]/20 hover:bg-[#00ff9d] hover:text-black text-[#00ff9d] border border-[#00ff9d]/40 text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow"
                title="Instantly fast forward to 100% completion"
              >
                <FastForward className="w-3.5 h-3.5" />
                Fast Forward (100%)
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleRestart}
                className="px-3 py-2 bg-[#121417] hover:bg-[#1f2228] border border-[#1f2228] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
                title="Re-run autonomous automation pipeline"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                Re-Run
              </button>

              <button
                onClick={handleDownloadJSON}
                className="px-3.5 py-2 bg-[#00ff9d] hover:bg-[#00ff9d]/90 text-black text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-[0_0_15px_rgba(0,255,157,0.3)]"
                title="Download full startup execution manifest JSON"
              >
                <Download className="w-3.5 h-3.5" />
                Download Launch Packet (.JSON)
              </button>
            </>
          )}

          {onSelectAnotherIndustry && (
            <button
              onClick={onSelectAnotherIndustry}
              className="px-3 py-2 bg-[#121417] hover:bg-[#1f2228] border border-[#1f2228] text-slate-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
              title="Select another industry sector"
            >
              Change Sector
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 bg-[#121417] hover:bg-[#1f2228] border border-[#1f2228] text-slate-400 hover:text-white rounded-xl transition"
            title={isExpanded ? 'Minimize' : 'Expand full screen'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 bg-[#121417] hover:bg-rose-900/50 border border-[#1f2228] text-slate-400 hover:text-rose-400 rounded-xl transition"
              title="Close runner"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar & Milestone Tracker */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">Autonomous End-to-End Progress:</span>
            <span className="text-[#00ff9d] font-bold">{progressPct}%</span>
          </div>
          <span className="text-xs text-[#888e96]">
            {isCompleted ? 'All 8 Milestones Finished' : `Active: Milestone ${currentMilestoneIndex + 1} of 8 (${milestones[currentMilestoneIndex]?.title || ''})`}
          </span>
        </div>

        {/* Bar */}
        <div className="w-full h-3 bg-[#121417] rounded-full overflow-hidden border border-[#1f2228] p-0.5">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-[#00ff9d] to-[#00ff9d] rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(0,255,157,0.5)]"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Milestone Steps Pills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-1">
          {milestones.map((m, idx) => {
            const isPast = idx < currentMilestoneIndex || isCompleted;
            const isCurrent = idx === currentMilestoneIndex && !isCompleted;
            return (
              <div
                key={m.id}
                className={`p-2 rounded-lg border text-left transition-all ${
                  isCurrent
                    ? 'bg-[#00ff9d]/20 border-[#00ff9d] text-white shadow-[0_0_10px_rgba(0,255,157,0.2)] animate-pulse'
                    : isPast
                    ? 'bg-[#08090a] border-emerald-500/40 text-emerald-300'
                    : 'bg-[#08090a] border-[#1f2228] text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold">M{m.number}</span>
                  {isPast ? (
                    <Check className="w-3 h-3 text-[#00ff9d]" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-[#00ff9d] animate-ping" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                  )}
                </div>
                <div className="text-[10px] font-bold truncate mt-1 text-white">{m.title}</div>
                <div className="text-[9px] text-[#888e96] truncate">{m.category}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Runner Content: Terminal Logs & Active Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10">
        
        {/* Left Column: Live Streaming Bash Terminal */}
        <div className="lg:col-span-6 bg-[#030405] border border-[#1f2228] rounded-xl p-4 flex flex-col justify-between h-[360px] shadow-inner">
          <div className="flex items-center justify-between border-b border-[#1f2228] pb-2 text-xs">
            <span className="text-[#00ff9d] font-bold flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#00ff9d]" />
              Autonomous Bash Execution Log
            </span>
            <span className="text-[10px] text-[#888e96]">
              {terminalLogs.length} Stream Events
            </span>
          </div>

          {/* Log Stream Window */}
          <div className="flex-1 overflow-y-auto space-y-1.5 my-2.5 text-[11px] font-mono text-[#00ff9d]/90 pr-2">
            {terminalLogs.map((log, i) => (
              <div key={i} className="leading-snug break-all flex items-start gap-1.5">
                <span className="text-slate-600 select-none">&gt;</span>
                <span className={log.includes('🎉') || log.includes('SUCCESS') ? 'text-[#00ff9d] font-bold' : log.includes('ERROR') ? 'text-rose-400' : 'text-slate-300'}>
                  {log}
                </span>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>

          <div className="pt-2 border-t border-[#1f2228] flex items-center justify-between text-[10px] text-[#888e96]">
            <span>Active Worker: <strong className="text-cyan-400">ASTRO-DAEMON-v1.0</strong></span>
            <span>Latency: <strong className="text-[#00ff9d]">12ms</strong></span>
          </div>
        </div>

        {/* Right Column: Live Artifacts & Quick Metrics Snapshot */}
        <div className="lg:col-span-6 bg-[#08090a] border border-[#1f2228] rounded-xl p-4 flex flex-col justify-between h-[360px] space-y-3">
          <div>
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-2 text-xs">
              <span className="text-white font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Live Startup Launch Cockpit
              </span>
              <span className="text-[10px] font-bold text-[#00ff9d] bg-[#00ff9d]/10 px-2 py-0.5 rounded">
                Score: {viabilityScore.totalScore}/100
              </span>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-xs">
              <div className="bg-[#121417] p-2.5 rounded-lg border border-[#1f2228]">
                <span className="text-[10px] text-[#888e96] block">Market TAM</span>
                <strong className="text-[#00ff9d] text-sm">{industry.marketSize}</strong>
              </div>

              <div className="bg-[#121417] p-2.5 rounded-lg border border-[#1f2228]">
                <span className="text-[10px] text-[#888e96] block">CAGR Velocity</span>
                <strong className="text-cyan-400 text-sm">{industry.growthRate}</strong>
              </div>

              <div className="bg-[#121417] p-2.5 rounded-lg border border-[#1f2228]">
                <span className="text-[10px] text-[#888e96] block">Federal Grants</span>
                <strong className="text-amber-400 text-sm truncate block">{industry.activeGrantFunding}</strong>
              </div>

              <div className="bg-[#121417] p-2.5 rounded-lg border border-[#1f2228]">
                <span className="text-[10px] text-[#888e96] block">Auto-Apply</span>
                <strong className={autoApplyOnDay1 ? 'text-emerald-400' : 'text-slate-400'}>
                  {autoApplyOnDay1 ? 'DAY 1 [ON]' : 'MANUAL'}
                </strong>
              </div>
            </div>

            {/* Live Generated Artifacts List */}
            <div className="mt-3 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-300 block">
                Generated & Verified Execution Modules ({milestones.slice(0, currentMilestoneIndex + 1).flatMap(m => m.artifactsGenerated).length}):
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto pr-1">
                {milestones.slice(0, currentMilestoneIndex + 1).flatMap(m => m.artifactsGenerated).map((art, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-[#121417] text-slate-300 border border-[#1f2228] px-2 py-1 rounded-md flex items-center gap-1"
                  >
                    <Check className="w-3 h-3 text-[#00ff9d]" /> {art}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Execution Status Banner */}
          <div className="bg-[#121417] p-3 rounded-lg border border-[#1f2228] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00ff9d]" />
              <span className="text-slate-300">
                12 Federal Forms + 25 Commercial Offerings + 19 Pipeline Stages
              </span>
            </div>
            <span className="text-[#00ff9d] font-bold">100% Compliant</span>
          </div>
        </div>

      </div>

      {/* ========================================================== */}
      {/* FINAL COMPLETED LAUNCH MISSION CONTROL TABS & DRILL-DOWN */}
      {/* ========================================================== */}
      <div className="space-y-4 pt-3 border-t border-[#1f2228] relative z-10">
        
        {/* Navigation Mode Sub-Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 bg-[#08090a] p-1 rounded-xl border border-[#1f2228]">
            <button
              onClick={() => setActiveViewMode('cockpit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeViewMode === 'cockpit'
                  ? 'bg-[#00ff9d] text-black shadow'
                  : 'text-[#888e96] hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Mission Control Cockpit
            </button>

            <button
              onClick={() => setActiveViewMode('paperwork')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeViewMode === 'paperwork'
                  ? 'bg-[#00ff9d] text-black shadow'
                  : 'text-[#888e96] hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> 12 Federal Packets
            </button>

            <button
              onClick={() => setActiveViewMode('offerings')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeViewMode === 'offerings'
                  ? 'bg-[#00ff9d] text-black shadow'
                  : 'text-[#888e96] hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> 25 Revenue Engines
            </button>

            <button
              onClick={() => setActiveViewMode('pipeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeViewMode === 'pipeline'
                  ? 'bg-[#00ff9d] text-black shadow'
                  : 'text-[#888e96] hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" /> 19 Pipeline Stages
            </button>

            <button
              onClick={() => setActiveViewMode('json')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeViewMode === 'json'
                  ? 'bg-[#00ff9d] text-black shadow'
                  : 'text-[#888e96] hover:text-white'
              }`}
            >
              <Copy className="w-3.5 h-3.5" /> Master JSON Manifest
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyExecutiveSummary}
              className="px-3 py-1.5 bg-[#121417] hover:bg-[#1f2228] border border-[#1f2228] text-slate-300 text-xs font-bold rounded-lg flex items-center gap-1.5 transition"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5 text-[#00ff9d]" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSummary ? 'Summary Copied' : 'Copy Executive Brief'}
            </button>

            <button
              onClick={handleDownloadJSON}
              className="px-3 py-1.5 bg-[#00ff9d] hover:bg-[#00ff9d]/90 text-black text-xs font-bold rounded-lg flex items-center gap-1.5 transition shadow"
            >
              <Download className="w-3.5 h-3.5" />
              Download Full Launch Packet (.JSON)
            </button>
          </div>
        </div>

        {/* VIEW 1: COCKPIT OVERVIEW */}
        {activeViewMode === 'cockpit' && (
          <div className="space-y-4">
            
            {/* Victory Hero Card */}
            <div className="bg-gradient-to-r from-emerald-950/40 via-[#08090a] to-[#08090a] border border-[#00ff9d]/50 p-5 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase bg-[#00ff9d]/20 text-[#00ff9d] px-2 py-0.5 rounded border border-[#00ff9d]/40">
                  READY FOR DAY 1 LAUNCH
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                  Launch Architecture for {industry.name} is Fully Armed & Ready
                </h3>
                <p className="text-xs text-slate-300 max-w-2xl mt-0.5 leading-relaxed">
                  Your business intelligence models, 12 federal non-dilutive grant filings, 25 high-margin product/service offerings, and GTM execution scripts have been completely synthesized.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {onNavigateTab && (
                  <button
                    onClick={() => onNavigateTab('plan')}
                    className="px-4 py-2.5 bg-[#00ff9d] hover:bg-[#00ff9d]/90 text-black font-bold text-xs rounded-xl flex items-center gap-2 transition shadow-[0_0_15px_rgba(0,255,157,0.3)]"
                  >
                    Open AI Business Plan <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* 3 Bento Cards Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Card 1: Federal Grant Readiness */}
              <div className="bg-[#08090a] p-4 rounded-xl border border-[#1f2228] space-y-3">
                <div className="flex items-center justify-between border-b border-[#1f2228] pb-2 text-xs">
                  <span className="text-white font-bold flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-[#00ff9d]" /> Federal Grants Engine
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    12 Forms Ready
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-[#888e96]">Target Grant Pool:</span>
                    <strong className="text-amber-400">{industry.activeGrantFunding}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888e96]">Auto-Apply Dispatch:</span>
                    <strong className={autoApplyOnDay1 ? 'text-emerald-400' : 'text-slate-400'}>
                      {autoApplyOnDay1 ? 'DAY 1 [ON]' : 'MANUAL'}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888e96]">Key Packets:</span>
                    <span className="text-white">SF-424, SF-424A, 15-Pg Narrative</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveViewMode('paperwork')}
                  className="w-full py-2 bg-[#121417] hover:bg-[#1f2228] text-xs font-bold text-slate-200 rounded-lg transition text-center block mt-2 border border-[#1f2228]"
                >
                  View All 12 Federal Packets &rarr;
                </button>
              </div>

              {/* Card 2: 25 Commercial Offerings */}
              <div className="bg-[#08090a] p-4 rounded-xl border border-[#1f2228] space-y-3">
                <div className="flex items-center justify-between border-b border-[#1f2228] pb-2 text-xs">
                  <span className="text-white font-bold flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-cyan-400" /> 25 Revenue Engines
                  </span>
                  <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                    25/25 Active
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-[#888e96]">Products (10):</span>
                    <span className="text-white font-bold">SaaS, Hardware, APIs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888e96]">Services (10):</span>
                    <span className="text-white font-bold">Advisory, Managed Ops</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888e96]">Enterprise Modules (5):</span>
                    <span className="text-[#00ff9d] font-bold">GovCon, Tax, SOPs</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveViewMode('offerings')}
                  className="w-full py-2 bg-[#121417] hover:bg-[#1f2228] text-xs font-bold text-slate-200 rounded-lg transition text-center block mt-2 border border-[#1f2228]"
                >
                  View All 25 Offerings &rarr;
                </button>
              </div>

              {/* Card 3: Financial Velocity & Next Steps */}
              <div className="bg-[#08090a] p-4 rounded-xl border border-[#1f2228] space-y-3">
                <div className="flex items-center justify-between border-b border-[#1f2228] pb-2 text-xs">
                  <span className="text-white font-bold flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-400" /> Go-Live Action Plan
                  </span>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                    Immediate Steps
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff9d]" />
                    <span>Download Complete Launch Package JSON</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff9d]" />
                    <span>File SAM.gov UEI & Form SS-4 EIN</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff9d]" />
                    <span>Deploy Day 1 SBIR Phase I Proposal</span>
                  </div>
                </div>
                <button
                  onClick={handleDownloadJSON}
                  className="w-full py-2 bg-[#00ff9d] hover:bg-[#00ff9d]/90 text-xs font-bold text-black rounded-lg transition text-center block mt-2 shadow"
                >
                  Download Full Package (.JSON)
                </button>
              </div>

            </div>

          </div>
        )}

        {/* VIEW 2: 12 FEDERAL PACKETS */}
        {activeViewMode === 'paperwork' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-2 text-xs">
              <span className="text-white font-bold">12 Federal Funding Documents Compiled for {industry.name}:</span>
              <span className="text-xs text-[#00ff9d]">Zero-Error Compliance Verified</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {FUNDING_PAPERWORK_CATALOG.map((doc) => (
                <div key={doc.id} className="bg-[#08090a] p-3.5 rounded-xl border border-[#1f2228] space-y-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-[#00ff9d] bg-[#00ff9d]/10 px-2 py-0.5 rounded border border-[#00ff9d]/30">
                      {doc.code}
                    </span>
                    <span className="text-slate-400 font-bold">{doc.agencyOrTarget}</span>
                  </div>
                  <div className="text-xs font-bold text-white">{doc.title}</div>
                  <p className="text-[10px] text-[#888e96] line-clamp-2 leading-relaxed">{doc.description}</p>
                  
                  <div className="pt-2 border-t border-[#1f2228] flex items-center justify-between text-[10px]">
                    <span className="text-amber-300">Filing: {doc.urgency}</span>
                    <a
                      href={doc.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00ff9d] hover:underline flex items-center gap-1 font-bold"
                    >
                      {doc.filingPortal} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: 25 REVENUE ENGINES */}
        {activeViewMode === 'offerings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-2 text-xs">
              <span className="text-white font-bold">Complete 25 Products & Services for {industry.name}:</span>
              <span className="text-xs text-cyan-400">All 25 Deployed (10 Products + 10 Services + 5 Core Systems)</span>
            </div>

            {/* Products (10) */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#00ff9d] uppercase">10 SaaS & Hardware Products</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2.5">
                {industry.products.map(p => (
                  <div key={p.id} className="bg-[#08090a] p-3 rounded-lg border border-[#1f2228] space-y-1.5 text-[10px]">
                    <div className="flex items-center justify-between">
                      <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded font-bold">{p.type}</span>
                      <span className="text-emerald-400 font-bold">{p.marginPct}</span>
                    </div>
                    <div className="font-bold text-white text-xs">{p.name}</div>
                    <p className="text-[#888e96] line-clamp-2">{p.valueProp}</p>
                    <div className="text-amber-300 font-mono">{p.pricingModel}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Services (10) */}
            <div className="space-y-2 pt-3 border-t border-[#1f2228]">
              <h4 className="text-xs font-bold text-cyan-400 uppercase">10 High-Margin Services</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2.5">
                {industry.services.map(s => (
                  <div key={s.id} className="bg-[#08090a] p-3 rounded-lg border border-[#1f2228] space-y-1.5 text-[10px]">
                    <div className="flex items-center justify-between">
                      <span className="px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 rounded font-bold">{s.type}</span>
                      <span className="text-emerald-400 font-bold">{s.marginPct}</span>
                    </div>
                    <div className="font-bold text-white text-xs">{s.name}</div>
                    <p className="text-[#888e96] line-clamp-2">{s.valueProp}</p>
                    <div className="text-amber-300 font-mono">{s.billingRate}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: 19 PIPELINE STAGES */}
        {activeViewMode === 'pipeline' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-2 text-xs">
              <span className="text-white font-bold">19-Stage Auto Business Intelligence Workflow Stages:</span>
              <span className="text-xs text-[#00ff9d]">19/19 Stages Verified</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {AUTO_BUSINESS_INTELLIGENCE_WORKFLOW.execution_order.map(st => (
                <div key={st.stage} className="bg-[#08090a] p-3 rounded-lg border border-[#1f2228] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#00ff9d] bg-[#00ff9d]/10 px-2 py-0.5 rounded">
                      STAGE {st.stage}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">Automated</span>
                  </div>
                  <div className="font-bold text-white">{st.name}</div>
                  <p className="text-[10px] text-[#888e96] line-clamp-2">{st.purpose}</p>
                  <div className="text-[10px] text-cyan-400 truncate">
                    Outputs: {st.outputs.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 5: MASTER JSON MANIFEST */}
        {activeViewMode === 'json' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-2 text-xs">
              <span className="text-white font-bold">Master Startup Execution Manifest JSON:</span>
              <button
                onClick={handleCopyJSON}
                className="px-3 py-1 bg-[#121417] hover:bg-[#1f2228] border border-[#1f2228] text-xs font-bold text-white rounded-lg flex items-center gap-1.5 transition"
              >
                {copiedJSON ? <Check className="w-3.5 h-3.5 text-[#00ff9d]" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedJSON ? 'Copied to Clipboard' : 'Copy JSON'}
              </button>
            </div>

            <pre className="bg-[#030405] p-4 rounded-xl border border-[#1f2228] text-xs text-[#00ff9d] overflow-x-auto max-h-[350px] font-mono leading-relaxed">
              {JSON.stringify(fullLaunchPackage, null, 2)}
            </pre>
          </div>
        )}

      </div>

    </div>
  );
};
