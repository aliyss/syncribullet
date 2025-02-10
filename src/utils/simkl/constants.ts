import {
  ManifestCatalogExtraParameters,
  type ManifestCatalogItem,
  ManifestReceiverTypes,
} from '../manifest';
import { ReceiverId, type ReceiverInfo } from '../receiver/receiver';

export const receiverInfo: ReceiverInfo = {
  id: ReceiverId.SIMKL,
  icon: 'https://api.iconify.design/simple-icons:simkl.svg?color=%23FFFFFF',
  text: 'Simkl',
  backgroundColour: 'bg-[#0C0F11]/60',
  liveSync: true,
  fullSync: true,
};

export const manifestCatalogItems: ManifestCatalogItem[] = [
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
    genres: ['tv', 'special', 'ova', 'movie', 'music video', 'ona'],
    extra: [
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
  {
    id: 'syncribullet-simkl-anime-completed',
    type: ManifestReceiverTypes.ANIME,
    name: 'Simkl - Completed',
    genres: ['tv', 'special', 'ova', 'movie', 'music video', 'ona'],
    extra: [
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
  {
    id: 'syncribullet-simkl-anime-hold',
    type: ManifestReceiverTypes.ANIME,
    name: 'Simkl - On Hold',
    genres: ['tv', 'special', 'ova', 'movie', 'music video', 'ona'],
    extra: [
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
  {
    id: 'syncribullet-simkl-anime-dropped',
    type: ManifestReceiverTypes.ANIME,
    name: 'Simkl - Dropped',
    genres: ['tv', 'special', 'ova', 'movie', 'music video', 'ona'],
    extra: [
      { name: ManifestCatalogExtraParameters.GENRE, isRequired: false },
      { name: ManifestCatalogExtraParameters.SKIP, isRequired: false },
    ],
  },
];

export const defaultCatalogs: ManifestCatalogItem['id'][] = [
  'syncribullet-simkl-movies-plantowatch',
  'syncribullet-simkl-movies-completed',
  'syncribullet-simkl-anime-watching',
  'syncribullet-simkl-anime-plantowatch',
  'syncribullet-simkl-anime-completed',
  'syncribullet-simkl-shows-watching',
  'syncribullet-simkl-shows-plantowatch',
  'syncribullet-simkl-shows-completed',
];
