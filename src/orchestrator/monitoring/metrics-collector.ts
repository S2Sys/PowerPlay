/**
 * Metrics Collector — Real-time performance metrics collection
 * Tracks CPU, memory, latency, throughput for optimization
 */

import * as os from 'os';

/**
 * Individual execution metrics
 */
export interface ExecutionMetrics {
  pattern: string;
  startTime: number;
  endTime: number;
  duration: number;
  cached: boolean;
  success: boolean;
  error?: string;
  workerId: string;
  memoryUsedMB: number;
  cpuUsagePercent: number;
}

/**
 * Aggregated metrics over time window
 */
export interface AggregatedMetrics {
  timeWindow: number; // milliseconds
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  cachedExecutions: number;
  averageDuration: number;
  minDuration: number;
  maxDuration: number;
  p50Duration: number;
  p95Duration: number;
  p99Duration: number;
  throughput: number; // executions per second
  errorRate: number; // percentage
  cacheHitRate: number; // percentage
  averageMemory: number; // MB
  peakMemory: number; // MB
  averageCPU: number; // percentage
  peakCPU: number; // percentage
  timestamp: number;
}

/**
 * Per-pattern performance metrics
 */
export interface PatternMetrics {
  pattern: string;
  executions: number;
  averageDuration: number;
  p95Duration: number;
  successRate: number;
  cacheHitRate: number;
  memoryUsed: number;
  cpuUsage: number;
  lastExecutedTime: number;
}

/**
 * System resource metrics
 */
export interface SystemMetrics {
  cpuUsagePercent: number;
  memoryUsageMB: number;
  memoryUsagePercent: number;
  freeMemoryMB: number;
  uptime: number;
  loadAverage: number[];
}

/**
 * Metrics collector for real-time monitoring
 */
export class MetricsCollector {
  private executions: ExecutionMetrics[] = [];
  private maxHistorySize: number = 10000;
  private systemMetricsInterval: NodeJS.Timer | null = null;
  private systemMetricsHistory: SystemMetrics[] = [];
  private patternMetricsMap: Map<string, ExecutionMetrics[]> = new Map();
  private baselineMetrics: AggregatedMetrics | null = null;
  private isCollecting: boolean = false;

  constructor(maxHistorySize: number = 10000) {
    this.maxHistorySize = maxHistorySize;
  }

  /**
   * Start collecting system metrics
   */
  startCollection(intervalMs: number = 1000): void {
    if (this.isCollecting) return;

    this.isCollecting = true;
    this.systemMetricsInterval = setInterval(() => {
      const metrics = this.collectSystemMetrics();
      this.systemMetricsHistory.push(metrics);

      // Trim history if too large
      if (this.systemMetricsHistory.length > 1000) {
        this.systemMetricsHistory = this.systemMetricsHistory.slice(-1000);
      }
    }, intervalMs);
  }

  /**
   * Stop collecting system metrics
   */
  stopCollection(): void {
    if (this.systemMetricsInterval) {
      clearInterval(this.systemMetricsInterval);
      this.systemMetricsInterval = null;
    }
    this.isCollecting = false;
  }

  /**
   * Record execution metrics
   */
  recordExecution(metrics: ExecutionMetrics): void {
    this.executions.push(metrics);

    // Track pattern-specific metrics
    if (!this.patternMetricsMap.has(metrics.pattern)) {
      this.patternMetricsMap.set(metrics.pattern, []);
    }
    this.patternMetricsMap.get(metrics.pattern)!.push(metrics);

    // Trim history if too large
    if (this.executions.length > this.maxHistorySize) {
      this.executions = this.executions.slice(-this.maxHistorySize);
    }
  }

