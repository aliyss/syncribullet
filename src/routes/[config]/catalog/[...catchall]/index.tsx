// Helpers
// Types
import type { RequestHandler } from '@builder.io/qwik-city';

import type { ReceiverTypes } from '~/utils/connections/types';

import { convertAnilistToCinemeta } from '~/utils/anilist/convert';
import { getAnilistUserList } from '~/utils/anilist/get';
import { convertSimklToCinemeta } from '~/utils/simkl/convert';
import { getSimklList } from '~/utils/simkl/get';
import type {
  SimklLibraryObjectStatus,
  SimklLibraryType,
} from '~/utils/simkl/types';

export const onGet: RequestHandler = async ({
  json,
  params,
  env,
  cacheControl,
}) => {
  if (!params.catchall.includes('skip')) {
    // 20 min
    cacheControl({
      public: true,
      maxAge: 60 * 20,
      staleWhileRevalidate: 60 * 15,
    });
  }

  console.log('meta', params);

  const userConfigString = decodeURI(params.config).split('|');

  const userConfig: Record<string, Record<string, string> | undefined> = {};
  for (let i = 0; i < userConfigString.length; i++) {
    const lineConfig = userConfigString[i].split('-=-');
    const keyConfig = lineConfig[0].split('_');
    userConfig[keyConfig[0]] = {
      ...(userConfig[keyConfig[0]] ? userConfig[keyConfig[0]] : {}),
      [keyConfig[1]]: lineConfig[1],
    };
  }

  const catchall = params.catchall.slice(0, -'.json'.length).split('/');

  if (!catchall[0] || !catchall[1]) {
    json(200, { metas: [] });
    return;
  }

  catchall[1] = catchall[1].slice('syncribullet-'.length);
  const catchallParams = (catchall[2] || 'skip=0').split('&');

  let skipCount = 0;
  let genre: string | undefined;

  for (let i = 0; i < catchallParams.length; i++) {
    const item = catchallParams[i].split('=');
    if (item[0] === 'skip') {
      skipCount = parseInt(item[1]);
    } else if (item[0] === 'genre') {
      genre = item[1];
    }
  }

  const catalogInfo: [
    ReceiverTypes,
    SimklLibraryType,
    SimklLibraryObjectStatus,
  ] = catchall[1].split('-') as [
    ReceiverTypes,
    SimklLibraryType,
    SimklLibraryObjectStatus,
  ];

  if (catalogInfo[0] === 'simkl') {
    if (userConfig['simkl'] && !userConfig['simkl'].clientid) {
      userConfig['simkl'].clientid = env.get('PRIVATE_SIMKL_CLIENT_ID') || '';
    }

    const list = await getSimklList(
      catalogInfo[1],
      catalogInfo[2],
      userConfig['simkl'],
    );

    if (list) {
      const metas = await convertSimklToCinemeta(catalogInfo[1], list, {
        skip: skipCount,
        genre: genre,
      });
      json(200, { metas: metas });
      return;
    }
  } else if (catalogInfo[0] === 'anilist') {
    const list = await getAnilistUserList(
      catalogInfo[2] as any,
      userConfig['anilist'],
    );

    if (list.data.MediaListCollection.lists[0]) {
      const metas = await convertAnilistToCinemeta(
        'shows',
        list.data.MediaListCollection.lists[0].entries,
        {
          skip: skipCount,
          genre: genre,
        },
      );
      json(200, { metas: metas });
      return;
    }
  }

  json(200, { metas: [] });
};
