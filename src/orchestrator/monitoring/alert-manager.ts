/**
 * Alert Manager — Threshold-based alerting for performance degradation
 * Monitors metrics and triggers alerts when thresholds are exceeded
 */

import { MetricsCollector, AggregatedMetrics } from './metrics-collector';

/**
 * Alert severity levels
 */
export type AlertSeverity = 'info' | 'warning' | 'critical';

/**
 * Alert types
 */
export type AlertType =
  | 'latency-high'
  | 'error-rate-high'
  | 'cache-hit-low'
  | 'cpu-high'
  | 'memory-high'
  | 'throughput-low'
  | 'custom';

/**
 * Alert event
 */
export interface Alert {
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  metric: string;
  value: number;
  threshold: number;
  timestamp: number;
  triggered: boolean;
  resolvedAt?: number;
}

/**
 * Alert threshold configuration
 */
export interface AlertThreshold {
  type: AlertType;
  metric: string;
  threshold: number;
  severity: AlertSeverity;
  window: number; // milliseconds
  enabled: boolean;
}

/**
 * Alert manager for threshold-based monitoring
 */
export class AlertManager {
  private collector: MetricsCollector;
  private alerts: Map<AlertType, Alert> = new Map();
  private alertHistory: Alert[] = [];
  private thresholds: Map<AlertType, AlertThreshold> = new Map();
  private alertCallbacks: Map<AlertType, ((alert: Alert) => void)[]> = new Map();
  private maxHistorySize: number = 5000;

  constructor(collector: MetricsCollector) {
    this.collector = collector;
    this.initializeDefaultThresholds();
  }

  /**
   * Initialize default alert thresholds
   */
  private initializeDefaultThresholds(): void {
    this.setThreshold('latency-high', {
      type: 'latency-high',
      metric: 'averageDuration',
      threshold: 200, // ms
      severity: 'warning',
      window: 60000,
      enabled: true,
    });

    this.setThreshold('error-rate-high', {
      type: 'error-rate-high',
      metric: 'errorRate',
      threshold: 5, // percentage
      severity: 'critical',
      window: 60000,
      enabled: true,
    });

    this.setThreshold('cache-hit-low', {
      type: 'cache-hit-low',
      metric: 'cacheHitRate',
      threshold: 20, // percentage (inverted - below threshold)
      severity: 'info',
      window: 300000,
      enabled: true,
    });

    this.setThreshold('cpu-high', {
      type: 'cpu-high',
      metric: 'cpu',
      threshold: 85, // percentage
      severity: 'critical',
      window: 60000,
      enabled: true,
    });

    this.setThreshold('memory-high', {
      type: 'memory-high',
      metric: 'memory',
      threshold: 85, // percentage
      severity: 'critical',
      window: 60000,
      enabled: true,
    });

    this.setThreshold('throughput-low', {
      type: 'throughput-low',
      metric: 'throughput',
      threshold: 1, // exec/sec (inverted - below threshold)
      severity: 'warning',
      window: 60000,
      enabled: true,
    });
  }

  /**
   * Evaluate all alert conditions
   */
  evaluateAlerts(): Alert[] {
    const newAlerts: Alert[] = [];
    const metrics = this.collector.getAggregatedMetrics(60000);
    const systemMetrics = this.collector.getCurrentSystemMetrics();

    for (const [type, threshold] of this.thresholds) {
      if (!threshold.enabled) continue;

      const alert = this.evaluateAlert(type, threshold, metrics, systemMetrics);
      if (alert) {
        newAlerts.push(alert);
        this.alerts.set(type, alert);

        // Trigger callbacks
        const callbacks = this.alertCallbacks.get(type) || [];
        callbacks.forEach(cb => cb(alert));
      } else {
        // Resolve alert if it was previously triggered
        const previousAlert = this.alerts.get(type);
        if (previousAlert && previousAlert.triggered) {
          previousAlert.triggered = false;
          previousAlert.resolvedAt = Date.now();
        }
      }
    }

    // Record to history
    newAlerts.forEach(alert => {
      this.alertHistory.push(alert);
    });

    // Trim history
    if (this.alertHistory.length > this.maxHistorySize) {
      this.alertHistory = this.alertHistory.slice(-this.maxHistorySize);
    }

    return newAlerts;
  }

  /**
   * Get current active alerts
   */
  getActiveAlerts(): Alert[] {
    return Array.from(this.alerts.values()).filter(a => a.triggered);
  }

  /**
   * Get alert history
   */
  getAlertHistory(type?: AlertType, limit: number = 100): Alert[] {
    let history = this.alertHistory;

    if (type) {
      history = history.filter(a => a.type === type);
    }

    return history.slice(-limit);
  }

