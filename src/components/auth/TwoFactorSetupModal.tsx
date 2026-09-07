import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Smartphone,
  Mail,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Send,
  Lock
} from 'lucide-react';
import { authService } from '../../services/authService';
import { mailService } from '../../services/mailService';
import { User } from '../../types/auth';

interface TwoFactorSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
}

export const TwoFactorSetupModal: React.FC<TwoFactorSetupModalProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  const [enabled, setEnabled] = useState(currentUser?.twoFactorEnabled || false);
  const [testSent, setTestSent] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handleToggle = () => {
    const nextState = !enabled;
    setEnabled(nextState);
    authService.toggleTwoFactor(nextState);
    if (nextState) {
      mailService.sendTwoFactorCode(currentUser.email, currentUser.name, '749102');
      setTestSent(true);
    }
  };

  const handleSendTestCode = () => {
    mailService.sendTwoFactorCode(currentUser.email, currentUser.name, Math.floor(100000 + Math.random() * 900000).toString());
    setTestSent(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 sm:p-8 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              Two-Step Verification (2FA)
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Protect your NexaWork AI account with an extra layer of security.
            </p>
          </div>
        </div>

        {/* 2FA Toggle Card */}
        <div className="p-5 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <span>Gmail OTP Authentication</span>
                {enabled ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-extrabold">
                    ACTIVE
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20 font-bold">
                    DISABLED
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                When enabled, every login requires entering a 6-digit one-time code sent directly to <strong className="text-[var(--text-primary)]">{currentUser.email}</strong>.
              </p>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={handleToggle}
              className={`w-12 h-6.5 rounded-full transition-colors relative flex items-center p-1 shrink-0 ${
                enabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform shadow-md ${
                  enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {enabled && (
            <div className="pt-3 border-t border-[var(--border-color)] space-y-3 animate-slide-down">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Two-Step Verification is active for <strong>{currentUser.email}</strong>. On your next login you will be asked for an OTP verification code.
                </span>
              </div>

              <button
                onClick={handleSendTestCode}
                className="w-full py-2.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-color)] text-xs font-bold text-sky-400 flex items-center justify-center gap-2 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Test Verification Code to Gmail</span>
              </button>

              {testSent && (
                <p className="text-[11px] text-center text-emerald-400 font-semibold">
                  ✓ Verification code dispatched! Open your in-app Gmail Inbox to preview.
                </p>
              )}
            </div>
          )}
        </div>

        {/* How It Works Info */}
        <div className="mt-5 space-y-2 text-xs text-[var(--text-secondary)]">
          <div className="font-bold text-[var(--text-primary)]">How 2FA protects you:</div>
          <ul className="space-y-1.5 list-disc list-inside text-[var(--text-muted)]">
            <li>Even if someone guesses your password, they cannot log into your account.</li>
            <li>Instant email alerts with timestamp and device details are delivered to your Gmail.</li>
            <li>Backup demo code <span className="font-mono text-sky-400 font-bold">123456</span> is supported for local testing.</li>
          </ul>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="azure-btn-primary px-6 py-2.5 text-xs font-bold">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
