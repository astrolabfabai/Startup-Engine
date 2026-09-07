import React, { useEffect, useState } from 'react';
import { Bell, X, ExternalLink, Flame, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { StatusAlert, TabId } from '../types';

interface ToastAlertNotificationProps {
  alert: StatusAlert | null;
  onClose: () => void;
  onNavigateTab: (tab: TabId) => void;
  onOpenAlertsModal: () => void;
}

export const ToastAlertNotification: React.FC<ToastAlertNotificationProps> = ({
  alert,
  onClose,
  onNavigateTab,
  onOpenAlertsModal,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (alert) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 7000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [alert, onClose]);

  if (!alert || !isVisible) return null;

  const getSeverityIcon = () => {
    switch (alert.severity) {
      case 'critical':
        return <Flame className="w-4 h-4 text-rose-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-[#00ff9d]" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm sm:max-w-md w-full animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#121417] border border-[#00ff9d]/50 rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(0,255,157,0.15)] text-slate-100 backdrop-blur-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#00ff9d]/10 border border-[#00ff9d]/30 shrink-0">
              {getSeverityIcon()}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30 font-bold">
                  Live Alert
                </span>
                <span className="text-[10px] font-mono text-[#888e96]">{alert.timestamp}</span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight mt-0.5">
                {alert.title}
              </h4>
            </div>
          </div>

          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 200);
            }}
            className="text-[#888e96] hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 mt-2 leading-relaxed font-sans">
          {alert.message}
        </p>

        {alert.metric && (
          <div className="mt-2.5 px-2.5 py-1 rounded bg-[#08090a] border border-[#1f2228] text-[11px] font-mono text-[#00ff9d] font-bold inline-block">
            {alert.metric}
          </div>
        )}

        <div className="mt-3 pt-2.5 border-t border-[#1f2228] flex items-center justify-between gap-2 text-xs font-mono">
          <button
            onClick={() => {
              onOpenAlertsModal();
              onClose();
            }}
            className="text-[#888e96] hover:text-white text-[11px] flex items-center gap-1"
          >
            <Bell className="w-3 h-3 text-[#00ff9d]" /> View Radar
          </button>

          {alert.actionTab && (
            <button
              onClick={() => {
                if (alert.actionTab) {
                  onNavigateTab(alert.actionTab);
                  onClose();
                }
              }}
              className="px-2.5 py-1 rounded-lg bg-[#00ff9d] text-black font-bold text-[11px] hover:bg-[#00e68d] transition-colors flex items-center gap-1 shadow-[0_0_8px_rgba(0,255,157,0.3)]"
            >
              <span>{alert.actionLabel || 'Inspect'}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
