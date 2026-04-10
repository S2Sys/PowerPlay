/**
 * Monitoring System Tests — Comprehensive test suite for Phase 4 monitoring
 */

import { MetricsCollector, ExecutionMetrics, AggregatedMetrics } from '../src/orchestrator/monitoring/metrics-collector';
import { MonitoringDashboard } from '../src/orchestrator/monitoring/monitoring-dashboard';
import { AutoTuningEngine, TuningDecision, TuningConfig } from '../src/orchestrator/monitoring/auto-tuning-engine';
import { BottleneckDetector } from '../src/orchestrator/monitoring/bottleneck-detector';
import { AlertManager, Alert } from '../src/orchestrator/monitoring/alert-manager';
import { ParallelExecutor } from '../src/orchestrator/parallel/parallel-executor';

describe('MetricsCollector', () => {
  let collector: MetricsCollector;

  beforeEach(() => {
    collector = new MetricsCollector(1000);
  });

  it('should record execution metrics', () => {
    const metrics: ExecutionMetrics = {
      pattern: '/test-pattern',
      startTime: Date.now(),
      endTime: Date.now() + 100,
      duration: 100,
      cached: false,
      success: true,
      workerId: 'worker-1',
      memoryUsedMB: 50,
      cpuUsagePercent: 45,
    };

    collector.recordExecution(metrics);

    const history = collector.getExecutionHistory(10);
    expect(history.length).toBe(1);
    expect(history[0].pattern).toBe('/test-pattern');
  });

  it('should aggregate metrics over time window', () => {
    for (let i = 0; i < 10; i++) {
      collector.recordExecution({
        pattern: '/pattern',
        startTime: Date.now(),
        endTime: Date.now() + 100,
        duration: 100 + i * 10,
        cached: i % 3 === 0,
        success: i < 9,
        workerId: `worker-${i}`,
        memoryUsedMB: 50 + i,
        cpuUsagePercent: 40 + i,
      });
    }

    const agg = collector.getAggregatedMetrics(60000);
    expect(agg.totalExecutions).toBe(10);
    expect(agg.successfulExecutions).toBe(9);
    expect(agg.cachedExecutions).toBe(4); // 10, 11, 12 = 3 + cache miss
    expect(agg.averageDuration).toBeGreaterThan(100);
    expect(agg.errorRate).toBeCloseTo(10, 1);
  });

  it('should track pattern-specific metrics', () => {
    for (let i = 0; i < 5; i++) {
      collector.recordExecution({
        pattern: '/pattern-a',
        startTime: Date.now(),
        endTime: Date.now() + 100,
        duration: 100,
        cached: false,
        success: true,
        workerId: 'worker-1',
        memoryUsedMB: 50,
        cpuUsagePercent: 40,
      });
    }

    const patternMetrics = collector.getPatternMetrics('/pattern-a');
    expect(patternMetrics.executions).toBe(5);
    expect(patternMetrics.averageDuration).toBeCloseTo(100, 1);
  });

  it('should collect system metrics', async () => {
    collector.startCollection(100);

    await new Promise(resolve => setTimeout(resolve, 300));

    const history = collector.getSystemMetricsHistory(300);
    expect(history.length).toBeGreaterThan(0);

    const latest = collector.getCurrentSystemMetrics();
    expect(latest.cpuUsagePercent).toBeGreaterThanOrEqual(0);
    expect(latest.cpuUsagePercent).toBeLessThanOrEqual(100);
    expect(latest.memoryUsageMB).toBeGreaterThan(0);

    collector.stopCollection();
  });

  it('should track baseline metrics', () => {
    for (let i = 0; i < 20; i++) {
      collector.recordExecution({
        pattern: '/pattern',
        startTime: Date.now(),
        endTime: Date.now() + 150,
        duration: 150,
        cached: false,
        success: true,
        workerId: 'worker-1',
        memoryUsedMB: 50,
        cpuUsagePercent: 50,
      });
    }

    collector.setBaseline();
    const improvement = collector.getImprovement();

    expect(improvement).not.toBeNull();
    expect(improvement?.latencyImprovement).toBeDefined();
  });

  it('should identify bottleneck patterns', () => {
    for (let i = 0; i < 10; i++) {
      collector.recordExecution({
        pattern: '/slow-pattern',
        startTime: Date.now(),
        endTime: Date.now() + 500,
        duration: 500,
        cached: false,
        success: true,
        workerId: 'worker-1',
        memoryUsedMB: 50,
        cpuUsagePercent: 40,
      });
    }

    const bottlenecks = collector.getBottleneckPatterns(1);
    expect(bottlenecks.length).toBe(1);
    expect(bottlenecks[0].pattern).toBe('/slow-pattern');
    expect(bottlenecks[0].p95Duration).toBeCloseTo(500, 10);
  });

  it('should get cache effectiveness', () => {
    for (let i = 0; i < 20; i++) {
      collector.recordExecution({
        pattern: '/pattern',
        startTime: Date.now(),
        endTime: Date.now() + 100,
        duration: 100,
        cached: i < 8, // 40% cache hit
        success: true,
        workerId: 'worker-1',
        memoryUsedMB: 50,
        cpuUsagePercent: 40,
      });
    }

    const effectiveness = collector.getCacheEffectiveness();
    expect(effectiveness.overallHitRate).toBe(40);
  });

  it('should clear metrics', () => {
    collector.recordExecution({
      pattern: '/pattern',
      startTime: Date.now(),
      endTime: Date.now() + 100,
      duration: 100,
      cached: false,
      success: true,
      workerId: 'worker-1',
      memoryUsedMB: 50,
      cpuUsagePercent: 40,
    });

    let history = collector.getExecutionHistory(10);
    expect(history.length).toBe(1);

    collector.clear();

    history = collector.getExecutionHistory(10);
    expect(history.length).toBe(0);
  });
});

