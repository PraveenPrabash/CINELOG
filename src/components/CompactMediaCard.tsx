import React from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './themed-text';
import { BaseMedia, WatchedItem } from '../types';
import { Colors } from '../constants/theme';
import { useCinelog } from '../context/CinelogContext';

interface CompactMediaCardProps {
  item: BaseMedia;
  onPress: () => void;
  variant?: 'collection' | 'watchlist';
}

export function CompactMediaCard({ item, onPress, variant = 'collection' }: CompactMediaCardProps) {
  const { theme } = useCinelog();
  const colors = Colors[theme === 'system' ? 'dark' : theme];
  
  const isWatched = 'rating' in item;
  const watchedItem = item as WatchedItem;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={[styles.container, { backgroundColor: colors.card, borderColor: colors.backgroundElement }]}>
      <Image source={{ uri: item.poster }} style={styles.poster} resizeMode="cover" />
      
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <ThemedText style={styles.title} numberOfLines={1}>
            {item.title}
          </ThemedText>
        </View>

        <ThemedText style={[styles.metaText, { color: colors.textSecondary }]} numberOfLines={1}>
          {item.year} • {item.genres.join(', ')}
        </ThemedText>
      </View>

      <View style={styles.rightSection}>
        {variant === 'collection' && isWatched && (
          <>
            {watchedItem.rank && (
              <View style={[styles.rankBadge, { backgroundColor: colors.primary }]}>
                <ThemedText style={styles.rankText}>#{watchedItem.rank}</ThemedText>
              </View>
            )}
            <View style={styles.ratingBox}>
              <Ionicons name="star" size={12} color={colors.primary} />
              <ThemedText style={[styles.ratingText, { color: colors.primary }]}>
                {watchedItem.rating.toFixed(1)}
              </ThemedText>
            </View>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
  },
  poster: {
    width: 46,
    height: 68,
    backgroundColor: '#1e293b',
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  metaText: {
    fontSize: 12,
  },
  rightSection: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 10,
    gap: 4,
  },
  rankBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rankText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 11,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});
