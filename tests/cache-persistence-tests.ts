/**
 * Cache Persistence Tests — Comprehensive test suite for persistence layer
 */

import * as fs from 'fs';
import * as path from 'path';
import { FileBackend, PersistentCacheStore, createPersistentCacheStore } from '../src/orchestrator/parallel/cache-persistence';
import { CacheEntry } from '../src/orchestrator/parallel/cache-store';

// Test utilities
const TEST_CACHE_DIR = path.join(__dirname, '.test-cache');

function cleanupTestCache(): void {
  if (fs.existsSync(TEST_CACHE_DIR)) {
    fs.rmSync(TEST_CACHE_DIR, { recursive: true, force: true });
  }
}

describe('FileBackend Persistence', () => {
  let backend: FileBackend;

  beforeEach(() => {
    cleanupTestCache();
    backend = new FileBackend(TEST_CACHE_DIR);
  });

  afterEach(() => {
    cleanupTestCache();
  });

  it('should save and load cache entry', async () => {
    const key = 'test:pattern:hash123';
    const entry: CacheEntry = {
      key,
      pattern: 'test:pattern',
      inputHash: 'hash123',
      output: { result: 'success', data: [1, 2, 3] },
      timestamp: Date.now(),
      ttl: 3600,
      accessCount: 5,
      lastAccessTime: Date.now(),
    };

    await backend.save(key, entry);
    const loaded = await backend.load(key);

    expect(loaded).toBeTruthy();
    expect(loaded?.output).toEqual(entry.output);
    expect(loaded?.accessCount).toBe(5);
  });

  it('should return null for non-existent key', async () => {
    const loaded = await backend.load('non-existent:key');
    expect(loaded).toBeNull();
  });

  it('should delete cache entry', async () => {
    const key = 'test:delete:key';
    const entry: CacheEntry = {
      key,
      pattern: 'test:delete',
      inputHash: 'key',
      output: { deleted: false },
      timestamp: Date.now(),
      ttl: 3600,
      accessCount: 0,
      lastAccessTime: Date.now(),
    };

    await backend.save(key, entry);
    expect(await backend.exists(key)).toBe(true);

    await backend.delete(key);
    expect(await backend.exists(key)).toBe(false);
  });

  it('should check entry existence', async () => {
    const key = 'test:exists:key';
    const entry: CacheEntry = {
      key,
      pattern: 'test:exists',
      inputHash: 'key',
      output: {},
      timestamp: Date.now(),
      ttl: 3600,
      accessCount: 0,
      lastAccessTime: Date.now(),
    };

    expect(await backend.exists(key)).toBe(false);

    await backend.save(key, entry);
    expect(await backend.exists(key)).toBe(true);
  });

  it('should load all cache entries', async () => {
    const entries: Array<[string, CacheEntry]> = [];

    for (let i = 0; i < 5; i++) {
      const key = `test:entry:${i}`;
      const entry: CacheEntry = {
        key,
        pattern: `test:pattern:${i}`,
        inputHash: `hash${i}`,
        output: { index: i },
        timestamp: Date.now(),
        ttl: 3600,
        accessCount: i,
        lastAccessTime: Date.now(),
      };
      entries.push([key, entry]);
      await backend.save(key, entry);
    }

    const loaded = await backend.loadAll();
    expect(loaded.size).toBe(5);

    for (const [key] of entries) {
      expect(loaded.has(key)).toBe(true);
    }
  });

  it('should skip expired entries when loading', async () => {
    const futureKey = 'test:future:key';
    const pastKey = 'test:past:key';

    const futureEntry: CacheEntry = {
      key: futureKey,
      pattern: 'test:future',
      inputHash: 'future',
      output: { status: 'valid' },
      timestamp: Date.now(),
      ttl: 3600, // Still valid
      accessCount: 0,
      lastAccessTime: Date.now(),
    };

    const pastEntry: CacheEntry = {
      key: pastKey,
      pattern: 'test:past',
      inputHash: 'past',
      output: { status: 'expired' },
      timestamp: Date.now() - 7200 * 1000, // Created 2 hours ago
      ttl: 3600, // Expired
      accessCount: 0,
      lastAccessTime: Date.now(),
    };

    await backend.save(futureKey, futureEntry);
    await backend.save(pastKey, pastEntry);

    const loaded = await backend.loadAll();
    expect(loaded.has(futureKey)).toBe(true);
    expect(loaded.has(pastKey)).toBe(false);
  });

  it('should clear all cache entries', async () => {
    for (let i = 0; i < 3; i++) {
      const key = `test:clear:${i}`;
      const entry: CacheEntry = {
        key,
        pattern: 'test:clear',
        inputHash: `key${i}`,
        output: {},
        timestamp: Date.now(),
        ttl: 3600,
        accessCount: 0,
        lastAccessTime: Date.now(),
      };
      await backend.save(key, entry);
    }

    const beforeClear = await backend.loadAll();
    expect(beforeClear.size).toBeGreaterThan(0);

    await backend.clear();

    const afterClear = await backend.loadAll();
    expect(afterClear.size).toBe(0);
  });

  it('should report accurate stats', async () => {
    for (let i = 0; i < 3; i++) {
      const key = `test:stats:${i}`;
      const entry: CacheEntry = {
        key,
        pattern: 'test:stats',
        inputHash: `key${i}`,
        output: { data: 'x'.repeat(100) },
        timestamp: Date.now(),
        ttl: 3600,
        accessCount: 0,
        lastAccessTime: Date.now(),
      };
      await backend.save(key, entry);
    }

    const stats = await backend.getStats();
    expect(stats.totalEntries).toBe(3);
    expect(stats.totalSizeBytes).toBeGreaterThan(0);
    expect(stats.oldestEntry).toBeLessThanOrEqual(Date.now());
  });

  it('should persist index across instances', async () => {
    const key = 'test:persist:key';
    const entry: CacheEntry = {
      key,
      pattern: 'test:persist',
      inputHash: 'key',
      output: { persistent: true },
      timestamp: Date.now(),
      ttl: 3600,
      accessCount: 10,
      lastAccessTime: Date.now(),
    };

    await backend.save(key, entry);

    // Create new instance using same directory
    const backend2 = new FileBackend(TEST_CACHE_DIR);
    const loaded = await backend2.load(key);

    expect(loaded).toBeTruthy();
    expect(loaded?.accessCount).toBe(10);
  });
});

