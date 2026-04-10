/**
 * Parallel Processing Types & Interfaces for PowerPlay v3.9.0
 * Defines structures for parallel pattern execution, worker pools, and caching
 */

/**
 * Pattern metadata for dependency analysis
 */
export interface PatternMetadata {
  name: string;
  description: string;
  dependencies: string[];      // Other patterns this depends on
  estimatedDuration: number;    // Estimated execution time in seconds
  canParallelizeWith: string[]; // Patterns safe to run in parallel with
  outputSchema: string;         // Schema of output data structure
  conflictResolution: 'merge' | 'priority' | 'manual';
}

/**
 * Parallel group - set of patterns that can/should run together
 */
export interface ParallelGroup {
  name: string;
  patterns: string[];
  timeout: number;              // Group timeout in seconds
  conflictResolution: 'merge' | 'priority';
  dependencies: string[];       // Groups that must complete first
  priority: number;             // Execution priority (1-10)
}

/**
 * Parallel execution configuration
 */
export interface ParallelConfig {
  enabled: boolean;
  workerPoolSize: number;       // 4-8 recommended
  maxConcurrentPatterns: number; // Max patterns running simultaneously
  defaultTimeout: number;       // Default timeout in seconds
  parallelGroups: Map<string, ParallelGroup>;
  caching: CacheConfig;
  loadBalancing: LoadBalancingConfig;
}

/**
 * Cache configuration
 */
export interface CacheConfig {
  enabled: boolean;
  ttl: number;                  // Time to live in seconds
  strategy: 'lru' | 'lfu' | 'fifo';
  maxSize: number;              // Max number of cached items
  invalidateOn: string[];       // Events that invalidate cache
}

/**
 * Load balancing configuration
 */
export interface LoadBalancingConfig {
  strategy: 'round-robin' | 'least-busy' | 'weighted';
  retryPolicy: 'exponential-backoff' | 'linear' | 'none';
  maxRetries: number;
  circuitBreaker: CircuitBreakerConfig;
}

/**
 * Circuit breaker pattern configuration
 */
export interface CircuitBreakerConfig {
  enabled: boolean;
  failureThreshold: number;     // Failures before opening
  resetTimeout: number;         // Seconds before attempting reset
  monitorInterval: number;      // Check interval in seconds
}

/**
 * Dependency graph for pattern relationships
 */
export interface DependencyGraph {
  nodes: Map<string, PatternNode>;
  edges: Set<DependencyEdge>;
  groups: Map<string, string[]>; // Pattern groups
}

/**
 * Node in dependency graph
 */
export interface PatternNode {
  pattern: string;
  metadata: PatternMetadata;
  incomingDeps: Set<string>;
  outgoingDeps: Set<string>;
  executionOrder: number;
}

/**
 * Edge in dependency graph
 */
export interface DependencyEdge {
  from: string;
  to: string;
  type: 'blocking' | 'data-flow' | 'soft';
}

/**
 * Result of pattern execution
 */
export interface PatternResult {
  pattern: string;
  status: 'success' | 'failed' | 'timeout' | 'skipped';
  output?: any;
  error?: Error;
  duration: number;             // Execution time in ms
  timestamp: number;
  metadata: {
    cached: boolean;
    retries: number;
    workerId: string;
  };
}

/**
 * Merged output from parallel pattern execution
 */
export interface MergedOutput {
  success: boolean;
  results: Map<string, PatternResult>;
  mergedData: any;              // Combined output
  conflictResolutions: ConflictResolution[];
  totalDuration: number;
  parallelDuration: number;     // Actual parallel execution time
  speedupFactor: number;        // (sequential time) / (parallel time)
  errors: Error[];
}

/**
 * Conflict resolution record
 */
export interface ConflictResolution {
  pattern1: string;
  pattern2: string;
  field: string;
  conflict: string;
  resolution: string;
  strategy: 'merge' | 'priority' | 'manual';
}

/**
 * Parallel execution request
 */
export interface ParallelExecutionRequest {
  patterns: string[];
  context: ExecutionContext;
  timeout?: number;
  forceParallel?: boolean;      // Skip dependency analysis
  cacheResults?: boolean;
}

/**
 * Execution context carrying through parallel execution
 */
export interface ExecutionContext {
  userId: string;
  projectId: string;
  phase: string;                // design, implementation, testing, etc.
  codeSelection?: string;       // Selected code for analysis
  requirements?: string;        // Original user request
  metadata: Map<string, any>;
}

/**
 * Worker in the worker pool
 */
export interface Worker {
  id: string;
  isBusy: boolean;
  currentTask?: Task;
  executedTasks: number;
  totalDuration: number;
  errors: number;
  lastResetTime: number;
}

