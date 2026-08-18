import React from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
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
  const watchTimeStr = totalRuntimeMins > 0 ? `${runtimeHours}h ${runtimeMins}m` : '0h';

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
    <View style={[styles.container, { backgroundColor: colors.backgroundSelected }]}>
      {/* Decorative top accent */}
      <View style={[styles.topAccent, { backgroundColor: colors.primary }]} />

      <View style={styles.header}>
        <ThemedText style={styles.title}>My Collection</ThemedText>
        <TouchableOpacity style={[styles.insightsPill, { backgroundColor: 'rgba(255,255,255,0.08)' }]}>
          <MaterialCommunityIcons name="chart-box-outline" size={14} color={colors.primary} />
          <ThemedText style={[styles.insightsText, { color: colors.primary }]}>Insights</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Main Hero Stats */}
        <View style={styles.heroSection}>
          <View style={styles.heroBox}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(236, 179, 101, 0.15)' }]}>
              <MaterialCommunityIcons name="movie-open" size={22} color={colors.primary} />
            </View>
            <View style={styles.heroTextContent}>
              <ThemedText style={[styles.statValueLarge, { color: colors.text }]}>{totalWatched}</ThemedText>
              <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>Total Logged</ThemedText>
            </View>
          </View>
          
          <View style={[styles.verticalDivider, { backgroundColor: 'rgba(255,255,255,0.05)' }]} />
          
          <View style={styles.heroBox}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(236, 179, 101, 0.15)' }]}>
              <Ionicons name="star" size={20} color={colors.primary} />
            </View>
            <View style={styles.heroTextContent}>
              <ThemedText style={[styles.statValueLarge, { color: colors.primary }]}>{averageRating}</ThemedText>
              <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>Avg Rating</ThemedText>
            </View>
          </View>
        </View>

        <View style={[styles.horizontalDivider, { backgroundColor: 'rgba(255,255,255,0.05)' }]} />

        {/* Secondary Stats Row */}
        <View style={styles.secondarySection}>
          <View style={styles.secondaryBox}>
            <Ionicons name="time-outline" size={16} color={colors.textSecondary} style={styles.secondaryIcon} />
            <ThemedText style={[styles.secondaryValue, { color: colors.text }]}>{watchTimeStr}</ThemedText>
          </View>
          <View style={styles.secondaryBox}>
            <Ionicons name="film-outline" size={16} color={colors.textSecondary} style={styles.secondaryIcon} />
            <ThemedText style={[styles.secondaryValue, { color: colors.text }]}>{totalMovies}</ThemedText>
          </View>
          <View style={styles.secondaryBox}>
            <Ionicons name="tv-outline" size={16} color={colors.textSecondary} style={styles.secondaryIcon} />
            <ThemedText style={[styles.secondaryValue, { color: colors.text }]}>{totalSeries}</ThemedText>
          </View>
          <View style={styles.secondaryBox}>
            <Ionicons name="trophy-outline" size={16} color={colors.textSecondary} style={styles.secondaryIcon} />
            <ThemedText style={[styles.secondaryValue, { color: colors.text }]} numberOfLines={1}>
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
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  topAccent: {
    height: 3,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  insightsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  insightsText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  heroSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  heroBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTextContent: {
    justifyContent: 'center',
  },
  statValueLarge: {
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 30,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  verticalDivider: {
    width: 1,
    height: 40,
    marginHorizontal: 16,
  },
  horizontalDivider: {
    height: 1,
    width: '100%',
    marginBottom: 16,
  },
  secondarySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  secondaryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    justifyContent: 'center',
  },
  secondaryIcon: {
    opacity: 0.8,
  },
  secondaryValue: {
    fontSize: 13,
    fontWeight: '700',
  },
});
