/**
 * Exception Entity - Domain Layer
 * Pure business logic representation of errors and exceptions
 */

import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export type ExceptionSeverity = 'fatal' | 'error' | 'warning' | 'info';
export type ExceptionCategory = 'network' | 'validation' | 'authentication' | 'authorization' | 'business-logic' | 'system' | 'storage' | 'unknown';

export interface ExceptionContext {
  userId?: string;
  screen?: string;
  action?: string;
  componentStack?: string;
  metadata?: Record<string, any>;
}

export interface ExceptionEntity {
  id: string;
  message: string;
  stack?: string;
  severity: ExceptionSeverity;
  category: ExceptionCategory;
  context: ExceptionContext;
  timestamp: Date;
  handled: boolean;
  reported: boolean;
}

export interface ErrorLog {
  id: string;
  exceptionId: string;
  userId?: string;
  message: string;
  stack?: string;
  severity: ExceptionSeverity;
  category: ExceptionCategory;
  context: ExceptionContext;
  createdAt: Date;
}

/**
 * Factory function to create an exception entity
 */
export function createException(
  error: Error,
  severity: ExceptionSeverity = 'error',
  category: ExceptionCategory = 'unknown',
  context: ExceptionContext = {}
): ExceptionEntity {
  return {
    id: uuidv4(),
    message: error.message,
    stack: error.stack,
    severity,
    category,
    context,
    timestamp: new Date(),
    handled: false,
    reported: false,
  };
}

/**
 * Factory function to create an error log
 */
export function createErrorLog(
  exception: ExceptionEntity
): ErrorLog {
  return {
    id: uuidv4(),
    exceptionId: exception.id,
    userId: exception.context.userId,
    message: exception.message,
    stack: exception.stack,
    severity: exception.severity,
    category: exception.category,
    context: exception.context,
    createdAt: new Date(),
  };
}

/**
 * Determine if exception should be reported
 */
export function shouldReportException(exception: ExceptionEntity): boolean {
  // Don't report warnings or info
  if (exception.severity === 'warning' || exception.severity === 'info') {
    return false;
  }

  // Don't report validation errors (user errors)
  if (exception.category === 'validation') {
    return false;
  }

  // Report everything else
  return true;
}















