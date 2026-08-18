import { View, type ViewProps } from 'react-native';

import { Colors, ThemeColor } from '../constants/theme';
import { useCinelog } from '../context/CinelogContext';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: ThemeColor;
};

export function ThemedView({ style, lightColor, darkColor, type, ...otherProps }: ThemedViewProps) {
  const { theme } = useCinelog();
  const currentTheme = theme === 'system' ? 'dark' : theme;
  const colors = Colors[currentTheme];

  return <View style={[{ backgroundColor: colors[type ?? 'background'] }, style]} {...otherProps} />;
}
