import React, { useState } from 'react';
import { StyleSheet, FlatList, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { mockMedia } from '../../data/mock';
import { MediaCard } from '../../components/MediaCard';
import { ThemedView } from '../../components/themed-view';
import { Colors } from '../../constants/theme';
import { useCinelog } from '../../context/CinelogContext';
import { Ionicons } from '@expo/vector-icons';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { theme } = useCinelog();
  const colors = Colors[theme === 'system' ? 'dark' : theme];

  const results = mockMedia.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <ThemedView style={styles.container}>
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
        data={results}
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
