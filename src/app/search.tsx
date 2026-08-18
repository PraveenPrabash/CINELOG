import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, TextInput, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MediaCard } from '../components/MediaCard';
import { ThemedView } from '../components/themed-view';
import { Colors } from '../constants/theme';
import { useCinelog } from '../context/CinelogContext';
import { BaseMedia } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../components/themed-text';
import { tmdb } from '../services/tmdb';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BaseMedia[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { theme } = useCinelog();
  const colors = Colors[theme === 'system' ? 'dark' : theme];

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 0) {
        setIsLoading(true);
        setError(null);
        try {
          const searchResults = await tmdb.searchMulti(query);
          setResults(searchResults);
        } catch (err) {
          setError('Failed to fetch results. Please check your connection.');
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setError(null);
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Search TMDB</ThemedText>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={[styles.searchBar, { backgroundColor: colors.backgroundElement }]}>
        <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Search for movies or TV series..."
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={setQuery}
          autoFocus
        />
      </View>
      
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <ThemedText style={{ color: '#ff3b30', textAlign: 'center' }}>{error}</ThemedText>
        </View>
      ) : query.trim().length > 0 && results.length === 0 ? (
        <View style={styles.centerContainer}>
          <ThemedText style={{ color: colors.textSecondary }}>No results found for "{query}"</ThemedText>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <MediaCard 
              item={item} 
              variant="search" 
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
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeBtn: {
    padding: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
});
