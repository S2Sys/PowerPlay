/**
 * Monitoring Dashboard — Real-time performance dashboard with multiple output formats
 * Supports CLI, JSON, and Prometheus export
 */

import { MetricsCollector, AggregatedMetrics, PatternMetrics, SystemMetrics } from './metrics-collector';

export type DashboardFormat = 'cli' | 'json' | 'prometheus';

/**
 * Monitoring dashboard for real-time metrics visualization
 */
export class MonitoringDashboard {
  private collector: MetricsCollector;
  private lastReportTime: number = Date.now();

  constructor(collector: MetricsCollector) {
    this.collector = collector;
  }

  /**
   * Generate dashboard report in specified format
   */
  generateReport(format: DashboardFormat = 'cli'): string {
    switch (format) {
      case 'json':
        return this.generateJsonReport();
      case 'prometheus':
        return this.generatePrometheusReport();
      case 'cli':
      default:
        return this.generateCliReport();
    }
  }

  /**
   * Generate CLI formatted report (human-readable)
   */
  private generateCliReport(): string {
    const metrics = this.collector.getAggregatedMetrics(60000);
    const systemMetrics = this.collector.getCurrentSystemMetrics();
    const patterns = this.collector.getAllPatternMetrics();
    const cacheStats = this.collector.getCacheEffectiveness();
    const bottlenecks = this.collector.getBottleneckPatterns(5);

    let report = '';

    // Header
    report += this.renderHeader();

    // Performance Summary
    report += this.renderPerformanceSummary(metrics);

    // System Resources
    report += this.renderSystemResources(systemMetrics);

    // Cache Statistics
    report += this.renderCacheStatistics(cacheStats);

    // Top Patterns (by execution count)
    if (patterns.length > 0) {
      report += this.renderTopPatterns(patterns.slice(0, 10));
    }

    // Bottleneck Analysis
    if (bottlenecks.length > 0) {
      report += this.renderBottlenecks(bottlenecks);
    }

    // Improvement over baseline
    const improvement = this.collector.getImprovement();
    if (improvement) {
      report += this.renderImprovement(improvement);
    }

    // Footer
    report += this.renderFooter();

    return report;
  }

  /**
   * Generate JSON report
   */
  private generateJsonReport(): string {
    const metrics = this.collector.getAggregatedMetrics(60000);
    const systemMetrics = this.collector.getCurrentSystemMetrics();
    const patterns = this.collector.getAllPatternMetrics();
    const cacheStats = this.collector.getCacheEffectiveness();
    const bottlenecks = this.collector.getBottleneckPatterns(5);
    const improvement = this.collector.getImprovement();

    const report = {
      timestamp: Date.now(),
      metrics,
      systemMetrics,
      patterns: {
        all: patterns,
        bottlenecks,
        topByCount: patterns
          .sort((a, b) => b.executions - a.executions)
          .slice(0, 10),
      },
      cache: {
        overallHitRate: cacheStats.overallHitRate,
        topCachedPatterns: cacheStats.topCachedPatterns,
      },
      improvement,
    };

    return JSON.stringify(report, null, 2);
  }

