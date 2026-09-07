import { AzureConfig, SkillGapResult, JobPosting, SkillGapItem, RoadmapMilestone } from '../types/market';
import { sampleJobPostings } from './marketData';

const AZURE_CONFIG_KEY = 'azure_talentpulse_config';

export interface InterviewPrepQuestion {
  question: string;
  category: 'System Architecture' | 'Troubleshooting & Reliability' | 'Security & Governance' | 'AI & Data Flow';
  idealAnswerPoints: string[];
}

export class AzureService {
  private config: AzureConfig = {
    connected: false,
    endpoint: '',
    apiKey: '',
    deploymentName: 'gpt-4o',
    searchEndpoint: '',
    searchKey: '',
    searchIndex: 'azure-jobs-index',
    cosmosDbEndpoint: '',
    useLiveApi: false
  };

  constructor() {
    this.loadConfig();
  }

  public loadConfig(): AzureConfig {
    try {
      const saved = localStorage.getItem(AZURE_CONFIG_KEY);
      if (saved) {
        this.config = { ...this.config, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to load Microsoft Azure config from localStorage', e);
    }
    return this.config;
  }

  public saveConfig(newConfig: Partial<AzureConfig>): AzureConfig {
    this.config = { ...this.config, ...newConfig };
    try {
      localStorage.setItem(AZURE_CONFIG_KEY, JSON.stringify(this.config));
    } catch (e) {
      console.warn('Failed to save Microsoft Azure config to localStorage', e);
    }
    return this.config;
  }

  public getConfig(): AzureConfig {
    return { ...this.config };
  }

  /**
   * Execute live chat query to Microsoft Azure OpenAI Service or high-fidelity intelligence fallback
   */
  public async queryAzureCopilot(prompt: string, history: { role: 'user' | 'assistant'; content: string }[] = []): Promise<string> {
    if (this.config.useLiveApi && this.config.endpoint && this.config.apiKey && this.config.deploymentName) {
      try {
        const cleanEndpoint = this.config.endpoint.replace(/\/+$/, '');
        const url = `${cleanEndpoint}/openai/deployments/${this.config.deploymentName}/chat/completions?api-version=2024-02-15-preview`;
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': this.config.apiKey
          },
          body: JSON.stringify({
            messages: [
              {
                role: 'system',
                content: 'You are Microsoft Azure TalentPulse Copilot, an expert enterprise AI labor market analyst and cloud career advisor specializing in Microsoft Azure cloud ecosystem, hiring trends, salary benchmarking, and technical skills.'
              },
              ...history.slice(-6),
              { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 1200
          })
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Microsoft Azure OpenAI Error (${response.status}): ${errText}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || 'No response returned from Microsoft Azure OpenAI.';
      } catch (err: any) {
        console.error('Error contacting Microsoft Azure OpenAI:', err);
        return `⚠️ **Live Microsoft Azure OpenAI Call Failed**: ${err.message}\n\nFalling back to simulated Microsoft Azure Intelligence Engine.\n\n${this.generateSimulatedCopilotResponse(prompt)}`;
      }
    }

    // High fidelity simulated response
    await new Promise(resolve => setTimeout(resolve, 800));
    return this.generateSimulatedCopilotResponse(prompt);
  }

  /**
   * Generate tailored technical interview questions for a job posting
   */
  public generateInterviewPrep(job: JobPosting): InterviewPrepQuestion[] {
    return [
      {
        question: `How would you architect a high-availability, multi-region deployment for ${job.title} using ${job.azureServices[0] || 'Azure Kubernetes Service (AKS)'} and ${job.azureServices[1] || 'Azure Cosmos DB'}?`,
        category: 'System Architecture',
        idealAnswerPoints: [
          `Detail multi-region active-active or active-passive topologies using Azure Front Door or Traffic Manager for global routing.`,
          `Discuss data replication, consistency models (e.g. Session vs Strong consistency in Cosmos DB), and automated failover policies.`,
          `Explain automated infrastructure provisioning with Terraform/Bicep CI/CD pipelines in Azure DevOps.`
        ]
      },
      {
        question: `In this ${job.sector} role, how do you implement Zero Trust security, RBAC, and data governance adhering to SOC2 / ISO 27001 standards?`,
        category: 'Security & Governance',
        idealAnswerPoints: [
          `Leverage Microsoft Entra ID (Azure AD) Conditional Access, Privileged Identity Management (PIM), and Managed Identities.`,
          `Enforce encryption-at-rest with customer-managed keys (CMK) stored in Azure Key Vault HSM.`,
          `Integrate Microsoft Defender for Cloud and Microsoft Sentinel for automated threat hunting and continuous compliance monitoring.`
        ]
      },
      {
        question: `If a production workload running on ${job.azureServices.slice(0, 2).join(' & ')} encounters sudden 10x traffic spikes and p99 latency degradation, how do you diagnose and remediate?`,
        category: 'Troubleshooting & Reliability',
        idealAnswerPoints: [
          `Use Azure Monitor, Application Insights, and Log Analytics KQL queries to isolate bottlenecks across API gateways and container replicas.`,
          `Implement horizontal pod autoscaling (HPA) and Azure Container Apps / AKS node pool scaling with KEDA.`,
          `Implement circuit breakers, Redis distributed caching, and asynchronous message queue buffering with Azure Service Bus.`
        ]
      },
      {
        question: `How do you integrate generative AI orchestration (e.g. Azure OpenAI / Semantic Kernel) securely into enterprise telemetry pipelines?`,
        category: 'AI & Data Flow',
        idealAnswerPoints: [
          `Utilize Azure AI Search vector indexes with hybrid keyword + dense vector reranking.`,
          `Implement Content Safety filters and private VNet endpoint connectivity for Azure OpenAI deployments.`,
          `Employ token rate limiting, response caching, and prompt evaluation metrics to manage latency and inferencing cost.`
        ]
      }
    ];
  }

  /**
   * AI Skill Gap Diagnostic & Roadmap Generator powered by Microsoft Azure Cognitive Framework
   */
  public async analyzeSkillGap(userSkills: string[], targetRole: string, experienceYears: number): Promise<SkillGapResult> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const roleBenchmarks: Record<string, { required: string[]; preferred: string[]; baseSalary: number }> = {
      'Cloud Solutions Architect': {
        required: ['Microsoft Azure Architecture', 'Kubernetes (AKS)', 'Terraform / Bicep', 'Microservices', 'Security & IAM'],
        preferred: ['Cosmos DB', 'Azure Synapse', 'Event Hubs', 'Azure DevOps', 'Zero Trust Architecture'],
        baseSalary: 185000
      },
      'DevOps & Platform Engineer': {
        required: ['Azure DevOps CI/CD', 'Kubernetes (AKS)', 'Terraform / Bicep', 'Docker', 'Linux / Bash'],
        preferred: ['ArgoCD', 'Prometheus & Grafana', 'Helm', 'Azure Monitor', 'Site Reliability Engineering'],
        baseSalary: 165000
      },
      'Data & AI Engineer': {
        required: ['Python', 'SQL', 'Azure Databricks / Spark', 'Azure Data Factory', 'Azure Synapse'],
        preferred: ['Azure OpenAI Service', 'LangChain / Semantic Kernel', 'Cosmos DB', 'Delta Lake', 'dbt'],
        baseSalary: 175000
      },
      'Security & Zero Trust Architect': {
        required: ['Microsoft Defender for Cloud', 'Microsoft Sentinel (SIEM)', 'Azure Active Directory (Entra ID)', 'Zero Trust Network Architecture', 'Compliance (SOC2 / FedRAMP)'],
        preferred: ['Threat Modeling', 'Key Vault HSM', 'Network Security Groups (NSGs)', 'CIEM / CSPM', 'Penetration Testing'],
        baseSalary: 190000
      }
    };

    const benchmark = roleBenchmarks[targetRole] || roleBenchmarks['Cloud Solutions Architect'];
    const lowerUser = userSkills.map(s => s.toLowerCase());

    const matchingSkills = benchmark.required.filter(req =>
      lowerUser.some(u => req.toLowerCase().includes(u) || u.includes(req.toLowerCase()))
    );

    const missingSkills = benchmark.required.filter(req =>
      !lowerUser.some(u => req.toLowerCase().includes(u) || u.includes(req.toLowerCase()))
    );

    const matchPercentage = Math.min(100, Math.round((matchingSkills.length / Math.max(1, benchmark.required.length)) * 80 + Math.min(20, experienceYears * 3)));
    const currentSalary = Math.round(benchmark.baseSalary * (1 + (matchPercentage - 60) / 200) + experienceYears * 4000);
    const targetSalary = Math.round(benchmark.baseSalary * 1.25 + experienceYears * 5000);

    const criticalMissingSkills: SkillGapItem[] = missingSkills.map(skill => ({
      skill,
      importance: 'Critical',
      impactOnSalary: `+$${Math.round(8000 + Math.random() * 6000).toLocaleString()} / yr`,
      learningResource: `Microsoft Learn: ${skill} Deep Dive Modules & Hands-on Sandbox`,
      azureEquivalent: `Microsoft Certified: Azure Expert Curriculum`
    }));

    const roadmap: RoadmapMilestone[] = [
      {
        weekRange: 'Weeks 1–3',
        phaseTitle: 'Core Azure Infrastructure & Networking',
        focus: missingSkills.slice(0, 2).join(', ') || 'Azure Well-Architected Framework',
        deliverableProject: 'Deploy multi-region virtual network topology with Azure Firewall and Bicep.',
        azureResources: ['Virtual Network', 'Azure Firewall', 'Azure Bastion'],
        keyTopics: ['VNet Peering', 'Route Tables', 'Bicep Templates', 'ARM Validation']
      },
      {
        weekRange: 'Weeks 4–7',
        phaseTitle: 'Distributed Compute & Container Orchestration',
        focus: missingSkills.slice(2, 4).join(', ') || 'Azure Kubernetes Service & Microservices',
        deliverableProject: 'Deploy microservices cluster on AKS with ingress controller and Azure Key Vault CSI driver.',
        azureResources: ['AKS', 'Azure Key Vault', 'Application Gateway'],
        keyTopics: ['Helm Charts', 'Managed Identities', 'HPA Scaling', 'Log Analytics']
      },
      {
        weekRange: 'Weeks 8–12',
        phaseTitle: 'Production Capstone & Certification Mastery',
        focus: 'High-Availability Architectures & Zero Trust Governance',
        deliverableProject: 'End-to-end production landing zone matching AZ-305 enterprise criteria.',
        azureResources: ['Cosmos DB', 'Azure Front Door', 'Microsoft Sentinel'],
        keyTopics: ['Multi-Region Failover', 'SIEM Integration', 'Cost Optimization', 'AZ-305 Exam Prep']
      }
    ];

    return {
      matchPercentage,
      targetRole,
      currentStrengths: matchingSkills.length ? matchingSkills : ['Fundamental Technical Principles', 'Problem Solving'],
      criticalMissingSkills,
      estimatedSalaryDelta: targetSalary - currentSalary,
      currentEstimatedSalary: currentSalary,
      potentialTargetSalary: targetSalary,
      summaryAnalysis: `Candidate displays strong alignment in core fundamentals with high market acceleration potential towards ${targetRole}. Bridging key gaps in Microsoft Azure architectures unlocks top-quartile enterprise compensation.`,
      roadmap
    };
  }

  /**
   * Search tech jobs powered by Microsoft Azure Cognitive Search simulation
   */
  public async searchJobs(query: string, location?: string, remoteOnly?: boolean): Promise<JobPosting[]> {
    await new Promise(resolve => setTimeout(resolve, 600));

    return sampleJobPostings.filter((job: JobPosting) => {
      const matchQ = !query || job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.skillsRequired.some((s: string) => s.toLowerCase().includes(query.toLowerCase())) ||
        job.azureServices.some((s: string) => s.toLowerCase().includes(query.toLowerCase()));
      const matchLoc = !location || job.location.toLowerCase().includes(location.toLowerCase());
      const matchRem = !remoteOnly || job.remotePolicy === 'Remote-First';
      return matchQ && matchLoc && matchRem;
    });
  }

  /**
   * Internal intelligent Copilot conversational response generator
   */
  private generateSimulatedCopilotResponse(query: string): string {
    const q = query.toLowerCase();

    if (q.includes('salary') || q.includes('compensation') || q.includes('pay') || q.includes('worth')) {
      return `### 💰 Microsoft Azure Cloud Compensation Benchmarks (2026 Index)

Based on real-time analysis of **2.48M+ verified postings**:

1. **Microsoft Azure Solutions Architect (AZ-305)**
   - **Median Base**: $182,000 / yr
   - **Top 10% Tier 1 (SF / NYC)**: $235,000 – $275,000 + RSUs
   - **Year-over-Year Growth**: +14.2%

2. **Azure GenAI & Databricks Platform Engineer**
   - **Median Base**: $196,000 / yr
   - **Demand Surge**: +68% hiring velocity YoY
   - **Key Stack**: Azure OpenAI Service, Semantic Kernel, Vector Search, Delta Lake

3. **Zero Trust & Sentinel Security Architect**
   - **Median Base**: $191,000 / yr
   - **Premium Driver**: Multi-cloud compliance (FedRAMP, SOC2) and automated SOAR playbooks.

> 💡 **Recommendation**: Combining **AZ-305 (Azure Architect)** with **AI-102 (Azure AI Engineer)** commands an average **+$34,500/year** compensation premium.`;
    }

    if (q.includes('skill') || q.includes('learn') || q.includes('roadmap') || q.includes('gap')) {
      return `### 🎯 High-ROI Microsoft Azure Skill Acceleration Pathway

To maximize market competitiveness across modern enterprise cloud hiring:

* **Tier 1 (Core Foundation)**:
  - Infrastructure as Code: Terraform & Azure Bicep
  - Container Orchestration: Azure Kubernetes Service (AKS) & Azure Container Apps
  - Identity & Security: Microsoft Entra ID (Azure AD), Managed Identities & Key Vault

* **Tier 2 (AI & Data Engineering)**:
  - Azure OpenAI Service (GPT-4o, Embeddings API, Fine-Tuning)
  - Azure Cosmos DB (Serverless, Multi-Region replication, Vector Indexing)
  - Azure Synapse & Microsoft Fabric Real-Time Intelligence

* **Tier 3 (Enterprise Automation)**:
  - Azure DevOps Pipelines & GitHub Actions with OIDC Federation
  - Zero Trust Cloud Governance & Azure Policy enforcement.

You can run the **AI Career Gap Diagnostic** in the Services Hub for a tailored 12-week schedule!`;
    }

    if (q.includes('cert') || q.includes('az-') || q.includes('exam')) {
      return `### 🏆 Top Microsoft Azure Certifications by Market ROI

1. **AZ-305: Designing Microsoft Azure Infrastructure Solutions**
   - **Salary Premium**: +$28,000 / yr average increase
   - **Payback Period**: 1.8 months
   - **Difficulty**: Advanced

2. **AI-102: Designing and Implementing an Azure AI Solution**
   - **Salary Premium**: +$32,000 / yr average increase
   - **Payback Period**: 1.5 months
   - **Market Surge**: Fastest growing certification demand across enterprise accounts

3. **AZ-400: Designing and Implementing Microsoft DevOps Solutions**
   - **Salary Premium**: +$24,000 / yr average increase
   - **Payback Period**: 2.2 months

Explore the **Cloud Certification ROI Calculator** in Services Hub to compute payback timelines based on your current salary!`;
    }

    return `### ⚡ Microsoft Azure Cloud Labor Market Intelligence

NexaWork AI continuously analyzes enterprise hiring pipelines across Microsoft Azure, AWS, and Hybrid Cloud architectures.

**Current Macro Insights:**
- **GenAI Specialization**: 1 in 4 new cloud postings now mandate LLM orchestration (Azure OpenAI / LangChain / Semantic Kernel).
- **Remote vs Hybrid**: 58% of Senior Azure Architect roles offer full remote flexibility.
- **Top Hiring Hubs**: Seattle, San Francisco, New York, Austin, London, and Bangalore.

How can I assist you further? You can ask about **salary simulations**, **skill roadmaps**, **certifications (AZ-305 / AI-102)**, or **interview question generation**!`;
  }
}

export const azureService = new AzureService();
