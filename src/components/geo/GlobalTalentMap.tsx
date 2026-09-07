import React, { useState } from 'react';
import {
  MapPin,
  Globe2,
  DollarSign,
  TrendingUp,
  Building2,
  Cpu,
  Layers,
  ArrowRight,
  Sparkles,
  ArrowLeftRight,
  ShieldCheck
} from 'lucide-react';
import { geoTalentHubs } from '../../services/marketData';
import { GeoTalentHub } from '../../types/market';
import { formatSalary, formatNumber } from '../../utils/formatters';

export const GlobalTalentMap: React.FC = () => {
  const [selectedHub, setSelectedHub] = useState<GeoTalentHub>(geoTalentHubs[0]);
  const [compareHub, setCompareHub] = useState<GeoTalentHub | null>(geoTalentHubs[5]); // Bangalore default
  const [activeRegion, setActiveRegion] = useState<string>('All');
  const [compareMode, setCompareMode] = useState(false);

  const filteredHubs = geoTalentHubs.filter(
    hub => activeRegion === 'All' || hub.region === activeRegion
  );

  return (
    <div className="w-full space-y-10 animate-fade-in flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-color)] text-center sm:text-left">
        <div className="space-y-2">
          <div className="flex items-center justify-center sm:justify-start gap-2.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight mb-1">
              Global Talent & Compensation Map
            </h2>
            <span className="azure-badge">12 Global Hubs</span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Explore cost of living adjusted compensation, hiring intensity, and local Azure skills across major tech capitals.
          </p>
        </div>

        {/* Region & Compare Controls */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <div className="bg-[var(--bg-surface-subtle)] p-1.5 rounded-2xl border border-[var(--border-color)] flex items-center gap-1 text-xs font-bold">
            {['All', 'North America', 'Europe', 'Asia Pacific'].map(region => (
              <button
                key={region}
                onClick={() => setActiveRegion(region)}
                className={`px-3 py-1.5 rounded-xl transition ${
                  activeRegion === region
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition ${
              compareMode
                ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-sm'
                : 'bg-[var(--bg-surface-subtle)] border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>{compareMode ? 'Exit Compare' : 'Compare 2 Cities'}</span>
          </button>
        </div>
      </div>

      {/* Main Map View & Hub List Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: Interactive SVG Tech Map */}
        <div className="lg:col-span-7 saas-card p-6 sm:p-8 rounded-3xl flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-sky-400" />
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">
                Interactive World Tech Map Projection
              </h3>
            </div>
            <span className="text-xs text-[var(--text-muted)]">Click any node to inspect</span>
          </div>

          {/* Interactive Projected Map Container */}
          <div className="relative w-full h-[380px] sm:h-[420px] bg-[var(--bg-surface-subtle)] rounded-2xl border border-[var(--border-color)] overflow-hidden flex items-center justify-center p-4">
            {/* World Grid Lines Background */}
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
                backgroundSize: '28px 28px'
              }}
            />

            {/* Simplified World Continents SVG Silhouette */}
            <svg
              className="absolute inset-0 w-full h-full text-slate-700/30"
              viewBox="0 0 1000 500"
              preserveAspectRatio="none"
            >
              {/* North America */}
              <path
                d="M 120 80 Q 200 60 280 100 Q 320 180 260 240 Q 180 260 120 180 Z"
                fill="currentColor"
              />
              {/* South America */}
              <path
                d="M 260 280 Q 340 320 320 440 Q 260 460 240 360 Z"
                fill="currentColor"
              />
              {/* Europe */}
              <path
                d="M 460 90 Q 560 80 580 160 Q 500 200 450 150 Z"
                fill="currentColor"
              />
              {/* Africa */}
              <path
                d="M 460 210 Q 560 220 540 380 Q 460 360 440 260 Z"
                fill="currentColor"
              />
              {/* Asia */}
              <path
                d="M 600 70 Q 860 60 880 200 Q 740 280 620 200 Z"
                fill="currentColor"
              />
              {/* Australia */}
              <path
                d="M 780 340 Q 890 350 880 430 Q 780 440 760 370 Z"
                fill="currentColor"
              />
            </svg>

            {/* Render Hub Pins */}
            {geoTalentHubs.map(hub => {
              const isSelected = selectedHub.id === hub.id;
              const isCompare = compareMode && compareHub?.id === hub.id;

              return (
                <div
                  key={hub.id}
                  onClick={() => {
                    if (compareMode && selectedHub.id !== hub.id) {
                      setCompareHub(hub);
                    } else {
                      setSelectedHub(hub);
                    }
                  }}
                  className="absolute cursor-pointer transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 group z-10"
                  style={{
                    left: `${hub.coordinates.x}%`,
                    top: `${hub.coordinates.y}%`
                  }}
                >
                  {isSelected && (
                    <span className="absolute -inset-2.5 rounded-full bg-sky-500/40 animate-ping" />
                  )}
                  {isCompare && (
                    <span className="absolute -inset-2.5 rounded-full bg-purple-500/40 animate-ping" />
                  )}

                  <div
                    className={`relative w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-125 ${
                      isSelected
                        ? 'bg-sky-400 border-white shadow-lg shadow-sky-400/50 scale-125'
                        : isCompare
                        ? 'bg-purple-400 border-white shadow-lg shadow-purple-400/50 scale-125'
                        : 'bg-slate-900 border-sky-400 hover:bg-sky-400 hover:border-white'
                    }`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>

                  <div className="absolute left-1/2 -top-9 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-700 pointer-events-none whitespace-nowrap shadow-xl z-30">
                    {hub.city} · {formatSalary(hub.avgSalaryUsd)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Hub Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 justify-center sm:justify-start">
            {filteredHubs.map(hub => (
              <button
                key={hub.id}
                onClick={() => setSelectedHub(hub)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedHub.id === hub.id
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
                }`}
              >
                {hub.city.split(',')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: Selected City Deep-Dive Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="saas-card p-8 rounded-3xl space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-400 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 block mb-1">
                  {selectedHub.region}
                </span>
                <h3 className="text-2xl font-extrabold text-[var(--text-primary)] mt-1 mb-1">{selectedHub.city}</h3>
                <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed">{selectedHub.country}</p>
              </div>

              <div className="text-right">
                <span className="text-xs text-[var(--text-muted)] font-bold block uppercase tracking-wider mb-1">Median Base</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                  {formatSalary(selectedHub.avgSalaryUsd)}
                </span>
              </div>
            </div>

            {/* Key Metrics 2x2 Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--border-color)]">
              <div className="p-4 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)]">
                <span className="text-xs text-[var(--text-muted)] block font-semibold mb-1">Active Listings</span>
                <span className="text-base font-extrabold text-[var(--text-primary)] font-mono mt-1 block">
                  {formatNumber(selectedHub.totalTechListings)}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)]">
                <span className="text-xs text-[var(--text-muted)] block font-semibold mb-1">Purchasing Power</span>
                <span className="text-base font-extrabold text-sky-400 font-mono mt-1 block">
                  {selectedHub.purchasingPowerScore} / 100
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)]">
                <span className="text-xs text-[var(--text-muted)] block font-semibold mb-1">Living Cost vs NYC</span>
                <span className="text-base font-extrabold text-amber-400 font-mono mt-1 block">
                  {selectedHub.costOfLivingIndex}%
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)]">
                <span className="text-xs text-[var(--text-muted)] block font-semibold mb-1">Remote Share</span>
                <span className="text-base font-extrabold text-emerald-400 font-mono mt-1 block">
                  {selectedHub.remoteFriendlyPercent}% WFH
                </span>
              </div>
            </div>

            {/* Top Azure Skills */}
            <div className="space-y-2.5 pt-4 border-t border-[var(--border-color)]">
              <span className="text-xs font-bold text-[var(--text-primary)] block mb-1">
                Top In-Demand Azure Skills:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedHub.topAzureSkills.map(skill => (
                  <span
                    key={skill}
                    className="text-xs px-2.5 py-1 rounded-lg bg-blue-500/10 text-sky-400 border border-blue-500/20 font-bold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Top Employers */}
            <div className="space-y-2.5 pt-4 border-t border-[var(--border-color)]">
              <span className="text-xs font-bold text-[var(--text-primary)] block mb-1">
                Major Cloud Employers:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedHub.topCompanies.map(comp => (
                  <span
                    key={comp}
                    className="text-xs px-2.5 py-1 rounded-lg bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] border border-[var(--border-color)] font-medium"
                  >
                    {comp}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Compare Card (When Active) */}
          {compareMode && compareHub && (
            <div className="saas-card p-6 rounded-3xl border-purple-500/40 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-1">
                    Comparing vs {compareHub.city}
                  </span>
                  <div className="text-sm font-bold text-[var(--text-primary)] mt-1">
                    Salary Difference: {formatSalary(Math.abs(selectedHub.avgSalaryUsd - compareHub.avgSalaryUsd))}
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  +{selectedHub.yoyHiringGrowth}% vs +{compareHub.yoyHiringGrowth}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
