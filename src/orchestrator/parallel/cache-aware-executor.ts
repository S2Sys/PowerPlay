/**
 * Cache-Aware Executor — Transparent caching layer for parallel executor
 * Automatically caches and serves results from cache
 */

import { ParallelExecutor } from './parallel-executor';
import { CacheStore } from './cache-store';
import { CacheKeyBuilder } from './cache-key-builder';
import { CacheInvalidationManager } from './cache-invalidation';
import { ExecutionContext, PatternResult, ParallelExecutionRequest, MergedOutput } from './types';

/**
 * Cache metrics for a specific execution
 */
export interface ExecutionCacheMetrics {
  patternsCached: number;
  patternsExecuted: number;
  cacheHits: number;
  cacheMisses: number;
  timeSavedMs: number;
  overheadMs: number;
  hitRate: number;
}

/**
 * Cache-aware executor wrapping parallel executor
 */
export class CacheAwareExecutor {
  private executor: ParallelExecutor;
  private cache: CacheStore;
  private keyBuilder: CacheKeyBuilder;
  private invalidationManager: CacheInvalidationManager;
  private cachingEnabled: boolean;
  private executionMetrics: ExecutionCacheMetrics = {
    patternsCached: 0,
    patternsExecuted: 0,
    cacheHits: 0,
    cacheMisses: 0,
    timeSavedMs: 0,
    overheadMs: 0,
    hitRate: 0,
  };

  constructor(
    executor: ParallelExecutor,
    cache: CacheStore,
    invalidationManager: CacheInvalidationManager,
    cachingEnabled: boolean = true
  ) {
    this.executor = executor;
    this.cache = cache;
    this.keyBuilder = new CacheKeyBuilder();
    this.invalidationManager = invalidationManager;
    this.cachingEnabled = cachingEnabled;
  }

  /**
   * Execute pattern with automatic caching
   */
  async executePatternCached(
    pattern: string,
    input: any,
    context: ExecutionContext,
    ttl: number = 3600
  ): Promise<PatternResult> {
    if (!this.cachingEnabled) {
      return this.executePatternDirect(pattern, input, context);
    }

    // Generate cache key
    const key = this.keyBuilder.buildKey(pattern, input, context);

    // Check cache
    const startTime = Date.now();
    const cached = await this.cache.get<PatternResult>(key);

    if (cached) {
      this.executionMetrics.cacheHits++;
      const timeSaved = Math.max(1, cached.duration);
      this.executionMetrics.timeSavedMs += timeSaved;

      return {
        ...cached,
        metadata: {
          ...cached.metadata,
          cached: true,
        },
      };
    }

    // Cache miss: execute pattern
    this.executionMetrics.cacheMisses++;
    const result = await this.executePatternDirect(pattern, input, context);

    // Cache result
    const cacheOverhead = Date.now() - startTime;
    this.executionMetrics.overheadMs += cacheOverhead;

    // Only cache successful results
    if (result.status === 'success') {
      await this.cache.set(key, result, ttl);
      this.executionMetrics.patternsCached++;
    }

    return result;
  }

  /**
   * Execute requirement phase with caching
   */
  async executePhaseWithCache(
    requirementId: string,
    phase: string,
    patterns: string[],
    context: ExecutionContext,
    ttl: number = 3600
  ): Promise<PatternResult[]> {
    const results: PatternResult[] = [];

    // Try to get cached phase results first
    const phaseKey = `phase:${phase}:${requirementId}`;
    const cachedPhaseResults = await this.cache.get<PatternResult[]>(phaseKey);

    if (cachedPhaseResults && this.cachingEnabled) {
      return cachedPhaseResults;
    }

    // Execute each pattern in the phase
    for (const pattern of patterns) {
      const result = await this.executePatternCached(pattern, { requirementId, phase }, context, ttl);
      results.push(result);
    }

    // Cache phase results
    if (this.cachingEnabled && results.every(r => r.status === 'success')) {
      await this.cache.setPhaseResults(requirementId, phase, results, ttl);
    }

    return results;
  }

  /**
   * Execute batch with caching across phases
   */
  async executeBatchWithCache(
    request: ParallelExecutionRequest,
    phases: string[],
    ttl: number = 3600
  ): Promise<MergedOutput> {
    if (!this.cachingEnabled) {
      return this.executor.executeParallel(request);
    }

    const startTime = Date.now();
    const results = await this.executor.executeParallel(request);
    const duration = Date.now() - startTime;

    // Calculate hit rate
    const totalPatterns = this.executionMetrics.cacheHits + this.executionMetrics.cacheMisses;
    this.executionMetrics.hitRate = totalPatterns > 0 ? (this.executionMetrics.cacheHits / totalPatterns) * 100 : 0;

    return results;
  }

