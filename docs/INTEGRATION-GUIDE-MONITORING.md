# PowerPlay v3.9.0 — Monitoring Integration Guide

**How the Monitoring TypeScript Files Are Used in PowerPlay**

---

## Architecture Overview

The 5 monitoring TypeScript modules integrate into PowerPlay's orchestration pipeline to provide **real-time performance visibility and automatic optimization**:

```
┌─────────────────────────────────────────────────────────────────┐
│                      PowerPlay Orchestration                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  User Input (Requirements)                                        │
│         ↓                                                         │
│  Batch Processor (Phase 2)                                        │
│         ↓                                                         │
│  ┌─────────────────────────────────────────────────────┐         │
│  │  Cache-Aware Executor (Phase 3)                      │         │
│  │  ┌──────────────────────────────────────────────────┤         │
│  │  │  Parallel Executor (Phase 1)                      │         │
│  │  │  • 4 Worker Threads                              │         │
│  │  │  • Dependency Analysis                           │         │
│  │  │  • Load Balancing                                │         │
│  │  └──────────────────────────────────────────────────┤         │
│  │                                                      │         │
│  │  Each pattern execution:                            │         │
│  │  1. Check cache (Phase 3)                           │         │
│  │  2. Execute pattern (Phase 1)                       │         │
│  │  3. Collect metrics (Phase 4) ◄─────────────┐       │         │
│  │  4. Cache result (Phase 3)                  │       │         │
│  └──────────────────────────────────────────────┼──────┘         │
│                                                 │                 │
└─────────────────────────────────────────────────┼─────────────────┘
                                                  │
                    ┌─────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
    ┌───▼────────┐    ┌────────▼────┐
    │  Metrics   │    │  Monitoring  │
    │ Collection │───▶│  Analysis    │
    └────────────┘    └──────────────┘
         Phase 4            Phase 4
```

---

## Phase 4 Monitoring Modules

### 1. MetricsCollector (metrics-collector.ts)

**Purpose**: Continuously collect execution and system metrics

**Where It's Used**:
```
Every pattern execution reports back:
  • Pattern name
  • Duration (milliseconds)
  • Success/failure status
  • Cache hit/miss
  • Memory used (MB)
  • CPU usage (%)
```

**Integration Points**:
```typescript
// In pattern execution handler
const metrics = new MetricsCollector();
metrics.startCollection(1000); // Collect system metrics every 1 sec

// After each pattern execution
metrics.recordExecution({
  pattern: '/requirements-to-specs',
  startTime: executionStart,
  endTime: Date.now(),
  duration: executionTime,
  cached: fromCache,
  success: !hadError,
  memoryUsedMB: process.memoryUsage().heapUsed / 1024 / 1024,
  cpuUsagePercent: osMetrics.cpu,
  workerId: workerThread.id,
});
```

**Data Captured**:
- **Per-Pattern**: Count, avg/p95 duration, success rate, cache hit rate, memory, CPU
- **Aggregated (60-second window)**: Total executions, throughput, error rate, cache effectiveness
- **System-Wide**: CPU%, memory%, load average, free memory

**Example Output**:
```
{
  totalExecutions: 342,
  successfulExecutions: 340,
  cachedExecutions: 128,
  averageDuration: 145.2,
  p95Duration: 280.5,
  throughput: 5.7,  // patterns/second
  errorRate: 0.58,
  cacheHitRate: 37.4,
  memoryUsed: 520MB
}
```

---

### 2. MonitoringDashboard (monitoring-dashboard.ts)

**Purpose**: Visualize metrics in multiple formats for different use cases

**Where It's Used**:
```
During execution, display real-time performance:
  • CLI: Live terminal dashboard (human inspection)
  • JSON: REST API endpoints (tooling/scripts)
  • Prometheus: Monitoring system integration
```

**Integration Points**:

