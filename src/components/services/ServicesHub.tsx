import React from 'react';
import {
  TrendingUp,
  MapPin,
  Sparkles,
  Award,
  BookOpen,
  Search,
  DollarSign,
  Layers,
  ArrowLeft,
  FileCheck
} from 'lucide-react';
import { MarketOverview } from '../dashboard/MarketOverview';
import { GlobalTalentMap } from '../geo/GlobalTalentMap';
import { SkillNetworkGraph } from '../skills/SkillNetworkGraph';
import { AzureCertRoi } from '../skills/AzureCertRoi';
import { SkillGapAnalyzer } from '../skills/SkillGapAnalyzer';
import { ResumeAnalyzerService } from '../resume/ResumeAnalyzerService';
import { JobSearchExplorer } from '../jobs/JobSearchExplorer';
import { SalarySimulator } from '../salary/SalarySimulator';
import { AzureArchitectureViewer } from '../architecture/AzureArchitectureViewer';

export type ServiceId =
  | 'overview'
  | 'resume-analyzer'
  | 'geomap'
  | 'skills'
  | 'certifications'
  | 'skillgap'
  | 'jobs'
  | 'salary'
  | 'architecture';

export interface ServiceItem {
  id: ServiceId;
  title: string;
  category: string;
  description: string;
  badge?: string;
  icon: React.ElementType;
  iconBg: string;
}

export const allServices: ServiceItem[] = [
  {
    id: 'resume-analyzer',
    title: 'Azure AI Resume Analyzer & Matcher',
    category: 'Resume Intelligence',
    description: 'Upload PDF/Docx resume to extract cloud stacks, score ATS compatibility against Azure benchmarks, and calculate compensation leap.',
    icon: FileCheck,
    iconBg: 'bg-emerald-600',
    badge: 'New Service'
  },
  {
    id: 'overview',
    title: 'Azure Market Trends & Velocity',
    category: 'Macro Analytics',
    description: 'Longitudinal Microsoft Azure hiring velocity, cloud adoption curves, and AI labor demand.',
    icon: TrendingUp,
    iconBg: 'bg-blue-600'
  },
  {
    id: 'geomap',
    title: 'Global Azure Salaries by City',
    category: 'Geographic Intelligence',
    description: 'Interactive global map comparing Microsoft Azure compensation, tax brackets, and purchasing power across 12 tech hubs.',
    icon: MapPin,
    iconBg: 'bg-teal-600',
    badge: '12 Metros'
  },
  {
    id: 'skills',
    title: 'Azure Skill Co-occurrence Graph',
    category: 'Skill Intelligence',
    description: 'Physics-based network graph mapping Azure Kubernetes (AKS), Cosmos DB, Synapse, and Azure OpenAI skill clustering.',
    icon: Sparkles,
    iconBg: 'bg-purple-600'
  },
  {
    id: 'certifications',
    title: 'Azure Certification ROI Calculator',
    category: 'Career Value',
    description: 'Calculate salary lift and payback timelines for AZ-900, AZ-104, AZ-305, AZ-400, AI-102, and DP-203 credentials.',
    icon: Award,
    iconBg: 'bg-sky-600',
    badge: 'ROI Calculator'
  },
  {
    id: 'skillgap',
    title: 'Azure AI Career Diagnostic',
    category: 'AI Career Pathway',
    description: 'Match your profile against target Azure Solutions Architect & DevOps roles with customized 12-week roadmap milestones.',
    icon: BookOpen,
    iconBg: 'bg-indigo-600',
    badge: 'AI Powered'
  },
  {
    id: 'jobs',
    title: 'Azure Cognitive Job Explorer',
    category: 'Job Matching',
    description: 'Semantic search across enterprise Azure cloud postings with 1-click tailored interview prep and cover letters.',
    icon: Search,
    iconBg: 'bg-rose-600'
  },
  {
    id: 'salary',
    title: 'Azure Cloud Salary Simulator',
    category: 'Compensation Modeling',
    description: 'Parametric compensation calculator modeling base pay, bonus targets, and RSU equity for Microsoft Azure architects.',
    icon: DollarSign,
    iconBg: 'bg-amber-600'
  },
  {
    id: 'architecture',
    title: 'Azure Cloud Topology & Telemetry',
    category: 'Cloud Engineering',
    description: 'Live streaming telemetry visualizer for Azure Event Hubs, Stream Analytics, Cosmos DB, and Azure AI Search.',
    icon: Layers,
    iconBg: 'bg-slate-700',
    badge: 'Telemetry'
  }
];

interface ServicesHubProps {
  activeService: ServiceId;
  onSelectService: (service: ServiceId) => void;
  onBackToLanding: () => void;
}

export const ServicesHub: React.FC<ServicesHubProps> = ({
  activeService,
  onSelectService,
  onBackToLanding
}) => {
  const currentServiceItem = allServices.find(s => s.id === activeService) || allServices[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-8 animate-fade-in pb-16">
      {/* Top Breadcrumb & Switcher Bar */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToLanding}
            className="p-2 rounded-xl bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--text-muted)] font-medium">Azure Workspace /</span>
              <span className="text-xs font-bold text-sky-400">{currentServiceItem.category}</span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
              {currentServiceItem.title}
            </h1>
          </div>
        </div>

        {/* Quick Module Dropdown for Mobile / Compact Navigation */}
        <div className="w-full sm:w-auto">
          <select
            value={activeService}
            onChange={e => onSelectService(e.target.value as ServiceId)}
            className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            {allServices.map(srv => (
              <option key={srv.id} value={srv.id}>
                {srv.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Service Content View */}
      <div className="w-full">
        {activeService === 'resume-analyzer' && <ResumeAnalyzerService />}
        {activeService === 'overview' && <MarketOverview />}
        {activeService === 'geomap' && <GlobalTalentMap />}
        {activeService === 'skills' && <SkillNetworkGraph />}
        {activeService === 'certifications' && <AzureCertRoi />}
        {activeService === 'skillgap' && <SkillGapAnalyzer />}
        {activeService === 'jobs' && <JobSearchExplorer />}
        {activeService === 'salary' && <SalarySimulator />}
        {activeService === 'architecture' && <AzureArchitectureViewer />}
      </div>
    </div>
  );
};
