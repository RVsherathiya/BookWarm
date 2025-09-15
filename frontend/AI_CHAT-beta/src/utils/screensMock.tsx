// Lightweight mock of `react-native-screens` so React Navigation
// can render using plain Views without native dependencies.
import React from 'react';
import { View, ViewProps } from 'react-native';

export const enableScreens = (_shouldEnable: boolean = true) => {
  // no-op; keeps API compatibility
};

export const screensEnabled = () => false;

type ChildrenProps = ViewProps & { children?: React.ReactNode };

export const ScreenContainer = ({ children, ...rest }: ChildrenProps) => (
  <View {...rest}>{children}</View>
);

export const Screen = ({ children, ...rest }: ChildrenProps) => (
  <View {...rest}>{children}</View>
);

export default {
  enableScreens,
  screensEnabled,
  Screen,
  ScreenContainer,
};
