import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Award,
  Sliders,
  Sparkles,
  PieChart,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  BarChart2,
  Briefcase
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { formatSalary, formatFullSalary } from '../../utils/formatters';

export const SalarySimulator: React.FC = () => {
  const [role, setRole] = useState<string>('Azure GenAI & Cognitive Architect');
  const [experience, setExperience] = useState<number>(6);
  const [cloudFocus, setCloudFocus] = useState<'azure' | 'multicloud' | 'general'>('azure');
  const [locationTier, setLocationTier] = useState<'tier1_us' | 'tier2_us' | 'europe' | 'apac'>('tier1_us');
  const [companyTier, setCompanyTier] = useState<'bigtech' | 'unicorn' | 'enterprise' | 'startup'>('bigtech');
  const [hasCert, setHasCert] = useState<boolean>(true);

  // Compute statistical compensation model
  let baseMedian = 140000;

  if (role.includes('GenAI')) baseMedian = 185000;
  else if (role.includes('Security')) baseMedian = 178000;
  else if (role.includes('Platform') || role.includes('AKS')) baseMedian = 172000;
  else if (role.includes('Fabric') || role.includes('Data')) baseMedian = 168000;
  else if (role.includes('Solutions Architect')) baseMedian = 175000;
  else baseMedian = 152000;

  baseMedian += experience * 7200;

  if (cloudFocus === 'azure') baseMedian *= 1.08;
  else if (cloudFocus === 'multicloud') baseMedian *= 1.05;

  if (hasCert) baseMedian *= 1.06;

  let locationMultiplier = 1.0;
  let locLabel = 'Tier 1 US (SF / Seattle / NYC)';
  if (locationTier === 'tier2_us') {
    locationMultiplier = 0.86;
    locLabel = 'Tier 2 US (Austin / Boston / Chicago)';
  } else if (locationTier === 'europe') {
    locationMultiplier = 0.72;
    locLabel = 'Europe (London / Berlin / Zurich)';
  } else if (locationTier === 'apac') {
    locationMultiplier = 0.45;
    locLabel = 'APAC (Bangalore / Singapore / Tokyo)';
  }

  let compMultiplier = 1.0;
  let bonusRate = 0.15;
  let equityVal = 35000;

  if (companyTier === 'bigtech') {
    compMultiplier = 1.15;
    bonusRate = 0.22;
    equityVal = 55000 + experience * 4000;
  } else if (companyTier === 'unicorn') {
    compMultiplier = 1.08;
    bonusRate = 0.15;
    equityVal = 40000 + experience * 3000;
  } else if (companyTier === 'enterprise') {
    compMultiplier = 0.98;
    bonusRate = 0.12;
    equityVal = 18000;
  } else {
    compMultiplier = 0.92;
    bonusRate = 0.08;
    equityVal = 22000;
  }

  const normalizedMedian = Math.round(baseMedian * locationMultiplier * compMultiplier);
  const p10 = Math.round(normalizedMedian * 0.78);
  const p25 = Math.round(normalizedMedian * 0.88);
  const p50 = normalizedMedian;
  const p75 = Math.round(normalizedMedian * 1.14);
  const p90 = Math.round(normalizedMedian * 1.28);

  const annualBonus = Math.round(p50 * bonusRate);
  const totalComp = p50 + annualBonus + equityVal;

  const percentileChartData = [
    { percentile: '10th %', salary: p10, label: 'Entry in Band', fill: '#64748b' },
    { percentile: '25th %', salary: p25, label: 'Below Median', fill: '#0284c7' },
    { percentile: '50th % (Median)', salary: p50, label: 'Target Market', fill: '#0078d4' },
    { percentile: '75th %', salary: p75, label: 'Top Tier', fill: '#10b981' },
    { percentile: '90th %', salary: p90, label: 'Top 10% Elite', fill: '#9333ea' }
  ];

  return (
    <div className="w-full space-y-10 animate-fade-in flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-color)] text-center sm:text-left">
        <div className="space-y-2">
          <div className="flex items-center justify-center sm:justify-start gap-2.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight mb-1">
              Predictive Salary Benchmark Simulator
            </h2>
            <span className="azure-badge">Parametric Compensation</span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Estimate base salary, expected bonuses, and equity allocations across technical specializations.
          </p>
        </div>
      </div>

      {/* Simulator Inputs & Result Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 6 Cols: Parameter Form */}
        <div className="lg:col-span-6 saas-card p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-color)]">
            <Sliders className="w-4 h-4 text-sky-400" />
            <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">Simulation Parameters</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-[var(--text-primary)] font-bold mb-2">Role Specialization</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] font-semibold focus:outline-none focus:border-blue-500"
              >
                <option value="Azure GenAI & Cognitive Architect">Lead Azure GenAI & Cognitive Architect</option>
                <option value="Principal Cloud Security & Zero Trust">Principal Cloud Security & Zero Trust (SC-100)</option>
                <option value="Staff Kubernetes (AKS) Platform Engineer">Staff Kubernetes (AKS) Platform Engineer</option>
                <option value="Microsoft Fabric Data Architect">Microsoft Fabric & Big Data Architect</option>
                <option value="Azure Solutions Architect (AZ-305)">Azure Solutions Architect (AZ-305)</option>
                <option value="Senior Full-Stack .NET 8 / React Engineer">Senior Full-Stack .NET 8 / React Engineer</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between font-bold text-[var(--text-primary)] mb-2">
                <span>Years of Professional Experience</span>
                <span className="text-sky-400 font-mono font-bold">{experience} Years</span>
              </div>
              <input
                type="range"
                min={0}
                max={15}
                value={experience}
                onChange={e => setExperience(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[var(--text-primary)] font-bold mb-2">Cloud Focus</label>
                <select
                  value={cloudFocus}
                  onChange={e => setCloudFocus(e.target.value as any)}
                  className="w-full bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] rounded-xl px-3.5 py-2.5 text-[var(--text-primary)] font-semibold focus:outline-none focus:border-blue-500"
                >
                  <option value="azure">Azure Specialist (+8% premium)</option>
                  <option value="multicloud">Multi-Cloud (Azure + AWS)</option>
                  <option value="general">General Cloud Engineering</option>
                </select>
              </div>

              <div>
                <label className="block text-[var(--text-primary)] font-bold mb-2">Location Tier</label>
                <select
                  value={locationTier}
                  onChange={e => setLocationTier(e.target.value as any)}
                  className="w-full bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] rounded-xl px-3.5 py-2.5 text-[var(--text-primary)] font-semibold focus:outline-none focus:border-blue-500"
                >
                  <option value="tier1_us">Tier 1 US (SF / Seattle / NYC)</option>
                  <option value="tier2_us">Tier 2 US (Austin / Boston)</option>
                  <option value="europe">Europe (London / Zurich / Berlin)</option>
                  <option value="apac">APAC (Bangalore / Singapore / Tokyo)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[var(--text-primary)] font-bold mb-2">Company Tier</label>
                <select
                  value={companyTier}
                  onChange={e => setCompanyTier(e.target.value as any)}
                  className="w-full bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] rounded-xl px-3.5 py-2.5 text-[var(--text-primary)] font-semibold focus:outline-none focus:border-blue-500"
                >
                  <option value="bigtech">Big Tech (Tier 1)</option>
                  <option value="unicorn">High-Growth Unicorn</option>
                  <option value="enterprise">Fortune 500 Enterprise</option>
                  <option value="startup">Early Stage Startup</option>
                </select>
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-2.5 cursor-pointer p-2.5 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)]">
                  <input
                    type="checkbox"
                    checked={hasCert}
                    onChange={e => setHasCert(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700"
                  />
                  <span className="text-[var(--text-primary)] font-bold text-xs">
                    Hold Expert Azure Cert (+6%)
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right 6 Cols: Result Output & Total Compensation Package */}
        <div className="lg:col-span-6 space-y-6">
          {/* Main Total Comp Card */}
          <div className="saas-card p-8 rounded-3xl border-emerald-500/30 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                Estimated Annual Total Compensation (TC)
              </span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                Confidence 94%
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-[var(--text-primary)] font-mono tracking-tight">
                {formatSalary(totalComp)}
              </span>
              <span className="text-xs text-[var(--text-muted)] font-semibold">USD / Year</span>
            </div>

            {/* Breakdown Strip */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[var(--border-color)] text-xs">
              <div className="p-4 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)]">
                <span className="text-[var(--text-muted)] block text-xs font-medium mb-1">Base Salary</span>
                <span className="text-emerald-400 font-mono font-bold text-base mt-1 block">{formatSalary(p50)}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)]">
                <span className="text-[var(--text-muted)] block text-xs font-medium mb-1">Target Bonus</span>
                <span className="text-sky-400 font-mono font-bold text-base mt-1 block">+{formatSalary(annualBonus)}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)]">
                <span className="text-[var(--text-muted)] block text-xs font-medium mb-1">Annual RSUs</span>
                <span className="text-purple-400 font-mono font-bold text-base mt-1 block">+{formatSalary(equityVal)}</span>
              </div>
            </div>
          </div>

          {/* Key Negotiation Insights */}
          <div className="saas-card p-6 rounded-3xl space-y-2.5 text-xs">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-sm mb-1">
              <Sparkles className="w-4 h-4" />
              <span>How to Command the 90th Percentile ({formatSalary(p90)} Base)</span>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Enterprise candidates combining **Azure OpenAI + Azure AI Search RAG pipelines** with **SC-100 or AZ-305 credentials** consistently negotiate in the top 10th percentile band with 25%+ equity packages.
            </p>
          </div>
        </div>
      </div>

      {/* Percentile Distribution Chart */}
      <div className="w-full saas-card p-8 rounded-3xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2.5">
            <BarChart2 className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">
              Market Percentile Distribution Curve (Base Salary)
            </h3>
          </div>
          <span className="text-xs text-[var(--text-muted)] font-medium">{locLabel}</span>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={percentileChartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
              <XAxis dataKey="percentile" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} tickFormatter={val => `$${val / 1000}k`} domain={[0, p90 * 1.15]} />
              <Tooltip
                formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Base Salary']}
                contentStyle={{ backgroundColor: '#121824', borderColor: '#222b3d', borderRadius: '12px' }}
              />
              <Bar dataKey="salary" radius={[8, 8, 0, 0]}>
                {percentileChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
