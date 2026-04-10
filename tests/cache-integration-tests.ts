/**
 * Cache Integration Tests — Integration between cache system, batch processor, and parallel executor
 */

import { CacheAwareExecutor } from '../src/orchestrator/parallel/cache-aware-executor';
import { createCacheStore } from '../src/orchestrator/parallel/cache-store';
import { createInvalidationManager } from '../src/orchestrator/parallel/cache-invalidation';
import { createPersistentCacheStore, FileBackend } from '../src/orchestrator/parallel/cache-persistence';
import { BatchRequirementProcessor } from '../src/orchestrator/batch/batch-requirement-processor';
import { ParallelExecutor } from '../src/orchestrator/parallel/parallel-executor';
import { ExecutionContext, ParallelExecutionRequest, Requirement } from '../src/orchestrator/parallel/types';
import * as path from 'path';
import * as fs from 'fs';

const TEST_CACHE_DIR = path.join(__dirname, '.test-cache-integration');

function cleanupTestCache(): void {
  if (fs.existsSync(TEST_CACHE_DIR)) {
    fs.rmSync(TEST_CACHE_DIR, { recursive: true, force: true });
  }
}

describe('Cache-Aware Executor Integration', () => {
  let executor: ParallelExecutor;
  let cacheAwareExecutor: CacheAwareExecutor;
  let context: ExecutionContext;

  beforeEach(() => {
    const cache = createCacheStore('lru', 100);
    const invalidationManager = createInvalidationManager(cache);
    executor = new ParallelExecutor(4, 30000); // 4 workers
    cacheAwareExecutor = new CacheAwareExecutor(executor, cache, invalidationManager, true);

    context = {
      projectId: 'test-project',
      executionId: 'test-exec-' + Date.now(),
      timestamp: Date.now(),
      metadata: new Map([['timeout', 600]]),
    };
  });

  it('should cache pattern execution results', async () => {
    const pattern = '/requirements-to-specs';
    const input = { requirement: 'test requirement', priority: 'high' };

    // First execution - cache miss
    const result1 = await cacheAwareExecutor.executePatternCached(pattern, input, context);
    expect(result1.status).toBe('success');
    expect(result1.metadata.cached).toBe(false);

    const metrics1 = cacheAwareExecutor.getMetrics();
    expect(metrics1.cacheMisses).toBe(1);

    // Second execution - cache hit
    const result2 = await cacheAwareExecutor.executePatternCached(pattern, input, context);
    expect(result2.status).toBe('success');
    expect(result2.metadata.cached).toBe(true);

    const metrics2 = cacheAwareExecutor.getMetrics();
    expect(metrics2.cacheHits).toBe(1);
  });

  it('should not cache failed results', async () => {
    const pattern = '/failing-pattern';
    const input = { shouldFail: true };

    // First execution - fails
    const result1 = await cacheAwareExecutor.executePatternCached(pattern, input, context);

    const metrics1 = cacheAwareExecutor.getMetrics();
    expect(metrics1.patternsCached).toBe(0); // Not cached because failed

    // Second execution - should also fail (not served from cache)
    const result2 = await cacheAwareExecutor.executePatternCached(pattern, input, context);

    const metrics2 = cacheAwareExecutor.getMetrics();
    expect(metrics2.cacheMisses).toBe(2); // Two misses, no cache entry
  });

  it('should invalidate cache by pattern', async () => {
    const pattern = '/architecture-design';
    const input = { description: 'test architecture' };

    // Cache the pattern
    const result1 = await cacheAwareExecutor.executePatternCached(pattern, input, context);
    let metrics = cacheAwareExecutor.getMetrics();
    expect(metrics.cacheHits + metrics.cacheMisses).toBe(1);

    // Invalidate the pattern
    await cacheAwareExecutor.invalidatePattern(pattern);

    // Next execution should be a cache miss
    const result2 = await cacheAwareExecutor.executePatternCached(pattern, input, context);
    metrics = cacheAwareExecutor.getMetrics();
    expect(metrics.cacheMisses).toBe(2);
  });

  it('should handle multiple patterns in a phase', async () => {
    const patterns = ['/requirements-to-specs', '/architecture-design', '/risk-assessment'];
    const context = {
      projectId: 'test-project',
      executionId: 'test-exec-phase',
      timestamp: Date.now(),
      metadata: new Map([['timeout', 600]]),
    };

    // Execute phase
    const results = await cacheAwareExecutor.executePhaseWithCache(
      'req-1',
      'design',
      patterns,
      context
    );

    expect(results.length).toBe(3);
    expect(results.every(r => r.status === 'success')).toBe(true);

    // All should be cache misses on first run
    let metrics = cacheAwareExecutor.getMetrics();
    expect(metrics.cacheMisses).toBe(3);

    // Second phase execution should hit cache
    const results2 = await cacheAwareExecutor.executePhaseWithCache(
      'req-1',
      'design',
      patterns,
      context
    );

    expect(results2.length).toBe(3);
    metrics = cacheAwareExecutor.getMetrics();
    expect(metrics.cacheHits).toBeGreaterThan(0);
  });

  it('should enable and disable caching', async () => {
    const pattern = '/requirements-to-specs';
    const input = { test: 'disable' };

    // Enable caching (should be default)
    expect(cacheAwareExecutor.isCachingEnabled()).toBe(true);

    // Execute with caching enabled
    const result1 = await cacheAwareExecutor.executePatternCached(pattern, input, context);
    let metrics = cacheAwareExecutor.getMetrics();
    expect(metrics.cacheMisses).toBe(1);

    // Disable caching
    cacheAwareExecutor.setCachingEnabled(false);
    expect(cacheAwareExecutor.isCachingEnabled()).toBe(false);

    // Execute with caching disabled - should not hit cache
    const result2 = await cacheAwareExecutor.executePatternCached(pattern, input, context);
    metrics = cacheAwareExecutor.getMetrics();
    expect(metrics.cacheMisses).toBe(2);
    expect(metrics.cacheHits).toBe(0);

    // Re-enable caching
    cacheAwareExecutor.setCachingEnabled(true);
    const result3 = await cacheAwareExecutor.executePatternCached(pattern, input, context);
    metrics = cacheAwareExecutor.getMetrics();
    expect(metrics.cacheHits).toBe(1); // Now should hit cache
  });

  it('should generate cache performance report', () => {
    const report = cacheAwareExecutor.generateReport();

    expect(report).toContain('CACHE PERFORMANCE REPORT');
    expect(report).toContain('Cache Statistics');
    expect(report).toContain('Execution Metrics');
    expect(report).toContain('Performance');
    expect(report).toContain('Memory Usage');
    expect(report).toContain('Status');
  });

  it('should track execution metrics accurately', async () => {
    const patterns = ['/requirements-to-specs', '/architecture-design'];

    for (const pattern of patterns) {
      const input = { pattern, test: true };
      await cacheAwareExecutor.executePatternCached(pattern, input, context);
    }

    const metrics = cacheAwareExecutor.getMetrics();
    expect(metrics.patternsExecuted).toBe(2);
    expect(metrics.cacheMisses).toBe(2);
    expect(metrics.cacheHits).toBe(0);
    expect(metrics.patternsCached).toBe(2); // Both successful so cached
  });

  it('should reset metrics', async () => {
    const pattern = '/test-pattern';
    const input = { test: true };

    await cacheAwareExecutor.executePatternCached(pattern, input, context);

    let metrics = cacheAwareExecutor.getMetrics();
    expect(metrics.cacheMisses).toBeGreaterThan(0);

    cacheAwareExecutor.resetMetrics();

    metrics = cacheAwareExecutor.getMetrics();
    expect(metrics.cacheMisses).toBe(0);
    expect(metrics.cacheHits).toBe(0);
    expect(metrics.patternsExecuted).toBe(0);
  });
});