**CLI Dashboard** (human-readable):
```typescript
const dashboard = new MonitoringDashboard(metricsCollector);

// Print every 30 seconds
setInterval(() => {
  console.clear();
  console.log(dashboard.generateReport('cli'));
}, 30000);

// Output:
// ┌─ PERFORMANCE SUMMARY ──────────┐
// │ Total Executions:    342       │
// │ Success Rate:        99.4%     │
// │ Cache Hit Rate:      37.4%     │
// │ Average Latency:     145ms     │
// │ P95 Latency:         280ms     │
// │ Throughput:          5.7 ex/s  │
// └────────────────────────────────┘
```

**JSON Export** (for APIs/tooling):
```typescript
const jsonReport = dashboard.generateReport('json');
// REST API endpoint
app.get('/api/metrics', (req, res) => {
  res.json(JSON.parse(jsonReport));
});

// Client can fetch and process:
// GET /api/metrics → { metrics: {...}, patterns: [...], alerts: [...] }
```

**Prometheus Metrics** (for monitoring systems like Grafana):
```typescript
const prometheusMetrics = dashboard.generateReport('prometheus');
// Expose on metrics port (e.g., :9090)
app.get('/metrics', (req, res) => {
  res.type('text/plain');
  res.send(prometheusMetrics);
});

// Prometheus scrapes:
// powerplay_executions_total{status="success"} 340
// powerplay_duration_ms{quantile="p95"} 280.5
// powerplay_throughput_eps 5.7
// powerplay_cache_hit_rate_percent 37.4
```

---

### 3. AutoTuningEngine (auto-tuning-engine.ts)

**Purpose**: Automatically optimize worker pool size based on bottlenecks

**Where It's Used**:
```
Every 30 seconds:
  1. Analyze metrics from last 60 seconds
  2. Detect bottleneck type (CPU-bound, memory-bound, queue-bound)
  3. Recommend worker count adjustment
  4. Apply if auto-apply enabled
```

**Integration Points**:
```typescript
const tuner = new AutoTuningEngine(executor, metricsCollector, {
  minWorkers: 2,
  maxWorkers: 8,
  targetCpuUtilization: 75,
  autoApply: true, // Automatically adjust
});

tuner.startAutoTuning(); // Runs every 30 seconds

// Tuning Decision Example:
{
  currentWorkers: 4,
  recommendedWorkers: 6,
  bottleneckType: "queue-bound",
  reasoning: "Queue backlog detected. Increase workers to improve throughput.",
  expectedImprovement: 8.5,  // percent
  cpuUtilization: 42,
  memoryUtilization: 55,
  queueDepth: 23
}
```

**How It Works**:

1. **Detect Bottleneck**:
   - CPU > 85% → CPU-bound (reduce workers to cut context switching)
   - Memory > 80% → Memory-bound (reduce workers to reduce pressure)
   - Queue depth > 0 & CPU < 60% → Queue-bound (increase workers)
   - Latency high & CPU low → I/O-bound (increase workers)

2. **Recommend Action**:
   ```typescript
   if (cpuUtilization > 85 && currentWorkers > 2) {
     recommendedWorkers = currentWorkers - 1; // Reduce contention
   }
   if (queueDepth > avg && cpuUtilization < 60 && currentWorkers < 8) {
     recommendedWorkers = currentWorkers + 1; // Process more in parallel
   }
   ```

3. **Apply** (if enabled):
   ```typescript
   executor.setWorkerCount(recommendedWorkers);
   // Workers are gracefully scaled up/down
   ```

**Example Scenario**:
```
Time 0:00
  Metrics: CPU=45%, Memory=50%, Queue=0, Throughput=2.3 ex/s
  Decision: Low utilization, increase workers
  Action: 4 → 6 workers
  Expected impact: +15% throughput

Time 0:30
  Metrics: CPU=78%, Memory=72%, Queue=2, Throughput=4.1 ex/s
  Decision: Optimal, maintain
  Action: None
  
Time 1:00
  Metrics: CPU=92%, Memory=85%, Queue=0, Throughput=4.3 ex/s
  Decision: CPU overloaded, reduce workers
  Action: 6 → 5 workers
  Expected impact: -5% throughput, +20% efficiency
```

---

### 4. BottleneckDetector (bottleneck-detector.ts)

**Purpose**: Identify performance issues and provide actionable recommendations

