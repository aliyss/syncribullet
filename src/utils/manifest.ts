import { description, version } from '../../package.json';

export enum ManifestReceiverTypes {
  MOVIE = 'movie',
  SERIES = 'series',
  ANIME = 'anime',
  CHANNELS = 'channel',
  TV = 'tv',
}

export enum ManifestCatalogExtraParameters {
  GENRE = 'genre',
  SEARCH = 'search',
  SKIP = 'skip',
}

export interface ManifestCatalogItem {
  id: string;
  type: ManifestReceiverTypes;
  name: string;
  genres?: string[];
  extra?: { name: ManifestCatalogExtraParameters; isRequired: boolean }[];
}

export interface Manifest {
  id: string;
  name: string;
  version: string;
  description: string;
  logo: string;
  background: string;
  catalogs: ManifestCatalogItem[];
  resources: [
    'catalog',
    (
      | 'meta'
      | { name: 'meta'; types: ManifestReceiverTypes[]; idPrefixes: string[] }
    ),
    'stream',
    'subtitles',
  ];
  types: ManifestReceiverTypes[];
  behaviorHints: {
    configurable: boolean;
    configurationRequired: boolean;
  };
}

export const manifest: Manifest = {
  id: `com.aliyss.syncribullet`,
  name: 'syncribullet',
  version: version,
  description,
  logo: 'https://github.com/aliyss/syncribullet/blob/master/public/android-chrome-192x192.png?raw=true',
  background: '',
  catalogs: [],
  resources: [
    'catalog',
    {
      name: 'meta',
      types: [
        ManifestReceiverTypes.MOVIE,
        ManifestReceiverTypes.SERIES,
        ManifestReceiverTypes.ANIME,
      ],
      idPrefixes: ['anilist_'],
    },
    'stream',
    'subtitles',
  ],
  types: [
    ManifestReceiverTypes.MOVIE,
    ManifestReceiverTypes.SERIES,
    ManifestReceiverTypes.ANIME,
  ],
  behaviorHints: {
    configurable: true,
    configurationRequired: true,
  },
};
