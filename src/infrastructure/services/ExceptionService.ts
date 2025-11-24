/**
 * Exception Service - Infrastructure Layer
 *
 * Facade for exception handling using composition.
 * Delegates to specialized services for specific operations.
 *
 * SOLID: Facade pattern - Single entry point, delegates to specialists
 * DRY: Avoids code duplication by composing smaller services
 * KISS: Simple interface, complex operations delegated
 */

import type {
  ExceptionEntity,
  ExceptionContext,
  ExceptionSeverity,
  ExceptionCategory,
} from '../../domain/entities/ExceptionEntity';
import { ExceptionHandler } from './ExceptionHandler';
import { ExceptionReporter } from './ExceptionReporter';
import { ExceptionLogger } from './ExceptionLogger';
import { useExceptionStore } from '../storage/ExceptionStore';

export class ExceptionService {
  private logger: ExceptionLogger;
  private reporter: ExceptionReporter;

  constructor(reporterConfig?: ExceptionReporter['config']) {
    this.logger = new ExceptionLogger();
    this.reporter = new ExceptionReporter(
      reporterConfig || {
        enabled: false,
        environment: 'development'
      }
    );
  }

  /**
   * Handle an exception
   */
  async handleException(
    error: Error,
    severity: ExceptionSeverity = 'error',
    category: ExceptionCategory = 'unknown',
    context: ExceptionContext = {},
  ): Promise<void> {
    const exception = ExceptionHandler.createException(error, severity, category, context);

    // Add to store
    useExceptionStore.getState().addException(exception);

    // Log locally
    await this.logger.logException(exception);

    // Report to external service if needed
    if (ExceptionHandler.shouldReportException(exception)) {
      await this.reporter.reportException(exception);
    }

    // Mark as handled
    useExceptionStore.getState().markAsHandled(exception.id);
  }

  /**
   * Handle network errors
   */
  async handleNetworkError(error: Error, context: ExceptionContext = {}): Promise<void> {
    await this.handleException(error, 'error', 'network', context);
  }

  /**
   * Handle validation errors
   */
  async handleValidationError(error: Error, context: ExceptionContext = {}): Promise<void> {
    await this.handleException(error, 'warning', 'validation', context);
  }

  /**
   * Handle authentication errors
   */
  async handleAuthError(error: Error, context: ExceptionContext = {}): Promise<void> {
    await this.handleException(error, 'error', 'authentication', context);
  }

  /**
   * Handle system errors
   */
  async handleSystemError(error: Error, context: ExceptionContext = {}): Promise<void> {
    await this.handleException(error, 'fatal', 'system', context);
  }

  /**
   * Get stored exceptions
   */
  async getStoredExceptions(): Promise<ExceptionEntity[]> {
    return this.logger.getStoredExceptions();
  }

  /**
   * Get exception statistics
   */
  async getExceptionStats() {
    return this.logger.getExceptionStats();
  }

  /**
   * Clear stored exceptions
   */
  async clearStoredExceptions(): Promise<void> {
    await this.logger.clearStoredExceptions();
  }

  /**
   * Update reporter configuration
   */
  updateReporterConfig(config: Partial<ExceptionReporter['config']>): void {
    this.reporter.updateConfig(config);
  }

  /**
   * Set max stored exceptions
   */
  setMaxStoredExceptions(limit: number): void {
    this.logger.setMaxStoredExceptions(limit);
  }

  /**
   * Handle storage/permission errors
   */
  handleStorageError(error: Error, context: ExceptionContext = {}): void {
    this.handleException(error, 'error', 'storage', context);
  }

  /**
   * Handle fatal errors
   */
  handleFatalError(error: Error, context: ExceptionContext = {}): void {
    this.handleException(error, 'fatal', 'system', context);
  }

  /**
   * Clear all exceptions
   */
  clearExceptions(): void {
    useExceptionStore.getState().clearExceptions();
  }
}

// Export for backward compatibility - create default instance
export const exceptionService = new ExceptionService();




















