/**
 * Dependency Graph Builder for Pattern Analysis
 * Analyzes pattern relationships and identifies parallelizable groups
 */

import {
  DependencyGraph,
  PatternNode,
  DependencyEdge,
  PatternMetadata,
  ParallelGroup,
} from './types';

/**
 * Pattern metadata registry - maps pattern names to metadata
 */
export const PATTERN_METADATA: Record<string, PatternMetadata> = {
  // Code Generation Patterns
  '/api-endpoint': {
    name: '/api-endpoint',
    description: 'Generate REST API endpoint',
    dependencies: [],
    estimatedDuration: 300,
    canParallelizeWith: ['/ng-component', '/react-component', '/database-design'],
    outputSchema: 'ApiEndpointOutput',
    conflictResolution: 'merge',
  },
  '/ng-component': {
    name: '/ng-component',
    description: 'Generate Angular component',
    dependencies: [],
    canParallelizeWith: ['/api-endpoint', '/react-component', '/database-design'],
    estimatedDuration: 300,
    outputSchema: 'ComponentOutput',
    conflictResolution: 'merge',
  },
  '/react-component': {
    name: '/react-component',
    description: 'Generate React component',
    dependencies: [],
    canParallelizeWith: ['/api-endpoint', '/ng-component', '/database-design'],
    estimatedDuration: 300,
    outputSchema: 'ComponentOutput',
    conflictResolution: 'merge',
  },

  // Architecture & Design
  '/architecture-design': {
    name: '/architecture-design',
    description: 'Design system architecture',
    dependencies: [],
    canParallelizeWith: ['/database-design', '/design-system-setup'],
    estimatedDuration: 300,
    outputSchema: 'ArchitectureOutput',
    conflictResolution: 'merge',
  },
  '/database-design': {
    name: '/database-design',
    description: 'Design database schema',
    dependencies: [],
    canParallelizeWith: ['/api-endpoint', '/architecture-design'],
    estimatedDuration: 300,
    outputSchema: 'DatabaseOutput',
    conflictResolution: 'merge',
  },
  '/design-system-setup': {
    name: '/design-system-setup',
    description: 'Set up design system',
    dependencies: [],
    canParallelizeWith: ['/architecture-design', '/ng-component', '/react-component'],
    estimatedDuration: 300,
    outputSchema: 'DesignSystemOutput',
    conflictResolution: 'merge',
  },

  // Testing Patterns
  '/add-tests': {
    name: '/add-tests',
    description: 'Generate unit tests',
    dependencies: ['/api-endpoint', '/ng-component', '/react-component'],
    canParallelizeWith: ['/visual-regression-testing', '/api-contract-testing'],
    estimatedDuration: 300,
    outputSchema: 'TestOutput',
    conflictResolution: 'merge',
  },
  '/visual-regression-testing': {
    name: '/visual-regression-testing',
    description: 'Set up visual regression testing',
    dependencies: ['/ng-component', '/react-component'],
    canParallelizeWith: ['/add-tests', '/api-contract-testing'],
    estimatedDuration: 180,
    outputSchema: 'TestOutput',
    conflictResolution: 'merge',
  },
  '/api-contract-testing': {
    name: '/api-contract-testing',
    description: 'Generate API contract tests',
    dependencies: ['/api-endpoint'],
    canParallelizeWith: ['/add-tests', '/visual-regression-testing'],
    estimatedDuration: 180,
    outputSchema: 'TestOutput',
    conflictResolution: 'merge',
  },

  // Deployment
  '/docker-containerize': {
    name: '/docker-containerize',
    description: 'Generate Dockerfile',
    dependencies: ['/api-endpoint'],
    canParallelizeWith: ['/kubernetes-deploy', '/iac-generate'],
    estimatedDuration: 180,
    outputSchema: 'DockerOutput',
    conflictResolution: 'merge',
  },
  '/kubernetes-deploy': {
    name: '/kubernetes-deploy',
    description: 'Generate K8s manifests',
    dependencies: ['/docker-containerize'],
    canParallelizeWith: ['/iac-generate', '/monitoring-alerting-rules'],
    estimatedDuration: 180,
    outputSchema: 'K8sOutput',
    conflictResolution: 'merge',
  },
  '/iac-generate': {
    name: '/iac-generate',
    description: 'Generate Infrastructure as Code',
    dependencies: [],
    canParallelizeWith: ['/docker-containerize', '/kubernetes-deploy'],
    estimatedDuration: 180,
    outputSchema: 'IacOutput',
    conflictResolution: 'merge',
  },

  // Security
  '/threat-modeling': {
    name: '/threat-modeling',
    description: 'Threat modeling analysis',
    dependencies: ['/architecture-design'],
    canParallelizeWith: ['/cloud-security-posture', '/dependency-scanning-continuous'],
    estimatedDuration: 300,
    outputSchema: 'ThreatModelOutput',
    conflictResolution: 'merge',
  },
  '/cloud-security-posture': {
    name: '/cloud-security-posture',
    description: 'Cloud security posture',
    dependencies: [],
    canParallelizeWith: ['/threat-modeling', '/dependency-scanning-continuous'],
    estimatedDuration: 180,
    outputSchema: 'SecurityOutput',
    conflictResolution: 'merge',
  },
};

