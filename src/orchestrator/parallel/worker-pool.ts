/**
 * Worker Pool Management System for Parallel Pattern Execution
 * Manages a pool of workers executing patterns concurrently
 */

import { Worker, Task, WorkerMetrics, ParallelMetrics } from './types';

/**
 * Worker implementation
 */
class WorkerImpl implements Worker {
  id: string;
  isBusy: boolean = false;
  currentTask?: Task;
  executedTasks: number = 0;
  totalDuration: number = 0;
  errors: number = 0;
  lastResetTime: number = Date.now();
  private metrics: WorkerMetrics;

  constructor(id: string) {
    this.id = id;
    this.metrics = {
      workerId: id,
      tasksExecuted: 0,
      successfulTasks: 0,
      failedTasks: 0,
      totalDuration: 0,
      averageDurationPerTask: 0,
      utilizationPercentage: 0,
      lastUsedAt: 0,
    };
  }

  getMetrics(): WorkerMetrics {
    return {
      ...this.metrics,
      averageDurationPerTask:
        this.metrics.tasksExecuted > 0
          ? this.metrics.totalDuration / this.metrics.tasksExecuted
          : 0,
    };
  }

  recordExecution(taskDuration: number, successful: boolean): void {
    this.executedTasks++;
    this.totalDuration += taskDuration;
    this.metrics.tasksExecuted++;
    this.metrics.totalDuration += taskDuration;
    this.metrics.lastUsedAt = Date.now();

    if (successful) {
      this.metrics.successfulTasks++;
    } else {
      this.errors++;
      this.metrics.failedTasks++;
    }
  }

  calculateUtilization(timeWindow: number = 3600000): number {
    const timeSinceLastUse = Date.now() - this.metrics.lastUsedAt;
    if (timeSinceLastUse > timeWindow) return 0;

    return Math.min((this.totalDuration / timeWindow) * 100, 100);
  }

  reset(): void {
    this.isBusy = false;
    this.currentTask = undefined;
    this.lastResetTime = Date.now();
  }
}

/**
 * Task Queue for managing pending tasks
 */
class TaskQueue {
  private queue: Task[] = [];
  private priorityComparator = (a: Task, b: Task) => b.priority - a.priority;

  enqueue(task: Task): void {
    this.queue.push(task);
    this.queue.sort(this.priorityComparator);
  }

  dequeue(): Task | undefined {
    return this.queue.shift();
  }

  peek(): Task | undefined {
    return this.queue[0];
  }

  size(): number {
    return this.queue.length;
  }

  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  clear(): void {
    this.queue = [];
  }

  getTasks(): Task[] {
    return [...this.queue];
  }
}

/**
 * Worker Pool Manager
 */
export class WorkerPool {
  private workers: WorkerImpl[];
  private taskQueue: TaskQueue;
  private poolSize: number;
  private maxQueueSize: number = 1000;
  private circuitBreakerState: 'closed' | 'open' | 'half-open' = 'closed';
  private failureCount: number = 0;
  private failureThreshold: number = 5;
  private lastFailureTime: number = 0;
  private resetTimeout: number = 30000; // 30 seconds
  private metrics: ParallelMetrics;

  constructor(poolSize: number = 4) {
    this.poolSize = Math.max(1, Math.min(poolSize, 8)); // Clamp between 1-8
    this.workers = Array(this.poolSize)
      .fill(null)
      .map((_, i) => new WorkerImpl(`worker-${i}`));
    this.taskQueue = new TaskQueue();
    this.metrics = this.initializeMetrics();
  }

  /**
   * Get an available worker using least-busy strategy
   */
  async getAvailableWorker(): Promise<Worker> {
    // Check circuit breaker
    if (this.circuitBreakerState === 'open') {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.circuitBreakerState = 'half-open';
      } else {
        throw new Error('Worker pool circuit breaker is open - too many failures');
      }
    }

    // Find least busy worker
    let bestWorker = this.workers[0];
    let minDuration = bestWorker.totalDuration;

    for (const worker of this.workers) {
      if (!worker.isBusy && worker.totalDuration < minDuration) {
        bestWorker = worker;
        minDuration = worker.totalDuration;
      }
    }

    // If all workers busy, wait for one to become available
    if (bestWorker.isBusy) {
      await this.waitForAvailableWorker();
      return this.getAvailableWorker();
    }

