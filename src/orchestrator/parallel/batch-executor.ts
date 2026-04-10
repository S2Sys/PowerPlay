/**
 * Batch Executor — High-level coordinator for batch requirement processing
 * Implements /pp-batch command functionality
 * Processes multiple requirements through complete workflow in parallel
 */

import { BatchRequest, Requirement, BatchResult, ExecutionContext } from './types';
import { BatchProcessor, createBatchProcessor, BATCH_PHASES } from './batch-processor';

/**
 * Batch execution statistics
 */
export interface BatchStats {
  totalRequirements: number;
  completedRequirements: number;
  failedRequirements: number;
  totalDuration: number;
  estimatedSequentialDuration: number;
  speedupFactor: number;
  startTime: number;
  endTime: number;
  phaseBreakdown: Map<string, { duration: number; successCount: number; failureCount: number }>;
}

/**
 * Batch execution executor
 */
export class BatchExecutor {
  private processor: BatchProcessor;
  private stats: Partial<BatchStats> = {};

  constructor() {
    this.processor = createBatchProcessor();
  }

  /**
   * Execute batch processing with real-time progress reporting
   */
  async executeBatch(
    requirements: Requirement[],
    context: ExecutionContext,
    options: {
      parallelPhases?: boolean; // true = run all requirements through phase in parallel
      progressCallback?: (progress: BatchProgress) => void;
      phaseCallback?: (phase: string, completed: number, total: number) => void;
      requirementCallback?: (reqId: string, phase: string, status: 'success' | 'failed') => void;
    } = {}
  ): Promise<BatchResult> {
    const startTime = Date.now();
    this.stats = {
      startTime,
      totalRequirements: requirements.length,
      completedRequirements: 0,
      failedRequirements: 0,
      phaseBreakdown: new Map(),
    };

    // Validate requirements
    if (requirements.length === 0) {
      throw new Error('No requirements provided for batch processing');
    }

    // Create batch request
    const batchRequest: BatchRequest = {
      requirements,
      parallelPhases: options.parallelPhases !== false, // Default true
      timeout: 3600, // 1 hour total timeout
      onPhaseComplete: (phase: string, results) => {
        const successCount = results.filter(r => r.status === 'success').length;
        const failureCount = results.filter(r => r.status === 'failed').length;

        // Update stats
        if (!this.stats.phaseBreakdown) {
          this.stats.phaseBreakdown = new Map();
        }
        this.stats.phaseBreakdown.set(phase, {
          duration: 0,
          successCount,
          failureCount,
        });

        // Call phase callback
        if (options.phaseCallback) {
          options.phaseCallback(phase, successCount, results.length);
        }
      },
    };

    try {
      // Execute batch
      const result = await this.processor.processBatch(batchRequest);

      // Update final stats
      const endTime = Date.now();
      this.stats = {
        ...this.stats,
        endTime,
        completedRequirements: Array.from(result.requirements.values()).filter(
          r => r.status === 'completed'
        ).length,
        failedRequirements: Array.from(result.requirements.values()).filter(
          r => r.status === 'failed'
        ).length,
        totalDuration: result.totalDuration,
        estimatedSequentialDuration: requirements.length * 6 * 5 * 60 * 1000, // 6 phases × 5 min each × N reqs
        speedupFactor: result.speedupFactor,
      };

      // Call progress callback with final stats
      if (options.progressCallback) {
        options.progressCallback({
          phase: 'complete',
          completed: this.stats.completedRequirements || 0,
          total: requirements.length,
          stats: this.stats as BatchStats,
        });
      }

      return result;
    } catch (error) {
      this.stats.endTime = Date.now();
      throw error;
    }
  }

