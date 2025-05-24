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

import { SimklCatalogType } from './types/catalog/catalog-type';
import type { SimklMCIT } from './types/manifest';

export const receiverInfo: ReceiverInfo<Receivers.SIMKL> = {
  id: Receivers.SIMKL,
  icon: 'https://api.iconify.design/simple-icons:simkl.svg?color=%23FFFFFF',
  text: 'Simkl',
  backgroundColour: 'bg-[#0C0F11]/60',
  borderColour: 'border-[#0C0F11]',
  liveSync: true,
  importSync: true,
};

export const internalIds = [[IDSources.SIMKL]] as const satisfies Readonly<
  Readonly<IDSources[]>[]
>;

export const syncIds = [
  [IDSources.SIMKL],
  [IDSources.IMDB],
  [IDSources.MAL],
  [IDSources.KITSU],
] as const satisfies Readonly<Readonly<IDSources[]>[]>;

export const manifestCatalogItems = [
  {
    id: 'syncribullet-simkl-movies-plantowatch',
    type: ManifestReceiverTypes.MOVIE,
    name: 'Simkl - Plan to Watch',
    extra: [
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
  {
    id: 'syncribullet-simkl-movies-completed',
    type: ManifestReceiverTypes.MOVIE,
    name: 'Simkl - Completed',
    extra: [
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
  {
    id: 'syncribullet-simkl-movies-dropped',
    type: ManifestReceiverTypes.MOVIE,
    name: 'Simkl - Dropped',
    extra: [
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
  {
    id: 'syncribullet-simkl-shows-watching',
    type: ManifestReceiverTypes.SERIES,
    name: 'Simkl - Watching',
    extra: [
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
  {
    id: 'syncribullet-simkl-shows-plantowatch',
    type: ManifestReceiverTypes.SERIES,
    name: 'Simkl - Plan to Watch',
    extra: [
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
  {
    id: 'syncribullet-simkl-shows-completed',
    type: ManifestReceiverTypes.SERIES,
    name: 'Simkl - Completed',
    extra: [
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
  {
    id: 'syncribullet-simkl-shows-hold',
    type: ManifestReceiverTypes.SERIES,
    name: 'Simkl - On Hold',
    extra: [
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
  {
    id: 'syncribullet-simkl-shows-dropped',
    type: ManifestReceiverTypes.SERIES,
    name: 'Simkl - Dropped',
    extra: [
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
  {
    id: 'syncribullet-simkl-anime-watching',
    type: ManifestReceiverTypes.ANIME,
    name: 'Simkl - Watching',
    extra: [
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
  {
    id: 'syncribullet-simkl-anime-plantowatch',
    type: ManifestReceiverTypes.ANIME,
    name: 'Simkl - Plan to Watch',
    extra: [
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
  {
    id: 'syncribullet-simkl-anime-completed',
    type: ManifestReceiverTypes.ANIME,
    name: 'Simkl - Completed',
    extra: [
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
  {
    id: 'syncribullet-simkl-anime-hold',
    type: ManifestReceiverTypes.ANIME,
    name: 'Simkl - On Hold',
    extra: [
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
  {
    id: 'syncribullet-simkl-anime-dropped',
    type: ManifestReceiverTypes.ANIME,
    name: 'Simkl - Dropped',
    extra: [
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
] as const satisfies Readonly<ManifestCatalogItem<SimklMCIT>[]>;

export const defaultCatalogs: Readonly<
  (typeof manifestCatalogItems)[number]['id'][]
> = [
  'syncribullet-simkl-movies-plantowatch',
  'syncribullet-simkl-movies-completed',
  'syncribullet-simkl-anime-watching',
  'syncribullet-simkl-anime-plantowatch',
  'syncribullet-simkl-anime-completed',
  'syncribullet-simkl-shows-watching',
  'syncribullet-simkl-shows-plantowatch',
  'syncribullet-simkl-shows-completed',
] as const satisfies Readonly<(typeof manifestCatalogItems)[number]['id'][]>;

export const defaultImportCatalogs: Readonly<
  Record<Importers, Readonly<ImportCatalogs<SimklMCIT, ImporterMCITypes>[]>>
> = {
  simkl: [],
  stremio: [
    {
      id: 'syncribullet-simkl-movies-plantowatch',
      value: true,
      filters: {
        moviesStateFlaggedWatched: false,
        moviesStateFlaggedUnwatched: true,
        moviesStateFlaggedDropped: false,
        seriesStateFlaggedWatched: null,
        seriesStateFlaggedUnwatched: null,
        seriesStateFlaggedDropped: null,
        seriesStateFlaggedOnHold: null,
        seriesPreferStateFlaggedWatchedOverWatchCount: null,
        seriesUseCinemetaComparison: null,
        seriesStateHasWatchCount: null,
        seriesBackfillEpisodes: null,
        supportsTypes: [ManifestReceiverTypes.MOVIE],
      },
    },
    {
      id: 'syncribullet-simkl-movies-completed',
      value: true,
      filters: {
        moviesStateFlaggedWatched: true,
        moviesStateFlaggedUnwatched: false,
        moviesStateFlaggedDropped: false,
        seriesStateFlaggedWatched: null,
        seriesStateFlaggedUnwatched: null,
        seriesStateFlaggedDropped: null,
        seriesStateFlaggedOnHold: null,
        seriesPreferStateFlaggedWatchedOverWatchCount: null,
        seriesStateHasWatchCount: null,
        seriesUseCinemetaComparison: null,
        seriesBackfillEpisodes: null,
        supportsTypes: [ManifestReceiverTypes.MOVIE],
      },
    },
    {
      id: 'syncribullet-simkl-movies-dropped',
      value: true,
      filters: {
        moviesStateFlaggedWatched: false,
        moviesStateFlaggedUnwatched: true,
        moviesStateFlaggedDropped: true,
        seriesStateFlaggedWatched: null,
        seriesStateFlaggedUnwatched: null,
        seriesStateFlaggedDropped: null,
        seriesStateFlaggedOnHold: null,
        seriesPreferStateFlaggedWatchedOverWatchCount: null,
        seriesStateHasWatchCount: null,
        seriesUseCinemetaComparison: null,
        seriesBackfillEpisodes: null,
        supportsTypes: [ManifestReceiverTypes.MOVIE],
      },
    },
    {
      id: 'syncribullet-simkl-shows-watching',
      value: true,
      filters: {
        moviesStateFlaggedWatched: null,
        moviesStateFlaggedUnwatched: null,
        moviesStateFlaggedDropped: null,
        seriesStateFlaggedWatched: false,
        seriesStateFlaggedUnwatched: true,
        seriesStateFlaggedDropped: false,
        seriesStateFlaggedOnHold: false,
        seriesStateHasWatchCount: true,
        seriesPreferStateFlaggedWatchedOverWatchCount: true,
        seriesUseCinemetaComparison: true,
        seriesBackfillEpisodes: true,
        supportsTypes: [ManifestReceiverTypes.SERIES],
      },
    },
    {
      id: 'syncribullet-simkl-shows-plantowatch',
      value: true,
      filters: {
        moviesStateFlaggedWatched: null,
        moviesStateFlaggedUnwatched: null,
        moviesStateFlaggedDropped: null,
        seriesStateFlaggedWatched: false,
        seriesStateFlaggedUnwatched: true,
        seriesStateFlaggedDropped: false,
        seriesStateFlaggedOnHold: false,
        seriesStateHasWatchCount: false,
        seriesPreferStateFlaggedWatchedOverWatchCount: true,
        seriesUseCinemetaComparison: false,
        seriesBackfillEpisodes: false,
        supportsTypes: [ManifestReceiverTypes.SERIES],
      },
    },
    {
      id: 'syncribullet-simkl-shows-completed',
      value: true,
      filters: {
        moviesStateFlaggedWatched: null,
        moviesStateFlaggedUnwatched: null,
        moviesStateFlaggedDropped: null,
        seriesStateFlaggedWatched: true,
        seriesStateFlaggedUnwatched: false,
        seriesStateFlaggedDropped: false,
        seriesStateFlaggedOnHold: false,
        seriesStateHasWatchCount: null,
        seriesPreferStateFlaggedWatchedOverWatchCount: true,
        seriesUseCinemetaComparison: false,
        seriesBackfillEpisodes: true,
        supportsTypes: [ManifestReceiverTypes.SERIES],
      },
    },
    {
      id: 'syncribullet-simkl-shows-hold',
      value: true,
      filters: {
        moviesStateFlaggedWatched: null,
        moviesStateFlaggedUnwatched: null,
        moviesStateFlaggedDropped: null,
        seriesStateFlaggedWatched: false,
        seriesStateFlaggedUnwatched: true,
        seriesStateFlaggedDropped: false,
        seriesStateFlaggedOnHold: true,
        seriesPreferStateFlaggedWatchedOverWatchCount: true,
        seriesStateHasWatchCount: true,
        seriesUseCinemetaComparison: true,
        seriesBackfillEpisodes: true,
        supportsTypes: [ManifestReceiverTypes.SERIES],
      },
    },
    {
      id: 'syncribullet-simkl-shows-dropped',
      value: true,
      filters: {
        moviesStateFlaggedWatched: null,
        moviesStateFlaggedUnwatched: null,
        moviesStateFlaggedDropped: null,
        seriesStateFlaggedWatched: false,
        seriesStateFlaggedUnwatched: true,
        seriesStateFlaggedDropped: true,
        seriesStateFlaggedOnHold: false,
        seriesStateHasWatchCount: true,
        seriesPreferStateFlaggedWatchedOverWatchCount: true,
        seriesUseCinemetaComparison: true,
        seriesBackfillEpisodes: true,
        supportsTypes: [ManifestReceiverTypes.SERIES],
      },
    },
    {
      id: 'syncribullet-simkl-anime-watching',
      value: true,
      filters: {
        moviesStateFlaggedWatched: null,
        moviesStateFlaggedUnwatched: null,
        moviesStateFlaggedDropped: null,
        seriesStateFlaggedWatched: false,
        seriesStateFlaggedUnwatched: true,
        seriesStateFlaggedDropped: false,
        seriesStateFlaggedOnHold: false,
        seriesStateHasWatchCount: true,
        seriesPreferStateFlaggedWatchedOverWatchCount: false,
        seriesUseCinemetaComparison: true,
        seriesBackfillEpisodes: true,
        supportsTypes: [
          ManifestReceiverTypes.SERIES,
          ManifestReceiverTypes.MOVIE,
        ],
      },
    },
    {
      id: 'syncribullet-simkl-anime-plantowatch',
      value: true,
      filters: {
        moviesStateFlaggedWatched: false,
        moviesStateFlaggedUnwatched: true,
        moviesStateFlaggedDropped: false,
        seriesStateFlaggedWatched: false,
        seriesStateFlaggedUnwatched: true,
        seriesStateFlaggedDropped: false,
        seriesStateFlaggedOnHold: false,
        seriesStateHasWatchCount: false,
        seriesPreferStateFlaggedWatchedOverWatchCount: false,
        seriesUseCinemetaComparison: false,
        seriesBackfillEpisodes: false,
        supportsTypes: [
          ManifestReceiverTypes.SERIES,
          ManifestReceiverTypes.MOVIE,
        ],
      },
    },
    {
      id: 'syncribullet-simkl-anime-completed',
      value: true,
      filters: {
        moviesStateFlaggedWatched: true,
        moviesStateFlaggedUnwatched: false,
        moviesStateFlaggedDropped: false,
        seriesStateFlaggedWatched: true,
        seriesStateFlaggedUnwatched: false,
        seriesStateFlaggedDropped: false,
        seriesStateFlaggedOnHold: false,
        seriesStateHasWatchCount: null,
        seriesPreferStateFlaggedWatchedOverWatchCount: false,
        seriesUseCinemetaComparison: false,
        seriesBackfillEpisodes: true,
        supportsTypes: [
          ManifestReceiverTypes.SERIES,
          ManifestReceiverTypes.MOVIE,
        ],
      },
    },
    {
      id: 'syncribullet-simkl-anime-hold',
      value: true,
      filters: {
        moviesStateFlaggedWatched: false,
        moviesStateFlaggedUnwatched: true,
        moviesStateFlaggedDropped: null,
        seriesStateFlaggedWatched: false,
        seriesStateFlaggedUnwatched: true,
        seriesStateFlaggedDropped: false,
        seriesStateFlaggedOnHold: true,
        seriesStateHasWatchCount: true,
        seriesPreferStateFlaggedWatchedOverWatchCount: false,
        seriesUseCinemetaComparison: true,
        seriesBackfillEpisodes: true,
        supportsTypes: [
          ManifestReceiverTypes.SERIES,
          ManifestReceiverTypes.MOVIE,
        ],
      },
    },
    {
      id: 'syncribullet-simkl-anime-dropped',
      value: true,
      filters: {
        moviesStateFlaggedWatched: false,
        moviesStateFlaggedUnwatched: true,
        moviesStateFlaggedDropped: true,
        seriesStateFlaggedWatched: false,
        seriesStateFlaggedUnwatched: true,
        seriesStateFlaggedDropped: true,
        seriesStateFlaggedOnHold: false,
        seriesStateHasWatchCount: true,
        seriesPreferStateFlaggedWatchedOverWatchCount: false,
        seriesUseCinemetaComparison: true,
        seriesBackfillEpisodes: true,
        supportsTypes: [
          ManifestReceiverTypes.SERIES,
          ManifestReceiverTypes.MOVIE,
        ],
      },
    },
  ],
} as const satisfies Readonly<
  Record<Importers, Readonly<ImportCatalogs<SimklMCIT, ImporterMCITypes>[]>>
>;

export const liveSyncTypes = [
  ManifestReceiverTypes.ANIME,
  ManifestReceiverTypes.MOVIE,
  ManifestReceiverTypes.SERIES,
] as const satisfies Readonly<ManifestReceiverTypes[]>;

export const defaultLiveSyncTypes: Readonly<(typeof liveSyncTypes)[number][]> =
  liveSyncTypes;

export const receiverTypeMapping = {
  [SimklCatalogType.MOVIES]: ManifestReceiverTypes.MOVIE,
  [SimklCatalogType.SHOWS]: ManifestReceiverTypes.SERIES,
  [SimklCatalogType.ANIME]: ManifestReceiverTypes.ANIME,
};
export const receiverTypeReverseMapping = {
  [ManifestReceiverTypes.MOVIE]: SimklCatalogType.MOVIES,
  [ManifestReceiverTypes.SERIES]: SimklCatalogType.SHOWS,
  [ManifestReceiverTypes.ANIME]: SimklCatalogType.ANIME,
  [ManifestReceiverTypes.CHANNELS]: SimklCatalogType.SHOWS,
  [ManifestReceiverTypes.TV]: SimklCatalogType.SHOWS,
};
