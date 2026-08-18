export type MediaType = 'movie' | 'series';

export interface BaseMedia {
  id: string;
  title: string;
  year: string;
  poster: string;
  type: MediaType;
  genres: string[];
}

export interface WatchedItem extends BaseMedia {
  rating: number; // 0.0 to 10.0
  rank?: number; // Automatically calculated
  dateAdded: number;
}

export interface WatchlistItem extends BaseMedia {
  dateAdded: number;
}