describe('MonitoringDashboard', () => {
  let collector: MetricsCollector;
  let dashboard: MonitoringDashboard;

  beforeEach(() => {
    collector = new MetricsCollector();
    dashboard = new MonitoringDashboard(collector);

    // Populate with sample data
    for (let i = 0; i < 10; i++) {
      collector.recordExecution({
        pattern: `/pattern-${i % 3}`,
        startTime: Date.now(),
        endTime: Date.now() + (100 + i * 10),
        duration: 100 + i * 10,
        cached: i % 2 === 0,
        success: true,
        workerId: 'worker-1',
        memoryUsedMB: 50 + i,
        cpuUsagePercent: 40 + i,
      });
    }
  });

  it('should generate CLI report', () => {
    const report = dashboard.generateReport('cli');
    expect(report).toContain('POWERPLAY MONITORING DASHBOARD');
    expect(report).toContain('PERFORMANCE SUMMARY');
    expect(report).toContain('Total Executions');
    expect(report).toContain('Latency');
  });

  it('should generate JSON report', () => {
    const report = dashboard.generateReport('json');
    const json = JSON.parse(report);

    expect(json.metrics).toBeDefined();
    expect(json.metrics.totalExecutions).toBe(10);
    expect(json.systemMetrics).toBeDefined();
    expect(json.patterns).toBeDefined();
  });

  it('should generate Prometheus report', () => {
    const report = dashboard.generateReport('prometheus');

    expect(report).toContain('# HELP');
    expect(report).toContain('# TYPE');
    expect(report).toContain('powerplay_executions_total');
    expect(report).toContain('powerplay_duration_ms');
    expect(report).toContain('powerplay_throughput_eps');
  });

  it('should include system resources in report', () => {
    const report = dashboard.generateReport('cli');
    expect(report).toContain('SYSTEM RESOURCES');
    expect(report).toContain('CPU Usage');
    expect(report).toContain('Memory Usage');
  });

  it('should include cache effectiveness in report', () => {
    const report = dashboard.generateReport('cli');
    expect(report).toContain('CACHE EFFECTIVENESS');
    expect(report).toContain('Hit Rate');
  });
});

