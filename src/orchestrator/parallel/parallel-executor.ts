/**
 * Parallel Executor - Execute multiple patterns simultaneously
 * Manages concurrent execution, timeouts, and output merging
 */

import {
  ParallelExecutionRequest,
  ParallelGroup,
  PatternResult,
  MergedOutput,
  ExecutionContext,
  DependencyGraph,
  ConflictResolution,
} from './types';
import { DependencyGraphBuilder } from './dependency-graph';

/**
 * Parallel Executor - Main execution engine for parallel patterns
 */
export class ParallelExecutor {
  private dependencyGraphBuilder: DependencyGraphBuilder;
  private executedResults: Map<string, PatternResult> = new Map();

  constructor() {
    this.dependencyGraphBuilder = new DependencyGraphBuilder();
  }

  /**
   * Execute multiple patterns in parallel
   */
  async executeParallel(request: ParallelExecutionRequest): Promise<MergedOutput> {
    const startTime = Date.now();

    try {
      // 1. Build dependency graph
      const graph = this.dependencyGraphBuilder.buildGraph(request.patterns);

      // 2. Get optimal parallel groups
      const parallelGroups = this.dependencyGraphBuilder['getOptimalGroups'](graph);

      // 3. Execute groups sequentially (each group runs in parallel)
      let previousGroupResults: Map<string, PatternResult> = new Map();

      for (const group of parallelGroups) {
        const groupResults = await this.executeGroup(
          group,
          request.context,
          previousGroupResults
        );

        for (const [pattern, result] of groupResults) {
          this.executedResults.set(pattern, result);
          previousGroupResults.set(pattern, result);
        }
      }

      // 4. Merge outputs
      const mergedOutput = await this.mergeOutputs(
        this.executedResults,
        graph,
        request.patterns
      );

      // 5. Calculate metrics
      const endTime = Date.now();
      const totalDuration = endTime - startTime;
      const sequentialDuration = this.calculateSequentialDuration();
      const speedupFactor = sequentialDuration / totalDuration;

      return {
        success: true,
        results: this.executedResults,
        mergedData: mergedOutput,
        conflictResolutions: [],
        totalDuration,
        parallelDuration: totalDuration,
        speedupFactor,
        errors: [],
      };
    } catch (error) {
      return {
        success: false,
        results: this.executedResults,
        mergedData: null,
        conflictResolutions: [],
        totalDuration: Date.now() - startTime,
        parallelDuration: 0,
        speedupFactor: 1,
        errors: [error as Error],
      };
    }
  }

  /**
   * Execute a parallel group of patterns
   */
  private async executeGroup(
    group: ParallelGroup,
    context: ExecutionContext,
    previousResults: Map<string, PatternResult>
  ): Promise<Map<string, PatternResult>> {
    const results = new Map<string, PatternResult>();

    // Create promises for all patterns in group
    const promises = group.patterns.map(pattern =>
      this.executePatternWithTimeout(
        pattern,
        context,
        group.timeout,
        previousResults
      )
        .then(result => ({ pattern, result }))
        .catch(error => ({
          pattern,
          result: {
            pattern,
            status: 'failed' as const,
            error: error as Error,
            duration: 0,
            timestamp: Date.now(),
            metadata: {
              cached: false,
              retries: 0,
              workerId: 'unknown',
            },
          },
        }))
    );

    // Wait for all patterns to complete
    const allResults = await Promise.allSettled(promises);

    for (const settledResult of allResults) {
      if (settledResult.status === 'fulfilled') {
        const { pattern, result } = settledResult.value;
        results.set(pattern, result);
      }
    }

    return results;
  }

  /**
   * Execute single pattern with timeout
   */
  private async executePatternWithTimeout(
    pattern: string,
    context: ExecutionContext,
    timeout: number,
    previousResults: Map<string, PatternResult>
  ): Promise<PatternResult> {
    const startTime = Date.now();

    try {
      // Mock pattern execution - in real implementation, route to actual pattern handler
      const output = await this.mockExecutePattern(pattern, context, previousResults);

      const duration = Date.now() - startTime;

      return {
        pattern,
        status: 'success',
        output,
        duration,
        timestamp: Date.now(),
        metadata: {
          cached: false,
          retries: 0,
          workerId: `worker-${Math.floor(Math.random() * 4)}`,
        },
      };
    } catch (error) {
      const duration = Date.now() - startTime;

      if (duration > timeout) {
        return {
          pattern,
          status: 'timeout',
          error: new Error(`Pattern execution timed out after ${timeout}ms`),
          duration,
          timestamp: Date.now(),
          metadata: {
            cached: false,
            retries: 0,
            workerId: 'unknown',
          },
        };
      }

      return {
        pattern,
        status: 'failed',
        error: error as Error,
        duration,
        timestamp: Date.now(),
        metadata: {
          cached: false,
          retries: 0,
          workerId: 'unknown',
        },
      };
    }
  }

