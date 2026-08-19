import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useCinelog } from '../../context/CinelogContext';
import { ThemedView } from '../../components/themed-view';
import { ThemedText } from '../../components/themed-text';
import { Colors } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { CarouselMediaCard } from '../../components/CarouselMediaCard';
import { tmdb } from '../../services/tmdb';
import { BaseMedia } from '../../types';

export default function HomeScreen() {
  const { collection, watchlist, theme, isLoadingCloudData } = useCinelog();
  const colors = Colors[theme === 'system' ? 'dark' : theme];
  const router = useRouter();

  const [popularMovies, setPopularMovies] = useState<BaseMedia[]>([]);
  const [popularSeries, setPopularSeries] = useState<BaseMedia[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<BaseMedia[]>([]);
  const [trendingSeries, setTrendingSeries] = useState<BaseMedia[]>([]);
  const [loadingDiscovery, setLoadingDiscovery] = useState(true);

  useEffect(() => {
    async function loadDiscovery() {
      setLoadingDiscovery(true);
      try {
        const [pM, pS, tM, tS] = await Promise.all([
          tmdb.getPopularMovies(),
          tmdb.getPopularSeries(),
          tmdb.getTrendingMovies(),
          tmdb.getTrendingSeries(),
        ]);
        setPopularMovies(pM || []);
        setPopularSeries(pS || []);
        setTrendingMovies(tM || []);
        setTrendingSeries(tS || []);
      } catch (e) {
        console.error("Discovery load error", e);
      } finally {
        setLoadingDiscovery(false);
      }
    }
    loadDiscovery();
  }, []);

  // Watch Time and Stats Calculation
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

  let topGenre = '-';
  let maxCount = 0;
  Object.entries(genreCounts).forEach(([genre, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topGenre = genre;
    }
  });

  const renderDiscoverySection = (title: string, data: BaseMedia[]) => {
    if (!loadingDiscovery && data.length === 0) return null;
    return (
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
          {loadingDiscovery ? (
            Array(4).fill(0).map((_, i) => (
              <View key={i} style={[styles.skeletonCard, { backgroundColor: colors.backgroundElement }]} />
            ))
          ) : (
            data.map(item => (
              <CarouselMediaCard 
                key={item.id} 
                item={item} 
                onPress={() => router.push({ pathname: '/edit', params: { id: item.id, isNew: 'true' } })} 
                variant="home" 
              />
            ))
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* MY COLLECTION DASHBOARD */}
        <View style={styles.section}>
          {isLoadingCloudData ? (
            <View style={[styles.dashboardCard, { backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }]}>
              <ActivityIndicator color={colors.primary} />
              <ThemedText style={{ marginTop: 12, color: colors.textSecondary }}>Syncing cloud data...</ThemedText>
            </View>
          ) : (
            <View style={[styles.dashboardCard, { backgroundColor: colors.card, borderColor: colors.backgroundElement }]}>
              <View style={styles.dashboardHeaderLeft}>
                <Ionicons name="film" size={20} color={colors.primary} />
                <ThemedText style={[styles.dashboardTitle, { color: colors.primary }]}>My Collection</ThemedText>
              </View>
              
              <View style={styles.dashboardRowGroup}>
                <View style={[styles.dashboardStatBlock, { alignItems: 'center' }]}>
                  <ThemedText style={[styles.dashboardLabel, { color: colors.textSecondary }]}>Total Watched</ThemedText>
                  <ThemedText style={styles.dashboardValue}>{collection.length}</ThemedText>
                </View>
                <View style={[styles.dashboardStatBlock, { alignItems: 'center', borderLeftWidth: 1, borderRightWidth: 1, borderColor: colors.backgroundElement, paddingHorizontal: 4 }]}>
                  <ThemedText style={[styles.dashboardLabel, { color: colors.textSecondary }]}>Movies</ThemedText>
                  <ThemedText style={styles.dashboardValue}>{moviesCount}</ThemedText>
                </View>
                <View style={[styles.dashboardStatBlock, { alignItems: 'center' }]}>
                  <ThemedText style={[styles.dashboardLabel, { color: colors.textSecondary }]}>TV Series</ThemedText>
                  <ThemedText style={styles.dashboardValue}>{seriesCount}</ThemedText>
                </View>
              </View>
              
              <View style={[styles.dashboardDivider, { backgroundColor: colors.backgroundElement }]} />

              <View style={styles.dashboardRowGroup}>
                <View style={[styles.dashboardStatBlock, { flex: 1, alignItems: 'center', borderRightWidth: 1, borderColor: colors.backgroundElement, paddingRight: 8 }]}>
                  <ThemedText style={[styles.dashboardLabel, { color: colors.textSecondary }]}>Watch Time</ThemedText>
                  <ThemedText style={styles.dashboardValue}>{hoursWatched}h</ThemedText>
                </View>
                <View style={[styles.dashboardStatBlock, { flex: 1.5, alignItems: 'center', paddingLeft: 8 }]}>
                  <ThemedText style={[styles.dashboardLabel, { color: colors.textSecondary }]}>Top Genre</ThemedText>
                  <ThemedText style={styles.dashboardValue} numberOfLines={1}>{topGenre}</ThemedText>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* WATCHLIST */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>WATCHLIST</ThemedText>
          {watchlist.length === 0 ? (
            <View style={[styles.emptyWatchlist, { backgroundColor: colors.card, borderColor: colors.backgroundElement }]}>
              <Ionicons name="bookmark-outline" size={32} color={colors.textSecondary} style={{ marginBottom: 12 }} />
              <ThemedText style={styles.emptyWatchlistTitle}>Your watchlist is empty</ThemedText>
              <ThemedText style={[styles.emptyWatchlistSub, { color: colors.textSecondary }]}>
                Add movies and series you want to watch later.
              </ThemedText>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
              {watchlist.map(item => (
                <CarouselMediaCard 
                  key={item.id} 
                  item={item} 
                  onPress={() => router.push({ pathname: '/edit', params: { id: item.id, isNew: 'true' } })} 
                  variant="watchlist" 
                />
              ))}
            </ScrollView>
          )}
        </View>

        {/* DISCOVER SECTIONS */}
        <View style={{ marginTop: 16 }}>
          <ThemedText style={[styles.sectionTitle, { fontSize: 22, color: colors.primary, marginBottom: 24 }]}>DISCOVER</ThemedText>
          
          {renderDiscoverySection("Popular Movies", popularMovies)}
          {renderDiscoverySection("Popular TV Series", popularSeries)}
          {renderDiscoverySection("Trending Movies", trendingMovies)}
          {renderDiscoverySection("Trending TV Series", trendingSeries)}
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
    paddingBottom: 80,
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
  dashboardCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  dashboardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dashboardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  dashboardRowGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dashboardStatBlock: {
    flex: 1,
    paddingVertical: 4,
  },
  dashboardDivider: {
    height: 1,
    width: '100%',
    marginVertical: 12,
    opacity: 0.5,
  },
  dashboardLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  dashboardValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyWatchlist: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyWatchlistTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyWatchlistSub: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  carousel: {
    gap: 16,
  },
  skeletonCard: {
    width: 140,
    height: 210,
    borderRadius: 8,
    opacity: 0.5,
  },
});
