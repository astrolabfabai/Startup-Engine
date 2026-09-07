import React, { useState } from 'react';
import {
  FileDown,
  X,
  CheckSquare,
  Square,
  FileText,
  Building,
  Scale,
  Award,
  Layers,
  Sparkles,
  ShieldAlert,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { StartupPhase } from '../types';
import { generateMasterPdf } from '../services/masterPdfExport';

interface MasterPdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
  activeModelName: string;
  overallScore: number;
  completedStepsCount: number;
  totalStepsCount: number;
  phases: StartupPhase[];
}

export const MasterPdfExportModal: React.FC<MasterPdfExportModalProps> = ({
  isOpen,
  onClose,
  businessName = 'ASTRO LAB FAB',
  activeModelName,
  overallScore,
  completedStepsCount,
  totalStepsCount,
  phases,
}) => {
  const [includeCoverPage, setIncludeCoverPage] = useState(true);
  const [includeBusinessPlan, setIncludeBusinessPlan] = useState(true);
  const [includeFrameworkRoadmap, setIncludeFrameworkRoadmap] = useState(true);
  const [includeTaxMatrix, setIncludeTaxMatrix] = useState(true);
  const [includeGrantsPipeline, setIncludeGrantsPipeline] = useState(true);
  const [includeSops, setIncludeSops] = useState(true);
  const [includeExitStrategy, setIncludeExitStrategy] = useState(true);

  const [confidentialityLevel, setConfidentialityLevel] = useState('HIGHLY CONFIDENTIAL — PROPRIETARY');
  const [preparedFor, setPreparedFor] = useState('Executive Leadership, Board of Directors & Lead Investors');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const safeBusinessName = businessName || 'ASTRO LAB FAB';

  // Calculate estimated page count
  const estimatedPages =
    (includeCoverPage ? 1 : 0) +
    (includeBusinessPlan ? 1 : 0) +
    (includeFrameworkRoadmap ? 1 : 0) +
    (includeTaxMatrix ? 1 : 0) +
    (includeGrantsPipeline ? 1 : 0) +
    (includeSops || includeExitStrategy ? 1 : 0);

  const handleGeneratePdf = () => {
    setIsGenerating(true);
    setIsSuccess(false);

    setTimeout(() => {
      try {
        const doc = generateMasterPdf({
          businessName: safeBusinessName,
          activeModelName,
          overallScore,
          completedStepsCount,
          totalStepsCount,
          phases,
          includeCoverPage,
          includeBusinessPlan,
          includeFrameworkRoadmap,
          includeTaxMatrix,
          includeGrantsPipeline,
          includeSops,
          includeExitStrategy,
          confidentialityLevel,
          preparedFor,
        });

        const sanitizedName = safeBusinessName.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
        const dateStr = new Date().toISOString().slice(0, 10);
        doc.save(`${sanitizedName}_master_dossier_${dateStr}.pdf`);

        setIsSuccess(true);
        setTimeout(() => {
          setIsGenerating(false);
        }, 800);
      } catch (err) {
        console.error('Failed to generate master PDF', err);
        alert('Failed to generate PDF. Please try again.');
        setIsGenerating(false);
      }
    }, 400);
  };

  const sectionsList = [
    {
      id: 'cover',
      title: 'Executive Cover & Dossier Summary',
      desc: 'Corporate metadata, valuation index, active architecture model, and executive sign-off blocks.',
      checked: includeCoverPage,
      toggle: () => setIncludeCoverPage(!includeCoverPage),
      icon: Building,
    },
    {
      id: 'plan',
      title: 'Strategic Business Plan & 3-Year Pro Forma',
      desc: 'Value proposition, TAM/SAM/SOM, unit economics, and pro forma revenue & margin breakdown.',
      checked: includeBusinessPlan,
      toggle: () => setIncludeBusinessPlan(!includeBusinessPlan),
      icon: FileText,
    },
    {
      id: 'framework',
      title: 'Master Framework Lifecycle & Decision Gates',
      desc: 'Step-by-step milestone execution audit across Phases 1-5 with GO/REVISE decision criteria.',
      checked: includeFrameworkRoadmap,
      toggle: () => setIncludeFrameworkRoadmap(!includeFrameworkRoadmap),
      icon: Layers,
    },
    {
      id: 'tax',
      title: "Mark's Tax & Legal Blueprint Matrix",
      desc: 'Operating S-Corp vs Holding Trust, Section 179 depreciation, and Self-Employment tax shield calculations.',
      checked: includeTaxMatrix,
      toggle: () => setIncludeTaxMatrix(!includeTaxMatrix),
      icon: Scale,
    },
    {
      id: 'grants',
      title: 'Federal Grants & Playwright Bot Manifest',
      desc: 'Active SBA/NSF/DOE grant matches, ceiling amounts, deadlines, and cryptographic Form 8821 bot credentials.',
      checked: includeGrantsPipeline,
      toggle: () => setIncludeGrantsPipeline(!includeGrantsPipeline),
      icon: Award,
    },
    {
      id: 'sops',
      title: 'Core SOPs & Autonomous Build-to-Sale Exit',
      desc: 'Repeatable operational SOPs, 10x-20x multiple arbitrage, and virtual data room M&A acquisition profile.',
      checked: includeSops && includeExitStrategy,
      toggle: () => {
        const nextVal = !(includeSops && includeExitStrategy);
        setIncludeSops(nextVal);
        setIncludeExitStrategy(nextVal);
      },
      icon: Sparkles,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-[#121417] border border-[#1f2228] w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#1f2228] bg-[#08090a]/90 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#00ff9d]/10 border border-[#00ff9d]/30 text-[#00ff9d]">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                Export Master Enterprise Dossier (PDF)
              </h2>
              <p className="text-xs text-[#888e96] mt-0.5">
                Generate an official, multi-page, print-ready executive PDF for <span className="text-white font-bold">{safeBusinessName}</span>.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 text-[#888e96] hover:text-white hover:bg-white/10 border border-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#0a0c0f]">
          
          {/* Document Metadata Form */}
          <div className="p-4 rounded-xl bg-[#121417] border border-[#1f2228] space-y-3">
            <h3 className="text-xs font-bold font-mono text-[#00ff9d] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" /> Document Classification & Target Audience
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-[#888e96] mb-1">
                  Confidentiality Banner
                </label>
                <input
                  type="text"
                  value={confidentialityLevel}
                  onChange={(e) => setConfidentialityLevel(e.target.value)}
                  className="w-full bg-[#08090a] border border-[#1f2228] focus:border-[#00ff9d] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#888e96] mb-1">
                  Prepared For / Recipient
                </label>
                <input
                  type="text"
                  value={preparedFor}
                  onChange={(e) => setPreparedFor(e.target.value)}
                  className="w-full bg-[#08090a] border border-[#1f2228] focus:border-[#00ff9d] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section Selection */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold font-mono text-[#888e96] uppercase tracking-wider">
                Include Document Sections ({estimatedPages} Pages Total)
              </h3>
              <div className="flex items-center gap-2 text-xs font-mono">
                <button
                  onClick={() => {
                    setIncludeCoverPage(true);
                    setIncludeBusinessPlan(true);
                    setIncludeFrameworkRoadmap(true);
                    setIncludeTaxMatrix(true);
                    setIncludeGrantsPipeline(true);
                    setIncludeSops(true);
                    setIncludeExitStrategy(true);
                  }}
                  className="text-[#00ff9d] hover:underline"
                >
                  Select All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {sectionsList.map((sec) => {
                const IconComponent = sec.icon;
                return (
                  <div
                    key={sec.id}
                    onClick={sec.toggle}
                    className={`p-3 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3 ${
                      sec.checked
                        ? 'bg-[#121417] border-[#00ff9d]/40 shadow-[0_0_10px_rgba(0,255,157,0.08)]'
                        : 'bg-[#0a0c0f] border-[#1f2228] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0 text-[#00ff9d]">
                      {sec.checked ? (
                        <CheckSquare className="w-4 h-4" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <IconComponent className="w-3.5 h-3.5 text-[#00ff9d] shrink-0" />
                        <h4 className="text-xs font-bold text-white tracking-tight truncate">
                          {sec.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-[#888e96] mt-1 leading-snug">
                        {sec.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Export Specifications Pill */}
          <div className="p-3 rounded-xl bg-[#08090a] border border-[#1f2228] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#888e96]">
            <div className="flex items-center gap-4">
              <span>Format: <strong className="text-white">PDF (A4 High-Res Vector)</strong></span>
              <span>Estimated Size: <strong className="text-white">~350 KB</strong></span>
              <span>Security: <strong className="text-[#00ff9d]">Cryptographically Clean</strong></span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-6 border-t border-[#1f2228] bg-[#08090a] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#888e96] hover:text-white text-xs font-mono font-bold border border-white/10 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleGeneratePdf}
            disabled={isGenerating || estimatedPages === 0}
            className="px-5 py-2.5 rounded-xl bg-[#00ff9d] hover:bg-[#00e68d] text-black font-black text-xs font-mono uppercase tracking-tight transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,157,0.4)] disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Compiling {estimatedPages} Pages...</span>
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>PDF Exported!</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                <span>Download Master PDF ({estimatedPages} Pages)</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
