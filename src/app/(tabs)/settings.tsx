import React from 'react';
import { StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import { useCinelog } from '../../context/CinelogContext';
import { useAuth } from '../../context/AuthContext';
import { ThemedView } from '../../components/themed-view';
import { ThemedText } from '../../components/themed-text';
import { Colors } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const { theme, setThemePreference } = useCinelog();
  const { user, logout } = useAuth();
  const currentTheme = theme === 'system' ? 'dark' : theme;
  const colors = Colors[currentTheme];

  const themes = [
    { id: 'dark', label: 'Dark Theme', icon: 'moon' },
    { id: 'light', label: 'Light Theme', icon: 'sunny' }
  ] as const;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error: any) {
      Alert.alert('Logout Error', error.message);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Account</ThemedText>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: colors.backgroundElement }]}>
            <View style={styles.rowLeft}>
              <Ionicons name="person-circle" size={20} color={colors.text} style={styles.icon} />
              <ThemedText>{user?.email || 'Logged in'}</ThemedText>
            </View>
          </View>
          <TouchableOpacity style={styles.row} onPress={handleLogout}>
            <View style={styles.rowLeft}>
              <Ionicons name="log-out" size={20} color={colors.primary} style={styles.icon} />
              <ThemedText style={{ color: colors.primary, fontWeight: 'bold' }}>Log Out</ThemedText>
            </View>
          </TouchableOpacity>
        </View>
      </View>

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

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>About</ThemedText>
        <View style={[styles.card, { backgroundColor: colors.card, padding: 16 }]}>
          <ThemedText style={styles.aboutTitle}>CINELOG</ThemedText>
          <ThemedText style={[styles.aboutText, { color: colors.textSecondary }]}>
            Your personal movie and TV series tracker.
          </ThemedText>
          <View style={[styles.tmdbAttribution, { borderTopColor: colors.backgroundElement }]}>
            <ThemedText style={[styles.tmdbText, { color: colors.textSecondary }]}>
              This product uses the TMDB API but is not endorsed or certified by TMDB.
            </ThemedText>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 24,
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
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  tmdbAttribution: {
    borderTopWidth: 1,
    paddingTop: 16,
  },
  tmdbText: {
    fontSize: 12,
    fontStyle: 'italic',
    lineHeight: 18,
  },
});
