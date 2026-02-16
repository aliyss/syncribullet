import { axiosCache } from '~/utils/axios/cache';

import { MDBListCatalogStatus } from '../types/catalog/catalog-status';
import { MDBListCatalogType } from '../types/catalog/catalog-type';
import type { MDBListUserSettings } from '../types/user-settings';

interface MDBListWatchlistItem {
  id: number;
  adult: number;
  title: string;
  imdb_id: string;
  tvdb_id: number | null;
  tmdb_id?: number;
  mdblist_id?: string;
  language: string;
  mediatype: 'movie' | 'show';
  release_year: number;
  watchlist_at?: string;
  spoken_language: string;
  country: string;
  rank: number;
  // Fields from append_to_response
  poster?: string;
  description?: string;
  genres?: string[];
  ratings?: Array<{
    source: string;
    value: number;
    score: number;
    votes: number;
  }>;
}

interface MDBListWatchedItem {
  last_watched_at: string;
  movie?: {
    title: string;
    year: number;
    ids: {
      imdb?: string;
      tmdb?: number;
      trakt?: number;
      mdblist?: string;
      tvdb?: number;
    };
  };
  show?: {
    title: string;
    year: number;
    ids: {
      imdb?: string;
      tmdb?: number;
      trakt?: number;
      mdblist?: string;
      tvdb?: number;
    };
  };
}

interface MDBListDroppedItem {
  dropped_at: string;
  show: {
    title: string;
    year: number;
    ids: {
      imdb?: string;
      tmdb?: number;
      trakt?: number;
      mdblist?: string;
      tvdb?: number;
    };
  };
}

interface MDBListUpNextItem {
  show: {
    ids: {
      mdblist?: string;
      tmdb?: number;
      imdb?: string;
      tvdb?: number;
      trakt?: number;
    };
    title: string;
    year: number;
    poster?: string;
  };
  next_episode: {
    ids: {
      tmdb?: number;
    };
    season: number;
    episode: number;
    title: string;
    air_date: string;
    runtime: number;
    still?: string;
  };
  progress: {
    watched_episode_count: number;
    total_episode_count: number;
  };
  last_watched_at: string;
}

export interface MDBListLibrary {
  movies: MDBListWatchlistItem[];
  shows: MDBListWatchlistItem[];
}

export interface MDBListWatchedLibrary {
  movies: MDBListWatchedItem[];
  shows: MDBListWatchedItem[];
}

export interface MDBListDroppedLibrary {
  shows: MDBListDroppedItem[];
}

/**
 * Fetch full media info by MDBList ID to get all IDs (IMDB, TMDB, TVDB, etc.)
 * Used to enrich Up Next items that only have MDBList IDs
 */
async function getMDBListMediaInfo(
  mdblistId: string,
  mediaType: 'movie' | 'show',
  apikey: string,
): Promise<{
  imdb?: string;
  tmdb?: number;
  tvdb?: number;
  trakt?: number;
} | null> {
  try {
    const url = `https://api.mdblist.com/mdblist/${mediaType}/${mdblistId}?apikey=${apikey}`;
    const response = await axiosCache(url, {
      id: `mdblist-media-info-${mdblistId}`,
      method: 'GET',
      cache: {
        ttl: 1000 * 60 * 20, // 20 minutes (same as catalog cache)
        interpretHeader: false,
        staleIfError: 60 * 60 * 5, // 5 hours
      },
    });

    const data = await response.data;
    return {
      imdb: data.ids?.imdb,
      tmdb: data.ids?.tmdb,
      tvdb: data.ids?.tvdb,
      trakt: data.ids?.trakt,
    };
  } catch (e) {
    console.error(`Failed to fetch MDBList media info for ${mdblistId}:`, e);
    return null;
  }
}

