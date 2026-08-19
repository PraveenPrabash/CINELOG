import { BaseMedia } from '../types';

const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Hardcoded genre mapping to avoid extra API calls
const TMDB_GENRES: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
  10759: "Action & Adventure",
  10762: "Kids",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
};

export const tmdb = {
  async searchMulti(query: string): Promise<BaseMedia[]> {
    if (!query.trim()) return [];

    try {
      const response = await fetch(
        `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`
      );
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      const results: BaseMedia[] = data.results
        .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
        .map((item: any) => {
          const type = item.media_type === 'movie' ? 'movie' : 'series';
          const title = type === 'movie' ? item.title : item.name;
          const releaseDate = type === 'movie' ? item.release_date : item.first_air_date;
          const year = releaseDate ? releaseDate.split('-')[0] : 'Unknown';
          const poster = item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster';
          
          const genres = item.genre_ids
            ? item.genre_ids.map((id: number) => TMDB_GENRES[id] || 'Other').filter((g: string) => g !== 'Other')
            : [];

          return {
            id: `${type === 'movie' ? 'm' : 't'}-${item.id}`,
            title,
            year,
            poster,
            type,
            genres,
            // Runtime is generally not provided in the multi-search response
            runtime: undefined, 
          } as BaseMedia;
        });

      return results;
    } catch (error) {
      console.error("TMDB Search Error:", error);
      throw error;
    }
  },

  async getDetails(id: string): Promise<BaseMedia | null> {
    try {
      const [typePrefix, tmdbId] = id.split('-');
      const endpoint = typePrefix === 'm' ? 'movie' : 'tv';
      
      const response = await fetch(
        `${BASE_URL}/${endpoint}/${tmdbId}?api_key=${API_KEY}&language=en-US`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch details');
      }

      const item = await response.json();

      const type = typePrefix === 'm' ? 'movie' : 'series';
      const title = type === 'movie' ? item.title : item.name;
      const releaseDate = type === 'movie' ? item.release_date : item.first_air_date;
      const year = releaseDate ? releaseDate.split('-')[0] : 'Unknown';
      const poster = item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster';
      const genres = item.genres ? item.genres.map((g: any) => g.name) : [];
      const overview = item.overview || '';
      const tmdbRating = item.vote_average || 0;
      const tmdbVoteCount = item.vote_count || 0;
      
      let runtime = 0;
      let seasons = undefined;
      
      if (type === 'movie' && item.runtime) {
        runtime = item.runtime;
      } else if (type === 'series' && item.seasons) {
        seasons = item.seasons
          .filter((s: any) => s.season_number > 0) // Skip specials
          .map((s: any) => ({
            seasonNumber: s.season_number,
            episodeCount: s.episode_count,
            name: s.name,
          }));
      }

      return {
        id,
        title,
        year,
        poster,
        type,
        genres,
        runtime,
        overview,
        tmdbRating,
        tmdbVoteCount,
        seasons,
      } as BaseMedia;
    } catch (error) {
      console.error("TMDB Details Error:", error);
      return null;
    }
  },

  async getSeasonDetails(tmdbIdFull: string, seasonNumber: number): Promise<any> {
    try {
      const [typePrefix, tmdbId] = tmdbIdFull.split('-');
      if (typePrefix !== 't') return null;

      const response = await fetch(
        `${BASE_URL}/tv/${tmdbId}/season/${seasonNumber}?api_key=${API_KEY}&language=en-US`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch season ${seasonNumber} details`);
      }

      return await response.json();
    } catch (error) {
      console.error("TMDB Season Details Error:", error);
      return null;
    }
  },

  async getPopularMovies(): Promise<BaseMedia[]> {
    return this._fetchList('/movie/popular', 'movie');
  },
  async getPopularSeries(): Promise<BaseMedia[]> {
    return this._fetchList('/tv/popular', 'series');
  },
  async getTrendingMovies(): Promise<BaseMedia[]> {
    return this._fetchList('/trending/movie/week', 'movie');
  },
  async getTrendingSeries(): Promise<BaseMedia[]> {
    return this._fetchList('/trending/tv/week', 'series');
  },

  async _fetchList(endpoint: string, expectedType: 'movie' | 'series'): Promise<BaseMedia[]> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=en-US&page=1`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      return data.results.map((item: any) => {
        const title = expectedType === 'movie' ? item.title : item.name;
        const releaseDate = expectedType === 'movie' ? item.release_date : item.first_air_date;
        const year = releaseDate ? releaseDate.split('-')[0] : 'Unknown';
        const poster = item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster';
        
        const genres = item.genre_ids
          ? item.genre_ids.map((id: number) => TMDB_GENRES[id] || 'Other').filter((g: string) => g !== 'Other')
          : [];

        return {
          id: `${expectedType === 'movie' ? 'm' : 't'}-${item.id}`,
          title,
          year,
          poster,
          type: expectedType,
          genres,
        } as BaseMedia;
      });
    } catch (error) {
      console.error(`TMDB List Error (${endpoint}):`, error);
      return [];
    }
  }
};
