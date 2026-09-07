import React, { useState, useEffect } from 'react';
import {
  Layers,
  Activity,
  Cpu,
  Database,
  Cloud,
  ArrowRight,
  Terminal,
  Zap,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { telemetryService } from '../../services/telemetryService';
import { TelemetryEvent } from '../../types/market';

export const AzureArchitectureViewer: React.FC = () => {
  const [events, setEvents] = useState<TelemetryEvent[]>([]);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);

  useEffect(() => {
    if (!isStreaming) return;
    const unsub = telemetryService.subscribe(stats => {
      setEvents(stats.recentEvents || []);
    });
    return () => unsub();
  }, [isStreaming]);

  const pipelineStages = [
    {
      id: 'ingestion',
      name: 'Event Hubs Ingestion',
      service: 'Azure Event Hubs',
      throughput: '480+ msg/sec',
      icon: Activity,
      color: 'bg-blue-600'
    },
    {
      id: 'processing',
      name: 'Stream Analytics',
      service: 'Azure Stream Analytics',
      latency: '<18ms latency',
      icon: Cpu,
      color: 'bg-purple-600'
    },
    {
      id: 'storage',
      name: 'Cosmos DB Data Store',
      service: 'Azure Cosmos DB NoSQL',
      ru: '8,450 RU/s',
      icon: Database,
      color: 'bg-emerald-600'
    },
    {
      id: 'search',
      name: 'AI Vector Search Index',
      service: 'Azure AI Search',
      vectors: '2.48M embeddings',
      icon: Zap,
      color: 'bg-amber-600'
    }
  ];

  return (
    <div className="w-full space-y-10 animate-fade-in flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-color)] text-center sm:text-left">
        <div className="space-y-2">
          <div className="flex items-center justify-center sm:justify-start gap-2.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight mb-1">
              Cloud Real-Time Telemetry & Data Topology
            </h2>
            <span className="azure-badge">Live Event Stream</span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Real-time streaming pipeline topology capturing, enriching, and indexing enterprise labor data.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              isStreaming
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            <span className={isStreaming ? 'pulse-dot' : 'w-2 h-2 rounded-full bg-slate-500'} />
            <span>{isStreaming ? 'Streaming Live' : 'Paused'}</span>
          </button>
        </div>
      </div>

      {/* 4 Pipeline Stages */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {pipelineStages.map((stage, idx) => {
          const Icon = stage.icon;
          return (
            <div
              key={stage.id}
              className="saas-card p-6 rounded-3xl space-y-4 text-center sm:text-left"
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl text-white ${stage.color} shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-[var(--text-muted)] font-bold">
                  Step 0{idx + 1}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">{stage.name}</h3>
                <span className="text-xs text-sky-400 font-mono block leading-relaxed">{stage.service}</span>
              </div>

              <div className="pt-3 border-t border-[var(--border-color)] text-xs text-[var(--text-muted)] font-mono">
                {stage.throughput || stage.latency || stage.ru || stage.vectors}
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Event Console */}
      <div className="w-full saas-card p-6 sm:p-8 rounded-3xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-[var(--text-primary)]">Live Ingestion Event Stream</span>
          </div>
          <span className="text-xs text-[var(--text-muted)] font-mono">Real-Time Event Stream</span>
        </div>

        <div className="h-64 overflow-y-auto font-mono text-[11px] space-y-1.5 p-4 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)]">
          {events.length === 0 ? (
            <div className="text-[var(--text-muted)] text-center py-8">Waiting for incoming telemetry events...</div>
          ) : (
            events.map((evt, idx) => (
              <div key={idx} className="flex items-center gap-3 text-slate-300 py-0.5">
                <span className="text-[var(--text-muted)]">{evt.timestamp}</span>
                <span className="text-sky-400">[{evt.source}]</span>
                <span className="text-emerald-400">{evt.type}</span>
                <span className="text-slate-400 truncate">{evt.payload}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
