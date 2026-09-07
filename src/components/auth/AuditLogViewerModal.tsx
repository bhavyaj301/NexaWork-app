import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  ShieldCheck,
  Download,
  Trash2,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Laptop,
  Smartphone,
  Globe,
  LogIn,
  LogOut,
  KeyRound,
  UserPlus
} from 'lucide-react';
import { dbService } from '../../services/dbService';
import { AuditLog } from '../../types/auth';

interface AuditLogViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogViewerModal: React.FC<AuditLogViewerModalProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filterEvent, setFilterEvent] = useState<string>('ALL');

  useEffect(() => {
    if (isOpen) {
      setLogs(dbService.getAuditLogs());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredLogs = filterEvent === 'ALL'
    ? logs
    : logs.filter(l => l.event === filterEvent);

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all stored audit logs from the database?')) {
      dbService.clearAuditLogs();
      setLogs([]);
    }
  };

  const handleExportCSV = () => {
    if (logs.length === 0) return;
    const headers = ['ID', 'Event', 'User Name', 'User Email', 'Provider', 'Status', 'IP Address', 'Device', 'Browser', 'Timestamp', 'Details'];
    const rows = logs.map(l => [
      l.id,
      l.event,
      l.userName,
      l.userEmail,
      l.provider,
      l.status,
      l.ipAddress,
      l.device,
      l.browser,
      l.timestamp,
      l.details || ''
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.map(i => `"${i}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nexawork-auth-audit-logs-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getEventBadge = (event: AuditLog['event']) => {
    switch (event) {
      case 'LOGIN':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <LogIn className="w-3 h-3" /> LOGIN
          </span>
        );
      case 'LOGOUT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <LogOut className="w-3 h-3" /> LOGOUT
          </span>
        );
      case 'SIGNUP':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/10 text-sky-400 border border-blue-500/20">
            <UserPlus className="w-3 h-3" /> SIGNUP
          </span>
        );
      case '2FA_CHALLENGE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <KeyRound className="w-3 h-3" /> 2FA SENT
          </span>
        );
      case '2FA_VERIFIED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <ShieldCheck className="w-3 h-3" /> 2FA OK
          </span>
        );
      default:
        return <span className="text-xs font-bold">{event}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-5xl rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 sm:p-8 shadow-2xl relative flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[var(--border-color)] gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-sky-400 border border-blue-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                  Authentication & Audit Database
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Live Persistent
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Real-time storage of all user login, logout, signup, and 2FA authentication events.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              disabled={logs.length === 0}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-color)] text-[var(--text-primary)] flex items-center gap-2 transition"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleClear}
              disabled={logs.length === 0}
              className="p-2 rounded-xl text-[var(--text-muted)] hover:text-rose-400 hover:bg-rose-500/10 border border-[var(--border-color)] transition"
              title="Clear all logs"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between py-4 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <span className="font-bold text-[var(--text-secondary)]">Filter Event:</span>
            {['ALL', 'LOGIN', 'LOGOUT', 'SIGNUP', '2FA_VERIFIED'].map(evt => (
              <button
                key={evt}
                onClick={() => setFilterEvent(evt)}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  filterEvent === evt
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {evt}
              </button>
            ))}
          </div>
          <span className="text-xs text-[var(--text-muted)] font-mono">
            {filteredLogs.length} Records Stored
          </span>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto border border-[var(--border-color)] rounded-2xl bg-[var(--bg-surface-subtle)]">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-16 text-[var(--text-muted)] space-y-2">
              <Database className="w-8 h-8 mx-auto opacity-40 text-sky-400" />
              <p className="text-sm font-semibold">No audit logs stored yet.</p>
              <p className="text-xs">Sign in, sign out, or create an account to view real-time database entries.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-[var(--bg-surface)] border-b border-[var(--border-color)] text-[var(--text-muted)] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Event Type</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Provider</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Device & Browser</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-secondary)]">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-[var(--bg-surface-hover)] transition">
                    <td className="py-3.5 px-4">{getEventBadge(log.event)}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[var(--text-primary)]">{log.userName}</div>
                      <div className="text-[11px] text-[var(--text-muted)]">{log.userEmail}</div>
                    </td>
                    <td className="py-3.5 px-4 capitalize font-semibold text-[var(--text-primary)]">
                      {log.provider}
                    </td>
                    <td className="py-3.5 px-4">
                      {log.status === 'SUCCESS' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> OK
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-400 font-bold">
                          <XCircle className="w-3.5 h-3.5" /> Failed
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-[11px]">
                      <div>{log.device}</div>
                      <div className="text-[var(--text-muted)]">{log.browser}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-sky-400">{log.ipAddress}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-[11px] text-[var(--text-muted)]">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      <div className="text-[10px]">{new Date(log.timestamp).toLocaleDateString()}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer info */}
        <div className="pt-4 mt-2 flex items-center justify-between text-xs text-[var(--text-muted)]">
          <span>Database Engine: Persistent Free DB Store with Timestamp Synchronization</span>
          <button onClick={onClose} className="azure-btn-secondary px-4 py-1.5 text-xs">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
