import React, { useState } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useCinelog } from '../../context/CinelogContext';
import { MediaCard } from '../../components/MediaCard';
import { FilterBar } from '../../components/FilterBar';
import { StatsCard } from '../../components/StatsCard';
import { ThemedView } from '../../components/themed-view';
import { ThemedText } from '../../components/themed-text';

const FILTERS = ['All', 'Movies', 'TV Series', 'Action', 'Sci-Fi', 'Drama', 'Comedy', 'Adventure', 'Mystery'];

export default function HomeScreen() {
  const { collection } = useCinelog();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');

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
          <ThemedText style={styles.emptyText}>No items found in your collection.</ThemedText>
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
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
  },
});