/**
 * Task to be executed by a worker
 */
export interface Task {
  id: string;
  pattern: string;
  context: ExecutionContext;
  timeout: number;
  priority: number;
  retryCount: number;
  createdAt: number;
}

/**
 * Cache entry
 */
export interface CacheEntry<T = any> {
  key: string;
  pattern: string;
  input: any;
  inputHash: string;
  output: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessTime: number;
}

/**
 * Batch processing request
 */
export interface BatchRequest {
  requirements: Requirement[];
  parallelPhases: boolean;
  timeout: number;
  onPhaseComplete?: (phase: string, results: PatternResult[]) => void;
}

/**
 * Requirement in batch
 */
export interface Requirement {
  id: string;
  name: string;
  description: string;
  priority: number;
  estimatedEffort?: number;
}

/**
 * Batch processing result
 */
export interface BatchResult {
  success: boolean;
  requirements: Map<string, RequirementResult>;
  totalDuration: number;
  speedupFactor: number;
  errors: Error[];
}

/**
 * Result for single requirement in batch
 */
export interface RequirementResult {
  requirementId: string;
  phases: Map<string, PatternResult[]>;
  finalOutput: any;
  status: 'completed' | 'failed' | 'partial';
}

/**
 * Performance metrics for parallel execution
 */
export interface ParallelMetrics {
  totalPatterns: number;
  successfulPatterns: number;
  failedPatterns: number;
  sequentialDuration: number;   // Time if run sequentially
  parallelDuration: number;     // Actual parallel execution time
  speedupFactor: number;
  cacheHits: number;
  cacheMisses: number;
  averageWorkerUtilization: number;
  workerMetrics: Map<string, WorkerMetrics>;
}

/**
 * Metrics for individual worker
 */
export interface WorkerMetrics {
  workerId: string;
  tasksExecuted: number;
  successfulTasks: number;
  failedTasks: number;
  totalDuration: number;
  averageDurationPerTask: number;
  utilizationPercentage: number;
  lastUsedAt: number;
}

// ── v3.9.0 Path 4A Types ────────────────────────────────

export type InvestCriterion = 'independent' | 'negotiable' | 'valuable' | 'estimable' | 'small' | 'testable';
export type ValidationSeverity = 'critical' | 'warning' | 'info';

export interface RequirementValidationIssue {
  criterion: string;
  issue: string;
  severity: ValidationSeverity;
  recommendation: string;
}

export interface RequirementValidationScore {
  requirementId: string;
  requirementName: string;
  overallScore: number; // 0-100
  investScores: Map<InvestCriterion, number>; // 0-10 each
  issues: RequirementValidationIssue[];
  verdict: 'pass' | 'needs-work' | 'fail';
}

export interface ValidationReport {
  totalRequirements: number;
  passedCount: number;
  needsWorkCount: number;
  failedCount: number;
  scores: RequirementValidationScore[];
  summary: string;
  timestamp: number;
}

export type NormalizationViolation = '1NF' | '2NF' | '3NF';
export type IndexRecommendationType = 'composite' | 'covering' | 'unique' | 'partial';
export type ConstraintIssueType = 'missing-not-null' | 'missing-fk' | 'missing-unique' | 'naming-convention';

export interface SchemaViolation {
  table: string;
  column?: string;
  violationType: NormalizationViolation | ConstraintIssueType;
  description: string;
  severity: 'critical' | 'warning' | 'info';
}

export interface IndexRecommendation {
  table: string;
  columns: string[];
  type: IndexRecommendationType;
  reason: string;
  estimatedImpact: 'high' | 'medium' | 'low';
  ddl: string;
}

export interface SchemaOptimizationReport {
  inputTables: string[];
  violations: SchemaViolation[];
  indexRecommendations: IndexRecommendation[];
  correctedSchema: string;
  migrationScript: string;
  namingIssues: string[];
  timestamp: number;
}

export interface HelmDeploymentSpec {
  imageName: string;
  replicas: number;
  ports: Array<{ name: string; containerPort: number; servicePort: number }>;
  envVars: Array<{ name: string; value: string; secret?: boolean }>;
  resources: {
    requests: { cpu: string; memory: string };
    limits: { cpu: string; memory: string };
  };
  ingress?: {
    enabled: boolean;
    host: string;
    path?: string;
    tlsEnabled?: boolean;
  };
  configMap?: Record<string, string>;
}

export interface HelmChartFile {
  path: string;
  content: string;
}

export interface HelmChartOutput {
  chartName: string;
  chartVersion: string;
  files: HelmChartFile[];
  installCommand: string;
  upgradeCommand: string;
  timestamp: number;
}
