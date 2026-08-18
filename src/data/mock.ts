import { BaseMedia } from '../types';

export const mockMedia: BaseMedia[] = [
  {
    id: 'm1',
    title: 'Interstellar',
    year: '2014',
    poster: 'https://image.tmdb.org/t/p/w500/gEU2QlsUUHXjNpevd0sgoeTveR2.jpg',
    type: 'movie',
    genres: ['Sci-Fi', 'Drama', 'Adventure'],
    runtime: 169,
  },
  {
    id: 'm2',
    title: 'The Dark Knight',
    year: '2008',
    poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    type: 'movie',
    genres: ['Action', 'Crime', 'Drama'],
    runtime: 152,
  },
  {
    id: 'm3',
    title: 'Inception',
    year: '2010',
    poster: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    type: 'movie',
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    runtime: 148,
  },
  {
    id: 'm4',
    title: 'Dune',
    year: '2021',
    poster: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
    type: 'movie',
    genres: ['Sci-Fi', 'Adventure'],
    runtime: 155,
  },
  {
    id: 'm5',
    title: 'The Matrix',
    year: '1999',
    poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GvwJwB02xcUK.jpg',
    type: 'movie',
    genres: ['Action', 'Sci-Fi'],
    runtime: 136,
  },
  {
    id: 't1',
    title: 'Breaking Bad',
    year: '2008',
    poster: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    type: 'series',
    genres: ['Crime', 'Drama', 'Thriller'],
    runtime: 2940, // 62 episodes * ~47m
  },
  {
    id: 't2',
    title: 'Stranger Things',
    year: '2016',
    poster: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8SlgwTW7T.jpg',
    type: 'series',
    genres: ['Sci-Fi', 'Mystery', 'Drama'],
    runtime: 1700, // 34 episodes * ~50m
  },
  {
    id: 't3',
    title: 'Succession',
    year: '2018',
    poster: 'https://image.tmdb.org/t/p/w500/7rrKCWqFj4M7b5LzY2A5n3rS7Xw.jpg',
    type: 'series',
    genres: ['Drama', 'Comedy'],
    runtime: 2360, // 39 episodes * ~60m
  },
];
