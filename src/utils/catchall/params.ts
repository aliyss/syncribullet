import type { ManifestCatalogExtraParametersOptions } from '../receiver/types/manifest-types';
import type { ReceiverServers } from '../receiver/types/receivers';

export type CatchAllParams = ManifestCatalogExtraParametersOptions;

export const buildCatchAllParams = (
  catchall: string | undefined,
): CatchAllParams => {
  const catchallParams = (catchall || 'skip=0').split('&');

  let skip = 0;
  let genre: string | undefined;
  let search: string | undefined;

  for (let i = 0; i < catchallParams.length; i++) {
    const item = catchallParams[i].split('=');
    if (item[0] === 'skip') {
      skip = parseInt(item[1]);
      if (isNaN(skip)) {
        skip = 0;
      }
    } else if (item[0] === 'genre') {
      if (item[1] !== 'Default') {
        genre = item[1];
      }
    } else if (item[0] === 'search') {
      search = item[1];
    }
  }

  return { skip, genre, search };
};

export const currentCatalogs: ReceiverServers['manifestCatalogItems'][number]['id'][] =
  [
    'syncribullet-kitsu-anime-current',
    'syncribullet-anilist-anime-CURRENT',
    'syncribullet-simkl-shows-watching',
    'syncribullet-simkl-anime-watching',
  ];
