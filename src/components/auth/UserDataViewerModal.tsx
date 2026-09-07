import React, { useState, useMemo } from 'react';
import {
  X,
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Laptop,
  Globe
} from 'lucide-react';
import { dbService } from '../../services/dbService';
import { authService, EXCLUSIVE_ADMIN_PASSWORD, EXCLUSIVE_ADMIN_EMAIL } from '../../services/authService';
import { AuditLog } from '../../types/auth';

interface UserDataViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserDataViewerModal: React.FC<UserDataViewerModalProps> = ({ isOpen, onClose }) => {
  const isUserAdmin = authService.isAdmin();
  const [unlocked, setUnlocked] = useState(isUserAdmin);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [eventFilter, setEventFilter] = useState<string>('ALL');

  // Keep unlocked true if logged in as Admin
  React.useEffect(() => {
    if (isUserAdmin) {
      setUnlocked(true);
    }
  }, [isUserAdmin, isOpen]);

  if (!isOpen) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === EXCLUSIVE_ADMIN_PASSWORD || isUserAdmin) {
      setUnlocked(true);
      setError(null);
    } else {
      setError('Incorrect master password. Access denied.');
    }
  };

  const logs = dbService.getAuditLogs();

  const filteredLogs = logs.filter(log => {
    if (eventFilter !== 'ALL' && log.event !== eventFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.userEmail.toLowerCase().includes(q) ||
        log.userName.toLowerCase().includes(q) ||
        (log.details && log.details.toLowerCase().includes(q)) ||
        log.device.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportDecryptedCSV = () => {
    if (filteredLogs.length === 0) return;
    const headers = ['Timestamp', 'Event', 'User Email', 'User Name', 'Provider', 'Status', 'Device', 'IP', 'Details'];
    const rows = filteredLogs.map(l => [
      `"${l.timestamp}"`,
      `"${l.event}"`,
      `"${l.userEmail}"`,
      `"${l.userName}"`,
      `"${l.provider}"`,
      `"${l.status}"`,
      `"${l.device}"`,
      `"${l.ipAddress}"`,
      `"${(l.details || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `user_login_logout_data_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-[var(--border-color)] bg-[var(--bg-surface-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl border ${unlocked ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-blue-500/10 text-sky-400 border-blue-500/30'}`}>
              {unlocked ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-[var(--text-primary)]">
                  📁 File: user login/logout data
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 font-bold">
                  AES-256 Encrypted
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Path: <code className="font-mono text-sky-400 font-bold">src/data/user_login_logout_data.json</code>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Locked Screen vs Decrypted Viewer */}
        {!unlocked ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-sky-400 animate-float shadow-xl shadow-blue-500/20">
              <KeyRound className="w-8 h-8" />
            </div>

            <div className="max-w-md space-y-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-[var(--text-primary)]">
                Password Protected Local Database File
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                This database file contains confidential authentication audit logs. Only admin (<strong>{EXCLUSIVE_ADMIN_EMAIL}</strong>) can unlock and view its records.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-slide-down">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleUnlock} className="w-full max-w-sm space-y-3">
              <div className="relative">
                <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Enter master password to unlock"
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-sky-400 transition"
                  autoFocus
                  required
                />
              </div>

              <button
                type="submit"
                className="azure-btn-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
              >
                <Unlock className="w-4 h-4" />
                <span>Decrypt & View File</span>
              </button>
            </form>
          </div>
        ) : (
          /* Decrypted Live Database Records Viewer */
          <div className="p-6 overflow-y-auto space-y-4">
            
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[var(--bg-surface-subtle)] p-3 rounded-2xl border border-[var(--border-color)]">
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search user, email, device..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <select
                  value={eventFilter}
                  onChange={e => setEventFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] font-semibold focus:outline-none"
                >
                  <option value="ALL">All Events ({logs.length})</option>
                  <option value="LOGIN">Logins Only</option>
                  <option value="LOGOUT">Logouts Only</option>
                  <option value="SIGNUP">Signups Only</option>
                  <option value="2FA_VERIFIED">2FA Verified</option>
                  <option value="UNAUTHORIZED_ACCESS_BLOCKED">Blocked Attempts</option>
                </select>

                <button
                  onClick={handleExportDecryptedCSV}
                  className="azure-btn-secondary px-3 py-1.5 text-xs font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-sky-400" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Table of Records */}
            <div className="rounded-2xl border border-[var(--border-color)] overflow-hidden bg-[var(--bg-surface-subtle)]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--bg-surface)] border-b border-[var(--border-color)] text-[var(--text-muted)] uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Event</th>
                      <th className="p-3">User & Email</th>
                      <th className="p-3">Method</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Device / IP</th>
                      <th className="p-3">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-primary)] font-medium">
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-[var(--text-muted)]">
                          No audit log records match your filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map(log => {
                        const isLogin = log.event === 'LOGIN';
                        const isLogout = log.event === 'LOGOUT';
                        const isBlocked = log.event === 'UNAUTHORIZED_ACCESS_BLOCKED';
                        const is2FA = log.event.includes('2FA');

                        return (
                          <tr key={log.id} className="hover:bg-[var(--bg-surface-hover)] transition">
                            <td className="p-3 whitespace-nowrap font-mono text-[11px] text-[var(--text-muted)]">
                              {new Date(log.timestamp).toLocaleString()}
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                                isLogin
                                  ? 'bg-blue-500/10 text-sky-400 border-blue-500/30'
                                  : isLogout
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                  : isBlocked
                                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                  : is2FA
                                  ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              }`}>
                                {log.event}
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="font-bold text-[var(--text-primary)]">{log.userName}</div>
                              <div className="text-[11px] text-[var(--text-muted)] font-mono">{log.userEmail}</div>
                            </td>
                            <td className="p-3 capitalize text-[11px] text-[var(--text-secondary)]">
                              {log.provider}
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <span className={`text-[10px] font-bold ${log.status === 'SUCCESS' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {log.status}
                              </span>
                            </td>
                            <td className="p-3 whitespace-nowrap text-[11px] text-[var(--text-secondary)]">
                              <div>{log.device}</div>
                              <div className="font-mono text-[10px] text-[var(--text-muted)]">{log.ipAddress}</div>
                            </td>
                            <td className="p-3 text-[11px] text-[var(--text-muted)] max-w-xs truncate">
                              {log.details || '—'}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