  /**
   * Generate Prometheus metrics report
   */
  private generatePrometheusReport(): string {
    const metrics = this.collector.getAggregatedMetrics(60000);
    const systemMetrics = this.collector.getCurrentSystemMetrics();
    const patterns = this.collector.getAllPatternMetrics();
    const cacheStats = this.collector.getCacheEffectiveness();

    let report = '';

    // Help and type declarations
    report += '# HELP powerplay_executions_total Total number of pattern executions\n';
    report += '# TYPE powerplay_executions_total counter\n';
    report += `powerplay_executions_total{status="total"} ${metrics.totalExecutions}\n`;
    report += `powerplay_executions_total{status="success"} ${metrics.successfulExecutions}\n`;
    report += `powerplay_executions_total{status="failed"} ${metrics.failedExecutions}\n`;
    report += `powerplay_executions_total{status="cached"} ${metrics.cachedExecutions}\n\n`;

    // Latency metrics
    report += '# HELP powerplay_duration_ms Pattern execution duration in milliseconds\n';
    report += '# TYPE powerplay_duration_ms gauge\n';
    report += `powerplay_duration_ms{quantile="avg"} ${metrics.averageDuration.toFixed(2)}\n`;
    report += `powerplay_duration_ms{quantile="p50"} ${metrics.p50Duration.toFixed(2)}\n`;
    report += `powerplay_duration_ms{quantile="p95"} ${metrics.p95Duration.toFixed(2)}\n`;
    report += `powerplay_duration_ms{quantile="p99"} ${metrics.p99Duration.toFixed(2)}\n`;
    report += `powerplay_duration_ms{quantile="min"} ${metrics.minDuration.toFixed(2)}\n`;
    report += `powerplay_duration_ms{quantile="max"} ${metrics.maxDuration.toFixed(2)}\n\n`;

    // Throughput metrics
    report += '# HELP powerplay_throughput_eps Pattern execution throughput (executions per second)\n';
    report += '# TYPE powerplay_throughput_eps gauge\n';
    report += `powerplay_throughput_eps ${metrics.throughput.toFixed(2)}\n\n`;

    // Error and cache rate
    report += '# HELP powerplay_error_rate_percent Error rate percentage\n';
    report += '# TYPE powerplay_error_rate_percent gauge\n';
    report += `powerplay_error_rate_percent ${metrics.errorRate.toFixed(2)}\n\n`;

    report += '# HELP powerplay_cache_hit_rate_percent Cache hit rate percentage\n';
    report += '# TYPE powerplay_cache_hit_rate_percent gauge\n';
    report += `powerplay_cache_hit_rate_percent ${metrics.cacheHitRate.toFixed(2)}\n\n`;

    // Memory metrics
    report += '# HELP powerplay_memory_mb Memory usage in megabytes\n';
    report += '# TYPE powerplay_memory_mb gauge\n';
    report += `powerplay_memory_mb{type="avg"} ${metrics.averageMemory.toFixed(2)}\n`;
    report += `powerplay_memory_mb{type="peak"} ${metrics.peakMemory.toFixed(2)}\n\n`;

    report += '# HELP system_memory_mb System memory in megabytes\n';
    report += '# TYPE system_memory_mb gauge\n';
    report += `system_memory_mb{type="used"} ${systemMetrics.memoryUsageMB.toFixed(2)}\n`;
    report += `system_memory_mb{type="free"} ${systemMetrics.freeMemoryMB.toFixed(2)}\n\n`;

    // CPU metrics
    report += '# HELP powerplay_cpu_percent CPU usage percentage\n';
    report += '# TYPE powerplay_cpu_percent gauge\n';
    report += `powerplay_cpu_percent{type="avg"} ${metrics.averageCPU.toFixed(2)}\n`;
    report += `powerplay_cpu_percent{type="peak"} ${metrics.peakCPU.toFixed(2)}\n\n`;

    report += '# HELP system_cpu_percent System CPU usage percentage\n';
    report += '# TYPE system_cpu_percent gauge\n';
    report += `system_cpu_percent ${systemMetrics.cpuUsagePercent.toFixed(2)}\n\n`;

    // Per-pattern metrics
    report += '# HELP powerplay_pattern_duration_ms Per-pattern execution duration\n';
    report += '# TYPE powerplay_pattern_duration_ms gauge\n';
    for (const pattern of patterns) {
      report += `powerplay_pattern_duration_ms{pattern="${pattern.pattern}"} ${pattern.averageDuration.toFixed(2)}\n`;
    }
    report += '\n';

    // Per-pattern execution count
    report += '# HELP powerplay_pattern_executions_total Per-pattern execution count\n';
    report += '# TYPE powerplay_pattern_executions_total counter\n';
    for (const pattern of patterns) {
      report += `powerplay_pattern_executions_total{pattern="${pattern.pattern}"} ${pattern.executions}\n`;
    }

    return report;
  }

  /**
   * Private: Render CLI header
   */
  private renderHeader(): string {
    return `
╔═══════════════════════════════════════════════════════════════════════════╗
║                    POWERPLAY MONITORING DASHBOARD                         ║
║                          Real-Time Performance Metrics                     ║
╚═══════════════════════════════════════════════════════════════════════════╝
`;
  }

  /**
   * Private: Render performance summary
   */
  private renderPerformanceSummary(metrics: AggregatedMetrics): string {
    const timestamp = new Date(metrics.timestamp).toLocaleString();

    return `
┌─ PERFORMANCE SUMMARY (Last 60 seconds) ─────────────────────────────────┐
│ Timestamp:           ${timestamp}
│ Total Executions:    ${metrics.totalExecutions}
│ Successful:          ${metrics.successfulExecutions} (${((metrics.successfulExecutions / metrics.totalExecutions) * 100).toFixed(1)}%)
│ Failed:              ${metrics.failedExecutions} (${metrics.errorRate.toFixed(1)}%)
│ Cached:              ${metrics.cachedExecutions} (${metrics.cacheHitRate.toFixed(1)}% hit rate)
│
│ Latency (ms):
│   Average:           ${metrics.averageDuration.toFixed(2)}ms
│   P50 (Median):      ${metrics.p50Duration.toFixed(2)}ms
│   P95:               ${metrics.p95Duration.toFixed(2)}ms
│   P99:               ${metrics.p99Duration.toFixed(2)}ms
│   Min/Max:           ${metrics.minDuration.toFixed(2)}ms / ${metrics.maxDuration.toFixed(2)}ms
│
│ Throughput:          ${metrics.throughput.toFixed(2)} exec/sec
└────────────────────────────────────────────────────────────────────────────┘
`;
  }

