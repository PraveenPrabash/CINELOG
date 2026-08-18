import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { WatchedItem } from '../types';
import { useCinelog } from '../context/CinelogContext';
import { Colors } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface StatsCardProps {
  collection: WatchedItem[];
}

export function StatsCard({ collection }: StatsCardProps) {
  const { theme } = useCinelog();
  const currentTheme = theme === 'system' ? 'dark' : theme;
  const colors = Colors[currentTheme];

  const totalWatched = collection.length;
  
  const averageRating = totalWatched > 0 
    ? (collection.reduce((sum, item) => sum + item.rating, 0) / totalWatched).toFixed(1)
    : '0.0';

  const totalRuntimeMins = collection.reduce((sum, item) => sum + (item.runtime || 0), 0);
  const runtimeHours = Math.floor(totalRuntimeMins / 60);
  const runtimeMins = totalRuntimeMins % 60;
  const watchTimeStr = totalRuntimeMins > 0 
    ? `${runtimeHours}h ${runtimeMins}m`
    : '0h 0m';

  const totalMovies = collection.filter(item => item.type === 'movie').length;
  const totalSeries = collection.filter(item => item.type === 'series').length;

  // Calculate most watched genre
  let topGenre = 'None';
  if (totalWatched > 0) {
    const genreCounts: Record<string, number> = {};
    collection.forEach(item => {
      item.genres.forEach(g => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      });
    });
    topGenre = Object.keys(genreCounts).reduce((a, b) => genreCounts[a] > genreCounts[b] ? a : b, 'None');
  }

  if (totalWatched === 0) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.backgroundElement }]}>
      <ThemedText style={styles.title}>My Collection</ThemedText>
      
      <View style={styles.grid}>
        <View style={styles.statBox}>
          <ThemedText style={styles.statLabel}>🎬 Total Watched</ThemedText>
          <ThemedText style={[styles.statValue, { color: colors.primary }]}>{totalWatched}</ThemedText>
        </View>

        <View style={styles.statBox}>
          <ThemedText style={styles.statLabel}>⭐ Avg Rating</ThemedText>
          <ThemedText style={[styles.statValue, { color: colors.primary }]}>{averageRating}</ThemedText>
        </View>

        <View style={styles.statBox}>
          <ThemedText style={styles.statLabel}>⏱ Watch Time</ThemedText>
          <ThemedText style={[styles.statValue, { color: colors.primary }]}>{watchTimeStr}</ThemedText>
        </View>

        <View style={styles.statBox}>
          <ThemedText style={styles.statLabel}>🎞 Movies</ThemedText>
          <ThemedText style={[styles.statValue, { color: colors.text }]}>{totalMovies}</ThemedText>
        </View>

        <View style={styles.statBox}>
          <ThemedText style={styles.statLabel}>📺 TV Series</ThemedText>
          <ThemedText style={[styles.statValue, { color: colors.text }]}>{totalSeries}</ThemedText>
        </View>

        <View style={styles.statBox}>
          <ThemedText style={styles.statLabel}>🏆 Top Genre</ThemedText>
          <ThemedText style={[styles.statValue, { color: colors.text }]} numberOfLines={1}>
            {topGenre}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.9,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  statBox: {
    width: '30%',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    opacity: 0.7,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
