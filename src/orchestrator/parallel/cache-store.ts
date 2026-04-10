/**
 * Cache Store — In-memory result caching with eviction policies
 * Supports LRU (Least Recently Used), LFU (Least Frequently Used), FIFO
 */

/**
 * Cache entry with metadata
 */
export interface CacheEntry<T = any> {
  key: string;
  pattern: string;
  inputHash: string;
  output: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessTime: number;
}

/**
 * Cache metrics for monitoring
 */
export interface CacheMetrics {
  totalEntries: number;
  cacheHits: number;
  cacheMisses: number;
  hitRate: number;
  totalMemoryBytes: number;
  oldestEntry: number;
  evictionCount: number;
  averageAccessCount: number;
}

/**
 * Eviction strategy type
 */
export type EvictionStrategy = 'lru' | 'lfu' | 'fifo';

/**
 * In-memory cache store with configurable eviction
 */
export class CacheStore {
  private cache: Map<string, CacheEntry> = new Map();
  private strategy: EvictionStrategy;
  private maxSize: number;
  private metrics = {
    hits: 0,
    misses: 0,
    evictions: 0,
  };

  constructor(strategy: EvictionStrategy = 'lru', maxSize: number = 1000) {
    this.strategy = strategy;
    this.maxSize = Math.max(10, maxSize); // Minimum 10 entries
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);

    if (!entry) {
      this.metrics.misses++;
      return null;
    }

