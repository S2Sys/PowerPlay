/**
 * Auto-Tuning Engine — Automatic worker pool optimization based on metrics
 * Adjusts worker count to maximize throughput while minimizing resource usage
 */

import { MetricsCollector, AggregatedMetrics } from './metrics-collector';
import { ParallelExecutor } from '../parallel/parallel-executor';

/**
 * Tuning decision with rationale
 */
export interface TuningDecision {
  currentWorkers: number;
  recommendedWorkers: number;
  reasoning: string;
  expectedImprovement: number; // percentage
  cpuUtilization: number;
  memoryUtilization: number;
  queueDepth: number;
  bottleneckType: string;
}

/**
 * Tuning configuration
 */
export interface TuningConfig {
  minWorkers: number;
  maxWorkers: number;
  targetCpuUtilization: number; // 0-100
  targetMemoryUtilization: number; // 0-100
  cpuThresholdHigh: number;
  cpuThresholdLow: number;
  metricsWindow: number; // milliseconds
  evaluationInterval: number; // milliseconds
  autoApply: boolean; // whether to auto-apply recommendations
}

/**
 * Auto-tuning engine for worker pool optimization
 */
export class AutoTuningEngine {
  private executor: ParallelExecutor;
  private collector: MetricsCollector;
  private config: TuningConfig;
  private currentWorkers: number;
  private tuningHistory: TuningDecision[] = [];
  private lastTuningTime: number = Date.now();
  private tuningInterval: NodeJS.Timer | null = null;

  constructor(
    executor: ParallelExecutor,
    collector: MetricsCollector,
    config: Partial<TuningConfig> = {}
  ) {
    this.executor = executor;
    this.collector = collector;
    this.currentWorkers = executor.getWorkerCount();

    this.config = {
      minWorkers: 2,
      maxWorkers: 8,
      targetCpuUtilization: 75,
      targetMemoryUtilization: 70,
      cpuThresholdHigh: 85,
      cpuThresholdLow: 60,
      metricsWindow: 60000, // 1 minute
      evaluationInterval: 30000, // 30 seconds
      autoApply: false,
      ...config,
    };
  }

  /**
   * Evaluate and return tuning recommendation
   */
  evaluateTuning(): TuningDecision {
    const metrics = this.collector.getAggregatedMetrics(this.config.metricsWindow);
    const systemMetrics = this.collector.getCurrentSystemMetrics();

    const decision: TuningDecision = {
      currentWorkers: this.currentWorkers,
      recommendedWorkers: this.currentWorkers,
      reasoning: 'Optimal',
      expectedImprovement: 0,
      cpuUtilization: systemMetrics.cpuUsagePercent,
      memoryUtilization: systemMetrics.memoryUsagePercent,
      queueDepth: metrics.totalExecutions - metrics.successfulExecutions,
      bottleneckType: 'none',
    };

    // Analyze bottleneck type
    const bottleneckType = this.detectBottleneck(metrics, systemMetrics);
    decision.bottleneckType = bottleneckType;

    // CPU-bound bottleneck: reduce workers
    if (bottleneckType === 'cpu-bound' && systemMetrics.cpuUsagePercent > this.config.cpuThresholdHigh) {
      if (this.currentWorkers > this.config.minWorkers) {
        decision.recommendedWorkers = Math.max(
          this.config.minWorkers,
          this.currentWorkers - 1
        );
        decision.reasoning = `CPU overutilization (${systemMetrics.cpuUsagePercent.toFixed(1)}%). Reduce workers to decrease context switching.`;
        decision.expectedImprovement = 5; // Approximate improvement
      }
    }

    // Memory-bound bottleneck: reduce workers
    if (bottleneckType === 'memory-bound' && systemMetrics.memoryUsagePercent > this.config.targetMemoryUtilization) {
      if (this.currentWorkers > this.config.minWorkers) {
        decision.recommendedWorkers = Math.max(
          this.config.minWorkers,
          this.currentWorkers - 1
        );
        decision.reasoning = `Memory overutilization (${systemMetrics.memoryUsagePercent.toFixed(1)}%). Reduce workers to decrease memory pressure.`;
        decision.expectedImprovement = 3; // Approximate improvement
      }
    }

    // Queue bottleneck: increase workers
    if (bottleneckType === 'queue-bound' && decision.queueDepth > metrics.totalExecutions / 4) {
      if (
        this.currentWorkers < this.config.maxWorkers &&
        systemMetrics.cpuUsagePercent < this.config.cpuThresholdLow
      ) {
        decision.recommendedWorkers = Math.min(
          this.config.maxWorkers,
          this.currentWorkers + 1
        );
        decision.reasoning = `Queue backlog detected (${decision.queueDepth} pending). Increase workers to improve throughput.`;
        decision.expectedImprovement = 8; // Approximate improvement
      }
    }

    // Low utilization: increase workers
    if (
      systemMetrics.cpuUsagePercent < this.config.targetCpuUtilization * 0.5 &&
      systemMetrics.memoryUsagePercent < this.config.targetMemoryUtilization * 0.5
    ) {
      if (this.currentWorkers < this.config.maxWorkers) {
        decision.recommendedWorkers = Math.min(
          this.config.maxWorkers,
          this.currentWorkers + 1
        );
        decision.reasoning = `Resources underutilized. Increase workers to improve throughput.`;
        decision.expectedImprovement = 6; // Approximate improvement
      }
    }

    this.tuningHistory.push(decision);

    // Apply if auto-tuning is enabled
    if (this.config.autoApply && decision.recommendedWorkers !== this.currentWorkers) {
      this.applyTuning(decision.recommendedWorkers);
    }

    return decision;
  }