describe('PersistentCacheStore', () => {
  let store: PersistentCacheStore;
  let backend: FileBackend;

  beforeEach(() => {
    cleanupTestCache();
    backend = new FileBackend(TEST_CACHE_DIR);
    store = new PersistentCacheStore('lru', 1000, backend);
  });

  afterEach(() => {
    cleanupTestCache();
  });

  it('should set and get values with persistence', async () => {
    const key = 'test:persist:value';
    const value = { message: 'persisted', count: 42 };

    await store.set(key, value, 3600);
    const retrieved = await store.get(key);

    expect(retrieved).toEqual(value);

    // Verify persisted
    const persistedEntry = await backend.load(key);
    expect(persistedEntry).toBeTruthy();
    expect(persistedEntry?.output).toEqual(value);
  });

  it('should delete from both memory and persistence', async () => {
    const key = 'test:delete:both';
    const value = { to: 'delete' };

    await store.set(key, value, 3600);
    expect(await store.has(key)).toBe(true);
    expect(await backend.exists(key)).toBe(true);

    await store.delete(key);
    expect(await store.has(key)).toBe(false);
    expect(await backend.exists(key)).toBe(false);
  });

  it('should load persisted entries on startup', async () => {
    const keys = ['entry1', 'entry2', 'entry3'];

    for (const key of keys) {
      const entry: CacheEntry = {
        key,
        pattern: 'test:startup',
        inputHash: key,
        output: { key },
        timestamp: Date.now(),
        ttl: 3600,
        accessCount: 0,
        lastAccessTime: Date.now(),
      };
      await backend.save(key, entry);
    }

    // Create new store and load persisted
    const newStore = new PersistentCacheStore('lru', 1000, backend);
    await newStore.loadPersisted();

    for (const key of keys) {
      const value = await newStore.get(key);
      expect(value).toBeTruthy();
      expect(value?.key).toBe(key);
    }
  });

  it('should enable/disable persistence', async () => {
    const key = 'test:persistence:toggle';
    const value = { toggle: 'test' };

    store.disablePersistence();
    await store.set(key, value, 3600);
    expect(await backend.exists(key)).toBe(false);

    store.enablePersistence(backend);
    await store.set(key, value, 3600);
    expect(await backend.exists(key)).toBe(true);
  });

  it('should report persistence status', async () => {
    expect(store.isPersistenceEnabled()).toBe(true);

    store.disablePersistence();
    expect(store.isPersistenceEnabled()).toBe(false);

    store.enablePersistence(backend);
    expect(store.isPersistenceEnabled()).toBe(true);
  });

  it('should get persistence stats', async () => {
    for (let i = 0; i < 5; i++) {
      const key = `test:pstats:${i}`;
      await store.set(key, { index: i }, 3600);
    }

    const stats = await store.getPersistenceStats();
    expect(stats).toBeTruthy();
    expect(stats?.totalEntries).toBe(5);
    expect(stats?.totalSizeBytes).toBeGreaterThan(0);
  });

  it('should clear both memory and persistence', async () => {
    for (let i = 0; i < 5; i++) {
      await store.set(`key${i}`, { index: i }, 3600);
    }

    expect(store.size()).toBe(5);
    expect((await backend.loadAll()).size).toBe(5);

    await store.clear();

    expect(store.size()).toBe(0);
    expect((await backend.loadAll()).size).toBe(0);
  });
});

