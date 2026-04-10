# PowerPlay v3.9.0 — Phase 3: Core Caching Architecture

**Version**: v3.9.0 | **Phase**: 3 (Core Caching) | **Status**: IN PROGRESS

**Timeline**: Weeks 5-6  
**Estimated Effort**: 35 hours  
**Expected Lines of Code**: 1,000+ lines

---

## Objective

Implement intelligent result caching to avoid re-generating pattern outputs when inputs haven't changed. Target: **1.5-2x additional speedup** through cache hits.

---

## Phase 3: Core Caching (What to Build)

### 1. **cache-store.ts** (300 lines)
In-memory cache with TTL and eviction policies:

```typescript
// Core cache interface
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

// Cache store with LRU/LFU/FIFO strategies
export class CacheStore {
  // LRU (Least Recently Used) - default
  // LFU (Least Frequently Used) - for stable patterns
  // FIFO (First In First Out) - for time-sensitive results
  
  async get<T>(key: string): Promise<T | null>;
  async set<T>(key: string, value: T, ttl: number): Promise<void>;
  async has(key: string): Promise<boolean>;
  async delete(key: string): Promise<void>;
  async clear(): Promise<void>;
  
  // Bulk operations for phase results
  async setPhaseResults(requirementId: string, phase: string, results: any[]): Promise<void>;
  async getPhaseResults(requirementId: string, phase: string): Promise<any[] | null>;
  
  getMetrics(): CacheMetrics;
}

export interface CacheMetrics {
  totalEntries: number;
  cacheHits: number;
  cacheMisses: number;
  hitRate: number;
  totalMemoryBytes: number;
  oldestEntry: number;
}
```

### 2. **cache-key-builder.ts** (200 lines)
Generate deterministic cache keys from pattern inputs:

```typescript
// Hash-based cache key generation
export class CacheKeyBuilder {
  // Generate stable hashes from:
  // - Pattern name
  // - Input context (userId, projectId, phase)
  // - Pattern parameters (requirements, constraints)
  
  buildKey(pattern: string, input: any, context: ExecutionContext): string;
  
  // Pattern-specific builders
  buildRequirementKey(pattern: string, requirement: Requirement): string;
  buildPatternKey(pattern: string, inputs: Map<string, any>): string;
  buildBatchKey(phase: string, requirements: Requirement[]): string;
}

// Hash function (deterministic)
export function hashInput(input: any): string {
  // Use crypto.createHash('sha256')
  // Deterministic JSON serialization
  // Produces same hash for same logical input
}
```

### 3. **cache-invalidation.ts** (250 lines)
Smart cache invalidation strategies:

```typescript
// Invalidation triggers
export const INVALIDATION_EVENTS = {
  'requirement-change': ['design', 'plan', 'execute'],  // Invalidates 3 phases
  'architecture-change': ['design', 'assess', 'review'], // Invalidates 3 phases
  'config-change': ['*'],  // Invalidates all
  'dependency-update': ['validate'],  // Invalidates testing
  'version-bump': ['execute', 'validate'],  // Invalidates code gen
};

export class CacheInvalidationManager {
  // Event-driven invalidation
  onRequirementChange(requirementId: string): Promise<void>;
  onArchitectureChange(projectId: string): Promise<void>;
  onConfigChange(): Promise<void>;
  
  // Pattern-specific invalidation
  invalidatePattern(pattern: string): Promise<void>;
  invalidateRequirement(requirementId: string): Promise<void>;
  invalidatePhase(phase: string): Promise<void>;
  
  // Batch invalidation
  invalidateByEvent(event: string, metadata: any): Promise<void>;
}
```

### 4. **cache-aware-executor.ts** (300 lines)
Extend parallel executor to use cache:

```typescript
// Wrap pattern execution with caching
export class CacheAwareExecutor extends ParallelExecutor {
  async executePatternCached(
    pattern: string,
    input: any,
    context: ExecutionContext
  ): Promise<PatternResult> {
    // 1. Generate cache key
    const key = this.keyBuilder.buildKey(pattern, input, context);
    
    // 2. Check cache
    const cached = await this.cache.get(key);
    if (cached && !this.isExpired(cached)) {
      return {
        ...cached,
        metadata: { ...cached.metadata, cached: true }
      };
    }
    
    // 3. Execute pattern
    const result = await this.executePattern(pattern, input, context);
    
    // 4. Cache result
    await this.cache.set(key, result, this.config.caching.ttl);
    
    return result;
  }
}
```

