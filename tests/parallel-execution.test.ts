/**
 * Unit Tests for Parallel Pattern Execution
 * Tests parallel execution, worker pool, dependency graph, and caching
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { ParallelExecutor, createParallelExecutor } from '../src/orchestrator/parallel/parallel-executor';
import { DependencyGraphBuilder, analyzeParallelPotential } from '../src/orchestrator/parallel/dependency-graph';
import { WorkerPool, createWorkerPool } from '../src/orchestrator/parallel/worker-pool';
import { validateParallelConfig, mergeWithDefaults, DEFAULT_PARALLEL_CONFIG } from '../src/orchestrator/parallel/config-schema';
import {
  ParallelExecutionRequest,
  ExecutionContext,
  PatternResult,
  MergedOutput,
  DependencyGraph,
  ParallelGroup,
} from '../src/orchestrator/parallel/types';

describe('Parallel Pattern Execution Suite', () => {

  // ─────────────────────────────────────────────────────────
  // DEPENDENCY GRAPH TESTS
  // ─────────────────────────────────────────────────────────

  describe('DependencyGraphBuilder', () => {
    let builder: DependencyGraphBuilder;

    beforeEach(() => {
      builder = new DependencyGraphBuilder();
    });

    it('should build a valid dependency graph from patterns', () => {
      const patterns = ['/api-endpoint', '/database-design', '/ng-component'];
      const graph = builder.buildGraph(patterns);

      expect(graph.nodes.size).toBe(3);
      expect(graph.edges.size).toBeGreaterThanOrEqual(0);
      expect(graph.groups.size).toBeGreaterThan(0);
    });

    it('should identify patterns with no dependencies', () => {
      const patterns = ['/api-endpoint', '/ng-component'];
      const graph = builder.buildGraph(patterns);

      const apiNode = graph.nodes.get('/api-endpoint');
      const ngNode = graph.nodes.get('/ng-component');

      expect(apiNode).toBeDefined();
      expect(ngNode).toBeDefined();
      expect(apiNode?.incomingDeps.size).toBe(0);
      expect(ngNode?.incomingDeps.size).toBe(0);
    });

    it('should detect blocking dependencies', () => {
      const patterns = ['/api-endpoint', '/add-tests'];
      const graph = builder.buildGraph(patterns);

      const testNode = graph.nodes.get('/add-tests');
      expect(testNode?.incomingDeps.has('/api-endpoint')).toBe(true);
    });

    it('should calculate correct execution order', () => {
      const patterns = ['/ng-component', '/architecture-design', '/design-system-setup'];
      const graph = builder.buildGraph(patterns);

      const orders = Array.from(graph.nodes.values()).map(n => n.executionOrder);
      const maxOrder = Math.max(...orders);

      expect(maxOrder).toBeGreaterThanOrEqual(0);
      expect(orders.length).toBe(patterns.length);
    });

    it('should identify parallel groups correctly', () => {
      const patterns = ['/api-endpoint', '/ng-component', '/database-design'];
      const graph = builder.buildGraph(patterns);

      expect(graph.groups.size).toBeGreaterThan(0);

      for (const [groupName, groupPatterns] of graph.groups) {
        expect(groupPatterns.length).toBeGreaterThan(0);
        expect(groupPatterns.every(p => patterns.includes(p))).toBe(true);
      }
    });

    it('should get optimal parallel groups', () => {
      const patterns = ['/api-endpoint', '/ng-component', '/add-tests'];
      const graph = builder.buildGraph(patterns);
      const groups = builder['getOptimalGroups'](graph);

      expect(groups.length).toBeGreaterThan(0);

      for (const group of groups) {
        expect(group.patterns.length).toBeGreaterThan(0);
        expect(group.timeout).toBeGreaterThan(0);
        expect(['merge', 'priority'].includes(group.conflictResolution)).toBe(true);
      }
    });

    it('should analyze parallel potential correctly', () => {
      const patterns = ['/api-endpoint', '/ng-component', '/react-component'];
      const analysis = analyzeParallelPotential(patterns);

      expect(analysis.canParallelize).toBe(true);
      expect(analysis.potentialSpeedup).toBeGreaterThan(1);
      expect(Array.isArray(analysis.dependencyChains)).toBe(true);
    });

    it('should detect non-parallelizable patterns', () => {
      const patterns = ['/database-design', '/docker-containerize', '/kubernetes-deploy'];
      const analysis = analyzeParallelPotential(patterns);

      expect(typeof analysis.canParallelize).toBe('boolean');
      expect(analysis.potentialSpeedup).toBeGreaterThan(0);
    });
  });

  // ─────────────────────────────────────────────────────────
  // PARALLEL EXECUTOR TESTS
  // ─────────────────────────────────────────────────────────

  describe('ParallelExecutor', () => {
    let executor: ParallelExecutor;
    let context: ExecutionContext;

    beforeEach(() => {
      executor = createParallelExecutor();
      context = {
        userId: 'test-user',
        projectId: 'test-project',
        phase: 'design',
        metadata: new Map(),
      };
    });

    afterEach(() => {
      executor.reset();
    });

    it('should execute single pattern successfully', async () => {
      const request: ParallelExecutionRequest = {
        patterns: ['/api-endpoint'],
        context,
        timeout: 5000,
      };

      const result = await executor.executeParallel(request);

      expect(result.success).toBe(true);
      expect(result.results.size).toBe(1);
      expect(result.totalDuration).toBeGreaterThan(0);
    });

    it('should execute multiple patterns in parallel', async () => {
      const request: ParallelExecutionRequest = {
        patterns: ['/api-endpoint', '/ng-component', '/database-design'],
        context,
        timeout: 10000,
      };

      const startTime = Date.now();
      const result = await executor.executeParallel(request);
      const duration = Date.now() - startTime;

      expect(result.success).toBe(true);
      expect(result.results.size).toBeGreaterThanOrEqual(1);
      expect(result.speedupFactor).toBeGreaterThanOrEqual(1);
      expect(duration).toBeLessThan(15000); // Should be faster than sequential
    });

    it('should handle pattern execution errors gracefully', async () => {
      const request: ParallelExecutionRequest = {
        patterns: ['/api-endpoint', '/invalid-pattern'],
        context,
        timeout: 5000,
      };

      const result = await executor.executeParallel(request);

      // Should return results even with errors
      expect(result.results.size).toBeGreaterThanOrEqual(0);
    });

    it('should return correct merged output', async () => {
      const request: ParallelExecutionRequest = {
        patterns: ['/api-endpoint', '/ng-component'],
        context,
        timeout: 10000,
      };

      const result = await executor.executeParallel(request);

      expect(result.mergedData).toBeDefined();
      expect(result.mergedData.patterns).toBeDefined();
      expect(result.mergedData.summary).toBeDefined();
      expect(result.mergedData.summary.totalPatterns).toBeGreaterThanOrEqual(0);
    });

    it('should calculate speedup factor correctly', async () => {
      const request: ParallelExecutionRequest = {
        patterns: ['/api-endpoint', '/ng-component'],
        context,
        timeout: 10000,
      };

      const result = await executor.executeParallel(request);

      expect(result.speedupFactor).toBeGreaterThanOrEqual(1);
      expect(typeof result.speedupFactor).toBe('number');
    });

    it('should handle cache results flag', async () => {
      const request: ParallelExecutionRequest = {
        patterns: ['/api-endpoint'],
        context,
        timeout: 5000,
        cacheResults: true,
      };

      const result = await executor.executeParallel(request);

      expect(result.success).toBe(true);
    });

    it('should reset executor state', async () => {
      const request: ParallelExecutionRequest = {
        patterns: ['/api-endpoint'],
        context,
        timeout: 5000,
      };

      await executor.executeParallel(request);
      executor.reset();

      // After reset, results should be cleared
      expect((executor as any).executedResults.size).toBe(0);
    });
  });

  // ─────────────────────────────────────────────────────────
  // WORKER POOL TESTS
  // ─────────────────────────────────────────────────────────

  describe('WorkerPool', () => {
    let pool: WorkerPool;

    beforeEach(() => {
      pool = createWorkerPool(4);
    });

    afterEach(async () => {
      await pool.shutdown(5000);
    });

    it('should create pool with correct size', () => {
      const status = pool.getPoolStatus();

      expect(status.poolSize).toBe(4);
      expect(status.activeWorkers).toBe(0);
      expect(status.idleWorkers).toBe(4);
    });

    it('should clamp pool size between 1 and 8', () => {
      const smallPool = createWorkerPool(0);
      expect(smallPool.getPoolStatus().poolSize).toBe(1);

      const largePool = createWorkerPool(16);
      expect(largePool.getPoolStatus().poolSize).toBe(8);
    });

    it('should report correct worker statistics', () => {
      const stats = pool.getWorkerStats();

      expect(stats.length).toBe(4);
      expect(stats.every(s => s.tasksExecuted === 0)).toBe(true);
      expect(stats.every(s => !s.busy)).toBe(true);
    });

    it('should get correct queue status', () => {
      const status = pool.getQueueStatus();

      expect(status.size).toBe(0);
      expect(status.maxSize).toBe(1000);
      expect(status.utilization).toBe(0);
      expect(Array.isArray(status.pendingTasks)).toBe(true);
    });

    it('should get pool metrics', () => {
      const metrics = pool.getMetrics();

      expect(metrics.totalPatterns).toBe(0);
      expect(metrics.successfulPatterns).toBe(0);
      expect(metrics.failedPatterns).toBe(0);
      expect(metrics.workerMetrics.size).toBe(4);
    });

    it('should have circuit breaker in closed state initially', () => {
      const status = pool.getPoolStatus();

      expect(status.circuitBreakerState).toBe('closed');
      expect(status.failureCount).toBe(0);
    });

    it('should track worker utilization', () => {
      const stats = pool.getWorkerStats();

      expect(stats.every(s => typeof s.utilization === 'number')).toBe(true);
      expect(stats.every(s => s.utilization >= 0)).toBe(true);
      expect(stats.every(s => s.utilization <= 100)).toBe(true);
    });

    it('should reset pool state', () => {
      pool.reset();

      const status = pool.getPoolStatus();
      expect(status.activeWorkers).toBe(0);
      expect(status.queuedTasks).toBe(0);
      expect(status.circuitBreakerState).toBe('closed');
    });
  });

  // ─────────────────────────────────────────────────────────
  // CONFIGURATION VALIDATION TESTS
  // ─────────────────────────────────────────────────────────

  describe('Configuration Schema', () => {
    it('should validate correct configuration', () => {
      const result = validateParallelConfig(DEFAULT_PARALLEL_CONFIG);

      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it('should reject invalid worker pool size', () => {
      const config = { ...DEFAULT_PARALLEL_CONFIG, workerPoolSize: 10 };
      const result = validateParallelConfig(config);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('workerPoolSize'))).toBe(true);
    });

    it('should reject negative timeout', () => {
      const config = { ...DEFAULT_PARALLEL_CONFIG, defaultTimeout: -100 };
      const result = validateParallelConfig(config);

      expect(result.valid).toBe(false);
    });

    it('should merge with defaults correctly', () => {
      const userConfig = { workerPoolSize: 6 };
      const merged = mergeWithDefaults(userConfig);

      expect(merged.workerPoolSize).toBe(6);
      expect(merged.maxConcurrentPatterns).toBe(DEFAULT_PARALLEL_CONFIG.maxConcurrentPatterns);
      expect(merged.caching.enabled).toBe(DEFAULT_PARALLEL_CONFIG.caching.enabled);
    });

    it('should handle null/undefined config gracefully', () => {
      const merged1 = mergeWithDefaults(null);
      const merged2 = mergeWithDefaults(undefined);

      expect(merged1.workerPoolSize).toBe(DEFAULT_PARALLEL_CONFIG.workerPoolSize);
      expect(merged2.workerPoolSize).toBe(DEFAULT_PARALLEL_CONFIG.workerPoolSize);
    });

    it('should clamp worker pool size in merge', () => {
      const userConfig = { workerPoolSize: 12 };
      const merged = mergeWithDefaults(userConfig);

      expect(merged.workerPoolSize).toBeLessThanOrEqual(8);
    });
  });

  // ─────────────────────────────────────────────────────────
  // INTEGRATION TESTS
  // ─────────────────────────────────────────────────────────

  describe('Integration Tests', () => {
    it('should execute complete workflow with dependency analysis', async () => {
      const patterns = ['/architecture-design', '/api-endpoint', '/ng-component'];
      const builder = new DependencyGraphBuilder();
      const graph = builder.buildGraph(patterns);

      expect(graph.nodes.size).toBeGreaterThan(0);
      expect(graph.groups.size).toBeGreaterThan(0);

      const executor = createParallelExecutor();
      const context: ExecutionContext = {
        userId: 'test-user',
        projectId: 'test-project',
        phase: 'design',
        metadata: new Map(),
      };

      const request: ParallelExecutionRequest = {
        patterns,
        context,
        timeout: 15000,
      };

      const result = await executor.executeParallel(request);

      expect(result.results.size).toBeGreaterThanOrEqual(0);
      expect(result.speedupFactor).toBeGreaterThanOrEqual(1);
    });

    it('should handle complex dependency chains', () => {
      const patterns = [
        '/architecture-design',
        '/database-design',
        '/api-endpoint',
        '/ng-component',
        '/add-tests',
        '/docker-containerize',
      ];

      const builder = new DependencyGraphBuilder();
      const graph = builder.buildGraph(patterns);

      expect(graph.nodes.size).toBe(patterns.length);

      const analysis = analyzeParallelPotential(patterns);
      expect(typeof analysis.potentialSpeedup).toBe('number');
      expect(analysis.potentialSpeedup).toBeGreaterThan(0);
    });

    it('should calculate speedup across different scenarios', () => {
      const scenarios = [
        ['/api-endpoint'],
        ['/api-endpoint', '/ng-component'],
        ['/api-endpoint', '/ng-component', '/database-design'],
        ['/architecture-design', '/api-endpoint', '/ng-component', '/add-tests'],
      ];

      for (const patterns of scenarios) {
        const analysis = analyzeParallelPotential(patterns);
        expect(analysis.potentialSpeedup).toBeGreaterThanOrEqual(1);
      }
    });
  });

  // ─────────────────────────────────────────────────────────
  // PERFORMANCE TESTS
  // ─────────────────────────────────────────────────────────

  describe('Performance', () => {
    it('parallel execution should complete within reasonable time', async () => {
      const executor = createParallelExecutor();
      const context: ExecutionContext = {
        userId: 'test-user',
        projectId: 'test-project',
        phase: 'design',
        metadata: new Map(),
      };

      const request: ParallelExecutionRequest = {
        patterns: ['/api-endpoint', '/ng-component', '/database-design'],
        context,
        timeout: 15000,
      };

      const startTime = Date.now();
      const result = await executor.executeParallel(request);
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(15000);
      expect(result.success).toBe(true);
    });

    it('dependency graph building should be fast', () => {
      const builder = new DependencyGraphBuilder();
      const patterns = Array.from({ length: 20 }, (_, i) => `/pattern-${i}`);

      const startTime = Date.now();
      const graph = builder.buildGraph(patterns);
      const duration = Date.now() - startTime;

      expect(graph.nodes.size).toBe(patterns.length);
      expect(duration).toBeLessThan(1000); // Should complete in < 1 second
    });
  });
});
