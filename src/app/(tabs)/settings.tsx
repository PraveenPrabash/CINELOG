import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useCinelog } from '../../context/CinelogContext';
import { ThemedView } from '../../components/themed-view';
import { ThemedText } from '../../components/themed-text';
import { Colors } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const { theme, setThemePreference } = useCinelog();
  const currentTheme = theme === 'system' ? 'dark' : theme;
  const colors = Colors[currentTheme];

  const themes = [
    { id: 'dark', label: 'Dark Theme', icon: 'moon' },
    { id: 'light', label: 'Light Theme', icon: 'sunny' }
  ] as const;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Appearance</ThemedText>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {themes.map((t, index) => (
            <TouchableOpacity
              key={t.id}
              style={[
                styles.row,
                index < themes.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.backgroundElement }
              ]}
              onPress={() => setThemePreference(t.id)}
            >
              <View style={styles.rowLeft}>
                <Ionicons name={t.icon as any} size={20} color={colors.text} style={styles.icon} />
                <ThemedText>{t.label}</ThemedText>
              </View>
              {theme === t.id && (
                <Ionicons name="checkmark" size={20} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
    opacity: 0.7,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
});
