import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import Animated, { FadeInDown, FadeInUp, Easing } from 'react-native-reanimated';
import { Spacing, BorderRadius } from '../theme/spacing';
import { useTheme } from '../hooks/useTheme';

interface AnimatedCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  index?: number;
  direction?: 'up' | 'down';
}

const enteringAnimations = {
  up: FadeInUp,
  down: FadeInDown,
};

export function AnimatedCard({ children, onPress, style, index = 0, direction = 'down' }: AnimatedCardProps) {
  const { colors } = useTheme();
  const AnimComponent = onPress ? Animated.createAnimatedComponent(TouchableOpacity) : Animated.View;
  const EnterAnim = enteringAnimations[direction];

  return (
    <AnimComponent
      entering={EnterAnim.delay(index * 80).duration(300).easing(Easing.out(Easing.ease))}
      style={[{
        backgroundColor: colors.surface,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: Spacing.lg,
      }, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {children}
    </AnimComponent>
  );
}