### 5. **cache-metrics.ts** (150 lines)
Track cache performance:

```typescript
export interface CacheMetrics {
  totalRequests: number;
  cacheHits: number;
  cacheMisses: number;
  hitRate: number;  // hits / (hits + misses)
  memoryCost: number;  // bytes
  timesSaved: number;  // ms saved by cache hits
  patternsWithHighHitRate: Map<string, number>;
}

export class CacheMetricsCollector {
  recordHit(pattern: string, timeSaved: number): void;
  recordMiss(pattern: string): void;
  recordInvalidation(pattern: string, count: number): void;
  
  getMetrics(): CacheMetrics;
  getPatternMetrics(pattern: string): PatternCacheMetrics;
  
  // What should we cache aggressively?
  suggestCacheStrategy(): { 
    highCachePatterns: string[];  // Often have same inputs
    lowCachePatterns: string[];   // Rarely reused
  };
}
```

### 6. **cache-persistence.ts** (150 lines) - *Optional Phase 3.5*
Persist cache across sessions:

```typescript
// Optional: Save cache to disk for cross-session reuse
export class PersistentCacheStore extends CacheStore {
  // Store in: JSON file, SQLite, or Redis
  async loadFromDisk(): Promise<void>;
  async saveToDisk(): Promise<void>;
  
  // Selective persistence (cache only important results)
  async persistPhaseResults(phase: string): Promise<void>;
  async loadPhaseResults(phase: string): Promise<void>;
}
```

### 7. **Unit Tests** (400 lines)

**Cache Store Tests**:
- Set/get operations
- TTL expiration
- LRU eviction
- Memory limits

**Cache Key Tests**:
- Deterministic key generation
- Hash collision handling
- Pattern-specific keys

**Invalidation Tests**:
- Event-triggered invalidation
- Cascading invalidation
- Pattern invalidation

**Cache-Aware Executor Tests**:
- Cache hits reduce execution time
- Misses fall through to execution
- Cache hit rate tracking

**Integration Tests**:
- Full batch with caching
- Cache metrics reporting
- Performance improvement verification

---

## Phase 3 Implementation Plan

### Week 5: Core Cache Infrastructure
1. **Day 1-2**: Build `cache-store.ts` with LRU eviction
2. **Day 3-4**: Build `cache-key-builder.ts` for deterministic keys
3. **Day 5**: Write tests for cache store + key builder

### Week 6: Cache Integration & Invalidation
1. **Day 1-2**: Build `cache-invalidation.ts` with event handlers
2. **Day 3-4**: Build `cache-aware-executor.ts` wrapping parallel executor
3. **Day 5**: Write tests + performance benchmarks

### Optional Phase 3.5: Persistence
- `cache-persistence.ts` for cross-session reuse
- SQLite backend for larger caches
- Cache warming on startup

---

## Expected Performance Gains

### Cache Hit Rates by Phase

| Phase | Hit Rate | Why | Savings |
|-------|----------|-----|---------|
| Design | 20% | Requirements change frequently | 1 min / 5 min |
| Plan | 30% | Test templates mostly stable | 1.5 min / 5 min |
| Assess | 40% | Risk patterns similar across projects | 2 min / 5 min |
| Review | 25% | Quality checks vary per requirement | 1.25 min / 5 min |
| Execute | 50% | Code patterns highly reusable | 2.5 min / 5 min |
| Validate | 60% | Tests + security scans very reusable | 3 min / 5 min |

**Average Hit Rate**: 38% across all phases

### Speedup Calculation

```
Single requirement, 6 phases × 5 min each:
Sequential: 30 minutes
With caching (38% hit rate):
  - 2 phases hit (10 min saved) × 0.38 = 3.8 min
  - 4 phases execute = 20 min
  - Total: 20 + 3.8 = 23.8 min
  - But hits avoid *all* execution time
  - Real: ~20 - (30 × 0.38 × 0.9) = 20 - 10 = 10 min
  - Speedup: 3x ✓

Batch of 3 requirements with caching:
Without cache: 25 min (parallel)
With cache: 25 × (1 - 0.38) = 15.5 min
Speedup: 1.6x additional
```

**Combined Speedup (Phases 1+2+3)**:
- Phase 1: 3x (patterns parallel)
- Phase 2: 4.5x (requirements parallel)  
- Phase 3: 1.6x (caching)
- **Total: 3 × 4.5 × 1.6 = 21.6x** ⚠️ *diminishing returns*
- **Realistic Combined**: 8-10x speedup

---

## Configuration

