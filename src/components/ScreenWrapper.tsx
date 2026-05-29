import React, { ReactNode } from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ViewStyle, StyleProp } from 'react-native';

interface ScreenWrapperProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function ScreenWrapper({ children, style }: ScreenWrapperProps) {
  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      style={[{ flex: 1 }, style]}
    >
      {children}
    </Animated.View>
  );
}