  /**
   * Private: Render system resources
   */
  private renderSystemResources(systemMetrics: SystemMetrics): string {
    return `
┌─ SYSTEM RESOURCES ──────────────────────────────────────────────────────┐
│ CPU Usage:           ${systemMetrics.cpuUsagePercent.toFixed(1)}%
│ Memory Usage:        ${systemMetrics.memoryUsageMB.toFixed(2)} MB (${systemMetrics.memoryUsagePercent.toFixed(1)}%)
│ Free Memory:         ${systemMetrics.freeMemoryMB.toFixed(2)} MB
│ Load Average:        ${systemMetrics.loadAverage.map(x => x.toFixed(2)).join(' / ')}
└────────────────────────────────────────────────────────────────────────────┘
`;
  }

  /**
   * Private: Render cache statistics
   */
  private renderCacheStatistics(cacheStats: any): string {
    let report = `
┌─ CACHE EFFECTIVENESS ───────────────────────────────────────────────────┐
│ Overall Hit Rate:    ${cacheStats.overallHitRate.toFixed(1)}%
│
│ Top Cached Patterns:
`;

    cacheStats.topCachedPatterns.slice(0, 5).forEach((pattern: PatternMetrics, index: number) => {
      report += `│   ${index + 1}. ${pattern.pattern.padEnd(30)} ${pattern.cacheHitRate.toFixed(1)}%\n`;
    });

    report += `└────────────────────────────────────────────────────────────────────────────┘
`;
    return report;
  }

  /**
   * Private: Render top patterns
   */
  private renderTopPatterns(patterns: PatternMetrics[]): string {
    let report = `
┌─ TOP PATTERNS (By Execution Count) ──────────────────────────────────────┐
│ Rank │ Pattern                     │ Executions │ Avg (ms) │ P95 (ms) │ Cache% │
├──────┼─────────────────────────────┼────────────┼──────────┼──────────┼────────┤
`;

    patterns.forEach((pattern, index) => {
      const name = pattern.pattern.substring(0, 27).padEnd(27);
      const execs = String(pattern.executions).padStart(10);
      const avg = pattern.averageDuration.toFixed(1).padStart(8);
      const p95 = pattern.p95Duration.toFixed(1).padStart(8);
      const cache = pattern.cacheHitRate.toFixed(1).padStart(6);

      report += `│ ${String(index + 1).padEnd(4)} │ ${name} │${execs} │${avg} │${p95} │${cache}% │\n`;
    });

    report += `└──────┴─────────────────────────────┴────────────┴──────────┴──────────┴────────┘
`;
    return report;
  }

  /**
   * Private: Render bottlenecks
   */
  private renderBottlenecks(bottlenecks: PatternMetrics[]): string {
    let report = `
┌─ PERFORMANCE BOTTLENECKS (Slowest Patterns) ────────────────────────────┐
│ Rank │ Pattern                     │ P95 (ms) │ Avg (ms) │ Success% │
├──────┼─────────────────────────────┼──────────┼──────────┼──────────┤
`;

    bottlenecks.forEach((pattern, index) => {
      const name = pattern.pattern.substring(0, 27).padEnd(27);
      const p95 = pattern.p95Duration.toFixed(1).padStart(8);
      const avg = pattern.averageDuration.toFixed(1).padStart(8);
      const success = pattern.successRate.toFixed(1).padStart(8);

      report += `│ ${String(index + 1).padEnd(4)} │ ${name} │${p95} │${avg} │${success}% │\n`;
    });

    report += `└──────┴─────────────────────────────┴──────────┴──────────┴──────────┘
`;
    return report;
  }

  /**
   * Private: Render improvement
   */
  private renderImprovement(improvement: any): string {
    return `
┌─ IMPROVEMENT OVER BASELINE ─────────────────────────────────────────────┐
│ Latency:             ${improvement.latencyImprovement.toFixed(1)}%${improvement.latencyImprovement >= 0 ? ' ↓' : ' ↑'} (faster)
│ Throughput:          ${improvement.throughputImprovement.toFixed(1)}%${improvement.throughputImprovement >= 0 ? ' ↑' : ' ↓'} (higher)
│ Error Rate:          ${improvement.errorRateImprovement.toFixed(1)}%${improvement.errorRateImprovement >= 0 ? ' ↓' : ' ↑'} (lower)
└────────────────────────────────────────────────────────────────────────────┘
`;
  }

  /**
   * Private: Render footer
   */
  private renderFooter(): string {
    const now = new Date().toLocaleTimeString();
    return `
Generated at ${now}
`;
  }
}

/**
 * Factory function to create monitoring dashboard
 */
export function createMonitoringDashboard(collector: MetricsCollector): MonitoringDashboard {
  return new MonitoringDashboard(collector);
}
