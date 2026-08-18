import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseMedia, WatchedItem, WatchlistItem } from '../types';

type ThemePreference = 'dark' | 'light' | 'system';

interface CinelogContextType {
  collection: WatchedItem[];
  watchlist: WatchlistItem[];
  theme: ThemePreference;
  addWatched: (item: BaseMedia, rating: number, watchedEpisodes?: any[]) => Promise<void>;
  updateWatched: (id: string, updates: Partial<WatchedItem>) => Promise<void>;
  removeWatched: (id: string) => Promise<void>;
  addToWatchlist: (item: BaseMedia) => Promise<void>;
  removeFromWatchlist: (id: string) => Promise<void>;
  setThemePreference: (theme: ThemePreference) => Promise<void>;
  isLoaded: boolean;
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
  const [collection, setCollection] = useState<WatchedItem[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [theme, setTheme] = useState<ThemePreference>('dark');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedCollection = await AsyncStorage.getItem('@cinelog_collection');
      const storedWatchlist = await AsyncStorage.getItem('@cinelog_watchlist');
      const storedTheme = await AsyncStorage.getItem('@cinelog_theme');

      if (storedCollection) setCollection(JSON.parse(storedCollection));
      if (storedWatchlist) setWatchlist(JSON.parse(storedWatchlist));
      if (storedTheme) setTheme(storedTheme as ThemePreference);
    } catch (e) {
      console.error('Failed to load data', e);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveData = async (key: string, data: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`Failed to save ${key}`, e);
    }
  };

  const calculateRanks = (items: WatchedItem[]): WatchedItem[] => {
    // Sort by rating descending, then by title ascending to keep it stable
    const sorted = [...items].sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return a.title.localeCompare(b.title);
    });

    return sorted.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  };

  const addWatched = async (item: BaseMedia, rating: number, watchedEpisodes?: any[]) => {
    const newItem: WatchedItem = {
      ...item,
      rating,
      dateAdded: Date.now(),
      watchedEpisodes,
    };
    
    let newWatchlist = watchlist;
    const totalEpisodes = item.seasons?.reduce((acc, s) => acc + s.episodeCount, 0) || 0;
    const isCompletedSeries = item.type === 'series' && watchedEpisodes && watchedEpisodes.length >= totalEpisodes && totalEpisodes > 0;
    
    if (item.type === 'movie' || isCompletedSeries) {
      newWatchlist = watchlist.filter(w => w.id !== item.id);
      setWatchlist(newWatchlist);
      await saveData('@cinelog_watchlist', newWatchlist);
    }

    const newCollection = calculateRanks([...collection, newItem]);
    setCollection(newCollection);
    await saveData('@cinelog_collection', newCollection);
  };

  const updateWatched = async (id: string, updates: Partial<WatchedItem>) => {
    const updatedCollection = collection.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    const rankedCollection = calculateRanks(updatedCollection);
    setCollection(rankedCollection);
    await saveData('@cinelog_collection', rankedCollection);
    
    // Auto-remove from watchlist if completed
    const updatedItem = updatedCollection.find(i => i.id === id);
    if (updatedItem && updatedItem.type === 'series' && updatedItem.watchedEpisodes) {
      const totalEpisodes = updatedItem.seasons?.reduce((acc, s) => acc + s.episodeCount, 0) || 0;
      if (updatedItem.watchedEpisodes.length >= totalEpisodes && totalEpisodes > 0) {
        const newWatchlist = watchlist.filter(w => w.id !== id);
        if (newWatchlist.length !== watchlist.length) {
          setWatchlist(newWatchlist);
          await saveData('@cinelog_watchlist', newWatchlist);
        }
      }
    }
  };

  const removeWatched = async (id: string) => {
    const newCollection = calculateRanks(collection.filter(item => item.id !== id));
    setCollection(newCollection);
    await saveData('@cinelog_collection', newCollection);
  };

  const addToWatchlist = async (item: BaseMedia) => {
    // Check if already in collection
    if (collection.find(c => c.id === item.id)) return;
    // Check if already in watchlist
    if (watchlist.find(w => w.id === item.id)) return;

    const newItem: WatchlistItem = {
      ...item,
      dateAdded: Date.now(),
    };

    const newWatchlist = [newItem, ...watchlist];
    setWatchlist(newWatchlist);
    await saveData('@cinelog_watchlist', newWatchlist);
  };

  const removeFromWatchlist = async (id: string) => {
    const newWatchlist = watchlist.filter(item => item.id !== id);
    setWatchlist(newWatchlist);
    await saveData('@cinelog_watchlist', newWatchlist);
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
      isLoaded
    }}>
      {children}
    </CinelogContext.Provider>
  );
}
