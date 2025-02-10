import type { IDs } from '~/utils/ids/types';

import type { RequireAtLeastOne } from '~/utils/helpers/types';
import { MinifiedManifestCatalogItem } from '~/utils/receiver/manifest';

export enum SimklLibraryType {
  MOVIES = 'movies',
  SHOWS = 'shows',
  ANIME = 'anime',
}

export type SimklLibraryObjectStatus =
  | 'watching'
  | 'plantowatch'
  | 'completed'
  | 'hold'
  | 'dropped';

export interface SimklIds extends IDs {}

export interface SimklMovieAddToList {
  title?: string;
  ids: RequireAtLeastOne<SimklIds>;
  to?: string;
  watched_at?: string;
}

export interface SimklShowEpisodeAddToList {
  number?: number;
  watched_at?: string;
}

export interface SimklShowSeasonAddToList {
  number?: number;
  watched_at?: string;
  episodes?: SimklShowEpisodeAddToList[];
}

export interface SimklShowAddToList {
  title?: string;
  ids: RequireAtLeastOne<SimklIds>;
  to?: string;
  watched_at?: string;
  seasons?: SimklShowSeasonAddToList[];
}

export interface SimklLibraryObjectShow {
  title: string;
  poster: string;
  fanart: null | string;
  year: number;
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
  ids: RequireAtLeastOne<SimklIds>;
}

export interface SimklLibraryObjectMovie {
  title: string;
  poster: string;
  year: number;
  ids: RequireAtLeastOne<SimklIds>;
}

export interface SimklLibraryObjectBase {
  last_watched_at: string | null;
  user_rating: number | null;
  status: SimklLibraryObjectStatus;
}

export interface SimklLibraryShowObject extends SimklLibraryObjectBase {
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

export interface SimklUserConfig {
  accesstoken: string;
  clientid: string;
}

export interface SimklUserConfig {
  auth: {
    access_token: string;
    clientid: string | null;
  };
  catalogs: MinifiedManifestCatalogItem[] | undefined;
}
