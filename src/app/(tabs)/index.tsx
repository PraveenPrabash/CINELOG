import React from 'react';
import { StyleSheet, FlatList, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useCinelog } from '../../context/CinelogContext';
import { CarouselMediaCard } from '../../components/CarouselMediaCard';
import { StatsCard } from '../../components/StatsCard';
import { ThemedView } from '../../components/themed-view';
import { ThemedText } from '../../components/themed-text';
import { Colors } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const { collection, watchlist, theme } = useCinelog();
  const router = useRouter();
  
  const currentTheme = theme === 'system' ? 'dark' : theme;
  const colors = Colors[currentTheme];

  // Get top rated items
  const topRated = [...collection].filter(i => i.rating >= 8).slice(0, 5);
  // Get recently added items (using id fallback if no date added)
  const recentlyAdded = [...collection].reverse().slice(0, 5);

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={[{ key: 'dashboard' }]}
        keyExtractor={item => item.key}
        showsVerticalScrollIndicator={false}
        renderItem={() => (
          <View style={styles.dashboardContent}>
            
            {/* Collection Statistics */}
            <StatsCard collection={collection} />

            {/* Add Movie / Series Button */}
            <TouchableOpacity 
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/search')}
            >
              <Ionicons name="add-circle" size={24} color="#000" />
              <ThemedText style={styles.addButtonText}>Add Movie / Series</ThemedText>
            </TouchableOpacity>

            {/* Watchlist Preview */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionTitle}>Watchlist Preview</ThemedText>
                <TouchableOpacity onPress={() => router.push('/watchlist')}>
                  <ThemedText style={[styles.sectionLink, { color: colors.primary }]}>View All</ThemedText>
                </TouchableOpacity>
              </View>
              {watchlist.length > 0 ? (
                <FlatList
                  data={watchlist.slice(0, 5)}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalListContent}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => (
                    <CarouselMediaCard item={item} onPress={() => router.push('/watchlist')} variant="watchlist" />
                  )}
                />
              ) : (
                <ThemedText style={[styles.emptyPreview, { color: colors.textSecondary }]}>
                  Your watchlist is empty.
                </ThemedText>
              )}
            </View>

            {/* Your Top Rated */}
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Your Top Rated</ThemedText>
              {topRated.length > 0 ? (
                <FlatList
                  data={topRated}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalListContent}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => (
                    <CarouselMediaCard item={item} onPress={() => router.push({ pathname: '/edit', params: { id: item.id } })} variant="home" />
                  )}
                />
              ) : (
                <ThemedText style={[styles.emptyPreview, { color: colors.textSecondary }]}>
                  Log and rate media to see your top rated.
                </ThemedText>
              )}
            </View>

            {/* Recently Added */}
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Recently Added</ThemedText>
              {recentlyAdded.length > 0 ? (
                <FlatList
                  data={recentlyAdded}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalListContent}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => (
                    <CarouselMediaCard item={item} onPress={() => router.push({ pathname: '/edit', params: { id: item.id } })} variant="home" />
                  )}
                />
              ) : (
                <ThemedText style={[styles.emptyPreview, { color: colors.textSecondary }]}>
                  Log media to see recently added.
                </ThemedText>
              )}
            </View>

            {/* Taste / Insights Placeholder */}
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Taste & Insights</ThemedText>
              <View style={[styles.placeholderBox, { backgroundColor: colors.backgroundElement }]}>
                <Ionicons name="pie-chart-outline" size={32} color={colors.textSecondary} />
                <ThemedText style={[styles.placeholderText, { color: colors.textSecondary }]}>
                  Coming soon. Deep dive into your watching habits.
                </ThemedText>
              </View>
            </View>

            {/* Personal Milestones Placeholder */}
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Personal Milestones</ThemedText>
              <View style={[styles.placeholderBox, { backgroundColor: colors.backgroundElement }]}>
                <Ionicons name="ribbon-outline" size={32} color={colors.textSecondary} />
                <ThemedText style={[styles.placeholderText, { color: colors.textSecondary }]}>
                  Coming soon. Track your movie watching streaks.
                </ThemedText>
              </View>
            </View>

          </View>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  dashboardContent: {
    paddingBottom: 40,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  addButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  horizontalListContent: {
    paddingHorizontal: 16,
    paddingVertical: 4, // Allow room for shadow rendering
  },
  emptyPreview: {
    paddingHorizontal: 16,
    fontStyle: 'italic',
  },
  placeholderBox: {
    marginHorizontal: 16,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    gap: 12,
  },
  placeholderText: {
    textAlign: 'center',
    fontSize: 14,
  },
});
