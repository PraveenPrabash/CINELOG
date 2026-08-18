import React from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './themed-text';
import { BaseMedia, WatchedItem } from '../types';
import { Colors } from '../constants/theme';
import { useCinelog } from '../context/CinelogContext';

interface CarouselMediaCardProps {
  item: BaseMedia;
  onPress: () => void;
  variant?: 'home' | 'watchlist';
}

export function CarouselMediaCard({ item, onPress, variant = 'home' }: CarouselMediaCardProps) {
  const { theme } = useCinelog();
  const colors = Colors[theme === 'system' ? 'dark' : theme];
  
  const isWatched = 'rating' in item;
  const watchedItem = item as WatchedItem;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.container, { backgroundColor: colors.card }]}>
      <Image source={{ uri: item.poster }} style={styles.poster} resizeMode="cover" />
      
      <View style={styles.content}>
        <ThemedText style={styles.title} numberOfLines={1}>
          {item.title}
        </ThemedText>

        <ThemedText style={[styles.metaText, { color: colors.textSecondary }]} numberOfLines={1}>
          {item.year} • {item.type === 'movie' ? 'Movie' : 'Series'}
        </ThemedText>

        <ThemedText style={[styles.metaText, { color: colors.textSecondary, marginBottom: 6 }]} numberOfLines={1}>
          {item.genres.slice(0, 2).join(' • ')}
        </ThemedText>

        {isWatched && variant === 'home' && (
          <View style={styles.footer}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color={colors.primary} />
              <ThemedText style={[styles.ratingText, { color: colors.primary }]}>
                {watchedItem.rating.toFixed(1)}
              </ThemedText>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 130, // Fixed width suitable for mobile carousels
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
    flexDirection: 'column',
  },
  poster: {
    width: '100%',
    aspectRatio: 2/3,
    backgroundColor: '#1e293b',
  },
  content: {
    padding: 10,
    justifyContent: 'space-between',
    flexShrink: 1, // Prevent text overflow expansion
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metaText: {
    fontSize: 11,
    marginBottom: 2,
  },
  footer: {
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
    fontSize: 13,
  },
});