  /**
   * Manually apply tuning recommendation
   */
  applyTuning(workerCount: number): boolean {
    if (workerCount < this.config.minWorkers || workerCount > this.config.maxWorkers) {
      return false;
    }

    try {
      this.executor.setWorkerCount(workerCount);
      this.currentWorkers = workerCount;
      this.lastTuningTime = Date.now();
      return true;
    } catch (error) {
      console.error('Failed to apply tuning:', error);
      return false;
    }
  }

  /**
   * Start automatic tuning
   */
  startAutoTuning(): void {
    if (this.tuningInterval) {
      return; // Already running
    }

    this.tuningInterval = setInterval(() => {
      this.evaluateTuning();
    }, this.config.evaluationInterval);
  }

  /**
   * Stop automatic tuning
   */
  stopAutoTuning(): void {
    if (this.tuningInterval) {
      clearInterval(this.tuningInterval);
      this.tuningInterval = null;
    }
  }

  /**
   * Get tuning recommendations (last N decisions)
   */
  getTuningHistory(count: number = 10): TuningDecision[] {
    return this.tuningHistory.slice(-count);
  }

  /**
   * Get statistics on tuning performance
   */
  getTuningStats(): {
    totalEvaluations: number;
    tuningApplied: number;
    averageWorkers: number;
    workerChanges: number;
  } {
    const workerChanges = this.tuningHistory.filter(
      (d, i) => i === 0 || d.currentWorkers !== this.tuningHistory[i - 1].currentWorkers
    ).length;

    const totalWorkers = this.tuningHistory.reduce((sum, d) => sum + d.currentWorkers, 0);

    return {
      totalEvaluations: this.tuningHistory.length,
      tuningApplied: workerChanges,
      averageWorkers: totalWorkers / Math.max(1, this.tuningHistory.length),
      workerChanges,
    };
  }

  /**
   * Get current configuration
   */
  getConfig(): TuningConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<TuningConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Clear tuning history
   */
  clearHistory(): void {
    this.tuningHistory = [];
  }

  /**
   * Get last tuning decision
   */
  getLastDecision(): TuningDecision | null {
    return this.tuningHistory[this.tuningHistory.length - 1] || null;
  }

  /**
   * Private: Detect bottleneck type
   */
  private detectBottleneck(metrics: AggregatedMetrics, systemMetrics: any): string {
    const cpuUtilization = systemMetrics.cpuUsagePercent;
    const memoryUtilization = systemMetrics.memoryUsagePercent;
    const queueDepth = metrics.totalExecutions - metrics.successfulExecutions;
    const latency = metrics.averageDuration;

    // High CPU with high latency = CPU-bound
    if (cpuUtilization > this.config.targetCpuUtilization && latency > 100) {
      return 'cpu-bound';
    }

    // High memory with high latency = Memory-bound
    if (memoryUtilization > this.config.targetMemoryUtilization && latency > 100) {
      return 'memory-bound';
    }

    // Low CPU, high queue = Queue/I/O bound
    if (cpuUtilization < this.config.targetCpuUtilization && queueDepth > 0) {
      return 'queue-bound';
    }

    // High latency with low CPU/memory = I/O bound
    if (latency > 150 && cpuUtilization < 70 && memoryUtilization < 70) {
      return 'io-bound';
    }

    return 'balanced';
  }
}

/**
 * Factory function to create auto-tuning engine
 */
export function createAutoTuningEngine(
  executor: ParallelExecutor,
  collector: MetricsCollector,
  config?: Partial<TuningConfig>
): AutoTuningEngine {
  return new AutoTuningEngine(executor, collector, config);
}
