export type ExperienceLevel = 'Entry-Level' | 'Mid-Level' | 'Senior' | 'Lead / Staff' | 'Principal / Architect';
export type RemotePolicy = 'Remote-First' | 'Hybrid' | 'On-Site';
export type Sector = 'AI & Deep Tech' | 'Cloud & Enterprise SaaS' | 'Fintech & Quant' | 'HealthTech & Bio' | 'Cybersecurity' | 'E-commerce & Retail' | 'Autonomous & Robotics';

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  companyTier: 'Big Tech' | 'Enterprise 500' | 'High-Growth Unicorn' | 'Early Stage';
  location: string;
  country: string;
  region: 'North America' | 'Europe' | 'Asia Pacific' | 'Latin America' | 'Global Remote';
  remotePolicy: RemotePolicy;
  experienceLevel: ExperienceLevel;
  salaryMin: number;
  salaryMax: number;
  salaryMedian: number;
  equityOffered: boolean;
  bonusPercent: number;
  postedDate: string;
  skillsRequired: string[];
  azureServices: string[];
  sector: Sector;
  matchScore?: number;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  benefits: string[];
  visaSponsorship: boolean;
  workPermitRequired: boolean;
}

export interface SkillTrend {
  id: string;
  name: string;
  category: 'Cloud & Azure' | 'AI & Machine Learning' | 'Data & Analytics' | 'DevOps & SRE' | 'Cybersecurity' | 'Modern Web / Backend';
  demandScore: number; // 1-100
  growthRateYoY: number; // percentage, e.g. +42%
  medianSalary: number;
  jobCount: number;
  momentum: 'Hyper-Growth' | 'Strong Growth' | 'Stable' | 'Cooling';
  coOccurringSkills: string[];
  description: string;
  azureEcosystemRelevance: string;
}

export interface GeoTalentHub {
  id: string;
  city: string;
  country: string;
  region: string;
  coordinates: { x: number; y: number }; // Relative coordinate on world projection
  totalTechListings: number;
  avgSalaryUsd: number;
  costOfLivingIndex: number; // Relative to NYC = 100
  purchasingPowerScore: number;
  remoteFriendlyPercent: number;
  yoyHiringGrowth: number;
  topHiringSpecialties: string[];
  topAzureSkills: string[];
  topCompanies: string[];
  hiringVelocity: 'High' | 'Very High' | 'Moderate';
}

export interface AzureCertProfile {
  code: string;
  name: string;
  level: 'Fundamentals' | 'Associate' | 'Expert' | 'Specialty';
  iconColor: string;
  medianSalaryBoostPercent: number;
  avgAnnualSalary: number;
  activeJobOpenings: number;
  examDifficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Advanced';
  relatedRoles: string[];
  topSkillTags: string[];
  summary: string;
  recommendedLearningWeeks: number;
}

export interface SkillGapItem {
  skill: string;
  importance: 'Critical' | 'High' | 'Medium';
  impactOnSalary: string;
  learningResource: string;
  azureEquivalent?: string;
}

export interface RoadmapMilestone {
  weekRange: string;
  phaseTitle: string;
  focus: string;
  deliverableProject: string;
  azureResources: string[];
  keyTopics: string[];
}

export interface SkillGapResult {
  matchPercentage: number;
  targetRole: string;
  currentStrengths: string[];
  criticalMissingSkills: SkillGapItem[];
  estimatedSalaryDelta: number;
  currentEstimatedSalary: number;
  potentialTargetSalary: number;
  summaryAnalysis: string;
  roadmap: RoadmapMilestone[];
}

export interface AzureConfig {
  connected: boolean;
  endpoint: string;
  apiKey: string;
  deploymentName: string;
  searchEndpoint: string;
  searchKey: string;
  searchIndex: string;
  cosmosDbEndpoint?: string;
  useLiveApi: boolean;
}

export interface TelemetryEvent {
  id: string;
  timestamp: string;
  source: 'Azure Event Hubs' | 'Stream Analytics' | 'Cosmos DB' | 'Azure AI Search' | 'Synapse Batch';
  type: 'JOB_INGEST' | 'NLP_EXTRACT' | 'VECTOR_EMBED' | 'SALARY_INDEX' | 'ANOMALY_DETECT';
  status: 'SUCCESS' | 'PROCESSED' | 'INDEXED';
  durationMs: number;
  payload: string;
}

export interface TelemetryStats {
  eventsPerSecond: number;
  totalEventsProcessed: number;
  avgLatencyMs: number;
  activePartitions: number;
  cosmosWriteThroughputRu: number;
  searchIndexVectorCount: number;
  recentEvents: TelemetryEvent[];
}

export interface HistoricalTrendPoint {
  yearQuarter: string;
  aiMlDemand: number;
  cloudDevOpsDemand: number;
  cybersecurityDemand: number;
  dataEngineeringDemand: number;
  fullstackDemand: number;
  layoffsIndex: number;
  medianTechSalary: number;
}

export interface MacroMarketStats {
  totalActiveJobs: number;
  yoyHiringGrowth: number;
  avgTechSalary: number;
  remotePercent: number;
  hybridPercent: number;
  onsitePercent: number;
  avgTimeToFillDays: number;
  totalCompaniesHiring: number;
  azureSkillMarketShare: number;
  lastUpdated: string;
}
