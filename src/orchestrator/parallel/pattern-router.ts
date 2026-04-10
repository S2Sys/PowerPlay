/**
 * Parallel Pattern Router — Routes multi-pattern requests to parallel execution
 * Detects when 2+ patterns can be executed in parallel for 3-5x speedup
 */

import { DependencyGraphBuilder } from './dependency-graph';
import { PATTERN_METADATA } from './dependency-graph';

/**
 * Parallel execution routing decision
 */
export interface ParallelRoutingDecision {
  shouldParallelize: boolean;
  patterns: string[];
  reason: string;
  estimatedSpeedup: number;
  recommendation: string;
}

/**
 * Predefined parallelizable groups
 */
export const PARALLELIZABLE_GROUPS = {
  codeGeneration: ['/api-endpoint', '/ng-component', '/react-component'],
  architectureDesign: ['/architecture-design', '/database-design', '/design-system-setup'],
  testing: ['/add-tests', '/visual-regression-testing', '/api-contract-testing'],
  deployment: ['/docker-containerize', '/kubernetes-deploy', '/iac-generate'],
  security: ['/threat-modeling', '/cloud-security-posture', '/dependency-scanning-continuous'],
};

/**
 * Extract pattern keywords from user request
 */
export function extractPatternKeywords(request: string): string[] {
  const keywords = request.toLowerCase().match(/\/[\w-]+/g) || [];
  return [...new Set(keywords)];
}

/**
 * Detect if a request maps to multiple patterns
 */
export function detectMultiPatternRequest(request: string): string[] {
  const detectedPatterns: string[] = [];

  // Check for explicit pattern syntax (/pattern-name)
  const explicitPatterns = extractPatternKeywords(request);
  detectedPatterns.push(...explicitPatterns);

  // Check for semantic multi-pattern requests
  const requestLower = request.toLowerCase();

  // Code generation patterns
  if (
    (requestLower.includes('api') || requestLower.includes('endpoint')) &&
    (requestLower.includes('angular') || requestLower.includes('component')) &&
    (requestLower.includes('database') || requestLower.includes('schema'))
  ) {
    detectedPatterns.push('/api-endpoint', '/ng-component', '/database-design');
  } else if (
    (requestLower.includes('api') || requestLower.includes('endpoint')) &&
    (requestLower.includes('component')) &&
    (requestLower.includes('all') || requestLower.includes('simultaneously') || requestLower.includes('at once'))
  ) {
    detectedPatterns.push('/api-endpoint', '/ng-component');
  }

  // Architecture + design patterns
  if (
    (requestLower.includes('architecture') || requestLower.includes('design')) &&
    (requestLower.includes('database') || requestLower.includes('schema')) &&
    (requestLower.includes('design system') || requestLower.includes('ui'))
  ) {
    detectedPatterns.push('/architecture-design', '/database-design', '/design-system-setup');
  }

  // Deployment patterns
  if (
    (requestLower.includes('docker') || requestLower.includes('container')) &&
    (requestLower.includes('kubernetes') || requestLower.includes('k8s')) &&
    (requestLower.includes('terraform') || requestLower.includes('iac') || requestLower.includes('infrastructure'))
  ) {
    detectedPatterns.push('/docker-containerize', '/kubernetes-deploy', '/iac-generate');
  } else if (
    (requestLower.includes('docker') || requestLower.includes('container')) &&
    (requestLower.includes('kubernetes') || requestLower.includes('k8s'))
  ) {
    detectedPatterns.push('/docker-containerize', '/kubernetes-deploy');
  }

  // Security patterns
  if (
    (requestLower.includes('threat') || requestLower.includes('threat modeling')) &&
    (requestLower.includes('security') || requestLower.includes('posture')) &&
    (requestLower.includes('dependency') || requestLower.includes('scan'))
  ) {
    detectedPatterns.push('/threat-modeling', '/cloud-security-posture', '/dependency-scanning-continuous');
  }

  // Remove duplicates
  return [...new Set(detectedPatterns)];
}

/**
 * Check if patterns belong to a parallelizable group
 */
export function findParallelizableGroup(patterns: string[]): string[] {
  if (patterns.length < 2) {
    return [];
  }

  // Check against predefined groups
  for (const [groupName, groupPatterns] of Object.entries(PARALLELIZABLE_GROUPS)) {
    const intersection = patterns.filter(p => groupPatterns.includes(p));
    if (intersection.length >= 2) {
      return intersection;
    }
  }

  // Check via dependency graph (can they run in parallel?)
  const builder = new DependencyGraphBuilder();
  try {
    const graph = builder.buildGraph(patterns);

    // Find patterns with no mutual dependencies
    const independentPatterns = patterns.filter(p1 => {
      const node1 = graph.nodes.get(p1);
      if (!node1) return false;

      return patterns.every(p2 => {
        if (p1 === p2) return true;
        const node2 = graph.nodes.get(p2);
        if (!node2) return true;

        // Can run in parallel if no blocking dependency between them
        return !node1.incomingDeps.has(p2) && !node2.incomingDeps.has(p1);
      });
    });

    return independentPatterns.length >= 2 ? independentPatterns : [];
  } catch {
    return [];
  }
}

