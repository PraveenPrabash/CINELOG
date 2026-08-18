import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './themed-text';
import { Colors } from '../constants/theme';
import { useCinelog } from '../context/CinelogContext';

interface FilterBarProps {
  filters: string[];
  activeFilter: string;
  onSelect: (filter: string) => void;
}

export function FilterBar({ filters, activeFilter, onSelect }: FilterBarProps) {
  const { theme } = useCinelog();
  const colors = Colors[theme === 'system' ? 'dark' : theme];

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {filters.map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <TouchableOpacity
              key={filter}
              onPress={() => onSelect(filter)}
              style={[
                styles.pill,
                {
                  backgroundColor: isActive ? colors.primary : colors.backgroundElement,
                  borderColor: isActive ? colors.primary : colors.backgroundElement,
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.pillText,
                  { color: isActive ? '#000' : colors.text },
                ]}
              >
                {filter}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  pillText: {
    fontWeight: '600',
  },
});
