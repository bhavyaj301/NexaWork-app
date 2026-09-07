import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Settings2,
  Crown,
  Menu,
  X,
  LayoutGrid,
  Home,
  TrendingUp,
  Sun,
  Moon,
  Zap,
  LogIn,
  UserPlus,
  LogOut,
  ShieldCheck,
  KeyRound
} from 'lucide-react';
import { ThemeMode, SubscriptionTier } from '../../types/theme';
import { allServices, ServiceId } from '../services/ServicesHub';
import { User } from '../../types/auth';

interface SaaSNavbarProps {
  currentView: 'landing' | 'services';
  activeService: ServiceId;
  onNavigateLanding: () => void;
  onNavigateService: (service: ServiceId) => void;
  onOpenPricing: () => void;
  onOpenAzureConfig: () => void;
  theme: ThemeMode;
  onToggleTheme: (newTheme: ThemeMode) => void;
  currentSubscription: SubscriptionTier;
  // Auth additions
  currentUser: User | null;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onSignOut: () => void;
  onOpen2FASetup: () => void;
  onOpenUserDataLogs?: () => void;
}

/* ── Tooltip wrapper ─────────────────────────────────── */
const Tip: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="relative group/tip">
    {children}
    <div className="pointer-events-none absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 whitespace-nowrap
      bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)]
      text-[11px] font-semibold px-3 py-1.5 rounded-lg shadow-xl z-[200]
      opacity-0 scale-95 group-hover/tip:opacity-100 group-hover/tip:scale-100
      transition-all duration-150">
      {label}
      <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45
        bg-[var(--bg-surface)] border-l border-t border-[var(--border-color)]" />
    </div>
  </div>
);

