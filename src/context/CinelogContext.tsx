import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseMedia, WatchedItem, WatchlistItem, WatchedEpisode } from '../types';
import { useAuth } from './AuthContext';
import { mediaRepository } from '../services/firestore/mediaRepository';
import { watchlistRepository } from '../services/firestore/watchlistRepository';
import { episodeRepository } from '../services/firestore/episodeRepository';

type ThemePreference = 'dark' | 'light' | 'system';

interface CinelogContextType {
  collection: WatchedItem[];
  watchlist: WatchlistItem[];
  theme: ThemePreference;
  addWatched: (item: BaseMedia, rating?: number, watchedEpisodes?: WatchedEpisode[]) => Promise<void>;
  updateWatched: (id: string, updates: { rating?: number; watchedEpisodes?: WatchedEpisode[] }) => Promise<void>;
  removeWatched: (id: string) => Promise<void>;
  addToWatchlist: (item: BaseMedia) => Promise<void>;
  removeFromWatchlist: (id: string) => Promise<void>;
  setThemePreference: (theme: ThemePreference) => Promise<void>;
  isLoaded: boolean;
  isLoadingCloudData: boolean;
}

const CinelogContext = createContext<CinelogContextType | undefined>(undefined);

export function useCinelog() {
  const context = useContext(CinelogContext);
  if (!context) {
    throw new Error('useCinelog must be used within a CinelogProvider');
  }
  return context;
}

