/**
 * Exception Store - Zustand State Management
 * Global exception tracking and error state
 */

import { create } from 'zustand';
import type { ExceptionEntity } from '../../domain/entities/ExceptionEntity';

interface ExceptionStore {
  // State
  exceptions: ExceptionEntity[];
  lastError: ExceptionEntity | null;
  errorCount: number;

  // Actions
  addException: (exception: ExceptionEntity) => void;
  markAsHandled: (exceptionId: string) => void;
  markAsReported: (exceptionId: string) => void;
  clearExceptions: () => void;
  getExceptionsByCategory: (category: string) => ExceptionEntity[];
  getUnhandledExceptions: () => ExceptionEntity[];
}

export const useExceptionStore = create<ExceptionStore>((set, get) => ({
  exceptions: [],
  lastError: null,
  errorCount: 0,

  addException: (exception) => {
    const { exceptions } = get();
    set({
      exceptions: [exception, ...exceptions].slice(0, 100), // Keep last 100
      lastError: exception,
      errorCount: get().errorCount + 1,
    });
  },

  markAsHandled: (exceptionId) => {
    const { exceptions } = get();
    const updated = exceptions.map((ex) =>
      ex.id === exceptionId ? { ...ex, handled: true } : ex
    );
    set({ exceptions: updated });
  },

  markAsReported: (exceptionId) => {
    const { exceptions } = get();
    const updated = exceptions.map((ex) =>
      ex.id === exceptionId ? { ...ex, reported: true } : ex
    );
    set({ exceptions: updated });
  },

  clearExceptions: () => set({ exceptions: [], lastError: null }),

  getExceptionsByCategory: (category) => {
    const { exceptions } = get();
    return exceptions.filter((ex) => ex.category === category);
  },

  getUnhandledExceptions: () => {
    const { exceptions } = get();
    return exceptions.filter((ex) => !ex.handled);
  },
}));

/**
 * Hook for accessing exception state
 */
export const useExceptions = () => {
  const {
    exceptions,
    lastError,
    errorCount,
    addException,
    markAsHandled,
    markAsReported,
    clearExceptions,
    getExceptionsByCategory,
    getUnhandledExceptions,
  } = useExceptionStore();

  return {
    exceptions,
    lastError,
    errorCount,
    addException,
    markAsHandled,
    markAsReported,
    clearExceptions,
    getExceptionsByCategory,
    getUnhandledExceptions,
  };
};













