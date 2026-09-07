import { TelemetryEvent, TelemetryStats } from '../types/market';

type TelemetryListener = (stats: TelemetryStats) => void;

class TelemetryService {
  private listeners: TelemetryListener[] = [];
  private stats: TelemetryStats = {
    eventsPerSecond: 482,
    totalEventsProcessed: 14892040,
    avgLatencyMs: 18.4,
    activePartitions: 32,
    cosmosWriteThroughputRu: 8450,
    searchIndexVectorCount: 2481920,
    recentEvents: []
  };
  private intervalId: any = null;

  private jobTitles = [
    'Azure AI Solutions Architect',
    'Senior AKS Platform Engineer',
    'Microsoft Fabric Data Specialist',
    'Lead Sentinel Threat Hunter',
    'Full-Stack .NET 8 / React Engineer',
    'Azure IoT Edge Specialist',
    'Staff MLOps / PyTorch Engineer',
    'Enterprise Cloud Security Lead',
    'Azure Synapse BI Developer',
    'DevOps CI/CD Engineer (GitHub Actions)'
  ];

  private sources: Array<'Azure Event Hubs' | 'Stream Analytics' | 'Cosmos DB' | 'Azure AI Search' | 'Synapse Batch'> = [
    'Azure Event Hubs',
    'Stream Analytics',
    'Cosmos DB',
    'Azure AI Search',
    'Synapse Batch'
  ];

  private types: Array<'JOB_INGEST' | 'NLP_EXTRACT' | 'VECTOR_EMBED' | 'SALARY_INDEX' | 'ANOMALY_DETECT'> = [
    'JOB_INGEST',
    'NLP_EXTRACT',
    'VECTOR_EMBED',
    'SALARY_INDEX',
    'ANOMALY_DETECT'
  ];

  private locations = ['Seattle, WA', 'San Francisco, CA', 'New York, NY', 'Austin, TX', 'London, UK', 'Bangalore, IN', 'Berlin, DE', 'Tokyo, JP', 'Zurich, CH', 'Remote Global'];

  constructor() {
    this.seedInitialEvents();
    this.startStreaming();
  }

  private seedInitialEvents() {
    const initial: TelemetryEvent[] = [];
    const now = Date.now();
    for (let i = 8; i >= 0; i--) {
      const time = new Date(now - i * 3200).toLocaleTimeString();
      const title = this.jobTitles[i % this.jobTitles.length];
      const loc = this.locations[i % this.locations.length];
      initial.push({
        id: `ev-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: time,
        source: this.sources[i % this.sources.length],
        type: this.types[i % this.types.length],
        status: i % 7 === 0 ? 'INDEXED' : 'PROCESSED',
        durationMs: Math.floor(12 + Math.random() * 24),
        payload: `[${loc}] Ingested listing "${title}" -> extracted 7 Azure skill vectors`
      });
    }
    this.stats.recentEvents = initial;
  }

  private startStreaming() {
    if (this.intervalId) return;

    this.intervalId = setInterval(() => {
      const now = new Date().toLocaleTimeString();
      const randomTitle = this.jobTitles[Math.floor(Math.random() * this.jobTitles.length)];
      const randomLoc = this.locations[Math.floor(Math.random() * this.locations.length)];
      const randomSource = this.sources[Math.floor(Math.random() * this.sources.length)];
      const randomType = this.types[Math.floor(Math.random() * this.types.length)];

      const newEvent: TelemetryEvent = {
        id: `ev-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: now,
        source: randomSource,
        type: randomType,
        status: randomType === 'VECTOR_EMBED' ? 'INDEXED' : 'PROCESSED',
        durationMs: Math.floor(10 + Math.random() * 28),
        payload: `[${randomLoc}] ${randomType}: "${randomTitle}" -> latency: ${(12 + Math.random() * 10).toFixed(1)}ms`
      };

      // Mutate stats
      const jitterEps = Math.floor(450 + Math.random() * 80);
      const incCount = Math.floor(4 + Math.random() * 8);
      const latency = parseFloat((16 + Math.random() * 5).toFixed(1));
      const ru = Math.floor(8200 + Math.random() * 900);

      this.stats = {
        ...this.stats,
        eventsPerSecond: jitterEps,
        totalEventsProcessed: this.stats.totalEventsProcessed + incCount,
        avgLatencyMs: latency,
        cosmosWriteThroughputRu: ru,
        searchIndexVectorCount: this.stats.searchIndexVectorCount + 1,
        recentEvents: [newEvent, ...this.stats.recentEvents.slice(0, 14)]
      };

      this.notify();
    }, 2400);
  }

  public subscribe(listener: TelemetryListener): () => void {
    this.listeners.push(listener);
    listener(this.stats);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l(this.stats));
  }

  public getStats(): TelemetryStats {
    return this.stats;
  }
}

export const telemetryService = new TelemetryService();