  /**
   * Set alert threshold
   */
  setThreshold(type: AlertType, threshold: AlertThreshold): void {
    this.thresholds.set(type, { ...threshold, type });

    // Initialize alert callbacks array if not exists
    if (!this.alertCallbacks.has(type)) {
      this.alertCallbacks.set(type, []);
    }
  }

  /**
   * Get alert threshold
   */
  getThreshold(type: AlertType): AlertThreshold | undefined {
    return this.thresholds.get(type);
  }

  /**
   * Get all thresholds
   */
  getAllThresholds(): AlertThreshold[] {
    return Array.from(this.thresholds.values());
  }

  /**
   * Enable/disable alert type
   */
  setAlertEnabled(type: AlertType, enabled: boolean): void {
    const threshold = this.thresholds.get(type);
    if (threshold) {
      threshold.enabled = enabled;
    }
  }

  /**
   * Register callback for alert
   */
  onAlert(type: AlertType, callback: (alert: Alert) => void): () => void {
    if (!this.alertCallbacks.has(type)) {
      this.alertCallbacks.set(type, []);
    }

    const callbacks = this.alertCallbacks.get(type)!;
    callbacks.push(callback);

    // Return unsubscribe function
    return () => {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  /**
   * Get alert statistics
   */
  getAlertStats(): {
    totalAlerts: number;
    activeAlerts: number;
    alertsByType: Map<AlertType, number>;
    alertBySeverity: Map<AlertSeverity, number>;
  } {
    const activeAlerts = this.getActiveAlerts();
    const alertsByType = new Map<AlertType, number>();
    const alertBySeverity = new Map<AlertSeverity, number>();

    for (const alert of this.alertHistory) {
      alertsByType.set(alert.type, (alertsByType.get(alert.type) || 0) + 1);
      alertBySeverity.set(alert.severity, (alertBySeverity.get(alert.severity) || 0) + 1);
    }

    return {
      totalAlerts: this.alertHistory.length,
      activeAlerts: activeAlerts.length,
      alertsByType,
      alertBySeverity,
    };
  }

  /**
   * Clear alert history
   */
  clearHistory(): void {
    this.alertHistory = [];
  }

  /**
   * Clear specific alert type history
   */
  clearAlertType(type: AlertType): void {
    this.alertHistory = this.alertHistory.filter(a => a.type !== type);
  }

  /**
   * Private: Evaluate single alert condition
   */
  private evaluateAlert(
    type: AlertType,
    threshold: AlertThreshold,
    metrics: AggregatedMetrics,
    systemMetrics: any
  ): Alert | null {
    let value = 0;
    let isTriggered = false;

    switch (type) {
      case 'latency-high':
        value = metrics.averageDuration;
        isTriggered = value > threshold.threshold;
        break;

      case 'error-rate-high':
        value = metrics.errorRate;
        isTriggered = value > threshold.threshold;
        break;

      case 'cache-hit-low':
        value = metrics.cacheHitRate;
        isTriggered = value < threshold.threshold; // Inverted
        break;

      case 'cpu-high':
        value = systemMetrics.cpuUsagePercent;
        isTriggered = value > threshold.threshold;
        break;

      case 'memory-high':
        value = systemMetrics.memoryUsagePercent;
        isTriggered = value > threshold.threshold;
        break;

      case 'throughput-low':
        value = metrics.throughput;
        isTriggered = value < threshold.threshold; // Inverted
        break;

      default:
        return null;
    }

    if (!isTriggered) {
      return null;
    }

    return {
      type,
      severity: threshold.severity,
      message: this.generateAlertMessage(type, value, threshold.threshold),
      metric: threshold.metric,
      value,
      threshold: threshold.threshold,
      timestamp: Date.now(),
      triggered: true,
    };
  }

  /**
   * Private: Generate alert message
   */
  private generateAlertMessage(type: AlertType, value: number, threshold: number): string {
    switch (type) {
      case 'latency-high':
        return `Average latency ${value.toFixed(0)}ms exceeds threshold ${threshold}ms`;

      case 'error-rate-high':
        return `Error rate ${value.toFixed(1)}% exceeds threshold ${threshold}%`;

      case 'cache-hit-low':
        return `Cache hit rate ${value.toFixed(1)}% below threshold ${threshold}%`;

      case 'cpu-high':
        return `CPU usage ${value.toFixed(1)}% exceeds threshold ${threshold}%`;

      case 'memory-high':
        return `Memory usage ${value.toFixed(1)}% exceeds threshold ${threshold}%`;

      case 'throughput-low':
        return `Throughput ${value.toFixed(2)} exec/sec below threshold ${threshold} exec/sec`;

      default:
        return `Alert condition triggered: ${value} vs threshold ${threshold}`;
    }
  }
}

/**
 * Factory function to create alert manager
 */
export function createAlertManager(collector: MetricsCollector): AlertManager {
  return new AlertManager(collector);
}
