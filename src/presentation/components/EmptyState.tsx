/**
 * Empty State Component
 * Displays when no data is available
 *
 * Presentation Layer - UI Component
 */

import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { AtomicIcon, AtomicText, useAppDesignTokens, STATIC_TOKENS } from "@umituz/react-native-design-system";

export interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  illustration?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "inbox",
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
          style={[
            styles.iconContainer,
            { backgroundColor: tokens.colors.surface },
          ]}
        >
          <AtomicIcon name={icon} size="xxl" color="secondary" />
        </View>
      )}

      <AtomicText
        type="headlineSmall"
        color="primary"
        style={[styles.title, { textAlign: "center" }]}
      >
        {title}
      </AtomicText>

      {description && (
        <AtomicText
          type="bodyMedium"
          color="secondary"
          style={[styles.description, { textAlign: "center" }]}
        >
          {description}
        </AtomicText>
      )}

      {actionLabel && onAction && (
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: tokens.colors.primary },
          ]}
          onPress={onAction}
          activeOpacity={0.8}
        >
          <AtomicText
            type="labelLarge"
            color="onPrimary"
            style={styles.actionButtonText}
          >
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
  },
  description: {
    marginBottom: STATIC_TOKENS.spacing.lg,
    maxWidth: 280,
  },
  actionButton: {
    paddingHorizontal: STATIC_TOKENS.spacing.lg,
    paddingVertical: STATIC_TOKENS.spacing.md,
    borderRadius: STATIC_TOKENS.borders.radius.md,
    marginTop: STATIC_TOKENS.spacing.sm,
  },
  actionButtonText: {
    // AtomicText handles typography
  },
});

