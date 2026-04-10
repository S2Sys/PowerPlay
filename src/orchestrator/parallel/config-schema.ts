/**
 * Parallel Processing Configuration Schema & Validation
 * Validates parallel configuration against expected types and constraints
 */

import { ParallelConfig, ParallelGroup, LoadBalancingConfig, CircuitBreakerConfig, CacheConfig } from './types';

/**
 * Default parallel processing configuration
 */
export const DEFAULT_PARALLEL_CONFIG: ParallelConfig = {
  enabled: true,
  workerPoolSize: 4,
  maxConcurrentPatterns: 3,
  defaultTimeout: 600,
  parallelGroups: new Map([
    [
      'codeGeneration',
      {
        name: 'Code Generation Phase',
        patterns: ['/api-endpoint', '/ng-component', '/react-component'],
        timeout: 600,
        conflictResolution: 'merge',
        dependencies: [],
        priority: 1,
      },
    ],
    [
      'architecture',
      {
        name: 'Architecture & Design Phase',
        patterns: ['/architecture-design', '/database-design', '/design-system-setup'],
        timeout: 300,
        conflictResolution: 'merge',
        dependencies: [],
        priority: 1,
      },
    ],
    [
      'testing',
      {
        name: 'Testing Phase',
        patterns: ['/add-tests', '/visual-regression-testing', '/api-contract-testing'],
        timeout: 300,
        conflictResolution: 'merge',
        dependencies: ['codeGeneration', 'architecture'],
        priority: 2,
      },
    ],
    [
      'deployment',
      {
        name: 'Deployment & Infrastructure',
        patterns: ['/docker-containerize', '/kubernetes-deploy', '/iac-generate'],
        timeout: 300,
        conflictResolution: 'merge',
        dependencies: ['codeGeneration'],
        priority: 3,
      },
    ],
    [
      'security',
      {
        name: 'Security & Compliance',
        patterns: ['/threat-modeling', '/cloud-security-posture', '/dependency-scanning-continuous'],
        timeout: 300,
        conflictResolution: 'merge',
        dependencies: ['architecture'],
        priority: 2,
      },
    ],
  ]),
  caching: {
    enabled: true,
    ttl: 3600,
    strategy: 'lru',
    maxSize: 1000,
    invalidateOn: ['architecture-change', 'requirement-update', 'config-change'],
  },
  loadBalancing: {
    strategy: 'least-busy',
    retryPolicy: 'exponential-backoff',
    maxRetries: 3,
    circuitBreaker: {
      enabled: true,
      failureThreshold: 5,
      resetTimeout: 30,
      monitorInterval: 10,
    },
  },
};

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate parallel processing configuration
 */
