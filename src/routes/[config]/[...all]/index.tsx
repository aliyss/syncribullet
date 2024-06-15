import type { RequestHandler } from '@builder.io/qwik-city';

import { createAnilistCatalog } from '~/utils/anilist/helper';
import type { ManifestCatalogItem } from '~/utils/manifest';
import { manifest } from '~/utils/manifest';
import { createSimklCatalog } from '~/utils/simkl/helper';

export const onGet: RequestHandler = async ({ json, params, cacheControl }) => {
  cacheControl({
    public: false,
    maxAge: 0,
    sMaxAge: 0,
    staleWhileRevalidate: 0,
  });
  const userConfigString = params.config.split('|');

  const userConfig: Record<string, Record<string, string> | undefined> = {};

  const catalogConfig = {
    simkl: false,
    anilist: false,
  };

  for (let i = 0; i < userConfigString.length; i++) {
    const lineConfig = userConfigString[i].split('-=-');
    const keyConfig = lineConfig[0].split('_');
    userConfig[keyConfig[0]] = {
      ...(userConfig[keyConfig[0]] ? userConfig[keyConfig[0]] : {}),
      [keyConfig[1]]: lineConfig[1],
    };
    if (keyConfig[0] === 'simkl' && lineConfig[1]) {
      catalogConfig.simkl = true;
    } else if (keyConfig[0] === 'anilist' && lineConfig[1]) {
      catalogConfig.anilist = true;
    }
  }

  let catalogs: ManifestCatalogItem[] = [];
  if (catalogConfig.simkl) {
    catalogs = [...catalogs, ...createSimklCatalog()];
  }

  if (catalogConfig.anilist) {
    catalogs = [...catalogs, ...createAnilistCatalog()];
  }

  manifest.catalogs = catalogs;

  json(200, {
    ...manifest,
    behaviorHints: {
      configurable: true,
      configurationRequired: false,
    },
  });
};