describe('Cache-Aware Batch Processing Integration', () => {
  let batchProcessor: BatchRequirementProcessor;
  let cacheAwareExecutor: CacheAwareExecutor;

  beforeEach(() => {
    const cache = createCacheStore('lru', 100);
    const invalidationManager = createInvalidationManager(cache);
    const executor = new ParallelExecutor(4, 30000);
    cacheAwareExecutor = new CacheAwareExecutor(executor, cache, invalidationManager, true);

    batchProcessor = new BatchRequirementProcessor(executor, 4);
  });

  it('should process batch with caching enabled', async () => {
    const requirements: Requirement[] = [
      {
        id: 'req-1',
        name: 'Feature 1',
        description: 'First feature',
        priority: 'high',
        dependencies: [],
      },
      {
        id: 'req-2',
        name: 'Feature 2',
        description: 'Second feature',
        priority: 'medium',
        dependencies: [],
      },
    ];

    const context: ExecutionContext = {
      projectId: 'test-project',
      executionId: 'batch-exec-' + Date.now(),
      timestamp: Date.now(),
      metadata: new Map([['timeout', 600]]),
    };

    // Process batch
    const result = await batchProcessor.processBatch(requirements, context);

    expect(result.requirements.length).toBe(2);
    expect(result.phases.length).toBe(6);
  });

  it('should improve performance on repeated batch processing', async () => {
    const requirements: Requirement[] = [
      {
        id: 'perf-req-1',
        name: 'Performance Test',
        description: 'Test performance improvement with cache',
        priority: 'high',
        dependencies: [],
      },
    ];

    const context: ExecutionContext = {
      projectId: 'perf-test-project',
      executionId: 'perf-exec-' + Date.now(),
      timestamp: Date.now(),
      metadata: new Map([['timeout', 600]]),
    };

    // First run - all cache misses
    const start1 = Date.now();
    const result1 = await batchProcessor.processBatch(requirements, context);
    const time1 = Date.now() - start1;

    const metrics1 = cacheAwareExecutor.getMetrics();
    const missRate1 = metrics1.cacheMisses / (metrics1.cacheHits + metrics1.cacheMisses) || 0;

    // Second run - should hit cache
    const start2 = Date.now();
    const result2 = await batchProcessor.processBatch(requirements, context);
    const time2 = Date.now() - start2;

    const metrics2 = cacheAwareExecutor.getMetrics();

    console.log(`\nBatch Processing Performance:`);
    console.log(`  First run: ${time1}ms (${(missRate1 * 100).toFixed(1)}% misses)`);
    console.log(`  Second run: ${time2}ms`);
    if (time1 > 0) {
      console.log(`  Improvement: ${(((time1 - time2) / time1) * 100).toFixed(1)}%`);
    }
  });
});

