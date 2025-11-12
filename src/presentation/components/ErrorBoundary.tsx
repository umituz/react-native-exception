/**
 * Error Boundary Component
 * Catches React errors and provides fallback UI
 */

import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { exceptionService } from '../../infrastructure/services/ExceptionService';
import { useAppDesignTokens } from '@umituz/react-native-design-system-theme';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to exception service
    exceptionService.handleFatalError(error, {
      componentStack: errorInfo.componentStack ?? undefined,
      screen: 'ErrorBoundary',
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorDisplay error={this.state.error} onReset={this.handleReset} />
      );
    }

    return this.props.children;
  }
}

interface ErrorDisplayProps {
  error: Error | null;
  onReset: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onReset }) => {
  const tokens = useAppDesignTokens();
  const styles = getStyles(tokens);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>
        {error?.message || 'An unexpected error occurred'}
      </Text>
      <TouchableOpacity style={styles.button} onPress={onReset}>
        <Text style={styles.buttonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (tokens: ReturnType<typeof useAppDesignTokens>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: tokens.spacing.lg,
      backgroundColor: tokens.colors.backgroundPrimary,
    },
    title: {
      fontSize: tokens.typography.headlineSmall.fontSize,
      fontWeight: tokens.typography.headlineSmall.fontWeight,
      marginBottom: tokens.spacing.sm,
      color: tokens.colors.textPrimary,
    },
    message: {
      fontSize: tokens.typography.bodyLarge.fontSize,
      color: tokens.colors.textSecondary,
      textAlign: 'center',
      marginBottom: tokens.spacing.lg,
    },
    button: {
      backgroundColor: tokens.colors.primary,
      paddingHorizontal: tokens.spacing.lg,
      paddingVertical: tokens.spacing.sm,
      borderRadius: tokens.borders.radius.sm,
    },
    buttonText: {
      color: tokens.colors.textInverse,
      fontSize: tokens.typography.bodyLarge.fontSize,
      fontWeight: tokens.typography.labelLarge.fontWeight,
    },
  });








