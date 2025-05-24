import type { RequireAtLeastOne } from '~/utils/helpers/types';
import type { IDs } from '~/utils/receiver/types/id';

import type { SimklCatalogStatus } from '../catalog/catalog-status';

export type SimklIds = IDs & {
  simkl: number;
};

export interface SimklAddToList {
  title?: string;
  ids: RequireAtLeastOne<SimklIds>;
  to?: string;
  watched_at?: string;
  status?: SimklCatalogStatus;
}

export type SimklMovieAddToList = SimklAddToList;

export interface SimklShowEpisodeAddToList {
  number?: number;
  watched_at?: string;
}

export interface SimklShowSeasonAddToList {
  number?: number;
  watched_at?: string;
  episodes?: SimklShowEpisodeAddToList[];
}

export type SimklShowAddToList = SimklAddToList & {
  seasons?: SimklShowSeasonAddToList[];
};

export interface SimklLibraryObjectShow {
  title: string;
  poster: string;
  fanart: null | string;
  year?: number;
  year_start_end: number;
  genres: string[];
  overview: string;
  trailers: [{ name: null | string; youtube: string; size: number }];
  ratings: {
    simkl: {
      rating: number;
      votes: number;
    };
    imdb: {
      rating: number;
      votes: number;
    };
  };
  runtime: number;
  anime_type?: SimklLibraryAnimeType;
  ids: RequireAtLeastOne<SimklIds> & {
    simkl: number;
  };
}

export interface SimklLibraryObjectMovie {
  title: string;
  poster: string;
  year?: number;
  ids: RequireAtLeastOne<SimklIds> & {
    simkl: number;
  };
}

export interface SimklLibraryObjectBase {
  added_to_watchlist_at: string;
  last_watched_at: string | null;
  user_rated_at: string | null;
  user_rating: number | null;
  status: SimklCatalogStatus;
}

export interface SimklLibraryShowObject extends SimklLibraryObjectBase {
  last_watched: string | null;
  next_to_watch: string | null;
  watched_episodes_count?: number;
  total_episodes_count?: number;
  not_aired_episodes_count?: number;
  show: SimklLibraryObjectShow;
}

export type SimklLibraryAnimeType =
  | 'tv'
  | 'special'
  | 'ova'
  | 'movie'
  | 'music video'
  | 'ona';

export interface SimklLibraryAnimeObject extends SimklLibraryShowObject {
  anime_type: SimklLibraryAnimeType;
}

export interface SimklLibraryMovieObject extends SimklLibraryObjectBase {
  movie: SimklLibraryObjectMovie;
}

export type SimklLibraryObject = SimklLibraryObjectBase & {
  show?: SimklLibraryObjectShow;
  movie?: SimklLibraryObjectMovie;
};

export interface SimklLibrary {
  movies?: SimklLibraryMovieObject[];
  shows?: SimklLibraryShowObject[];
  anime?: SimklLibraryAnimeObject[];
}

export type SimklLibraryListEntry =
  | SimklLibraryMovieObject
  | SimklLibraryShowObject
  | SimklLibraryAnimeObject;