describe('Persistent Cache Integration', () => {
  let cacheAwareExecutor: CacheAwareExecutor;

  beforeEach(() => {
    cleanupTestCache();
  });

  afterEach(() => {
    cleanupTestCache();
  });

  it('should persist cache across executor instances', async () => {
    // First executor instance
    const backend1 = new FileBackend(TEST_CACHE_DIR);
    const persistentCache1 = createPersistentCacheStore('lru', 100, TEST_CACHE_DIR);
    const invalidationManager1 = createInvalidationManager(persistentCache1);
    const executor1 = new ParallelExecutor(2, 30000);
    const cacheAware1 = new CacheAwareExecutor(executor1, persistentCache1, invalidationManager1, true);

    const context: ExecutionContext = {
      projectId: 'persist-test',
      executionId: 'persist-exec-1',
      timestamp: Date.now(),
      metadata: new Map([['timeout', 600]]),
    };

    // Execute patterns with first instance
    await cacheAware1.executePatternCached('/requirements-to-specs', { test: 'data' }, context);
    let metrics1 = cacheAware1.getMetrics();
    expect(metrics1.cacheMisses).toBe(1);

    // Load persisted cache into new instance
    const persistentCache2 = createPersistentCacheStore('lru', 100, TEST_CACHE_DIR);
    await persistentCache2.loadPersisted();

    const invalidationManager2 = createInvalidationManager(persistentCache2);
    const executor2 = new ParallelExecutor(2, 30000);
    const cacheAware2 = new CacheAwareExecutor(executor2, persistentCache2, invalidationManager2, true);

    // Same execution should hit cache from persisted storage
    const result2 = await cacheAware2.executePatternCached('/requirements-to-specs', { test: 'data' }, context);
    let metrics2 = cacheAware2.getMetrics();

    expect(result2.metadata.cached).toBe(true);
    expect(metrics2.cacheHits).toBe(1);
  });

  it('should support cross-session cache reuse', async () => {
    const testData = [
      { pattern: '/requirements-to-specs', input: { req: 'A' } },
      { pattern: '/architecture-design', input: { arch: 'B' } },
      { pattern: '/risk-assessment', input: { risk: 'C' } },
    ];

    // Session 1: Cache data
    const cache1 = createPersistentCacheStore('lru', 100, TEST_CACHE_DIR);
    const inv1 = createInvalidationManager(cache1);
    const executor1 = new ParallelExecutor(2, 30000);
    const cacheAware1 = new CacheAwareExecutor(executor1, cache1, inv1, true);

    const context: ExecutionContext = {
      projectId: 'cross-session',
      executionId: 'session-1',
      timestamp: Date.now(),
      metadata: new Map([['timeout', 600]]),
    };

    for (const { pattern, input } of testData) {
      await cacheAware1.executePatternCached(pattern, input, context);
    }

    const stats1 = await cache1.getPersistenceStats();
    expect(stats1?.totalEntries).toBe(3);

    // Session 2: Load from persistence
    const cache2 = createPersistentCacheStore('lru', 100, TEST_CACHE_DIR);
    await cache2.loadPersisted();

    const stats2 = await cache2.getPersistenceStats();
    expect(stats2?.totalEntries).toBe(3);

    // Verify cache hits
    const inv2 = createInvalidationManager(cache2);
    const executor2 = new ParallelExecutor(2, 30000);
    const cacheAware2 = new CacheAwareExecutor(executor2, cache2, inv2, true);

    for (const { pattern, input } of testData) {
      const result = await cacheAware2.executePatternCached(pattern, input, context);
      expect(result.metadata.cached).toBe(true);
    }

    const metrics2 = cacheAware2.getMetrics();
    expect(metrics2.cacheHits).toBe(3);
  });
});

