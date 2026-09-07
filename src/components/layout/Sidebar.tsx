import React from 'react';
import {
  TrendingUp,
  MapPin,
  Sparkles,
  Search,
  DollarSign,
  Bot,
  Layers,
  Award,
  BookOpen
} from 'lucide-react';

export type NavTabId =
  | 'overview'
  | 'geomap'
  | 'skills'
  | 'certifications'
  | 'skillgap'
  | 'jobs'
  | 'salary'
  | 'copilot'
  | 'architecture';

interface SidebarProps {
  activeTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const navItems = [
  {
    id: 'overview' as NavTabId,
    label: '1. Market Trends',
    sublabel: 'Tech hiring & demand overview',
    icon: TrendingUp
  },
  {
    id: 'geomap' as NavTabId,
    label: '2. Salaries by City',
    sublabel: 'Global tech cities & living costs',
    icon: MapPin
  },
  {
    id: 'skills' as NavTabId,
    label: '3. Skill Demand Graph',
    sublabel: 'Top tech & cloud skills',
    icon: Sparkles
  },
  {
    id: 'certifications' as NavTabId,
    label: '4. Azure Certifications ROI',
    sublabel: 'Salary boost for AZ / AI certs',
    icon: Award
  },
  {
    id: 'skillgap' as NavTabId,
    label: '5. Resume & Skill Gap AI',
    sublabel: 'Your personalized 12-week plan',
    icon: BookOpen,
    highlight: true
  },
  {
    id: 'jobs' as NavTabId,
    label: '6. Search Azure Jobs',
    sublabel: 'Filtered listings with prep generator',
    icon: Search
  },
  {
    id: 'salary' as NavTabId,
    label: '7. Salary Calculator',
    sublabel: 'Estimate your target pay package',
    icon: DollarSign
  },
  {
    id: 'copilot' as NavTabId,
    label: '8. AI Market Assistant',
    sublabel: 'Ask any job or salary question',
    icon: Bot
  },
  {
    id: 'architecture' as NavTabId,
    label: '9. Azure Cloud Tech',
    sublabel: 'Live pipeline & telemetry',
    icon: Layers
  }
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  mobileOpen,
  onCloseMobile
}) => {
  return (
    <>
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed lg:static top-[57px] bottom-0 left-0 z-40 w-72 bg-[#161b22] lg:bg-transparent border-r border-[#30363d] p-3 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } overflow-y-auto`}
      >
        <div className="space-y-1.5">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Explorer Modules
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onCloseMobile();
                }}
                className={`w-full text-left px-3.5 py-3 rounded-xl transition flex items-start gap-3 relative ${
                  isActive
                    ? 'bg-[#1f6feb] text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-300 hover:bg-[#21262d] hover:text-white'
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg mt-0.5 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#0d1117] text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold truncate">{item.label}</span>
                    {item.highlight && !isActive && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        AI
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-[11px] truncate mt-0.5 ${
                      isActive ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    {item.sublabel}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Friendly Helper Box */}
        <div className="mt-6 p-3.5 rounded-xl bg-[#0d1117] border border-[#30363d] text-xs space-y-1">
          <div className="font-semibold text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span>How to use this tool</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Click through the numbered sections to explore trends, test your salary, or build your AI career roadmap!
          </p>
        </div>
      </aside>
    </>
  );
};
