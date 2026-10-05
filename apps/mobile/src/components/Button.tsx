import * as Haptics from 'expo-haptics';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { COLORS } from '../theme/colors';

interface ButtonProps {
  title: string;
  onPress: () => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  isLoading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  icon,
  style,
}: ButtonProps) {
  const handlePress = async () => {
    if (disabled || isLoading) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    onPress();
  };

  const getContainerStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.btnSecondary;
      case 'danger':
        return styles.btnDanger;
      case 'outline':
        return styles.btnOutline;
      case 'ghost':
        return styles.btnGhost;
      default:
        return styles.btnPrimary;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
      case 'ghost':
        return styles.textOutline;
      case 'danger':
        return styles.textDanger;
      default:
        return styles.textPrimary;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.base,
        getContainerStyle(),
        (disabled || isLoading) && styles.disabled,
        style,
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? COLORS.primary : '#ffffff'}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
          <Text style={[styles.textBase, getTextStyle()]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: {
    backgroundColor: COLORS.primary,
  },
  btnSecondary: {
    backgroundColor: COLORS.surfaceHover,
  },
  btnDanger: {
    backgroundColor: COLORS.danger,
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  btnGhost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  textBase: {
    fontSize: 15,
    fontWeight: '600',
  },
  textPrimary: {
    color: '#ffffff',
  },
  textOutline: {
    color: COLORS.textPrimary,
  },
  textDanger: {
    color: '#ffffff',
  },
});