/**
 * Builds dependency graph from patterns
 */
export class DependencyGraphBuilder {
  private metadata: Record<string, PatternMetadata>;

  constructor(metadata: Record<string, PatternMetadata> = PATTERN_METADATA) {
    this.metadata = metadata;
  }

  /**
   * Build graph from pattern list
   */
  buildGraph(patterns: string[]): DependencyGraph {
    const graph: DependencyGraph = {
      nodes: new Map(),
      edges: new Set(),
      groups: new Map(),
    };

    // Create nodes
    for (const pattern of patterns) {
      const meta = this.metadata[pattern];
      if (!meta) {
        console.warn(`Pattern ${pattern} not found in metadata, using defaults`);
      }

      const node: PatternNode = {
        pattern,
        metadata: meta || this.createDefaultMetadata(pattern),
        incomingDeps: new Set(),
        outgoingDeps: new Set(),
        executionOrder: 0,
      };

      graph.nodes.set(pattern, node);
    }

    // Create edges based on dependencies
    for (const pattern of patterns) {
      const meta = this.metadata[pattern] || this.createDefaultMetadata(pattern);
      const fromNode = graph.nodes.get(pattern)!;

      for (const dep of meta.dependencies) {
        const toNode = graph.nodes.get(dep);
        if (toNode) {
          const edge: DependencyEdge = {
            from: pattern,
            to: dep,
            type: 'blocking',
          };
          graph.edges.add(edge);
          fromNode.incomingDeps.add(dep);
          toNode.outgoingDeps.add(pattern);
        }
      }
    }

    // Calculate execution order (topological sort)
    this.calculateExecutionOrder(graph);

    // Identify parallel groups
    this.identifyParallelGroups(graph);

    return graph;
  }

  /**
   * Identify patterns that can run in parallel
   */
  identifyParallelGroups(graph: DependencyGraph): void {
    const visited = new Set<string>();
    let groupIndex = 0;

    for (const [pattern, node] of graph.nodes) {
      if (visited.has(pattern)) continue;

      const group: string[] = [pattern];
      visited.add(pattern);

      // Find patterns that can run in parallel
      for (const [otherPattern, otherNode] of graph.nodes) {
        if (visited.has(otherPattern) || otherPattern === pattern) continue;

        if (this.canRunInParallel(node, otherNode, graph)) {
          group.push(otherPattern);
          visited.add(otherPattern);
        }
      }

      if (group.length > 0) {
        graph.groups.set(`group-${groupIndex++}`, group);
      }
    }
  }

  /**
   * Check if two patterns can run in parallel
   */
  private canRunInParallel(
    node1: PatternNode,
    node2: PatternNode,
    graph: DependencyGraph
  ): boolean {
    const pattern1 = node1.pattern;
    const pattern2 = node2.pattern;

    // Check metadata
    const meta1 = node1.metadata;
    if (meta1.canParallelizeWith && !meta1.canParallelizeWith.includes(pattern2)) {
      return false;
    }

    // Check no circular dependency
    if (node1.incomingDeps.has(pattern2) || node2.incomingDeps.has(pattern1)) {
      return false;
    }

    // Check no shared hard dependencies
    const shared1 = Array.from(node1.incomingDeps).filter(dep =>
      node2.incomingDeps.has(dep)
    );
    const shared2 = Array.from(node2.incomingDeps).filter(dep =>
      node1.incomingDeps.has(dep)
    );

    // Allow parallel if dependencies can also be parallelized
    return shared1.length === 0 && shared2.length === 0;
  }

