import React, { useState } from 'react';
import { StyleSheet, FlatList, TextInput, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { mockMedia } from '../data/mock';
import { MediaCard } from '../components/MediaCard';
import { ThemedView } from '../components/themed-view';
import { Colors } from '../constants/theme';
import { useCinelog } from '../context/CinelogContext';
import { BaseMedia } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../components/themed-text';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { theme } = useCinelog();
  const colors = Colors[theme === 'system' ? 'dark' : theme];

  const filteredResults = mockMedia.filter((item: BaseMedia) => 
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Search Media</ThemedText>
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
        />
      </View>
      
      <FlatList
        data={filteredResults}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
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
});
