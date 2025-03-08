import {
  ManifestCatalogExtraParameters,
  ManifestReceiverTypes,
} from '~/utils/manifest';
import type { ManifestCatalogItem } from '~/utils/manifest';
import type { ReceiverInfo } from '~/utils/receiver/receiver';
import { IDSources } from '~/utils/receiver/types/id';
import { Receivers } from '~/utils/receiver/types/receivers';

import type { TVTimeMCIT } from './types/manifest';

export const receiverInfo: ReceiverInfo<Receivers.TVTIME> = {
  id: Receivers.TVTIME,
  icon: 'https://api.iconify.design/simple-icons:tvtime.svg?color=%23FFFFFF',
  text: 'TVTime',
  backgroundColour: 'bg-[#ffd400]/60',
  borderColour: 'border-[#ffd400]',
  liveSync: true,
  fullSync: true,
};

export const internalIds = [[IDSources.IMDB]] as const satisfies Readonly<
  Readonly<IDSources[]>[]
>;

export const syncIds = [[IDSources.IMDB]] as const satisfies Readonly<
  Readonly<IDSources[]>[]
>;

export const manifestCatalogItems = [
  {
    id: 'syncribullet-tvtime-movie-watched',
    type: ManifestReceiverTypes.MOVIE,
    name: 'TVTime - Completed',
    extra: [
      { name: ManifestCatalogExtraParameters.SEARCH, isRequired: false },
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
  {
    id: 'syncribullet-tvtime-movie-not_watched',
    type: ManifestReceiverTypes.MOVIE,
    name: 'TVTime - Planning',
    extra: [
      { name: ManifestCatalogExtraParameters.SEARCH, isRequired: false },
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
  {
    id: 'syncribullet-tvtime-series-finished',
    type: ManifestReceiverTypes.SERIES,
    name: 'TVTime - Completed',
    extra: [
      { name: ManifestCatalogExtraParameters.SEARCH, isRequired: false },
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
  {
    id: 'syncribullet-tvtime-series-watching',
    type: ManifestReceiverTypes.SERIES,
    name: 'TVTime - Watching',
    extra: [
      { name: ManifestCatalogExtraParameters.SEARCH, isRequired: false },
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
  {
    id: 'syncribullet-tvtime-series-not_started_yet',
    type: ManifestReceiverTypes.SERIES,
    name: 'TVTime - Planning',
    extra: [
      { name: ManifestCatalogExtraParameters.SEARCH, isRequired: false },
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
] as const satisfies Readonly<ManifestCatalogItem<TVTimeMCIT>[]>;

export const defaultCatalogs: Readonly<
  (typeof manifestCatalogItems)[number]['id'][]
> = [
  'syncribullet-tvtime-movie-watched',
  'syncribullet-tvtime-movie-not_watched',
  'syncribullet-tvtime-series-finished',
  'syncribullet-tvtime-series-watching',
  'syncribullet-tvtime-series-not_started_yet',
] as const satisfies Readonly<(typeof manifestCatalogItems)[number]['id'][]>;

export const liveSyncTypes = [
  ManifestReceiverTypes.MOVIE,
  ManifestReceiverTypes.SERIES,
] as const satisfies Readonly<ManifestReceiverTypes[]>;

export const defaultLiveSyncTypes: Readonly<(typeof liveSyncTypes)[number][]> =
  liveSyncTypes;