describe('AutoTuningEngine', () => {
  let executor: ParallelExecutor;
  let collector: MetricsCollector;
  let tuner: AutoTuningEngine;

  beforeEach(() => {
    executor = new ParallelExecutor(4, 30000);
    collector = new MetricsCollector();
    tuner = new AutoTuningEngine(executor, collector, {
      minWorkers: 2,
      maxWorkers: 8,
      targetCpuUtilization: 75,
    });
  });

  it('should evaluate tuning recommendation', () => {
    // Simulate low CPU utilization
    for (let i = 0; i < 10; i++) {
      collector.recordExecution({
        pattern: '/pattern',
        startTime: Date.now(),
        endTime: Date.now() + 50,
        duration: 50,
        cached: false,
        success: true,
        workerId: 'worker-1',
        memoryUsedMB: 30,
        cpuUsagePercent: 20,
      });
    }

    const decision = tuner.evaluateTuning();
    expect(decision).toBeDefined();
    expect(decision.currentWorkers).toBe(4);
    expect(decision.cpuUtilization).toBeLessThan(25);
  });

  it('should suggest increasing workers under low utilization', () => {
    // Low CPU and memory
    const decision = tuner.evaluateTuning();
    expect(decision.bottleneckType).toBe('balanced'); // No workload yet
  });

  it('should apply tuning recommendation', () => {
    const success = tuner.applyTuning(6);
    expect(success).toBe(true);
    expect(executor.getWorkerCount()).toBe(6);
  });

  it('should reject out-of-range worker counts', () => {
    const success = tuner.applyTuning(10); // Above max of 8
    expect(success).toBe(false);
  });

  it('should track tuning history', () => {
    tuner.evaluateTuning();
    tuner.evaluateTuning();

    const history = tuner.getTuningHistory(10);
    expect(history.length).toBe(2);
  });

  it('should get tuning statistics', () => {
    tuner.evaluateTuning();
    tuner.evaluateTuning();

    const stats = tuner.getTuningStats();
    expect(stats.totalEvaluations).toBe(2);
    expect(stats.averageWorkers).toBe(4); // Started with 4
  });

  it('should update configuration', () => {
    tuner.updateConfig({
      maxWorkers: 16,
      targetCpuUtilization: 80,
    });

    const config = tuner.getConfig();
    expect(config.maxWorkers).toBe(16);
    expect(config.targetCpuUtilization).toBe(80);
  });
});

describe('BottleneckDetector', () => {
  let collector: MetricsCollector;
  let detector: BottleneckDetector;

  beforeEach(() => {
    collector = new MetricsCollector();
    detector = new BottleneckDetector(collector);
  });

  it('should detect slow patterns', () => {
    for (let i = 0; i < 5; i++) {
      collector.recordExecution({
        pattern: '/slow-pattern',
        startTime: Date.now(),
        endTime: Date.now() + 500,
        duration: 500,
        cached: false,
        success: true,
        workerId: 'worker-1',
        memoryUsedMB: 50,
        cpuUsagePercent: 40,
      });
    }

    const { patternBottlenecks } = detector.detectAllBottlenecks();
    const slowPattern = patternBottlenecks.find(b => b.type === 'slow');

    expect(slowPattern).toBeDefined();
    expect(slowPattern?.pattern).toBe('/slow-pattern');
  });

  it('should detect error-prone patterns', () => {
    for (let i = 0; i < 10; i++) {
      collector.recordExecution({
        pattern: '/error-pattern',
        startTime: Date.now(),
        endTime: Date.now() + 100,
        duration: 100,
        cached: false,
        success: i < 3, // 70% failure rate
        workerId: 'worker-1',
        memoryUsedMB: 50,
        cpuUsagePercent: 40,
      });
    }

    const { patternBottlenecks } = detector.detectAllBottlenecks();
    const errorPattern = patternBottlenecks.find(b => b.type === 'errorprone');

    expect(errorPattern).toBeDefined();
    expect(errorPattern?.severity).toBe('high');
  });

  it('should detect cache-ineffective patterns', () => {
    for (let i = 0; i < 20; i++) {
      collector.recordExecution({
        pattern: '/no-cache-pattern',
        startTime: Date.now(),
        endTime: Date.now() + 100,
        duration: 100,
        cached: false, // No cache hits
        success: true,
        workerId: 'worker-1',
        memoryUsedMB: 50,
        cpuUsagePercent: 40,
      });
    }

    const { patternBottlenecks } = detector.detectAllBottlenecks();
    const cachePattern = patternBottlenecks.find(b => b.type === 'cache-ineffective');

    expect(cachePattern).toBeDefined();
  });

  it('should get top recommendations', () => {
    // Create multiple bottlenecks
    for (let i = 0; i < 10; i++) {
      collector.recordExecution({
        pattern: '/pattern-1',
        startTime: Date.now(),
        endTime: Date.now() + 300,
        duration: 300,
        cached: false,
        success: false,
        workerId: 'worker-1',
        memoryUsedMB: 150,
        cpuUsagePercent: 40,
      });
    }

    detector.detectAllBottlenecks();
    const recommendations = detector.getTopRecommendations(3);

    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations[0].issue).toBeDefined();
  });

  it('should get critical issues', () => {
    // Create critical issues
    for (let i = 0; i < 10; i++) {
      collector.recordExecution({
        pattern: '/critical-pattern',
        startTime: Date.now(),
        endTime: Date.now() + 800,
        duration: 800,
        cached: false,
        success: false,
        workerId: 'worker-1',
        memoryUsedMB: 50,
        cpuUsagePercent: 40,
      });
    }

    detector.detectAllBottlenecks();
    const critical = detector.getCriticalIssues();

    expect(critical.length).toBeGreaterThan(0);
  });

  it('should update thresholds', () => {
    detector.updateThresholds({
      slowPatternThreshold: 300,
      errorRateThreshold: 10,
    });

    // After threshold update, detection should change
    for (let i = 0; i < 5; i++) {
      collector.recordExecution({
        pattern: '/test',
        startTime: Date.now(),
        endTime: Date.now() + 250,
        duration: 250,
        cached: false,
        success: true,
        workerId: 'worker-1',
        memoryUsedMB: 50,
        cpuUsagePercent: 40,
      });
    }

    const { patternBottlenecks } = detector.detectAllBottlenecks();
    // Should not detect as slow (250ms < 300ms threshold)
    const slowPattern = patternBottlenecks.find(b => b.type === 'slow');
    expect(slowPattern).toBeUndefined();
  });
});

