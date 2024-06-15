import type { IDs } from "../ids/types";

export const getHaglundIds = async (
  type: string,
  id: string,
): Promise<HaglundIds | null> => {
  const data = await fetch(
    `https://arm.haglund.dev/api/v2/ids?source=${type}&id=${id}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return await data.json();
};

export const convertHaglundIdsToIds = (haglundIds: HaglundIds): IDs => {
  const ids: IDs = {};
  if (haglundIds.anilist) {
    ids.anilist = haglundIds.anilist;
  }
  if (haglundIds.kitsu) {
    ids.kitsu = haglundIds.kitsu;
  }
  if (haglundIds.myanimelist) {
    ids.mal = haglundIds.myanimelist;
  }
  if (haglundIds.imdb) {
    ids.imdb = haglundIds.imdb;
  }
  if (haglundIds.thetvdb) {
    ids.tvdb = haglundIds.thetvdb;
  }
  return ids;
};

export interface HaglundIds {
  anidb?: number;
  anilist?: number;
  kitsu?: number;
  myanimelist?: number;
  imdb?: string;
  themoviedb?: number;
  thetvdb?: number;
}