  /**
   * Get aggregated metrics over time window
   */
  getAggregatedMetrics(timeWindowMs: number = 60000): AggregatedMetrics {
    const now = Date.now();
    const cutoff = now - timeWindowMs;

    const filtered = this.executions.filter(m => m.endTime > cutoff);

    if (filtered.length === 0) {
      return this.getEmptyAggregatedMetrics(timeWindowMs);
    }

    const durations = filtered.map(m => m.duration).sort((a, b) => a - b);
    const successful = filtered.filter(m => m.success).length;
    const cached = filtered.filter(m => m.cached).length;

    return {
      timeWindow: timeWindowMs,
      totalExecutions: filtered.length,
      successfulExecutions: successful,
      failedExecutions: filtered.length - successful,
      cachedExecutions: cached,
      averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
      minDuration: durations[0],
      maxDuration: durations[durations.length - 1],
      p50Duration: this.percentile(durations, 0.5),
      p95Duration: this.percentile(durations, 0.95),
      p99Duration: this.percentile(durations, 0.99),
      throughput: (filtered.length / (timeWindowMs / 1000)),
      errorRate: ((filtered.length - successful) / filtered.length) * 100,
      cacheHitRate: (cached / filtered.length) * 100,
      averageMemory: filtered.reduce((a, b) => a + b.memoryUsedMB, 0) / filtered.length,
      peakMemory: Math.max(...filtered.map(m => m.memoryUsedMB)),
      averageCPU: filtered.reduce((a, b) => a + b.cpuUsagePercent, 0) / filtered.length,
      peakCPU: Math.max(...filtered.map(m => m.cpuUsagePercent)),
      timestamp: now,
    };
  }

  /**
   * Get pattern-specific metrics
   */
  getPatternMetrics(pattern: string): PatternMetrics {
    const metrics = this.patternMetricsMap.get(pattern) || [];

    if (metrics.length === 0) {
      return {
        pattern,
        executions: 0,
        averageDuration: 0,
        p95Duration: 0,
        successRate: 0,
        cacheHitRate: 0,
        memoryUsed: 0,
        cpuUsage: 0,
        lastExecutedTime: 0,
      };
    }

    const durations = metrics.map(m => m.duration).sort((a, b) => a - b);
    const successful = metrics.filter(m => m.success).length;
    const cached = metrics.filter(m => m.cached).length;
    const lastExecution = metrics[metrics.length - 1];

    return {
      pattern,
      executions: metrics.length,
      averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
      p95Duration: this.percentile(durations, 0.95),
      successRate: (successful / metrics.length) * 100,
      cacheHitRate: (cached / metrics.length) * 100,
      memoryUsed: metrics.reduce((a, b) => a + b.memoryUsedMB, 0) / metrics.length,
      cpuUsage: metrics.reduce((a, b) => a + b.cpuUsagePercent, 0) / metrics.length,
      lastExecutedTime: lastExecution.endTime,
    };
  }

  /**
   * Get all pattern metrics
   */
  getAllPatternMetrics(): PatternMetrics[] {
    const patterns = Array.from(this.patternMetricsMap.keys());
    return patterns.map(pattern => this.getPatternMetrics(pattern));
  }

  /**
   * Get system metrics from history
   */
  getSystemMetricsHistory(timeWindowMs: number = 60000): SystemMetrics[] {
    const now = Date.now();
    const cutoff = now - timeWindowMs;

    return this.systemMetricsHistory.filter(m => m.uptime > cutoff);
  }

  /**
   * Get current system metrics
   */
  getCurrentSystemMetrics(): SystemMetrics {
    if (this.systemMetricsHistory.length > 0) {
      return this.systemMetricsHistory[this.systemMetricsHistory.length - 1];
    }
    return this.collectSystemMetrics();
  }

  /**
   * Set baseline metrics for comparison
   */
  setBaseline(): void {
    this.baselineMetrics = this.getAggregatedMetrics(300000); // 5 minutes
  }

  /**
   * Get improvement over baseline
   */
  getImprovement(): {
    latencyImprovement: number; // percentage
    throughputImprovement: number; // percentage
    errorRateImprovement: number; // percentage
  } | null {
    if (!this.baselineMetrics) return null;

    const current = this.getAggregatedMetrics(300000);

    return {
      latencyImprovement: ((this.baselineMetrics.averageDuration - current.averageDuration) / this.baselineMetrics.averageDuration) * 100,
      throughputImprovement: ((current.throughput - this.baselineMetrics.throughput) / this.baselineMetrics.throughput) * 100,
      errorRateImprovement: ((this.baselineMetrics.errorRate - current.errorRate) / this.baselineMetrics.errorRate) * 100,
    };
  }

