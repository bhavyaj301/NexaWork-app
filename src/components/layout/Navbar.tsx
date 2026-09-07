import React, { useState, useEffect } from 'react';
import {
  Cloud,
  Cpu,
  Download,
  Share2,
  Zap,
  Sliders,
  Sparkles
} from 'lucide-react';
import { telemetryService } from '../../services/telemetryService';
import { azureService } from '../../services/azureService';
import { TelemetryStats } from '../../types/market';
import { downloadJsonFile } from '../../utils/exportUtils';
import { sampleJobPostings, skillTrendsData } from '../../services/marketData';

interface NavbarProps {
  onOpenAzureConfig: () => void;
  activeTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAzureConfig, activeTab }) => {
  const [telemetry, setTelemetry] = useState<TelemetryStats>(telemetryService.getStats());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsub = telemetryService.subscribe(stats => {
      setTelemetry({ ...stats });
    });
    return () => unsub();
  }, []);

  const handleExportData = () => {
    downloadJsonFile('azure-job-market-trends.json', {
      exportedAt: new Date().toISOString(),
      activeJobsCount: telemetry.searchIndexVectorCount,
      jobs: sampleJobPostings,
      skills: skillTrendsData
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#161b22] border-b border-[#30363d] px-4 sm:px-6 py-3.5 flex items-center justify-between">
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
          <Cloud className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-white tracking-tight">
              Azure <span className="text-sky-400">Job Market Analyzer</span>
            </h1>
            <span className="hidden sm:inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-sky-300 border border-blue-500/20">
              Live 2026 Data
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden md:block">
            Easy AI-powered cloud job trends, salary benchmarks & career guidance
          </p>
        </div>
      </div>

      {/* Simplified Live Status Indicator */}
      <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#0d1117] border border-[#30363d] text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="pulse-dot" />
          <span className="text-slate-400">Live Ingestion:</span>
          <span className="text-emerald-400 font-mono font-semibold">
            {telemetry.eventsPerSecond} jobs/sec
          </span>
        </div>
        <span className="text-slate-600">|</span>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Active Postings:</span>
          <span className="text-white font-mono font-semibold">2.48 Million</span>
        </div>
      </div>

      {/* Clean Right Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenAzureConfig}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-slate-200 text-xs font-semibold transition"
          title="Azure Settings"
        >
          <Cpu className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline">Azure Settings</span>
        </button>

        <button
          onClick={handleExportData}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-slate-200 text-xs font-semibold transition"
          title="Download Market Data"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Export</span>
        </button>

        <button
          onClick={handleShare}
          className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-slate-200 text-xs font-semibold transition flex items-center gap-1.5"
        >
          <Share2 className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
        </button>
      </div>
    </header>
  );
};
