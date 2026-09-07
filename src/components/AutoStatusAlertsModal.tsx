import React, { useState } from 'react';
import {
  Bell,
  X,
  CheckCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Volume2,
  VolumeX,
  RefreshCw,
  ExternalLink,
  Trash2,
  Filter,
  Download,
  Flame,
  Radio,
  FileCheck2,
} from 'lucide-react';
import { StatusAlert, StatusAlertCategory, StatusAlertSeverity, TabId } from '../types';

interface AutoStatusAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: StatusAlert[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAlerts: () => void;
  onTriggerScan: () => void;
  onNavigateTab: (tab: TabId) => void;
  isAutoPolling: boolean;
  setIsAutoPolling: (val: boolean) => void;
  isSoundEnabled: boolean;
  setIsSoundEnabled: (val: boolean) => void;
  businessName?: string;
}

export const AutoStatusAlertsModal: React.FC<AutoStatusAlertsModalProps> = ({
  isOpen,
  onClose,
  alerts,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAlerts,
  onTriggerScan,
  onNavigateTab,
  isAutoPolling,
  setIsAutoPolling,
  isSoundEnabled,
  setIsSoundEnabled,
  businessName = 'ASTRO LAB FAB',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);

  if (!isOpen) return null;

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  const handleRunScan = () => {
    setIsScanning(true);
    onTriggerScan();
    setTimeout(() => {
      setIsScanning(false);
    }, 600);
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (selectedCategory !== 'all' && alert.category !== selectedCategory) return false;
    if (selectedSeverity !== 'all' && alert.severity !== selectedSeverity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        alert.title.toLowerCase().includes(q) ||
        alert.message.toLowerCase().includes(q) ||
        (alert.metric && alert.metric.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleExportAlertsLog = () => {
    const data = {
      businessName,
      exportedAt: new Date().toISOString(),
      unreadCount,
      totalAlerts: alerts.length,
      alerts,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${businessName.toLowerCase().replace(/[^a-z0-9_-]/g, '_')}_alerts_log_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSeverityBadge = (severity: StatusAlertSeverity) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1">
            <Flame className="w-3 h-3 text-rose-400" /> CRITICAL
          </span>
        );
      case 'warning':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" /> ATTENTION
          </span>
        );
      case 'success':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#00ff9d]" /> RESOLVED / HEALTHY
          </span>
        );
      case 'info':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
            <Info className="w-3 h-3 text-cyan-400" /> NOTICE
          </span>
        );
    }
  };

  const getCategoryLabel = (cat: StatusAlertCategory) => {
    switch (cat) {
      case 'grants':
        return 'Grants & Capital';
      case 'tax_legal':
        return 'Tax & Legal Blueprint';
      case 'data_pipeline':
        return 'Self-Healing Pipeline';
      case 'mlops_bot':
        return 'Playwright MLOps';
      case 'lifecycle_milestones':
        return 'Lifecycle Milestones';
      case 'security_vault':
        return 'Security Vault';
      default:
        return cat;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-[#121417] border border-[#1f2228] w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#1f2228] bg-[#08090a]/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#00ff9d]/10 border border-[#00ff9d]/30 text-[#00ff9d] relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow-[0_0_8px_#f43f5e]">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                  Auto Status Alerts & Compliance Radar
                </h2>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9d] animate-ping" />
                  Live Monitor
                </span>
              </div>
              <p className="text-xs text-[#888e96] mt-0.5">
                Real-time autonomous tracking for grants, IRS tax gates, self-healing pipelines, and MLOps triggers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Run Diagnostic Scan Button */}
            <button
              onClick={handleRunScan}
              disabled={isScanning}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 border ${
                isScanning
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-[#00ff9d]/10 hover:bg-[#00ff9d]/20 text-[#00ff9d] border-[#00ff9d]/40'
              }`}
              title="Run Real-time Diagnostic Engine Scan"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Scanning...' : 'Live Scan'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              className={`p-2 rounded-xl border transition-colors ${
                isSoundEnabled
                  ? 'bg-white/5 text-[#00ff9d] border-[#00ff9d]/30'
                  : 'bg-white/5 text-[#888e96] border-white/10'
              }`}
              title={isSoundEnabled ? 'Audio Alerts Enabled' : 'Audio Alerts Muted'}
            >
              {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 text-[#888e96] hover:text-white hover:bg-white/10 border border-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Toolbar & Live Telemetry Controls */}
        <div className="px-4 sm:px-5 py-3 border-b border-[#1f2228] bg-[#0c0e12] flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Controls: Auto-Polling & Quick Stats */}
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white select-none">
              <input
                type="checkbox"
                checked={isAutoPolling}
                onChange={(e) => setIsAutoPolling(e.target.checked)}
                className="rounded border-[#1f2228] bg-[#08090a] text-[#00ff9d] focus:ring-0 w-3.5 h-3.5"
              />
              <span className="flex items-center gap-1 font-mono text-[11px]">
                <Radio className={`w-3 h-3 ${isAutoPolling ? 'text-[#00ff9d] animate-pulse' : 'text-[#888e96]'}`} />
                Autonomous Polling (45s)
              </span>
            </label>

            <div className="h-4 w-px bg-[#1f2228] hidden sm:block" />

            <div className="flex items-center gap-3 font-mono text-[11px] text-[#888e96]">
              <span>Total: <strong className="text-white">{alerts.length}</strong></span>
              <span>Unread: <strong className="text-rose-400">{unreadCount}</strong></span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-[#00ff9d] border border-white/10 transition-colors flex items-center gap-1 font-mono text-[11px]"
              >
                <CheckCheck className="w-3.5 h-3.5 text-[#00ff9d]" /> Mark All Read
              </button>
            )}

            <button
              onClick={handleExportAlertsLog}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-[#00ff9d] border border-white/10 transition-colors flex items-center gap-1 font-mono text-[11px]"
              title="Download full JSON audit trail of all alerts"
            >
              <Download className="w-3.5 h-3.5 text-[#00ff9d]" /> Export Log
            </button>

            {alerts.length > 0 && (
              <button
                onClick={onClearAlerts}
                className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors flex items-center gap-1 font-mono text-[11px]"
                title="Clear all alerts"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs & Search */}
        <div className="p-3 sm:px-5 border-b border-[#1f2228] bg-[#0f1115] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-[11px] font-mono">
            {[
              { id: 'all', label: 'All Alerts' },
              { id: 'grants', label: 'Grants & Capital' },
              { id: 'tax_legal', label: 'Tax & Legal' },
              { id: 'data_pipeline', label: 'Pipelines' },
              { id: 'mlops_bot', label: 'Playwright MLOps' },
              { id: 'lifecycle_milestones', label: 'Milestones' },
              { id: 'security_vault', label: 'Security Vault' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg shrink-0 transition-all font-semibold ${
                  selectedCategory === cat.id
                    ? 'bg-[#00ff9d] text-black font-bold shadow-[0_0_8px_rgba(0,255,157,0.3)]'
                    : 'bg-[#08090a] text-slate-400 hover:text-white border border-[#1f2228]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="w-full sm:w-56 shrink-0">
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#08090a] border border-[#1f2228] focus:border-[#00ff9d] rounded-lg px-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Alert Cards List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-[#0a0c0f]">
          {filteredAlerts.length === 0 ? (
            <div className="py-12 text-center text-[#888e96] flex flex-col items-center justify-center">
              <FileCheck2 className="w-10 h-10 text-[#00ff9d]/40 mb-2" />
              <p className="text-sm font-bold text-slate-300">All System Audits Clear</p>
              <p className="text-xs mt-1 max-w-sm">No active alerts matching your current filter. The autonomous compliance engines are running with zero blocking anomalies.</p>
              <button
                onClick={handleRunScan}
                className="mt-4 px-3 py-1.5 rounded-xl bg-[#00ff9d]/10 hover:bg-[#00ff9d]/20 text-[#00ff9d] border border-[#00ff9d]/30 text-xs font-mono font-bold flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Trigger Diagnostic Scan
              </button>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border transition-all ${
                  alert.isRead
                    ? 'bg-[#121417] border-[#1f2228] opacity-85'
                    : 'bg-[#161a20] border-[#00ff9d]/40 shadow-[0_0_12px_rgba(0,255,157,0.06)]'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getSeverityBadge(alert.severity)}
                    <span className="text-[10px] font-mono text-[#888e96] bg-white/5 px-2 py-0.5 rounded border border-white/5">
                      {getCategoryLabel(alert.category)}
                    </span>
                    <span className="text-[10px] font-mono text-[#888e96]">
                      {alert.timestamp}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {!alert.isRead && (
                      <button
                        onClick={() => onMarkAsRead(alert.id)}
                        className="text-[10px] font-mono text-[#00ff9d] hover:underline px-1.5 py-0.5"
                        title="Mark alert as read"
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-2.5">
                  <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                    {alert.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {alert.message}
                  </p>
                </div>

                {/* Metric & Details Highlight */}
                {(alert.metric || alert.details) && (
                  <div className="mt-3 p-2.5 rounded-lg bg-[#08090a] border border-[#1f2228] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    {alert.details && (
                      <p className="text-[11px] text-[#888e96] font-mono leading-normal flex-1">
                        {alert.details}
                      </p>
                    )}
                    {alert.metric && (
                      <span className="px-2.5 py-1 rounded bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30 text-[11px] font-mono font-bold shrink-0 self-start sm:self-auto">
                        {alert.metric}
                      </span>
                    )}
                  </div>
                )}

                {/* Action Route Trigger */}
                {alert.actionTab && (
                  <div className="mt-3 flex items-center justify-end">
                    <button
                      onClick={() => {
                        if (alert.actionTab) {
                          onNavigateTab(alert.actionTab);
                          onMarkAsRead(alert.id);
                          onClose();
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#00ff9d]/10 hover:bg-[#00ff9d]/20 text-[#00ff9d] hover:text-white border border-[#00ff9d]/30 transition-colors text-xs font-mono font-bold flex items-center gap-1.5"
                    >
                      <span>{alert.actionLabel || 'Navigate to Module'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:px-5 border-t border-[#1f2228] bg-[#08090a] flex flex-wrap items-center justify-between gap-3 text-xs text-[#888e96] font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00ff9d]" />
            <span>Encrypted Corporate Control Plane — All Status Events Logged</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold border border-white/10 transition-colors"
          >
            Close Radar
          </button>
        </div>

      </div>
    </div>
  );
};
