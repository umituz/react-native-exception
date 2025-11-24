/**
 * Exception Reporter Service
 *
 * Handles reporting exceptions to external services.
 *
 * SOLID: Single Responsibility - Only exception reporting
 * DRY: Centralized reporting logic
 * KISS: Simple reporting interface
 */

import type { ExceptionEntity } from '../../domain/entities/ExceptionEntity';

export interface ExceptionReporterConfig {
  enabled: boolean;
  endpoint?: string;
  apiKey?: string;
  environment: 'development' | 'staging' | 'production';
}

export class ExceptionReporter {
  private config: ExceptionReporterConfig;

  constructor(config: ExceptionReporterConfig) {
    this.config = config;
  }

  /**
   * Report exception to external service
   */
  async reportException(exception: ExceptionEntity): Promise<boolean> {
    if (!this.config.enabled) {
      return false;
    }

    try {
      // Default console reporting for development
      if (this.config.environment === 'development') {
        return this.reportToConsole(exception);
      }

      // External service reporting
      if (this.config.endpoint) {
        return await this.reportToExternalService(exception);
      }

      return false;
    } catch (error) {
      // Don't throw in reporter to avoid infinite loops
      console.warn('Exception reporting failed:', error);
      return false;
    }
  }

  /**
   * Report to console (development)
   */
  private reportToConsole(exception: ExceptionEntity): boolean {
    const level = this.getConsoleLevel(exception.severity);

    console[level](
      `[${exception.severity.toUpperCase()}] ${exception.category}:`,
      exception.message,
      {
        id: exception.id,
        timestamp: exception.timestamp,
        context: exception.context,
        stack: exception.stackTrace,
      }
    );

    return true;
  }

  /**
   * Report to external service
   */
  private async reportToExternalService(exception: ExceptionEntity): Promise<boolean> {
    if (!this.config.endpoint) {
      return false;
    }

    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
      },
      body: JSON.stringify({
        id: exception.id,
        message: exception.message,
        severity: exception.severity,
        category: exception.category,
        timestamp: exception.timestamp,
        context: exception.context,
        stackTrace: exception.stackTrace,
        environment: this.config.environment,
      }),
    });

    return response.ok;
  }

  /**
   * Get console level for severity
   */
  private getConsoleLevel(severity: ExceptionEntity['severity']): 'log' | 'warn' | 'error' {
    switch (severity) {
      case 'fatal':
      case 'error':
        return 'error';
      case 'warning':
        return 'warn';
      default:
        return 'log';
    }
  }

  /**
   * Update reporter configuration
   */
  updateConfig(config: Partial<ExceptionReporterConfig>): void {
    this.config = { ...this.config, ...config };
  }
}
