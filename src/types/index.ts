export type MediaType = 'movie' | 'series';

export interface TMDBSeason {
  seasonNumber: number;
  episodeCount: number;
  name: string;
}

export interface BaseMedia {
  id: string;
  title: string;
  year: string;
  poster: string;
  type: MediaType;
  genres: string[];
  runtime?: number; // in minutes (for movie)
  overview?: string;
  tmdbRating?: number;
  tmdbVoteCount?: number;
  seasons?: TMDBSeason[];
}

export interface WatchedEpisode {
  episodeId: string; // e.g. "s1e1"
  seasonNumber: number;
  episodeNumber: number;
  runtime: number | null;
}

export interface WatchedItem extends BaseMedia {
  rating: number; // 0.0 to 10.0
  rank?: number; // Automatically calculated
  dateAdded: number;
  watchedEpisodes?: WatchedEpisode[];
}

export interface WatchlistItem extends BaseMedia {
  dateAdded: number;
}