**Where It's Used**:
```
Every 60 seconds:
  1. Analyze pattern-level performance
  2. Analyze system-level resource usage
  3. Generate recommendations with estimated impact
  4. Alert on critical issues
```

**Integration Points**:

**Pattern-Level Issues**:
```typescript
const detector = new BottleneckDetector(metricsCollector);
const { patternBottlenecks } = detector.detectAllBottlenecks();

// Example output:
patternBottlenecks = [
  {
    pattern: '/architecture-design',
    type: 'slow',
    severity: 'high',
    metric: 450,  // ms
    threshold: 200,
    recommendation: 'Pattern averages 450ms. Consider optimization or caching.',
    estimatedImpact: 12  // % speedup if fixed
  },
  {
    pattern: '/security-scan',
    type: 'errorprone',
    severity: 'critical',
    metric: 8.5,  // error %
    threshold: 5,
    recommendation: 'Pattern has 8.5% failure rate. Investigate error handling.',
    estimatedImpact: 8
  }
];
```

**System-Level Issues**:
```typescript
const { systemBottlenecks } = detector.detectAllBottlenecks();

// Example output:
systemBottlenecks = [
  {
    type: 'cpu-bound',
    severity: 'critical',
    metric: 92,  // CPU %
    threshold: 85,
    recommendation: 'Reduce worker count or optimize CPU patterns',
    estimatedImpact: 10
  },
  {
    type: 'cache-bound',
    severity: 'medium',
    metric: 18,  // cache hit %
    threshold: 30,
    recommendation: 'Cache hit rate only 18%. Increase cache size or adjust TTLs.',
    estimatedImpact: 20
  }
];
```

**Top Recommendations**:
```typescript
const topIssues = detector.getTopRecommendations(5);
// Ranked by estimated impact (highest first)
// User/operator reads and decides which to fix first
```

---

### 5. AlertManager (alert-manager.ts)

**Purpose**: Trigger alerts when performance degrades

**Where It's Used**:
```
Every 60 seconds:
  1. Evaluate all configured alert thresholds
  2. Trigger alerts that exceed thresholds
  3. Call registered callbacks (Slack, email, logs, etc.)
```

**Integration Points**:

**Pre-Configured Alerts**:
```typescript
const alerts = new AlertManager(metricsCollector);

// Default alerts:
// 1. latency-high: Average duration > 200ms
// 2. error-rate-high: Error rate > 5%
// 3. cache-hit-low: Cache hit rate < 20%
// 4. cpu-high: CPU > 85%
// 5. memory-high: Memory > 85%
// 6. throughput-low: Throughput < 1 ex/sec
```

**Custom Alert Thresholds**:
```typescript
alerts.setThreshold('latency-high', {
  threshold: 300,  // Custom: 300ms instead of 200ms
  severity: 'critical',
  window: 60000,
});
```

**Subscribe to Alerts**:
```typescript
// Slack notification
alerts.onAlert('latency-high', (alert) => {
  slack.post({
    channel: '#performance',
    message: `⚠️ ${alert.severity}: ${alert.message}`,
  });
});

// Log alert
alerts.onAlert('cpu-high', (alert) => {
  logger.warn({
    alert: alert.type,
    value: alert.value,
    threshold: alert.threshold,
    timestamp: alert.timestamp,
  });
});

// Trigger escalation
alerts.onAlert('error-rate-high', (alert) => {
  if (alert.severity === 'critical') {
    pageOncall(); // PagerDuty/opsgenie
  }
});
```

**Alert Evaluation**:
```typescript
const triggeredAlerts = alerts.evaluateAlerts();
// Returns: [
//   {
//     type: 'latency-high',
//     severity: 'warning',
//     message: 'Average latency 245ms exceeds threshold 200ms',
//     value: 245,
//     threshold: 200,
//     triggered: true,
//     timestamp: 1681234567
//   },
//   ...
// ]
```

---

## Complete Integration Flow

### Real-Time Monitoring Cycle

