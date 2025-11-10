/**
 * Exception Repository Interface
 * Defines contracts for error logging and reporting
 */

import type { ExceptionEntity, ErrorLog } from '../entities/ExceptionEntity';

export interface ExceptionRepositoryError extends Error {
  code: 'LOG_FAILED' | 'REPORT_FAILED' | 'FETCH_FAILED';
}

export type ExceptionResult<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: ExceptionRepositoryError;
};

export interface IExceptionRepository {
  /**
   * Log an exception
   */
  logException(exception: ExceptionEntity): Promise<ExceptionResult<ErrorLog>>;

  /**
   * Report exception to external service (e.g., Sentry)
   */
  reportException(exception: ExceptionEntity): Promise<ExceptionResult<boolean>>;

  /**
   * Get error logs for a user
   */
  getErrorLogs(userId: string, limit?: number): Promise<ExceptionResult<ErrorLog[]>>;

  /**
   * Get recent exceptions
   */
  getRecentExceptions(limit?: number): Promise<ExceptionResult<ExceptionEntity[]>>;

  /**
   * Clear error logs
   */
  clearErrorLogs(userId: string): Promise<ExceptionResult<boolean>>;
}










