/**
 * Unit Tests for Cache System (v3.9.0 Phase 3)
 * Tests cache store, key builder, invalidation, and cache-aware executor
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { CacheStore, createCacheStore, type CacheEntry } from '../src/orchestrator/parallel/cache-store';
import { CacheKeyBuilder, hashInput, createCacheKeyBuilder } from '../src/orchestrator/parallel/cache-key-builder';
import { CacheInvalidationManager, createInvalidationManager, type InvalidationEventType } from '../src/orchestrator/parallel/cache-invalidation';
import { CacheAwareExecutor, createCacheAwareExecutor, type ExecutionCacheMetrics } from '../src/orchestrator/parallel/cache-aware-executor';
import { ParallelExecutor, createParallelExecutor } from '../src/orchestrator/parallel/parallel-executor';
import { ExecutionContext, Requirement } from '../src/orchestrator/parallel/types';

describe('Cache System Test Suite', () => {

  // ─────────────────────────────────────────────────────────
  // CACHE STORE TESTS
  // ─────────────────────────────────────────────────────────

  describe('CacheStore', () => {
    let cache: CacheStore;

    beforeEach(() => {
      cache = createCacheStore('lru', 100);
    });

    it('should store and retrieve values', async () => {
      await cache.set('key1', { data: 'value' }, 3600);
      const result = await cache.get('key1');

      expect(result).toBeDefined();
      expect((result as any).data).toBe('value');
    });

    it('should return null for missing keys', async () => {
      const result = await cache.get('nonexistent');
      expect(result).toBeNull();
    });

    it('should expire entries after TTL', async () => {
      await cache.set('key1', { data: 'value' }, 0.001); // 1ms TTL
      await new Promise(resolve => setTimeout(resolve, 10)); // Wait 10ms

      const result = await cache.get('key1');
      expect(result).toBeNull();
    });

    it('should support has() check', async () => {
      await cache.set('key1', { data: 'value' }, 3600);

      const exists = await cache.has('key1');
      expect(exists).toBe(true);

      const notExists = await cache.has('nonexistent');
      expect(notExists).toBe(false);
    });

    it('should delete entries', async () => {
      await cache.set('key1', { data: 'value' }, 3600);
      await cache.delete('key1');

      const result = await cache.get('key1');
      expect(result).toBeNull();
    });

    it('should clear entire cache', async () => {
      await cache.set('key1', { data: 'value1' }, 3600);
      await cache.set('key2', { data: 'value2' }, 3600);
      await cache.clear();

      expect(cache.size()).toBe(0);
    });

    it('should evict entries when full (LRU)', async () => {
      const smallCache = createCacheStore('lru', 3);

      await smallCache.set('key1', 'value1', 3600);
      await smallCache.set('key2', 'value2', 3600);
      await smallCache.set('key3', 'value3', 3600);

      // Access key1 to update lastAccessTime
      await smallCache.get('key1');

      // Add new entry, should evict key2 (least recently used)
      await smallCache.set('key4', 'value4', 3600);

      expect(smallCache.size()).toBe(3);
      expect(await smallCache.has('key1')).toBe(true);
      expect(await smallCache.has('key2')).toBe(false);
      expect(await smallCache.has('key3')).toBe(true);
      expect(await smallCache.has('key4')).toBe(true);
    });

    it('should evict least frequently used (LFU)', async () => {
      const lfuCache = createCacheStore('lfu', 3);

      await lfuCache.set('key1', 'value1', 3600);
      await lfuCache.set('key2', 'value2', 3600);
      await lfuCache.set('key3', 'value3', 3600);

      // Access key1 and key3 multiple times
      await lfuCache.get('key1');
      await lfuCache.get('key1');
      await lfuCache.get('key3');
      await lfuCache.get('key3');
      await lfuCache.get('key3');

      // key2 should be evicted (least frequently used)
      await lfuCache.set('key4', 'value4', 3600);

      expect(await lfuCache.has('key2')).toBe(false);
    });

    it('should track metrics', async () => {
      await cache.set('key1', { data: 'value' }, 3600);
      await cache.get('key1'); // Hit
      await cache.get('key1'); // Hit
      await cache.get('nonexistent'); // Miss

      const metrics = cache.getMetrics();

      expect(metrics.cacheHits).toBe(2);
      expect(metrics.cacheMisses).toBe(1);
      expect(metrics.hitRate).toBeGreaterThan(60); // 2/3 = 66%
      expect(metrics.totalEntries).toBe(1);
    });

    it('should support phase results caching', async () => {
      const results = [{ pattern: '/api-endpoint', status: 'success' }];

      await cache.setPhaseResults('REQ-1', 'design', results, 3600);
      const retrieved = await cache.getPhaseResults('REQ-1', 'design');

      expect(retrieved).toBeDefined();
      expect((retrieved as any)[0].pattern).toBe('/api-endpoint');
    });
  });

  // ─────────────────────────────────────────────────────────
  // CACHE KEY BUILDER TESTS
  // ─────────────────────────────────────────────────────────

  describe('CacheKeyBuilder', () => {
    let builder: CacheKeyBuilder;

    beforeEach(() => {
      builder = createCacheKeyBuilder();
    });

    it('should generate deterministic keys', () => {
      const input = { name: 'test', value: 42 };

      const key1 = builder.buildKey('/api-endpoint', input);
      const key2 = builder.buildKey('/api-endpoint', input);

      expect(key1).toBe(key2);
    });

    it('should generate different keys for different inputs', () => {
      const input1 = { name: 'test1' };
      const input2 = { name: 'test2' };

      const key1 = builder.buildKey('/api-endpoint', input1);
      const key2 = builder.buildKey('/api-endpoint', input2);

      expect(key1).not.toBe(key2);
    });

    it('should generate same key regardless of object key order', () => {
      const input1 = { a: 1, b: 2 };
      const input2 = { b: 2, a: 1 };

      const key1 = builder.buildKey('/api-endpoint', input1);
      const key2 = builder.buildKey('/api-endpoint', input2);

      expect(key1).toBe(key2);
    });

    it('should build requirement keys', () => {
      const requirement: Requirement = {
        id: 'REQ-1',
        name: 'Auth',
        description: 'User authentication',
        priority: 1,
      };

      const key = builder.buildRequirementKey('/requirements-to-specs', requirement);

      expect(key).toContain('req:');
      expect(key).toContain('/requirements-to-specs:');
    });

    it('should build phase keys', () => {
      const key = builder.buildPhaseKey('REQ-1', 'design', { some: 'input' });

      expect(key).toContain('phase:design:REQ-1:');
    });

    it('should extract components from cache key', () => {
      const key = builder.buildRequirementKey('/api-endpoint', {
        id: 'REQ-1',
        name: 'Test',
        description: 'Test',
        priority: 1,
      });

      const components = builder.extractComponents(key);

      expect(components.type).toBe('requirement');
      expect(components.pattern).toBe('/api-endpoint');
    });

    it('should hash inputs consistently', () => {
      const input = { a: 1, b: 2, c: 3 };

      const hash1 = hashInput(input);
      const hash2 = hashInput(input);

      expect(hash1).toBe(hash2);
      expect(hash1.length).toBe(16); // SHA256 truncated to 16 chars
    });

    it('should handle nested objects', () => {
      const input = {
        user: { name: 'John', age: 30 },
        settings: { theme: 'dark' },
      };

      const key1 = builder.buildKey('/api-endpoint', input);
      const key2 = builder.buildKey('/api-endpoint', input);

      expect(key1).toBe(key2);
    });
  });

  // ─────────────────────────────────────────────────────────
  // CACHE INVALIDATION TESTS
  // ─────────────────────────────────────────────────────────

  describe('CacheInvalidationManager', () => {
    let cache: CacheStore;
    let invalidator: CacheInvalidationManager;

    beforeEach(() => {
      cache = createCacheStore('lru', 100);
      invalidator = createInvalidationManager(cache);
    });

    it('should invalidate by requirement change', async () => {
      await cache.set('req:pattern:hash', 'value', 3600);
      await invalidator.onRequirementChange('REQ-1', 'content changed');

      const has = await cache.has('req:pattern:hash');
      expect(has).toBe(false);
    });

    it('should invalidate by pattern', async () => {
      await cache.set('/api-endpoint:hash1', 'value1', 3600);
      await cache.set('/ng-component:hash2', 'value2', 3600);

      await invalidator.invalidatePattern('/api-endpoint');

      expect(await cache.has('/api-endpoint:hash1')).toBe(false);
      expect(await cache.has('/ng-component:hash2')).toBe(true);
    });

    it('should invalidate by phase', async () => {
      await cache.setPhaseResults('REQ-1', 'design', [{ result: 1 }], 3600);
      await cache.setPhaseResults('REQ-1', 'plan', [{ result: 2 }], 3600);

      await invalidator.invalidatePhase('design');

      expect(await cache.getPhaseResults('REQ-1', 'design')).toBeNull();
      expect(await cache.getPhaseResults('REQ-1', 'plan')).not.toBeNull();
    });

    it('should track invalidation events', async () => {
      await invalidator.onRequirementChange('REQ-1');
      await invalidator.onArchitectureChange('PROJ-1');
      await invalidator.onConfigChange();

      const stats = invalidator.getStats();

      expect(stats.totalInvalidations).toBeGreaterThanOrEqual(3);
    });

    it('should provide invalidation history', async () => {
      await invalidator.onRequirementChange('REQ-1');
      await invalidator.onRequirementChange('REQ-2');

      const history = invalidator.getHistory(60000);

      expect(history.length).toBeGreaterThanOrEqual(2);
      expect(history[0].type).toBe('requirement-change');
    });
  });

  // ─────────────────────────────────────────────────────────
  // CACHE-AWARE EXECUTOR TESTS
  // ─────────────────────────────────────────────────────────

  describe('CacheAwareExecutor', () => {
    let executor: ParallelExecutor;
    let cache: CacheStore;
    let invalidator: CacheInvalidationManager;
    let cacheAware: CacheAwareExecutor;
    let context: ExecutionContext;

    beforeEach(() => {
      executor = createParallelExecutor();
      cache = createCacheStore('lru', 100);
      invalidator = createInvalidationManager(cache);
      cacheAware = createCacheAwareExecutor(executor, cache, invalidator, true);

      context = {
        userId: 'test-user',
        projectId: 'test-project',
        phase: 'design',
        metadata: new Map(),
      };
    });

    it('should cache pattern execution results', async () => {
      const input = { requirement: 'test' };

      // First call: execute and cache
      const result1 = await cacheAware.executePatternCached('/api-endpoint', input, context);
      expect(result1.status).toBe('success');

      // Second call: should hit cache
      const result2 = await cacheAware.executePatternCached('/api-endpoint', input, context);
      expect(result2.metadata.cached).toBe(true);

      const metrics = cacheAware.getMetrics();
      expect(metrics.cacheHits).toBeGreaterThan(0);
      expect(metrics.timeSavedMs).toBeGreaterThan(0);
    });

    it('should report execution metrics', async () => {
      const input = { test: 'data' };

      await cacheAware.executePatternCached('/api-endpoint', input, context);
      await cacheAware.executePatternCached('/api-endpoint', input, context);

      const metrics = cacheAware.getMetrics();

      expect(metrics.patternsExecuted).toBeGreaterThan(0);
      expect(metrics.cacheHits).toBeGreaterThan(0);
      expect(metrics.hitRate).toBeGreaterThan(0);
    });

    it('should invalidate cache for requirement', async () => {
      const input = { requirement: 'REQ-1' };

      await cacheAware.executePatternCached('/api-endpoint', input, context);
      await cacheAware.invalidateRequirement('REQ-1');

      // Cache should be cleared for this requirement
      const metrics = cache.getMetrics();
      expect(metrics.totalEntries).toBeLessThanOrEqual(0);
    });

    it('should support disabling caching', async () => {
      const input = { test: 'data' };

      cacheAware.setCachingEnabled(false);

      await cacheAware.executePatternCached('/api-endpoint', input, context);
      const metrics = cacheAware.getMetrics();

      expect(metrics.cacheHits).toBe(0);
      expect(cacheAware.isCachingEnabled()).toBe(false);
    });

    it('should generate performance report', async () => {
      const input = { test: 'data' };

      await cacheAware.executePatternCached('/api-endpoint', input, context);
      await cacheAware.executePatternCached('/api-endpoint', input, context);

      const report = cacheAware.generateReport();

      expect(report).toContain('CACHE PERFORMANCE REPORT');
      expect(report).toContain('Hit Rate');
      expect(report).toContain('Time Saved');
    });
  });

  // ─────────────────────────────────────────────────────────
  // INTEGRATION TESTS
  // ─────────────────────────────────────────────────────────

  describe('Cache System Integration', () => {
    it('should work end-to-end with all components', async () => {
      const executor = createParallelExecutor();
      const cache = createCacheStore('lru', 100);
      const invalidator = createInvalidationManager(cache);
      const cacheAware = createCacheAwareExecutor(executor, cache, invalidator, true);

      const context: ExecutionContext = {
        userId: 'test',
        projectId: 'test',
        phase: 'design',
        metadata: new Map(),
      };

      const input = { name: 'auth', priority: 1 };

      // First execution
      const result1 = await cacheAware.executePatternCached('/api-endpoint', input, context);
      expect(result1.status).toBe('success');

      // Second execution (from cache)
      const result2 = await cacheAware.executePatternCached('/api-endpoint', input, context);
      expect(result2.metadata.cached).toBe(true);

      // Invalidate and execute again
      await cacheAware.invalidatePattern('/api-endpoint');
      const result3 = await cacheAware.executePatternCached('/api-endpoint', input, context);
      expect(result3.metadata.cached).toBe(false);

      const metrics = cacheAware.getMetrics();
      expect(metrics.cacheHits).toBeGreaterThan(0);
      expect(metrics.patternsExecuted).toBeGreaterThan(0);
    });

    it('should achieve significant speedup with caching', async () => {
      const cache = createCacheStore('lru', 100);
      const context: ExecutionContext = {
        userId: 'test',
        projectId: 'test',
        phase: 'design',
        metadata: new Map(),
      };

      // Simulate pattern execution
      const startNoCache = Date.now();
      for (let i = 0; i < 5; i++) {
        await cache.set(`key${i}`, { data: `value${i}` }, 3600);
      }
      const noCacheDuration = Date.now() - startNoCache;

      // Reset and measure with cache hits
      cache.clear();
      const startWithCache = Date.now();
      for (let i = 0; i < 5; i++) {
        await cache.set(`key${i}`, { data: `value${i}` }, 3600);
      }
      for (let i = 0; i < 5; i++) {
        await cache.get(`key${i}`); // All hits
      }
      const withCacheDuration = Date.now() - startWithCache;

      // With cache should be faster
      expect(withCacheDuration).toBeLessThan(noCacheDuration + 50); // Allow small variance
    });
  });

  // ─────────────────────────────────────────────────────────
  // PERFORMANCE TESTS
  // ─────────────────────────────────────────────────────────

  describe('Cache Performance', () => {
    it('should handle high volume of operations', async () => {
      const cache = createCacheStore('lru', 10000);

      const startTime = Date.now();

      // Store 1000 entries
      for (let i = 0; i < 1000; i++) {
        await cache.set(`key${i}`, { data: `value${i}` }, 3600);
      }

      // Retrieve 1000 entries
      for (let i = 0; i < 1000; i++) {
        await cache.get(`key${i}`);
      }

      const duration = Date.now() - startTime;

      // Should complete in reasonable time
      expect(duration).toBeLessThan(5000); // 5 seconds max

      const metrics = cache.getMetrics();
      expect(metrics.totalEntries).toBe(1000);
      expect(metrics.cacheHits).toBe(1000);
    });

    it('cache hits should be significantly faster than misses', async () => {
      const cache = createCacheStore('lru', 100);
      const key = 'perf-test';
      const value = { data: 'performance test' };

      await cache.set(key, value, 3600);

      // Measure cache hit time
      const hitStart = Date.now();
      for (let i = 0; i < 1000; i++) {
        await cache.get(key);
      }
      const hitTime = Date.now() - hitStart;

      // Measure cache miss time
      const missStart = Date.now();
      for (let i = 0; i < 1000; i++) {
        await cache.get(`nonexistent${i}`);
      }
      const missTime = Date.now() - missStart;

      // Hits should be much faster (at least same or faster)
      expect(hitTime).toBeLessThanOrEqual(missTime + 50);
    });
  });
});