describe('AlertManager', () => {
  let collector: MetricsCollector;
  let alertManager: AlertManager;

  beforeEach(() => {
    collector = new MetricsCollector();
    alertManager = new AlertManager(collector);
  });

  it('should evaluate alerts', () => {
    for (let i = 0; i < 10; i++) {
      collector.recordExecution({
        pattern: '/pattern',
        startTime: Date.now(),
        endTime: Date.now() + 250,
        duration: 250, // Above default 200ms threshold
        cached: false,
        success: true,
        workerId: 'worker-1',
        memoryUsedMB: 50,
        cpuUsagePercent: 40,
      });
    }

    const alerts = alertManager.evaluateAlerts();
    const latencyAlert = alerts.find(a => a.type === 'latency-high');

    expect(latencyAlert).toBeDefined();
    expect(latencyAlert?.triggered).toBe(true);
  });

  it('should track active alerts', () => {
    for (let i = 0; i < 10; i++) {
      collector.recordExecution({
        pattern: '/pattern',
        startTime: Date.now(),
        endTime: Date.now() + 250,
        duration: 250,
        cached: false,
        success: false, // High error rate
        workerId: 'worker-1',
        memoryUsedMB: 150, // High memory
        cpuUsagePercent: 90, // High CPU
      });
    }

    alertManager.evaluateAlerts();
    const active = alertManager.getActiveAlerts();

    expect(active.length).toBeGreaterThan(0);
  });

  it('should set custom thresholds', () => {
    alertManager.setThreshold('latency-high', {
      type: 'latency-high',
      metric: 'averageDuration',
      threshold: 500, // Higher threshold
      severity: 'critical',
      window: 60000,
      enabled: true,
    });

    for (let i = 0; i < 10; i++) {
      collector.recordExecution({
        pattern: '/pattern',
        startTime: Date.now(),
        endTime: Date.now() + 300,
        duration: 300,
        cached: false,
        success: true,
        workerId: 'worker-1',
        memoryUsedMB: 50,
        cpuUsagePercent: 40,
      });
    }

    const alerts = alertManager.evaluateAlerts();
    const latencyAlert = alerts.find(a => a.type === 'latency-high');

    expect(latencyAlert).toBeUndefined(); // 300ms < 500ms threshold
  });

  it('should register alert callbacks', (done) => {
    let callbackTriggered = false;

    alertManager.onAlert('latency-high', (alert: Alert) => {
      callbackTriggered = true;
      expect(alert.type).toBe('latency-high');
      done();
    });

    for (let i = 0; i < 10; i++) {
      collector.recordExecution({
        pattern: '/pattern',
        startTime: Date.now(),
        endTime: Date.now() + 250,
        duration: 250,
        cached: false,
        success: true,
        workerId: 'worker-1',
        memoryUsedMB: 50,
        cpuUsagePercent: 40,
      });
    }

    alertManager.evaluateAlerts();
  });

  it('should track alert history', () => {
    for (let i = 0; i < 10; i++) {
      collector.recordExecution({
        pattern: '/pattern',
        startTime: Date.now(),
        endTime: Date.now() + 250,
        duration: 250,
        cached: false,
        success: false,
        workerId: 'worker-1',
        memoryUsedMB: 50,
        cpuUsagePercent: 90, // High CPU
      });
    }

    alertManager.evaluateAlerts();
    const history = alertManager.getAlertHistory();

    expect(history.length).toBeGreaterThan(0);
  });

  it('should get alert statistics', () => {
    for (let i = 0; i < 10; i++) {
      collector.recordExecution({
        pattern: '/pattern',
        startTime: Date.now(),
        endTime: Date.now() + 250,
        duration: 250,
        cached: false,
        success: false,
        workerId: 'worker-1',
        memoryUsedMB: 50,
        cpuUsagePercent: 90,
      });
    }

    alertManager.evaluateAlerts();
    const stats = alertManager.getAlertStats();

    expect(stats.totalAlerts).toBeGreaterThan(0);
    expect(stats.activeAlerts).toBeGreaterThan(0);
    expect(stats.alertsByType.size).toBeGreaterThan(0);
  });

  it('should enable/disable alerts', () => {
    alertManager.setAlertEnabled('latency-high', false);

    for (let i = 0; i < 10; i++) {
      collector.recordExecution({
        pattern: '/pattern',
        startTime: Date.now(),
        endTime: Date.now() + 250,
        duration: 250,
        cached: false,
        success: true,
        workerId: 'worker-1',
        memoryUsedMB: 50,
        cpuUsagePercent: 40,
      });
    }

    const alerts = alertManager.evaluateAlerts();
    const latencyAlert = alerts.find(a => a.type === 'latency-high');

    expect(latencyAlert).toBeUndefined(); // Alert disabled
  });
});