  /**
   * Mock pattern execution - replace with actual pattern routing
   */
  private async mockExecutePattern(
    pattern: string,
    context: ExecutionContext,
    _previousResults: Map<string, PatternResult>
  ): Promise<any> {
    // Simulate pattern execution time
    const simulatedDuration = Math.floor(Math.random() * 2000) + 1000; // 1-3 seconds
    await this.sleep(simulatedDuration);

    // Return mock output based on pattern type
    return {
      pattern,
      timestamp: Date.now(),
      context: {
        phase: context.phase,
        projectId: context.projectId,
      },
      output: `Generated output for ${pattern}`,
      generatedFiles: [`${pattern.replace('/', '')}_output.ts`],
      codeLines: 250 + Math.floor(Math.random() * 500),
      executionTime: simulatedDuration,
    };
  }

  /**
   * Merge outputs from multiple patterns
   */
  private async mergeOutputs(
    results: Map<string, PatternResult>,
    _graph: DependencyGraph,
    _patterns: string[]
  ): Promise<any> {
    const merged: any = {
      patterns: {},
      summary: {
        totalPatterns: results.size,
        successfulPatterns: 0,
        failedPatterns: 0,
      },
      generatedFiles: [],
      totalCodeLines: 0,
    };

    // Aggregate results
    for (const [pattern, result] of results) {
      merged.patterns[pattern] = {
        status: result.status,
        duration: result.duration,
        output: result.output,
      };

      if (result.status === 'success') {
        merged.summary.successfulPatterns++;
        if (result.output?.generatedFiles) {
          merged.generatedFiles.push(...result.output.generatedFiles);
        }
        if (result.output?.codeLines) {
          merged.totalCodeLines += result.output.codeLines;
        }
      } else {
        merged.summary.failedPatterns++;
      }
    }

    return merged;
  }

  /**
   * Calculate what sequential execution would take
   */
  private calculateSequentialDuration(): number {
    let total = 0;
    for (const [, result] of this.executedResults) {
      total += result.duration;
    }
    return Math.max(total, 1); // Avoid division by zero
  }

  /**
   * Resolve conflicts between pattern outputs
   */
  private resolveConflicts(
    output1: any,
    output2: any,
    strategy: 'merge' | 'priority'
  ): { merged: any; resolutions: ConflictResolution[] } {
    const resolutions: ConflictResolution[] = [];
    const merged = { ...output1 };

    if (strategy === 'merge') {
      // Deep merge outputs
      for (const [key, value] of Object.entries(output2)) {
        if (key in merged && typeof value === 'object' && typeof merged[key] === 'object') {
          // Recursively merge objects
          const subMerge = this.resolveConflicts(merged[key], value, 'merge');
          merged[key] = subMerge.merged;
          resolutions.push(...subMerge.resolutions);
        } else if (key in merged && merged[key] !== value) {
          // Record conflict
          resolutions.push({
            pattern1: 'unknown',
            pattern2: 'unknown',
            field: key,
            conflict: `${merged[key]} vs ${value}`,
            resolution: `kept first value: ${merged[key]}`,
            strategy: 'merge',
          });
        } else {
          merged[key] = value;
        }
      }
    } else if (strategy === 'priority') {
      // Priority merge - second output takes precedence
      for (const [key, value] of Object.entries(output2)) {
        merged[key] = value;
      }
    }

    return { merged, resolutions };
  }

  /**
   * Utility sleep function
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Reset executor state
   */
  reset(): void {
    this.executedResults.clear();
  }
}

/**
 * Factory function for creating parallel executor
 */
export function createParallelExecutor(): ParallelExecutor {
  return new ParallelExecutor();
}
