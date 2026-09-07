import React, { useState } from 'react';
import {
  Award,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  BookOpen,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { azureCertProfiles } from '../../services/marketData';
import { AzureCertProfile } from '../../types/market';
import { formatSalary } from '../../utils/formatters';

export const AzureCertRoi: React.FC = () => {
  const [selectedCert, setSelectedCert] = useState<AzureCertProfile>(azureCertProfiles[0]);
  const [basePay, setBasePay] = useState<number>(130000);

  const calculateLift = (cert: AzureCertProfile) => {
    return Math.round(basePay * (cert.medianSalaryBoostPercent / 100));
  };

  return (
    <div className="w-full space-y-10 animate-fade-in flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-color)] text-center sm:text-left">
        <div className="space-y-2">
          <div className="flex items-center justify-center sm:justify-start gap-2.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight mb-1">
              Cloud Certification ROI & Payback
            </h2>
            <span className="azure-badge">Enterprise Lift Models</span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Quantify expected compensation increases, study commitments, and time-to-payback for official industry credentials.
          </p>
        </div>
      </div>

      {/* Certs Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {azureCertProfiles.map(cert => {
          const isSelected = selectedCert.code === cert.code;
          return (
            <div
              key={cert.code}
              onClick={() => setSelectedCert(cert)}
              className={`saas-card p-7 rounded-3xl cursor-pointer flex flex-col justify-between space-y-5 transition-all ${
                isSelected
                  ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-xl'
                  : 'hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-400 font-mono bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                    {cert.code}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-400 font-mono">
                    +{cert.medianSalaryBoostPercent}% Lift
                  </span>
                </div>

                <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">{cert.name}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                  {cert.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>{cert.examDifficulty}</span>
                <span className="text-sky-400 font-bold">~{cert.recommendedLearningWeeks} Weeks Study</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Cert ROI Calculator */}
      <div className="w-full saas-card p-8 sm:p-10 rounded-3xl space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-[var(--border-color)]">
          <Award className="w-6 h-6 text-amber-400" />
          <div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">
              ROI & Payback Simulator: {selectedCert.code} - {selectedCert.name}
            </h3>
            <span className="text-xs text-[var(--text-muted)]">
              {selectedCert.level} Level · {selectedCert.activeJobOpenings.toLocaleString()} Active Postings
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-6 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] space-y-2 text-center">
            <span className="text-xs text-[var(--text-muted)] font-bold uppercase block mb-1">Current Base Pay</span>
            <div className="text-3xl font-extrabold text-white font-mono mb-2">{formatSalary(basePay)}</div>
            <input
              type="range"
              min={60000}
              max={220000}
              step={5000}
              value={basePay}
              onChange={e => setBasePay(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div className="p-6 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] space-y-2 text-center">
            <span className="text-xs text-[var(--text-muted)] font-bold uppercase block mb-1">Estimated Annual Lift</span>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono mb-1">
              +{formatSalary(calculateLift(selectedCert))}
            </div>
            <span className="text-xs text-sky-400 font-semibold block leading-relaxed">
              Based on +{selectedCert.medianSalaryBoostPercent}% enterprise market median
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] space-y-2 text-center">
            <span className="text-xs text-[var(--text-muted)] font-bold uppercase block mb-1">Estimated Potential Base</span>
            <div className="text-3xl font-extrabold text-purple-400 font-mono mb-1">
              {formatSalary(basePay + calculateLift(selectedCert))}
            </div>
            <span className="text-xs text-[var(--text-muted)] block leading-relaxed">
              Fastest ROI in enterprise cloud credentials
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
