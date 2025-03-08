import type {
  TVTimeCatalogMovieStatus,
  TVTimeCatalogSeriesStatus,
} from '../catalog/catalog-status';

export interface TVTimeExternalSource {
  id: string;
  source: string;
  type: 'external_source';
}

export interface TVTimeFanart {
  comment: string;
  favorite_count: number;
  height: number;
  lang: string;
  thumb_url: string;
  type: 'fanart';
  url: string;
  uuid: string;
  width: number;
}

export interface TVTimeLibraryEntryMeta {
  overview: string;
  name: string;
  character_order: string;
  characters: any[];
  created_at: string;
  external_sources: TVTimeExternalSource[];
  fanart: TVTimeFanart[];
  filter: any[];
  first_release_date: string;
  follower_count: number;
  runtime: number;
  franchise: {
    name: string;
    type: 'franchise';
    uuid: string;
  };
  genres: string[];
  imdb_id: string;
  is_released: boolean;
  type: 'movie';
  trailers: {
    embeddable: boolean;
    is_featured: boolean;
    language: string;
    name: string;
    runtime: number;
    thumb_url: string;
    type: 'trailer';
    url: string;
    uuid: string;
  }[];
  posters: {
    comment: string;
    favorite_count: number;
    height: number;
    lang: string;
    thumb_url: string;
    type: 'poster';
    url: string;
    uuid: string;
    width: number;
  }[];
  translations: any[];
  updated_at: string;
  uuid: string;
}

export interface TVTimeLibraryEntryMovie {
  uuid: string;
  type: 'follow';
  entity_type: 'series' | 'movie';
  created_at: string; // 2021-08-26T14:00:00.000Z
  updated_at: string;
  watched_at: string;
  meta: TVTimeLibraryEntryMeta;
  filter: (TVTimeCatalogMovieStatus | 'all')[];
}

export interface TVTimeLibraryEntryResponse {
  data: {
    user_id: string;
    type: 'list';
    objects: TVTimeLibraryEntryMovie[];
  };
}

export type TVTimeLibraryEntryShowFilter =
  | {
      id: 'progress';
      values: TVTimeCatalogSeriesStatus[];
    }
  | {
      id: 'status';
      values: ('ended' | 'continuing')[];
    };

export type TVTimeLibraryEntryShowSorting =
  | {
      id: 'last_watched';
      value: string;
    }
  | {
      id: 'last_added';
      value: string;
    }
  | {
      id: 'alphabetical';
      value: string;
    };

export interface TVTimeLibraryEntryShow {
  id: number;
  imdb_id: string;
  runtime: number;
  rating: number;
  name: string;
  poster: {
    id: string;
    url: string;
  };
  genres: string[];
  trailers: TVTimeLibraryEntryMeta['trailers'];
  overview: string;
  type: 'series';
  filters: TVTimeLibraryEntryShowFilter[];
  sorting: TVTimeLibraryEntryShowSorting[];
  watched_episode_count: number;
  aired_episode_count: number;
  fanart: {
    id: string;
    url: string;
  };
}

export interface TVTimeLibraryEntryShowsResponse {
  shows: TVTimeLibraryEntryShow[];
  id: number;
  name: string;
}

export type TVTimeLibraryEntry =
  | TVTimeLibraryEntryMovie
  | TVTimeLibraryEntryShow;
