import React, { useState } from 'react';
import {
  TrendingUp,
  Download,
  Upload,
  RefreshCw,
  Building2,
  StickyNote,
  Menu,
  Edit3,
  Check,
  Sliders,
  Sun,
  Moon,
  Sparkles,
  Bell,
  FileDown,
} from 'lucide-react';
import { ThemeMode } from '../types';

interface HeaderProps {
  appName?: string;
  businessName?: string;
  setBusinessName?: (name: string) => void;
  completedStepsCount: number;
  totalStepsCount: number;
  overallScore: number;
  activeModelName: string;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
  unreadAlertsCount?: number;
  onOpenAlerts?: () => void;
  onOpenPdfExport?: () => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  onOpenQuickNotes?: () => void;
  onToggleMobileMenu?: () => void;
  onToggleSwitchboard?: () => void;
  isSwitchboardOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  appName = 'ASTRO LAB FAB',
  businessName = 'ASTRO LAB FAB',
  setBusinessName,
  completedStepsCount,
  totalStepsCount,
  overallScore,
  activeModelName,
  theme = 'dark',
  onToggleTheme,
  unreadAlertsCount = 0,
  onOpenAlerts,
  onOpenPdfExport,
  onExport,
  onImport,
  onReset,
  onOpenQuickNotes,
  onToggleMobileMenu,
  onToggleSwitchboard,
  isSwitchboardOpen,
}) => {
  const safeBusinessName = businessName || 'ASTRO LAB FAB';
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(safeBusinessName);

  const percent = Math.round((completedStepsCount / (totalStepsCount || 1)) * 100) || 0;

  const handleSaveName = () => {
    if (tempName.trim() && setBusinessName) {
      setBusinessName(tempName.trim());
    }
    setIsEditingName(false);
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="w-3.5 h-3.5 text-amber-500" />;
    if (theme === 'emerald_cyber') return <Sparkles className="w-3.5 h-3.5 text-[#00ff9d]" />;
    return <Moon className="w-3.5 h-3.5 text-sky-400" />;
  };

  const getThemeLabel = () => {
    if (theme === 'light') return 'Light Exec';
    if (theme === 'emerald_cyber') return 'Cyber Neon';
    return 'Dark Space';
  };

  return (
    <header className="bg-[#121417]/95 border-b border-[#1f2228] text-slate-100 sticky top-0 z-40 backdrop-blur-md w-full overflow-x-hidden">
      <div className="w-full px-3 sm:px-5 lg:px-6 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Brand & Business Name Editor */}
          <div className="flex items-center gap-2.5 min-w-0 max-w-full sm:max-w-md lg:max-w-lg">
            {onToggleMobileMenu && (
              <button
                onClick={onToggleMobileMenu}
                className="lg:hidden p-2 text-slate-200 bg-[#08090a] hover:bg-[#1f2228] border border-[#1f2228] rounded-xl shrink-0 flex items-center justify-center"
                title="Toggle Navigation Tree"
              >
                <Menu className="w-4 h-4 text-[#00ff9d]" />
              </button>
            )}

            <div className="bg-[#00ff9d] text-[#08090a] px-2.5 py-1 rounded-lg font-black text-sm italic tracking-tighter shrink-0 font-mono shadow-[0_0_12px_rgba(0,255,157,0.3)]">
              ASTRO LAB
            </div>

            {/* Editable Business Name Input */}
            <div className="min-w-0 flex-1">
              {isEditingName ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                    autoFocus
                    placeholder="Enter Business Name..."
                    className="bg-[#08090a] border border-[#00ff9d] rounded px-2 py-0.5 text-xs text-white font-bold focus:outline-none w-48 sm:w-60"
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-1 bg-[#00ff9d] text-black rounded hover:bg-[#00e68d]"
                    title="Save Name"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 truncate group">
                  <button
                    onClick={() => {
                      setTempName(safeBusinessName);
                      setIsEditingName(true);
                    }}
                    className="flex items-center gap-1.5 text-left font-bold text-xs sm:text-sm text-white tracking-tight hover:text-[#00ff9d] transition-colors truncate"
                    title="Click to rename business (sets export file name)"
                  >
                    <span className="truncate">{safeBusinessName}</span>
                    <Edit3 className="w-3 h-3 text-[#888e96] group-hover:text-[#00ff9d] shrink-0" />
                  </button>
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-white/5 text-[#00ff9d] border border-[#00ff9d]/30 shrink-0 hidden sm:inline-block">
                    Live
                  </span>
                </div>
              )}
              <p className="text-[11px] text-[#888e96] flex items-center gap-1 truncate font-mono mt-0.5">
                <Building2 className="w-3 h-3 text-[#888e96] shrink-0" />
                <span className="hidden sm:inline">MODEL:</span> <span className="text-amber-400 font-semibold truncate">{activeModelName}</span>
              </p>
            </div>
          </div>

          {/* Metrics, Master Switches & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            
            {/* Dark / Light / Cyber Mode Toggle */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="px-2.5 py-1.5 rounded-xl bg-[#08090a] hover:bg-[#121417] text-slate-300 hover:text-white border border-[#1f2228] hover:border-[#00ff9d]/40 transition-colors flex items-center gap-1.5 text-xs font-mono"
                title={`Active: ${getThemeLabel()} Mode. Click to switch.`}
              >
                {getThemeIcon()}
                <span className="hidden xl:inline text-[11px]">{getThemeLabel()}</span>
              </button>
            )}

            {/* Auto Status Alerts Bell */}
            {onOpenAlerts && (
              <button
                onClick={onOpenAlerts}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-[#08090a] hover:bg-[#121417] text-slate-300 hover:text-[#00ff9d] border border-[#1f2228] hover:border-[#00ff9d]/40 transition-colors flex items-center gap-1.5 text-xs font-mono relative"
                title="Open Auto Status Alerts Radar & Pipeline Health"
              >
                <Bell className="w-3.5 h-3.5 text-[#00ff9d]" />
                <span className="hidden md:inline text-[11px]">Alerts</span>
                {unreadAlertsCount > 0 && (
                  <span className="w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow-[0_0_8px_#f43f5e] font-mono">
                    {unreadAlertsCount}
                  </span>
                )}
              </button>
            )}

            {/* Master Switches Button */}
            {onToggleSwitchboard && (
              <button
                onClick={onToggleSwitchboard}
                className={`px-2.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 border shadow-sm ${
                  isSwitchboardOpen
                    ? 'bg-[#00ff9d] text-black border-[#00ff9d] shadow-[0_0_12px_rgba(0,255,157,0.3)]'
                    : 'bg-[#08090a] text-slate-200 hover:text-white border-[#1f2228] hover:border-[#00ff9d]/40'
                }`}
                title="Toggle Autonomous Master Switches & Build-to-Sale War Room"
              >
                <Sliders className="w-3.5 h-3.5 text-[#00ff9d]" />
                <span className="hidden sm:inline text-[11px]">Auto-Switches</span>
              </button>
            )}

            {/* Progress Badge */}
            <div className="bg-[#08090a] border border-[#1f2228] rounded-xl px-2.5 sm:px-3 py-1 flex items-center gap-2">
              <div className="text-left">
                <div className="text-[9px] font-mono uppercase text-[#888e96] flex items-center gap-1">
                  <span className="status-glow"></span> Lifecycle
                </div>
                <div className="text-xs font-bold font-mono text-slate-200">
                  {completedStepsCount}/{totalStepsCount} <span className="text-[#00ff9d]">({percent}%)</span>
                </div>
              </div>
              <div className="w-10 sm:w-14 h-1.5 bg-[#1f2228] rounded-full overflow-hidden hidden sm:block">
                <div
                  className="h-full bg-[#00ff9d] rounded-full shadow-[0_0_8px_#00ff9d] transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>

            {/* Valuation Index Badge */}
            <div className="bg-[#08090a] border border-[#1f2228] rounded-xl px-2.5 sm:px-3 py-1 flex items-center gap-2">
              <div className="text-left">
                <div className="text-[9px] font-mono uppercase text-[#888e96] flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-amber-400" /> Valuation
                </div>
                <div className="text-xs font-bold font-mono text-amber-400">
                  {overallScore.toFixed(2)} <span className="text-[#888e96] font-normal text-[10px]">/10</span>
                </div>
              </div>
              <span
                className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  overallScore >= 7.0
                    ? 'bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30'
                    : overallScore >= 5.0
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}
              >
                {overallScore >= 7.0 ? 'GO' : overallScore >= 5.0 ? 'REV' : 'STOP'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              
              {/* PDF Master Export Button */}
              {onOpenPdfExport && (
                <button
                  onClick={onOpenPdfExport}
                  title="Export Master Multi-Page PDF Dossier (Plan, Milestones, Tax Matrix, Grants & SOPs)"
                  className="p-1.5 sm:px-2.5 sm:py-1.5 text-black bg-[#00ff9d] hover:bg-[#00e68d] rounded-lg transition-all flex items-center gap-1 text-xs font-mono font-black shadow-[0_0_10px_rgba(0,255,157,0.3)]"
                >
                  <FileDown className="w-3.5 h-3.5" /> <span className="hidden sm:inline text-[11px]">PDF Dossier</span>
                </button>
              )}

              {onOpenQuickNotes && (
                <button
                  onClick={onOpenQuickNotes}
                  title="Open Sticky Quick Notes"
                  className="p-1.5 sm:px-2 sm:py-1.5 text-[#00ff9d] hover:text-white bg-[#00ff9d]/10 hover:bg-[#00ff9d]/20 border border-[#00ff9d]/40 rounded-lg transition-all flex items-center gap-1 text-xs font-mono font-bold"
                >
                  <StickyNote className="w-3.5 h-3.5" /> <span className="hidden md:inline text-[11px]">Notes</span>
                </button>
              )}

              <button
                onClick={onExport}
                title={`Export JSON State as ${safeBusinessName.toLowerCase().replace(/[^a-z0-9_-]/g, '_')}_startup_state.json`}
                className="p-1.5 sm:px-2 sm:py-1.5 text-slate-300 hover:text-[#00ff9d] bg-[#08090a] hover:bg-[#121417] border border-[#1f2228] hover:border-[#00ff9d]/40 rounded-lg transition-colors flex items-center gap-1 text-xs font-mono"
              >
                <Download className="w-3.5 h-3.5 text-[#00ff9d]" /> <span className="hidden lg:inline text-[11px]">JSON</span>
              </button>

              <label
                title="Import State JSON"
                className="p-1.5 sm:px-2 sm:py-1.5 text-slate-300 hover:text-[#00ff9d] bg-[#08090a] hover:bg-[#121417] border border-[#1f2228] hover:border-[#00ff9d]/40 rounded-lg transition-colors flex items-center gap-1 text-xs font-mono cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-[#00ff9d]" />
                <input type="file" accept=".json" onChange={onImport} className="hidden" />
              </label>

              <button
                onClick={onReset}
                title="Reset State"
                className="p-1.5 text-[#888e96] hover:text-rose-400 bg-[#08090a] hover:bg-[#121417] border border-[#1f2228] rounded-lg transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
