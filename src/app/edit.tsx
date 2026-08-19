import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCinelog } from '../context/CinelogContext';
import { ThemedView } from '../components/themed-view';
import { ThemedText } from '../components/themed-text';
import { RatingInput } from '../components/RatingInput';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { Colors } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { BaseMedia, WatchedEpisode, TMDBSeason } from '../types';
import { tmdb } from '../services/tmdb';

export default function EditScreen() {
  const { id, isNew } = useLocalSearchParams<{ id: string; isNew?: string }>();
  const router = useRouter();
  const { collection, watchlist, addWatched, updateWatched, removeWatched, addToWatchlist, removeFromWatchlist, theme } = useCinelog();
  const colors = Colors[theme === 'system' ? 'dark' : theme];

  const existingCollectionItem = collection.find(c => c.id === id);
  const existingWatchlistItem = watchlist.find(w => w.id === id);
  const existingItem = existingCollectionItem || existingWatchlistItem;
  
  const isWatched = !!existingCollectionItem;
  
  const [mediaBase, setMediaBase] = useState<BaseMedia | null>(existingItem || null);
  const [isLoading, setIsLoading] = useState(!!isNew && !existingItem);
  const [rating, setRating] = useState<number | undefined>(existingCollectionItem ? existingCollectionItem.rating : undefined);
  
  const [expandedSeason, setExpandedSeason] = useState<number | null>(null);
  const [seasonEpisodes, setSeasonEpisodes] = useState<Record<number, any[]>>({});
  const [isLoadingSeason, setIsLoadingSeason] = useState(false);
  
  const [watchedEpisodes, setWatchedEpisodes] = useState<WatchedEpisode[]>(
    existingCollectionItem?.watchedEpisodes || []
  );

  const [showWatchlistModal, setShowWatchlistModal] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  useEffect(() => {
    // If we have existing item but missing full details (like overview), fetch them.
    // Otherwise, if it's completely new, fetch them.
    const needsFetch = !mediaBase || !mediaBase.overview || isNew === 'true';

    if (needsFetch) {
      setIsLoading(true);
      tmdb.getDetails(id).then(data => {
        if (data) {
          setMediaBase(prev => ({
            ...prev,
            ...data
          }));
        } else if (!mediaBase) {
          handleBack();
        }
        setIsLoading(false);
      });
    }
  }, [id, isNew]);

  const handleExpandSeason = async (seasonNumber: number) => {
    if (expandedSeason === seasonNumber) {
      setExpandedSeason(null);
      return;
    }
    setExpandedSeason(seasonNumber);
    if (!seasonEpisodes[seasonNumber]) {
      setIsLoadingSeason(true);
      const data = await tmdb.getSeasonDetails(id, seasonNumber);
      if (data && data.episodes) {
        setSeasonEpisodes(prev => ({ ...prev, [seasonNumber]: data.episodes }));
      }
      setIsLoadingSeason(false);
    }
  };

  const toggleEpisode = (seasonNumber: number, episode: any) => {
    const epId = `s${seasonNumber}e${episode.episode_number}`;
    const exists = watchedEpisodes.some(we => we.episodeId === epId);
    
    if (exists) {
      setWatchedEpisodes(prev => prev.filter(we => we.episodeId !== epId));
    } else {
      setWatchedEpisodes(prev => [...prev, {
        episodeId: epId,
        seasonNumber,
        episodeNumber: episode.episode_number,
        runtime: episode.runtime || null,
      }]);
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ThemedView>
    );
  }

  if (!mediaBase) return null;

  const handleSaveCollection = async () => {
    if (existingCollectionItem) {
      await updateWatched(id, { rating, watchedEpisodes });
    } else {
      await addWatched(mediaBase, rating, watchedEpisodes);
    }
    handleBack();
  };

  const handleAddWatchlist = async () => {
    if (!existingWatchlistItem) {
      await addToWatchlist(mediaBase);
    }
    handleBack();
  };

  const handleRemoveFromWatchlistConfirm = async () => {
    setShowWatchlistModal(false);
    await removeFromWatchlist(id);
    if (!existingCollectionItem) handleBack();
  };

  const handleRemoveCollectionConfirm = async () => {
    setShowCollectionModal(false);
    if (existingCollectionItem) await removeWatched(id);
    handleBack();
  };

  const formatRuntime = (mins?: number) => {
    if (!mins) return '';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const totalEpisodes = mediaBase.seasons?.reduce((acc, s) => acc + s.episodeCount, 0) || 0;
  const totalSeasons = mediaBase.seasons?.length || 0;

  const toggleSeasonEpisodes = (seasonNumber: number, episodes: any[], isSelectAll: boolean) => {
    if (isSelectAll) {
      const newEpisodes = episodes.map(ep => ({
        episodeId: `s${seasonNumber}e${ep.episode_number}`,
        seasonNumber,
        episodeNumber: ep.episode_number,
        runtime: ep.runtime || null,
      }));
      setWatchedEpisodes(prev => {
        const filtered = prev.filter(we => we.seasonNumber !== seasonNumber);
        return [...filtered, ...newEpisodes];
      });
    } else {
      setWatchedEpisodes(prev => prev.filter(we => we.seasonNumber !== seasonNumber));
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image source={{ uri: mediaBase.poster }} style={styles.poster} />
          <View style={styles.headerInfo}>
            <ThemedText style={styles.title}>{mediaBase.title}</ThemedText>
            {mediaBase.type === 'movie' ? (
              <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
                {mediaBase.year} • Movie{mediaBase.runtime ? ` • ${formatRuntime(mediaBase.runtime)}` : ''}
              </ThemedText>
            ) : (
              <View>
                <ThemedText style={[styles.subtitle, { color: colors.textSecondary, marginBottom: 2 }]}>
                  {mediaBase.year} • TV Series
                </ThemedText>
                <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
                  {totalEpisodes} episodes • {totalSeasons} seasons
                </ThemedText>
              </View>
            )}
            <ThemedText style={[styles.genres, { color: colors.primary }]}>
              {mediaBase.genres.slice(0, 3).join(', ')}
            </ThemedText>
            
            {mediaBase.tmdbRating !== undefined && mediaBase.tmdbRating > 0 && (
              <View style={[styles.tmdbScore, { backgroundColor: colors.backgroundElement }]}>
                <ThemedText style={styles.tmdbLabel}>TMDB RATING</ThemedText>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Ionicons name="star" size={14} color={colors.textSecondary} />
                  <ThemedText style={[styles.tmdbScoreText, { color: colors.textSecondary }]}>
                    {mediaBase.tmdbRating.toFixed(1)} <ThemedText style={{fontSize:12, opacity:0.6}}>· {mediaBase.tmdbVoteCount} votes</ThemedText>
                  </ThemedText>
                </View>
              </View>
            )}
          </View>
        </View>

        {mediaBase.overview ? (
          <View style={styles.overviewContainer}>
            <ThemedText style={styles.overviewText} numberOfLines={6}>
              {mediaBase.overview}
            </ThemedText>
          </View>
        ) : null}

        {existingWatchlistItem && (
          <TouchableOpacity 
            style={[styles.watchlistBtn, { backgroundColor: colors.card, borderColor: colors.backgroundElement, borderWidth: 1 }]} 
            onPress={() => setShowWatchlistModal(true)}
          >
            <Ionicons name="trash-outline" size={20} color="#ff3b30" />
            <ThemedText style={[styles.watchlistBtnText, { color: '#ff3b30' }]}>
              Remove from Watchlist
            </ThemedText>
          </TouchableOpacity>
        )}
        
        {!isWatched && !existingWatchlistItem && (
          <TouchableOpacity 
            style={[styles.watchlistBtn, { backgroundColor: colors.card, borderColor: colors.backgroundElement, borderWidth: 1 }]} 
            onPress={handleAddWatchlist}
          >
            <Ionicons name="bookmark-outline" size={20} color={colors.text} />
            <ThemedText style={styles.watchlistBtnText}>
              Add to Watchlist
            </ThemedText>
          </TouchableOpacity>
        )}

        <View style={[styles.divider, { backgroundColor: colors.backgroundElement }]} />

        {mediaBase.type === 'series' && mediaBase.seasons && (
          <View style={styles.seasonsContainer}>
            {mediaBase.seasons.map(season => {
              const isExpanded = expandedSeason === season.seasonNumber;
              const episodes = seasonEpisodes[season.seasonNumber] || [];
              const watchedInSeason = watchedEpisodes.filter(we => we.seasonNumber === season.seasonNumber).length;
              const isAllSelected = episodes.length > 0 && watchedInSeason === episodes.length;
              
              return (
                <View key={season.seasonNumber} style={[styles.seasonCard, { backgroundColor: colors.card }]}>
                  <TouchableOpacity 
                    style={styles.seasonHeader} 
                    onPress={() => handleExpandSeason(season.seasonNumber)}
                  >
                    <View>
                      <ThemedText style={styles.seasonName}>{season.name?.toUpperCase() || `SEASON ${season.seasonNumber}`}</ThemedText>
                      <ThemedText style={[styles.seasonMeta, { color: colors.textSecondary }]}>
                        {season.episodeCount} episodes · {watchedInSeason} watched
                      </ThemedText>
                    </View>
                    <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color={colors.textSecondary} />
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.episodesList}>
                      {isLoadingSeason ? (
                        <ActivityIndicator size="small" color={colors.primary} style={{ margin: 16 }} />
                      ) : (
                        <>
                          {episodes.length > 0 && (
                            <TouchableOpacity 
                              style={styles.selectAllBtn}
                              onPress={() => toggleSeasonEpisodes(season.seasonNumber, episodes, !isAllSelected)}
                            >
                              <ThemedText style={[styles.selectAllText, { color: colors.primary }]}>
                                {isAllSelected ? "Deselect All" : "Select All"}
                              </ThemedText>
                            </TouchableOpacity>
                          )}
                          {episodes.map(ep => {
                            const epId = `s${season.seasonNumber}e${ep.episode_number}`;
                            const isEpWatched = watchedEpisodes.some(we => we.episodeId === epId);
                            return (
                              <TouchableOpacity 
                                key={epId} 
                                style={[styles.episodeRow, { borderTopColor: colors.backgroundElement }]}
                                onPress={() => toggleEpisode(season.seasonNumber, ep)}
                              >
                                <Ionicons 
                                  name={isEpWatched ? "checkbox" : "square-outline"} 
                                  size={20} 
                                  color={isEpWatched ? colors.primary : colors.textSecondary} 
                                />
                                <View style={styles.episodeInfo}>
                                  <ThemedText style={styles.episodeTitle} numberOfLines={1}>
                                    S{season.seasonNumber}E{ep.episode_number}   {ep.name}
                                  </ThemedText>
                                  {ep.runtime ? (
                                    <ThemedText style={[styles.episodeRuntime, { color: colors.textSecondary }]}>
                                      {ep.runtime}m
                                    </ThemedText>
                                  ) : null}
                                </View>
                              </TouchableOpacity>
                            );
                          })}
                        </>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
            <View style={[styles.divider, { backgroundColor: colors.backgroundElement, marginTop: 16 }]} />
          </View>
        )}

        <View style={styles.ratingSection}>
          <RatingInput value={rating} onChange={setRating} />
          
          <TouchableOpacity 
            style={[styles.saveBtn, { backgroundColor: colors.primary }]} 
            onPress={handleSaveCollection}
          >
            <ThemedText style={styles.saveBtnText}>
              {existingCollectionItem ? "Update Collection" : "Save to Collection"}
            </ThemedText>
          </TouchableOpacity>
        </View>

        {existingItem && (
          <TouchableOpacity 
            style={styles.deleteBtn} 
            onPress={() => setShowCollectionModal(true)}
          >
            <ThemedText style={styles.deleteBtnText}>
              {existingCollectionItem ? "Remove from Collection" : ""}
            </ThemedText>
          </TouchableOpacity>
        )}
      </ScrollView>

      <TouchableOpacity onPress={handleBack} style={[styles.closeBtn, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <Ionicons name="close" size={24} color="#FFF" />
      </TouchableOpacity>

      <ConfirmationModal
        visible={showWatchlistModal}
        title="Remove from Watchlist?"
        description="This title will be removed from your watchlist."
        onConfirm={handleRemoveFromWatchlistConfirm}
        onCancel={() => setShowWatchlistModal(false)}
      />

      <ConfirmationModal
        visible={showCollectionModal}
        title="Remove from Collection?"
        description="This title will be permanently removed from your watched collection."
        onConfirm={handleRemoveCollectionConfirm}
        onCancel={() => setShowCollectionModal(false)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 60,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  genres: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  tmdbScore: {
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  tmdbLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
    opacity: 0.8,
  },
  tmdbScoreText: {
    fontSize: 14,
    fontWeight: '600',
  },
  overviewContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  overviewText: {
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.8,
  },
  watchlistBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  watchlistBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 16,
  },
  seasonsContainer: {
    paddingHorizontal: 16,
  },
  seasonCard: {
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  seasonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  seasonName: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  seasonMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  episodesList: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  selectAllBtn: {
    paddingVertical: 8,
    marginBottom: 4,
    alignItems: 'flex-end',
  },
  selectAllText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  episodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  episodeInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  episodeTitle: {
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  episodeRuntime: {
    fontSize: 12,
  },
  ratingSection: {
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  saveBtn: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveBtnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteBtn: {
    marginTop: 24,
    alignItems: 'center',
  },
  deleteBtnText: {
    color: '#ff3b30',
    fontSize: 14,
  },
  closeBtn: {
    position: 'absolute',
    top: 40,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


