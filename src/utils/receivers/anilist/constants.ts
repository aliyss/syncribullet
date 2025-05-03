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

import type { AnilistMCIT } from './types/manifest';

export const receiverInfo: ReceiverInfo<Receivers.ANILIST> = {
  id: Receivers.ANILIST,
  icon: 'https://api.iconify.design/simple-icons:anilist.svg?color=%23FFFFFF',
  text: 'Anilist',
  backgroundColour: 'bg-[#00cdff]/60',
  borderColour: 'border-[#00cdff]',
  liveSync: true,
  importSync: true,
};

export const internalIds = [[IDSources.ANILIST]] as const satisfies Readonly<
  Readonly<IDSources[]>[]
>;

export const syncIds = [[IDSources.ANILIST]] as const satisfies Readonly<
  Readonly<IDSources[]>[]
>;

export const manifestCatalogItems = [
  {
    id: 'syncribullet-anilist-anime-CURRENT',
    type: ManifestReceiverTypes.ANIME,
    name: 'Anilist - Watching',
    extra: [
      { name: ManifestCatalogExtraParameters.SEARCH, isRequired: false },
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
  {
    id: 'syncribullet-anilist-anime-PLANNING',
    type: ManifestReceiverTypes.ANIME,
    name: 'Anilist - Planning',
    extra: [
      { name: ManifestCatalogExtraParameters.SEARCH, isRequired: false },
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
  {
    id: 'syncribullet-anilist-anime-COMPLETED',
    type: ManifestReceiverTypes.ANIME,
    name: 'Anilist - Completed',
    extra: [
      { name: ManifestCatalogExtraParameters.SEARCH, isRequired: false },
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
  {
    id: 'syncribullet-anilist-anime-PAUSED',
    type: ManifestReceiverTypes.ANIME,
    name: 'Anilist - On Hold',
    extra: [
      { name: ManifestCatalogExtraParameters.SEARCH, isRequired: false },
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
  {
    id: 'syncribullet-anilist-anime-DROPPED',
    type: ManifestReceiverTypes.ANIME,
    name: 'Anilist - Dropped',
    extra: [
      { name: ManifestCatalogExtraParameters.SEARCH, isRequired: false },
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
  {
    id: 'syncribullet-anilist-anime-REPEATING',
    type: ManifestReceiverTypes.ANIME,
    name: 'Anilist - Repeating',
    extra: [
      { name: ManifestCatalogExtraParameters.SEARCH, isRequired: false },
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
] as const satisfies Readonly<ManifestCatalogItem<AnilistMCIT>[]>;

export const defaultCatalogs: Readonly<
  (typeof manifestCatalogItems)[number]['id'][]
> = [
  'syncribullet-anilist-anime-CURRENT',
  'syncribullet-anilist-anime-PLANNING',
  'syncribullet-anilist-anime-COMPLETED',
] as const satisfies Readonly<(typeof manifestCatalogItems)[number]['id'][]>;

export const defaultImportCatalogs: Readonly<
  Record<Importers, Readonly<ImportCatalogs<AnilistMCIT, ImporterMCITypes>[]>>
> = {
  stremio: [
    {
      id: 'syncribullet-anilist-anime-CURRENT',
      filters: {
        stateFlaggedWatched: false,
      },
    },
  ],
} as const satisfies Readonly<
  Record<Importers, Readonly<ImportCatalogs<AnilistMCIT, ImporterMCITypes>[]>>
>;

export const liveSyncTypes = [
  ManifestReceiverTypes.ANIME,
  ManifestReceiverTypes.MOVIE,
  ManifestReceiverTypes.SERIES,
] as const satisfies Readonly<ManifestReceiverTypes[]>;

export const defaultLiveSyncTypes: Readonly<(typeof liveSyncTypes)[number][]> =
  liveSyncTypes;