/**
 * Calculate expected speedup for parallel execution
 */
export function calculateExpectedSpeedup(patterns: string[]): number {
  if (patterns.length < 2) {
    return 1.0;
  }

  try {
    const builder = new DependencyGraphBuilder();
    const graph = builder.buildGraph(patterns);

    // Calculate sequential time (sum of all pattern durations)
    let sequentialTime = 0;
    for (const pattern of patterns) {
      const meta = PATTERN_METADATA[pattern];
      sequentialTime += (meta?.estimatedDuration || 300) / 1000; // Convert to seconds
    }

    // Calculate parallel time (longest dependency chain + max width)
    let longestChainTime = 0;
    const orderMap = new Map<number, number>();

    for (const [pattern, node] of graph.nodes) {
      const meta = PATTERN_METADATA[pattern];
      const duration = (meta?.estimatedDuration || 300) / 1000;

      if (!orderMap.has(node.executionOrder)) {
        orderMap.set(node.executionOrder, 0);
      }
      orderMap.set(node.executionOrder, (orderMap.get(node.executionOrder) || 0) + duration);
    }

    for (const duration of orderMap.values()) {
      longestChainTime += duration;
    }

    const parallelTime = Math.max(longestChainTime, sequentialTime / patterns.length);
    return sequentialTime / Math.max(parallelTime, 1);
  } catch {
    // Default assumption: parallel execution of N patterns is ~sqrt(N) faster
    return Math.sqrt(patterns.length);
  }
}

/**
 * Decide whether to use parallel execution
 */
export function decideParallelExecution(request: string): ParallelRoutingDecision {
  // Detect patterns in request
  const detectedPatterns = detectMultiPatternRequest(request);

  if (detectedPatterns.length < 2) {
    return {
      shouldParallelize: false,
      patterns: detectedPatterns,
      reason: 'Only 1 or fewer patterns detected',
      estimatedSpeedup: 1.0,
      recommendation: 'Execute as single pattern command',
    };
  }

  // Check if patterns can be parallelized
  const parallelPatterns = findParallelizableGroup(detectedPatterns);

  if (parallelPatterns.length < 2) {
    return {
      shouldParallelize: false,
      patterns: detectedPatterns,
      reason: `Patterns have blocking dependencies: ${detectedPatterns.join(', ')}`,
      estimatedSpeedup: 1.0,
      recommendation: 'Execute sequentially respecting dependencies',
    };
  }

  // Calculate expected speedup
  const speedup = calculateExpectedSpeedup(parallelPatterns);

  if (speedup < 1.5) {
    return {
      shouldParallelize: false,
      patterns: parallelPatterns,
      reason: `Expected speedup (${speedup.toFixed(1)}x) is minimal`,
      estimatedSpeedup: speedup,
      recommendation: 'Execute sequentially (not worth parallelization overhead)',
    };
  }

  return {
    shouldParallelize: true,
    patterns: parallelPatterns,
    reason: `${parallelPatterns.length} independent patterns detected: ${parallelPatterns.join(', ')}`,
    estimatedSpeedup: speedup,
    recommendation: `Use parallel execution for estimated ${speedup.toFixed(1)}x speedup`,
  };
}

/**
 * Format parallel execution summary
 */
export function formatParallelSummary(decision: ParallelRoutingDecision): string {
  if (!decision.shouldParallelize) {
    return `
**Parallel Execution**: ❌ Not Applicable
**Reason**: ${decision.reason}
**Recommendation**: ${decision.recommendation}
`;
  }

  return `
**Parallel Execution**: ✓ Activated
**Patterns**: ${decision.patterns.join(', ')}
**Estimated Speedup**: ${decision.estimatedSpeedup.toFixed(1)}x faster
**Recommendation**: ${decision.recommendation}

The parallel executor will:
1. Build dependency graph from your patterns
2. Group independent patterns for concurrent execution
3. Execute groups in parallel (3-5x speedup expected)
4. Merge results with conflict resolution
5. Report worker utilization and cache hits
`;
}

/**
 * Get suggested parallelizable commands for given domain
 */
export function getSuggestedParallelGroups(domain: string): string {
  const groups = PARALLELIZABLE_GROUPS;
  const suggestions = [];

  for (const [groupName, patterns] of Object.entries(groups)) {
    if (groupName.toLowerCase().includes(domain.toLowerCase())) {
      suggestions.push(`**${groupName}**: ${patterns.join(' + ')}`);
    }
  }

  if (suggestions.length === 0) {
    return '';
  }

  return `
**Parallelizable Groups** (for ${domain}):
${suggestions.join('\n')}
`;
}