    return bestWorker;
  }

  /**
   * Submit a task to the pool
   */
  async submitTask(task: Task): Promise<void> {
    if (this.taskQueue.size() >= this.maxQueueSize) {
      throw new Error(`Task queue full (max ${this.maxQueueSize})`);
    }

    this.taskQueue.enqueue(task);

    // Try to assign immediately
    await this.processQueue();
  }

  /**
   * Process queued tasks
   */
  private async processQueue(): Promise<void> {
    while (!this.taskQueue.isEmpty()) {
      const worker = this.workers.find(w => !w.isBusy);
      if (!worker) break;

      const task = this.taskQueue.dequeue();
      if (task) {
        await this.assignTaskToWorker(worker, task);
      }
    }
  }

  /**
   * Assign task to worker
   */
  private async assignTaskToWorker(worker: WorkerImpl, task: Task): Promise<void> {
    worker.isBusy = true;
    worker.currentTask = task;

    const startTime = Date.now();

    try {
      // Execute task (mock implementation)
      await this.executeTask(task, worker);

      const duration = Date.now() - startTime;
      worker.recordExecution(duration, true);
      this.failureCount = Math.max(0, this.failureCount - 1);

      // Update metrics
      this.metrics.successfulPatterns++;
    } catch (error) {
      const duration = Date.now() - startTime;
      worker.recordExecution(duration, false);
      this.failureCount++;
      this.lastFailureTime = Date.now();

      // Update metrics
      this.metrics.failedPatterns++;

      // Check circuit breaker
      if (this.failureCount >= this.failureThreshold) {
        this.circuitBreakerState = 'open';
        console.error('Worker pool circuit breaker opened due to repeated failures');
      }
    } finally {
      worker.reset();
      await this.processQueue(); // Continue processing queue
    }
  }

  /**
   * Execute task (mock - replace with actual pattern execution)
   */
  private async executeTask(task: Task, worker: WorkerImpl): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeoutHandle = setTimeout(() => {
        reject(new Error(`Task ${task.id} timed out after ${task.timeout}ms`));
      }, task.timeout);

      // Simulate task execution
      const executionTime = Math.floor(Math.random() * Math.min(task.timeout / 2, 2000));
      setTimeout(() => {
        clearTimeout(timeoutHandle);
        if (Math.random() > 0.95) {
          // 5% failure rate for simulation
          reject(new Error(`Simulated failure in ${task.pattern}`));
        } else {
          resolve();
        }
      }, executionTime);
    });
  }

  /**
   * Wait for an available worker
   */
  private async waitForAvailableWorker(maxWait: number = 10000): Promise<void> {
    const startTime = Date.now();

    while (this.workers.every(w => w.isBusy)) {
      if (Date.now() - startTime > maxWait) {
        throw new Error(`Timeout waiting for available worker after ${maxWait}ms`);
      }

      await this.sleep(100);
    }
  }

  /**
   * Get pool metrics
   */
  getMetrics(): ParallelMetrics {
    const workerMetrics = new Map<string, WorkerMetrics>();

    for (const worker of this.workers) {
      workerMetrics.set(worker.id, worker.getMetrics());
    }

    const totalDuration = this.workers.reduce((sum, w) => sum + w.totalDuration, 0);
    const avgDuration = totalDuration / this.workers.length;

    return {
      totalPatterns: this.metrics.totalPatterns,
      successfulPatterns: this.metrics.successfulPatterns,
      failedPatterns: this.metrics.failedPatterns,
      sequentialDuration: totalDuration,
      parallelDuration: Math.max(...this.workers.map(w => w.totalDuration)),
      speedupFactor: this.workers.length,
      cacheHits: this.metrics.cacheHits,
      cacheMisses: this.metrics.cacheMisses,
      averageWorkerUtilization:
        this.workers.reduce((sum, w) => sum + w.calculateUtilization(), 0) /
        this.workers.length,
      workerMetrics,
    };
  }

  /**
   * Get worker statistics
   */
  getWorkerStats(): Array<{
    workerId: string;
    busy: boolean;
    tasksExecuted: number;
    successRate: number;
    avgDuration: number;
    utilization: number;
  }> {
    return this.workers.map(w => {
      const metrics = w.getMetrics();
      return {
        workerId: w.id,
        busy: w.isBusy,
        tasksExecuted: metrics.tasksExecuted,
        successRate:
          metrics.tasksExecuted > 0
            ? (metrics.successfulTasks / metrics.tasksExecuted) * 100
            : 0,
        avgDuration: metrics.averageDurationPerTask,
        utilization: w.calculateUtilization(),
      };
    });
  }

  /**
   * Get queue status
   */
  getQueueStatus(): {
    size: number;
    maxSize: number;
    utilization: number;
    pendingTasks: Task[];
  } {
    return {
      size: this.taskQueue.size(),
      maxSize: this.maxQueueSize,
      utilization: (this.taskQueue.size() / this.maxQueueSize) * 100,
      pendingTasks: this.taskQueue.getTasks(),
    };
  }

  /**
   * Get pool status
   */
  getPoolStatus(): {
    poolSize: number;
    activeWorkers: number;
    idleWorkers: number;
    circuitBreakerState: string;
    failureCount: number;
    queuedTasks: number;
  } {
    const activeWorkers = this.workers.filter(w => w.isBusy).length;

    return {
      poolSize: this.poolSize,
      activeWorkers,
      idleWorkers: this.poolSize - activeWorkers,
      circuitBreakerState: this.circuitBreakerState,
      failureCount: this.failureCount,
      queuedTasks: this.taskQueue.size(),
    };
  }

  /**
   * Reset pool
   */
  reset(): void {
    this.taskQueue.clear();
    for (const worker of this.workers) {
      worker.reset();
    }
    this.failureCount = 0;
    this.circuitBreakerState = 'closed';
    this.metrics = this.initializeMetrics();
  }

  /**
   * Gracefully shutdown pool
   */
  async shutdown(timeout: number = 30000): Promise<void> {
    const startTime = Date.now();

    // Wait for all tasks to complete
    while (this.workers.some(w => w.isBusy) && Date.now() - startTime < timeout) {
      await this.sleep(100);
    }

    // Force shutdown remaining tasks
    if (this.workers.some(w => w.isBusy)) {
      console.warn('Forced shutdown with active tasks');
    }

    this.reset();
  }

  /**
   * Utility sleep function
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Initialize metrics
   */
  private initializeMetrics(): ParallelMetrics {
    return {
      totalPatterns: 0,
      successfulPatterns: 0,
      failedPatterns: 0,
      sequentialDuration: 0,
      parallelDuration: 0,
      speedupFactor: 1,
      cacheHits: 0,
      cacheMisses: 0,
      averageWorkerUtilization: 0,
      workerMetrics: new Map(),
    };
  }
}

/**
 * Factory function to create worker pool
 */
export function createWorkerPool(poolSize: number = 4): WorkerPool {
  return new WorkerPool(poolSize);
}