  /**
   * Calculate execution order using topological sort
   */
  private calculateExecutionOrder(graph: DependencyGraph): void {
    const inDegree = new Map<string, number>();

    // Initialize in-degrees
    for (const [pattern, node] of graph.nodes) {
      inDegree.set(pattern, node.incomingDeps.size);
    }

    let order = 0;
    const queue: string[] = [];

    // Start with nodes with no dependencies
    for (const [pattern, degree] of inDegree) {
      if (degree === 0) {
        queue.push(pattern);
      }
    }

    // Process queue
    while (queue.length > 0) {
      const pattern = queue.shift()!;
      const node = graph.nodes.get(pattern)!;
      node.executionOrder = order++;

      // Update outgoing dependencies
      for (const outgoing of node.outgoingDeps) {
        const currentDegree = inDegree.get(outgoing)!;
        inDegree.set(outgoing, currentDegree - 1);

        if (currentDegree - 1 === 0) {
          queue.push(outgoing);
        }
      }
    }
  }

  /**
   * Get optimal parallel groups
   */
  getOptimalGroups(graph: DependencyGraph): ParallelGroup[] {
    const groups: ParallelGroup[] = [];
    const used = new Set<string>();

    // Group by execution order
    const orderMap = new Map<number, string[]>();
    for (const [pattern, node] of graph.nodes) {
      if (!orderMap.has(node.executionOrder)) {
        orderMap.set(node.executionOrder, []);
      }
      orderMap.get(node.executionOrder)!.push(pattern);
    }

    // Create parallel groups for each execution level
    for (const [order, patterns] of orderMap) {
      if (patterns.length > 0 && !patterns.every(p => used.has(p))) {
        const group: ParallelGroup = {
          name: `Execution Level ${order}`,
          patterns: patterns.filter(p => !used.has(p)),
          timeout: Math.max(
            ...patterns.map(p => this.metadata[p]?.estimatedDuration || 300)
          ) * 2,
          conflictResolution: 'merge',
          dependencies: [],
          priority: order,
        };

        groups.push(group);

        for (const pattern of patterns) {
          used.add(pattern);
        }
      }
    }

    return groups;
  }

  /**
   * Create default metadata for unknown pattern
   */
  private createDefaultMetadata(pattern: string): PatternMetadata {
    return {
      name: pattern,
      description: `Auto-discovered pattern: ${pattern}`,
      dependencies: [],
      estimatedDuration: 300,
      canParallelizeWith: [],
      outputSchema: 'GenericOutput',
      conflictResolution: 'merge',
    };
  }
}

/**
 * Analyze patterns for parallelization potential
 */
export function analyzeParallelPotential(patterns: string[]): {
  canParallelize: boolean;
  potentialSpeedup: number;
  dependencyChains: string[][];
} {
  const builder = new DependencyGraphBuilder();
  const graph = builder.buildGraph(patterns);

  let sequentialTime = 0;
  let parallelTime = 0;
  const chains: string[][] = [];

  // Calculate timing
  for (const [pattern, node] of graph.nodes) {
    const meta = PATTERN_METADATA[pattern] || builder['createDefaultMetadata'](pattern);
    sequentialTime += meta.estimatedDuration;
    parallelTime = Math.max(parallelTime, meta.estimatedDuration * (node.executionOrder + 1));
  }

  // Identify dependency chains
  const visited = new Set<string>();
  for (const pattern of patterns) {
    if (!visited.has(pattern)) {
      const chain = buildDependencyChain(pattern, graph);
      if (chain.length > 1) {
        chains.push(chain);
      }
      for (const p of chain) {
        visited.add(p);
      }
    }
  }

  return {
    canParallelize: patterns.length > 1 && parallelTime < sequentialTime,
    potentialSpeedup: sequentialTime / parallelTime,
    dependencyChains: chains,
  };
}

/**
 * Build dependency chain for a pattern
 */
function buildDependencyChain(pattern: string, graph: DependencyGraph): string[] {
  const chain: string[] = [pattern];
  const meta = PATTERN_METADATA[pattern];

  if (meta?.dependencies) {
    for (const dep of meta.dependencies) {
      const node = graph.nodes.get(dep);
      if (node) {
        chain.push(...buildDependencyChain(dep, graph));
      }
    }
  }

  return chain;
}
