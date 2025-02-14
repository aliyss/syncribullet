import type { IDSources, IDs } from '~/utils/receiver/types/id';

import type { CinemetaCatalogType } from '../types/catalog/catalog-type';
import type { CinemetaCatalogObject } from '../types/cinemeta/library';

export async function getCinemetaMetaObject(
  id: IDs[IDSources.IMDB],
  type: CinemetaCatalogType,
): Promise<CinemetaCatalogObject> {
  try {
    const data = await fetch(
      `https://v3-cinemeta.strem.io/meta/${type}/${id}.json`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return await data.json();
  } catch (e) {
    console.log(e);
    throw new Error('Failed to fetch meta object from Cinemeta API!');
  }
}
