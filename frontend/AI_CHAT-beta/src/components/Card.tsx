import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { COLORS, SPACING } from '../constants';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: number;
  margin?: number;
  shadow?: boolean;
  borderRadius?: number;
  backgroundColor?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  onPress,
  style,
  padding = SPACING.md,
  margin = 0,
  shadow = true,
  borderRadius = 12,
  backgroundColor = COLORS.surface,
}) => {
  const cardStyle = [
    styles.card,
    {
      padding,
      margin,
      borderRadius,
      backgroundColor,
    },
    shadow && styles.shadow,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity style={cardStyle} onPress={onPress} activeOpacity={0.7}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
  },
  shadow: {
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default Card;