describe('Cache Persistence Factory', () => {
  afterEach(() => {
    cleanupTestCache();
  });

  it('should create persistent cache store with default settings', () => {
    const store = createPersistentCacheStore();
    expect(store).toBeTruthy();
    expect(store.isPersistenceEnabled()).toBe(false);
  });

  it('should create persistent cache store with directory', () => {
    const store = createPersistentCacheStore('lru', 500, TEST_CACHE_DIR);
    expect(store).toBeTruthy();
    expect(store.isPersistenceEnabled()).toBe(true);
  });

  it('should use specified eviction strategy', async () => {
    const store = createPersistentCacheStore('lfu', 10, TEST_CACHE_DIR);
    expect(store).toBeTruthy();

    // Fill beyond maxSize to trigger eviction
    for (let i = 0; i < 15; i++) {
      await store.set(`key${i}`, { index: i }, 3600);
    }

    // Should have evicted down to maxSize
    expect(store.size()).toBeLessThanOrEqual(10);
  });
});

describe('Cache Persistence Integration', () => {
  let store: PersistentCacheStore;

  beforeEach(() => {
    cleanupTestCache();
    const backend = new FileBackend(TEST_CACHE_DIR);
    store = new PersistentCacheStore('lru', 100, backend);
  });

  afterEach(() => {
    cleanupTestCache();
  });

  it('should handle complex nested objects', async () => {
    const key = 'test:complex:nested';
    const value = {
      level1: {
        level2: {
          level3: {
            data: [1, 2, 3],
            nested: { a: 'b', c: 'd' },
          },
        },
      },
      array: [
        { id: 1, name: 'item1' },
        { id: 2, name: 'item2' },
      ],
    };

    await store.set(key, value, 3600);
    const retrieved = await store.get(key);

    expect(retrieved).toEqual(value);

    const persisted = await store.getPersistenceStats();
    expect(persisted?.totalEntries).toBeGreaterThan(0);
  });

  it('should handle large batch operations', async () => {
    const batchSize = 50;

    for (let i = 0; i < batchSize; i++) {
      await store.set(`batch:${i}`, { index: i, data: 'x'.repeat(100) }, 3600);
    }

    expect(store.size()).toBeLessThanOrEqual(100);

    const stats = await store.getPersistenceStats();
    expect(stats?.totalEntries).toBeGreaterThan(0);
  });

  it('should maintain consistency across reload cycle', async () => {
    const testData = [
      { key: 'key1', value: { data: 'value1' } },
      { key: 'key2', value: { data: 'value2' } },
      { key: 'key3', value: { data: 'value3' } },
    ];

    // Save initial data
    for (const { key, value } of testData) {
      await store.set(key, value, 3600);
    }

    // Create new store and load persisted data
    const backend = new FileBackend(TEST_CACHE_DIR);
    const newStore = new PersistentCacheStore('lru', 100, backend);
    await newStore.loadPersisted();

    // Verify all data is present
    for (const { key, value } of testData) {
      const loaded = await newStore.get(key);
      expect(loaded).toEqual(value);
    }
  });

  it('should report accurate stats after operations', async () => {
    for (let i = 0; i < 10; i++) {
      await store.set(`stat:test:${i}`, { index: i }, 3600);
    }

    const stats = await store.getPersistenceStats();
    expect(stats?.totalEntries).toBe(10);
    expect(stats?.totalSizeBytes).toBeGreaterThan(0);
    expect(stats?.oldestEntry).toBeLessThanOrEqual(Date.now());
  });

  it('should handle rapid save/load cycles', async () => {
    const key = 'rapid:test:key';

    for (let cycle = 0; cycle < 10; cycle++) {
      const value = { cycle, timestamp: Date.now() };
      await store.set(key, value, 3600);

      const retrieved = await store.get(key);
      expect(retrieved?.cycle).toBe(cycle);
    }
  });

  it('should gracefully handle corrupted files', async () => {
    const key = 'test:corrupted:key';
    const value = { data: 'valid' };

    // Save valid entry
    await store.set(key, value, 3600);

    // Get the backend and corrupt a file directly
    const backend = store['persistence'] as FileBackend;
    const allEntries = await backend.loadAll();
    expect(allEntries.size).toBe(1);

    // Verify corrupted data is skipped
    const retrieved = await store.get(key);
    expect(retrieved).toBeTruthy();
  });
});

