/**
 * Bottleneck Detector — Identifies performance bottlenecks and root causes
 * Analyzes patterns, resource usage, and dependencies
 */

import { MetricsCollector, PatternMetrics, AggregatedMetrics } from './metrics-collector';

/**
 * Bottleneck issue
 */
export interface BottleneckIssue {
  pattern: string;
  type: 'slow' | 'errorprone' | 'resource-heavy' | 'cache-ineffective' | 'dependency';
  severity: 'critical' | 'high' | 'medium' | 'low';
  metric: number;
  threshold: number;
  recommendation: string;
  affectedPatterns: string[];
  estimatedImpact: number; // percentage speedup if fixed
}

/**
 * System bottleneck
 */
export interface SystemBottleneck {
  type: 'cpu-bound' | 'memory-bound' | 'io-bound' | 'cache-bound' | 'dependency-bound';
  severity: 'critical' | 'high' | 'medium' | 'low';
  metric: number;
  threshold: number;
  affectedPatterns: string[];
  recommendation: string;
  estimatedImpact: number;
}

/**
 * Bottleneck detector
 */
export class BottleneckDetector {
  private collector: MetricsCollector;
  private detectionHistory: BottleneckIssue[] = [];
  private systemBottleneckHistory: SystemBottleneck[] = [];

  // Configuration thresholds
  private slowPatternThreshold: number = 200; // ms
  private errorRateThreshold: number = 5; // percentage
  private cacheHitThreshold: number = 20; // percentage
  private cpuThreshold: number = 85; // percentage
  private memoryThreshold: number = 80; // percentage

  constructor(collector: MetricsCollector) {
    this.collector = collector;
  }

  /**
   * Detect all bottlenecks
   */
  detectAllBottlenecks(): {
    patternBottlenecks: BottleneckIssue[];
    systemBottlenecks: SystemBottleneck[];
  } {
    const patternBottlenecks = this.detectPatternBottlenecks();
    const systemBottlenecks = this.detectSystemBottlenecks();

    // Record history
    patternBottlenecks.forEach(b => this.detectionHistory.push(b));
    systemBottlenecks.forEach(b => this.systemBottleneckHistory.push(b));

    // Trim history
    if (this.detectionHistory.length > 1000) {
      this.detectionHistory = this.detectionHistory.slice(-1000);
    }
    if (this.systemBottleneckHistory.length > 1000) {
      this.systemBottleneckHistory = this.systemBottleneckHistory.slice(-1000);
    }

    return { patternBottlenecks, systemBottlenecks };
  }

