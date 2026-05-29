const React = require('react');
const { View } = require('react-native');

const chainable = () => {
  const handler = {
    get: () => chainable(),
    apply: () => chainable(),
  };
  return new Proxy(() => ({}), handler);
};

const Reanimated = {
  View: View,
  Text: View,
  Image: View,
  ScrollView: View,
  FlatList: View,
  createAnimatedComponent: (Comp) => {
    const AnimatedComp = React.forwardRef((props, ref) =>
      React.createElement(Comp, { ...props, ref }),
    );
    AnimatedComp.displayName = 'AnimatedComponent';
    return AnimatedComp;
  },
  Easing: {
    out: () => 'out',
    in: () => 'in',
    inOut: () => 'inOut',
    ease: 'ease',
    linear: 'linear',
    quad: 'quad',
    cubic: 'cubic',
  },
  FadeInDown: chainable(),
  FadeInUp: chainable(),
  FadeIn: chainable(),
  FadeOut: chainable(),
  FadeOutUp: chainable(),
  FadeOutDown: chainable(),
  Layout: chainable(),
  BounceIn: chainable(),
  SlideInRight: chainable(),
  SlideInLeft: chainable(),
  withTiming: (val) => val,
  withSpring: (val) => val,
  withRepeat: (val) => val,
  useSharedValue: (val) => ({ value: val }),
  useAnimatedStyle: (cb) => cb(),
  useDerivedValue: (cb) => cb(),
  runOnJS: (fn) => fn,
  runOnUI: (fn) => fn,
  default: {},
};

module.exports = Reanimated;
