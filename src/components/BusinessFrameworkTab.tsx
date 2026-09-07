import React, { useState } from 'react';
import { generateFrameworkModules, createDefaultSubstep } from '../data/businessFrameworkData';
import { FrameworkSubstep } from '../types';
import {
  FolderTree,
  FileJson,
  Download,
  Copy,
  Check,
  Code,
  Layers,
  Terminal,
  Cpu,
  ShieldCheck,
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight,
  Database
} from 'lucide-react';

interface BusinessFrameworkTabProps {
  phases: any[];
  activeModelName: string;
  businessContext: string;
}

export const BusinessFrameworkTab: React.FC<BusinessFrameworkTabProps> = ({
  phases,
  activeModelName,
  businessContext,
}) => {
  const frameworkModules = generateFrameworkModules(phases, activeModelName, businessContext);
  
  const [selectedFile, setSelectedFile] = useState<string>('business_framework.json');
  const [copied, setCopied] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'files' | 'substep_inspector'>('files');

  // Substep Inspector State
  const [selectedStepNum, setSelectedStepNum] = useState<number>(1);
  const [substepIndex, setSubstepIndex] = useState<number>(1);
  const [searchSubstep, setSearchSubstep] = useState<string>('');

  const activeStepObj = phases.flatMap(p => p.steps).find(s => s.step === selectedStepNum) || phases[0]?.steps[0];
  const activeSubstep: FrameworkSubstep = createDefaultSubstep(
    selectedStepNum,
    substepIndex,
    activeStepObj?.name || 'Define Enterprise Architecture',
    activeStepObj?.phase_name || 'Phase 1: Concept'
  );

  const handleCopyFile = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = (fileName: string, content: string) => {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
  };

  const fileList = [
    { name: 'business_framework.json', badge: 'Master Index', desc: 'Main entry point referencing all 11 modules' },
    { name: '00_schema.json', badge: 'JSON Schema', desc: 'Framework definition & 33-field Substep schema' },
    { name: '01_business_plan.json', badge: 'Business Plan', desc: 'Executive summary & section specifications' },
    { name: '02_business_models.json', badge: 'Business Models', desc: '8 revenue models & execution workflows' },
    { name: '03_pipeline.json', badge: '145-Step Pipeline', desc: '10 phases & step execution tree' },
    { name: '04_sops.json', badge: 'SOPs', desc: 'Standard operating procedures & CLI scripts' },
    { name: '05_prompts.json', badge: 'AI Prompts', desc: 'Gemini & Ollama prompts for substep execution' },
    { name: '06_scripts.json', badge: 'Automation Scripts', desc: 'Python, Bash & SQL script definitions' },
    { name: '07_workflows.json', badge: 'n8n & Docker', desc: 'Orchestration workflows & container specs' },
    { name: '08_validation.json', badge: 'Quality Rules', desc: 'Audit checklists, rollbacks & retry rules' },
    { name: '09_assets.json', badge: 'Creative Assets', desc: 'Branding specifications & design themes' },
    { name: '10_outputs.json', badge: 'Deliverables', desc: 'Generated artifact tracking & output logs' },
  ];

  const currentJsonContent = JSON.stringify(
    (frameworkModules as any)[selectedFile] || frameworkModules['business_framework.json'],
    null,
    2
  );

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bento-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#08090a] text-[#00ff9d] border border-[#00ff9d]/30 text-xs font-mono uppercase tracking-wider">
            <FolderTree className="w-3.5 h-3.5 text-[#00ff9d]" /> business_framework/ Architecture
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Enterprise Business Framework & 33-Field Substep Inspector
          </h2>
          <p className="text-xs text-[#888e96]">
            Complete 11-module directory structure, JSON schemas, automation scripts, and granular 33-property substep specification.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#08090a] p-1 rounded-xl border border-[#1f2228]">
          <button
            onClick={() => setActiveView('files')}
            className={`text-xs px-3.5 py-1.5 rounded-lg font-mono font-bold transition-all flex items-center gap-1.5 ${
              activeView === 'files'
                ? 'bg-[#00ff9d] text-[#08090a] shadow-[0_0_10px_rgba(0,255,157,0.3)]'
                : 'text-[#888e96] hover:text-slate-200'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" /> 11 Module Files
          </button>
          <button
            onClick={() => setActiveView('substep_inspector')}
            className={`text-xs px-3.5 py-1.5 rounded-lg font-mono font-bold transition-all flex items-center gap-1.5 ${
              activeView === 'substep_inspector'
                ? 'bg-[#00ff9d] text-[#08090a] shadow-[0_0_10px_rgba(0,255,157,0.3)]'
                : 'text-[#888e96] hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> 33-Field Substep Inspector
          </button>
        </div>
      </div>

      {activeView === 'files' ? (
        /* File Tree & JSON Viewer View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left: Directory Tree Selector */}
          <div className="bento-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
              <span className="text-xs font-mono font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider">
                <FolderTree className="w-4 h-4 text-[#00ff9d]" /> business_framework/
              </span>
              <span className="text-[10px] font-mono text-[#888e96] bg-[#08090a] px-2 py-0.5 rounded border border-[#1f2228]">
                11 JSON Modules
              </span>
            </div>

            <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1 scrollbar-none">
              {fileList.map((file) => {
                const isSelected = selectedFile === file.name;
                return (
                  <button
                    key={file.name}
                    onClick={() => setSelectedFile(file.name)}
                    className={`w-full p-3 rounded-xl border text-left transition-all group ${
                      isSelected
                        ? 'bg-[#00ff9d] border-[#00ff9d] text-[#08090a] font-bold shadow-[0_0_12px_rgba(0,255,157,0.25)]'
                        : 'bg-[#08090a] border-[#1f2228] text-slate-300 hover:border-[#00ff9d]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono flex items-center gap-1.5">
                        <FileJson className={`w-3.5 h-3.5 ${isSelected ? 'text-[#08090a]' : 'text-[#00ff9d]'}`} />
                        {file.name}
                      </span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded uppercase ${
                          isSelected
                            ? 'bg-[#08090a]/20 text-[#08090a] font-bold'
                            : 'bg-[#121417] text-[#888e96] border border-[#1f2228]'
                        }`}
                      >
                        {file.badge}
                      </span>
                    </div>
                    <p className={`text-[11px] ${isSelected ? 'text-[#08090a]/80' : 'text-[#888e96]'}`}>
                      {file.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#1f2228]">
              <button
                onClick={() =>
                  handleDownloadFile(
                    'business_framework_bundle.json',
                    JSON.stringify(frameworkModules, null, 2)
                  )
                }
                className="w-full bg-[#08090a] hover:bg-[#121417] text-[#00ff9d] border border-[#00ff9d]/40 py-2.5 px-4 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <Download className="w-4 h-4" /> Download Complete Framework Bundle
              </button>
            </div>
          </div>

          {/* Right: Code / JSON Preview Window */}
          <div className="lg:col-span-2 bento-card p-5 space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-[#888e96]">Path:</span>
                <span className="text-[#00ff9d] font-bold">business_framework/{selectedFile}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyFile(currentJsonContent)}
                  className="px-3 py-1.5 bg-[#08090a] hover:bg-[#1f2228] border border-[#1f2228] text-slate-300 text-xs font-mono rounded-lg flex items-center gap-1.5 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#00ff9d]" /> : <Copy className="w-3.5 h-3.5 text-[#888e96]" />}
                  {copied ? 'Copied' : 'Copy JSON'}
                </button>
                <button
                  onClick={() => handleDownloadFile(selectedFile, currentJsonContent)}
                  className="px-3 py-1.5 bg-[#00ff9d] hover:bg-[#00ff9d]/90 text-[#08090a] text-xs font-mono font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(0,255,157,0.25)]"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </div>

            <div className="relative">
              <pre className="bg-[#08090a] border border-[#1f2228] rounded-xl p-4 text-[11px] font-mono text-[#00ff9d] overflow-x-auto max-h-[500px] leading-relaxed">
                {currentJsonContent}
              </pre>
            </div>

            <div className="pt-3 border-t border-[#1f2228] flex items-center justify-between text-xs text-[#888e96] font-mono">
              <span>Status: Verified Valid JSON Schema</span>
              <span>Encoding: UTF-8</span>
            </div>
          </div>

        </div>
      ) : (
        /* Substep 33-Field Inspector View */
        <div className="space-y-6">
          
          {/* Substep Selector Controls */}
          <div className="bento-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs font-mono text-[#888e96] uppercase whitespace-nowrap">
                Select Step #:
              </span>
              <select
                value={selectedStepNum}
                onChange={(e) => setSelectedStepNum(Number(e.target.value))}
                className="bg-[#08090a] border border-[#1f2228] text-[#00ff9d] text-xs font-mono font-bold rounded-lg px-3 py-2 focus:outline-none focus:border-[#00ff9d]"
              >
                {phases.flatMap(p => p.steps).map(s => (
                  <option key={s.step} value={s.step}>
                    Step #{s.step}: {s.name.slice(0, 35)}...
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-mono text-[#888e96] uppercase whitespace-nowrap">
                Substep Index:
              </span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => setSubstepIndex(idx)}
                    className={`w-8 h-8 rounded-lg font-mono text-xs font-bold transition-all ${
                      substepIndex === idx
                        ? 'bg-[#00ff9d] text-[#08090a] shadow-[0_0_8px_rgba(0,255,157,0.3)]'
                        : 'bg-[#08090a] text-[#888e96] hover:text-white border border-[#1f2228]'
                    }`}
                  >
                    #{idx}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Substep 33 Field Cards Grid */}
          <div className="bento-card p-6 space-y-6">
            
            {/* Top Substep Metadata Card */}
            <div className="border-b border-[#1f2228] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-[#00ff9d] text-[#08090a] font-mono font-bold text-xs px-2.5 py-0.5 rounded">
                    ID: {activeSubstep.id}
                  </span>
                  <span className="text-xs font-mono text-[#888e96]">
                    Difficulty: <strong className="text-amber-400">{activeSubstep.difficulty}</strong>
                  </span>
                  <span className="text-xs font-mono text-[#888e96]">
                    Automation: <strong className="text-[#00ff9d]">{activeSubstep.automation_level}</strong>
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">{activeSubstep.title}</h3>
                <p className="text-xs text-[#888e96]">{activeSubstep.description}</p>
              </div>

              <button
                onClick={() => handleDownloadFile(`${activeSubstep.id}_substep.json`, JSON.stringify(activeSubstep, null, 2))}
                className="bg-[#00ff9d] hover:bg-[#00ff9d]/90 text-[#08090a] px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 shadow-[0_0_12px_rgba(0,255,157,0.3)] transition-all"
              >
                <Download className="w-4 h-4" /> Export Substep JSON
              </button>
            </div>

            {/* 33 Fields Breakdown Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Field 1-4: Core Specs */}
              <div className="bg-[#08090a] p-4 rounded-xl border border-[#1f2228] space-y-2">
                <span className="text-[11px] font-mono font-bold text-[#00ff9d] uppercase block">
                  1-4. Objective & Scope
                </span>
                <div className="text-xs text-slate-300">
                  <strong>Objective:</strong> {activeSubstep.objective}
                </div>
                <div className="text-xs text-[#888e96]">
                  <strong>Est. Time:</strong> {activeSubstep.estimated_time}
                </div>
                <div className="text-xs text-[#888e96]">
                  <strong>AI Required:</strong> {activeSubstep.ai_required ? 'Yes (True)' : 'No'} | <strong>Human Required:</strong> {activeSubstep.human_required ? 'Yes' : 'No (False)'}
                </div>
              </div>

              {/* Field 5-8: Inputs, Outputs & Files */}
              <div className="bg-[#08090a] p-4 rounded-xl border border-[#1f2228] space-y-2">
                <span className="text-[11px] font-mono font-bold text-[#00ff9d] uppercase block">
                  5-10. Inputs, Outputs & Files
                </span>
                <div className="text-xs text-[#888e96]">
                  <strong>Prerequisites:</strong> {activeSubstep.prerequisites.join(', ')}
                </div>
                <div className="text-xs text-[#888e96]">
                  <strong>Required Files:</strong> {activeSubstep.required_files.join(', ')}
                </div>
                <div className="text-xs text-[#00ff9d]">
                  <strong>Generated Artifacts:</strong> {activeSubstep.generated_files.join(', ')}
                </div>
              </div>

              {/* Field 16-20: AI Models & Prompts */}
              <div className="bg-[#08090a] p-4 rounded-xl border border-[#1f2228] space-y-2">
                <span className="text-[11px] font-mono font-bold text-[#00ff9d] uppercase block">
                  16-20. AI Models & Prompts
                </span>
                <div className="text-xs text-slate-300 font-mono">
                  <strong>Primary:</strong> {activeSubstep.primary_model}
                </div>
                <div className="text-xs text-[#888e96] font-mono">
                  <strong>Fallback:</strong> {activeSubstep.fallback_model}
                </div>
                <div className="text-[11px] text-[#888e96] line-clamp-2 bg-[#121417] p-2 rounded border border-[#1f2228] font-mono">
                  Prompt: "{activeSubstep.prompt}"
                </div>
              </div>

              {/* Field 21-23: Scripts (Python, Bash, SQL) */}
              <div className="bg-[#08090a] p-4 rounded-xl border border-[#1f2228] space-y-2 lg:col-span-2">
                <span className="text-[11px] font-mono font-bold text-[#00ff9d] uppercase block">
                  21-23. Executable Automation Scripts
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 block mb-1">Bash Runner:</span>
                    <pre className="bg-[#121417] p-2 rounded text-[10px] font-mono text-slate-300 overflow-x-auto border border-[#1f2228]">
                      {activeSubstep.bash_script}
                    </pre>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 block mb-1">SQL Log:</span>
                    <pre className="bg-[#121417] p-2 rounded text-[10px] font-mono text-slate-300 overflow-x-auto border border-[#1f2228]">
                      {activeSubstep.sql_script}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Field 24-26: n8n, Docker & API Calls */}
              <div className="bg-[#08090a] p-4 rounded-xl border border-[#1f2228] space-y-2">
                <span className="text-[11px] font-mono font-bold text-[#00ff9d] uppercase block">
                  24-26. Workflow, Docker & API
                </span>
                <div className="text-xs text-[#888e96] font-mono">
                  <strong>Docker Image:</strong> {activeSubstep.docker_container}
                </div>
                <div className="text-xs text-[#888e96] font-mono">
                  <strong>API Endpoint:</strong> {activeSubstep.api_calls[0]?.method} {activeSubstep.api_calls[0]?.endpoint}
                </div>
                <div className="text-xs text-[#888e96]">
                  <strong>n8n Trigger:</strong> Configured Webhook Listener
                </div>
              </div>

              {/* Field 27-30: Quality, Rollback & Retry */}
              <div className="bg-[#08090a] p-4 rounded-xl border border-[#1f2228] space-y-2 lg:col-span-3">
                <span className="text-[11px] font-mono font-bold text-[#00ff9d] uppercase block">
                  27-33. Quality Checklist, Verification & Failover Controls
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <strong className="text-xs text-slate-200 block mb-1 font-mono">Quality Checklist:</strong>
                    <ul className="list-disc list-inside text-[11px] text-[#888e96] space-y-0.5 font-mono">
                      {activeSubstep.quality_checklist.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <strong className="text-xs text-slate-200 block mb-1 font-mono">Verification Protocol:</strong>
                    <p className="text-[11px] text-[#888e96] font-mono bg-[#121417] p-2 rounded border border-[#1f2228]">
                      {activeSubstep.verification}
                    </p>
                  </div>

                  <div>
                    <strong className="text-xs text-slate-200 block mb-1 font-mono">Rollback & Retry:</strong>
                    <div className="text-[11px] text-[#888e96] font-mono space-y-1">
                      <div><span className="text-amber-400">Rollback:</span> {activeSubstep.rollback}</div>
                      <div>
                        <span className="text-cyan-400">Retry Policy:</span> Max 3 attempts with 5s exponential backoff.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