export function CinelogProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  const [collection, setCollection] = useState<WatchedItem[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [theme, setTheme] = useState<ThemePreference>('dark');
  
  // isLoaded is for local theme init
  const [isLoaded, setIsLoaded] = useState(false);
  // isLoadingCloudData is for the Firestore fetch
  const [isLoadingCloudData, setIsLoadingCloudData] = useState(false);

  useEffect(() => {
    loadLocalTheme();
  }, []);

  useEffect(() => {
    if (user) {
      loadCloudData(user.uid);
    } else {
      setCollection([]);
      setWatchlist([]);
    }
  }, [user]);

  const loadLocalTheme = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem('@cinelog_theme');
      if (storedTheme) setTheme(storedTheme as ThemePreference);
    } catch (e) {
      console.error('Failed to load theme', e);
    } finally {
      setIsLoaded(true);
    }
  };

  const loadCloudData = async (uid: string) => {
    setIsLoadingCloudData(true);
    try {
      const [mediaDocs, watchlistDocs, episodeDocs] = await Promise.all([
        mediaRepository.getAllMedia(uid),
        watchlistRepository.getWatchlist(uid),
        episodeRepository.getWatchedEpisodes(uid)
      ]);

      // Merge episodes back into media
      const mediaWithEpisodes = mediaDocs.map(media => {
        const episodesForMedia = episodeDocs.filter(ep => ep.mediaId === media.id.toString());
        return {
          ...media,
          watchedEpisodes: episodesForMedia.length > 0 ? episodesForMedia : undefined
        };
      });

      setCollection(calculateRanks(mediaWithEpisodes as WatchedItem[]));
      setWatchlist(watchlistDocs as WatchlistItem[]);
    } catch (error: any) {
      console.error('Failed to load cloud data:', error.code, error.message);
      Alert.alert('Data Error', 'Cloud sync failed. Please try again.');
    } finally {
      setIsLoadingCloudData(false);
    }
  };

  const calculateRanks = (items: WatchedItem[]): WatchedItem[] => {
    const sorted = [...items].sort((a, b) => {
      const aRating = a.rating ?? 0;
      const bRating = b.rating ?? 0;
      
      if (bRating !== aRating) {
        return bRating - aRating;
      }
      return a.title.localeCompare(b.title);
    });

    return sorted.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  };

  const addWatched = async (item: BaseMedia, rating?: number, watchedEpisodes?: WatchedEpisode[]) => {
    if (!user) return;
    
    const previousCollection = [...collection];
    const previousWatchlist = [...watchlist];

    const newItem: WatchedItem = {
      ...item,
      rating,
      dateAdded: Date.now(),
      watchedEpisodes,
    };
    
    let newWatchlist = [...watchlist];
    const totalEpisodes = item.seasons?.reduce((acc, s) => acc + s.episodeCount, 0) || 0;
    const isCompletedSeries = item.type === 'series' && watchedEpisodes && watchedEpisodes.length >= totalEpisodes && totalEpisodes > 0;
    
    if (item.type === 'movie' || isCompletedSeries) {
      newWatchlist = watchlist.filter(w => w.id !== item.id);
      setWatchlist(newWatchlist);
    }

    const newCollection = calculateRanks([...collection, newItem]);
    setCollection(newCollection);

    try {
      await mediaRepository.addMedia(user.uid, item, rating);
      
      // If there are watched episodes, save them to Firestore
      if (watchedEpisodes && watchedEpisodes.length > 0) {
        await Promise.all(
          watchedEpisodes.map(ep => episodeRepository.markEpisodeWatched(user.uid, item.id.toString(), ep))
        );
      }

      // If removed from watchlist, delete from Firestore
      if (previousWatchlist.length !== newWatchlist.length) {
        await watchlistRepository.removeFromWatchlist(user.uid, item.id.toString());
      }
    } catch (error: any) {
      console.error('Firestore write failed:', error.code, error.message);
      setCollection(previousCollection);
      setWatchlist(previousWatchlist);
      Alert.alert('Error', 'Cloud sync failed. Changes reverted.');
    }
  };

  const updateWatched = async (id: string, updates: Partial<WatchedItem>) => {
    if (!user) return;

    const previousCollection = [...collection];
    const previousWatchlist = [...watchlist];

    const updatedCollection = collection.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    const rankedCollection = calculateRanks(updatedCollection);
    setCollection(rankedCollection);
    
    let newWatchlist = [...watchlist];
    const updatedItem = updatedCollection.find(i => i.id === id);
    if (updatedItem && updatedItem.type === 'series' && updatedItem.watchedEpisodes) {
      const totalEpisodes = updatedItem.seasons?.reduce((acc, s) => acc + s.episodeCount, 0) || 0;
      if (updatedItem.watchedEpisodes.length >= totalEpisodes && totalEpisodes > 0) {
        newWatchlist = watchlist.filter(w => w.id !== id);
        if (newWatchlist.length !== watchlist.length) {
          setWatchlist(newWatchlist);
        }
      }
    }

    try {
      // Just re-save the entire media document using addMedia, which performs setDoc (upsert)
      if (updatedItem) {
        await mediaRepository.addMedia(user.uid, updatedItem as BaseMedia, updatedItem.rating);

        // Diff the episodes and handle updates if watchedEpisodes changed
        if (updates.watchedEpisodes) {
          const oldItem = previousCollection.find(i => i.id === id);
          const oldEpisodes = oldItem?.watchedEpisodes || [];
          const newEpisodes = updates.watchedEpisodes;
          
          // Find added episodes
          const addedEpisodes = newEpisodes.filter(nEp => 
            !oldEpisodes.some(oEp => oEp.seasonNumber === nEp.seasonNumber && oEp.episodeNumber === nEp.episodeNumber)
          );
          
          // Find removed episodes
          const removedEpisodes = oldEpisodes.filter(oEp => 
            !newEpisodes.some(nEp => nEp.seasonNumber === oEp.seasonNumber && nEp.episodeNumber === oEp.episodeNumber)
          );

          await Promise.all([
            ...addedEpisodes.map(ep => episodeRepository.markEpisodeWatched(user.uid, id, ep)),
            ...removedEpisodes.map(ep => episodeRepository.unmarkEpisodeWatched(user.uid, id, ep.seasonNumber, ep.episodeNumber))
          ]);
        }

        if (previousWatchlist.length !== newWatchlist.length) {
          await watchlistRepository.removeFromWatchlist(user.uid, id);
        }
      }
    } catch (error: any) {
      console.error('Firestore update failed:', error.code, error.message);
      setCollection(previousCollection);
      setWatchlist(previousWatchlist);
      Alert.alert('Error', 'Cloud sync failed. Changes reverted.');
    }
  };

  const removeWatched = async (id: string) => {
    if (!user) return;
    const previousCollection = [...collection];
    const newCollection = calculateRanks(collection.filter(item => item.id !== id));
    setCollection(newCollection);

    try {
      await mediaRepository.removeMedia(user.uid, id);
      
      // Also clean up all episodes for this media
      const oldItem = previousCollection.find(i => i.id === id);
      if (oldItem && oldItem.watchedEpisodes) {
        await Promise.all(oldItem.watchedEpisodes.map(ep => 
          episodeRepository.unmarkEpisodeWatched(user.uid, id, ep.seasonNumber, ep.episodeNumber)
        ));
      }
    } catch (error: any) {
      console.error('Firestore delete failed:', error.code, error.message);
      setCollection(previousCollection);
      Alert.alert('Error', 'Cloud sync failed. Changes reverted.');
    }
  };

  const addToWatchlist = async (item: BaseMedia) => {
    if (!user) return;
    if (collection.find(c => c.id === item.id)) return;
    if (watchlist.find(w => w.id === item.id)) return;

    const previousWatchlist = [...watchlist];
    const newItem: WatchlistItem = {
      ...item,
      dateAdded: Date.now(),
    };

    const newWatchlist = [newItem, ...watchlist];
    setWatchlist(newWatchlist);

    try {
      await watchlistRepository.addToWatchlist(user.uid, item);
    } catch (error: any) {
      console.error('Firestore write failed:', error.code, error.message);
      setWatchlist(previousWatchlist);
      Alert.alert('Error', 'Cloud sync failed. Changes reverted.');
    }
  };

  const removeFromWatchlist = async (id: string) => {
    if (!user) return;
    const previousWatchlist = [...watchlist];
    const newWatchlist = watchlist.filter(item => item.id !== id);
    setWatchlist(newWatchlist);

    try {
      await watchlistRepository.removeFromWatchlist(user.uid, id);
    } catch (error: any) {
      console.error('Firestore delete failed:', error.code, error.message);
      setWatchlist(previousWatchlist);
      Alert.alert('Error', 'Cloud sync failed. Changes reverted.');
    }
  };

  const setThemePreference = async (newTheme: ThemePreference) => {
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('@cinelog_theme', newTheme);
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  };

  return (
    <CinelogContext.Provider value={{
      collection,
      watchlist,
      theme,
      addWatched,
      updateWatched,
      removeWatched,
      addToWatchlist,
      removeFromWatchlist,
      setThemePreference,
      isLoaded,
      isLoadingCloudData
    }}>
      {children}
    </CinelogContext.Provider>
  );
}
