import type { RequestHandler } from '@builder.io/qwik-city';

import type { StremioType } from '~/utils/stremio/types';

import { getCinemetaMeta } from '~/utils/cinemeta/meta';
import { getHaglundIds } from '~/utils/haglund/get';
import { getSimklAnimeById, getSimklById } from '~/utils/simkl/get';

export const onGet: RequestHandler = async ({ json, params, env }) => {
  if (!params.config) {
    json(200, { meta: {} });
    return;
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

  let typeMain = catchall[0] as StremioType;

  const idInfo = catchall[1].split('_');

  let dataId = null;
  let animeInfo = null;

  if (userConfig['simkl']) {
    if (!userConfig['simkl'].clientid) {
      userConfig['simkl'].clientid = env.get('PRIVATE_SIMKL_CLIENT_ID') || '';
    }
    const data = await getSimklById(
      idInfo[0] as 'anilist',
      idInfo[1],
      userConfig['simkl'],
    );

    if (data[0] && data[0].ids.simkl) {
      const anime = await getSimklAnimeById(
        data[0].ids.simkl.toString(),
        userConfig['simkl'],
      );
      if (anime) {
        dataId = anime.ids.imdb;
        if (anime.anime_type === 'movie') {
          typeMain = 'movie';
        } else {
          typeMain = 'series';
        }
        animeInfo = anime;
      }
    }
  }

  const typeBkp = typeMain === 'movie' ? 'series' : 'movie';

  if (!dataId) {
    const data = await getHaglundIds(idInfo[0], idInfo[1]);
    if (data?.imdb) {
      dataId = data.imdb;
    }
  }

  if (dataId) {
    const info = await getCinemetaMeta(typeMain, dataId);
    if (info?.meta) {
      json(200, {
        meta: {
          ...info.meta,
          id: catchall[1],
        },
      });
      return;
    } else if (!animeInfo) {
      const info2 = await getCinemetaMeta(typeBkp, dataId);
      if (info2?.meta) {
        json(200, {
          meta: {
            ...info2.meta,
            id: catchall[1],
          },
        });
        return;
      }
    }
  }

  if (animeInfo) {
    const metadata = {
      meta: {
        type: animeInfo.anime_type === 'movie' ? 'movie' : 'series',
        id: 'kitsu_' + animeInfo.ids.kitsu || animeInfo.ids.simkl,
        name: animeInfo.title,
        poster: 'https://simkl.in/posters/' + animeInfo.poster + '_0.jpg',
        releaseInfo: (animeInfo.year || '').toString(),
        background:
          (animeInfo.fanart
            ? 'https://simkl.in/fanart/' + animeInfo.fanart
            : 'https://simkl.in/posters/' + animeInfo.poster) + '_0.jpg',
        genres: animeInfo.genres,
        description: animeInfo.overview,
        trailers: (animeInfo.trailers || []).map((t) => {
          return {
            source: t.youtube,
            type: 'Trailer',
          };
        }),
        imdbRating: animeInfo.ratings?.simkl.rating,
        runtime: animeInfo.runtime + ' min',
      },
    };

    json(200, metadata);
    return;
  }

  json(200, { meta: {} });
};
