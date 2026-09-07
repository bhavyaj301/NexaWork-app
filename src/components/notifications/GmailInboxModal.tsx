import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  ShieldAlert,
  KeyRound,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  Trash2,
  Send,
  ExternalLink
} from 'lucide-react';
import { dbService } from '../../services/dbService';
import { mailService } from '../../services/mailService';
import { EmailNotification, User } from '../../types/auth';

interface GmailInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
}

export const GmailInboxModal: React.FC<GmailInboxModalProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  const [emails, setEmails] = useState<EmailNotification[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailNotification | null>(null);

  const loadEmails = () => {
    const list = dbService.getNotifications();
    setEmails(list);
    if (list.length > 0 && !selectedEmail) {
      setSelectedEmail(list[0]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadEmails();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectEmail = (mail: EmailNotification) => {
    setSelectedEmail(mail);
    dbService.markNotificationAsRead(mail.id);
    setEmails(dbService.getNotifications());
  };

  const handleSendDigestTest = () => {
    const email = currentUser?.email || 'user.google@gmail.com';
    const name = currentUser?.name || 'Cloud Explorer';
    const newMail = mailService.sendWeeklyTrendDigest(email, name);
    loadEmails();
    setSelectedEmail(newMail);
  };

  const getCategoryIcon = (category: EmailNotification['category']) => {
    switch (category) {
      case 'SECURITY':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case '2FA_CODE':
        return <KeyRound className="w-4 h-4 text-purple-400" />;
      case 'WELCOME':
        return <Sparkles className="w-4 h-4 text-sky-400" />;
      case 'TREND_ALERT':
        return <TrendingUp className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 sm:p-8 shadow-2xl relative flex flex-col h-[80vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            {/* Official Gmail Icon */}
            <div className="w-10 h-10 rounded-2xl bg-white p-2 flex items-center justify-center shadow-md">
              <svg className="w-full h-full" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M1.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25h3v-9L1.5 6.75z" />
                <path fill="#34A853" d="M22.5 6.75 17.25 10.5v9h3a2.25 2.25 0 0 0 2.25-2.25V6.75z" />
                <path fill="#EA4335" d="m1.5 6.75 10.5 7.5 10.5-7.5V4.5a2.25 2.25 0 0 0-2.25-2.25h-16.5A2.25 2.25 0 0 0 1.5 4.5v2.25z" />
                <path fill="#FBBC04" d="m12 14.25-5.25-3.75v9h10.5v-9L12 14.25z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                  Gmail Notification Hub
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Connected: {currentUser?.email || 'user.google@gmail.com'}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                Live delivery stream for 2FA OTP codes, security alerts, and labor trend digests.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSendDigestTest}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-color)] text-sky-400 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Sample Trend Alert</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Split View */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 pt-4 overflow-hidden">
          
          {/* Left Email List (5 cols) */}
          <div className="md:col-span-5 flex flex-col border border-[var(--border-color)] rounded-2xl bg-[var(--bg-surface-subtle)] overflow-hidden">
            <div className="p-3 border-b border-[var(--border-color)] text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center justify-between">
              <span>Inbox ({emails.length})</span>
              <span className="text-[10px] text-sky-400 font-mono">Live Delivered</span>
            </div>
            
            <div className="flex-1 overflow-y-auto divide-y divide-[var(--border-color)]">
              {emails.length === 0 ? (
                <div className="text-center py-12 px-4 text-xs text-[var(--text-muted)]">
                  <Mail className="w-6 h-6 mx-auto mb-2 opacity-40 text-sky-400" />
                  No messages yet. Trigger a login or 2FA code to see incoming mail.
                </div>
              ) : (
                emails.map(mail => (
                  <button
                    key={mail.id}
                    onClick={() => handleSelectEmail(mail)}
                    className={`w-full text-left p-3.5 transition flex flex-col gap-1.5 ${
                      selectedEmail?.id === mail.id
                        ? 'bg-blue-600/15 border-l-4 border-blue-500'
                        : 'hover:bg-[var(--bg-surface-hover)]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-bold text-[var(--text-primary)] truncate">
                        {getCategoryIcon(mail.category)}
                        <span className="truncate">{mail.subject}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] line-clamp-1">
                      {mail.body}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono">
                      <span>{new Date(mail.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="text-emerald-400 font-bold">✓ Delivered</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right Message Reader (7 cols) */}
          <div className="md:col-span-7 flex flex-col border border-[var(--border-color)] rounded-2xl bg-[var(--bg-surface)] p-5 overflow-y-auto">
            {selectedEmail ? (
              <div className="space-y-4">
                <div className="pb-4 border-b border-[var(--border-color)] space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-base font-bold text-[var(--text-primary)] leading-snug">
                      {selectedEmail.subject}
                    </h4>
                    <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-blue-500/10 text-sky-400 border border-blue-500/20 shrink-0">
                      {selectedEmail.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <div>
                      From: <strong className="text-[var(--text-primary)]">NexaWork AI Security &lt;notifications@nexawork.app&gt;</strong>
                      <br />
                      To: <span className="text-sky-400">{selectedEmail.recipientEmail}</span>
                    </div>
                    <span className="font-mono text-[11px]">
                      {new Date(selectedEmail.sentAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Email Body */}
                <div className="p-4 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-secondary)] whitespace-pre-line leading-relaxed font-sans">
                  {selectedEmail.body}
                </div>

                <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 text-[11px] text-[var(--text-muted)] flex items-center justify-between">
                  <span>Delivered via Google Cloud & NexaWork Real-Time Mail Dispatcher</span>
                  <span className="text-emerald-400 font-bold">TLS Encrypted</span>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-xs text-[var(--text-muted)]">
                Select an email from the inbox list to read its content.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 flex items-center justify-between text-xs text-[var(--text-muted)]">
          <span>Connected to Google Workspace & Gmail IMAP/SMTP Gateway</span>
          <button onClick={onClose} className="azure-btn-secondary px-4 py-1.5 text-xs font-bold">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
