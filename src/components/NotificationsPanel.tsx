import React from 'react';
import { Bell, X, AlertTriangle, Info, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { NotificationItem, InstrumentRole } from '../types/metrochain';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  currentRole: InstrumentRole;
  onSelectInstrument: (id: string) => void;
  onMarkAllRead: () => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  isOpen,
  onClose,
  notifications,
  currentRole,
  onSelectInstrument,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  // Filter notifications relevant to current role or target roles
  const relevantNotifs = notifications.filter(
    (n) => n.roleTarget.includes(currentRole) || currentRole === 'admin'
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-900" />
            <h2 className="text-sm font-bold text-slate-900">Statutory Notifications</h2>
            <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
              {relevantNotifs.length} Alerts
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onMarkAllRead}
              className="text-[11px] text-blue-800 hover:underline cursor-pointer"
            >
              Mark read
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {relevantNotifs.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No new alerts for current role.
            </div>
          ) : (
            relevantNotifs.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-xl border transition-all text-xs space-y-2 ${
                  notif.read
                    ? 'bg-white border-slate-200 opacity-80'
                    : 'bg-blue-50/40 border-blue-200 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    {notif.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
                    {notif.type === 'alert' && <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
                    {notif.type === 'info' && <Info className="w-4 h-4 text-blue-600 shrink-0" />}
                    {notif.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    <span>{notif.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">{notif.timestamp}</span>
                </div>

                <p className="text-slate-600 leading-relaxed text-[11px]">{notif.message}</p>

                {notif.linkInstrumentId && (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectInstrument(notif.linkInstrumentId!);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-900 hover:text-blue-700 cursor-pointer pt-1"
                  >
                    <span>View Instrument {notif.linkInstrumentId}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        <div className="p-3 border-t border-slate-200 bg-slate-50 text-center text-[11px] text-slate-500">
          Automated compliance alerts generated per Section 24 Legal Metrology Act
        </div>
      </div>
    </div>
  );
};
