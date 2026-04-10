/**
 * Unit Tests for Batch Requirement Processing (v3.9.0 Phase 2)
 * Tests batch processing, phase execution, and parallel processing of multiple requirements
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { BatchProcessor, createBatchProcessor, BATCH_PHASES } from '../src/orchestrator/parallel/batch-processor';
import {
  BatchExecutor,
  createBatchExecutor,
  parseRequirementsFromInput,
  type BatchProgress,
} from '../src/orchestrator/parallel/batch-executor';
import { BatchRequest, Requirement, ExecutionContext } from '../src/orchestrator/parallel/types';

describe('Batch Requirement Processing Suite', () => {

  // ─────────────────────────────────────────────────────────
  // BATCH PROCESSOR TESTS
  // ─────────────────────────────────────────────────────────

  describe('BatchProcessor', () => {
    let processor: BatchProcessor;
    let context: ExecutionContext;

    beforeEach(() => {
      processor = createBatchProcessor();
      context = {
        userId: 'test-user',
        projectId: 'test-project',
        phase: 'batch',
        metadata: new Map(),
      };
    });

    afterEach(() => {
      processor.reset();
    });

    it('should process single requirement through all phases', async () => {
      const request: BatchRequest = {
        requirements: [
          {
            id: 'REQ-1',
            name: 'User Authentication',
            description: 'Implement JWT-based user authentication',
            priority: 1,
          },
        ],
        parallelPhases: true,
        timeout: 3600,
      };

      const result = await processor.processBatch(request);

      expect(result.success).toBe(true);
      expect(result.requirements.size).toBeGreaterThan(0);
      expect(result.totalDuration).toBeGreaterThan(0);
      expect(result.speedupFactor).toBeGreaterThanOrEqual(1);
    });

    it('should process multiple requirements in parallel', async () => {
      const request: BatchRequest = {
        requirements: [
          {
            id: 'REQ-1',
            name: 'User Authentication',
            description: 'Implement JWT-based user authentication',
            priority: 1,
          },
          {
            id: 'REQ-2',
            name: 'Order Management',
            description: 'Build order creation and tracking system',
            priority: 2,
          },
          {
            id: 'REQ-3',
            name: 'Analytics Dashboard',
            description: 'Create analytics and reporting dashboard',
            priority: 3,
          },
        ],
        parallelPhases: true,
        timeout: 3600,
      };

      const result = await processor.processBatch(request);

      expect(result.success).toBe(true);
      expect(result.requirements.size).toBe(3);
    });

    it('should process all batch phases', async () => {
      const phasesCalled: string[] = [];

      const request: BatchRequest = {
        requirements: [
          {
            id: 'REQ-1',
            name: 'Feature X',
            description: 'Test feature',
            priority: 1,
          },
        ],
        parallelPhases: true,
        timeout: 3600,
        onPhaseComplete: (phase: string, results) => {
          phasesCalled.push(phase);
        },
      };

      await processor.processBatch(request);

      // Should execute 6 phases
      expect(phasesCalled.length).toBe(6);
      expect(phasesCalled).toEqual(['design', 'plan', 'assess', 'review', 'execute', 'validate']);
    });

    it('should handle empty requirements gracefully', async () => {
      const request: BatchRequest = {
        requirements: [],
        parallelPhases: true,
        timeout: 3600,
      };

      const result = await processor.processBatch(request);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should collect requirement results correctly', async () => {
      const request: BatchRequest = {
        requirements: [
          {
            id: 'REQ-1',
            name: 'Auth System',
            description: 'User authentication',
            priority: 1,
          },
          {
            id: 'REQ-2',
            name: 'API Gateway',
            description: 'API routing',
            priority: 2,
          },
        ],
        parallelPhases: true,
        timeout: 3600,
      };

      const result = await processor.processBatch(request);

      for (const [reqId, reqResult] of result.requirements) {
        expect(reqResult.requirementId).toBe(reqId);
        expect(reqResult.phases.size).toBeGreaterThan(0);
        expect(reqResult.status).toMatch(/completed|failed/);
      }
    });

    it('should generate summary correctly', async () => {
      const request: BatchRequest = {
        requirements: [
          {
            id: 'REQ-1',
            name: 'Test',
            description: 'Test',
            priority: 1,
          },
        ],
        parallelPhases: true,
        timeout: 3600,
      };

      const result = await processor.processBatch(request);
      const summary = processor.getSummary(result);

      expect(summary).toContain('BATCH PROCESSING SUMMARY');
      expect(summary).toContain('Requirements Processed');
      expect(summary).toContain('Speedup Factor');
      expect(summary).toContain('Design → Plan → Assess');
    });
  });

  // ─────────────────────────────────────────────────────────
  // BATCH EXECUTOR TESTS
  // ─────────────────────────────────────────────────────────

  describe('BatchExecutor', () => {
    let executor: BatchExecutor;
    let context: ExecutionContext;

    beforeEach(() => {
      executor = createBatchExecutor();
      context = {
        userId: 'test-user',
        projectId: 'test-project',
        phase: 'batch',
        metadata: new Map(),
      };
    });

    afterEach(() => {
      executor.reset();
    });

    it('should execute batch with progress tracking', async () => {
      const requirements: Requirement[] = [
        {
          id: 'REQ-1',
          name: 'Feature 1',
          description: 'First feature',
          priority: 1,
        },
      ];

      let progressCalled = false;
      let phasesCalled = 0;

      const result = await executor.executeBatch(requirements, context, {
        parallelPhases: true,
        progressCallback: (progress: BatchProgress) => {
          progressCalled = true;
          expect(progress.phase).toBeDefined();
          expect(progress.total).toBe(requirements.length);
        },
        phaseCallback: (phase: string, completed: number, total: number) => {
          phasesCalled++;
          expect(completed).toBeGreaterThanOrEqual(0);
          expect(total).toBe(requirements.length);
        },
      });

      expect(result.success).toBe(true);
      expect(progressCalled).toBe(true);
      expect(phasesCalled).toBeGreaterThan(0);
    });

    it('should generate batch report', async () => {
      const requirements: Requirement[] = [
        {
          id: 'REQ-1',
          name: 'Feature 1',
          description: 'First feature',
          priority: 1,
        },
        {
          id: 'REQ-2',
          name: 'Feature 2',
          description: 'Second feature',
          priority: 2,
        },
      ];

      const result = await executor.executeBatch(requirements, context, {
        parallelPhases: true,
      });

      const stats = executor.getStats();
      const report = executor.generateReport(result, stats as any);

      expect(report).toContain('BATCH REQUIREMENT PROCESSING REPORT');
      expect(report).toContain('Total Requirements');
      expect(report).toContain('Speedup Factor');
      expect(report).toContain('PHASE BREAKDOWN');
    });

    it('should throw error for empty requirements', async () => {
      try {
        await executor.executeBatch([], context);
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect((error as Error).message).toContain('No requirements provided');
      }
    });

    it('should accumulate stats correctly', async () => {
      const requirements: Requirement[] = [
        {
          id: 'REQ-1',
          name: 'Feature 1',
          description: 'First feature',
          priority: 1,
        },
      ];

      await executor.executeBatch(requirements, context);
      const stats = executor.getStats();

      expect(stats.totalRequirements).toBe(1);
      expect(stats.totalDuration).toBeGreaterThan(0);
      expect(stats.speedupFactor).toBeGreaterThanOrEqual(1);
      expect(stats.completedRequirements).toBeGreaterThanOrEqual(0);
    });
  });

  // ─────────────────────────────────────────────────────────
  // BATCH PHASES TESTS
  // ─────────────────────────────────────────────────────────

  describe('Batch Phases', () => {
    it('should define all 6 phases', () => {
      const phases = Object.keys(BATCH_PHASES);

      expect(phases.length).toBe(6);
      expect(phases).toContain('design');
      expect(phases).toContain('plan');
      expect(phases).toContain('assess');
      expect(phases).toContain('review');
      expect(phases).toContain('execute');
      expect(phases).toContain('validate');
    });

    it('should have valid phase configurations', () => {
      for (const [phaseKey, phase] of Object.entries(BATCH_PHASES)) {
        expect(phase.name).toBeDefined();
        expect(phase.name.length).toBeGreaterThan(0);
        expect(Array.isArray(phase.patterns)).toBe(true);
        expect(phase.patterns.length).toBeGreaterThan(0);
        expect(phase.timeout).toBeGreaterThan(0);
        expect(phase.description).toBeDefined();
      }
    });

    it('should have patterns for each phase', () => {
      // Design phase: specs and architecture
      expect(BATCH_PHASES.design.patterns).toContain('/requirements-to-specs');
      expect(BATCH_PHASES.design.patterns).toContain('/architecture-design');

      // Plan phase: test design
      expect(BATCH_PHASES.plan.patterns).toContain('/acceptance-criteria');

      // Execute phase: code generation
      expect(BATCH_PHASES.execute.patterns).toContain('/api-endpoint');
      expect(BATCH_PHASES.execute.patterns).toContain('/database-design');

      // Validate phase: testing and security
      expect(BATCH_PHASES.validate.patterns).toContain('/add-tests');
      expect(BATCH_PHASES.validate.patterns).toContain('/security-scan');
    });
  });

  // ─────────────────────────────────────────────────────────
  // REQUIREMENT PARSING TESTS
  // ─────────────────────────────────────────────────────────

  describe('Requirement Parsing', () => {
    it('should parse JSON array format', () => {
      const input = JSON.stringify([
        { id: 'REQ-1', name: 'Auth', description: 'User authentication', priority: 1 },
        { id: 'REQ-2', name: 'Orders', description: 'Order management', priority: 2 },
      ]);

      const requirements = parseRequirementsFromInput(input);

      expect(requirements.length).toBe(2);
      expect(requirements[0].id).toBe('REQ-1');
      expect(requirements[1].name).toBe('Orders');
    });

    it('should parse numbered list format', () => {
      const input = `
1. User authentication system
2. Order management module
3. Analytics dashboard
      `;

      const requirements = parseRequirementsFromInput(input);

      expect(requirements.length).toBe(3);
      expect(requirements[0].name).toContain('User authentication');
      expect(requirements[2].name).toContain('Analytics');
    });

    it('should parse comma-separated format', () => {
      const input = 'Auth System, API Gateway, Database Design';

      const requirements = parseRequirementsFromInput(input);

      expect(requirements.length).toBe(3);
      expect(requirements[0].name).toBe('Auth System');
      expect(requirements[1].name).toBe('API Gateway');
    });

    it('should treat plain text as single requirement', () => {
      const input = 'Build a complete user authentication system with JWT tokens';

      const requirements = parseRequirementsFromInput(input);

      expect(requirements.length).toBe(1);
      expect(requirements[0].description).toContain('JWT');
    });

    it('should generate requirement IDs', () => {
      const input = '1. Feature A\n2. Feature B';

      const requirements = parseRequirementsFromInput(input);

      expect(requirements[0].id).toBe('REQ-1');
      expect(requirements[1].id).toBe('REQ-2');
    });
  });

  // ─────────────────────────────────────────────────────────
  // INTEGRATION TESTS
  // ─────────────────────────────────────────────────────────

  describe('Batch Processing Integration', () => {
    it('should process complex multi-requirement batch', async () => {
      const executor = createBatchExecutor();
      const context: ExecutionContext = {
        userId: 'test-user',
        projectId: 'test-project',
        phase: 'batch',
        metadata: new Map(),
      };

      const requirements: Requirement[] = [
        {
          id: 'REQ-1',
          name: 'User Management',
          description: 'User registration, login, profile management',
          priority: 1,
          estimatedEffort: 40,
        },
        {
          id: 'REQ-2',
          name: 'Product Catalog',
          description: 'Display products, search, filtering',
          priority: 1,
          estimatedEffort: 30,
        },
        {
          id: 'REQ-3',
          name: 'Shopping Cart',
          description: 'Add to cart, update quantities, checkout',
          priority: 2,
          estimatedEffort: 25,
        },
      ];

      const result = await executor.executeBatch(requirements, context, {
        parallelPhases: true,
      });

      expect(result.success).toBe(true);
      expect(result.requirements.size).toBe(3);
      expect(result.speedupFactor).toBeGreaterThan(1);
      expect(result.totalDuration).toBeLessThan(3 * 6 * 5 * 60 * 1000); // Less than sequential
    });

    it('should handle all phases for batch of requirements', async () => {
      const processor = createBatchProcessor();
      const context: ExecutionContext = {
        userId: 'test-user',
        projectId: 'test-project',
        phase: 'batch',
        metadata: new Map(),
      };

      const phasesExecuted: string[] = [];

      const request: BatchRequest = {
        requirements: [
          { id: 'REQ-1', name: 'Feature A', description: 'Description A', priority: 1 },
          { id: 'REQ-2', name: 'Feature B', description: 'Description B', priority: 2 },
        ],
        parallelPhases: true,
        timeout: 3600,
        onPhaseComplete: (phase: string) => {
          phasesExecuted.push(phase);
        },
      };

      const result = await processor.processBatch(request);

      // All 6 phases should execute
      expect(phasesExecuted).toEqual(['design', 'plan', 'assess', 'review', 'execute', 'validate']);

      // Both requirements should complete
      expect(result.requirements.size).toBe(2);
    });
  });

  // ─────────────────────────────────────────────────────────
  // PERFORMANCE TESTS
  // ─────────────────────────────────────────────────────────

  describe('Batch Processing Performance', () => {
    it('should achieve speedup with parallel execution', async () => {
      const executor = createBatchExecutor();
      const context: ExecutionContext = {
        userId: 'test-user',
        projectId: 'test-project',
        phase: 'batch',
        metadata: new Map(),
      };

      const requirements: Requirement[] = [
        { id: 'REQ-1', name: 'Feature 1', description: 'Description 1', priority: 1 },
        { id: 'REQ-2', name: 'Feature 2', description: 'Description 2', priority: 2 },
        { id: 'REQ-3', name: 'Feature 3', description: 'Description 3', priority: 3 },
      ];

      const startTime = Date.now();
      const result = await executor.executeBatch(requirements, context, {
        parallelPhases: true,
      });
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(3 * 6 * 5 * 60 * 1000); // Less than sequential baseline
      expect(result.speedupFactor).toBeGreaterThan(1.5);
    });

    it('should process multiple requirements faster than sequential', async () => {
      const processor = createBatchProcessor();
      const context: ExecutionContext = {
        userId: 'test-user',
        projectId: 'test-project',
        phase: 'batch',
        metadata: new Map(),
      };

      const requirements: Requirement[] = Array.from({ length: 5 }, (_, i) => ({
        id: `REQ-${i + 1}`,
        name: `Feature ${i + 1}`,
        description: `Description ${i + 1}`,
        priority: 1,
      }));

      const request: BatchRequest = {
        requirements,
        parallelPhases: true,
        timeout: 3600,
      };

      const startTime = Date.now();
      const result = await processor.processBatch(request);
      const duration = Date.now() - startTime;

      expect(result.speedupFactor).toBeGreaterThan(2);
      expect(duration).toBeLessThan(5 * 6 * 5 * 60 * 1000); // Sequential baseline
    });
  });
});
