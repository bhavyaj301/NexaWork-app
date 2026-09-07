import React, { useState } from 'react';
import {
  TrendingUp,
  Briefcase,
  DollarSign,
  Globe2,
  Clock,
  ArrowUpRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Download,
  Info
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { macroStats, historicalTrends, skillTrendsData } from '../../services/marketData';
import { formatSalary, formatNumber } from '../../utils/formatters';
import { downloadCsvFile, downloadMarkdownReport } from '../../utils/exportUtils';

export const MarketOverview: React.FC = () => {
  const [selectedChart, setSelectedChart] = useState<'demand' | 'salary' | 'layoffs'>('demand');

  const workModelData = [
    { name: 'Hybrid (1-3 Days In-Office)', value: macroStats.hybridPercent, color: '#0078d4' },
    { name: '100% Remote WFH', value: macroStats.remotePercent, color: '#10b981' },
    { name: 'On-Site Office', value: macroStats.onsitePercent, color: '#f59e0b' }
  ];

  const topSkills = [...skillTrendsData]
    .sort((a, b) => b.growthRateYoY - a.growthRateYoY)
    .slice(0, 5);

  const handleExportCsv = () => {
    downloadCsvFile('market-trends-2026.csv', historicalTrends);
  };

  const handleExportReport = () => {
    const report = `# Azure Job Market Summary (2026)

## Key Takeaways:
- **Active Openings**: ${macroStats.totalActiveJobs.toLocaleString()}
- **Annual Growth Rate**: +${macroStats.yoyHiringGrowth}%
- **Average Base Salary**: ${formatSalary(macroStats.avgTechSalary)}
- **Work Model**: ${macroStats.hybridPercent}% Hybrid, ${macroStats.remotePercent}% Remote, ${macroStats.onsitePercent}% Onsite

## Top In-Demand Skills:
${topSkills.map((s, i) => `${i + 1}. **${s.name}** (+${s.growthRateYoY}% YoY Growth, Median Pay: ${formatSalary(s.medianSalary)})`).join('\n')}
`;
    downloadMarkdownReport('market-summary.md', report);
  };

  return (
    <div className="w-full space-y-10 animate-fade-in flex flex-col items-center">
      {/* Friendly Centered Page Header */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-color)] text-center sm:text-left">
        <div className="space-y-2">
          <div className="flex items-center justify-center sm:justify-start gap-2.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight mb-1">
              Job Market Trends & Macro Hiring
            </h2>
            <span className="azure-badge">2026 Verified</span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Aggregated intelligence across 2.48M+ verified cloud, AI, and enterprise tech positions.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleExportCsv}
            className="azure-btn-secondary text-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV</span>
          </button>
          <button
            onClick={handleExportReport}
            className="azure-btn-primary text-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>Export Executive Summary</span>
          </button>
        </div>
      </div>

      {/* 4 Defined KPI Cards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="saas-card p-7 rounded-2xl space-y-3 text-center sm:text-left">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider mb-2">
            <span>Active Openings</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-sky-400">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] font-mono mb-2">
            {formatNumber(macroStats.totalActiveJobs)}
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-emerald-400 font-bold mb-2">
            <ArrowUpRight className="w-4 h-4" />
            <span>+{macroStats.yoyHiringGrowth}% YoY Growth</span>
          </div>
          <p className="text-xs text-[var(--text-muted)] pt-3 border-t border-[var(--border-color)] leading-relaxed">
            Leading demand in Cloud & Generative AI.
          </p>
        </div>

        {/* Card 2 */}
        <div className="saas-card p-7 rounded-2xl space-y-3 text-center sm:text-left">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider mb-2">
            <span>Median Tech Base</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] font-mono mb-2">
            {formatSalary(macroStats.avgTechSalary)}
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-emerald-400 font-bold mb-2">
            <ArrowUpRight className="w-4 h-4" />
            <span>+8.4% annual increase</span>
          </div>
          <p className="text-xs text-[var(--text-muted)] pt-3 border-t border-[var(--border-color)] leading-relaxed">
            Normalized across global tier 1-2 hubs.
          </p>
        </div>

        {/* Card 3 */}
        <div className="saas-card p-7 rounded-2xl space-y-3 text-center sm:text-left">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider mb-2">
            <span>Remote & Hybrid Share</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Globe2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] font-mono mb-2">
            82.6%
          </div>
          <div className="text-xs text-sky-400 font-bold mb-2">
            <span>44% Hybrid · 38% Full Remote</span>
          </div>
          <p className="text-xs text-[var(--text-muted)] pt-3 border-t border-[var(--border-color)] leading-relaxed">
            Only 17.4% require full in-office.
          </p>
        </div>

        {/* Card 4 */}
        <div className="saas-card p-7 rounded-2xl space-y-3 text-center sm:text-left">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider mb-2">
            <span>Top Growth Sector</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight mb-2">
            Azure GenAI
          </div>
          <div className="text-xs text-emerald-400 font-bold mb-2">
            <span>+184% YoY mention surge</span>
          </div>
          <p className="text-xs text-[var(--text-muted)] pt-3 border-t border-[var(--border-color)] leading-relaxed">
            Azure OpenAI & Semantic Kernel lead.
          </p>
        </div>
      </div>

      {/* Main Interactive Longitudinal Trend Chart */}
      <div className="w-full saas-card p-8 rounded-3xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[var(--border-color)] text-center lg:text-left">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mb-1">
              Multi-Sector Demand & Compensation Trajectory (2022 - 2026+)
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Select metrics below to inspect hiring momentum, salary benchmarks, and layoff risk normalization.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 bg-[var(--bg-surface-subtle)] p-1.5 rounded-xl border border-[var(--border-color)] text-xs font-bold">
            <button
              onClick={() => setSelectedChart('demand')}
              className={`px-4 py-2 rounded-lg transition ${
                selectedChart === 'demand'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              📈 Hiring Velocity
            </button>
            <button
              onClick={() => setSelectedChart('salary')}
              className={`px-4 py-2 rounded-lg transition ${
                selectedChart === 'salary'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              💵 Salary Curves
            </button>
            <button
              onClick={() => setSelectedChart('layoffs')}
              className={`px-4 py-2 rounded-lg transition ${
                selectedChart === 'layoffs'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              📉 Layoff Risk Index
            </button>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            {selectedChart === 'demand' ? (
              <AreaChart data={historicalTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333ea" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#9333ea" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorCloud" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0078d4" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#0078d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222b3d" vertical={false} />
                <XAxis dataKey="yearQuarter" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 220]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#121824', borderColor: '#222b3d', borderRadius: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                <Area type="monotone" dataKey="aiMlDemand" name="AI / Generative AI" stroke="#9333ea" strokeWidth={3} fillOpacity={1} fill="url(#colorAi)" />
                <Area type="monotone" dataKey="cloudDevOpsDemand" name="Cloud & Azure DevOps" stroke="#0078d4" strokeWidth={3} fillOpacity={1} fill="url(#colorCloud)" />
                <Area type="monotone" dataKey="dataEngineeringDemand" name="Data Engineering / Fabric" stroke="#10b981" strokeWidth={2} fillOpacity={0} />
              </AreaChart>
            ) : selectedChart === 'salary' ? (
              <AreaChart data={historicalTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222b3d" vertical={false} />
                <XAxis dataKey="yearQuarter" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={val => `$${val / 1000}k`} domain={[120000, 175000]} />
                <Tooltip
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Median Base Salary']}
                  contentStyle={{ backgroundColor: '#121824', borderColor: '#222b3d', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="medianTechSalary" name="Tech Median Base ($ USD)" stroke="#10b981" strokeWidth={3.5} fill="#10b981" fillOpacity={0.15} />
              </AreaChart>
            ) : (
              <BarChart data={historicalTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222b3d" vertical={false} />
                <XAxis dataKey="yearQuarter" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  formatter={(val: any) => [`${val} pts`, 'Layoff Intensity Index']}
                  contentStyle={{ backgroundColor: '#121824', borderColor: '#222b3d', borderRadius: '12px' }}
                />
                <Bar dataKey="layoffsIndex" name="Layoff Impact Index" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Defined Summary Blocks */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top 5 High Growth Skills */}
        <div className="saas-card p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
            <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2.5 mb-1">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Top 5 High-Growth Cloud Skills</span>
            </h3>
            <span className="text-xs text-[var(--text-muted)] font-medium">Ranked by YoY Surge</span>
          </div>

          <div className="space-y-4">
            {topSkills.map((skill, idx) => (
              <div
                key={skill.id}
                className="p-4 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <span className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-xs font-bold text-sky-400 font-mono">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1">{skill.name}</h4>
                    <span className="text-xs text-[var(--text-muted)] leading-relaxed">{skill.category}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-emerald-400 font-mono block mb-1">
                    {formatSalary(skill.medianSalary)}
                  </span>
                  <span className="text-xs font-bold text-sky-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                    +{skill.growthRateYoY}% YoY
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Work Model Breakdown */}
        <div className="saas-card p-8 rounded-3xl space-y-6 flex flex-col justify-between">
          <div className="pb-3 border-b border-[var(--border-color)]">
            <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2.5 mb-1">
              <Globe2 className="w-5 h-5 text-sky-400" />
              <span>Where Do Cloud Engineers Work?</span>
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Distribution of open cloud & software engineering roles.
            </p>
          </div>

          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={workModelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {workModelData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Share']}
                  contentStyle={{ backgroundColor: '#121824', borderColor: '#222b3d', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3.5 pt-3 border-t border-[var(--border-color)]">
            {workModelData.map(item => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[var(--text-secondary)] font-medium">{item.name}</span>
                </div>
                <span className="text-[var(--text-primary)] font-bold font-mono text-sm">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
