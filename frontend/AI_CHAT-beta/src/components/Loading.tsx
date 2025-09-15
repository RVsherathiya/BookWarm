import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../constants';

interface LoadingProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  overlay?: boolean;
  style?: ViewStyle;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  color = COLORS.primary,
  text,
  overlay = false,
  style,
}) => {
  const containerStyle = [
    styles.container,
    overlay && styles.overlay,
    style,
  ];

  return (
    <View style={containerStyle}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1000,
  },
  text: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
});

export default Loading;
