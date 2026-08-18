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
      
      let runtime = 0;
      if (type === 'movie' && item.runtime) {
        runtime = item.runtime;
      } else if (type === 'series' && item.episode_run_time && item.episode_run_time.length > 0) {
        // Use average episode runtime * number of episodes to get total watch time if desired,
        // or just store episode runtime. We'll store episode runtime * number of episodes if available
        runtime = (item.episode_run_time[0] || 0) * (item.number_of_episodes || 1);
      }

      return {
        id,
        title,
        year,
        poster,
        type,
        genres,
        runtime,
      } as BaseMedia;
    } catch (error) {
      console.error("TMDB Details Error:", error);
      return null;
    }
  }
};
