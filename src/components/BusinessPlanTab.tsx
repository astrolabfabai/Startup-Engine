import React, { useState } from 'react';
import { BUSINESS_MODELS, BUSINESS_PLAN_SECTIONS } from '../data/startupData';
import { BusinessModel, BusinessPlanSection } from '../types';
import {
  Briefcase,
  FileText,
  CheckCircle2,
  AlertOctagon,
  Workflow,
  Sparkles,
  Copy,
  Download,
  RotateCcw,
  BookOpen,
  Layers,
  Zap,
} from 'lucide-react';

interface BusinessPlanTabProps {
  activeModelName: string;
  setActiveModelName: (modelName: string) => void;
}

export const BusinessPlanTab: React.FC<BusinessPlanTabProps> = ({
  activeModelName,
  setActiveModelName,
}) => {
  const [activeTabMode, setActiveTabMode] = useState<'models' | 'plan_generator'>('models');
  
  // Multi-Model Selection State
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([
    BUSINESS_MODELS.find(m => m.model_name === activeModelName)?.model_id || BUSINESS_MODELS[0].model_id
  ]);

  // Multi-Section Selection State
  const [selectedSectionIds, setSelectedSectionIds] = useState<string[]>([
    BUSINESS_PLAN_SECTIONS[0].section_id
  ]);

  const [selectedSection, setSelectedSection] = useState<BusinessPlanSection>(
    BUSINESS_PLAN_SECTIONS[0]
  );

  const [businessName, setBusinessName] = useState('ASTRO LAB FAB');
  const [industry, setIndustry] = useState('Enterprise Artificial Intelligence & Autonomous Systems');
  const [problem, setProblem] = useState('Fragmented business execution, manual SOPs, and slow time-to-market for enterprise initiatives.');
  const [solution, setSolution] = useState('A 145-step autonomous business execution engine with algorithmic valuation rubrics and AI asset pipelines.');
  const [targetMarket, setTargetMarket] = useState('Venture Studios, Enterprise Strategy Teams, and Tech Founders ($2.5B SAM).');

  const [loading, setLoading] = useState(false);
  const [batchProgress, setBatchProgress] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const toggleModelSelection = (modelId: string, modelName: string) => {
    setSelectedModelIds(prev => {
      const exists = prev.includes(modelId);
      const updated = exists ? prev.filter(id => id !== modelId) : [...prev, modelId];
      if (updated.length === 0) return [modelId];
      return updated;
    });
    setActiveModelName(modelName);
  };

  const toggleSectionSelection = (sectionId: string) => {
    setSelectedSectionIds(prev => {
      const exists = prev.includes(sectionId);
      const updated = exists ? prev.filter(id => id !== sectionId) : [...prev, sectionId];
      if (updated.length === 0) return [sectionId];
      return updated;
    });
    const sec = BUSINESS_PLAN_SECTIONS.find(s => s.section_id === sectionId);
    if (sec) setSelectedSection(sec);
  };

  const selectAllSections = () => {
    if (selectedSectionIds.length === BUSINESS_PLAN_SECTIONS.length) {
      setSelectedSectionIds([BUSINESS_PLAN_SECTIONS[0].section_id]);
    } else {
      setSelectedSectionIds(BUSINESS_PLAN_SECTIONS.map(s => s.section_id));
    }
  };

  const handleGenerateSection = async (sec: BusinessPlanSection) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gemini/business-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionId: sec.section_id,
          sectionName: sec.section_name,
          businessName,
          industry,
          problem,
          solution,
          targetMarket,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate business plan section');
      }

      setGeneratedContent((prev) => ({
        ...prev,
        [sec.section_id]: data.output,
      }));
    } catch (err: any) {
      setError(err.message || 'Error generating section');
    } finally {
      setLoading(false);
    }
  };

  const handleBatchGenerateSelected = async () => {
    setLoading(true);
    setError(null);
    const targetSections = BUSINESS_PLAN_SECTIONS.filter(s => selectedSectionIds.includes(s.section_id));
    
    try {
      for (let i = 0; i < targetSections.length; i++) {
        const sec = targetSections[i];
        setBatchProgress(`Drafting ${sec.section_id}: ${sec.section_name} (${i + 1}/${targetSections.length})...`);
        
        const res = await fetch('/api/gemini/business-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sectionId: sec.section_id,
            sectionName: sec.section_name,
            businessName,
            industry,
            problem,
            solution,
            targetMarket,
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setGeneratedContent((prev) => ({
            ...prev,
            [sec.section_id]: data.output,
          }));
        }
      }
    } catch (err: any) {
      setError(err.message || 'Error running batch generation');
    } finally {
      setLoading(false);
      setBatchProgress(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Sub-Header Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1f2228] pb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#00ff9d]" /> Business Models & Formal Business Plan
          </h2>
          <p className="text-xs text-[#888e96] mt-0.5">
            Select single or multi-archetype business models to synthesize hybrid enterprise structures.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[#08090a] p-1 rounded-xl border border-[#1f2228]">
          <button
            onClick={() => setActiveTabMode('models')}
            className={`text-xs px-3.5 py-1.5 rounded-lg font-mono font-bold transition-colors ${
              activeTabMode === 'models'
                ? 'bg-[#00ff9d] text-[#08090a] shadow-[0_0_10px_rgba(0,255,157,0.3)]'
                : 'text-[#888e96] hover:text-slate-200'
            }`}
          >
            Business Models ({selectedModelIds.length})
          </button>

          <button
            onClick={() => setActiveTabMode('plan_generator')}
            className={`text-xs px-3.5 py-1.5 rounded-lg font-mono font-bold transition-colors ${
              activeTabMode === 'plan_generator'
                ? 'bg-[#00ff9d] text-[#08090a] shadow-[0_0_10px_rgba(0,255,157,0.3)]'
                : 'text-[#888e96] hover:text-slate-200'
            }`}
          >
            Plan Generator ({selectedSectionIds.length} Selected)
          </button>
        </div>
      </div>

      {/* MODE 1: BUSINESS MODEL LIBRARY (MULTI-SELECT ARCHETYPES) */}
      {activeTabMode === 'models' && (
        <div className="space-y-6">
          {selectedModelIds.length > 1 && (
            <div className="bg-[#00ff9d]/10 border border-[#00ff9d]/30 p-4 rounded-xl flex items-center justify-between font-mono text-xs text-white">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#00ff9d]" />
                <span>
                  <strong>Hybrid Architecture Active:</strong> Combining {selectedModelIds.length} business archetypes (
                  {BUSINESS_MODELS.filter(m => selectedModelIds.includes(m.model_id)).map(m => m.model_name).join(' + ')}
                  ).
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BUSINESS_MODELS.map((model) => {
              const isSelected = selectedModelIds.includes(model.model_id);
              return (
                <div
                  key={model.model_id}
                  onClick={() => toggleModelSelection(model.model_id, model.model_name)}
                  className={`bento-card p-6 flex flex-col justify-between space-y-4 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#00ff9d] bg-[#00ff9d]/5 shadow-[0_0_12px_rgba(0,255,157,0.15)] ring-1 ring-[#00ff9d]'
                      : 'border-[#1f2228] hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                          isSelected ? 'bg-[#00ff9d] text-black font-bold' : 'bg-[#121417] border border-[#1f2228]'
                        }`}>
                          {isSelected ? '✓' : ''}
                        </span>
                        <span className="text-[10px] font-mono font-bold uppercase bg-[#08090a] text-[#00ff9d] px-2 py-0.5 rounded border border-[#00ff9d]/30">
                          {model.model_id}
                        </span>
                      </div>
                      {isSelected && (
                        <span className="text-[10px] font-mono font-bold bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30 px-2 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Selected Model
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white">{model.model_name}</h3>
                    <p className="text-xs text-[#888e96] leading-relaxed">{model.definition}</p>

                    <div className="bg-[#08090a] p-3 rounded-xl border border-[#1f2228] text-xs text-[#888e96]">
                      <span className="font-mono font-semibold text-slate-200 uppercase">When to use: </span>
                      {model.when_to_use}
                    </div>

                    {/* Advantages vs Risks */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                      <div className="space-y-1">
                        <span className="font-bold text-[#00ff9d] flex items-center gap-1 text-[11px] font-mono uppercase">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Advantages
                        </span>
                        <ul className="space-y-1 text-slate-300 list-disc list-inside text-[11px]">
                          {model.advantages.map((adv, i) => (
                            <li key={i}>{adv}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-1">
                        <span className="font-bold text-rose-400 flex items-center gap-1 text-[11px] font-mono uppercase">
                          <AlertOctagon className="w-3.5 h-3.5" /> Risks & Liabilities
                        </span>
                        <ul className="space-y-1 text-slate-300 list-disc list-inside text-[11px]">
                          {model.risks.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#1f2228] flex items-center justify-between">
                    <span className="text-[11px] text-[#888e96] font-mono">
                      SOPs: {model.sop_references.join(', ')}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleModelSelection(model.model_id, model.model_name);
                      }}
                      className={`text-xs px-4 py-2 rounded-xl font-bold font-mono transition-all ${
                        isSelected
                          ? 'bg-[#00ff9d] text-[#08090a]'
                          : 'bg-[#08090a] hover:bg-[#121417] text-slate-200 border border-[#1f2228] hover:border-[#00ff9d]/40'
                      }`}
                    >
                      {isSelected ? 'Active Model' : 'Select Model'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 2: BUSINESS PLAN SECTION GENERATOR (MULTI-SECTION BATCH GENERATION) */}
      {activeTabMode === 'plan_generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Section Selector & Form */}
          <div className="bento-card p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00ff9d]" /> Plan Sections ({selectedSectionIds.length}/{BUSINESS_PLAN_SECTIONS.length})
              </h3>
              <button
                onClick={selectAllSections}
                className="text-[10px] font-mono text-[#00ff9d] hover:underline"
              >
                {selectedSectionIds.length === BUSINESS_PLAN_SECTIONS.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            {/* Sections Pills */}
            <div className="space-y-2">
              {BUSINESS_PLAN_SECTIONS.map((sec) => {
                const isSelected = selectedSectionIds.includes(sec.section_id);
                const isCurrentViewing = selectedSection.section_id === sec.section_id;
                const hasGenerated = !!generatedContent[sec.section_id];
                return (
                  <div
                    key={sec.section_id}
                    onClick={() => toggleSectionSelection(sec.section_id)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isCurrentViewing
                        ? 'bg-[#00ff9d] border-[#00ff9d] text-[#08090a] font-bold shadow-[0_0_10px_rgba(0,255,157,0.25)]'
                        : isSelected
                        ? 'bg-[#00ff9d]/15 border-[#00ff9d]/50 text-white'
                        : 'bg-[#08090a] border-[#1f2228] text-slate-300 hover:border-[#00ff9d]/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] ${
                        isSelected ? (isCurrentViewing ? 'bg-black text-white font-bold' : 'bg-[#00ff9d] text-black font-bold') : 'bg-[#121417] border border-[#1f2228]'
                      }`}>
                        {isSelected ? '✓' : ''}
                      </span>
                      <div>
                        <div className="text-[10px] font-mono opacity-80">{sec.section_id}</div>
                        <div className="text-xs font-bold">{sec.section_name}</div>
                      </div>
                    </div>
                    {hasGenerated && (
                      <span className={`text-[10px] px-2 py-0.5 rounded border font-mono ${
                        isCurrentViewing ? 'bg-black text-[#00ff9d] border-black' : 'bg-[#08090a] text-[#00ff9d] border-[#00ff9d]/30'
                      }`}>
                        Drafted
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Business Plan Context Input */}
            <div className="space-y-3 pt-2 border-t border-[#1f2228]">
              <div>
                <label className="text-xs font-mono text-[#888e96] block mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-[#08090a] border border-[#1f2228] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00ff9d]"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#888e96] block mb-1">
                  Industry / Market
                </label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-[#08090a] border border-[#1f2228] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00ff9d]"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#888e96] block mb-1">
                  Problem Solved
                </label>
                <textarea
                  rows={2}
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  className="w-full bg-[#08090a] border border-[#1f2228] rounded-xl p-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#00ff9d]"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#888e96] block mb-1">
                  Solution Provided
                </label>
                <textarea
                  rows={2}
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  className="w-full bg-[#08090a] border border-[#1f2228] rounded-xl p-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#00ff9d]"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleGenerateSection(selectedSection)}
                disabled={loading}
                className="w-full bg-[#00ff9d] hover:bg-[#00ff9d]/90 text-[#08090a] font-bold font-mono text-xs py-3 rounded-xl shadow-[0_0_12px_rgba(0,255,157,0.3)] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading && !batchProgress ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" /> Drafting {selectedSection.section_id}...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Draft {selectedSection.section_name}
                  </>
                )}
              </button>

              {selectedSectionIds.length > 1 && (
                <button
                  onClick={handleBatchGenerateSelected}
                  disabled={loading}
                  className="w-full bg-[#121417] hover:bg-[#1f2228] text-cyan-300 border border-cyan-400/30 font-bold font-mono text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {batchProgress ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5 animate-spin" /> {batchProgress}
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5" /> Batch Draft All {selectedSectionIds.length} Selected Sections
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Section Output Reader */}
          <div className="lg:col-span-2 bento-card p-6 flex flex-col justify-between space-y-4">
            
            <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
              <div>
                <div className="text-[10px] font-mono text-[#00ff9d] uppercase font-bold">
                  {selectedSection.section_id}
                </div>
                <h3 className="font-bold text-base text-slate-100">
                  {selectedSection.section_name}
                </h3>
              </div>

              {generatedContent[selectedSection.section_id] && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedContent[selectedSection.section_id]);
                  }}
                  className="px-3 py-1.5 bg-[#08090a] hover:bg-[#121417] text-slate-200 text-xs font-mono rounded-lg flex items-center gap-1.5 border border-[#1f2228]"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Section
                </button>
              )}
            </div>

            <div className="flex-1 bg-[#08090a] border border-[#1f2228] rounded-xl p-5 overflow-y-auto max-h-[550px]">
              {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-mono">
                  {error}
                </div>
              )}

              {generatedContent[selectedSection.section_id] ? (
                <div className="text-slate-200 text-xs space-y-3 font-mono whitespace-pre-wrap leading-relaxed">
                  {generatedContent[selectedSection.section_id]}
                </div>
              ) : (
                <div className="h-full min-h-[350px] flex flex-col items-center justify-center text-center text-[#888e96] space-y-2 font-mono">
                  <BookOpen className="w-10 h-10 text-[#1f2228]" />
                  <p className="text-xs font-semibold text-slate-300">
                    {selectedSection.section_name} Not Drafted Yet
                  </p>
                  <p className="text-[11px] text-[#888e96] max-w-sm">
                    {selectedSection.purpose}
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