  /**
   * Get bottleneck patterns (slow execution)
   */
  getBottleneckPatterns(count: number = 5): PatternMetrics[] {
    return this.getAllPatternMetrics()
      .sort((a, b) => b.p95Duration - a.p95Duration)
      .slice(0, count);
  }

  /**
   * Get error-prone patterns
   */
  getErrorPronePatterns(count: number = 5): PatternMetrics[] {
    return this.getAllPatternMetrics()
      .filter(m => m.executions >= 5) // At least 5 executions
      .sort((a, b) => b.successRate - a.successRate)
      .slice(0, count);
  }

  /**
   * Get cache effectiveness
   */
  getCacheEffectiveness(): {
    overallHitRate: number;
    patternHitRates: Map<string, number>;
    topCachedPatterns: PatternMetrics[];
  } {
    const allMetrics = this.getAggregatedMetrics(300000);
    const patternMetrics = this.getAllPatternMetrics();

    const patternHitRates = new Map<string, number>();
    patternMetrics.forEach(m => {
      patternHitRates.set(m.pattern, m.cacheHitRate);
    });

    return {
      overallHitRate: allMetrics.cacheHitRate,
      patternHitRates,
      topCachedPatterns: patternMetrics
        .filter(m => m.cacheHitRate > 0)
        .sort((a, b) => b.cacheHitRate - a.cacheHitRate)
        .slice(0, 5),
    };
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.executions = [];
    this.systemMetricsHistory = [];
    this.patternMetricsMap.clear();
    this.baselineMetrics = null;
  }

  /**
   * Get execution history (recent N executions)
   */
  getExecutionHistory(count: number = 100): ExecutionMetrics[] {
    return this.executions.slice(-count);
  }

  /**
   * Get execution count by pattern
   */
  getExecutionCount(pattern: string): number {
    return this.patternMetricsMap.get(pattern)?.length || 0;
  }

  /**
   * Private: Collect system metrics
   */
  private collectSystemMetrics(): SystemMetrics {
    const cpus = os.cpus();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;

    // Calculate CPU usage
    let totalIdle = 0;
    let totalTick = 0;

    for (const cpu of cpus) {
      for (const type of Object.keys(cpu.times)) {
        totalTick += cpu.times[type as keyof typeof cpu.times];
      }
      totalIdle += cpu.times.idle;
    }

    const cpuUsagePercent = 100 - ~~(100 * totalIdle / totalTick);

    return {
      cpuUsagePercent: Math.max(0, Math.min(100, cpuUsagePercent)),
      memoryUsageMB: usedMemory / 1024 / 1024,
      memoryUsagePercent: (usedMemory / totalMemory) * 100,
      freeMemoryMB: freeMemory / 1024 / 1024,
      uptime: Date.now(),
      loadAverage: os.loadavg(),
    };
  }

  /**
   * Private: Calculate percentile
   */
  private percentile(sorted: number[], percentile: number): number {
    if (sorted.length === 0) return 0;
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }

  /**
   * Private: Empty metrics
   */
  private getEmptyAggregatedMetrics(timeWindowMs: number): AggregatedMetrics {
    return {
      timeWindow: timeWindowMs,
      totalExecutions: 0,
      successfulExecutions: 0,
      failedExecutions: 0,
      cachedExecutions: 0,
      averageDuration: 0,
      minDuration: 0,
      maxDuration: 0,
      p50Duration: 0,
      p95Duration: 0,
      p99Duration: 0,
      throughput: 0,
      errorRate: 0,
      cacheHitRate: 0,
      averageMemory: 0,
      peakMemory: 0,
      averageCPU: 0,
      peakCPU: 0,
      timestamp: Date.now(),
    };
  }
}

/**
 * Factory function to create metrics collector
 */
export function createMetricsCollector(maxHistorySize: number = 10000): MetricsCollector {
  return new MetricsCollector(maxHistorySize);
}