```typescript
// 1. START: Setup monitoring
const collector = new MetricsCollector();
const dashboard = new MonitoringDashboard(collector);
const tuner = new AutoTuningEngine(executor, collector);
const detector = new BottleneckDetector(collector);
const alerts = new AlertManager(collector);

collector.startCollection(1000); // Collect system metrics every 1s
tuner.startAutoTuning();         // Optimize every 30s

// 2. SUBSCRIPTION: Register alert handlers
alerts.onAlert('latency-high', (alert) => {
  console.warn(`⚠️ ${alert.message}`);
  notificationService.send(alert);
});

alerts.onAlert('cpu-high', (alert) => {
  logger.warn('System under CPU pressure', { cpu: alert.value });
});

// 3. EXECUTION: During requirement processing
for (const requirement of requirements) {
  for (const pattern of patterns) {
    const startTime = Date.now();
    
    // Execute pattern (with caching)
    const result = await cacheAwareExecutor.executePatternCached(
      pattern,
      requirement,
      context
    );
    
    // 4. COLLECTION: Record metrics
    collector.recordExecution({
      pattern,
      startTime,
      endTime: Date.now(),
      duration: Date.now() - startTime,
      cached: result.metadata.cached,
      success: result.status === 'success',
      memoryUsedMB: getMemoryUsage(),
      cpuUsagePercent: getCpuUsage(),
      workerId: getCurrentWorkerId(),
    });
  }
}

// 5. ANALYSIS: Every 30 seconds
setInterval(async () => {
  // Dashboard
  const report = dashboard.generateReport('cli');
  console.clear();
  console.log(report);
  
  // Tuning
  const tuningDecision = tuner.evaluateTuning();
  if (tuningDecision.recommendedWorkers !== tuningDecision.currentWorkers) {
    logger.info('Worker pool adjusted', tuningDecision);
  }
  
  // Bottlenecks
  const issues = detector.detectAllBottlenecks();
  if (issues.patternBottlenecks.length > 0) {
    logger.warn('Performance bottlenecks detected', issues);
  }
  
  // Alerts
  const triggered = alerts.evaluateAlerts();
  // (Alert handlers called automatically)
}, 30000);

// 6. REPORTING: Export for external systems
app.get('/metrics/cli', (req, res) => {
  res.send(dashboard.generateReport('cli'));
});

app.get('/metrics/json', (req, res) => {
  res.json(JSON.parse(dashboard.generateReport('json')));
});

app.get('/metrics/prometheus', (req, res) => {
  res.type('text/plain');
  res.send(dashboard.generateReport('prometheus'));
});
```

---

## Usage Scenarios

### Scenario 1: Interactive Monitoring
**User monitors execution in real-time**
```
$ npm run orchestrate:watch

[PowerPlay Monitoring Dashboard]

PERFORMANCE SUMMARY (Last 60 seconds)
Total Executions:    342
Successful:          340 (99.4%)
Cached:              128 (37.4% hit rate)

Latency (ms):
  Average:           145ms
  P95:               280ms
  Min/Max:           80ms / 512ms

Throughput:          5.7 exec/sec

SYSTEM RESOURCES
CPU Usage:           62.5%
Memory:              520MB (72%)
Load Average:        2.1

TOP PATTERNS
1. /architecture-design  — 52 executions, avg 180ms
2. /requirements-to-specs — 48 executions, avg 125ms
3. /api-endpoint — 45 executions, avg 95ms

BOTTLENECKS
1. /security-scan — P95: 450ms (slow)
2. /database-design — 2% error rate (errorprone)

> Auto-tuned workers: 4 → 6 (queue-bound detected)
> Estimated improvement: +8%
```

### Scenario 2: API Monitoring
**Third-party tool consumes metrics via REST**
```
GET /api/metrics

{
  "metrics": {
    "totalExecutions": 342,
    "cacheHitRate": 37.4,
    "errorRate": 0.58,
    "averageDuration": 145,
    "p95Duration": 280,
    "throughput": 5.7
  },
  "patterns": [
    {
      "pattern": "/architecture-design",
      "executions": 52,
      "averageDuration": 180,
      "successRate": 100,
      "cacheHitRate": 40
    },
    ...
  ],
  "bottlenecks": [
    {
      "pattern": "/security-scan",
      "type": "slow",
      "metric": 450,
      "recommendation": "Optimize or cache"
    }
  ]
}
```

