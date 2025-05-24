import type { ImportCatalogEntityType } from '~/utils/importer/types/user-settings/import-catalogs';

export interface StremioImportLibraryItem extends Record<string, unknown> {
  _id: string;
  removed: boolean;
  temp: boolean;
  _ctime: number;
  _mtime: number;
  state: {
    lastWatched?: string;
    timeWatched?: number;
    timeOffset?: number;
    overallTimeWatched?: number;
    timesWatched?: number;
    flaggedWatched: boolean;
    duration?: number;
    videoId?: string;
    watched?: string;
    noNotif?: boolean;
    season?: number;
    episode?: number;
  };
  name: string;
  type: ImportCatalogEntityType;
  poster?: string;
  posterShape?: string;
  background?: string;
  logo?: string;
  year?: number;
}
