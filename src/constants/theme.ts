/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// @ts-ignore
import '../global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#041C32',
    background: '#f4f4f5',
    backgroundElement: '#e4e4e7',
    backgroundSelected: '#d4d4d8',
    textSecondary: '#064663',
    primary: '#ECB365', // Gold accent
    card: '#ffffff',
  },
  dark: {
    text: '#ffffff',
    background: '#041C32',
    backgroundElement: '#064663', // Secondary surfaces
    backgroundSelected: '#04293A', // Cards/surfaces
    textSecondary: '#8ba2b3', // Muted blue/gray
    primary: '#ECB365', // Gold accent
    card: '#04293A',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