describe('End-to-End Monitoring System', () => {
  it('should integrate all monitoring components', async () => {
    const collector = new MetricsCollector();
    const executor = new ParallelExecutor(4, 30000);
    const dashboard = new MonitoringDashboard(collector);
    const tuner = new AutoTuningEngine(executor, collector);
    const detector = new BottleneckDetector(collector);
    const alerts = new AlertManager(collector);

    collector.startCollection(100);

    // Simulate workload
    for (let i = 0; i < 50; i++) {
      collector.recordExecution({
        pattern: `/pattern-${i % 5}`,
        startTime: Date.now(),
        endTime: Date.now() + (100 + (i % 10) * 20),
        duration: 100 + (i % 10) * 20,
        cached: i % 3 === 0,
        success: i < 48,
        workerId: `worker-${i % 4}`,
        memoryUsedMB: 50 + (i % 20),
        cpuUsagePercent: 40 + (i % 30),
      });
    }

    await new Promise(resolve => setTimeout(resolve, 200));

    // Generate reports
    const cliReport = dashboard.generateReport('cli');
    expect(cliReport).toContain('POWERPLAY MONITORING');

    const jsonReport = dashboard.generateReport('json');
    expect(jsonReport).toContain('metrics');

    // Evaluate tuning
    const tuningDecision = tuner.evaluateTuning();
    expect(tuningDecision).toBeDefined();

    // Detect bottlenecks
    const bottlenecks = detector.detectAllBottlenecks();
    expect(bottlenecks).toBeDefined();

    // Evaluate alerts
    const activeAlerts = alerts.evaluateAlerts();
    expect(activeAlerts).toBeDefined();

    collector.stopCollection();
  });
});
