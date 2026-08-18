import React, { useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useCinelog } from '../../context/CinelogContext';
import { CompactMediaCard } from '../../components/CompactMediaCard';
import { FilterBar } from '../../components/FilterBar';
import { ThemedView } from '../../components/themed-view';
import { ThemedText } from '../../components/themed-text';

import { useRouter } from 'expo-router';

const FILTERS = ['All', 'Movies', 'TV Series', 'Action', 'Sci-Fi', 'Drama', 'Comedy', 'Adventure', 'Mystery'];

export default function CollectionScreen() {
  const { collection } = useCinelog();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredCollection = collection.filter((item) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Movies') return item.type === 'movie';
    if (activeFilter === 'TV Series') return item.type === 'series';
    return item.genres.includes(activeFilter);
  });

  const handleEdit = (id: string) => {
    router.push({ pathname: '/edit', params: { id } });
  };

  return (
    <ThemedView style={styles.container}>
      <FilterBar filters={FILTERS} activeFilter={activeFilter} onSelect={setActiveFilter} />
      
      {filteredCollection.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>No items found.</ThemedText>
        </View>
      ) : (
        <View style={styles.listContainer}>
          <FlatList
            data={filteredCollection}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CompactMediaCard item={item} onPress={() => handleEdit(item.id)} variant="collection" />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    opacity: 0.7,
  },
});
