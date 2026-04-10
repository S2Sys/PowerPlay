/**
 * Cache Invalidation Manager — Smart cache invalidation with event triggers
 * Prevents stale results while minimizing unnecessary cache clears
 */

import { CacheStore } from './cache-store';

/**
 * Invalidation event types and affected patterns
 */
export const INVALIDATION_EVENTS = {
  'requirement-change': {
    description: 'Requirement content changed',
    affectedPhases: ['design', 'plan', 'execute'],
    affectedPatterns: [
      '/requirements-to-specs',
      '/architecture-design',
      '/acceptance-criteria',
      '/test-case-design',
      '/api-endpoint',
      '/database-design',
      '/ng-component',
      '/react-component',
    ],
  },
  'architecture-change': {
    description: 'Architecture or design changed',
    affectedPhases: ['design', 'assess', 'review', 'execute'],
    affectedPatterns: [
      '/architecture-design',
      '/risk-assessment',
      '/compliance-audit',
      '/requirements-review',
      '/api-endpoint',
      '/database-design',
    ],
  },
  'config-change': {
    description: 'System configuration changed',
    affectedPhases: ['*'], // All phases
    affectedPatterns: ['*'], // All patterns
  },
  'dependency-update': {
    description: 'Dependencies or libraries updated',
    affectedPhases: ['execute', 'validate'],
    affectedPatterns: [
      '/api-endpoint',
      '/ng-component',
      '/react-component',
      '/database-design',
      '/add-tests',
      '/security-scan',
    ],
  },
  'performance-change': {
    description: 'Performance characteristics changed',
    affectedPhases: ['validate'],
    affectedPatterns: ['/performance-check', '/optimize-sql'],
  },
  'security-update': {
    description: 'Security rules or policies updated',
    affectedPhases: ['design', 'validate'],
    affectedPatterns: ['/security-scan', '/threat-modeling', '/compliance-audit'],
  },
};

export type InvalidationEventType = keyof typeof INVALIDATION_EVENTS;

/**
 * Cache invalidation event
 */
export interface InvalidationEvent {
  type: InvalidationEventType;
  timestamp: number;
  metadata: {
    requirementId?: string;
    projectId?: string;
    phase?: string;
    pattern?: string;
    reason?: string;
  };
}

/**
 * Invalidation strategy
 */
export interface InvalidationStrategy {
  cascading: boolean; // Invalidate dependent patterns
  aggressive: boolean; // Clear more than strictly necessary
  selective: boolean; // Only clear affected patterns
}

/**
 * Cache invalidation manager
 */
export class CacheInvalidationManager {
  private cache: CacheStore;
  private invalidationHistory: InvalidationEvent[] = [];
  private maxHistorySize: number = 1000;
  private strategy: InvalidationStrategy;

  constructor(
    cache: CacheStore,
    strategy: InvalidationStrategy = {
      cascading: true,
      aggressive: false,
      selective: true,
    }
  ) {
    this.cache = cache;
    this.strategy = strategy;
  }

  /**
   * Handle requirement change event
   */
  async onRequirementChange(requirementId: string, reason?: string): Promise<void> {
    const event: InvalidationEvent = {
      type: 'requirement-change',
      timestamp: Date.now(),
      metadata: { requirementId, reason },
    };

    await this.processInvalidation(event);
  }

  /**
   * Handle architecture change event
   */
  async onArchitectureChange(projectId: string, reason?: string): Promise<void> {
    const event: InvalidationEvent = {
      type: 'architecture-change',
      timestamp: Date.now(),
      metadata: { projectId, reason },
    };

    await this.processInvalidation(event);
  }

  /**
   * Handle config change event
   */
  async onConfigChange(reason?: string): Promise<void> {
    const event: InvalidationEvent = {
      type: 'config-change',
      timestamp: Date.now(),
      metadata: { reason },
    };

    await this.processInvalidation(event);
  }

  /**
   * Handle dependency update event
   */
  async onDependencyUpdate(projectId: string, reason?: string): Promise<void> {
    const event: InvalidationEvent = {
      type: 'dependency-update',
      timestamp: Date.now(),
      metadata: { projectId, reason },
    };

    await this.processInvalidation(event);
  }

  /**
   * Handle performance change event
   */
  async onPerformanceChange(reason?: string): Promise<void> {
    const event: InvalidationEvent = {
      type: 'performance-change',
      timestamp: Date.now(),
      metadata: { reason },
    };

    await this.processInvalidation(event);
  }

  /**
   * Handle security update event
   */
  async onSecurityUpdate(reason?: string): Promise<void> {
    const event: InvalidationEvent = {
      type: 'security-update',
      timestamp: Date.now(),
      metadata: { reason },
    };

    await this.processInvalidation(event);
  }

