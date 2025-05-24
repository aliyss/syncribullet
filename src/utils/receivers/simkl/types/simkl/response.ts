import type { SimklCatalogStatus } from '../catalog/catalog-status';
import type {
  SimklLibraryAnimeType,
  SimklMovieAddToList,
  SimklShowAddToList,
} from './library';

export interface SyncResponseStatus {
  request: SimklMovieAddToList | SimklShowAddToList;
  response: {
    status: SimklCatalogStatus;
    simkl_type: 'movie' | 'show' | 'anime';
    anime_type?: SimklLibraryAnimeType;
  };
}

export interface SyncResponseAdded {
  movies: number;
  shows: number;
  episodes: number;
  statuses: SyncResponseStatus[];
}

export interface SyncResponse {
  added: SyncResponseAdded;
  not_found: {
    movies: any[];
    shows: any[];
    episodes: any[];
  };
}
