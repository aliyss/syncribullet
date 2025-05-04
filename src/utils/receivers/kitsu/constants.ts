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

import type { KitsuMCIT } from './types/manifest';

export const receiverInfo: ReceiverInfo<Receivers.KITSU> = {
  id: Receivers.KITSU,
  icon: 'https://api.iconify.design/simple-icons:kitsu.svg?color=%23FFFFFF',
  text: 'Kitsu',
  backgroundColour: 'bg-[#FF5B38]/60',
  borderColour: 'border-[#FF5B38]',
  liveSync: true,
  importSync: false,
};

export const internalIds = [
  [IDSources.KITSU],
  [IDSources.KITSU_NSFW],
] as const satisfies Readonly<Readonly<IDSources[]>[]>;

export const syncIds = [[IDSources.KITSU]] as const satisfies Readonly<
  Readonly<IDSources[]>[]
>;

export const manifestCatalogItems = [
  {
    id: 'syncribullet-kitsu-anime-current',
    type: ManifestReceiverTypes.ANIME,
    name: 'Kitsu - Watching',
    extra: [
      { name: ManifestCatalogExtraParameters.SEARCH, isRequired: false },
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
  {
    id: 'syncribullet-kitsu-anime-planned',
    type: ManifestReceiverTypes.ANIME,
    name: 'Kitsu - Planning',
    extra: [
      { name: ManifestCatalogExtraParameters.SEARCH, isRequired: false },
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
  {
    id: 'syncribullet-kitsu-anime-completed',
    type: ManifestReceiverTypes.ANIME,
    name: 'Kitsu - Completed',
    extra: [
      { name: ManifestCatalogExtraParameters.SEARCH, isRequired: false },
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
  {
    id: 'syncribullet-kitsu-anime-on_hold',
    type: ManifestReceiverTypes.ANIME,
    name: 'Kitsu - On Hold',
    extra: [
      { name: ManifestCatalogExtraParameters.SEARCH, isRequired: false },
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
  {
    id: 'syncribullet-kitsu-anime-dropped',
    type: ManifestReceiverTypes.ANIME,
    name: 'Kitsu - Dropped',
    extra: [
      { name: ManifestCatalogExtraParameters.SEARCH, isRequired: false },
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
] as const satisfies Readonly<ManifestCatalogItem<KitsuMCIT>[]>;

export const defaultCatalogs: Readonly<
  (typeof manifestCatalogItems)[number]['id'][]
> = [
  'syncribullet-kitsu-anime-current',
  'syncribullet-kitsu-anime-planned',
  'syncribullet-kitsu-anime-completed',
] as const satisfies Readonly<(typeof manifestCatalogItems)[number]['id'][]>;

export const defaultImportCatalogs: Readonly<
  Record<Importers, Readonly<ImportCatalogs<KitsuMCIT, ImporterMCITypes>[]>>
> = {
  simkl: [],
  stremio: [],
} as const satisfies Readonly<
  Record<Importers, Readonly<ImportCatalogs<KitsuMCIT, ImporterMCITypes>[]>>
>;

export const liveSyncTypes = [
  ManifestReceiverTypes.ANIME,
  ManifestReceiverTypes.MOVIE,
  ManifestReceiverTypes.SERIES,
] as const satisfies Readonly<ManifestReceiverTypes[]>;

export const defaultLiveSyncTypes: Readonly<(typeof liveSyncTypes)[number][]> =
  liveSyncTypes;
