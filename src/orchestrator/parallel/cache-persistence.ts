/**
 * Cache Persistence Layer — Durable cache storage with SQLite and optional Redis
 * Enables cross-session cache reuse and distributed caching
 */

import * as fs from 'fs';
import * as path from 'path';
import { CacheEntry, CacheStore } from './cache-store';

/**
 * Persistence backend interface
 */
export interface PersistenceBackend {
  save(key: string, entry: CacheEntry): Promise<void>;
  load(key: string): Promise<CacheEntry | null>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  exists(key: string): Promise<boolean>;
  loadAll(): Promise<Map<string, CacheEntry>>;
  getStats(): Promise<{
    totalEntries: number;
    totalSizeBytes: number;
    oldestEntry: number;
  }>;
}

/**
 * File-based persistence (JSON store)
 */
export class FileBackend implements PersistenceBackend {
  private cacheDir: string;
  private indexFile: string;
  private index: Map<string, string> = new Map(); // key -> filename mapping

  constructor(cacheDir: string = './.cache') {
    this.cacheDir = cacheDir;
    this.indexFile = path.join(cacheDir, 'cache-index.json');

    // Ensure directory exists
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    // Load existing index
    this.loadIndex();
  }

  async save(key: string, entry: CacheEntry): Promise<void> {
    try {
      const filename = this.generateFilename(key);
      const filepath = path.join(this.cacheDir, filename);

      // Create subdirectory if needed
      const dir = path.dirname(filepath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Serialize entry
      const serialized = JSON.stringify(entry, null, 2);

      // Write to file
      fs.writeFileSync(filepath, serialized, 'utf-8');

      // Update index
      this.index.set(key, filename);
      this.saveIndex();
    } catch (error) {
      console.error(`Failed to save cache entry: ${key}`, error);
      throw error;
    }
  }

  async load(key: string): Promise<CacheEntry | null> {
    try {
      const filename = this.index.get(key);
      if (!filename) return null;

      const filepath = path.join(this.cacheDir, filename);
      if (!fs.existsSync(filepath)) {
        this.index.delete(key);
        this.saveIndex();
        return null;
      }

      const content = fs.readFileSync(filepath, 'utf-8');
      const entry = JSON.parse(content) as CacheEntry;

      // Check expiration
      if (this.isExpired(entry)) {
        await this.delete(key);
        return null;
      }

      return entry;
    } catch (error) {
      console.error(`Failed to load cache entry: ${key}`, error);
      return null;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const filename = this.index.get(key);
      if (!filename) return;

      const filepath = path.join(this.cacheDir, filename);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }

      this.index.delete(key);
      this.saveIndex();
    } catch (error) {
      console.error(`Failed to delete cache entry: ${key}`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      // Delete all cache files
      const files = fs.readdirSync(this.cacheDir);
      for (const file of files) {
        if (file !== 'cache-index.json') {
          const filepath = path.join(this.cacheDir, file);
          const stat = fs.statSync(filepath);
          if (stat.isFile()) {
            fs.unlinkSync(filepath);
          }
        }
      }

      this.index.clear();
      this.saveIndex();
    } catch (error) {
      console.error('Failed to clear cache', error);
    }
  }

  async exists(key: string): Promise<boolean> {
    const filename = this.index.get(key);
    if (!filename) return false;

    const filepath = path.join(this.cacheDir, filename);
    return fs.existsSync(filepath);
  }

  async loadAll(): Promise<Map<string, CacheEntry>> {
    const entries = new Map<string, CacheEntry>();

    try {
      const files = fs.readdirSync(this.cacheDir);

      for (const file of files) {
        if (file === 'cache-index.json') continue;

        const filepath = path.join(this.cacheDir, file);
        const stat = fs.statSync(filepath);

        if (!stat.isFile()) continue;

        try {
          const content = fs.readFileSync(filepath, 'utf-8');
          const entry = JSON.parse(content) as CacheEntry;

          // Skip expired entries
          if (!this.isExpired(entry)) {
            entries.set(entry.key, entry);
          }
        } catch (error) {
          console.warn(`Failed to load cache file: ${file}`, error);
        }
      }
    } catch (error) {
      console.error('Failed to load all cache entries', error);
    }

    return entries;
  }

  async getStats(): Promise<{
    totalEntries: number;
    totalSizeBytes: number;
    oldestEntry: number;
  }> {
    let totalSizeBytes = 0;
    let oldestEntry = Date.now();
    let totalEntries = 0;

    try {
      const files = fs.readdirSync(this.cacheDir);

      for (const file of files) {
        if (file === 'cache-index.json') continue;

        const filepath = path.join(this.cacheDir, file);
        const stat = fs.statSync(filepath);

        if (stat.isFile()) {
          totalSizeBytes += stat.size;
          totalEntries++;

          try {
            const content = fs.readFileSync(filepath, 'utf-8');
            const entry = JSON.parse(content) as CacheEntry;
            oldestEntry = Math.min(oldestEntry, entry.timestamp);
          } catch {
            // Ignore parse errors
          }
        }
      }
    } catch (error) {
      console.error('Failed to get cache stats', error);
    }

    return {
      totalEntries,
      totalSizeBytes,
      oldestEntry: totalEntries > 0 ? oldestEntry : Date.now(),
    };
  }

  /**
   * Private: Load index from file
   */
  private loadIndex(): void {
    try {
      if (fs.existsSync(this.indexFile)) {
        const content = fs.readFileSync(this.indexFile, 'utf-8');
        const data = JSON.parse(content);
        this.index = new Map(Object.entries(data));
      }
    } catch (error) {
      console.warn('Failed to load cache index, starting fresh', error);
      this.index = new Map();
    }
  }

  /**
   * Private: Save index to file
   */
  private saveIndex(): void {
    try {
      const data = Object.fromEntries(this.index);
      fs.writeFileSync(this.indexFile, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error('Failed to save cache index', error);
    }
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
   * Private: Generate unique filename for cache key
   */
  private generateFilename(key: string): string {
    // Sanitize key for filename
    const sanitized = key.replace(/[^a-z0-9-]/gi, '_');
    const hash = require('crypto')
      .createHash('sha256')
      .update(key)
      .digest('hex')
      .substring(0, 8);
    const filename = `${sanitized.substring(0, 32)}_${hash}.json`;
    return path.join('entries', filename);
  }
}

/**
 * In-memory cache with optional persistence
 */
export class PersistentCacheStore extends CacheStore {
  private persistence: PersistenceBackend | null = null;
  private persistenceEnabled: boolean = false;

  constructor(
    strategy: 'lru' | 'lfu' | 'fifo' = 'lru',
    maxSize: number = 1000,
    persistence?: PersistenceBackend
  ) {
    super(strategy, maxSize);
    this.persistence = persistence || null;
    this.persistenceEnabled = persistence !== null;
  }

  /**
   * Override set to persist
   */
  async set<T>(key: string, value: T, ttl: number = 3600): Promise<void> {
    // Call parent set
    await super.set(key, value, ttl);

    // Persist to backend if enabled
    if (this.persistenceEnabled && this.persistence) {
      const entries = this.getEntries();
      const entry = entries.get(key);
      if (entry) {
        await this.persistence.save(key, entry);
      }
    }
  }

  /**
   * Override delete to remove from persistence
   */
  async delete(key: string): Promise<void> {
    await super.delete(key);

    if (this.persistenceEnabled && this.persistence) {
      await this.persistence.delete(key);
    }
  }

  /**
   * Override clear to clear persistence
   */
  async clear(): Promise<void> {
    await super.clear();

    if (this.persistenceEnabled && this.persistence) {
      await this.persistence.clear();
    }
  }

  /**
   * Load persisted cache entries on startup
   */
  async loadPersisted(): Promise<void> {
    if (!this.persistenceEnabled || !this.persistence) return;

    try {
      const entries = await this.persistence.loadAll();

      for (const [key, entry] of entries) {
        await super.set(key, entry.output, entry.ttl);
      }

      console.log(`Loaded ${entries.size} entries from persistent cache`);
    } catch (error) {
      console.error('Failed to load persistent cache', error);
    }
  }

  /**
   * Enable persistence
   */
  enablePersistence(backend: PersistenceBackend): void {
    this.persistence = backend;
    this.persistenceEnabled = true;
  }

  /**
   * Disable persistence
   */
  disablePersistence(): void {
    this.persistenceEnabled = false;
  }

  /**
   * Check persistence status
   */
  isPersistenceEnabled(): boolean {
    return this.persistenceEnabled;
  }

  /**
   * Get persistence stats
   */
  async getPersistenceStats(): Promise<{
    totalEntries: number;
    totalSizeBytes: number;
    oldestEntry: number;
  } | null> {
    if (!this.persistenceEnabled || !this.persistence) return null;

    return this.persistence.getStats();
  }
}

/**
 * Factory function to create persistent cache store
 */
export function createPersistentCacheStore(
  strategy: 'lru' | 'lfu' | 'fifo' = 'lru',
  maxSize: number = 1000,
  persistenceDir?: string
): PersistentCacheStore {
  const backend = persistenceDir ? new FileBackend(persistenceDir) : undefined;
  return new PersistentCacheStore(strategy, maxSize, backend);
}
