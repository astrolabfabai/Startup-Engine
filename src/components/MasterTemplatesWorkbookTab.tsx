import React, { useState } from 'react';
import {
  MASTER_BUSINESS_PLAN_TEMPLATE,
  BUSINESS_STARTUP_SOP_MANUAL,
  BUSINESS_APPLICATION_WORKBOOK,
  ApplicationWorksheet,
  SopStepGuide,
} from '../data/masterTemplatesData';
import {
  FileCheck2,
  BookOpenCheck,
  Building2,
  Sparkles,
  Search,
  Copy,
  Check,
  Download,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileText,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Terminal,
  Workflow,
  Layers,
  Briefcase,
  ChevronRight,
} from 'lucide-react';

export const MasterTemplatesWorkbookTab: React.FC = () => {
  const [mainTab, setMainTab] = useState<'plan' | 'sop_manual' | 'workbook'>('plan');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorksheet, setSelectedWorksheet] = useState<ApplicationWorksheet>(
    BUSINESS_APPLICATION_WORKBOOK[0]
  );
  const [selectedSop, setSelectedSop] = useState<SopStepGuide>(
    BUSINESS_STARTUP_SOP_MANUAL[0]
  );

  // Interactive user state for worksheet values
  const [userFormValues, setUserFormValues] = useState<Record<string, string>>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopyText = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleInputChange = (fieldId: string, value: string) => {
    setUserFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  // Download export helper
  const handleExportWorkbookMarkdown = () => {
    let md = `# ${selectedWorksheet.title}\n\n`;
    md += `**Purpose:** ${selectedWorksheet.purpose}\n`;
    md += `**Issuing Agency / Body:** ${selectedWorksheet.issuingAgencyOrBody}\n\n`;

    md += `## Required Supporting Documents\n`;
    selectedWorksheet.requiredSupportingDocs.forEach((doc) => (md += `- ${doc}\n`));
    md += `\n## Preparation Checklist\n`;
    selectedWorksheet.prepChecklist.forEach((chk) => (md += `- ${chk}\n`));

    md += `\n## Application Fields & Instructions\n\n`;
    selectedWorksheet.fields.forEach((f) => {
      const userVal = userFormValues[f.fieldId] || f.commonAcceptableValues;
      md += `### ${f.fieldName}\n`;
      md += `- **Explanation:** ${f.explanation}\n`;
      md += `- **What Belongs Here:** ${f.whatBelongsHere}\n`;
      md += `- **Acceptable Value / Prepared Input:** ${userVal}\n`;
      md += `- **Submission Tip:** ${f.submissionTip}\n\n`;
    });

    md += `## Expert Submission Tips\n`;
    selectedWorksheet.expertSubmissionTips.forEach((tip) => (md += `- ${tip}\n`));

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedWorksheet.id}_${selectedWorksheet.title.replace(/\s+/g, '_')}.md`;
    a.click();
  };

  const filteredWorksheets = BUSINESS_APPLICATION_WORKBOOK.filter(
    (ws) =>
      ws.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ws.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ws.issuingAgencyOrBody.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSops = BUSINESS_STARTUP_SOP_MANUAL.filter(
    (sop) =>
      sop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sop.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sop.objective.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Tab Header & Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1f2228] pb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpenCheck className="w-5 h-5 text-[#00ff9d]" /> Universal Business Master Templates & Application Workbook
          </h2>
          <p className="text-xs text-[#888e96] mt-0.5">
            Complete Business Plan Template, Startup Process Manual, and 11 Interactive Business Application Worksheets with realistic field guidance.
          </p>
        </div>

        {/* Mode Buttons */}
        <div className="flex items-center gap-1 bg-[#08090a] p-1 rounded-xl border border-[#1f2228] overflow-x-auto">
          <button
            onClick={() => setMainTab('plan')}
            className={`text-xs px-3 py-1.5 rounded-lg font-mono font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              mainTab === 'plan'
                ? 'bg-[#00ff9d] text-[#08090a] shadow-[0_0_10px_rgba(0,255,157,0.3)]'
                : 'text-[#888e96] hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" /> Master Business Plan
          </button>

          <button
            onClick={() => setMainTab('sop_manual')}
            className={`text-xs px-3 py-1.5 rounded-lg font-mono font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              mainTab === 'sop_manual'
                ? 'bg-[#00ff9d] text-[#08090a] shadow-[0_0_10px_rgba(0,255,157,0.3)]'
                : 'text-[#888e96] hover:text-slate-200'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" /> Startup SOP Manual
          </button>

          <button
            onClick={() => setMainTab('workbook')}
            className={`text-xs px-3 py-1.5 rounded-lg font-mono font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              mainTab === 'workbook'
                ? 'bg-[#00ff9d] text-[#08090a] shadow-[0_0_10px_rgba(0,255,157,0.3)]'
                : 'text-[#888e96] hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" /> Application Workbook
          </button>
        </div>
      </div>

      {/* MODE 1: MASTER BUSINESS PLAN TEMPLATE */}
      {mainTab === 'plan' && (
        <div className="space-y-6">
          
          {/* Executive Overview Banner */}
          <div className="bento-card p-6 space-y-4 border-[#00ff9d]/30 bg-gradient-to-r from-[#08090a] via-[#0d1117] to-[#08090a]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30 px-2 py-0.5 rounded">
                  Universal Master Architecture
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {MASTER_BUSINESS_PLAN_TEMPLATE.title}
                </h3>
                <p className="text-xs text-[#888e96] max-w-3xl mt-0.5 leading-relaxed">
                  {MASTER_BUSINESS_PLAN_TEMPLATE.description}
                </p>
              </div>

              <button
                onClick={() => handleCopyText(JSON.stringify(MASTER_BUSINESS_PLAN_TEMPLATE, null, 2), 'plan_json')}
                className="px-3.5 py-1.5 bg-[#00ff9d] hover:bg-[#00ff9d]/90 text-[#08090a] text-xs font-mono font-bold rounded-lg flex items-center gap-1.5 transition-all shadow shrink-0"
              >
                {copiedField === 'plan_json' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedField === 'plan_json' ? 'JSON Copied' : 'Export Full Plan JSON'}
              </button>
            </div>
          </div>

          {/* SWOT & KPI Dashboard Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* SWOT Matrix */}
            <div className="bento-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
                <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#00ff9d]" /> Enterprise SWOT Matrix
                </h4>
                <span className="text-[10px] font-mono text-[#888e96]">Strategic Analysis</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-[#08090a] p-3 rounded-xl border border-[#00ff9d]/20 space-y-1">
                  <span className="text-[#00ff9d] font-bold text-[11px] block">Strengths</span>
                  <ul className="list-disc list-inside text-[#888e96] text-[11px] space-y-1">
                    {MASTER_BUSINESS_PLAN_TEMPLATE.swotAnalysis.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#08090a] p-3 rounded-xl border border-rose-500/20 space-y-1">
                  <span className="text-rose-400 font-bold text-[11px] block">Weaknesses</span>
                  <ul className="list-disc list-inside text-[#888e96] text-[11px] space-y-1">
                    {MASTER_BUSINESS_PLAN_TEMPLATE.swotAnalysis.weaknesses.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#08090a] p-3 rounded-xl border border-cyan-400/20 space-y-1">
                  <span className="text-cyan-400 font-bold text-[11px] block">Opportunities</span>
                  <ul className="list-disc list-inside text-[#888e96] text-[11px] space-y-1">
                    {MASTER_BUSINESS_PLAN_TEMPLATE.swotAnalysis.opportunities.map((o, i) => (
                      <li key={i}>{o}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#08090a] p-3 rounded-xl border border-amber-400/20 space-y-1">
                  <span className="text-amber-400 font-bold text-[11px] block">Threats</span>
                  <ul className="list-disc list-inside text-[#888e96] text-[11px] space-y-1">
                    {MASTER_BUSINESS_PLAN_TEMPLATE.swotAnalysis.threats.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* KPI Dashboard Metrics */}
            <div className="bento-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
                <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#00ff9d]" /> Central Executive KPI Dashboard
                </h4>
                <span className="text-[10px] font-mono text-[#888e96]">Performance Targets</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {MASTER_BUSINESS_PLAN_TEMPLATE.kpiDashboardMetrics.map((kpi, idx) => (
                  <div key={idx} className="bg-[#08090a] p-3 rounded-xl border border-[#1f2228] space-y-1 font-mono">
                    <div className="text-[11px] font-bold text-white">{kpi.metric}</div>
                    <div className="text-xs font-bold text-[#00ff9d]">{kpi.target}</div>
                    <div className="text-[10px] text-[#888e96] flex items-center justify-between pt-1">
                      <span>{kpi.frequency}</span>
                      <span className="text-slate-300">{kpi.owner}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* 10 Products & 10 Services Catalogs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* 10 Products Section */}
            <div className="bento-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
                <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#00ff9d]" /> 10 Digital Products Catalog
                </h4>
                <span className="text-[10px] font-mono text-[#00ff9d]">SaaS & Software Packs</span>
              </div>

              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {MASTER_BUSINESS_PLAN_TEMPLATE.products.map((p) => (
                  <div key={p.id} className="bg-[#08090a] p-3.5 rounded-xl border border-[#1f2228] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-white">{p.name}</span>
                      <span className="text-[10px] font-mono font-bold text-[#00ff9d] bg-[#00ff9d]/10 px-2 py-0.5 rounded border border-[#00ff9d]/30">
                        {p.pricingModel}
                      </span>
                    </div>

                    <p className="text-xs text-[#888e96]">{p.valueProp}</p>

                    <div className="text-[10px] font-mono text-[#888e96] flex items-center justify-between pt-1 border-t border-[#1f2228]">
                      <span>Target: <strong className="text-slate-300">{p.targetSegment}</strong></span>
                      <span className="text-cyan-400 font-semibold">AI: {p.aiEnhancement}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 10 Services Section */}
            <div className="bento-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
                <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-[#00ff9d]" /> 10 High-Margin Services Catalog
                </h4>
                <span className="text-[10px] font-mono text-[#00ff9d]">Tech Consulting & Advisory</span>
              </div>

              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {MASTER_BUSINESS_PLAN_TEMPLATE.services.map((s) => (
                  <div key={s.id} className="bg-[#08090a] p-3.5 rounded-xl border border-[#1f2228] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-white">{s.name}</span>
                      <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                        {s.pricingModel}
                      </span>
                    </div>

                    <p className="text-xs text-[#888e96]">{s.valueProp}</p>

                    <div className="text-[10px] font-mono text-[#888e96] flex items-center justify-between pt-1 border-t border-[#1f2228]">
                      <span>Target: <strong className="text-slate-300">{s.targetSegment}</strong></span>
                      <span className="text-cyan-400 font-semibold">AI: {s.aiEnhancement}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* 5-Year Financial Projections Table */}
          <div className="bento-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
              <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#00ff9d]" /> 1, 3, and 5-Year Income Statement & KPI Projections
              </h4>
              <span className="text-[10px] font-mono text-[#888e96]">Scale & Margin Growth</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-[11px] uppercase bg-[#08090a] text-[#888e96] border-b border-[#1f2228]">
                  <tr>
                    <th className="py-2.5 px-3">Timeline</th>
                    <th className="py-2.5 px-3">Revenue</th>
                    <th className="py-2.5 px-3">COGS (18%)</th>
                    <th className="py-2.5 px-3">Gross Profit</th>
                    <th className="py-2.5 px-3">OpEx</th>
                    <th className="py-2.5 px-3">EBITDA</th>
                    <th className="py-2.5 px-3">Net Income</th>
                    <th className="py-2.5 px-3">Key Milestones & KPIs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f2228] text-slate-300">
                  {MASTER_BUSINESS_PLAN_TEMPLATE.financialProjections.map((fp) => (
                    <tr key={fp.year} className="hover:bg-[#08090a]">
                      <td className="py-3 px-3 font-bold text-white">Year {fp.year}</td>
                      <td className="py-3 px-3 text-[#00ff9d] font-bold">{fp.revenue}</td>
                      <td className="py-3 px-3 text-rose-400">{fp.cogs}</td>
                      <td className="py-3 px-3 text-cyan-400 font-semibold">{fp.grossProfit}</td>
                      <td className="py-3 px-3 text-[#888e96]">{fp.opex}</td>
                      <td className="py-3 px-3 text-amber-400 font-semibold">{fp.ebitda}</td>
                      <td className="py-3 px-3 text-[#00ff9d] font-bold">{fp.netIncome}</td>
                      <td className="py-3 px-3 text-[10px] text-[#888e96]">
                        {fp.kpis.join(' • ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Master Business Plan Core Sections */}
          <div className="bento-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
              <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00ff9d]" /> Detailed Business Plan Sections & AI Automation Blueprints
              </h4>
              <span className="text-[10px] font-mono text-[#888e96]">{MASTER_BUSINESS_PLAN_TEMPLATE.sections.length} Core Modules</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MASTER_BUSINESS_PLAN_TEMPLATE.sections.map((sec) => (
                <div key={sec.id} className="bg-[#08090a] p-4 rounded-xl border border-[#1f2228] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#1f2228] pb-2">
                    <span className="text-xs font-mono font-bold text-white">{sec.title}</span>
                    <span className="text-[10px] font-mono text-[#00ff9d] bg-[#00ff9d]/10 px-2 py-0.5 rounded border border-[#00ff9d]/30">
                      {sec.category}
                    </span>
                  </div>

                  <p className="text-xs text-[#888e96]">{sec.purpose}</p>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono font-bold text-slate-300 block">Key Required Fields:</span>
                    {sec.keyFields.map((kf, i) => (
                      <div key={i} className="bg-[#121417] p-2 rounded border border-[#1f2228] text-[11px] space-y-0.5 font-mono">
                        <div className="text-white font-bold">{kf.fieldName}</div>
                        <div className="text-[#888e96]">{kf.description}</div>
                        <div className="text-[#00ff9d] text-[10px]">Example: {kf.exampleValue}</div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#0d1117] p-2.5 rounded-lg border border-cyan-500/20 text-[10px] font-mono space-y-1">
                    <div className="text-cyan-400 font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" /> AI Automation:
                    </div>
                    <div className="text-[#888e96]">{sec.aiAutomationTip}</div>
                    <div className="text-amber-400 font-bold pt-1 flex items-center gap-1">
                      <Workflow className="w-3 h-3 text-amber-400" /> n8n Workflow:
                    </div>
                    <div className="text-[#888e96]">{sec.n8nWorkflowIdea}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* MODE 2: BUSINESS STARTUP SOP MANUAL */}
      {mainTab === 'sop_manual' && (
        <div className="space-y-6">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 text-[#888e96] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search SOP manual (LLC, EIN, D-U-N-S, Bank, Credit, Insurance)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#08090a] border border-[#1f2228] rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00ff9d]"
              />
            </div>

            <span className="text-xs text-[#888e96] font-mono">
              Showing {filteredSops.length} Step-by-Step SOP Manual Guides
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* SOP Selection List */}
            <div className="bento-card p-4 space-y-2 lg:col-span-1 max-h-[600px] overflow-y-auto">
              <span className="text-xs font-mono font-bold text-[#00ff9d] uppercase block border-b border-[#1f2228] pb-2">
                Startup SOP Manual Index
              </span>
              {filteredSops.map((sop) => {
                const isSelected = selectedSop.id === sop.id;
                return (
                  <button
                    key={sop.id}
                    onClick={() => setSelectedSop(sop)}
                    className={`w-full text-left p-3 rounded-xl border transition-all space-y-1 font-mono ${
                      isSelected
                        ? 'bg-[#00ff9d]/10 border-[#00ff9d] text-white shadow-[0_0_10px_rgba(0,255,157,0.2)]'
                        : 'bg-[#08090a] border-[#1f2228] text-[#888e96] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#00ff9d]">{sop.id}</span>
                      <span className="text-[9px] bg-[#1f2228] text-slate-300 px-1.5 py-0.5 rounded">
                        {sop.estimatedTime}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white">{sop.title}</div>
                    <div className="text-[10px] text-[#888e96]">{sop.category}</div>
                  </button>
                );
              })}
            </div>

            {/* SOP Detailed Guide Display */}
            <div className="bento-card p-6 space-y-5 lg:col-span-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#1f2228] pb-4 gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30 px-2 py-0.5 rounded">
                    {selectedSop.id} | {selectedSop.category}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">{selectedSop.title}</h3>
                  <p className="text-xs text-[#888e96] mt-0.5">{selectedSop.objective}</p>
                </div>

                <div className="text-right font-mono text-xs text-[#888e96] shrink-0">
                  <div>Est. Time: <strong className="text-[#00ff9d]">{selectedSop.estimatedTime}</strong></div>
                  <div>Difficulty: <strong className="text-amber-400">{selectedSop.difficulty}</strong></div>
                </div>
              </div>

              {/* Required Documents */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-white uppercase block flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#00ff9d]" /> Required Supporting Documents:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedSop.requiredDocs.map((doc, idx) => (
                    <div key={idx} className="bg-[#08090a] p-2.5 rounded-lg border border-[#1f2228] text-xs font-mono text-slate-300 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff9d] shrink-0" /> {doc}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step by Step Instructions */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-white uppercase block flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#00ff9d]" /> Step-by-Step Execution Sequence:
                </span>
                <div className="space-y-2">
                  {selectedSop.stepByStepInstructions.map((step, idx) => (
                    <div key={idx} className="bg-[#08090a] p-3 rounded-xl border border-[#1f2228] text-xs font-mono text-slate-200 flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#00ff9d]/20 text-[#00ff9d] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checklists */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-white uppercase block flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff9d]" /> Verification Checklist:
                </span>
                <div className="bg-[#08090a] p-3 rounded-xl border border-[#1f2228] space-y-1 font-mono text-xs text-slate-300">
                  {selectedSop.checklists.map((chk, idx) => (
                    <div key={idx} className="py-0.5">{chk}</div>
                  ))}
                </div>
              </div>

              {/* Disaster Recovery & AI Automation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl text-xs font-mono space-y-1">
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Disaster Recovery Fallback:
                  </span>
                  <p className="text-slate-300">{selectedSop.disasterRecoveryTip}</p>
                </div>

                <div className="bg-[#00ff9d]/10 border border-[#00ff9d]/30 p-3 rounded-xl text-xs font-mono space-y-1">
                  <span className="text-[#00ff9d] font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> AI Automation Opportunity:
                  </span>
                  <p className="text-slate-300">{selectedSop.aiAutomationOpportunity}</p>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* MODE 3: BUSINESS APPLICATION WORKBOOK (11 WORKSHEETS) */}
      {mainTab === 'workbook' && (
        <div className="space-y-6">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 text-[#888e96] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search 11 application worksheets (EIN, Credit, DUNS, Bank, SBA)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#08090a] border border-[#1f2228] rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00ff9d]"
              />
            </div>

            <button
              onClick={handleExportWorkbookMarkdown}
              className="px-3.5 py-2 bg-[#00ff9d] hover:bg-[#00ff9d]/90 text-[#08090a] text-xs font-mono font-bold rounded-xl flex items-center gap-1.5 transition-all shadow shrink-0"
            >
              <Download className="w-4 h-4" /> Export Active Worksheet (.MD)
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Worksheet Selector List */}
            <div className="bento-card p-4 space-y-2 lg:col-span-1 max-h-[620px] overflow-y-auto">
              <span className="text-xs font-mono font-bold text-[#00ff9d] uppercase block border-b border-[#1f2228] pb-2">
                11 Application Worksheets
              </span>
              {filteredWorksheets.map((ws) => {
                const isSelected = selectedWorksheet.id === ws.id;
                return (
                  <button
                    key={ws.id}
                    onClick={() => setSelectedWorksheet(ws)}
                    className={`w-full text-left p-3 rounded-xl border transition-all space-y-1 font-mono ${
                      isSelected
                        ? 'bg-[#00ff9d]/10 border-[#00ff9d] text-white shadow-[0_0_10px_rgba(0,255,157,0.2)]'
                        : 'bg-[#08090a] border-[#1f2228] text-[#888e96] hover:text-white'
                    }`}
                  >
                    <div className="text-[10px] font-bold text-[#00ff9d]">{ws.id}</div>
                    <div className="text-xs font-bold text-white">{ws.title}</div>
                    <div className="text-[10px] text-[#888e96]">{ws.issuingAgencyOrBody}</div>
                  </button>
                );
              })}
            </div>

            {/* Active Worksheet Display & Prep Guide */}
            <div className="bento-card p-6 space-y-6 lg:col-span-2">
              
              {/* Header */}
              <div className="border-b border-[#1f2228] pb-4 space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30 px-2 py-0.5 rounded">
                  {selectedWorksheet.issuingAgencyOrBody}
                </span>
                <h3 className="text-lg font-bold text-white">{selectedWorksheet.title}</h3>
                <p className="text-xs text-[#888e96] leading-relaxed">{selectedWorksheet.purpose}</p>
              </div>

              {/* Supporting Docs & Prep Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#08090a] p-4 rounded-xl border border-[#1f2228] space-y-2">
                  <span className="text-xs font-mono font-bold text-white uppercase block flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#00ff9d]" /> Required Supporting Docs:
                  </span>
                  <ul className="space-y-1 text-xs font-mono text-[#888e96]">
                    {selectedWorksheet.requiredSupportingDocs.map((doc, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#00ff9d]">•</span> {doc}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#08090a] p-4 rounded-xl border border-[#1f2228] space-y-2">
                  <span className="text-xs font-mono font-bold text-white uppercase block flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff9d]" /> Preparation Checklist:
                  </span>
                  <div className="space-y-1 text-xs font-mono text-[#888e96]">
                    {selectedWorksheet.prepChecklist.map((chk, idx) => (
                      <div key={idx}>{chk}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interactive Form Fields with Detailed Guidance */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#1f2228] pb-2">
                  <span className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#00ff9d]" /> Worksheet Field Instructions & Data Prep Form
                  </span>
                  <span className="text-[10px] font-mono text-[#888e96]">
                    {selectedWorksheet.fields.length} Required Fields
                  </span>
                </div>

                <div className="space-y-4">
                  {selectedWorksheet.fields.map((f) => {
                    const currentValue = userFormValues[f.fieldId] ?? f.commonAcceptableValues;
                    return (
                      <div key={f.fieldId} className="bg-[#08090a] p-4 rounded-xl border border-[#1f2228] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-white flex items-center gap-2">
                            {f.fieldName}
                          </span>
                          <button
                            onClick={() => handleCopyText(currentValue, f.fieldId)}
                            className="text-[10px] font-mono text-[#888e96] hover:text-[#00ff9d] flex items-center gap-1 bg-[#1f2228] px-2 py-0.5 rounded"
                          >
                            {copiedField === f.fieldId ? <Check className="w-3 h-3 text-[#00ff9d]" /> : <Copy className="w-3 h-3" />}
                            {copiedField === f.fieldId ? 'Copied' : 'Copy Value'}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                          <div className="bg-[#121417] p-2.5 rounded-lg border border-[#1f2228] space-y-1">
                            <span className="text-[10px] text-[#00ff9d] font-bold block">Field Explanation</span>
                            <p className="text-[#888e96]">{f.explanation}</p>
                          </div>

                          <div className="bg-[#121417] p-2.5 rounded-lg border border-[#1f2228] space-y-1">
                            <span className="text-[10px] text-cyan-400 font-bold block">What Belongs Here</span>
                            <p className="text-[#888e96]">{f.whatBelongsHere}</p>
                          </div>

                          <div className="bg-[#121417] p-2.5 rounded-lg border border-[#1f2228] space-y-1">
                            <span className="text-[10px] text-amber-400 font-bold block">Submission Tip</span>
                            <p className="text-[#888e96]">{f.submissionTip}</p>
                          </div>
                        </div>

                        {/* Interactive Input Box */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold text-slate-300 block">
                            Prepared Value / Common Acceptable Format:
                          </label>
                          <input
                            type="text"
                            value={currentValue}
                            onChange={(e) => handleInputChange(f.fieldId, e.target.value)}
                            className="w-full bg-[#121417] border border-[#1f2228] rounded-xl px-3 py-2 text-xs font-mono text-[#00ff9d] focus:outline-none focus:border-[#00ff9d]"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Expert Submission Tips */}
              <div className="bg-[#08090a] p-4 rounded-xl border border-[#00ff9d]/30 space-y-2 font-mono">
                <span className="text-xs font-bold text-[#00ff9d] flex items-center gap-1.5 uppercase">
                  <Sparkles className="w-4 h-4 text-[#00ff9d]" /> Expert Submission & Avoid-Rejection Tips:
                </span>
                <ul className="space-y-1 text-xs text-[#888e96]">
                  {selectedWorksheet.expertSubmissionTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#00ff9d] shrink-0 mt-0.5" /> {tip}
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
