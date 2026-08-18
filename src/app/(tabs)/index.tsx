import React, { useState } from 'react';
import { StyleSheet, FlatList, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useCinelog } from '../../context/CinelogContext';
import { MediaCard } from '../../components/MediaCard';
import { FilterBar } from '../../components/FilterBar';
import { StatsCard } from '../../components/StatsCard';
import { ThemedView } from '../../components/themed-view';
import { ThemedText } from '../../components/themed-text';
import { Colors } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const FILTERS = ['All', 'Movies', 'TV Series', 'Action', 'Sci-Fi', 'Drama', 'Comedy', 'Adventure', 'Mystery'];

export default function HomeScreen() {
  const { collection, theme } = useCinelog();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');
  
  const currentTheme = theme === 'system' ? 'dark' : theme;
  const colors = Colors[currentTheme];

  const filteredCollection = collection.filter((item) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Movies') return item.type === 'movie';
    if (activeFilter === 'TV Series') return item.type === 'series';
    return item.genres.includes(activeFilter);
  });

  return (
    <ThemedView style={styles.container}>
      <StatsCard collection={collection} />
      <FilterBar filters={FILTERS} activeFilter={activeFilter} onSelect={setActiveFilter} />
      
      {filteredCollection.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconCircle, { backgroundColor: colors.backgroundElement }]}>
            <Ionicons name="film-outline" size={48} color={colors.primary} />
          </View>
          <ThemedText style={styles.emptyTitle}>Your Log is Empty</ThemedText>
          <ThemedText style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Start logging movies and TV series to build your cinematic collection.
          </ThemedText>
          <TouchableOpacity 
            style={[styles.emptyButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/search')}
          >
            <Ionicons name="add" size={20} color="#000" />
            <ThemedText style={styles.emptyButtonText}>Add Your First Movie</ThemedText>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredCollection}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <MediaCard 
              item={item} 
              variant="home" 
              onPress={() => {
                router.push({
                  pathname: '/edit',
                  params: { id: item.id }
                });
              }} 
            />
          )}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 20,
  },
  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 24,
    gap: 8,
  },
  emptyButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
