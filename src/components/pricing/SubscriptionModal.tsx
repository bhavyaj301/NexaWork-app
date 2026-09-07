import React, { useState } from 'react';
import {
  X,
  Check,
  Zap,
  ShieldCheck,
  Sparkles,
  CreditCard,
  CheckCircle2,
  Crown
} from 'lucide-react';
import { SubscriptionTier, SubscriptionPlan } from '../../types/theme';

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter Tier',
    monthlyPrice: 0,
    annualPrice: 0,
    description: 'Perfect for individual developers exploring cloud job trends and salary benchmarks.',
    features: [
      'Access to 2.48M+ macro job market trends',
      'Global 12-city salary & purchasing power map',
      'Basic skill co-occurrence graph',
      'Standard job search with salary filters',
      'Simulated Cloud intelligence engine'
    ],
    cta: 'Current Free Plan'
  },
  {
    id: 'pro',
    name: 'Professional Pro',
    badge: 'Most Popular',
    popular: true,
    monthlyPrice: 29,
    annualPrice: 24,
    description: 'For engineers and architects seeking top compensation and tailored AI roadmaps.',
    features: [
      'Everything in Starter, plus:',
      'AI Skill Gap Diagnostic & 12-Week Roadmap Generator',
      '1-Click AI Interview Question & Answer Generator',
      'Cloud Tailored Cover Letter Builder',
      'Deep-dive Certification ROI Calculator',
      'Unlimited Market Copilot AI chats (GPT-4o)'
    ],
    cta: 'Upgrade to Pro'
  },
  {
    id: 'enterprise',
    name: 'Enterprise Cloud Suite',
    badge: 'For Tech Teams',
    monthlyPrice: 99,
    annualPrice: 79,
    description: 'For engineering leaders, tech recruiters, and enterprises hiring top cloud talent.',
    features: [
      'Everything in Professional Pro, plus:',
      'Direct OpenAI & Cognitive Search API connector',
      'Live real-time streaming telemetry pipeline',
      'Custom company salary benchmarking & export (CSV/JSON)',
      'Candidate resume bulk match analysis',
      'Priority 24/7 Enterprise Cloud SLA'
    ],
    cta: 'Upgrade to Enterprise'
  }
];

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: SubscriptionTier;
  onSelectTier: (tier: SubscriptionTier) => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentTier,
  onSelectTier
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [processingTier, setProcessingTier] = useState<SubscriptionTier | null>(null);
  const [successTier, setSuccessTier] = useState<SubscriptionTier | null>(null);

  if (!isOpen) return null;

  const handleChooseTier = (tier: SubscriptionTier) => {
    if (tier === currentTier) return;
    setProcessingTier(tier);
    setTimeout(() => {
      onSelectTier(tier);
      setProcessingTier(null);
      setSuccessTier(tier);
      setTimeout(() => {
        setSuccessTier(null);
        onClose();
      }, 1200);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-6 sm:p-8 border-b border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--bg-surface-subtle)]">
          <div>
            <div className="flex items-center gap-2">
              <span className="azure-badge">SaaS Subscription Plans</span>
              <span className="text-xs text-emerald-400 font-bold">Save 20% on Annual Billing</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mt-1">
              Unlock Advanced AI Market Intelligence
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
              Upgrade to unlock unlimited AI diagnostics, personalized roadmaps, and enterprise telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Billing Cycle Toggle: Monthly vs Annual */}
            <div className="bg-[var(--bg-surface)] p-1 rounded-2xl border border-[var(--border-color)] flex items-center text-xs shadow-inner">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
                  billingCycle === 'monthly'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                  billingCycle === 'annual'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span>Annual</span>
                <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
                  -20%
                </span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="p-6 sm:p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {subscriptionPlans.map(plan => {
            const isCurrent = currentTier === plan.id;
            const isProcessing = processingTier === plan.id;
            const isSuccess = successTier === plan.id;
            const price = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;

            return (
              <div
                key={plan.id}
                className={`saas-card p-6 sm:p-7 rounded-2xl flex flex-col justify-between space-y-6 relative transition-all ${
                  plan.popular
                    ? 'border-[#0078d4] ring-2 ring-[#0078d4]/30 shadow-xl shadow-blue-500/15'
                    : 'border-[var(--border-color)]'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md">
                    {plan.badge}
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-[var(--text-primary)] flex items-center gap-1.5">
                      {plan.name}
                      {plan.popular && <Crown className="w-4 h-4 text-amber-400" />}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">{plan.description}</p>
                  </div>

                  {/* Pricing Display */}
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] font-mono">
                        ${price}
                      </span>
                      <span className="text-xs font-semibold text-[var(--text-muted)]">
                        / user / month
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-sky-400">
                      {plan.monthlyPrice === 0
                        ? '100% Free Forever'
                        : billingCycle === 'annual'
                        ? `Billed annually ($${plan.annualPrice * 12}/yr)`
                        : `Billed monthly ($${plan.monthlyPrice}/mo)`}
                    </span>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-2.5 pt-4 border-t border-[var(--border-color)] text-xs">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-[var(--text-secondary)]">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed font-medium">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plan Action CTA */}
                <button
                  onClick={() => handleChooseTier(plan.id)}
                  disabled={isCurrent || isProcessing}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                    isCurrent
                      ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] border border-[var(--border-color)] cursor-default'
                      : isSuccess
                      ? 'bg-emerald-600 text-white'
                      : plan.popular
                      ? 'azure-btn-primary shadow-lg shadow-blue-500/25 hover:scale-105'
                      : 'azure-btn-secondary hover:scale-105'
                  }`}
                >
                  {isProcessing ? (
                    <span>Activating...</span>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>Subscribed!</span>
                    </>
                  ) : isCurrent ? (
                    <span>Active Plan</span>
                  ) : (
                    <span>{plan.cta}</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