  /**
   * Invalidate specific pattern
   */
  async invalidatePattern(pattern: string): Promise<void> {
    const entries = this.cache.getEntries();
    let count = 0;

    for (const [key] of entries) {
      if (key.includes(pattern)) {
        await this.cache.delete(key);
        count++;
      }
    }

    console.log(`Invalidated ${count} cache entries for pattern: ${pattern}`);
  }

  /**
   * Invalidate specific requirement
   */
  async invalidateRequirement(requirementId: string): Promise<void> {
    await this.cache.deleteRequirement(requirementId);
    console.log(`Invalidated cache for requirement: ${requirementId}`);
  }

  /**
   * Invalidate specific phase
   */
  async invalidatePhase(phase: string): Promise<void> {
    await this.cache.deletePhase(phase);
    console.log(`Invalidated cache for phase: ${phase}`);
  }

  /**
   * Invalidate by event type
   */
  async invalidateByEvent(type: InvalidationEventType, metadata: any = {}): Promise<void> {
    const event: InvalidationEvent = {
      type,
      timestamp: Date.now(),
      metadata,
    };

    await this.processInvalidation(event);
  }

  /**
   * Process invalidation event
   */
  private async processInvalidation(event: InvalidationEvent): Promise<void> {
    // Record event in history
    this.recordEvent(event);

    const eventConfig = INVALIDATION_EVENTS[event.type];

    if (!eventConfig) {
      console.warn(`Unknown invalidation event type: ${event.type}`);
      return;
    }

    // Determine what to invalidate
    if (this.strategy.aggressive) {
      // Aggressive: clear entire cache
      await this.cache.clear();
      console.log(`[AGGRESSIVE] Cleared entire cache due to: ${event.type}`);
      return;
    }

    if (this.strategy.selective) {
      // Selective: only clear affected patterns
      if (eventConfig.affectedPatterns.includes('*')) {
        await this.cache.clear();
        console.log(`[SELECTIVE] Cleared entire cache (all patterns affected): ${event.type}`);
      } else {
        let count = 0;
        for (const pattern of eventConfig.affectedPatterns) {
          const oldMetrics = this.cache.getMetrics();
          await this.invalidatePattern(pattern);
          count++;
        }
        console.log(`[SELECTIVE] Invalidated ${count} patterns: ${event.type}`);
      }

      // Invalidate requirement-specific cache if applicable
      if (event.metadata.requirementId) {
        await this.invalidateRequirement(event.metadata.requirementId);
      }

      return;
    }

    // Cascading: invalidate affected phases and patterns
    if (this.strategy.cascading) {
      for (const phase of eventConfig.affectedPhases) {
        if (phase !== '*') {
          await this.invalidatePhase(phase);
        }
      }

      for (const pattern of eventConfig.affectedPatterns) {
        if (pattern !== '*') {
          await this.invalidatePattern(pattern);
        }
      }

      console.log(
        `[CASCADING] Invalidated phases [${eventConfig.affectedPhases.join(', ')}] and patterns [${eventConfig.affectedPatterns.join(', ')}]: ${event.type}`
      );
    }
  }

  /**
   * Record invalidation event in history
   */
  private recordEvent(event: InvalidationEvent): void {
    this.invalidationHistory.push(event);

    // Trim history if too large
    if (this.invalidationHistory.length > this.maxHistorySize) {
      this.invalidationHistory = this.invalidationHistory.slice(-this.maxHistorySize);
    }
  }

  /**
   * Get invalidation history
   */
  getHistory(timeWindow: number = 3600000): InvalidationEvent[] {
    // Return events from last timeWindow milliseconds
    const cutoff = Date.now() - timeWindow;
    return this.invalidationHistory.filter(event => event.timestamp > cutoff);
  }

  /**
   * Get invalidation statistics
   */
  getStats(): {
    totalInvalidations: number;
    eventTypeCounts: Map<InvalidationEventType, number>;
    lastInvalidation: InvalidationEvent | null;
    invalidationRate: number; // per minute
  } {
    const eventTypeCounts = new Map<InvalidationEventType, number>();

    for (const event of this.invalidationHistory) {
      const count = eventTypeCounts.get(event.type) || 0;
      eventTypeCounts.set(event.type, count + 1);
    }

    const lastInvalidation = this.invalidationHistory[this.invalidationHistory.length - 1] || null;
    const recentEvents = this.getHistory(60000); // Last minute
    const invalidationRate = recentEvents.length;

    return {
      totalInvalidations: this.invalidationHistory.length,
      eventTypeCounts,
      lastInvalidation,
      invalidationRate,
    };
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this.invalidationHistory = [];
  }

  /**
   * Set invalidation strategy
   */
  setStrategy(strategy: InvalidationStrategy): void {
    this.strategy = strategy;
  }
}

/**
 * Factory function to create invalidation manager
 */
export function createInvalidationManager(
  cache: CacheStore,
  strategy?: InvalidationStrategy
): CacheInvalidationManager {
  return new CacheInvalidationManager(cache, strategy);
}
