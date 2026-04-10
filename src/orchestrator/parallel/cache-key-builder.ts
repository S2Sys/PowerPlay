/**
 * Cache Key Builder — Generate deterministic cache keys from pattern inputs
 * Uses SHA256 hashing for consistency across sessions
 */

import { createHash } from 'crypto';
import { ExecutionContext, Requirement } from './types';

/**
 * Cache key builder with deterministic hashing
 */
export class CacheKeyBuilder {
  /**
   * Build cache key from pattern and input
   * Format: pattern:inputHash
   */
  buildKey(pattern: string, input: any, context?: ExecutionContext): string {
    const inputData = {
      pattern,
      input,
      projectId: context?.projectId || 'default',
    };

    const hash = this.hashInput(inputData);
    return `${pattern}:${hash}`;
  }

  /**
   * Build cache key for requirement execution
   */
  buildRequirementKey(pattern: string, requirement: Requirement): string {
    const inputData = {
      pattern,
      requirement: {
        id: requirement.id,
        name: requirement.name,
        description: requirement.description,
        priority: requirement.priority,
      },
    };

    const hash = this.hashInput(inputData);
    return `req:${pattern}:${hash}`;
  }

  /**
   * Build cache key for pattern with multiple inputs
   */
  buildPatternKey(pattern: string, inputs: Map<string, any>): string {
    const inputData: any = {
      pattern,
      inputs: {},
    };

    // Sort keys for deterministic order
    const sortedKeys = Array.from(inputs.keys()).sort();
    for (const key of sortedKeys) {
      inputData.inputs[key] = inputs.get(key);
    }

    const hash = this.hashInput(inputData);
    return `pattern:${pattern}:${hash}`;
  }

  /**
   * Build cache key for batch phase results
   */
  buildBatchKey(phase: string, requirements: Requirement[]): string {
    const inputData = {
      phase,
      requirements: requirements.map(r => ({
        id: r.id,
        name: r.name,
        priority: r.priority,
      })),
    };

    const hash = this.hashInput(inputData);
    return `batch:${phase}:${hash}`;
  }

  /**
   * Build phase result key
   */
  buildPhaseKey(requirementId: string, phase: string, input: any): string {
    const inputData = {
      requirement: requirementId,
      phase,
      input,
    };

    const hash = this.hashInput(inputData);
    return `phase:${phase}:${requirementId}:${hash}`;
  }

  /**
   * Hash input for deterministic key generation
   */
  hashInput(input: any): string {
    // Serialize input deterministically
    const serialized = this.serializeDeterministically(input);

    // Hash with SHA256
    const hash = createHash('sha256');
    hash.update(serialized);
    return hash.digest('hex').substring(0, 16); // Use first 16 chars
  }

  /**
   * Serialize input deterministically
   * Uses JSON.stringify with sorted keys for consistency
   */
  private serializeDeterministically(input: any): string {
    return JSON.stringify(this.sortObjectKeys(input));
  }

  /**
   * Sort object keys recursively for deterministic serialization
   */
  private sortObjectKeys(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sortObjectKeys(item));
    }

    const sorted: any = {};
    Object.keys(obj)
      .sort()
      .forEach(key => {
        sorted[key] = this.sortObjectKeys(obj[key]);
      });

    return sorted;
  }

  /**
   * Extract components from cache key
   */
  extractComponents(key: string): {
    type: string;
    pattern?: string;
    phase?: string;
    requirementId?: string;
    hash: string;
  } {
    const parts = key.split(':');

    if (parts[0] === 'req') {
      return {
        type: 'requirement',
        pattern: parts[1],
        hash: parts[2],
      };
    }

    if (parts[0] === 'phase') {
      return {
        type: 'phase',
        phase: parts[1],
        requirementId: parts[2],
        hash: parts[3],
      };
    }

    if (parts[0] === 'batch') {
      return {
        type: 'batch',
        phase: parts[1],
        hash: parts[2],
      };
    }

    if (parts[0] === 'pattern') {
      return {
        type: 'pattern',
        pattern: parts[1],
        hash: parts[2],
      };
    }

    return {
      type: 'unknown',
      pattern: parts[0],
      hash: parts.slice(1).join(':'),
    };
  }

  /**
   * Check if two inputs would generate same cache key
   */
  wouldCollide(input1: any, input2: any): boolean {
    const hash1 = this.hashInput(input1);
    const hash2 = this.hashInput(input2);
    return hash1 === hash2;
  }

  /**
   * Generate variation key for same pattern with different context
   */
  buildContextVariationKey(pattern: string, input: any, contextTag: string): string {
    const inputData = {
      pattern,
      input,
      contextTag,
    };

    const hash = this.hashInput(inputData);
    return `${pattern}:${contextTag}:${hash}`;
  }
}

/**
 * Hash input directly for quick hashing
 */
export function hashInput(input: any): string {
  const serialized = JSON.stringify(sortObjectKeys(input));
  const hash = createHash('sha256');
  hash.update(serialized);
  return hash.digest('hex').substring(0, 16);
}

/**
 * Sort object keys recursively
 */
function sortObjectKeys(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sortObjectKeys(item));
  }

  const sorted: any = {};
  Object.keys(obj)
    .sort()
    .forEach(key => {
      sorted[key] = sortObjectKeys(obj[key]);
    });

  return sorted;
}

/**
 * Factory function to create cache key builder
 */
export function createCacheKeyBuilder(): CacheKeyBuilder {
  return new CacheKeyBuilder();
}
