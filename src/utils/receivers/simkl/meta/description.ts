import type {
  SimklLibraryMovieObject,
  SimklLibraryShowObject,
} from '../types/simkl/library';

export const buildLibraryObjectUserDescription = (
  libraryObject: SimklLibraryMovieObject | SimklLibraryShowObject,
): string => {
  const description = [];

  if (libraryObject.added_to_watchlist_at) {
    description.push(
      `• Added to watchlist: ${
        libraryObject.added_to_watchlist_at.split('T')[0]
      }`,
    );
    if (libraryObject.last_watched_at) {
      description.push(
        `• Last watched: ${libraryObject.last_watched_at.split('T')[0]}`,
      );
    }
  }

  if (libraryObject.user_rating) {
    if (description.length > 0) {
      description.push(`----------------`);
    }

    description.push(`• Rating: ${libraryObject.user_rating}`);
    if (libraryObject.user_rated_at) {
      description.push(
        `• Rated at: ${libraryObject.user_rated_at
          .split('T')[0]
          .replace(/-/g, '/')}`,
      );
    }
  }

  if (description.length > 0) {
    description.push(`----------------`);
  }

  return description.join('\n');
};
