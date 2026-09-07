import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Building2,
  DollarSign,
  Briefcase,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  Zap,
  Globe
} from 'lucide-react';
import { sampleJobPostings } from '../../services/marketData';
import { JobPosting } from '../../types/market';
import { JobDetailModal } from './JobDetailModal';
import { formatSalary } from '../../utils/formatters';

export const JobSearchExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [selectedRemote, setSelectedRemote] = useState<string>('All');
  const [selectedExp, setSelectedExp] = useState<string>('All');
  const [visaSponsorshipOnly, setVisaSponsorshipOnly] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);

  const filteredJobs = useMemo(() => {
    return sampleJobPostings.filter(job => {
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesComp = job.company.toLowerCase().includes(query);
        const matchesSkills = job.skillsRequired.some(s => s.toLowerCase().includes(query));
        const matchesAzure = job.azureServices.some(s => s.toLowerCase().includes(query));
        if (!matchesTitle && !matchesComp && !matchesSkills && !matchesAzure) {
          return false;
        }
      }

      if (selectedSector !== 'All' && job.sector !== selectedSector) return false;
      if (selectedRemote !== 'All' && job.remotePolicy !== selectedRemote) return false;
      if (selectedExp !== 'All' && job.experienceLevel !== selectedExp) return false;
      if (visaSponsorshipOnly && !job.visaSponsorship) return false;

      return true;
    });
  }, [searchTerm, selectedSector, selectedRemote, selectedExp, visaSponsorshipOnly]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedSector('All');
    setSelectedRemote('All');
    setSelectedExp('All');
    setVisaSponsorshipOnly(false);
  };

  return (
    <div className="w-full space-y-10 animate-fade-in flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-color)] text-center sm:text-left">
        <div className="space-y-2">
          <div className="flex items-center justify-center sm:justify-start gap-2.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight mb-1">
              Cognitive Job Explorer & Semantic Search
            </h2>
            <span className="azure-badge">Vector Hybrid Search</span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Explore verified enterprise positions with 1-click tailored AI interview preparation generators.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2">
          <button
            onClick={handleResetFilters}
            className="azure-btn-secondary text-xs flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="w-full saas-card p-7 sm:p-8 rounded-3xl space-y-6">
        {/* Main Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by role, stack (e.g. Kubernetes, OpenAI, Terraform, Big Data), or company..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] rounded-2xl pl-12 pr-4 py-3.5 text-sm font-semibold text-[var(--text-primary)] placeholder-slate-500 focus:outline-none focus:border-blue-500 shadow-inner leading-relaxed"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-4 text-xs font-bold text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-[var(--text-muted)] font-bold mb-2 uppercase tracking-wider text-[11px]">
              Industry Sector
            </label>
            <select
              value={selectedSector}
              onChange={e => setSelectedSector(e.target.value)}
              className="w-full bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] rounded-xl px-3.5 py-2.5 text-[var(--text-primary)] font-semibold focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Sectors</option>
              <option value="AI & Deep Tech">AI & Deep Tech</option>
              <option value="Cloud & Enterprise SaaS">Cloud & Enterprise SaaS</option>
              <option value="Fintech & Quant">Fintech & Quant</option>
              <option value="HealthTech & Bio">HealthTech & Bio</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Autonomous & Robotics">Autonomous & Robotics</option>
            </select>
          </div>

          <div>
            <label className="block text-[var(--text-muted)] font-bold mb-2 uppercase tracking-wider text-[11px]">
              Work Model
            </label>
            <select
              value={selectedRemote}
              onChange={e => setSelectedRemote(e.target.value)}
              className="w-full bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] rounded-xl px-3.5 py-2.5 text-[var(--text-primary)] font-semibold focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Policies</option>
              <option value="Remote-First">Remote-First</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-Site">On-Site</option>
            </select>
          </div>

          <div>
            <label className="block text-[var(--text-muted)] font-bold mb-2 uppercase tracking-wider text-[11px]">
              Seniority Level
            </label>
            <select
              value={selectedExp}
              onChange={e => setSelectedExp(e.target.value)}
              className="w-full bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] rounded-xl px-3.5 py-2.5 text-[var(--text-primary)] font-semibold focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Seniorities</option>
              <option value="Senior">Senior</option>
              <option value="Lead / Staff">Lead / Staff</option>
              <option value="Principal / Architect">Principal / Architect</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-2.5 cursor-pointer p-2.5 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] hover:border-slate-600">
              <input
                type="checkbox"
                checked={visaSponsorshipOnly}
                onChange={e => setVisaSponsorshipOnly(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700"
              />
              <span className="text-[var(--text-primary)] font-bold text-xs">Visa Sponsorship OK</span>
            </label>
          </div>
        </div>

        {/* Quick Tag Chips */}
        <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-[var(--border-color)] text-xs">
          <span className="text-[var(--text-muted)] font-bold text-[11px]">Popular Tags:</span>
          {['Azure OpenAI', 'AKS', 'Fabric', 'Terraform', 'Sentinel', 'Cosmos DB', 'Semantic Kernel'].map(
            tag => (
              <button
                key={tag}
                onClick={() => setSearchTerm(tag)}
                className="px-3 py-1 rounded-lg bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-color)] text-sky-400 text-xs font-mono font-bold transition"
              >
                +{tag}
              </button>
            )
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="w-full flex items-center justify-between text-xs text-[var(--text-muted)] px-1 font-semibold">
        <span>
          Showing <strong className="text-[var(--text-primary)]">{filteredJobs.length}</strong> matching positions
        </span>
        <span>Ranked by Semantic Match</span>
      </div>

      {/* Job Cards Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.map(job => (
          <div
            key={job.id}
            onClick={() => setSelectedJob(job)}
            className="saas-card p-7 rounded-3xl cursor-pointer hover:border-[#0078d4] transition-all flex flex-col justify-between space-y-5 group"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-400 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 block mb-1">
                      {job.sector}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] font-semibold">{job.remotePolicy}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] group-hover:text-sky-400 transition-colors mt-1.5 mb-1">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mt-1">
                    <span className="font-bold text-[var(--text-primary)]">{job.company}</span>
                    <span>·</span>
                    <span>{job.location}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-base font-extrabold text-emerald-400 font-mono block mb-1">
                    {formatSalary(job.salaryMedian)}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Median Base</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                {job.description}
              </p>

              {/* Azure Services Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                {job.azureServices.slice(0, 3).map(srv => (
                  <span
                    key={srv}
                    className="text-xs px-2.5 py-1 rounded-lg bg-blue-500/10 text-sky-400 border border-blue-500/20 font-bold"
                  >
                    {srv}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Strip */}
            <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between text-xs">
              <span className="text-xs text-[var(--text-muted)] font-semibold">{job.experienceLevel}</span>

              <div className="flex items-center gap-1 text-sky-400 font-bold group-hover:translate-x-1 transition-transform">
                <span>View Details & Prep</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
    </div>
  );
};
