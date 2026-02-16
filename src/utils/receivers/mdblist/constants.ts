import type {
  ImporterMCITypes,
  Importers,
} from '~/utils/importer/types/importers';
import type { ImportCatalogs } from '~/utils/importer/types/user-settings/import-catalogs';
import {
  ManifestCatalogExtraParameters,
  ManifestReceiverTypes,
} from '~/utils/manifest';
import type { ManifestCatalogItem } from '~/utils/manifest';
import type { ReceiverInfo } from '~/utils/receiver/receiver';
import { IDSources } from '~/utils/receiver/types/id';
import { Receivers } from '~/utils/receiver/types/receivers';

import { MDBListCatalogType } from './types/catalog/catalog-type';
import type { MDBListMCIT } from './types/manifest';

export const receiverInfo: ReceiverInfo<Receivers.MDBLIST> = {
  id: Receivers.MDBLIST,
  icon: 'https://api.iconify.design/simple-icons:mdblist.svg?color=%23FFFFFF',
  text: 'MDBList',
  backgroundColour: 'bg-[#1A1A1A]/60',
  borderColour: 'border-[#1A1A1A]',
  liveSync: true,
  importSync: false,
};

export const internalIds = [[IDSources.MDBLIST]] as const satisfies Readonly<
  Readonly<IDSources[]>[]
>;

export const syncIds = [
  [IDSources.MDBLIST],
  [IDSources.IMDB],
  [IDSources.TMDB],
  [IDSources.TRAKT],
] as const satisfies Readonly<Readonly<IDSources[]>[]>;

export const manifestCatalogItems = [
  {
    id: 'syncribullet-mdblist-movies-watchlist',
    type: ManifestReceiverTypes.MOVIE,
    name: 'MDBList - Watchlist',
    extra: [
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
  {
    id: 'syncribullet-mdblist-movies-history',
    type: ManifestReceiverTypes.MOVIE,
    name: 'MDBList - History',
    extra: [
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
  {
    id: 'syncribullet-mdblist-shows-upnext',
    type: ManifestReceiverTypes.SERIES,
    name: 'MDBList - Up Next',
    extra: [
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
  {
    id: 'syncribullet-mdblist-shows-watchlist',
    type: ManifestReceiverTypes.SERIES,
    name: 'MDBList - Watchlist',
    extra: [
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
  {
    id: 'syncribullet-mdblist-shows-history',
    type: ManifestReceiverTypes.SERIES,
    name: 'MDBList - History',
    extra: [
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
  {
    id: 'syncribullet-mdblist-shows-dropped',
    type: ManifestReceiverTypes.SERIES,
    name: 'MDBList - Dropped',
    extra: [
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
] as const satisfies Readonly<ManifestCatalogItem<MDBListMCIT>[]>;

export const defaultCatalogs: Readonly<
  (typeof manifestCatalogItems)[number]['id'][]
> = [
  'syncribullet-mdblist-movies-watchlist',
  'syncribullet-mdblist-movies-history',
  'syncribullet-mdblist-shows-upnext',
  'syncribullet-mdblist-shows-watchlist',
  'syncribullet-mdblist-shows-history',
] as const satisfies Readonly<(typeof manifestCatalogItems)[number]['id'][]>;

// Import sync is disabled (importSync: false), so no import catalog mappings needed
export const defaultImportCatalogs: Readonly<
  Record<Importers, Readonly<ImportCatalogs<MDBListMCIT, ImporterMCITypes>[]>>
> = {
  simkl: [],
  stremio: [],
} as const satisfies Readonly<
  Record<Importers, Readonly<ImportCatalogs<MDBListMCIT, ImporterMCITypes>[]>>
>;

export const liveSyncTypes = [
  ManifestReceiverTypes.MOVIE,
  ManifestReceiverTypes.SERIES,
] as const satisfies Readonly<ManifestReceiverTypes[]>;

export const defaultLiveSyncTypes: Readonly<(typeof liveSyncTypes)[number][]> =
  liveSyncTypes;

export const receiverTypeMapping = {
  [MDBListCatalogType.MOVIES]: ManifestReceiverTypes.MOVIE,
  [MDBListCatalogType.SHOWS]: ManifestReceiverTypes.SERIES,
};
export const receiverTypeReverseMapping = {
  [ManifestReceiverTypes.MOVIE]: MDBListCatalogType.MOVIES,
  [ManifestReceiverTypes.SERIES]: MDBListCatalogType.SHOWS,
  [ManifestReceiverTypes.ANIME]: MDBListCatalogType.SHOWS,
  [ManifestReceiverTypes.CHANNELS]: MDBListCatalogType.SHOWS,
  [ManifestReceiverTypes.TV]: MDBListCatalogType.SHOWS,
};
