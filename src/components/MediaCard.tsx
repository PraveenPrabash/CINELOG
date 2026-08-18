import React from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { BaseMedia, WatchedItem } from '../types';
import { Colors } from '../constants/theme';
import { useCinelog } from '../context/CinelogContext';

interface MediaCardProps {
  item: BaseMedia;
  onPress: () => void;
  variant?: 'home' | 'search' | 'watchlist';
}

export function MediaCard({ item, onPress, variant = 'home' }: MediaCardProps) {
  const { theme } = useCinelog();
  const colors = Colors[theme === 'system' ? 'dark' : theme]; // simplify for now
  
  const isWatched = 'rating' in item;
  const watchedItem = item as WatchedItem;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.container, { backgroundColor: colors.card }]}>
      <Image source={{ uri: item.poster }} style={styles.poster} resizeMode="cover" />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText type="subtitle" style={styles.title} numberOfLines={2}>
            {item.title}
          </ThemedText>
          {variant === 'home' && isWatched && watchedItem.rank && (
            <View style={[styles.rankBadge, { backgroundColor: colors.primary }]}>
              <ThemedText style={styles.rankText}>#{watchedItem.rank}</ThemedText>
            </View>
          )}
        </View>

        <ThemedText style={{ color: colors.textSecondary, marginBottom: 4 }}>
          {item.year} • {item.type === 'movie' ? 'Movie' : 'TV Series'}
        </ThemedText>

        <ThemedText style={{ color: colors.textSecondary, fontSize: 12, marginBottom: 8 }} numberOfLines={1}>
          {item.genres.join(', ')}
        </ThemedText>

        <View style={styles.footer}>
          {isWatched ? (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color={colors.primary} />
              <ThemedText style={[styles.ratingText, { color: colors.primary }]}>
                {watchedItem.rating.toFixed(1)}
              </ThemedText>
            </View>
          ) : (
            <View />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  poster: {
    width: 100,
    height: 150,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontSize: 18,
    marginRight: 8,
  },
  rankBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rankText: {
    color: '#000', // Always dark on gold
    fontWeight: 'bold',
    fontSize: 14,
  },
  footer: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
