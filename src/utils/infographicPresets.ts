import { InfographicData } from '../types/studio';

export const CLOUD_ARCHITECTURE_PRESET: InfographicData = {
  title: 'Distributed Cloud Architecture',
  subtitle: 'High-throughput event streaming with zero-downtime microservices and automated failover.',
  tag: 'SYSTEM BENCHMARK 2026',
  themeId: 'midnight',
  template: 'bento',
  bentoItems: [
    {
      id: '1',
      title: 'Throughput',
      value: '1.4M req/s',
      change: '+38%',
      description: 'Peak edge request volume across 32 geographic zones.',
      icon: 'zap',
    },
    {
      id: '2',
      title: 'Global Latency',
      value: '12ms',
      change: '-45%',
      description: 'p99 latency measured across distributed PoPs.',
      icon: 'activity',
    },
    {
      id: '3',
      title: 'Core Uptime',
      value: '99.99%',
      change: '+0.04%',
      description: 'High availability SLA across all active regions.',
      icon: 'shield',
    },
    {
      id: '4',
      title: 'Active Nodes',
      value: '4,096',
      change: '+12%',
      description: 'Containerized micro-instances running orchestrator.',
      icon: 'cpu',
    },
  ],
  timelineItems: [
    { step: '01', title: 'Data Ingestion', desc: 'Raw events buffered via Kafka clusters at 100k msg/sec.', status: 'completed' },
    { step: '02', title: 'Stream Processing', desc: 'Realtime aggregation and enrichment using Rust workers.', status: 'completed' },
    { step: '03', title: 'Vector Indexing', desc: 'Multi-dimensional embedding generation and clustering.', status: 'in-progress' },
    { step: '04', title: 'Edge Delivery', desc: 'Cached responses served to clients globally via CDN.', status: 'upcoming' },
  ],
  comparison: {
    leftTitle: 'Legacy Monolith',
    rightTitle: 'Modern Event-Driven',
    leftItems: [
      'Single point of failure',
      '2.4s Average cold restart',
      'Manual database sharding',
      'Complex deployment pipelines'
    ],
    rightItems: [
      'Zero-downtime rolling deploys',
      'Sub-15ms cold start micro-VMs',
      'Automated multi-region replication',
      'GitOps automated pipeline'
    ]
  },
  statHighlight: {
    number: '99.98',
    unit: '%',
    growth: '+14.2% YoY',
    metricLabel: 'Automated CI/CD Deployment Success Rate',
    footnote: 'Calculated over 420,000 automated production deployments in 2026.'
  }
};

export const PROMISE_INFOGRAPHIC_PRESET: InfographicData = {
  title: 'Promise.all vs Promise.allSettled',
  subtitle: 'Understanding short-circuit fail-fast behavior vs complete settlement in modern JavaScript asynchronous control flow.',
  tag: 'JAVASCRIPT ASYNC CHEATSHEET',
  themeId: 'midnight',
  template: 'comparison',
  bentoItems: [
    {
      id: '1',
      title: 'Short-Circuit',
      value: 'Immediate',
      change: 'Promise.all',
      description: 'Aborts and rejects as soon as any single promise fails.',
      icon: 'zap',
    },
    {
      id: '2',
      title: 'Settlement',
      value: '100% Wait',
      change: 'allSettled',
      description: 'Waits for all promises to finish regardless of success or error.',
      icon: 'shield',
    },
    {
      id: '3',
      title: 'Specification',
      value: 'ES6 vs ES11',
      change: 'Standard',
      description: 'Promise.all introduced in ES2015; allSettled added in ES2020.',
      icon: 'database',
    },
    {
      id: '4',
      title: 'Output Type',
      value: 'T[] vs Status[]',
      change: 'Strict',
      description: 'all returns direct values; allSettled returns { status, value | reason } objects.',
      icon: 'cpu',
    },
  ],
  timelineItems: [
    { step: '01', title: 'Dispatch Promises', desc: 'Execute multiple parallel fetch requests or async tasks simultaneously.', status: 'completed' },
    { step: '02', title: 'Await Settlement', desc: 'Promise.all catches first rejection; allSettled waits for all outcomes.', status: 'completed' },
    { step: '03', title: 'Extract Values', desc: 'Filter results with .filter(r => r.status === "fulfilled") for allSettled.', status: 'in-progress' },
    { step: '04', title: 'Graceful Fallback', desc: 'Display partial UI data without letting one failing API break the page.', status: 'upcoming' },
  ],
  comparison: {
    leftTitle: 'Promise.all() [Fail-Fast]',
    rightTitle: 'Promise.allSettled() [Resilient]',
    leftItems: [
      'Rejects immediately on first rejection',
      'Short-circuits: ignores other ongoing tasks',
      'Returns direct values array: [val1, val2]',
      'Best for: Interdependent atomic transactions',
      'One failing API breaks the entire call'
    ],
    rightItems: [
      'Always resolves after ALL promises complete',
      'Never short-circuits: captures all errors',
      'Returns descriptors: { status, value | reason }',
      'Best for: Independent batch operations & logs',
      'Gracefully tolerates partial failures'
    ]
  },
  statHighlight: {
    number: '100',
    unit: '%',
    growth: 'Zero Short-Circuit',
    metricLabel: 'Promise.allSettled Guarantees Full Batch Completion',
    footnote: 'Native in all modern JS engines (Node 12.9+, Chrome 76+, Safari 13+).'
  }
};
