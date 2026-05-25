import { TextStyle } from 'react-native';

export const Typography: Record<string, TextStyle> = {
  h1: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
  },
  h4: {
    fontSize: 16,
    fontWeight: '600',
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '400',
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  tab: {
    fontSize: 11,
    fontWeight: '500',
  },
  number: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
};

export const FontFamily = {
  regular: undefined,
  bold: undefined,
  mono: undefined,
};