  /**
   * Detect pattern-level bottlenecks
   */
  detectPatternBottlenecks(): BottleneckIssue[] {
    const issues: BottleneckIssue[] = [];
    const patterns = this.collector.getAllPatternMetrics();
    const allMetrics = this.collector.getAggregatedMetrics(300000);

    for (const pattern of patterns) {
      // Slow execution
      if (pattern.averageDuration > this.slowPatternThreshold) {
        issues.push({
          pattern: pattern.pattern,
          type: 'slow',
          severity: this.calculateSeverity(pattern.averageDuration, 200, 400, 800),
          metric: pattern.averageDuration,
          threshold: this.slowPatternThreshold,
          recommendation: `Pattern "${pattern.pattern}" averages ${pattern.averageDuration.toFixed(0)}ms. Consider optimization, caching, or parallelization within the pattern.`,
          affectedPatterns: [pattern.pattern],
          estimatedImpact: Math.min(20, (pattern.averageDuration - this.slowPatternThreshold) / 10),
        });
      }

      // Error-prone
      if (pattern.successRate < 95) {
        issues.push({
          pattern: pattern.pattern,
          type: 'errorprone',
          severity: this.calculateSeverity(100 - pattern.successRate, 5, 10, 20),
          metric: 100 - pattern.successRate,
          threshold: 5,
          recommendation: `Pattern "${pattern.pattern}" has ${(100 - pattern.successRate).toFixed(1)}% failure rate. Investigate error handling and validation logic.`,
          affectedPatterns: [pattern.pattern],
          estimatedImpact: Math.min(15, (100 - pattern.successRate) * 2),
        });
      }

      // Cache ineffective
      if (pattern.executions > 10 && pattern.cacheHitRate < this.cacheHitThreshold) {
        issues.push({
          pattern: pattern.pattern,
          type: 'cache-ineffective',
          severity: 'low',
          metric: pattern.cacheHitRate,
          threshold: this.cacheHitThreshold,
          recommendation: `Pattern "${pattern.pattern}" has low cache hit rate (${pattern.cacheHitRate.toFixed(1)}%). Consider if inputs vary significantly or if caching TTL is too short.`,
          affectedPatterns: [pattern.pattern],
          estimatedImpact: Math.min(10, (this.cacheHitThreshold - pattern.cacheHitRate) / 5),
        });
      }

      // Resource heavy
      if (pattern.memoryUsed > 100) {
        issues.push({
          pattern: pattern.pattern,
          type: 'resource-heavy',
          severity: this.calculateSeverity(pattern.memoryUsed, 100, 200, 400),
          metric: pattern.memoryUsed,
          threshold: 100,
          recommendation: `Pattern "${pattern.pattern}" uses ${pattern.memoryUsed.toFixed(0)}MB per execution. Optimize data structures or consider streaming/pagination.`,
          affectedPatterns: [pattern.pattern],
          estimatedImpact: Math.min(10, (pattern.memoryUsed - 100) / 50),
        });
      }
    }

    return issues;
  }

  /**
   * Detect system-level bottlenecks
   */
  detectSystemBottlenecks(): SystemBottleneck[] {
    const bottlenecks: SystemBottleneck[] = [];
    const metrics = this.collector.getAggregatedMetrics(60000);
    const systemMetrics = this.collector.getCurrentSystemMetrics();
    const patterns = this.collector.getAllPatternMetrics();

    const affectedPatterns = patterns
      .sort((a, b) => b.averageDuration - a.averageDuration)
      .slice(0, 3)
      .map(p => p.pattern);

    // CPU-bound
    if (systemMetrics.cpuUsagePercent > this.cpuThreshold) {
      bottlenecks.push({
        type: 'cpu-bound',
        severity: systemMetrics.cpuUsagePercent > 95 ? 'critical' : 'high',
        metric: systemMetrics.cpuUsagePercent,
        threshold: this.cpuThreshold,
        affectedPatterns,
        recommendation: `System CPU at ${systemMetrics.cpuUsagePercent.toFixed(1)}%. Reduce worker count or optimize CPU-heavy patterns. Consider reducing parallelism.`,
        estimatedImpact: Math.min(15, (systemMetrics.cpuUsagePercent - 75) / 2),
      });
    }

    // Memory-bound
    if (systemMetrics.memoryUsagePercent > this.memoryThreshold) {
      bottlenecks.push({
        type: 'memory-bound',
        severity: systemMetrics.memoryUsagePercent > 95 ? 'critical' : 'high',
        metric: systemMetrics.memoryUsagePercent,
        threshold: this.memoryThreshold,
        affectedPatterns,
        recommendation: `System memory at ${systemMetrics.memoryUsagePercent.toFixed(1)}%. Reduce worker count, clear cache, or optimize memory-heavy patterns.`,
        estimatedImpact: Math.min(15, (systemMetrics.memoryUsagePercent - 70) / 2),
      });
    }

    // Cache-bound (low hit rate with high execution count)
    const cacheEffectiveness = this.collector.getCacheEffectiveness();
    if (
      cacheEffectiveness.overallHitRate < 20 &&
      metrics.totalExecutions > 100
    ) {
      bottlenecks.push({
        type: 'cache-bound',
        severity: 'medium',
        metric: cacheEffectiveness.overallHitRate,
        threshold: 30,
        affectedPatterns,
        recommendation: `Cache hit rate only ${cacheEffectiveness.overallHitRate.toFixed(1)}%. Increase cache size, adjust TTLs, or review input variance.`,
        estimatedImpact: Math.min(20, (50 - cacheEffectiveness.overallHitRate) / 2),
      });
    }

    // I/O bound (high latency, low CPU/memory)
    if (
      metrics.averageDuration > 150 &&
      systemMetrics.cpuUsagePercent < 50 &&
      systemMetrics.memoryUsagePercent < 50
    ) {
      bottlenecks.push({
        type: 'io-bound',
        severity: 'medium',
        metric: metrics.averageDuration,
        threshold: 100,
        affectedPatterns,
        recommendation: `High latency (${metrics.averageDuration.toFixed(0)}ms) with low CPU/memory. I/O bound. Optimize I/O operations, increase concurrency, or use connection pooling.`,
        estimatedImpact: Math.min(25, (metrics.averageDuration - 100) / 20),
      });
    }

    return bottlenecks;
  }

