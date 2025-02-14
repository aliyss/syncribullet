import { description, version } from '../../package.json';
import type {
  AllReceivers,
  ReceiverMCITypes,
} from './receiver/types/receivers';

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

export type ManifestCatalogItemType<
  R extends AllReceivers,
  RCS extends string,
  RCT extends string,
> = {
  receiverType: R;
  receiverCatalogStatus: RCS;
  receiverCatalogType: RCT;
};

export type SYNCRIBULLETID = 'syncribullet';

export type SyncribulletManifestCatalogItemId<MCIT extends ReceiverMCITypes> =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  MCIT extends infer _ extends ReceiverMCITypes
    ? `${SYNCRIBULLETID}-${MCIT['receiverType']}-${MCIT['receiverCatalogType']}-${MCIT['receiverCatalogStatus']}`
    : never;

export type ManifestCatalogItem<MCIT extends ReceiverMCITypes> = {
  id: SyncribulletManifestCatalogItemId<MCIT>;
  type: ManifestReceiverTypes;
  name: string;
  genres?: readonly string[];
  extra?: Readonly<
    { name: ManifestCatalogExtraParameters; isRequired: boolean }[]
  >;
};

export interface Manifest<MCIT extends ReceiverMCITypes> {
  id: string;
  name: string;
  version: string;
  description: string;
  logo: string;
  background: string;
  catalogs: ManifestCatalogItem<MCIT>[];
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

export const manifest: Manifest<ReceiverMCITypes> = {
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
