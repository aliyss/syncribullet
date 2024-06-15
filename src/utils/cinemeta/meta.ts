import type { HaglundIds } from '../haglund/get';
import type { StremioType } from '../stremio/types';

export const getCinemetaMetaFromHaglundIds = async (
  type: StremioType,
  ids: HaglundIds | null,
): Promise<CinemetaMeta | null> => {
  if (!ids?.imdb) {
    return null;
  }
  return await getCinemetaMeta(type, ids.imdb);
};

export const getCinemetaMeta = async (
  type: StremioType,
  id: string,
): Promise<CinemetaMeta | null> => {
  const data = await fetch(
    `https://v3-cinemeta.strem.io/meta/${type}/${id}.json`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  try {
    return await data.json();
  } catch (e) {
    return null;
  }
};

export interface CinemetaMeta {
  meta?: {
    id: string;
    name: string;
    type: 'movie' | 'series';
    videos?: CinemetaEpisode[];
    genres?: string[];
    runtime: string;
  };
}

export interface CinemetaEpisode {
  id: string;
  name: string;
  season: number;
  episode: number;
  number: number;
  released: string;
}
