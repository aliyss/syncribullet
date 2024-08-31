import type { IDs } from '../ids/types';

export interface KitsuMapping {
  id: string;
  type: string;
  attributes: {
    externalSite: string;
    externalId: string;
  };
}

export const getKitsuMappingIds = async (
  id: string,
): Promise<KitsuMapping[] | null> => {
  const response = await fetch(
    `https://kitsu.io/api/edge/anime/${id}/mappings`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  const data = await response.json();
  if (!data.data || !data.data.length) {
    return null;
  }
  return data.data;
};

export const convertKitsuMappingIdsToIds = (
  kitsuMappings: KitsuMapping[],
): IDs => {
  const ids: IDs = {};
  for (const mapping of kitsuMappings) {
    switch (mapping.attributes.externalSite) {
      case 'anilist/anime':
        ids.anilist = parseInt(mapping.attributes.externalId);
        break;
      case 'myanimelist/anime':
        ids.mal = parseInt(mapping.attributes.externalId);
        break;
      case 'thetvdb/series':
        ids.tvdb = parseInt(mapping.attributes.externalId);
        break;
      case 'imdb':
        ids.imdb = mapping.attributes.externalId;
        break;
    }
  }
  return ids;
};
