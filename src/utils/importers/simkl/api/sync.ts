import { axiosInstance } from '~/utils/axios/client-cache';
import { createSimklHeaders } from '~/utils/receivers/simkl/api/headers';
import type {
  SimklMovieAddToList,
  SimklShowAddToList,
} from '~/utils/receivers/simkl/types/simkl/library';
import type { SyncResponse } from '~/utils/receivers/simkl/types/simkl/response';

import type { ImporterSimklMCIT } from '../types/manifest';

export async function syncSimklLibraryItems(
  auth: ImporterSimklMCIT['auth'],
  items: { movies: SimklMovieAddToList[]; shows: SimklShowAddToList[] },
): Promise<SyncResponse> {
  if (!auth) {
    throw new Error('No auth provided');
  }

  const url = `https://api.simkl.com/sync/history/`;

  const response = await axiosInstance<SyncResponse>(url, {
    method: 'POST',
    headers: createSimklHeaders(auth),
    data: items,
  });
  if (!response.status.toString().startsWith('2')) {
    throw new Error(`Failed to sync items: ${response.statusText}`);
  }
  return response.data;
}

export async function syncSimklLibraryItemsAddToLibrary(
  auth: ImporterSimklMCIT['auth'],
  items: { movies: SimklMovieAddToList[]; shows: SimklShowAddToList[] },
): Promise<SyncResponse> {
  if (!auth) {
    throw new Error('No auth provided');
  }

  const url = `https://api.simkl.com/sync/add-to-list/`;

  const response = await axiosInstance<SyncResponse>(url, {
    method: 'POST',
    headers: createSimklHeaders(auth),
    data: items,
  });
  if (!response.status.toString().startsWith('2')) {
    throw new Error(`Failed to sync items: ${response.statusText}`);
  }
  return response.data;
}
