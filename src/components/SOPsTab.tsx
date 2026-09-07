import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { INITIAL_SOPS } from '../data/startupData';
import { SOPItem } from '../types';
import {
  FileCode2,
  Terminal,
  CheckCircle2,
  ListOrdered,
  Code,
  Copy,
  Check,
  Bot,
  Play,
  Download,
} from 'lucide-react';

export const SOPsTab: React.FC = () => {
  const [selectedSOP, setSelectedSOP] = useState<SOPItem>(INITIAL_SOPS[0]);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    const contentWidth = pageWidth - margin * 2;
    let y = 40;

    const checkPageOverflow = (neededHeight: number) => {
      if (y + neededHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
    };

    // Header banner / Branding
    doc.setFillColor(15, 23, 42); // Dark slate
    doc.rect(margin, y, contentWidth, 54, 'F');

    doc.setTextColor(0, 255, 157); // Accent green
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`STANDARD OPERATING PROCEDURE: ${selectedSOP.sop_id}`, margin + 15, y + 20);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    const titleLines = doc.splitTextToSize(selectedSOP.title, contentWidth - 30);
    doc.text(titleLines[0], margin + 15, y + 40);

    y += 70;

    // Category & Objective
    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('CATEGORY:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(selectedSOP.category, margin + 80, y);
    y += 18;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 65, 85);
    doc.text('OBJECTIVE:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const splitObjective = doc.splitTextToSize(selectedSOP.objective, contentWidth - 80);
    doc.text(splitObjective, margin + 80, y);
    y += Math.max(splitObjective.length * 14, 18) + 15;

    // Divider line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(1);
    doc.line(margin, y, pageWidth - margin, y);
    y += 20;

    // 1. Prerequisites & Tools
    checkPageOverflow(80);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('1. Prerequisites & Required Tools', margin, y);
    y += 18;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 65, 85);
    doc.text('Prerequisites:', margin + 10, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    
    selectedSOP.prerequisites.forEach((p) => {
      const lines = doc.splitTextToSize(`• ${p}`, contentWidth - 25);
      checkPageOverflow(lines.length * 14);
      doc.text(lines, margin + 20, y + 14);
      y += lines.length * 14;
    });
    y += 10;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 65, 85);
    checkPageOverflow(20);
    doc.text('Tools Required:', margin + 10, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const toolsStr = selectedSOP.tools.join(', ');
    const toolLines = doc.splitTextToSize(toolsStr, contentWidth - 25);
    checkPageOverflow(toolLines.length * 14);
    doc.text(toolLines, margin + 20, y + 14);
    y += toolLines.length * 14 + 20;

    // 2. Step-by-Step Procedure
    checkPageOverflow(40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('2. Operational Step-by-Step Procedure', margin, y);
    y += 18;

    selectedSOP.detailed_steps.forEach((step) => {
      checkPageOverflow(40);

      // Step banner
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, y, contentWidth, 24, 'F');
      doc.setDrawColor(203, 213, 225);
      doc.rect(margin, y, contentWidth, 24, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text(`Step ${step.step_number}: ${step.step_name}`, margin + 10, y + 16);
      y += 32;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.setFontSize(9.5);

      step.instructions.forEach((ins) => {
        const insLines = doc.splitTextToSize(`- ${ins}`, contentWidth - 30);
        checkPageOverflow(insLines.length * 13 + 4);
        doc.text(insLines, margin + 15, y);
        y += insLines.length * 13 + 4;
      });

      y += 8;
    });

    // 3. Expected Outputs
    checkPageOverflow(50);
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('3. Expected Output Artifacts', margin, y);
    y += 18;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    selectedSOP.outputs.forEach((out) => {
      const outLines = doc.splitTextToSize(`• ${out}`, contentWidth - 20);
      checkPageOverflow(outLines.length * 14);
      doc.text(outLines, margin + 10, y);
      y += outLines.length * 14 + 2;
    });

    // Footer on all pages
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`ASTRO LAB FAB • ${selectedSOP.sop_id} - ${selectedSOP.title}`, margin, pageHeight - 20);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 50, pageHeight - 20);
    }

    doc.save(`${selectedSOP.sop_id}_SOP_${selectedSOP.title.replace(/\s+/g, '_')}.pdf`);
  };

  const sampleBashPipeline = `#/usr/bin/bash
# ASTRO LAB FAB - Enterprise Startup Execution Pipeline
echo "===========================ASTRO LAB FAB STARTUP ENGINE=============================="
cal && date && pwd && whoami && curl ifconfig.io

# Process Financial Ledger & Run Valuation Rubric
python3 -c "import json; print('Auditing Financial Ledger & LTV:CAC Ratio...')"
curl -X POST http://localhost:3000/api/gemini/step-execute \\
  -H "Content-Type: application/json" \\
  -d '{"stepNumber": 1, "stepName": "Identify a problem to solve", "phaseName": "Phase 1: Idea Development"}'

echo "===================== Execution Pipeline Completed ====================="`;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bento-card p-6 relative overflow-hidden">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#08090a] text-[#00ff9d] border border-[#00ff9d]/30 text-xs font-mono uppercase tracking-wider">
            <FileCode2 className="w-3.5 h-3.5 text-[#00ff9d]" /> Enterprise SOPs & CLI Automation Library
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Standard Operating Procedures (SOPs) & CLI Prompts
          </h2>
          <p className="text-xs text-[#888e96]">
            Executable SOP blueprints mapped to local AI models (Ollama deepseek-coder/qwen2.5) and Gemini server endpoints for automated data ingestion, SOW audits, and tax processing.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SOP Selector List */}
        <div className="bento-card p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 border-b border-[#1f2228] pb-3 font-mono">
            <Terminal className="w-4 h-4 text-[#00ff9d]" /> Operational SOP Blueprints
          </h3>

          <div className="space-y-2">
            {INITIAL_SOPS.map((sop) => {
              const isSelected = selectedSOP.sop_id === sop.sop_id;
              return (
                <button
                  key={sop.sop_id}
                  onClick={() => setSelectedSOP(sop)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-[#00ff9d] border-[#00ff9d] text-[#08090a] font-bold shadow-[0_0_10px_rgba(0,255,157,0.25)]'
                      : 'bg-[#08090a] border-[#1f2228] text-slate-300 hover:border-[#00ff9d]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold uppercase bg-[#08090a] px-2 py-0.5 rounded border border-[#1f2228]">
                      {sop.sop_id}
                    </span>
                    <span className="text-[10px] font-mono opacity-80">{sop.category}</span>
                  </div>
                  <div className="text-xs font-bold">{sop.title}</div>
                </button>
              );
            })}
          </div>

          {/* Bash Script Reference Box */}
          <div className="pt-4 border-t border-[#1f2228] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-amber-400" /> Bash Engine Script
              </span>
              <button
                onClick={() => handleCopy(sampleBashPipeline, 'bash')}
                className="text-[10px] font-mono text-[#888e96] hover:text-white flex items-center gap-1"
              >
                {copiedSnippet === 'bash' ? <Check className="w-3 h-3 text-[#00ff9d]" /> : <Copy className="w-3 h-3" />}
                {copiedSnippet === 'bash' ? 'Copied' : 'Copy'}
              </button>
            </div>

            <pre className="bg-[#08090a] border border-[#1f2228] p-3 rounded-xl text-[10px] font-mono text-[#00ff9d] overflow-x-auto leading-relaxed max-h-48">
              {sampleBashPipeline}
            </pre>
          </div>
        </div>

        {/* Selected SOP Viewer */}
        <div className="lg:col-span-2 bento-card p-6 space-y-6">
          
          <div className="border-b border-[#1f2228] pb-4 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-[#00ff9d] text-[#08090a] px-2.5 py-0.5 rounded">
                  {selectedSOP.sop_id}
                </span>
                <span className="text-xs font-mono font-semibold text-[#888e96] uppercase">
                  {selectedSOP.category}
                </span>
              </div>

              <button
                onClick={handleDownloadPDF}
                className="px-3 py-1.5 bg-[#00ff9d] hover:bg-[#00ff9d]/90 text-[#08090a] text-xs font-mono font-bold rounded-lg flex items-center gap-1.5 transition-all shadow shrink-0 self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5" /> Download as PDF
              </button>
            </div>

            <h3 className="text-lg font-bold text-white">{selectedSOP.title}</h3>
            <p className="text-xs text-[#888e96]">{selectedSOP.objective}</p>
          </div>

          {/* Prerequisites & Tools */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-[#08090a] p-4 rounded-xl border border-[#1f2228] space-y-1.5">
              <span className="font-mono font-bold text-slate-200 block uppercase text-[11px]">Required Prerequisites:</span>
              <ul className="list-disc list-inside text-[#888e96] space-y-1 text-[11px]">
                {selectedSOP.prerequisites.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>

            <div className="bg-[#08090a] p-4 rounded-xl border border-[#1f2228] space-y-1.5">
              <span className="font-mono font-bold text-slate-200 block uppercase text-[11px]">Tools Required:</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedSOP.tools.map((t, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-[#121417] border border-[#1f2228] text-[#00ff9d] px-2 py-0.5 rounded font-mono"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Step-by-Step Instructions */}
          <div className="space-y-4">
            <h4 className="font-mono font-bold text-xs uppercase text-[#888e96] tracking-wider flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-[#00ff9d]" /> Operational Step-by-Step Procedure
            </h4>

            <div className="space-y-3">
              {selectedSOP.detailed_steps.map((st) => (
                <div
                  key={st.step_number}
                  className="bg-[#08090a] border border-[#1f2228] p-4 rounded-xl space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#00ff9d] text-[#08090a] font-bold text-xs flex items-center justify-center font-mono">
                      {st.step_number}
                    </span>
                    <span className="font-bold text-xs text-white">{st.step_name}</span>
                  </div>

                  <ul className="list-disc list-inside text-xs text-[#888e96] space-y-1 pl-7">
                    {st.instructions.map((ins, idx) => (
                      <li key={idx}>{ins}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Output Deliverables */}
          <div className="pt-3 border-t border-[#1f2228] flex items-center justify-between text-xs">
            <span className="text-[#888e96] font-mono font-semibold">Expected Output Artifacts:</span>
            <div className="flex flex-wrap gap-2">
              {selectedSOP.outputs.map((out, i) => (
                <span
                  key={i}
                  className="bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30 px-2.5 py-0.5 rounded text-[11px] font-mono"
                >
                  {out}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