    // Check if expired
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.metrics.misses++;
      return null;
    }

    // Update access metadata
    entry.accessCount++;
    entry.lastAccessTime = Date.now();

    this.metrics.hits++;
    return entry.output as T;
  }

  /**
   * Set value in cache
   */
  async set<T>(key: string, value: T, ttl: number = 3600): Promise<void> {
    // If cache is full, evict based on strategy
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evict();
    }

    const entry: CacheEntry<T> = {
      key,
      pattern: this.extractPattern(key),
      inputHash: this.extractHash(key),
      output: value,
      timestamp: Date.now(),
      ttl,
      accessCount: 0,
      lastAccessTime: Date.now(),
    };

    this.cache.set(key, entry);
  }

  /**
   * Check if key exists and is valid
   */
  async has(key: string): Promise<boolean> {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete entry from cache
   */
  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  /**
   * Clear entire cache
   */
  async clear(): Promise<void> {
    this.cache.clear();
  }

  /**
   * Set phase results for requirement
   */
  async setPhaseResults(
    requirementId: string,
    phase: string,
    results: any[],
    ttl: number = 3600
  ): Promise<void> {
    const key = `phase:${phase}:${requirementId}`;
    await this.set(key, results, ttl);
  }

  /**
   * Get phase results for requirement
   */
  async getPhaseResults(requirementId: string, phase: string): Promise<any[] | null> {
    const key = `phase:${phase}:${requirementId}`;
    return this.get<any[]>(key);
  }

  /**
   * Delete all entries for a requirement
   */
  async deleteRequirement(requirementId: string): Promise<void> {
    const keysToDelete: string[] = [];

    for (const key of this.cache.keys()) {
      if (key.includes(requirementId)) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      this.cache.delete(key);
    }
  }

  /**
   * Delete all entries for a phase
   */
  async deletePhase(phase: string): Promise<void> {
    const keysToDelete: string[] = [];

    for (const key of this.cache.keys()) {
      if (key.startsWith(`phase:${phase}:`)) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      this.cache.delete(key);
    }
  }

  /**
   * Get cache metrics
   */
  getMetrics(): CacheMetrics {
    let totalMemory = 0;
    let oldestEntry = Date.now();
    let totalAccessCount = 0;
    const entryCount = this.cache.size;

    for (const entry of this.cache.values()) {
      // Rough memory estimate
      totalMemory += JSON.stringify(entry.output).length * 2; // UTF-16 estimate
      oldestEntry = Math.min(oldestEntry, entry.timestamp);
      totalAccessCount += entry.accessCount;
    }

    const totalRequests = this.metrics.hits + this.metrics.misses;
    const hitRate = totalRequests > 0 ? (this.metrics.hits / totalRequests) * 100 : 0;

    return {
      totalEntries: entryCount,
      cacheHits: this.metrics.hits,
      cacheMisses: this.metrics.misses,
      hitRate,
      totalMemoryBytes: totalMemory,
      oldestEntry,
      evictionCount: this.metrics.evictions,
      averageAccessCount: entryCount > 0 ? totalAccessCount / entryCount : 0,
    };
  }

  /**
   * Get pattern metrics (cache performance per pattern)
   */
  getPatternMetrics(pattern: string): {
    pattern: string;
    cacheHits: number;
    entriesCount: number;
    averageAccessCount: number;
    totalMemory: number;
  } {
    let hits = 0;
    let count = 0;
    let totalAccess = 0;
    let totalMemory = 0;

    for (const entry of this.cache.values()) {
      if (entry.pattern === pattern) {
        count++;
        totalAccess += entry.accessCount;
        totalMemory += JSON.stringify(entry.output).length * 2;
        hits += entry.accessCount > 0 ? 1 : 0;
      }
    }

    return {
      pattern,
      cacheHits: hits,
      entriesCount: count,
      averageAccessCount: count > 0 ? totalAccess / count : 0,
      totalMemory,
    };
  }

  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.metrics = { hits: 0, misses: 0, evictions: 0 };
  }

  /**
   * Private: Check if entry is expired
   */
  private isExpired(entry: CacheEntry): boolean {
    const now = Date.now();
    const age = now - entry.timestamp;
    return age > entry.ttl * 1000; // TTL in seconds
  }

  /**
   * Private: Evict entry based on strategy
   */
  private evict(): void {
    let keyToEvict: string | null = null;

    switch (this.strategy) {
      case 'lru':
        keyToEvict = this.evictLRU();
        break;
      case 'lfu':
        keyToEvict = this.evictLFU();
        break;
      case 'fifo':
        keyToEvict = this.evictFIFO();
        break;
    }

    if (keyToEvict) {
      this.cache.delete(keyToEvict);
      this.metrics.evictions++;
    }
  }

  /**
   * Private: LRU eviction (remove least recently used)
   */
  private evictLRU(): string | null {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache) {
      if (entry.lastAccessTime < oldestTime) {
        oldestTime = entry.lastAccessTime;
        oldestKey = key;
      }
    }

    return oldestKey;
  }

  /**
   * Private: LFU eviction (remove least frequently used)
   */
  private evictLFU(): string | null {
    let leastAccessedKey: string | null = null;
    let leastAccessCount = Infinity;

    for (const [key, entry] of this.cache) {
      if (entry.accessCount < leastAccessCount) {
        leastAccessCount = entry.accessCount;
        leastAccessedKey = key;
      }
    }

    return leastAccessedKey;
  }

  /**
   * Private: FIFO eviction (remove first in)
   */
  private evictFIFO(): string | null {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    return oldestKey;
  }

  /**
   * Private: Extract pattern name from cache key
   */
  private extractPattern(key: string): string {
    // Key format: "pattern:hash" or "phase:phase:requirement"
    const parts = key.split(':');
    return parts[0];
  }

  /**
   * Private: Extract hash from cache key
   */
  private extractHash(key: string): string {
    // Key format: "pattern:hash" or "phase:phase:requirement"
    const parts = key.split(':');
    return parts.slice(1).join(':');
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Get cache entries (for testing/debugging)
   */
  getEntries(): Map<string, CacheEntry> {
    return new Map(this.cache);
  }
}

/**
 * Factory function to create cache store
 */
export function createCacheStore(strategy: EvictionStrategy = 'lru', maxSize: number = 1000): CacheStore {
  return new CacheStore(strategy, maxSize);
}
