import React, { useState } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useCinelog } from '../../context/CinelogContext';
import { MediaCard } from '../../components/MediaCard';
import { FilterBar } from '../../components/FilterBar';
import { ThemedView } from '../../components/themed-view';
import { ThemedText } from '../../components/themed-text';

const FILTERS = ['All', 'Movies', 'TV Series', 'Action', 'Sci-Fi', 'Drama', 'Comedy', 'Adventure', 'Mystery'];

export default function WatchlistScreen() {
  const { watchlist } = useCinelog();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredWatchlist = watchlist.filter((item) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Movies') return item.type === 'movie';
    if (activeFilter === 'TV Series') return item.type === 'series';
    return item.genres.includes(activeFilter);
  });

  return (
    <ThemedView style={styles.container}>
      <FilterBar filters={FILTERS} activeFilter={activeFilter} onSelect={setActiveFilter} />
      
      {filteredWatchlist.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>Your watchlist is empty.</ThemedText>
        </View>
      ) : (
        <FlatList
          data={filteredWatchlist}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <MediaCard 
              item={item} 
              variant="watchlist" 
              onPress={() => {
                router.push({
                  pathname: '/edit',
                  params: { id: item.id, isNew: 'true' }
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
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
  },
});
