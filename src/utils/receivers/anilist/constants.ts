import {
  ManifestCatalogExtraParameters,
  ManifestReceiverTypes,
} from '~/utils/manifest';
import type { ManifestCatalogItem } from '~/utils/manifest';
import type { ReceiverInfo } from '~/utils/receiver/receiver';
import { Receivers } from '~/utils/receiver/types/receivers';

export const receiverInfo: ReceiverInfo = {
  id: Receivers.ANILIST,
  icon: 'https://api.iconify.design/simple-icons:anilist.svg?color=%23FFFFFF',
  text: 'Anilist',
  backgroundColour: 'bg-[#00cdff]/60',
  liveSync: true,
  fullSync: true,
};

export const manifestCatalogItems = [
  {
    id: 'syncribullet-anilist-anime-CURRENT',
    type: ManifestReceiverTypes.ANIME,
    name: 'Anilist - Watching',
    genres: ['tv', 'special', 'ova', 'movie', 'music video', 'ona'],
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
    genres: ['tv', 'special', 'ova', 'movie', 'music video', 'ona'],
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
    genres: ['tv', 'special', 'ova', 'movie', 'music video', 'ona'],
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
    genres: ['tv', 'special', 'ova', 'movie', 'music video', 'ona'],
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
    genres: ['tv', 'special', 'ova', 'movie', 'music video', 'ona'],
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
    genres: ['tv', 'special', 'ova', 'movie', 'music video', 'ona'],
    extra: [
      { name: ManifestCatalogExtraParameters.SEARCH, isRequired: false },
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
] as const satisfies Readonly<ManifestCatalogItem[]>;

export const defaultCatalogs: Readonly<
  (typeof manifestCatalogItems)[number]['id'][]
> = [
  'syncribullet-anilist-anime-CURRENT',
  'syncribullet-anilist-anime-PLANNING',
  'syncribullet-anilist-anime-COMPLETED',
] as const;