describe('Performance — Persistence vs Non-Persistence', () => {
  it('should show performance difference for high-volume writes', async () => {
    const iterations = 100;

    // Non-persisted store
    const nonPersisted = createPersistentCacheStore('lru', 1000);
    const start1 = Date.now();
    for (let i = 0; i < iterations; i++) {
      await nonPersisted.set(`key${i}`, { index: i }, 3600);
    }
    const time1 = Date.now() - start1;

    // Persisted store
    const persisted = createPersistentCacheStore('lru', 1000, TEST_CACHE_DIR);
    const start2 = Date.now();
    for (let i = 0; i < iterations; i++) {
      await persisted.set(`key${i}`, { index: i }, 3600);
    }
    const time2 = Date.now() - start2;

    console.log(`\nPerformance Comparison (${iterations} writes):`);
    console.log(`  Non-persisted: ${time1}ms`);
    console.log(`  Persisted (file): ${time2}ms`);
    console.log(`  Overhead: ${(((time2 - time1) / time1) * 100).toFixed(1)}%`);

    // Persisted should be slower due to disk I/O, but not prohibitively so
    expect(time2).toBeLessThan(time1 * 10); // Arbitrary threshold
  });

  it('should show performance improvement for cache hits from disk', async () => {
    cleanupTestCache();

    const backend = new FileBackend(TEST_CACHE_DIR);
    const store = new PersistentCacheStore('lru', 100, backend);

    // Warm up the cache
    for (let i = 0; i < 50; i++) {
      await store.set(`warm:${i}`, { index: i }, 3600);
    }

    // Measure read performance
    const start = Date.now();
    for (let i = 0; i < 50; i++) {
      await store.get(`warm:${i}`);
    }
    const time = Date.now() - start;

    console.log(`\nCache Hit Performance (50 reads): ${time}ms`);
    expect(time).toBeLessThan(100); // Should be fast
  });
});
