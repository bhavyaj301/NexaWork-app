import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Globe2,
  Crown,
  Building2,
  Cpu,
  Terminal,
  Layers,
  Zap,
  Activity,
  Compass
} from 'lucide-react';
import { allServices, ServiceId } from '../services/ServicesHub';
import { subscriptionPlans } from '../pricing/SubscriptionModal';
import { macroStats } from '../../services/marketData';
import { formatSalary, formatNumber } from '../../utils/formatters';
import { SubscriptionTier } from '../../types/theme';
import { ModernVibrantBackground } from '../effects/ModernVibrantBackground';

interface LandingPageProps {
  onLaunchService: (serviceId: ServiceId) => void;
  onOpenPricingModal: () => void;
  onOpenAzureConfig: () => void;
  currentSubscription: SubscriptionTier;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchService,
  onOpenPricingModal,
  onOpenAzureConfig,
  currentSubscription,
}) => {
  const [mockupTab, setMockupTab] = useState<'trends' | 'gap' | 'salary' | 'jobs'>('trends');
  const [quickExp, setQuickExp] = useState<number>(5);
  const [quickRole, setQuickRole] = useState<string>('GenAI Architect');
  const [quizBackground, setQuizBackground] = useState<string>('Full-Stack Web Dev');
  
  // Landing Page Billing Cycle Toggle: Monthly vs Annual
  const [pricingCycle, setPricingCycle] = useState<'monthly' | 'annual'>('monthly');

  // Mouse parallax state for interactive 3D hero tilt
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20;
      const y = (e.clientY / innerHeight - 0.5) * 20;
      setMouseOffset({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const quickEstimatedSalary = 135000 + quickExp * 8500 + (quickRole.includes('GenAI') ? 25000 : 15000);

  const careerMatchResults: Record<string, { target: string; targetCert: string; salary: string; lift: string; serviceId: ServiceId }> = {
    'Full-Stack Web Dev': { target: 'Lead GenAI & LLM Solutions Architect', targetCert: 'AI Engineering & Semantic Models', salary: '$235,000', lift: '+$45,000 / yr', serviceId: 'skillgap' },
    'DevOps / SysAdmin': { target: 'Principal Kubernetes & Cloud Platform Engineer', targetCert: 'Cloud Architecture & DevOps', salary: '$215,000', lift: '+$38,000 / yr', serviceId: 'skillgap' },
    'Data Analyst / SQL': { target: 'Senior Big Data & Analytics Architect', targetCert: 'Data Engineering & Fabric', salary: '$175,000', lift: '+$32,000 / yr', serviceId: 'skillgap' },
    'Security Analyst': { target: 'Staff Cloud Security & Zero Trust Architect', targetCert: 'Cybersecurity & Zero Trust', salary: '$189,000', lift: '+$40,000 / yr', serviceId: 'skillgap' },
  };
  const matchedCareer = careerMatchResults[quizBackground] || careerMatchResults['Full-Stack Web Dev'];

  return (
    <div className="w-full flex flex-col items-center animate-fade-in space-y-16 sm:space-y-24 relative overflow-hidden">

      {/* ── 1. Clearly Visible Modern Vibrant SaaS Background Animation ── */}
      <ModernVibrantBackground />

      {/* ═══════════════════════════════ 1. HERO ═══════════════════════════════ */}
      <section className="page-section text-center flex flex-col items-center pt-4 sm:pt-8 relative z-10">
        <div className="page-col flex flex-col items-center text-center relative z-10">

          {/* Shimmering Animated Headline with Glowing Aurora Aura Background */}
          <h1 className="text-3xl sm:text-5xl lg:text-[3.6rem] font-extrabold text-[var(--text-primary)] tracking-tight leading-tight max-w-4xl mx-auto mb-4 drop-shadow-lg relative">
            <span className="relative z-10 text-white drop-shadow-md">Predictive Job Market Intelligence</span>
            <br />
            <span className="relative z-10 text-white/90">for the </span>
            <span className="text-aurora-glow relative z-10">
              <span className="animate-text-shimmer drop-shadow-2xl font-black">
                Modern Tech Era
              </span>
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-base text-slate-200 dark:text-slate-200 font-medium max-w-xl mx-auto leading-relaxed mb-8 drop-shadow-sm">
            Analyze 2.48M+ verified technology job postings in real-time. Benchmark compensation,
            diagnose resume skill gaps, and generate customized 12-week career pathways with NexaWork AI.
          </p>

          {/* Action CTAs with Hover Lift */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto mb-12">
            <button
              onClick={() => onLaunchService('overview')}
              className="azure-btn-primary px-7 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 w-full sm:w-auto shadow-xl shadow-blue-600/40 hover:scale-105 active:scale-95 transition-all text-white"
            >
              <span>Launch Free Market Analyzer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onLaunchService('resume-analyzer')}
              className="azure-btn-secondary px-7 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 w-full sm:w-auto hover:scale-105 active:scale-95 transition-all backdrop-blur-md text-white border-slate-700 bg-slate-900/80 hover:bg-slate-800"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span className="text-white font-semibold">AI Resume Analyzer & Matcher</span>
            </button>
          </div>

          {/* Interactive Floating Product Mockup with Shimmer Beam Border */}
          <div
            className="w-full max-w-4xl mx-auto animate-antigravity transition-transform duration-300"
            style={{
              transform: `perspective(1000px) rotateY(${mouseOffset.x * 0.15}deg) rotateX(${mouseOffset.y * -0.15}deg)`,
            }}
          >
            <div className="saas-hero-mockup p-5 sm:p-7 rounded-2xl text-left border border-[var(--border-color)] antigravity-gradient-border shadow-2xl backdrop-blur-xl">
              
              {/* Window chrome */}
              <div className="flex flex-wrap items-center justify-between pb-4 mb-5 border-b border-[var(--border-color)] gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80 animate-pulse" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80 animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 animate-pulse" style={{ animationDelay: '0.4s' }} />
                  <span className="text-xs text-slate-400 font-mono ml-2 font-medium">nexawork.app/live-preview</span>
                </div>
                <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-700 text-xs font-bold">
                  {(['trends', 'gap', 'salary', 'jobs'] as const).map((tab, i) => (
                    <button
                      key={tab}
                      onClick={() => setMockupTab(tab)}
                      className={`px-3 py-1 rounded-lg transition-all text-xs font-bold ${
                        mockupTab === tab
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {['📈 Trends', '🎯 Resume AI', '💰 Salary', '💼 Jobs'][i]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab bodies */}
              {mockupTab === 'trends' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'GenAI Surge', value: '+184% YoY', sub: 'OpenAI & Semantic Models', vc: 'text-white', sc: 'text-sky-300' },
                    { label: 'Avg Cloud Base', value: '$178,500', sub: '+9.2% above general tech', vc: 'text-emerald-400', sc: 'text-emerald-300' },
                    { label: 'Remote Share', value: '82.6%', sub: '44% Hybrid · 38% Full Remote', vc: 'text-purple-300', sc: 'text-purple-300' },
                  ].map(s => (
                    <div key={s.label} className="p-4 sm:p-5 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] text-center flex flex-col justify-center gap-1.5 hover:border-blue-500/40 hover:scale-[1.02] transition-all">
                      <span className="text-[11px] text-slate-300 font-bold uppercase tracking-wider">{s.label}</span>
                      <span className={`text-xl sm:text-2xl font-extrabold font-mono ${s.vc}`}>{s.value}</span>
                      <span className={`text-xs font-bold leading-normal ${s.sc}`}>{s.sub}</span>
                    </div>
                  ))}
                </div>
              )}
              {mockupTab === 'gap' && (
                <div className="p-5 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex flex-col gap-1 text-left">
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">AI Diagnostic Preview</span>
                    <h4 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">Target: Lead GenAI & LLM Solutions Architect</h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">Critical gaps identified: LLM Orchestration, Semantic Kernel, Vector Search.</p>
                  </div>
                  <div className="flex flex-col gap-0.5 text-left sm:text-right shrink-0">
                    <span className="text-xl font-extrabold text-emerald-400 font-mono">+$45,000 / yr</span>
                    <span className="text-xs text-[var(--text-muted)]">Projected Salary Lift</span>
                  </div>
                </div>
              )}
              {mockupTab === 'salary' && (
                <div className="p-5 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex flex-col gap-1 text-left">
                    <span className="text-xs text-[var(--text-muted)] font-bold uppercase">Estimated Total Compensation</span>
                    <span className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono">$235,000 – $285,000</span>
                    <span className="text-xs text-sky-400 leading-relaxed font-semibold">Base + 20% Annual Bonus + $45k Equity Grant</span>
                  </div>
                  <button onClick={() => onLaunchService('salary')} className="azure-btn-primary text-xs px-4 py-2 shrink-0">Open Simulator</button>
                </div>
              )}
              {mockupTab === 'jobs' && (
                <div className="p-5 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex flex-col gap-1 text-left">
                    <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Latest Ingested Position</span>
                    <h4 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">Lead GenAI & LLM Solutions Architect</h4>
                    <span className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">Cloud AI Ecosystems · <strong className="text-emerald-400 font-mono font-bold">$195k – $275k</strong> · Remote OK</span>
                  </div>
                  <button onClick={() => onLaunchService('jobs')} className="azure-btn-primary text-xs px-4 py-2 shrink-0">View Job & Prep</button>
                </div>
              )}

              {/* Mockup footer */}
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-4 mt-4 border-t border-[var(--border-color)]">
                <span className="flex items-center gap-2 font-medium"><span className="pulse-dot" /> Live Streaming Ingestion (482 evt/sec)</span>
                <button onClick={() => onLaunchService(mockupTab === 'gap' ? 'skillgap' : mockupTab === 'salary' ? 'salary' : mockupTab === 'jobs' ? 'jobs' : 'overview')} className="text-sky-400 font-bold hover:underline flex items-center gap-1.5">
                  <span>Launch Full Module</span><ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ 2. METRICS ═══════════════════════════════ */}
      <section className="page-section relative z-10">
        <div className="page-col">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[
              { label: 'Active Tech Listings', value: formatNumber(macroStats.totalActiveJobs), sub: 'Verified Postings', vc: 'text-[var(--text-primary)]', sc: 'text-emerald-400' },
              { label: 'YoY Hiring Growth', value: `+${macroStats.yoyHiringGrowth}%`, sub: 'Cloud & AI Surge', vc: 'text-emerald-400', sc: 'text-[var(--text-muted)]' },
              { label: 'Median Tech Base', value: formatSalary(macroStats.avgTechSalary), sub: 'Annual Compensation', vc: 'text-sky-400', sc: 'text-[var(--text-muted)]' },
              { label: 'Remote / Hybrid', value: '82.6%', sub: 'Flexible Work Friendly', vc: 'text-purple-400', sc: 'text-[var(--text-muted)]' },
            ].map(m => (
              <div key={m.label} className="saas-card p-5 sm:p-6 text-center flex flex-col justify-center gap-1.5 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1 transition-all interactive-glow-card">
                <span className="text-[11px] text-[var(--text-muted)] font-bold uppercase tracking-widest">{m.label}</span>
                <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${m.vc}`}>{m.value}</span>
                <span className={`text-xs font-semibold ${m.sc}`}>{m.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ 3. TRUST BAR ═══════════════════════════════ */}
      <section className="page-section text-center relative z-10">
        <div className="page-col flex flex-col items-center gap-4">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Integrated with Global Enterprise Cloud & Talent Ecosystems
          </span>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-85 text-xs font-bold text-[var(--text-secondary)]">
            <span className="flex items-center gap-2 hover:text-sky-400 hover:scale-105 transition-all"><Building2 className="w-4 h-4 text-sky-400" /> Cloud Platforms</span>
            <span className="flex items-center gap-2 hover:text-purple-400 hover:scale-105 transition-all"><Cpu className="w-4 h-4 text-purple-400" /> OpenAI & LLMs</span>
            <span className="flex items-center gap-2 hover:text-emerald-400 hover:scale-105 transition-all"><Terminal className="w-4 h-4 text-emerald-400" /> GitHub Enterprise</span>
            <span className="flex items-center gap-2 hover:text-blue-400 hover:scale-105 transition-all"><Layers className="w-4 h-4 text-blue-400" /> Big Data Lakehouses</span>
            <span className="flex items-center gap-2 hover:text-amber-400 hover:scale-105 transition-all"><Globe2 className="w-4 h-4 text-amber-400" /> Global Labor Feeds</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ 4. CAREER MATCHER ═══════════════════════════════ */}
      <section className="page-section relative z-10">
        <div className="page-col">
          <div className="saas-card p-6 sm:p-8 rounded-2xl w-full flex flex-col gap-6 text-center hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/10 transition-all">
            
            <div className="flex flex-col items-center gap-2">
              <span className="azure-badge animate-badge-glow shadow-md shadow-blue-500/20">Instant Career Diagnostic</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
                Find Your <span className="text-aurora-glow"><span className="animate-text-shimmer">Highest-Comp</span></span> Cloud Career Pathway
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-lg mx-auto leading-relaxed">
                Select your current background to discover your optimal target cloud role
                and estimated compensation leap.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {['Full-Stack Web Dev', 'DevOps / SysAdmin', 'Data Analyst / SQL', 'Security Analyst'].map(bg => (
                <button
                  key={bg}
                  onClick={() => setQuizBackground(bg)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    quizBackground === bg
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-105'
                      : 'bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)] hover:border-blue-500/30'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>

            <div className="p-5 sm:p-7 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left backdrop-blur-md">
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-sky-400">Recommended Target Role</span>
                <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] leading-snug">{matchedCareer.target}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Key Credentials: <strong className="text-white">{matchedCareer.targetCert}</strong>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-5 shrink-0">
                <div className="text-center sm:text-right flex flex-col">
                  <span className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider">Target Base</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono">{matchedCareer.salary}</span>
                  <span className="text-xs font-bold text-sky-400">{matchedCareer.lift}</span>
                </div>
                <button onClick={() => onLaunchService(matchedCareer.serviceId)} className="azure-btn-primary text-xs px-5 py-2.5 flex items-center gap-2 hover:scale-105 transition-transform">
                  <span>Build 12-Week Roadmap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ 5. SERVICES GRID ═══════════════════════════════ */}
      <section className="page-section relative z-10">
        <div className="page-col flex flex-col gap-8">
          
          <div className="flex flex-col items-center gap-2 text-center max-w-2xl mx-auto">
            <span className="azure-badge animate-badge-glow shadow-md shadow-blue-500/20">Enterprise Intelligence Suite</span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              9 Powerful <span className="text-aurora-glow"><span className="animate-text-shimmer">Cloud Labor Intelligence</span></span> Modules
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Everything you need to analyze tech hiring momentum, benchmark compensation,
              and accelerate your cloud career.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {allServices.map(service => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  onClick={() => onLaunchService(service.id)}
                  className="saas-card p-5 sm:p-6 rounded-2xl cursor-pointer flex flex-col justify-between gap-4 group hover:border-[#0078d4] hover:scale-[1.03] hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-200 interactive-glow-card"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-xl text-white ${service.iconBg} shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-200`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      {service.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-sky-400 border border-blue-500/20">
                          {service.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)]">{service.category}</span>
                      <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] group-hover:text-sky-400 transition-colors leading-snug">{service.title}</h3>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3">{service.description}</p>
                    </div>
                  </div>
                  <div className="pt-2.5 border-t border-[var(--border-color)] flex items-center justify-between text-xs text-sky-400 font-bold group-hover:translate-x-1 transition-transform">
                    <span>Launch Module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ 6. SALARY SIMULATOR ═══════════════════════════════ */}
      <section className="page-section relative z-10">
        <div className="page-col">
          <div className="saas-card p-6 sm:p-8 rounded-2xl w-full hover:border-blue-500/40 transition-colors">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              
              {/* Left */}
              <div className="flex flex-col gap-4">
                <span className="azure-badge self-start animate-badge-glow shadow-md shadow-blue-500/20">Interactive Live Demo</span>
                <div className="flex flex-col gap-1.5">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
                    Test Your <span className="text-aurora-glow"><span className="animate-text-shimmer">Compensation</span></span> in Real-Time
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    Adjust your target specialization and experience level to preview estimated
                    median base compensation across enterprise cloud postings.
                  </p>
                </div>
                
                <div className="flex flex-col gap-4 mt-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[var(--text-primary)] tracking-wide">Target Specialization</label>
                    <select
                      value={quickRole}
                      onChange={e => setQuickRole(e.target.value)}
                      className="w-full bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] rounded-xl px-3.5 py-2 text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                    >
                      <option value="GenAI Architect">GenAI & LLM Solutions Architect</option>
                      <option value="Kubernetes Engineer">Staff Kubernetes Platform Engineer</option>
                      <option value="Data Fabric Lead">Big Data & Lakehouse Specialist</option>
                      <option value="Cloud Security">Zero Trust Cloud Security Architect</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-bold text-[var(--text-primary)]">
                      <span>Years of Experience</span>
                      <span className="text-sky-400 font-mono">{quickExp} Years</span>
                    </div>
                    <input
                      type="range" min={1} max={15} value={quickExp}
                      onChange={e => setQuickExp(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              {/* Right */}
              <div className="p-6 sm:p-7 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] text-center flex flex-col gap-3.5">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Estimated Median Base Pay</span>
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono tracking-tight">{formatSalary(quickEstimatedSalary)}</div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">+ 15–25% annual bonus & RSUs in Tier 1 enterprise roles.</p>
                <button onClick={() => onLaunchService('salary')} className="azure-btn-primary text-xs w-full py-2.5 flex items-center justify-center gap-2 hover:scale-105 transition-transform">
                  <span>Launch Full Multi-Variable Simulator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ 7. PRICING ═══════════════════════════════ */}
      <section className="page-section relative z-10">
        <div className="page-col flex flex-col gap-8">
          
          <div className="flex flex-col items-center gap-3 text-center max-w-2xl mx-auto">
            <span className="azure-badge animate-badge-glow shadow-md shadow-blue-500/20">Flexible SaaS Pricing</span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Plans for <span className="text-aurora-glow"><span className="animate-text-shimmer">Individuals & Engineering Teams</span></span>
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Choose the plan that fits your cloud career goals or enterprise recruiting pipeline.
            </p>

            {/* Monthly vs Annual Toggle on Landing Page */}
            <div className="bg-[var(--bg-surface-subtle)] p-1 rounded-2xl border border-[var(--border-color)] flex items-center text-xs shadow-inner mt-2">
              <button
                onClick={() => setPricingCycle('monthly')}
                className={`px-4 py-1.5 rounded-xl font-bold transition ${
                  pricingCycle === 'monthly'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setPricingCycle('annual')}
                className={`px-4 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                  pricingCycle === 'annual'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span>Annual Billing</span>
                <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {subscriptionPlans.map(plan => {
              const displayPrice = pricingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
              return (
                <div
                  key={plan.id}
                  className={`saas-card p-6 sm:p-7 rounded-2xl flex flex-col justify-between gap-5 relative transition-all ${
                    plan.popular ? 'border-[#0078d4] ring-2 ring-[#0078d4]/30 shadow-xl' : 'border-[var(--border-color)]'
                  }`}
                >
                  {plan.badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow">
                      {plan.badge}
                    </span>
                  )}
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-base font-extrabold text-[var(--text-primary)] flex items-center gap-1.5">
                        {plan.name}
                        {plan.popular && <Crown className="w-4 h-4 text-amber-400" />}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{plan.description}</p>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] font-mono">
                          ${displayPrice}
                        </span>
                        <span className="text-xs font-semibold text-[var(--text-muted)]">
                          / user / month
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-sky-400">
                        {plan.monthlyPrice === 0
                          ? '100% Free Forever'
                          : pricingCycle === 'annual'
                          ? `Billed annually ($${plan.annualPrice * 12}/yr)`
                          : `Billed monthly ($${plan.monthlyPrice}/mo)`}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2.5 pt-3.5 border-t border-[var(--border-color)] text-xs">
                      {plan.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2 text-[var(--text-secondary)] leading-relaxed">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="font-medium">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={onOpenPricingModal}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center ${
                      plan.id === currentSubscription
                        ? 'bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] border border-[var(--border-color)] cursor-default'
                        : plan.popular
                        ? 'azure-btn-primary hover:scale-105'
                        : 'azure-btn-secondary hover:scale-105'
                    }`}
                  >
                    {plan.id === currentSubscription ? 'Active Plan' : plan.cta}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ 8. FOOTER ═══════════════════════════════ */}
      <footer className="page-section pt-10 pb-6 border-t border-[var(--border-color)] relative z-10">
        <div className="page-col flex flex-col sm:flex-row items-center justify-between gap-5 text-xs text-[var(--text-muted)]">
          <div className="flex flex-col gap-0.5 text-center sm:text-left">
            <span className="font-bold text-sm text-[var(--text-primary)]">NexaWork AI</span>
            <span>2026 Labor Market & Predictive Analytics Platform</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => onLaunchService('overview')} className="hover:text-[var(--text-primary)] transition">Trends</button>
            <button onClick={() => onLaunchService('jobs')} className="hover:text-[var(--text-primary)] transition">Job Search</button>
            <button onClick={onOpenPricingModal} className="hover:text-[var(--text-primary)] transition">Pricing</button>
            <button onClick={onOpenAzureConfig} className="hover:text-[var(--text-primary)] transition">Cloud Settings</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
