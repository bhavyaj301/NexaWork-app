import React, { useState, useEffect } from 'react';
import { SaaSNavbar } from './components/layout/SaaSNavbar';
import { LandingPage } from './components/landing/LandingPage';
import { ServicesHub, ServiceId } from './components/services/ServicesHub';
import { SubscriptionModal } from './components/pricing/SubscriptionModal';
import { AzureConfigModal } from './components/layout/AzureConfigModal';
import { AuthModal } from './components/auth/AuthModal';
import { TwoFactorSetupModal } from './components/auth/TwoFactorSetupModal';
import { FloatingAICopilotModal } from './components/copilot/FloatingAICopilotModal';
import { UserDataViewerModal } from './components/auth/UserDataViewerModal';
import { ThemeMode, SubscriptionTier } from './types/theme';
import { authService } from './services/authService';
import { User } from './types/auth';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'services'>('landing');
  const [activeService, setActiveService] = useState<ServiceId>('overview');
  
  // Modals
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState<boolean>(false);
  const [cloudConfigOpen, setCloudConfigOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState<boolean>(false);
  const [copilotModalOpen, setCopilotModalOpen] = useState<boolean>(false);
  const [userDataLogsOpen, setUserDataLogsOpen] = useState<boolean>(false);

  // Pending service target when prompting unauthenticated user to log in
  const [pendingServiceAfterAuth, setPendingServiceAfterAuth] = useState<ServiceId | null>(null);

  // User State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = authService.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return unsub;
  }, []);

  // Theme Management
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('talentpulse_theme') as ThemeMode) || 'dark';
  });

  // Subscription Management
  const [currentSubscription, setCurrentSubscription] = useState<SubscriptionTier>(() => {
    return (localStorage.getItem('talentpulse_subscription') as SubscriptionTier) || 'starter';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('talentpulse_theme', theme);
  }, [theme]);

  const handleSelectSubscription = (tier: SubscriptionTier) => {
    setCurrentSubscription(tier);
    localStorage.setItem('talentpulse_subscription', tier);
  };

  // 🔒 Service Access Gate: Requires Login / Sign Up
  const handleLaunchService = (serviceId: ServiceId) => {
    if (!currentUser) {
      setPendingServiceAfterAuth(serviceId);
      setAuthMode('signin');
      setAuthModalOpen(true);
      return;
    }
    setActiveService(serviceId);
    setCurrentView('services');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    if (pendingServiceAfterAuth) {
      setActiveService(pendingServiceAfterAuth);
      setCurrentView('services');
      setPendingServiceAfterAuth(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSignOut = () => {
    authService.signOut();
    setCurrentView('landing');
    setCopilotModalOpen(false);
    setUserDataLogsOpen(false);
  };

  const handleToggleCopilot = () => {
    if (!currentUser) {
      setAuthMode('signin');
      setAuthModalOpen(true);
      return;
    }
    setCopilotModalOpen(!copilotModalOpen);
  };

  return (
    /* Full-viewport root — no max-width cap, fills 100% on all screens */
    <div className="min-h-screen w-full bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col antialiased selection:bg-blue-600 selection:text-white transition-colors duration-300">

      {/* ── Full-width sticky navbar ── */}
      <SaaSNavbar
        currentView={currentView}
        activeService={activeService}
        onNavigateLanding={handleBackToLanding}
        onNavigateService={handleLaunchService}
        onOpenPricing={() => setSubscriptionModalOpen(true)}
        onOpenAzureConfig={() => setCloudConfigOpen(true)}
        theme={theme}
        onToggleTheme={setTheme}
        currentSubscription={currentSubscription}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onSignOut={handleSignOut}
        onOpen2FASetup={() => setTwoFactorModalOpen(true)}
        onOpenUserDataLogs={() => setUserDataLogsOpen(true)}
      />

      {/* ── Main content: generous top padding ensures content never touches navbar ── */}
      <main className="flex-1 w-full pt-6 sm:pt-10 pb-24">
        {currentView === 'landing' || !currentUser ? (
          <LandingPage
            onLaunchService={handleLaunchService}
            onOpenPricingModal={() => setSubscriptionModalOpen(true)}
            onOpenAzureConfig={() => setCloudConfigOpen(true)}
            currentSubscription={currentSubscription}
          />
        ) : (
          <ServicesHub
            activeService={activeService}
            onSelectService={setActiveService}
            onBackToLanding={handleBackToLanding}
          />
        )}
      </main>

      {/* ── Floating AI Copilot Button ── */}
      <div className="fixed bottom-7 right-7 z-40 group/fab">
        {/* Pulse ring */}
        {!copilotModalOpen && (
          <span className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping pointer-events-none" />
        )}

        {/* Tooltip */}
        {!copilotModalOpen && (
          <div className="absolute bottom-[calc(100%+12px)] right-0 whitespace-nowrap
            bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)]
            text-[11px] font-semibold px-3 py-1.5 rounded-lg shadow-xl
            opacity-0 scale-95 translate-y-1
            group-hover/fab:opacity-100 group-hover/fab:scale-100 group-hover/fab:translate-y-0
            transition-all duration-200 pointer-events-none">
            ✨ Ask AI Copilot {!currentUser ? '(Sign in required)' : ''}
            <span className="absolute -bottom-1 right-4 w-2 h-2 rotate-45
              bg-[var(--bg-surface)] border-r border-b border-[var(--border-color)]" />
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleToggleCopilot}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-200 ${
            copilotModalOpen
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/40 rotate-90'
              : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/40 hover:scale-110 hover:shadow-emerald-500/60 active:scale-95'
          }`}
          title={copilotModalOpen ? 'Close AI Copilot' : 'Open AI Copilot'}
        >
          {copilotModalOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
            </svg>
          )}
        </button>
      </div>

      {/* Floating AI Copilot Modal Popup */}
      <FloatingAICopilotModal
        isOpen={copilotModalOpen && !!currentUser}
        onClose={() => setCopilotModalOpen(false)}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onSuccess={handleAuthSuccess}
      />

      {/* Two-Factor Verification Setup Modal */}
      <TwoFactorSetupModal
        isOpen={twoFactorModalOpen}
        onClose={() => setTwoFactorModalOpen(false)}
        currentUser={currentUser}
      />

      {/* Password-Protected User Login/Logout Data Modal */}
      <UserDataViewerModal
        isOpen={userDataLogsOpen}
        onClose={() => setUserDataLogsOpen(false)}
      />

      {/* Subscription Pricing Modal */}
      <SubscriptionModal
        isOpen={subscriptionModalOpen}
        onClose={() => setSubscriptionModalOpen(false)}
        currentTier={currentSubscription}
        onSelectTier={handleSelectSubscription}
      />

      {/* Cloud Config Modal */}
      <AzureConfigModal
        isOpen={cloudConfigOpen}
        onClose={() => setCloudConfigOpen(false)}
        onConfigSaved={() => {}}
      />
    </div>
  );
};

export default App;
