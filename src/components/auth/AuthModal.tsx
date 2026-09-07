import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { authService, EXCLUSIVE_ADMIN_EMAIL } from '../../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  onSuccess
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | '2fa'>(initialMode);
  const [name, setName] = useState('Bhavya Jain');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setError(null);
    setLoading(false);
    setTwoFactorCode('');
    setPassword('');
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await authService.signInWithGoogle(email || EXCLUSIVE_ADMIN_EMAIL, name || 'Bhavya Jain');
      if (res.requires2FA) {
        setMode('2fa');
      } else if (res.success) {
        onSuccess?.();
        onClose();
      } else {
        setError(res.message || 'Google Sign-In failed');
      }
    } catch {
      setError('An unexpected error occurred during Google Sign-In.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.signInWithEmail(email, password);
      if (res.requires2FA) {
        setMode('2fa');
      } else if (res.success) {
        onSuccess?.();
        onClose();
      } else {
        setError(res.message || 'Authentication failed.');
      }
    } catch {
      setError('Failed to authenticate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!twoFactorCode.trim() || twoFactorCode.trim().length !== 6) {
      setError('Please enter the 6-digit verification code sent to your Gmail.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.verifyTwoFactorCode(twoFactorCode);
      if (res.success) {
        onSuccess?.();
        onClose();
      } else {
        setError(res.message || 'Invalid code.');
      }
    } catch {
      setError('Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend2FA = () => {
    const res = authService.resendTwoFactorCode();
    if (res.success) {
      setError(null);
      alert('A new 6-digit verification code has been dispatched to your Gmail!');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-blue-600/20 blur-3xl pointer-events-none rounded-full" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className="inline-flex p-3 rounded-2xl bg-blue-500/10 text-sky-400 border border-blue-500/20 mb-2.5 shadow-inner">
            {mode === '2fa' ? <ShieldCheck className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
            {mode === '2fa'
              ? 'Two-Step Verification'
              : mode === 'signup'
              ? 'Create Account'
              : 'Sign in to NexaWork'}
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
            {mode === '2fa'
              ? 'Enter the 6-digit verification code sent to your Gmail inbox.'
              : mode === 'signup'
              ? 'Sign up with your personal Google account or email & password.'
              : 'Access your cloud compensation analytics & intelligence suite.'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-slide-down">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ── MODE: 2FA VERIFICATION CODE SCREEN ── */}
        {mode === '2fa' ? (
          <form onSubmit={handleVerify2FA} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-2">
                6-Digit Gmail OTP Code
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 849201"
                  value={twoFactorCode}
                  onChange={e => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] text-[var(--text-primary)] font-mono text-center text-lg tracking-[0.3em] font-bold focus:outline-none focus:border-blue-500 transition"
                  autoFocus
                />
              </div>
              <p className="text-[11px] text-[var(--text-muted)] mt-1.5 text-center">
                Backup code: <span className="font-mono text-sky-400 font-bold">123456</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="azure-btn-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Verify Code & Enter</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs pt-2">
              <button
                type="button"
                onClick={handleResend2FA}
                className="text-sky-400 font-semibold hover:underline"
              >
                Resend Code
              </button>
              <button
                type="button"
                onClick={() => { setMode('signin'); resetForm(); }}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        ) : (
          /* ── STANDARD CLEAN SIGN IN / SIGN UP FORM ── */
          <div className="space-y-4">
            
            {/* Continue with Google */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] font-bold text-xs flex items-center justify-center gap-3 transition shadow-sm group hover:border-blue-500/40"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.1c0 2.8.7 5.4 1.9 7.8l3.7-2.9z" />
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-[var(--border-color)]" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-muted)]">
                or with email
              </span>
              <div className="flex-1 h-px bg-[var(--border-color)]" />
            </div>

            {/* Standard Email & Password Form */}
            <form onSubmit={handleEmailAuth} className="space-y-3.5">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-blue-500 transition"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-blue-500 transition"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-blue-500 transition"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="azure-btn-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <span>{mode === 'signup' ? 'Create Free Account' : 'Sign In'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="text-center pt-1.5 text-xs text-[var(--text-muted)]">
              {mode === 'signup' ? (
                <span>
                  Already have an account?{' '}
                  <button
                    onClick={() => { setMode('signin'); resetForm(); }}
                    className="text-sky-400 font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </span>
              ) : (
                <span>
                  Don't have an account?{' '}
                  <button
                    onClick={() => { setMode('signup'); resetForm(); }}
                    className="text-sky-400 font-bold hover:underline"
                  >
                    Sign Up
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
