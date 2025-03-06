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

export type ManifestCatalogExtra = {
  name: ManifestCatalogExtraParameters;
  isRequired?: boolean;
  options?: string[];
};

export type ManifestCatalogItemBase<
  MCE extends ManifestCatalogExtra = ManifestCatalogExtra,
> = {
  id: string;
  type: ManifestReceiverTypes;
  name: string;
  genres?: readonly string[];
  extra?: Readonly<MCE[]>;
  extraSupported?: MCE['name'][];
  extraRequired?: MCE['name'][];
};

export type ManifestCatalogItem<MCIT extends ReceiverMCITypes> =
  ManifestCatalogItemBase & {
    id: SyncribulletManifestCatalogItemId<MCIT>;
  };

export type ManifestResourceType = 'catalog' | 'meta' | 'subtitles' | 'stream';

export type ManifestResource<
  MRT extends ManifestResourceType = ManifestResourceType,
> =
  | MRT
  | {
      name: MRT;
      types: ManifestReceiverTypes[];
      idPrefixes?: string[];
    };

export interface ManifestBase<MCIB extends ManifestCatalogItemBase> {
  id: string;
  name: string;
  version: string;
  description: string;
  logo: string;
  background: string;
  catalogs: MCIB[];
  resources: ManifestResource[];
  types: ManifestReceiverTypes[];
  behaviorHints: {
    configurable: boolean;
    configurationRequired: boolean;
  };
}

export interface Manifest<MCIT extends ReceiverMCITypes>
  extends ManifestBase<ManifestCatalogItem<MCIT>> {}

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
      idPrefixes: [
        'kitsu-nsfw:',
        'kitsu:',
        'anilist:',
        'mal:',
        'tmdb:',
        'tvdb:',
        'simkl:',
      ],
    },
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
