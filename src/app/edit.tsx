import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCinelog } from '../context/CinelogContext';
import { ThemedView } from '../components/themed-view';
import { ThemedText } from '../components/themed-text';
import { RatingInput } from '../components/RatingInput';
import { Colors } from '../constants/theme';
import { mockMedia } from '../data/mock';
import { Ionicons } from '@expo/vector-icons';
import { BaseMedia } from '../types';

export default function EditScreen() {
  const { id, isNew } = useLocalSearchParams<{ id: string; isNew?: string }>();
  const router = useRouter();
  const { collection, addWatched, updateWatched, removeWatched, addToWatchlist, theme } = useCinelog();
  const colors = Colors[theme === 'system' ? 'dark' : theme];

  const existingItem = collection.find(c => c.id === id);
  const mediaBase = existingItem || mockMedia.find(m => m.id === id);

  const [rating, setRating] = useState<number>(existingItem ? existingItem.rating : 5.0);

  useEffect(() => {
    if (!mediaBase) {
      router.back();
    }
  }, [mediaBase]);

  if (!mediaBase) return null;

  const handleSave = async () => {
    if (existingItem) {
      await updateWatched(id, { rating });
    } else {
      await addWatched(mediaBase, rating);
    }
    router.back();
  };

  const handleRemove = () => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your collection?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: async () => {
            await removeWatched(id);
            router.back();
          }
        }
      ]
    );
  };

  const handleAddToWatchlist = async () => {
    await addToWatchlist(mediaBase);
    Alert.alert("Added", "Added to your watchlist!");
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="close" size={28} color={colors.text} />
        </TouchableOpacity>
        <ThemedText type="subtitle" style={styles.headerTitle}>
          {existingItem ? 'Edit Rating' : 'Add to Collection'}
        </ThemedText>
        <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
          <ThemedText style={{ color: colors.primary, fontWeight: 'bold' }}>Save</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: mediaBase.poster }} style={styles.poster} resizeMode="cover" />
        
        <ThemedText style={styles.title}>{mediaBase.title}</ThemedText>
        <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
          {mediaBase.year} • {mediaBase.type === 'movie' ? 'Movie' : 'TV Series'}
        </ThemedText>
        <ThemedText style={[styles.genres, { color: colors.textSecondary }]}>
          {mediaBase.genres.join(', ')}
        </ThemedText>

        <View style={styles.ratingSection}>
          <ThemedText style={styles.ratingLabel}>Your Rating</ThemedText>
          <RatingInput value={rating} onChange={setRating} />
        </View>

        <View style={styles.actionsSection}>
          {!existingItem && (
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.backgroundElement, borderWidth: 1 }]} 
              onPress={handleAddToWatchlist}
            >
              <Ionicons name="bookmark-outline" size={20} color={colors.text} />
              <ThemedText style={styles.actionButtonText}>Add to Watchlist</ThemedText>
            </TouchableOpacity>
          )}

          {existingItem && (
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: 'rgba(255, 59, 48, 0.1)' }]} 
              onPress={handleRemove}
            >
              <Ionicons name="trash-outline" size={20} color="#ff3b30" />
              <ThemedText style={[styles.actionButtonText, { color: '#ff3b30' }]}>Remove from Collection</ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48, // rough safe area
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    fontSize: 18,
  },
  headerButton: {
    padding: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  poster: {
    width: 160,
    height: 240,
    borderRadius: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  genres: {
    fontSize: 14,
    marginBottom: 32,
    textAlign: 'center',
  },
  ratingSection: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 32,
  },
  ratingLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  actionsSection: {
    width: '100%',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
});