export async function getMDBListMetaPreviews(
  type: MDBListCatalogType,
  status: MDBListCatalogStatus,
  userConfig: MDBListUserSettings,
): Promise<MDBListLibrary> {
  if (!userConfig.auth) {
    throw new Error('No user config! This should not happen!');
  }

  let url = '';

  try {
    // Map catalog status to API endpoint
    let responseTransform: (data: any) => MDBListLibrary;

    switch (status) {
      case MDBListCatalogStatus.WATCHLIST:
        // Watchlist endpoint with metadata enrichment
        url = `https://api.mdblist.com/watchlist/items?apikey=${userConfig.auth.apikey}&limit=100&append_to_response=genres,poster,description,ratings`;
        responseTransform = (data) => ({
          movies: (data.movies || []).map((item: MDBListWatchlistItem) => ({
            ...item,
            mediatype: 'movie' as const,
          })),
          shows: (data.shows || []).map((item: MDBListWatchlistItem) => ({
            ...item,
            mediatype: 'show' as const,
          })),
        });
        break;

      case MDBListCatalogStatus.HISTORY:
        // Watched history endpoint with metadata enrichment
        url = `https://api.mdblist.com/sync/watched?apikey=${userConfig.auth.apikey}&limit=100&append_to_response=genres,ratings`;
        responseTransform = (data) => ({
          movies: (data.movies || []).map((item: MDBListWatchedItem) => ({
            id: 0,
            adult: 0,
            title: item.movie?.title || '',
            imdb_id: item.movie?.ids.imdb || '',
            tvdb_id: item.movie?.ids.tvdb || null,
            language: 'en',
            mediatype: 'movie' as const,
            release_year: item.movie?.year || 0,
            watchlist_at: item.last_watched_at,
            spoken_language: 'en',
            country: 'us',
            rank: 0,
            // Preserve enriched metadata
            poster: (item.movie as any)?.poster,
            description: (item.movie as any)?.description,
            genres: (item.movie as any)?.genres,
            ratings: (item.movie as any)?.ratings,
          })),
          shows: (data.shows || []).map((item: MDBListWatchedItem) => ({
            id: 0,
            adult: 0,
            title: item.show?.title || '',
            imdb_id: item.show?.ids.imdb || '',
            tvdb_id: item.show?.ids.tvdb || null,
            language: 'en',
            mediatype: 'show' as const,
            release_year: item.show?.year || 0,
            watchlist_at: item.last_watched_at,
            spoken_language: 'en',
            country: 'us',
            rank: 0,
            // Preserve enriched metadata
            poster: (item.show as any)?.poster,
            description: (item.show as any)?.description,
            genres: (item.show as any)?.genres,
            ratings: (item.show as any)?.ratings,
          })),
        });
        break;

      case MDBListCatalogStatus.DROPPED:
        // Dropped shows endpoint with metadata enrichment
        url = `https://api.mdblist.com/sync/dropped?apikey=${userConfig.auth.apikey}&limit=100&append_to_response=genres,ratings`;
        responseTransform = (data) => ({
          movies: [],
          shows: (data.shows || []).map((item: MDBListDroppedItem) => ({
            id: 0,
            adult: 0,
            title: item.show.title,
            imdb_id: item.show.ids.imdb || '',
            tvdb_id: item.show.ids.tvdb || null,
            language: 'en',
            mediatype: 'show' as const,
            release_year: item.show.year,
            watchlist_at: item.dropped_at,
            spoken_language: 'en',
            country: 'us',
            rank: 0,
            // Preserve enriched metadata
            poster: (item.show as any)?.poster,
            description: (item.show as any)?.description,
            genres: (item.show as any)?.genres,
            ratings: (item.show as any)?.ratings,
          })),
        });
        break;

      case MDBListCatalogStatus.UPNEXT:
        // Up Next endpoint - in-progress shows with next unwatched episodes
        // Note: This endpoint only returns TMDB and MDBList IDs
        // IMDB IDs are enriched via MDBList media info API after initial fetch
        url = `https://api.mdblist.com/upnext?apikey=${userConfig.auth.apikey}&limit=100`;
        responseTransform = (data) => ({
          movies: [],
          shows: (data.items || []).map((item: MDBListUpNextItem) => ({
            id: 0,
            adult: 0,
            title: item.show.title,
            imdb_id: item.show.ids.imdb || '',
            tvdb_id: item.show.ids.tvdb || null,
            tmdb_id: item.show.ids.tmdb,
            mdblist_id: item.show.ids.mdblist,
            language: 'en',
            mediatype: 'show' as const,
            release_year: item.show.year,
            watchlist_at: item.last_watched_at,
            spoken_language: 'en',
            country: 'us',
            rank: 0,
            // Poster from MDBList API
            poster: item.show.poster,
          })),
        });
        break;

      default:
        throw new Error(`Unsupported catalog status: ${status}`);
    }

    const response = await axiosCache(url, {
      id: `mdblist-${type}-${status}-${userConfig.auth.apikey}`,
      method: 'GET',
      cache: {
        ttl: 1000 * 60 * 20, // 20 minutes
        interpretHeader: false,
        staleIfError: 60 * 60 * 5, // 5 hours
      },
    });

    const transformedData = responseTransform(await response.data);

    // Enrich Up Next items with IMDB IDs via MDBList media info endpoint
    if (status === MDBListCatalogStatus.UPNEXT && userConfig.auth) {
      const enrichmentPromises = transformedData.shows.map(async (show) => {
        // Only enrich if we have MDBList ID but no IMDB ID
        if (show.mdblist_id && !show.imdb_id && userConfig.auth) {
          const mediaInfo = await getMDBListMediaInfo(
            show.mdblist_id,
            'show',
            userConfig.auth.apikey,
          );

          if (mediaInfo) {
            // Update with all available IDs from media info
            if (mediaInfo.imdb) show.imdb_id = mediaInfo.imdb;
            if (mediaInfo.tvdb) show.tvdb_id = mediaInfo.tvdb;
            if (mediaInfo.tmdb) show.tmdb_id = mediaInfo.tmdb;
          }
        }
        return show;
      });

      // Wait for all enrichment to complete
      transformedData.shows = await Promise.all(enrichmentPromises);
    }

    // Filter by type if specified
    if (type === MDBListCatalogType.MOVIES) {
      return {
        movies: transformedData.movies,
        shows: [],
      };
    } else if (type === MDBListCatalogType.SHOWS) {
      return {
        movies: [],
        shows: transformedData.shows,
      };
    }

    return transformedData;
  } catch (e) {
    console.error('Failed to fetch MDBList catalog data:', {
      type,
      status,
      url,
      error: e,
      message: e instanceof Error ? e.message : String(e),
      stack: e instanceof Error ? e.stack : undefined,
    });
    return {
      movies: [],
      shows: [],
    };
  }
}