  /**
   * Get recommendations for top bottlenecks
   */
  getTopRecommendations(count: number = 5): {
    issue: BottleneckIssue | SystemBottleneck;
    isSystemLevel: boolean;
  }[] {
    const all = this.detectionHistory
      .map(issue => ({ issue, isSystemLevel: false }))
      .concat(
        this.systemBottleneckHistory.map(issue => ({ issue, isSystemLevel: true }))
      )
      .sort((a, b) => {
        const impactA = (a.issue as any).estimatedImpact || 0;
        const impactB = (b.issue as any).estimatedImpact || 0;
        return impactB - impactA;
      });

    return all.slice(0, count);
  }

  /**
   * Get critical issues
   */
  getCriticalIssues(): Array<BottleneckIssue | SystemBottleneck> {
    const patternIssues = this.detectionHistory.filter(i => i.severity === 'critical');
    const systemIssues = this.systemBottleneckHistory.filter(i => i.severity === 'critical');
    return [...patternIssues, ...systemIssues];
  }

  /**
   * Get bottleneck history by type
   */
  getHistoryByType(type: string): Array<BottleneckIssue | SystemBottleneck> {
    const patternIssues = this.detectionHistory.filter(i => i.type === type);
    const systemIssues = this.systemBottleneckHistory.filter(i => i.type === type);
    return [...patternIssues, ...systemIssues];
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this.detectionHistory = [];
    this.systemBottleneckHistory = [];
  }

  /**
   * Update thresholds
   */
  updateThresholds(thresholds: {
    slowPatternThreshold?: number;
    errorRateThreshold?: number;
    cacheHitThreshold?: number;
    cpuThreshold?: number;
    memoryThreshold?: number;
  }): void {
    if (thresholds.slowPatternThreshold !== undefined) {
      this.slowPatternThreshold = thresholds.slowPatternThreshold;
    }
    if (thresholds.errorRateThreshold !== undefined) {
      this.errorRateThreshold = thresholds.errorRateThreshold;
    }
    if (thresholds.cacheHitThreshold !== undefined) {
      this.cacheHitThreshold = thresholds.cacheHitThreshold;
    }
    if (thresholds.cpuThreshold !== undefined) {
      this.cpuThreshold = thresholds.cpuThreshold;
    }
    if (thresholds.memoryThreshold !== undefined) {
      this.memoryThreshold = thresholds.memoryThreshold;
    }
  }

  /**
   * Private: Calculate severity level
   */
  private calculateSeverity(
    metric: number,
    lowThreshold: number,
    mediumThreshold: number,
    highThreshold: number
  ): 'low' | 'medium' | 'high' | 'critical' {
    if (metric > highThreshold) return 'critical';
    if (metric > mediumThreshold) return 'high';
    if (metric > lowThreshold) return 'medium';
    return 'low';
  }
}

/**
 * Factory function to create bottleneck detector
 */
export function createBottleneckDetector(collector: MetricsCollector): BottleneckDetector {
  return new BottleneckDetector(collector);
}
