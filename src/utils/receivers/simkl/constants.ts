import {
  ManifestCatalogExtraParameters,
  ManifestReceiverTypes,
} from '~/utils/manifest';
import type { ManifestCatalogItem } from '~/utils/manifest';
import type { ReceiverInfo } from '~/utils/receiver/receiver';
import { IDSources } from '~/utils/receiver/types/id';
import { Receivers } from '~/utils/receiver/types/receivers';

import type { SimklMCIT } from './types/manifest';

export const receiverInfo: ReceiverInfo<Receivers.SIMKL> = {
  id: Receivers.SIMKL,
  icon: 'https://api.iconify.design/simple-icons:simkl.svg?color=%23FFFFFF',
  text: 'Simkl',
  backgroundColour: 'bg-[#0C0F11]/60',
  borderColour: 'border-[#0C0F11]',
  liveSync: true,
  fullSync: true,
};

export const internalIds = [[IDSources.SIMKL]] as const satisfies Readonly<
  Readonly<IDSources[]>[]
>;

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
    genres: ['tv', 'special', 'ova', 'movie', 'music video', 'ona'],
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

export const liveSyncTypes = [
  ManifestReceiverTypes.ANIME,
  ManifestReceiverTypes.MOVIE,
  ManifestReceiverTypes.SERIES,
] as const satisfies Readonly<ManifestReceiverTypes[]>;

export const defaultLiveSyncTypes: Readonly<(typeof liveSyncTypes)[number][]> =
  liveSyncTypes;