  /**
   * Direct pattern execution without caching
   */
  private async executePatternDirect(
    pattern: string,
    input: any,
    context: ExecutionContext
  ): Promise<PatternResult> {
    this.executionMetrics.patternsExecuted++;

    // Create a minimal request for the executor
    const request: ParallelExecutionRequest = {
      patterns: [pattern],
      context,
      timeout: context.metadata?.get('timeout') || 600,
    };

    const startTime = Date.now();

    try {
      // Mock execution for now (real implementation would route to actual pattern handlers)
      const output = {
        pattern,
        timestamp: Date.now(),
        output: `Generated output for ${pattern}`,
      };

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
          workerId: `executor-${Math.floor(Math.random() * 4)}`,
        },
      };
    } catch (error) {
      const duration = Date.now() - startTime;

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
   * Invalidate cache by requirement
   */
  async invalidateRequirement(requirementId: string): Promise<void> {
    await this.invalidationManager.invalidateRequirement(requirementId);
  }

  /**
   * Invalidate cache by pattern
   */
  async invalidatePattern(pattern: string): Promise<void> {
    await this.invalidationManager.invalidatePattern(pattern);
  }

  /**
   * Invalidate cache by phase
   */
  async invalidatePhase(phase: string): Promise<void> {
    await this.invalidationManager.invalidatePhase(phase);
  }

  /**
   * Invalidate entire cache
   */
  async invalidateAll(): Promise<void> {
    await this.cache.clear();
  }

  /**
   * Get execution metrics
   */
  getMetrics(): ExecutionCacheMetrics {
    return { ...this.executionMetrics };
  }

  /**
   * Get cache metrics
   */
  getCacheMetrics() {
    return this.cache.getMetrics();
  }

  /**
   * Get cache metrics for specific pattern
   */
  getPatternCacheMetrics(pattern: string) {
    return this.cache.getPatternMetrics(pattern);
  }

  /**
   * Get invalidation statistics
   */
  getInvalidationStats() {
    return this.invalidationManager.getStats();
  }

  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.executionMetrics = {
      patternsCached: 0,
      patternsExecuted: 0,
      cacheHits: 0,
      cacheMisses: 0,
      timeSavedMs: 0,
      overheadMs: 0,
      hitRate: 0,
    };
    this.cache.resetMetrics();
  }

  /**
   * Enable/disable caching
   */
  setCachingEnabled(enabled: boolean): void {
    this.cachingEnabled = enabled;
  }

  /**
   * Get caching status
   */
  isCachingEnabled(): boolean {
    return this.cachingEnabled;
  }

  /**
   * Generate cache performance report
   */
  generateReport(): string {
    const cacheMetrics = this.cache.getMetrics();
    const invalidationStats = this.invalidationManager.getStats();

    return `
╔════════════════════════════════════════════════════════════════╗
║              CACHE PERFORMANCE REPORT                          ║
╚════════════════════════════════════════════════════════════════╝

Cache Statistics:
  Total Entries: ${cacheMetrics.totalEntries}
  Cache Hits: ${cacheMetrics.cacheHits}
  Cache Misses: ${cacheMetrics.cacheMisses}
  Hit Rate: ${cacheMetrics.hitRate.toFixed(1)}%

Execution Metrics:
  Patterns Executed: ${this.executionMetrics.patternsExecuted}
  Patterns Cached: ${this.executionMetrics.patternsCached}
  Cache Hit Count: ${this.executionMetrics.cacheHits}
  Cache Miss Count: ${this.executionMetrics.cacheMisses}
  Execution Hit Rate: ${this.executionMetrics.hitRate.toFixed(1)}%

Performance:
  Time Saved (hits): ${this.executionMetrics.timeSavedMs}ms
  Cache Overhead: ${this.executionMetrics.overheadMs}ms
  Net Benefit: ${(this.executionMetrics.timeSavedMs - this.executionMetrics.overheadMs)}ms

Memory Usage:
  Total Memory: ${(cacheMetrics.totalMemoryBytes / 1024).toFixed(2)} KB
  Avg Per Entry: ${(cacheMetrics.totalMemoryBytes / Math.max(1, cacheMetrics.totalEntries)).toFixed(2)} bytes

Eviction Stats:
  Total Evictions: ${cacheMetrics.evictionCount}
  Avg Accesses Per Entry: ${cacheMetrics.averageAccessCount.toFixed(2)}

Invalidation History:
  Total Invalidations: ${invalidationStats.totalInvalidations}
  Recent Rate: ${invalidationStats.invalidationRate}/min
  Last Event: ${invalidationStats.lastInvalidation ? invalidationStats.lastInvalidation.type : 'Never'}

Status: ${this.cachingEnabled ? 'ENABLED ✓' : 'DISABLED ✗'}
    `;
  }
}

/**
 * Factory function to create cache-aware executor
 */
export function createCacheAwareExecutor(
  executor: ParallelExecutor,
  cache: CacheStore,
  invalidationManager: CacheInvalidationManager,
  cachingEnabled: boolean = true
): CacheAwareExecutor {
  return new CacheAwareExecutor(executor, cache, invalidationManager, cachingEnabled);
}
