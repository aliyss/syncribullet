import type { RequestHandler } from '@builder.io/qwik-city';

import { createAnilistCatalog } from '~/utils/anilist/helper';
import type { ManifestCatalogItem } from '~/utils/manifest';
import { manifest } from '~/utils/manifest';
import { unstringifySettings } from '~/utils/settings/stringify';
import type { ReceiverSettings } from '~/utils/settings/stringify';
import { createSimklCatalog } from '~/utils/simkl/helper';
import {
  CompressionType,
  compress,
  decompress,
} from '~/utils/string/compression';
import { EncryptionType, decrypt, encrypt } from '~/utils/string/encryption';

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

  const senderSettings: Record<string, ReceiverSettings> = {
    simkl: {
      catalogs: [],
    },
    anilist: {
      catalogs: [],
    },
  };

  for (let i = 0; i < userConfigString.length; i++) {
    const lineConfig = userConfigString[i].split('-=-');
    const keyConfig = lineConfig[0].split('_');
    userConfig[keyConfig[0]] = {
      ...(userConfig[keyConfig[0]] ? userConfig[keyConfig[0]] : {}),
      [keyConfig[1]]: lineConfig[1],
    };
    if (keyConfig[1] === 'settings') {
      const settings = unstringifySettings(
        lineConfig[1],
        keyConfig[0] as 'anilist' | 'simkl',
      );
      senderSettings[keyConfig[0]] = settings;
    } else if (keyConfig[0] === 'simkl' && lineConfig[1]) {
      catalogConfig.simkl = true;
    } else if (keyConfig[0] === 'anilist' && lineConfig[1]) {
      catalogConfig.anilist = true;
    }
  }

  const s = {
    userConfig,
    senderSettings,
    catalogConfig,
  };
  console.log('uncompressed', encodeURI(JSON.stringify(s)).length);

  const xe = compress(
    compress(JSON.stringify(s), CompressionType.MAPPING),
    CompressionType.LZ,
  );
  const ye = encrypt(xe, 'hello', EncryptionType.FPE);
  console.log('compressed', ye.length);
  const result = decompress(decompress(decrypt(ye, 'hello')));
  console.log(
    'Decrypted same?',
    result ===
      JSON.stringify({
        userConfig,
        senderSettings,
        catalogConfig,
      }),
  );

  let catalogs: ManifestCatalogItem[] = [];
  if (catalogConfig.simkl) {
    catalogs = [
      ...catalogs,
      ...createSimklCatalog(senderSettings['simkl'].catalogs),
    ];
  }

  if (catalogConfig.anilist) {
    catalogs = [
      ...catalogs,
      ...createAnilistCatalog(senderSettings['anilist'].catalogs),
    ];
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
