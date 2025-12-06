/**
 * Error State Component
 * Generic error display with retry action
 *
 * Presentation Layer - UI Component
 */

import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import {
  AtomicIcon,
  AtomicText,
  useAppDesignTokens,
  STATIC_TOKENS,
} from "@umituz/react-native-design-system";

export interface ErrorStateProps {
  /** Icon name from lucide-react-native */
  icon?: string;
  /** Error title */
  title: string;
  /** Error description */
  description?: string;
  /** Retry button label */
  actionLabel?: string;
  /** Retry action callback */
  onAction?: () => void;
  /** Custom illustration instead of icon */
  illustration?: React.ReactNode;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  icon = "AlertCircle",
  title,
  description,
  actionLabel,
  onAction,
  illustration,
}) => {
  const tokens = useAppDesignTokens();

  return (
    <View style={styles.container}>
      {illustration ? (
        illustration
      ) : (
        <View
          style={[styles.iconContainer, { backgroundColor: tokens.colors.surface }]}
        >
          <AtomicIcon name={icon} size="xxl" color="secondary" />
        </View>
      )}

      <AtomicText type="headlineSmall" color="primary" style={styles.title}>
        {title}
      </AtomicText>

      {description && (
        <AtomicText type="bodyMedium" color="secondary" style={styles.description}>
          {description}
        </AtomicText>
      )}

      {actionLabel && onAction && (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: tokens.colors.primary }]}
          onPress={onAction}
          activeOpacity={0.8}
        >
          <AtomicIcon name="RefreshCw" size="sm" color="onPrimary" />
          <AtomicText type="labelLarge" color="onPrimary">
            {actionLabel}
          </AtomicText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: STATIC_TOKENS.spacing.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: STATIC_TOKENS.spacing.lg,
  },
  title: {
    marginBottom: STATIC_TOKENS.spacing.sm,
    textAlign: "center",
  },
  description: {
    marginBottom: STATIC_TOKENS.spacing.lg,
    maxWidth: 280,
    textAlign: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: STATIC_TOKENS.spacing.lg,
    paddingVertical: STATIC_TOKENS.spacing.md,
    borderRadius: STATIC_TOKENS.borders.radius.full,
    marginTop: STATIC_TOKENS.spacing.sm,
    gap: STATIC_TOKENS.spacing.sm,
  },
});
