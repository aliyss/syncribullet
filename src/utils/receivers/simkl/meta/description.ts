import type { SimklLibraryMovieObject } from '../types/simkl/library';

export const buildMovieUserDescription = (
  movie: SimklLibraryMovieObject,
): string => {
  const description = [];

  if (movie.added_to_watchlist_at) {
    description.push(`----------------`);
    description.push(
      `• Added to watchlist: ${movie.added_to_watchlist_at
        .split('T')[0]
        .replace(/-/g, '/')}`,
    );
    if (movie.last_watched_at) {
      description.push(
        `• Last watched: ${movie.last_watched_at
          .split('T')[0]
          .replace(/-/g, '/')}`,
      );
    }
  }

  if (movie.user_rating) {
    description.push(`----------------`);
    description.push(`• Rating: ${movie.user_rating}`);
    if (movie.user_rated_at) {
      description.push(
        `• Rated at: ${movie.user_rated_at.split('T')[0].replace(/-/g, '/')}`,
      );
    }
  }

  return description.join('\n');
};