describe('Cache Invalidation Integration', () => {
  let cacheAwareExecutor: CacheAwareExecutor;

  beforeEach(() => {
    const cache = createCacheStore('lru', 100);
    const invalidationManager = createInvalidationManager(cache);
    const executor = new ParallelExecutor(2, 30000);
    cacheAwareExecutor = new CacheAwareExecutor(executor, cache, invalidationManager, true);
  });

  it('should invalidate on requirement change', async () => {
    const context: ExecutionContext = {
      projectId: 'inv-test',
      executionId: 'inv-exec',
      timestamp: Date.now(),
      metadata: new Map([['timeout', 600]]),
    };

    const reqId = 'req-to-invalidate';

    // Cache some results
    await cacheAwareExecutor.executePatternCached(
      '/requirements-to-specs',
      { requirementId: reqId },
      context
    );

    // Invalidate requirement
    await cacheAwareExecutor.invalidateRequirement(reqId);

    // Next execution should be a miss
    const result = await cacheAwareExecutor.executePatternCached(
      '/requirements-to-specs',
      { requirementId: reqId },
      context
    );

    expect(result.metadata.cached).toBe(false);
  });

  it('should invalidate by phase', async () => {
    const context: ExecutionContext = {
      projectId: 'phase-inv',
      executionId: 'phase-inv-exec',
      timestamp: Date.now(),
      metadata: new Map([['timeout', 600]]),
    };

    const phase = 'design';

    // Cache results in phase
    const patterns = ['/requirements-to-specs', '/architecture-design'];
    for (const pattern of patterns) {
      await cacheAwareExecutor.executePatternCached(pattern, { phase }, context);
    }

    // Invalidate entire phase
    await cacheAwareExecutor.invalidatePhase(phase);

    // Next execution should be misses
    for (const pattern of patterns) {
      const result = await cacheAwareExecutor.executePatternCached(pattern, { phase }, context);
      expect(result.metadata.cached).toBe(false);
    }
  });

  it('should clear entire cache', async () => {
    const context: ExecutionContext = {
      projectId: 'clear-test',
      executionId: 'clear-exec',
      timestamp: Date.now(),
      metadata: new Map([['timeout', 600]]),
    };

    // Cache multiple patterns
    for (let i = 0; i < 5; i++) {
      await cacheAwareExecutor.executePatternCached(`/pattern-${i}`, { index: i }, context);
    }

    let metrics = cacheAwareExecutor.getMetrics();
    expect(metrics.cacheMisses).toBe(5);

    // Clear entire cache
    await cacheAwareExecutor.invalidateAll();

    // Next executions should all be misses
    for (let i = 0; i < 5; i++) {
      await cacheAwareExecutor.executePatternCached(`/pattern-${i}`, { index: i }, context);
    }

    metrics = cacheAwareExecutor.getMetrics();
    expect(metrics.cacheMisses).toBe(10);
  });
});

describe('End-to-End Cache System', () => {
  it('should handle realistic workflow with cache', async () => {
    // Create full cache-aware system
    const persistentCache = createPersistentCacheStore('lru', 100, TEST_CACHE_DIR);
    const invalidationManager = createInvalidationManager(persistentCache);
    const executor = new ParallelExecutor(4, 30000);
    const cacheAware = new CacheAwareExecutor(executor, persistentCache, invalidationManager, true);

    const context: ExecutionContext = {
      projectId: 'e2e-test',
      executionId: 'e2e-exec-' + Date.now(),
      timestamp: Date.now(),
      metadata: new Map([['timeout', 600]]),
    };

    // Simulate workflow: design phase patterns
    const patterns = ['/requirements-to-specs', '/architecture-design', '/risk-assessment'];

    // First execution - all cache misses
    for (const pattern of patterns) {
      const result = await cacheAware.executePatternCached(pattern, { phase: 'design' }, context, 3600);
      expect(result.status).toBe('success');
    }

    let metrics = cacheAware.getMetrics();
    expect(metrics.cacheMisses).toBe(3);

    // Second execution - all cache hits
    for (const pattern of patterns) {
      const result = await cacheAware.executePatternCached(pattern, { phase: 'design' }, context, 3600);
      expect(result.metadata.cached).toBe(true);
    }

    metrics = cacheAware.getMetrics();
    expect(metrics.cacheHits).toBe(3);

    // Invalidate requirement and re-execute
    await cacheAware.invalidateRequirement('req-123');

    for (const pattern of patterns) {
      const result = await cacheAware.executePatternCached(pattern, { requirementId: 'req-123' }, context, 3600);
      expect(result.metadata.cached).toBe(false);
    }

    const report = cacheAware.generateReport();
    expect(report).toContain('Cache Hit Rate');
    expect(report).toContain('Time Saved');

    cleanupTestCache();
  });
});
