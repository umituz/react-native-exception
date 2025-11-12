/**
 * @umituz/react-native-exception - Public API
 *
 * Exception handling and error tracking for React Native apps
 *
 * Usage:
 *   import { ErrorBoundary, exceptionService, useExceptionStore } from '@umituz/react-native-exception';
 */

// =============================================================================
// DOMAIN LAYER EXPORTS
// =============================================================================

// Entities
export type {
  ExceptionEntity,
  ErrorLog,
  ExceptionContext,
  ExceptionSeverity,
  ExceptionCategory,
} from './domain/entities/ExceptionEntity';
export {
  createException,
  createErrorLog,
  shouldReportException,
} from './domain/entities/ExceptionEntity';

// Repositories
export type {
  IExceptionRepository,
  ExceptionRepositoryError,
  ExceptionResult,
} from './domain/repositories/IExceptionRepository';

// =============================================================================
// INFRASTRUCTURE LAYER EXPORTS
// =============================================================================

// State Store (Zustand)
export { useExceptionStore, useExceptions } from './infrastructure/storage/ExceptionStore';

// Services
export { ExceptionService, exceptionService } from './infrastructure/services/ExceptionService';

// =============================================================================
// PRESENTATION LAYER EXPORTS
// =============================================================================

// Components
export { ErrorBoundary } from './presentation/components/ErrorBoundary';
export { EmptyState } from './presentation/components/EmptyState';
export type { EmptyStateProps } from './presentation/components/EmptyState';













