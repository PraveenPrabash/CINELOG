import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from './themed-text';
import { WatchedItem } from '../types';
import { useCinelog } from '../context/CinelogContext';
import { Colors } from '../constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

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
  const watchTimeStr = totalRuntimeMins > 0 ? `${runtimeHours}h ${runtimeMins}m` : '0h 0m';

  const totalMovies = collection.filter(item => item.type === 'movie').length;
  const totalSeries = collection.filter(item => item.type === 'series').length;

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
      {/* Top Left Gold Glow Effect Fake Line */}
      <View style={[styles.goldLine, { backgroundColor: colors.primary }]} />
      <View style={[styles.goldDot, { backgroundColor: colors.primary }]} />
      
      <View style={styles.headerRow}>
        <ThemedText style={styles.title}>MY COLLECTION</ThemedText>
        <TouchableOpacity style={[styles.insightsPill, { backgroundColor: colors.backgroundElement }]}>
          <Ionicons name="bar-chart" size={12} color={colors.textSecondary} />
          <ThemedText style={[styles.insightsText, { color: colors.textSecondary }]}>View Insights {'>'}</ThemedText>
        </TouchableOpacity>
      </View>
      
      <View style={styles.grid}>
        {/* ROW 1 */}
        <View style={styles.row}>
          <View style={styles.statBox}>
            <MaterialCommunityIcons name="movie-open-outline" size={24} color={colors.primary} />
            <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>Total Watched</ThemedText>
            <ThemedText style={[styles.statValue, { color: colors.text }]}>{totalWatched}</ThemedText>
          </View>

          <View style={[styles.verticalDivider, { backgroundColor: 'rgba(255,255,255,0.05)' }]} />

          <View style={styles.statBox}>
            <Ionicons name="star" size={24} color={colors.primary} />
            <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>Average Rating</ThemedText>
            <ThemedText style={[styles.statValue, { color: colors.primary }]}>{averageRating}</ThemedText>
          </View>

          <View style={[styles.verticalDivider, { backgroundColor: 'rgba(255,255,255,0.05)' }]} />

          <View style={styles.statBox}>
            <Ionicons name="time-outline" size={24} color={colors.primary} />
            <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>Watch Time</ThemedText>
            <ThemedText style={[styles.statValue, { color: colors.text }]}>{watchTimeStr}</ThemedText>
            <ThemedText style={[styles.statSubLabel, { color: colors.textSecondary }]}>Hours</ThemedText>
          </View>
        </View>

        <View style={[styles.horizontalDivider, { backgroundColor: 'rgba(255,255,255,0.05)' }]} />

        {/* ROW 2 */}
        <View style={styles.row}>
          <View style={styles.statBox}>
            <Ionicons name="film-outline" size={24} color={colors.primary} />
            <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>Movies</ThemedText>
            <ThemedText style={[styles.statValue, { color: colors.text }]}>{totalMovies}</ThemedText>
          </View>

          <View style={[styles.verticalDivider, { backgroundColor: 'rgba(255,255,255,0.05)' }]} />

          <View style={styles.statBox}>
            <Ionicons name="tv-outline" size={24} color={colors.primary} />
            <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>TV Series</ThemedText>
            <ThemedText style={[styles.statValue, { color: colors.text }]}>{totalSeries}</ThemedText>
          </View>

          <View style={[styles.verticalDivider, { backgroundColor: 'rgba(255,255,255,0.05)' }]} />

          <View style={styles.statBox}>
            <Ionicons name="trophy-outline" size={24} color={colors.primary} />
            <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>Top Genre</ThemedText>
            <ThemedText style={[styles.statValue, { color: colors.text }]} numberOfLines={1}>
              {topGenre}
            </ThemedText>
          </View>
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
    overflow: 'hidden',
  },
  goldLine: {
    position: 'absolute',
    top: -1,
    left: 20,
    width: 60,
    height: 2,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  goldDot: {
    position: 'absolute',
    top: -2,
    left: 20,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  insightsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  insightsText: {
    fontSize: 10,
    fontWeight: '600',
  },
  grid: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 4,
  },
  statLabel: {
    fontSize: 11,
    marginTop: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 2,
  },
  statSubLabel: {
    fontSize: 10,
    marginTop: -4,
  },
  verticalDivider: {
    width: 1,
    height: 50,
  },
  horizontalDivider: {
    height: 1,
    width: '100%',
    marginVertical: 4,
  },
});
