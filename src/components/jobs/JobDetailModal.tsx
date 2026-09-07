import React, { useState } from 'react';
import {
  X,
  Building2,
  MapPin,
  DollarSign,
  Briefcase,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  HelpCircle,
  FileText,
  Copy,
  ExternalLink
} from 'lucide-react';
import { JobPosting } from '../../types/market';
import { azureService } from '../../services/azureService';
import { formatSalary, formatFullSalary } from '../../utils/formatters';

interface JobDetailModalProps {
  job: JobPosting | null;
  onClose: () => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'interview' | 'coverletter'>('overview');
  const [interviewQuestions, setInterviewQuestions] = useState<any[] | null>(null);
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [generatingLetter, setGeneratingLetter] = useState<boolean>(false);
  const [copiedLetter, setCopiedLetter] = useState<boolean>(false);

  if (!job) return null;

  const handleGenerateInterviewPrep = () => {
    const questions = azureService.generateInterviewPrep(job);
    setInterviewQuestions(questions);
    setActiveTab('interview');
  };

  const handleGenerateCoverLetter = async () => {
    setGeneratingLetter(true);
    setActiveTab('coverletter');
    await new Promise(resolve => setTimeout(resolve, 800));

    const letter = `Dear Hiring Team at ${job.company},

I am writing to express my strong enthusiasm for the ${job.title} role. With hands-on engineering expertise in Microsoft Azure cloud architectures—specifically ${job.azureServices.slice(0, 3).join(', ')}—I am confident in my ability to immediately contribute to your engineering organization.

Throughout my career, I have focused on designing resilient, secure, and scalable cloud systems. In reviewing the requirements for ${job.title}, I was especially drawn to your work in ${job.sector}. My background aligns directly with your needs:
- Implementing high-throughput architectures utilizing ${job.skillsRequired.slice(0, 3).join(' and ')}.
- Adhering to the Microsoft Azure Well-Architected Framework, Zero-Trust identity perimeters, and automated infrastructure as code.
- Delivering high-impact milestones while maintaining strict SLA and P99 latency standards.

I would welcome the opportunity to discuss how my technical leadership and Azure cloud expertise can help accelerate ${job.company}'s strategic goals.

Sincerely,
Candidate
(Crafted with Azure TalentPulse AI)`;

    setCoverLetter(letter);
    setGeneratingLetter(false);
  };

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/70 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                {job.sector}
              </span>
              <span className="text-xs text-slate-400 font-medium">· {job.remotePolicy}</span>
              {job.visaSponsorship && (
                <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  Visa Sponsorship
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">{job.title}</h2>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="text-slate-200 font-semibold flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-sky-400" />
                {job.company} ({job.companyTier})
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {job.location}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls & Quick Actions */}
        <div className="px-6 py-2.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Job Overview & Stack
            </button>
            <button
              onClick={handleGenerateInterviewPrep}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'interview'
                  ? 'bg-purple-600 text-white'
                  : 'text-purple-300 hover:bg-purple-950/40'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>AI Interview Prep</span>
            </button>
            <button
              onClick={handleGenerateCoverLetter}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'coverletter'
                  ? 'bg-emerald-600 text-white'
                  : 'text-emerald-300 hover:bg-emerald-950/40'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Tailored Cover Letter</span>
            </button>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-emerald-400 font-mono">
              {formatSalary(job.salaryMin)} - {formatSalary(job.salaryMax)}
            </span>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {activeTab === 'overview' && (
            <>
              {/* Compensation Breakdown Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block">Base Range</span>
                  <span className="text-white font-mono font-bold">
                    {formatSalary(job.salaryMin)} - {formatSalary(job.salaryMax)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Target Median</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {formatFullSalary(job.salaryMedian)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Annual Bonus</span>
                  <span className="text-sky-400 font-mono font-bold">{job.bonusPercent}% Target</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Equity Grant</span>
                  <span className="text-purple-400 font-semibold font-mono">
                    {job.equityOffered ? 'Included (RSUs)' : 'None'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Position Summary
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">{job.description}</p>
              </div>

              {/* Responsibilities */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Key Architectural Responsibilities
                </h3>
                <ul className="space-y-1.5">
                  {job.responsibilities.map((resp, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 mt-0.5 shrink-0" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Azure Services Stack */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2">
                  Primary Microsoft Azure Stacks Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.azureServices.map(srv => (
                    <span
                      key={srv}
                      className="text-xs px-2.5 py-1 rounded-lg bg-blue-500/10 text-sky-300 border border-blue-500/30 font-medium"
                    >
                      {srv}
                    </span>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Compensation & Perks
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.benefits.map((b, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'interview' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Azure Technical & System Architecture Interview Questions
                  </h3>
                  <p className="text-xs text-slate-400">
                    Generated specifically for {job.title} based on enterprise evaluation rubrics.
                  </p>
                </div>
              </div>

              {interviewQuestions?.map((q, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-sky-400">Question #{idx + 1}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-semibold">
                      {q.category}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-white leading-relaxed">{q.question}</p>

                  <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-500/20 space-y-1.5">
                    <span className="text-[11px] font-bold text-sky-300 block">
                      Key Technical Talking Points:
                    </span>
                    <ul className="space-y-1">
                      {q.idealAnswerPoints.map((point: string, pidx: number) => (
                        <li key={pidx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                          <span className="text-sky-400 mt-0.5">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'coverletter' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Tailored Azure Cloud Cover Letter
                  </h3>
                  <p className="text-xs text-slate-400">
                    Customized for {job.title} at {job.company}.
                  </p>
                </div>
                <button
                  onClick={handleCopyLetter}
                  className="azure-btn-secondary text-xs flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedLetter ? 'Copied to Clipboard!' : 'Copy Letter'}</span>
                </button>
              </div>

              {generatingLetter ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-3">
                  <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-slate-400">Crafting tailored cover letter with Azure focus...</p>
                </div>
              ) : (
                <textarea
                  rows={14}
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 font-sans leading-relaxed focus:outline-none focus:border-emerald-500 resize-none"
                />
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">Posted {job.postedDate}</span>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="azure-btn-secondary text-xs">
              Close
            </button>
            <a
              href="#apply"
              onClick={e => {
                e.preventDefault();
                alert(`Redirecting to ${job.company} career portal for ${job.title}...`);
              }}
              className="azure-btn-primary text-xs flex items-center gap-1.5"
            >
              <span>Apply via Azure Job Mesh</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
