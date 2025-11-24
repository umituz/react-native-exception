/**
 * Exception Handler Service
 *
 * Handles exception creation, validation, and basic processing.
 *
 * SOLID: Single Responsibility - Only exception handling
 * DRY: Centralized exception processing logic
 * KISS: Simple exception handling interface
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

export class ExceptionHandler {
  /**
   * Create and validate an exception
   */
  static createException(
    error: Error,
    severity: ExceptionSeverity = 'error',
    category: ExceptionCategory = 'unknown',
    context: ExceptionContext = {},
  ): ExceptionEntity {
    return createException(error, severity, category, context);
  }

  /**
   * Check if exception should be reported
   */
  static shouldReportException(exception: ExceptionEntity): boolean {
    return shouldReportException(exception);
  }

  /**
   * Validate exception data
   */
  static validateException(exception: ExceptionEntity): boolean {
    return !!(
      exception.id &&
      exception.message &&
      exception.timestamp &&
      exception.severity &&
      exception.category
    );
  }

  /**
   * Sanitize exception for logging
   */
  static sanitizeException(exception: ExceptionEntity): ExceptionEntity {
    return {
      ...exception,
      message: this.sanitizeMessage(exception.message),
      context: this.sanitizeContext(exception.context),
    };
  }

  /**
   * Sanitize error message
   */
  private static sanitizeMessage(message: string): string {
    // Remove sensitive information from error messages
    return message
      .replace(/password=[^&\s]*/gi, 'password=***')
      .replace(/token=[^&\s]*/gi, 'token=***')
      .replace(/key=[^&\s]*/gi, 'key=***');
  }

  /**
   * Sanitize context object
   */
  private static sanitizeContext(context: ExceptionContext): ExceptionContext {
    const sanitized: ExceptionContext = { ...context };

    // Remove sensitive fields
    const sensitiveFields = ['password', 'token', 'apiKey', 'secret'];
    sensitiveFields.forEach(field => {
      if (sanitized[field as keyof ExceptionContext]) {
        (sanitized as any)[field] = '***';
      }
    });

    return sanitized;
  }
}