export const SaaSNavbar: React.FC<SaaSNavbarProps> = ({
  currentView,
  activeService,
  onNavigateLanding,
  onNavigateService,
  onOpenPricing,
  onOpenAzureConfig,
  theme,
  onToggleTheme,
  currentSubscription,
  currentUser,
  onOpenAuth,
  onSignOut,
  onOpen2FASetup,
  onOpenUserDataLogs
}) => {
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 768) setMobileMenuOpen(false); };
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  const ThemeIcon = theme === 'light' ? Sun : theme === 'midnight' ? Zap : Moon;
  const themeIconColor = theme === 'light' ? 'text-amber-500' : theme === 'midnight' ? 'text-purple-400' : 'text-sky-400';
  const themeLabel = theme === 'light' ? 'Light Mode' : theme === 'midnight' ? 'Midnight Mode' : 'Dark Mode';

  const tierLabel = currentSubscription === 'enterprise' ? 'Enterprise Plan' : currentSubscription === 'pro' ? 'Pro Plan' : 'Starter Plan';
  const tierColor = currentSubscription === 'enterprise' ? 'text-purple-400' : currentSubscription === 'pro' ? 'text-sky-300' : 'text-amber-400';
  const tierBg   = currentSubscription === 'enterprise' ? 'bg-purple-500/10 border-purple-500/30' : currentSubscription === 'pro' ? 'bg-blue-500/10 border-blue-500/30' : '';

  const iconBtn = 'w-9 h-9 flex items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-hover)] transition-all duration-150';

  return (
    <nav
      className="sticky top-0 w-full border-b border-[var(--border-color)] shadow-md overflow-visible"
      style={{ zIndex: 100, background: 'var(--bg-surface)', backdropFilter: 'blur(16px)' }}
    >
      <div className="w-full h-16 flex items-center justify-between px-4 sm:px-8 lg:px-12 xl:px-16">

        {/* ── LEFT: Clean Azure Brand Logo ── */}
        <div className="shrink-0 flex items-center">
          <button onClick={onNavigateLanding} className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform shrink-0">
              <img src="/logo.jpg" alt="Azure TalentPulse logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col leading-none text-left">
              <span className="text-base font-extrabold text-[var(--text-primary)] tracking-tight">
                Azure<span className="text-sky-400">TalentPulse</span>
              </span>
              <span className="hidden sm:block text-[11px] text-[var(--text-muted)] font-medium mt-0.5">
                Microsoft Cloud Intelligence
              </span>
            </div>
          </button>
        </div>

        {/* ── CENTER: Nav links (Home, Services, Pricing, Trends) ── */}
        <div className="hidden md:flex items-center justify-center gap-1.5" ref={dropdownRef}>

          {/* Home */}
          <button
            onClick={onNavigateLanding}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
              currentView === 'landing'
                ? 'text-white bg-blue-600 shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
            }`}
          >
            <Home className="w-3.5 h-3.5 shrink-0" />
            <span>Home</span>
          </button>

          {/* Services dropdown */}
          <div className="relative">
            <button
              onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                currentView === 'services' || servicesDropdownOpen
                  ? 'text-sky-400 bg-blue-500/10 border border-blue-500/25'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
              <span>Services</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180 text-sky-400' : ''}`} />
            </button>

            {servicesDropdownOpen && (
              <div
                className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+10px)] w-[580px] rounded-2xl p-5 grid grid-cols-2 gap-2 animate-slide-down"
                style={{ zIndex: 9999, background: 'var(--bg-surface)', border: '1px solid var(--border-color)', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}
              >
                <div className="col-span-2 flex items-center justify-between pb-3 mb-1 border-b border-[var(--border-color)]">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--text-muted)]">NexaWork Intelligence Suite</span>
                  <span className="text-sky-400 font-bold text-[11px]">9 Modules</span>
                </div>
                {allServices.map(service => {
                  const Icon = service.icon;
                  const isCurrent = currentView === 'services' && activeService === service.id;
                  return (
                    <button
                      key={service.id}
                      onClick={() => { onNavigateService(service.id); setServicesDropdownOpen(false); }}
                      className={`p-3 rounded-xl text-left flex items-center gap-3 transition-all ${
                        isCurrent ? 'bg-blue-600/15 border border-blue-500/35' : 'hover:bg-[var(--bg-surface-hover)] border border-transparent'
                      }`}
                    >
                      <div className={`p-2 rounded-lg text-white ${service.iconBg} shrink-0 shadow-sm`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-[var(--text-primary)] block truncate">{service.title}</span>
                        <p className="text-[11px] text-[var(--text-muted)] line-clamp-1 mt-0.5">{service.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pricing */}
          <button
            onClick={onOpenPricing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-all duration-150"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Pricing</span>
          </button>

          {/* Trends */}
          <button
            onClick={() => onNavigateService('overview')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
              currentView === 'services' && activeService === 'overview'
                ? 'text-sky-400 bg-blue-500/10 border border-blue-500/25'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>Trends</span>
          </button>
        </div>

        {/* ── RIGHT: Auth & Utility buttons (No DB/Gmail icons) ── */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Theme Toggle */}
          <Tip label={themeLabel}>
            <button
              onClick={() => {
                const next: ThemeMode = theme === 'dark' ? 'light' : theme === 'light' ? 'midnight' : 'dark';
                onToggleTheme(next);
              }}
              className={iconBtn}
            >
              <ThemeIcon className={`w-4 h-4 ${themeIconColor}`} />
            </button>
          </Tip>

          {/* Subscription Tier */}
          <Tip label={tierLabel}>
            <button onClick={onOpenPricing} className={`${iconBtn} ${tierBg}`}>
              <Crown className={`w-4 h-4 ${tierColor}`} />
            </button>
          </Tip>

          {/* Cloud Settings */}
          <Tip label="Cloud Settings">
            <button onClick={onOpenAzureConfig} className={iconBtn}>
              <Settings2 className="w-4 h-4 text-sky-400" />
            </button>
          </Tip>

          {/* Clean Divider */}
          <div className="hidden sm:block w-px h-5 bg-[var(--border-color)] mx-1" />

          {/* ── Single Line Sign In & Sign Up (or User Profile) ── */}
          {currentUser ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-color)] transition group shrink-0 whitespace-nowrap"
              >
                <img
                  src={currentUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}`}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover bg-blue-500/20"
                />
                <div className="hidden lg:flex flex-col text-left leading-none">
                  <span className="text-xs font-bold text-[var(--text-primary)] max-w-[100px] truncate">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-sky-400 capitalize font-medium">
                    {currentUser.provider === 'google' ? 'Google' : 'Verified'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-sky-400 transition" />
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div
                  className="absolute right-0 top-[calc(100%+8px)] w-60 rounded-2xl p-2.5 shadow-2xl border border-[var(--border-color)] animate-slide-down space-y-1"
                  style={{ zIndex: 9999, background: 'var(--bg-surface)' }}
                >
                  <div className="p-2.5 border-b border-[var(--border-color)] mb-1">
                    <p className="text-xs font-bold text-[var(--text-primary)]">{currentUser.name}</p>
                    <p className="text-[11px] text-[var(--text-muted)] truncate">{currentUser.email}</p>
                  </div>

                  <button
                    onClick={() => { onOpen2FASetup(); setUserDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] flex items-center justify-between transition"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-purple-400" />
                      <span>Two-Step Verification</span>
                    </div>
                    {currentUser.twoFactorEnabled && (
                      <span className="text-[10px] text-emerald-400 font-bold">ON</span>
                    )}
                  </button>

                  {onOpenUserDataLogs && (
                    <button
                      onClick={() => { onOpenUserDataLogs(); setUserDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] flex items-center gap-2 transition"
                    >
                      <KeyRound className="w-4 h-4 text-amber-400" />
                      <span>User Login/Logout Data</span>
                    </button>
                  )}

                  <div className="pt-1 border-t border-[var(--border-color)]">
                    <button
                      onClick={() => { onSignOut(); setUserDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
              <button
                onClick={() => onOpenAuth('signin')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-color)] transition flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-sky-400" />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => onOpenAuth('signup')}
                className="azure-btn-primary px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/25"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden ${iconBtn}`}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--border-color)] animate-slide-down" style={{ background: 'var(--bg-surface)' }}>
          <div className="px-5 py-4 flex flex-col gap-2">
            
            {currentUser ? (
              <div className="p-3.5 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={currentUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}`}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-xl object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold text-[var(--text-primary)]">{currentUser.name}</p>
                    <p className="text-[10px] text-sky-400">{currentUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => { onSignOut(); setMobileMenuOpen(false); }}
                  className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pb-2">
                <button
                  onClick={() => { onOpenAuth('signin'); setMobileMenuOpen(false); }}
                  className="flex-1 py-2.5 rounded-xl bg-[var(--bg-surface-subtle)] text-xs font-bold text-[var(--text-primary)] border border-[var(--border-color)] flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-sky-400" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => { onOpenAuth('signup'); setMobileMenuOpen(false); }}
                  className="flex-1 azure-btn-primary py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            <button onClick={() => { onNavigateLanding(); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition">
              <Home className="w-4 h-4 text-sky-400" /> Home
            </button>
            <button onClick={() => { onOpenPricing(); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition">
              <Crown className="w-4 h-4 text-amber-400" /> Pricing
            </button>
            <button onClick={() => { onNavigateService('overview'); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition">
              <TrendingUp className="w-4 h-4 text-sky-400" /> Trends
            </button>

            {currentUser && (
              <button onClick={() => { onOpen2FASetup(); setMobileMenuOpen(false); }}
                className="flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-purple-400 hover:bg-[var(--bg-surface-hover)] transition">
                <ShieldCheck className="w-4 h-4" /> Two-Step Verification (2FA)
              </button>
            )}

            <div className="flex items-center gap-3 pt-3 mt-1 border-t border-[var(--border-color)]">
              <button onClick={() => { const n: ThemeMode = theme === 'dark' ? 'light' : theme === 'light' ? 'midnight' : 'dark'; onToggleTheme(n); }}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-secondary)]">
                <ThemeIcon className={`w-4 h-4 ${themeIconColor}`} />
                <span>{themeLabel}</span>
              </button>
              <button onClick={() => { onOpenAzureConfig(); setMobileMenuOpen(false); }}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-secondary)]">
                <Settings2 className="w-4 h-4 text-sky-400" />
                <span>Cloud Config</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