### Scenario 3: Prometheus Integration
**Grafana/Prometheus dashboard**
```
GET /metrics

# HELP powerplay_executions_total Total pattern executions
# TYPE powerplay_executions_total counter
powerplay_executions_total{status="success"} 340
powerplay_executions_total{status="failed"} 2
powerplay_executions_total{status="cached"} 128

# HELP powerplay_duration_ms Pattern execution duration
# TYPE powerplay_duration_ms gauge
powerplay_duration_ms{quantile="avg"} 145.2
powerplay_duration_ms{quantile="p95"} 280.5
powerplay_duration_ms{quantile="p99"} 512.3

powerplay_cache_hit_rate_percent 37.4
powerplay_error_rate_percent 0.58
powerplay_throughput_eps 5.7

system_cpu_percent 62.5
system_memory_percent 72
```

→ Grafana visualizes with alerts for CPU > 85%, latency p95 > 500ms, etc.

### Scenario 4: Automated Optimization
**System self-optimizes without user intervention**
```
12:00:00 - Worker pool: 4 | CPU: 45% | Queue: 0 | Throughput: 2.3 ex/s
           → Low utilization, increase workers
           → 4 → 6 workers

12:00:30 - Worker pool: 6 | CPU: 78% | Queue: 2 | Throughput: 4.1 ex/s
           → Optimal, maintain
           → No change

12:01:00 - Worker pool: 6 | CPU: 92% | Queue: 0 | Throughput: 4.3 ex/s
           → CPU overloaded, reduce workers
           → 6 → 5 workers
           → Alert: CPU HIGH (92% > 85%)
           → Action: Page oncall team

12:01:30 - Worker pool: 5 | CPU: 71% | Queue: 0 | Throughput: 4.0 ex/s
           → Alert: CPU HIGH (Resolved)
           → Status: OK
```

---

## Configuration in PowerPlay

To enable v3.9.0 monitoring in your PowerPlay configuration:

```yaml
# config.yaml
monitoring:
  enabled: true
  
  metrics:
    collection:
      enabled: true
      intervalMs: 1000  # Collect system metrics every 1 second
      maxHistorySize: 10000
  
  dashboard:
    enabled: true
    formats: ["cli", "json", "prometheus"]
    updateIntervalMs: 30000  # Refresh every 30 seconds
    
  autoTuning:
    enabled: true
    minWorkers: 2
    maxWorkers: 8
    targetCpuUtilization: 75
    targetMemoryUtilization: 70
    evaluationIntervalMs: 30000
    autoApply: true
  
  bottleneckDetection:
    enabled: true
    slowPatternThresholdMs: 200
    errorRateThresholdPercent: 5
    cacheHitThresholdPercent: 20
  
  alerting:
    enabled: true
    evaluationIntervalMs: 60000
    alerts:
      latency-high:
        enabled: true
        threshold: 200
        severity: warning
      error-rate-high:
        enabled: true
        threshold: 5
        severity: critical
      cache-hit-low:
        enabled: true
        threshold: 20
        severity: info
      cpu-high:
        enabled: true
        threshold: 85
        severity: critical
      memory-high:
        enabled: true
        threshold: 85
        severity: critical
      throughput-low:
        enabled: true
        threshold: 1
        severity: warning
```

---

## Summary

The **5 monitoring modules work together** to provide:

| Module | Purpose | Frequency | Output |
|--------|---------|-----------|--------|
| **MetricsCollector** | Collect raw metrics | Continuous | Numbers |
| **MonitoringDashboard** | Visualize metrics | Every 30s | CLI/JSON/Prometheus |
| **AutoTuningEngine** | Optimize workers | Every 30s | Recommendations |
| **BottleneckDetector** | Find bottlenecks | Every 60s | Issues + fixes |
| **AlertManager** | Trigger alerts | Every 60s | Callbacks |

Together, they create a **self-optimizing system** that monitors performance, detects problems, adjusts itself, and alerts operators when human intervention is needed.
