import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Download, 
  ExternalLink, 
  Zap, 
  Clock, 
  ShieldCheck, 
  Building, 
  ArrowRight,
  Eye,
  Check,
  AlertCircle
} from 'lucide-react';
import { 
  FUNDING_PAPERWORK_CATALOG, 
  FundingDocument, 
  generateFundingPacket, 
  ProcessedPacketResult 
} from '../data/fundingPaperworkData';

interface FundingPaperworkProcessorProps {
  industryName: string;
  industryId: string;
  grantFundingText: string;
  autoApplyOnDay1: boolean;
  onToggleAutoApply: (enabled: boolean) => void;
  selectedOfferingsCount?: number;
  selectedOfferingNames?: string[];
  onClose?: () => void;
}

export const FundingPaperworkProcessor: React.FC<FundingPaperworkProcessorProps> = ({
  industryName,
  industryId,
  grantFundingText,
  autoApplyOnDay1,
  onToggleAutoApply,
  selectedOfferingsCount = 25,
  selectedOfferingNames = [],
  onClose,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<FundingDocument | null>(FUNDING_PAPERWORK_CATALOG[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedPacket, setProcessedPacket] = useState<ProcessedPacketResult | null>(() => 
    generateFundingPacket(industryName, industryId, grantFundingText, autoApplyOnDay1, selectedOfferingNames)
  );
  const [showCopiedNotice, setShowCopiedNotice] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const categories = ['All', 'Federal Grant', 'SBIR/STTR', 'Compliance', 'Tax & Entity', 'SBA Loan', 'Investor & GTM'];

  const filteredDocs = filterCategory === 'All'
    ? FUNDING_PAPERWORK_CATALOG
    : FUNDING_PAPERWORK_CATALOG.filter(d => d.category === filterCategory);

  const handleProcessAll = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const result = generateFundingPacket(
        industryName,
        industryId,
        grantFundingText,
        autoApplyOnDay1,
        selectedOfferingNames
      );
      setProcessedPacket(result);
      setIsProcessing(false);
    }, 600);
  };

  const handleDownloadPacket = () => {
    if (!processedPacket) return;
    const blob = new Blob([JSON.stringify(processedPacket, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `federal-funding-packet-${industryId}-day1-${autoApplyOnDay1 ? 'enabled' : 'manual'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyText = (content: string) => {
    navigator.clipboard.writeText(content);
    setShowCopiedNotice(true);
    setTimeout(() => setShowCopiedNotice(false), 2000);
  };

  return (
    <div id="funding-paperwork-processor" className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 text-slate-100 shadow-2xl space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Federal Compliance Engine
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">
              12 Federal Forms Cataloged
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            Funding Documentation Automation Suite
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Auto-compiling federal grants, SBIR Phase I packets, SAM.gov UEI registrations, and SBA microloan forms for <span className="text-white font-medium">{industryName}</span>.
          </p>
        </div>

        {/* Global Controls: Auto Apply Toggle & Download */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Auto Apply Toggle */}
          <div className="flex items-center gap-3 bg-slate-800/90 border border-slate-700 px-3.5 py-2 rounded-xl">
            <div className="text-left">
              <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Zap className={`w-3.5 h-3.5 ${autoApplyOnDay1 ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
                Auto Apply on 1st Day
              </div>
              <div className="text-[11px] text-slate-400">
                {autoApplyOnDay1 ? 'Automatic submission queue ON' : 'Manual verification queue'}
              </div>
            </div>
            <button
              id="auto-apply-day1-toggle"
              onClick={() => onToggleAutoApply(!autoApplyOnDay1)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                autoApplyOnDay1 ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
              role="switch"
              aria-checked={autoApplyOnDay1}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  autoApplyOnDay1 ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Process / Re-generate Button */}
          <button
            id="process-all-docs-btn"
            onClick={handleProcessAll}
            disabled={isProcessing}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition shadow-lg shadow-emerald-950/40 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Clock className="w-3.5 h-3.5 animate-spin" />
                Compiling 12 Forms...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                Process All Paperwork
              </>
            )}
          </button>

          {/* Export / Download */}
          <button
            id="download-packet-btn"
            onClick={handleDownloadPacket}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            Download Packet (.JSON)
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition text-xs"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Scope Status Banner */}
      <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Building className="w-4 h-4 text-indigo-400" />
            <span>Target Offering Scope: <strong className="text-white">{selectedOfferingsCount} Active Products & Services</strong></span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-emerald-400 font-semibold">Available Grant Pool:</span>
            <span className="text-white font-mono">{grantFundingText}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {autoApplyOnDay1 ? (
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-medium flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" />
              Day 1 FastTrack Dispatch Active
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-300 text-[11px] font-medium">
              Standard Manual Review Required
            </span>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 mr-1">Filter Forms:</span>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
              filterCategory === cat
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Two Column Interactive Document Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Cards List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3 max-h-[640px] overflow-y-auto pr-1">
          {filteredDocs.map(doc => {
            const isSelected = selectedDoc?.id === doc.id;
            const isDay1 = doc.urgency === 'Day 1 Critical';
            return (
              <div
                key={doc.id}
                id={`doc-card-${doc.id}`}
                onClick={() => setSelectedDoc(doc)}
                className={`p-3.5 rounded-xl border transition cursor-pointer text-left ${
                  isSelected
                    ? 'bg-slate-800/95 border-blue-500/90 shadow-lg shadow-blue-950/30 ring-1 ring-blue-500/50'
                    : 'bg-slate-850 hover:bg-slate-800/80 border-slate-700/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-blue-400 font-mono text-[11px] font-bold border border-slate-700">
                        {doc.code}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        isDay1
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-700 text-slate-300'
                      }`}>
                        {doc.urgency}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-white mt-1.5 line-clamp-1">
                      {doc.title}
                    </h4>
                  </div>

                  {/* External Portal Link directly on card */}
                  <a
                    href={doc.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-400 rounded-lg border border-slate-700 transition shrink-0"
                    title={`Open official portal: ${doc.externalUrl}`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2">
                  {doc.description}
                </p>

                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Building className="w-3 h-3 text-slate-500" />
                    {doc.agencyOrTarget.split('/')[0]}
                  </span>
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {autoApplyOnDay1 && isDay1 ? 'Day 1 Queue' : 'Ready'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Document Detail Preview (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-850 border border-slate-700/80 rounded-xl p-5 space-y-5">
          {selectedDoc ? (
            <>
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-blue-600 text-white font-mono text-xs font-bold">
                      {selectedDoc.code}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Category: <strong className="text-slate-200">{selectedDoc.category}</strong>
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">
                    {selectedDoc.title}
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                    <span>Filing Target:</span>
                    <span className="text-blue-300">{selectedDoc.agencyOrTarget}</span>
                  </div>
                </div>

                {/* External Link Button on Detail Header */}
                <a
                  href={selectedDoc.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white rounded-lg border border-blue-500/40 text-xs font-medium transition shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Official Portal
                </a>
              </div>

              {/* Requirement Context */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                  <div className="text-slate-400 text-[11px] uppercase tracking-wide font-semibold">Required For</div>
                  <div className="text-slate-200 mt-1 space-y-0.5">
                    {selectedDoc.requiredFor.map((r, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="line-clamp-1">{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                  <div className="text-slate-400 text-[11px] uppercase tracking-wide font-semibold">Filing Mechanism</div>
                  <div className="text-slate-200 mt-1">
                    <div>Portal: <span className="text-blue-300 font-mono text-[11px] truncate block">{selectedDoc.filingPortal}</span></div>
                    <div className="mt-1">Day 1 Auto-Dispatch: {autoApplyOnDay1 ? <span className="text-emerald-400 font-semibold">ENABLED</span> : <span className="text-slate-400">MANUAL</span>}</div>
                  </div>
                </div>
              </div>

              {/* Template Sections Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    Standard Federal Narrative Sections
                  </h4>
                  <button
                    onClick={() => {
                      const fullText = selectedDoc.templateSections
                        .map(s => `${s.heading}\n${s.sampleContent}`)
                        .join('\n\n');
                      handleCopyText(fullText);
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    {showCopiedNotice ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Copied!
                      </span>
                    ) : (
                      <>Copy Section Text</>
                    )}
                  </button>
                </div>

                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {selectedDoc.templateSections.map((sec, idx) => (
                    <div key={idx} className="p-3 bg-slate-900/90 border border-slate-800 rounded-lg space-y-1.5">
                      <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {sec.heading}
                      </div>
                      <p className="text-[11px] text-slate-400 italic">
                        {sec.description}
                      </p>
                      <pre className="text-[11px] font-mono text-slate-300 bg-slate-950 p-2.5 rounded border border-slate-800/80 whitespace-pre-wrap leading-relaxed">
                        {sec.sampleContent}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              Select a federal document on the left to preview filing instructions and section templates.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
