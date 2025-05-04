import { axiosSessionCache } from '~/utils/axios/client-cache';
import { createSimklHeaders } from '~/utils/receivers/simkl/api/headers';
import type {
  SimklLibrary,
  SimklLibraryListEntry,
} from '~/utils/receivers/simkl/types/simkl/library';

import type { ImporterSimklMCIT } from '../types/manifest';

export async function getSimklLibraryItems(
  auth: ImporterSimklMCIT['auth'],
  dateFrom?: string,
): Promise<SimklLibraryListEntry[]> {
  if (!auth) {
    throw new Error('No auth provided');
  }

  let url = `https://api.simkl.com/sync/all-items/`;
  if (dateFrom) {
    url += `?date_from=${dateFrom}`;
  }

  const response = await axiosSessionCache()<SimklLibrary>(url, {
    id: `simkl-library-items-${dateFrom}`,
    method: 'GET',
    headers: createSimklHeaders(auth),
    cache: {
      ttl: 1000 * 60 * 20,
      interpretHeader: false,
      staleIfError: 60 * 60 * 5,
    },
  });
  const previews = response.data;
  return [
    ...(previews.movies ?? []),
    ...(previews.shows ?? []),
    ...(previews.anime ?? []),
  ].sort((a, b) => {
    const dateA = a.last_watched_at || a.added_to_watchlist_at;
    const dateB = b.last_watched_at || b.added_to_watchlist_at;
    return dateB.localeCompare(dateA);
  });
}
