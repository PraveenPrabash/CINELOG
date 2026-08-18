import React from 'react';
import { StyleSheet, TouchableOpacity, Image, View } from 'react-native';
import { ThemedText } from './themed-text';
import { Colors } from '../constants/theme';
import { useCinelog } from '../context/CinelogContext';
import { BaseMedia } from '../types';
import { Ionicons } from '@expo/vector-icons';

interface MediaCardProps {
  item: BaseMedia;
  onPress: () => void;
  variant?: 'collection' | 'search' | 'watchlist';
}

export function MediaCard({ item, onPress, variant = 'collection' }: MediaCardProps) {
  const { theme, collection } = useCinelog();
  const colors = Colors[theme === 'system' ? 'dark' : theme];

  const watchedItem = collection.find(c => c.id === item.id);
  const isWatched = !!watchedItem;

  const displayGenres = item.genres.slice(0, 2).join(' • ') + (item.genres.length > 2 ? '...' : '');

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.backgroundElement }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: item.poster }} 
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText style={styles.title} numberOfLines={2}>{item.title}</ThemedText>
          {variant === 'collection' && isWatched && watchedItem.rank && (
            <View style={[styles.rankBadge, { backgroundColor: colors.backgroundElement }]}>
              <ThemedText style={styles.rankText}>#{watchedItem.rank}</ThemedText>
            </View>
          )}
        </View>
        
        <ThemedText style={[styles.meta, { color: colors.textSecondary }]}>
          {item.year} • {item.type === 'movie' ? 'Movie' : 'TV Series'}
        </ThemedText>
        <ThemedText style={[styles.genres, { color: colors.textSecondary }]} numberOfLines={1}>
          {displayGenres}
        </ThemedText>

        <View style={styles.footer}>
          {variant !== 'watchlist' && isWatched && watchedItem.rating > 0 && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color={colors.primary} />
              <ThemedText style={[styles.ratingText, { color: colors.primary }]}>
                {watchedItem.rating.toFixed(1)}
              </ThemedText>
            </View>
          )}
          {variant === 'watchlist' && item.type === 'series' && isWatched && watchedItem.watchedEpisodes && (
            <ThemedText style={[styles.progressText, { color: colors.primary }]}>
              {watchedItem.watchedEpisodes.length} / {item.seasons?.reduce((acc, s) => acc + s.episodeCount, 0) || '?'} eps
            </ThemedText>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  poster: {
    width: 60,
    height: 90,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  rankBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  rankText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  meta: {
    fontSize: 12,
    marginTop: 4,
  },
  genres: {
    fontSize: 12,
    marginTop: 2,
  },
  footer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
