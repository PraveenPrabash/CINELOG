import React, { useState } from 'react';
import { StyleSheet, View, SectionList, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { useCinelog } from '../../context/CinelogContext';
import { CompactMediaCard } from '../../components/CompactMediaCard';
import { FilterBar } from '../../components/FilterBar';
import { ThemedView } from '../../components/themed-view';
import { ThemedText } from '../../components/themed-text';
import { Colors } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const FILTERS = ['All', 'Movies', 'TV Series', 'Action', 'Sci-Fi', 'Drama', 'Comedy', 'Adventure', 'Mystery'];
const ALPHABET = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function CollectionScreen() {
  const { collection, theme } = useCinelog();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortMode, setSortMode] = useState<'ranked' | 'az'>('ranked');
  
  const currentTheme = theme === 'system' ? 'dark' : theme;
  const colors = Colors[currentTheme];
  const sectionListRef = React.useRef<SectionList>(null);

  const filteredCollection = collection.filter((item) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Movies') return item.type === 'movie';
    if (activeFilter === 'TV Series') return item.type === 'series';
    return item.genres.includes(activeFilter);
  });

  // A-Z sorting
  const sections = React.useMemo(() => {
    if (sortMode === 'ranked') return [];
    
    const sorted = [...filteredCollection].sort((a, b) => a.title.localeCompare(b.title));
    const grouped = sorted.reduce((acc, item) => {
      let firstLetter = item.title.charAt(0).toUpperCase();
      if (!/[A-Z]/.test(firstLetter)) firstLetter = '#';
      if (!acc[firstLetter]) acc[firstLetter] = [];
      acc[firstLetter].push(item);
      return acc;
    }, {} as Record<string, typeof collection>);

    return ALPHABET.map(letter => ({
      title: letter,
      data: grouped[letter] || [],
    })).filter(section => section.data.length > 0);
  }, [filteredCollection, sortMode]);

  const handleLetterPress = (letter: string) => {
    if (sectionListRef.current) {
      const sectionIndex = sections.findIndex(s => s.title === letter);
      if (sectionIndex !== -1) {
        sectionListRef.current.scrollToLocation({
          sectionIndex,
          itemIndex: 0,
          animated: true,
        });
      }
    }
  };

  const handleEdit = (id: string) => {
    router.push({ pathname: '/edit', params: { id } });
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>My Collection</ThemedText>
        <TouchableOpacity 
          style={styles.sortToggle} 
          onPress={() => setSortMode(sortMode === 'ranked' ? 'az' : 'ranked')}
        >
          <Ionicons name={sortMode === 'ranked' ? 'bar-chart' : 'text'} size={16} color={colors.primary} />
          <ThemedText style={[styles.sortText, { color: colors.primary }]}>
            {sortMode === 'ranked' ? 'Ranked' : 'A-Z'}
          </ThemedText>
        </TouchableOpacity>
      </View>

      <FilterBar filters={FILTERS} activeFilter={activeFilter} onSelect={setActiveFilter} />
      
      {filteredCollection.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>No items found.</ThemedText>
        </View>
      ) : (
        <View style={styles.listContainer}>
          {sortMode === 'ranked' ? (
            <FlatList
              data={filteredCollection}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <CompactMediaCard item={item} onPress={() => handleEdit(item.id)} variant="collection" />
              )}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <SectionList
              ref={sectionListRef}
              sections={sections}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <CompactMediaCard item={item} onPress={() => handleEdit(item.id)} variant="collection" />
              )}
              renderSectionHeader={({ section: { title } }) => (
                <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
                  <ThemedText style={[styles.sectionHeaderText, { color: colors.primary }]}>{title}</ThemedText>
                </View>
              )}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}

          {sortMode === 'az' && (
            <View style={styles.alphabetSidebar}>
              {ALPHABET.map(letter => {
                const hasData = sections.some(s => s.title === letter);
                return (
                  <TouchableOpacity 
                    key={letter} 
                    onPress={() => handleLetterPress(letter)}
                    disabled={!hasData}
                    style={styles.alphabetLetterButton}
                  >
                    <ThemedText style={[
                      styles.alphabetLetter, 
                      { 
                        color: hasData ? colors.primary : colors.textSecondary,
                        opacity: hasData ? 1 : 0.3 
                      }
                    ]}>
                      {letter}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  sortToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(236, 179, 101, 0.1)',
  },
  sortText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  listContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionHeader: {
    paddingVertical: 8,
    marginBottom: 8,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  alphabetSidebar: {
    position: 'absolute',
    right: 4,
    top: 20,
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
  },
  alphabetLetterButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alphabetLetter: {
    fontSize: 10,
    fontWeight: 'bold',
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
