import { description, version } from '../../package.json';

export interface ManifestCatalogItem {
  id: string;
  type: 'movie' | 'series' | 'channels';
  name: string;
  genres?: string[];
  extra?: { name: string; isRequired: boolean }[];
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
    'meta' | { name: 'meta'; types: ['movie', 'series']; idPrefixes: string[] },
    'stream',
    'subtitles',
  ];
  types: ['series', 'movie'];
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
      types: ['movie', 'series'],
      idPrefixes: ['anilist_'],
    },
    'stream',
    'subtitles',
  ],
  types: ['series', 'movie'],
  behaviorHints: {
    configurable: true,
    configurationRequired: true,
  },
};
