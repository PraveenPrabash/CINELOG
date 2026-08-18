import React from 'react';
import { StyleSheet, TouchableOpacity, Image, View } from 'react-native';
import { ThemedText } from './themed-text';
import { Colors } from '../constants/theme';
import { useCinelog } from '../context/CinelogContext';
import { BaseMedia } from '../types';
import { Ionicons } from '@expo/vector-icons';

interface CarouselMediaCardProps {
  item: BaseMedia;
  onPress: () => void;
  variant?: 'home' | 'watchlist';
}

export function CarouselMediaCard({ item, onPress, variant = 'home' }: CarouselMediaCardProps) {
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
      <View style={styles.info}>
        <ThemedText style={styles.title} numberOfLines={1}>{item.title}</ThemedText>
        <ThemedText style={[styles.meta, { color: colors.textSecondary }]} numberOfLines={1}>
          {item.year} • {item.type === 'movie' ? 'Movie' : 'TV Series'}
        </ThemedText>
        {displayGenres ? (
          <ThemedText style={[styles.genre, { color: colors.textSecondary }]} numberOfLines={1}>
            {displayGenres}
          </ThemedText>
        ) : null}
        
        {variant === 'home' && isWatched && watchedItem.rating > 0 && (
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color={colors.primary} />
            <ThemedText style={[styles.ratingText, { color: colors.primary }]}>
              {watchedItem.rating.toFixed(1)}
            </ThemedText>
          </View>
        )}
        
        {variant === 'watchlist' && item.type === 'series' && isWatched && watchedItem.watchedEpisodes && (
          <ThemedText style={[styles.progressText, { color: colors.primary }]} numberOfLines={1}>
            {watchedItem.watchedEpisodes.length} / {item.seasons?.reduce((acc, s) => acc + s.episodeCount, 0) || '?'} eps
          </ThemedText>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 130,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  poster: {
    width: '100%',
    height: 190,
  },
  info: {
    padding: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  meta: {
    fontSize: 10,
    marginBottom: 2,
  },
  genre: {
    fontSize: 10,
    marginBottom: 4,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressText: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
});
