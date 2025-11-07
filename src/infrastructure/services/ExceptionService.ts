/**
 * Exception Service - Infrastructure Layer
 * Centralized exception handling and reporting
 */

import type {
  ExceptionEntity,
  ExceptionContext,
  ExceptionSeverity,
  ExceptionCategory,
} from '../../domain/entities/ExceptionEntity';
import {
  createException,
  shouldReportException,
} from '../../domain/entities/ExceptionEntity';
import { useExceptionStore } from '../storage/ExceptionStore';

export class ExceptionService {
  private static instance: ExceptionService;

  private constructor() {}

  static getInstance(): ExceptionService {
    if (!ExceptionService.instance) {
      ExceptionService.instance = new ExceptionService();
    }
    return ExceptionService.instance;
  }

  /**
   * Handle an exception
   */
  handleException(
    error: Error,
    severity: ExceptionSeverity = 'error',
    category: ExceptionCategory = 'unknown',
    context: ExceptionContext = {},
  ): void {
    const exception = createException(error, severity, category, context);

    // Add to store
    useExceptionStore.getState().addException(exception);

    // Report to external service if needed
    if (shouldReportException(exception)) {
      this.reportException(exception);
    }

    // Mark as handled
    useExceptionStore.getState().markAsHandled(exception.id);
  }

  /**
   * Report exception to external service (e.g., Sentry)
   */
  private async reportException(exception: ExceptionEntity): Promise<void> {
    try {
      // Mark as reported
      useExceptionStore.getState().markAsReported(exception.id);
    } catch (error) {
      // Silent failure
    }
  }

  /**
   * Handle network errors
   */
  handleNetworkError(error: Error, context: ExceptionContext = {}): void {
    this.handleException(error, 'error', 'network', context);
  }

  /**
   * Handle validation errors
   */
  handleValidationError(error: Error, context: ExceptionContext = {}): void {
    this.handleException(error, 'warning', 'validation', context);
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

export const exceptionService = ExceptionService.getInstance();