  /**
   * Get human-readable batch report
   */
  generateReport(result: BatchResult, stats: BatchStats): string {
    const estimatedSequential = (stats.estimatedSequentialDuration / 60000).toFixed(0);
    const actualParallel = (result.totalDuration / 60000).toFixed(1);

    return `
╔════════════════════════════════════════════════════════════════╗
║           v3.9.0 BATCH REQUIREMENT PROCESSING REPORT           ║
╚════════════════════════════════════════════════════════════════╝

📋 BATCH SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Requirements: ${result.requirements.size}
  ✓ Completed: ${stats.completedRequirements}
  ✗ Failed: ${stats.failedRequirements}
  Success Rate: ${((stats.completedRequirements / result.requirements.size) * 100).toFixed(1)}%

⏱️  PERFORMANCE METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Parallel Execution: ${actualParallel} min
Sequential (estimated): ${estimatedSequential} min
Speedup Factor: ${result.speedupFactor.toFixed(1)}x faster

Time Saved: ${((Number(estimatedSequential) - Number(actualParallel)) * 60).toFixed(0)} minutes
Throughput: ${((result.requirements.size / (result.totalDuration / 1000)) * 3600).toFixed(0)} reqs/hour

🔄 PHASE BREAKDOWN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phase                 Completion   Success Rate
${Array.from(stats.phaseBreakdown || [])
  .map(
    ([phase, data]) =>
      `${phase.padEnd(20)} ${((data.successCount / (data.successCount + data.failureCount)) * 100).toFixed(0)}% (${data.successCount}/${data.successCount + data.failureCount})`
  )
  .join('\n')}

✨ RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${
  result.success
    ? '✅ BATCH PROCESSING SUCCESSFUL\n\nAll requirements processed through all 6 phases.\nGenerated: specs, test cases, risk assessment, implementation code.'
    : '⚠️  BATCH PROCESSING COMPLETED WITH ERRORS\n\nSome requirements failed. Review errors below.'
}

${
  result.errors.length > 0
    ? `\n⚠️  ERRORS (${result.errors.length})\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${result.errors.map(e => `• ${e.message}`).join('\n')}`
    : ''
}

🎯 NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Review generated specifications for each requirement
2. Validate acceptance criteria against business goals
3. Review risk assessment and mitigation strategies
4. Proceed to implementation using generated code templates
5. Monitor metrics dashboard for progress tracking

╚════════════════════════════════════════════════════════════════╝
    `;
  }

  /**
   * Get processor instance
   */
  getProcessor(): BatchProcessor {
    return this.processor;
  }

  /**
   * Get current stats
   */
  getStats(): Partial<BatchStats> {
    return { ...this.stats };
  }

  /**
   * Reset executor
   */
  reset(): void {
    this.processor.reset();
    this.stats = {};
  }
}

/**
 * Batch execution progress report
 */
export interface BatchProgress {
  phase: string;
  completed: number;
  total: number;
  stats?: BatchStats;
}

/**
 * Parse user input to extract requirements
 */
export function parseRequirementsFromInput(input: string): Requirement[] {
  // Parse requirements from various formats:
  // 1. JSON array format
  // 2. Numbered list format
  // 3. Comma-separated format

  try {
    // Try JSON array first
    const parsed = JSON.parse(input);
    if (Array.isArray(parsed)) {
      return parsed.map((r, i) => ({
        id: r.id || `REQ-${i + 1}`,
        name: r.name || `Requirement ${i + 1}`,
        description: r.description || r,
        priority: r.priority || 1,
        estimatedEffort: r.estimatedEffort,
      }));
    }
  } catch {
    // Not JSON, try other formats
  }

  // Try numbered list format (1. Req name\n2. Req name\n...)
  const numberedPattern = /^\d+\.\s+(.+)$/gm;
  const numberedMatches = Array.from(input.matchAll(numberedPattern));

  if (numberedMatches.length > 0) {
    return numberedMatches.map((match, i) => ({
      id: `REQ-${i + 1}`,
      name: match[1],
      description: match[1],
      priority: 1,
    }));
  }

  // Try comma-separated format
  const items = input.split(',').map(s => s.trim());
  if (items.length > 1) {
    return items.map((item, i) => ({
      id: `REQ-${i + 1}`,
      name: item,
      description: item,
      priority: 1,
    }));
  }

  // Fallback: treat entire input as single requirement
  return [
    {
      id: 'REQ-1',
      name: input.substring(0, 50),
      description: input,
      priority: 1,
    },
  ];
}

/**
 * Factory function to create batch executor
 */
export function createBatchExecutor(): BatchExecutor {
  return new BatchExecutor();
}