export function validateParallelConfig(config: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!config) {
    return {
      valid: false,
      errors: ['Parallel configuration is required'],
      warnings: [],
    };
  }

  // Validate enabled flag
  if (typeof config.enabled !== 'boolean') {
    errors.push('enabled must be a boolean');
  }

  // Validate worker pool size
  if (typeof config.workerPoolSize !== 'number') {
    errors.push('workerPoolSize must be a number');
  } else if (config.workerPoolSize < 1 || config.workerPoolSize > 8) {
    errors.push('workerPoolSize must be between 1 and 8');
  }

  // Validate max concurrent patterns
  if (typeof config.maxConcurrentPatterns !== 'number') {
    errors.push('maxConcurrentPatterns must be a number');
  } else if (config.maxConcurrentPatterns < 1) {
    errors.push('maxConcurrentPatterns must be at least 1');
  }

  // Validate default timeout
  if (typeof config.defaultTimeout !== 'number') {
    errors.push('defaultTimeout must be a number');
  } else if (config.defaultTimeout < 100) {
    warnings.push('defaultTimeout is very low (< 100s), may cause premature timeouts');
  }

  // Validate parallel groups
  if (config.parallelGroups) {
    if (!(config.parallelGroups instanceof Map) && typeof config.parallelGroups !== 'object') {
      errors.push('parallelGroups must be a Map or object');
    } else {
      const groups = config.parallelGroups instanceof Map ? config.parallelGroups : new Map(Object.entries(config.parallelGroups));
      for (const [groupName, group] of groups) {
        const groupErrors = validateParallelGroup(group, groupName);
        errors.push(...groupErrors);
      }
    }
  }

  // Validate caching config
  if (config.caching) {
    const cacheErrors = validateCacheConfig(config.caching);
    errors.push(...cacheErrors);
  }

  // Validate load balancing config
  if (config.loadBalancing) {
    const lbErrors = validateLoadBalancingConfig(config.loadBalancing);
    errors.push(...lbErrors);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate a parallel group
 */
function validateParallelGroup(group: any, groupName: string): string[] {
  const errors: string[] = [];

  if (!group) {
    errors.push(`Parallel group "${groupName}" is required`);
    return errors;
  }

  if (!group.name || typeof group.name !== 'string') {
    errors.push(`Parallel group "${groupName}" must have a name string`);
  }

  if (!Array.isArray(group.patterns)) {
    errors.push(`Parallel group "${groupName}" patterns must be an array`);
  } else if (group.patterns.length === 0) {
    errors.push(`Parallel group "${groupName}" must have at least one pattern`);
  } else {
    for (const pattern of group.patterns) {
      if (typeof pattern !== 'string') {
        errors.push(`Parallel group "${groupName}" contains non-string pattern: ${pattern}`);
      }
    }
  }

  if (typeof group.timeout !== 'number') {
    errors.push(`Parallel group "${groupName}" timeout must be a number`);
  } else if (group.timeout < 100) {
    errors.push(`Parallel group "${groupName}" timeout is too low (< 100s)`);
  }

  if (!['merge', 'priority'].includes(group.conflictResolution)) {
    errors.push(`Parallel group "${groupName}" conflictResolution must be "merge" or "priority"`);
  }

  if (!Array.isArray(group.dependencies)) {
    errors.push(`Parallel group "${groupName}" dependencies must be an array`);
  }

  if (typeof group.priority !== 'number' || group.priority < 1 || group.priority > 10) {
    errors.push(`Parallel group "${groupName}" priority must be a number between 1-10`);
  }

  return errors;
}

/**
 * Validate cache configuration
 */
function validateCacheConfig(cache: any): string[] {
  const errors: string[] = [];

  if (typeof cache.enabled !== 'boolean') {
    errors.push('Cache enabled must be a boolean');
  }

  if (typeof cache.ttl !== 'number' || cache.ttl < 60) {
    errors.push('Cache TTL must be a number >= 60 seconds');
  }

  if (!['lru', 'lfu', 'fifo'].includes(cache.strategy)) {
    errors.push('Cache strategy must be "lru", "lfu", or "fifo"');
  }

  if (typeof cache.maxSize !== 'number' || cache.maxSize < 10) {
    errors.push('Cache maxSize must be a number >= 10');
  }

  if (!Array.isArray(cache.invalidateOn)) {
    errors.push('Cache invalidateOn must be an array of strings');
  }

  return errors;
}

/**
 * Validate load balancing configuration
 */
function validateLoadBalancingConfig(lb: any): string[] {
  const errors: string[] = [];

  if (!['round-robin', 'least-busy', 'weighted'].includes(lb.strategy)) {
    errors.push('Load balancing strategy must be "round-robin", "least-busy", or "weighted"');
  }

  if (!['exponential-backoff', 'linear', 'none'].includes(lb.retryPolicy)) {
    errors.push('Retry policy must be "exponential-backoff", "linear", or "none"');
  }

  if (typeof lb.maxRetries !== 'number' || lb.maxRetries < 0) {
    errors.push('Max retries must be a number >= 0');
  }

  if (lb.circuitBreaker) {
    const cbErrors = validateCircuitBreakerConfig(lb.circuitBreaker);
    errors.push(...cbErrors);
  }

  return errors;
}

/**
 * Validate circuit breaker configuration
 */
function validateCircuitBreakerConfig(cb: any): string[] {
  const errors: string[] = [];

  if (typeof cb.enabled !== 'boolean') {
    errors.push('Circuit breaker enabled must be a boolean');
  }

  if (typeof cb.failureThreshold !== 'number' || cb.failureThreshold < 1) {
    errors.push('Circuit breaker failureThreshold must be a number >= 1');
  }

  if (typeof cb.resetTimeout !== 'number' || cb.resetTimeout < 10) {
    errors.push('Circuit breaker resetTimeout must be a number >= 10 seconds');
  }

  if (typeof cb.monitorInterval !== 'number' || cb.monitorInterval < 1) {
    errors.push('Circuit breaker monitorInterval must be a number >= 1 second');
  }

  return errors;
}

/**
 * Merge user config with defaults
 */
export function mergeWithDefaults(userConfig: any): ParallelConfig {
  const config = userConfig || {};

  return {
    enabled: config.enabled ?? DEFAULT_PARALLEL_CONFIG.enabled,
    workerPoolSize: Math.max(1, Math.min(config.workerPoolSize ?? DEFAULT_PARALLEL_CONFIG.workerPoolSize, 8)),
    maxConcurrentPatterns: config.maxConcurrentPatterns ?? DEFAULT_PARALLEL_CONFIG.maxConcurrentPatterns,
    defaultTimeout: config.defaultTimeout ?? DEFAULT_PARALLEL_CONFIG.defaultTimeout,
    parallelGroups: mergeGroups(config.parallelGroups, DEFAULT_PARALLEL_CONFIG.parallelGroups),
    caching: {
      ...DEFAULT_PARALLEL_CONFIG.caching,
      ...config.caching,
    },
    loadBalancing: {
      ...DEFAULT_PARALLEL_CONFIG.loadBalancing,
      ...config.loadBalancing,
      circuitBreaker: {
        ...DEFAULT_PARALLEL_CONFIG.loadBalancing.circuitBreaker,
        ...config.loadBalancing?.circuitBreaker,
      },
    },
  };
}

/**
 * Merge parallel groups from config with defaults
 */
function mergeGroups(userGroups: any, defaultGroups: Map<string, ParallelGroup>): Map<string, ParallelGroup> {
  const merged = new Map(defaultGroups);

  if (userGroups instanceof Map) {
    for (const [key, value] of userGroups) {
      merged.set(key, value);
    }
  } else if (typeof userGroups === 'object') {
    for (const [key, value] of Object.entries(userGroups)) {
      merged.set(key, value as ParallelGroup);
    }
  }

  return merged;
}

/**
 * Get configuration status summary
 */
export function getConfigStatus(config: ParallelConfig): string {
  const groupCount = config.parallelGroups.size;
  const maxPatterns = Math.max(...Array.from(config.parallelGroups.values()).map(g => g.patterns.length));

  return `
Parallel Processing Configuration:
  Status: ${config.enabled ? 'ENABLED' : 'DISABLED'}
  Worker Pool Size: ${config.workerPoolSize}
  Max Concurrent: ${config.maxConcurrentPatterns}
  Default Timeout: ${config.defaultTimeout}s
  Caching: ${config.caching.enabled ? 'enabled' : 'disabled'} (TTL: ${config.caching.ttl}s)
  Circuit Breaker: ${config.loadBalancing.circuitBreaker.enabled ? 'enabled' : 'disabled'}
  Load Balancing: ${config.loadBalancing.strategy}
  Parallel Groups: ${groupCount}
  Max Patterns/Group: ${maxPatterns}
  `;
}
