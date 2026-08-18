import React from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useCinelog } from '../../context/CinelogContext';
import { ThemedView } from '../../components/themed-view';
import { ThemedText } from '../../components/themed-text';
import { Colors } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { CarouselMediaCard } from '../../components/CarouselMediaCard';

export default function HomeScreen() {
  const { collection, watchlist, theme } = useCinelog();
  const colors = Colors[theme === 'system' ? 'dark' : theme];
  const router = useRouter();

  // Watch Time Calculation
  let totalWatchTime = 0;
  let moviesCount = 0;
  let seriesCount = 0;
  
  const genreCounts: Record<string, number> = {};

  collection.forEach(item => {
    if (item.type === 'movie') {
      moviesCount++;
      if (item.runtime) totalWatchTime += item.runtime;
    } else if (item.type === 'series') {
      seriesCount++;
      if (item.watchedEpisodes) {
        item.watchedEpisodes.forEach(ep => {
          if (ep.runtime) totalWatchTime += ep.runtime;
        });
      }
    }
    
    item.genres.forEach(g => {
      genreCounts[g] = (genreCounts[g] || 0) + 1;
    });
  });

  const hoursWatched = Math.floor(totalWatchTime / 60);

  // Top Genre
  let topGenre = 'None';
  let maxGenreCount = 0;
  Object.entries(genreCounts).forEach(([genre, count]) => {
    if (count > maxGenreCount) {
      maxGenreCount = count;
      topGenre = genre;
    }
  });

  const sortedCollection = [...collection].sort((a, b) => (a.rank || 999) - (b.rank || 999));
  const topRated = sortedCollection.slice(0, 10);
  const recentlyAdded = [...collection].sort((a, b) => b.dateAdded - a.dateAdded).slice(0, 10);
  const recentWatchlist = [...watchlist].sort((a, b) => b.dateAdded - a.dateAdded).slice(0, 10);

  const hasInsightsData = collection.length > 0;
  const milestonesReached: string[] = [];
  if (collection.length >= 10) milestonesReached.push("10 Titles Watched");
  if (collection.length >= 50) milestonesReached.push("50 Titles Watched");
  if (hoursWatched >= 100) milestonesReached.push("100 Hours Watched");
  if (seriesCount >= 1) milestonesReached.push("First TV Series Watched");

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* ACTION BUTTON */}
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/search')}
        >
          <Ionicons name="add" size={24} color="#000" />
          <ThemedText style={styles.addButtonText}>Add Movie / Series</ThemedText>
        </TouchableOpacity>

        {/* STATS DASHBOARD */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>My Collection</ThemedText>
          <View style={[styles.statsGrid, { backgroundColor: colors.card, borderColor: colors.backgroundElement, borderWidth: 1 }]}>
            <View style={styles.statRow}>
              <View style={styles.statCompactBox}>
                <ThemedText style={styles.statIcon}>🎬</ThemedText>
                <View>
                  <ThemedText style={[styles.statValue, { color: colors.primary }]}>{collection.length}</ThemedText>
                  <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>Watched</ThemedText>
                </View>
              </View>
              <View style={styles.statCompactBox}>
                <ThemedText style={styles.statIcon}>⏱</ThemedText>
                <View>
                  <ThemedText style={[styles.statValue, { color: colors.primary }]}>{hoursWatched}h</ThemedText>
                  <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>Watch Time</ThemedText>
                </View>
              </View>
            </View>
            <View style={[styles.statRow, { borderTopWidth: 1, borderTopColor: colors.backgroundElement, paddingTop: 12, marginTop: 12 }]}>
              <View style={styles.statCompactBox}>
                <ThemedText style={styles.statIcon}>🎞</ThemedText>
                <View>
                  <ThemedText style={[styles.statValue, { color: colors.primary }]}>{moviesCount}</ThemedText>
                  <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>Movies</ThemedText>
                </View>
              </View>
              <View style={styles.statCompactBox}>
                <ThemedText style={styles.statIcon}>📺</ThemedText>
                <View>
                  <ThemedText style={[styles.statValue, { color: colors.primary }]}>{seriesCount}</ThemedText>
                  <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>TV Series</ThemedText>
                </View>
              </View>
            </View>
            {topGenre !== 'None' && (
              <View style={[styles.topGenreBox, { backgroundColor: colors.backgroundElement }]}>
                <ThemedText style={styles.topGenreText}>🏆 Top Genre: <ThemedText style={{ color: colors.primary, fontWeight: 'bold' }}>{topGenre}</ThemedText></ThemedText>
              </View>
            )}
          </View>
        </View>

        {/* CAROUSELS */}
        {topRated.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Your Top Rated</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
              {topRated.map(item => (
                <CarouselMediaCard key={item.id} item={item} onPress={() => router.push({ pathname: '/edit', params: { id: item.id } })} variant="home" />
              ))}
            </ScrollView>
          </View>
        )}

        {recentlyAdded.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Recently Added</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
              {recentlyAdded.map(item => (
                <CarouselMediaCard key={item.id} item={item} onPress={() => router.push({ pathname: '/edit', params: { id: item.id } })} variant="home" />
              ))}
            </ScrollView>
          </View>
        )}

        {recentWatchlist.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Watchlist Preview</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
              {recentWatchlist.map(item => (
                <CarouselMediaCard key={item.id} item={item} onPress={() => router.push({ pathname: '/edit', params: { id: item.id } })} variant="watchlist" />
              ))}
            </ScrollView>
          </View>
        )}

        {/* TASTE & INSIGHTS */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Taste & Insights</ThemedText>
          <View style={[styles.insightsCard, { backgroundColor: colors.card }]}>
            {hasInsightsData ? (
              <>
                <View style={styles.insightRow}>
                  <ThemedText style={styles.insightLabel}>Top Genre</ThemedText>
                  <ThemedText style={[styles.insightValue, { color: colors.primary }]}>{topGenre}</ThemedText>
                </View>
                <View style={styles.insightRow}>
                  <ThemedText style={styles.insightLabel}>Movies vs TV</ThemedText>
                  <ThemedText style={[styles.insightValue, { color: colors.primary }]}>
                    {moviesCount} : {seriesCount}
                  </ThemedText>
                </View>
              </>
            ) : (
              <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
                Add more titles to unlock your watching insights.
              </ThemedText>
            )}
          </View>
        </View>

        {/* MILESTONES */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Milestones</ThemedText>
          <View style={[styles.insightsCard, { backgroundColor: colors.card }]}>
            {milestonesReached.length > 0 ? (
              milestonesReached.map((m, i) => (
                <View key={i} style={styles.milestoneRow}>
                  <Ionicons name="trophy" size={20} color={colors.primary} />
                  <ThemedText style={styles.milestoneText}>{m}</ThemedText>
                </View>
              ))
            ) : (
              <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
                Keep watching to unlock personal milestones!
              </ThemedText>
            )}
          </View>
        </View>
        
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 8,
  },
  addButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 16,
    opacity: 0.8,
  },
  statsGrid: {
    borderRadius: 12,
    padding: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCompactBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  statIcon: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  topGenreBox: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  topGenreText: {
    fontSize: 14,
    fontWeight: '600',
  },
  carousel: {
    gap: 16,
  },
  insightsCard: {
    borderRadius: 12,
    padding: 16,
  },
  insightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  insightLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  insightValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  milestoneText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 24,
    fontStyle: 'italic',
  },
});