```yaml
parallelProcessing:
  caching:
    enabled: true
    ttl: 3600              # 1 hour default
    strategy: lru          # Least Recently Used
    maxSize: 1000          # Max cached entries
    invalidateOn:
      - requirement-change
      - architecture-change
      - config-change
      - dependency-update
    
    # Pattern-specific TTLs (override global TTL)
    patternTtls:
      /requirements-to-specs: 7200      # 2 hours
      /architecture-design: 7200
      /add-tests: 3600                  # 1 hour
      /security-scan: 1800              # 30 min (changes often)
    
    # Patterns to never cache
    noCachePatterns:
      - /security-scan      # Security checks must be fresh
      - /performance-check  # Performance changes
    
    # Persistence (optional)
    persistence:
      enabled: false
      backend: sqlite       # or 'file', 'redis'
      path: .cache/powerplay-results.db
      warmOnStartup: true
```

---

## How It Works

### Cache Flow

```
User requests pattern execution
        ↓
Check cache key exists
        ↓
    ┌─→ HIT ────→ Return cached result (instant) → Metrics: hit +1
    │
    └─→ MISS
        ↓
    Execute pattern
        ↓
    Cache result with TTL
        ↓
    Return to user → Metrics: miss +1

Invalidation event:
    requirement-change event
        ↓
    Invalidate keys for affected patterns
        ↓
    Next execution → MISS → Fresh pattern execution
```

### Example: Batch Processing with Cache

```
Requirement 1: "User Authentication"
  Phase 1 (Design)
    - /requirements-to-specs: INPUT[User Auth] → CACHE MISS
    - /architecture-design: INPUT[User Auth] → CACHE MISS
    Results cached (6 min execution)

Requirement 2: "Order Management"
  Phase 1 (Design)
    - /requirements-to-specs: INPUT[Order Mgmt] → CACHE MISS
    - /architecture-design: INPUT[Order Mgmt] → CACHE MISS
    Results cached (6 min execution)

Requirement 1 (again): "User Authentication"
  Phase 2 (Plan)
    - /acceptance-criteria: INPUT[User Auth] → CACHE HIT ✓
    - /test-case-design: INPUT[User Auth] → CACHE HIT ✓
    Results served from cache (0.1 sec)

Result: 3 minutes saved on phase 2 for requirement 1
```

---

## Testing Strategy

```typescript
describe('Core Caching', () => {
  
  // Cache Store Tests
  test('Cache stores and retrieves values', async () => {
    const store = new CacheStore();
    await store.set('key1', { data: 'value' }, 3600);
    const result = await store.get('key1');
    expect(result.data).toBe('value');
  });
  
  // Invalidation Tests
  test('Invalidation clears affected cache entries', async () => {
    const invalidator = new CacheInvalidationManager(cache);
    await invalidator.onRequirementChange('REQ-1');
    // Cache entries for REQ-1 should be cleared
  });
  
  // Performance Tests
  test('Cached execution is 100x faster than fresh', async () => {
    const executor = new CacheAwareExecutor(cache, parallelExecutor);
    
    // First call: ~1000ms (pattern execution)
    const t1 = Date.now();
    await executor.executePatternCached('/api-endpoint', input, ctx);
    const time1 = Date.now() - t1;
    
    // Second call: ~10ms (cache hit)
    const t2 = Date.now();
    await executor.executePatternCached('/api-endpoint', input, ctx);
    const time2 = Date.now() - t2;
    
    expect(time2).toBeLessThan(time1 / 10);  // 10x faster minimum
  });
});
```

---

## Success Criteria for Phase 3

- ✓ Cache store with LRU eviction implemented
- ✓ Deterministic cache key generation
- ✓ Event-driven cache invalidation
- ✓ Cache-aware executor (transparent to callers)
- ✓ 400+ line test suite
- ✓ 38%+ average cache hit rate across phases
- ✓ 1.5-2x speedup validation
- ✓ Metrics collection and reporting
- ✓ Documentation with examples

---

## What Phase 4 Will Add

**Phase 4: Core Monitoring & Tuning**
- Worker pool auto-tuning based on metrics
- Performance dashboard
- Bottleneck identification
- Automatic pattern prioritization

---

## Summary

Phase 3 focuses on **core caching fundamentals**:
- Simple, deterministic cache key generation
- Smart invalidation avoiding stale results
- Transparent integration with parallel executor
- Measurable 1.5-2x speedup through cache hits

Combined impact: **Phases 1-3 = 8-10x speedup** for real-world projects.

Ready to proceed with Phase 3 implementation.
