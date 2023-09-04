import { createSimklHeaders } from "./helper";

export async function setSimklItem(
  simklResult: any,
  season: number,
  episode: number,
  userConfig: Record<string, string> | undefined,
) {
  if (!userConfig || !userConfig.accesstoken) {
    return;
  }
  try {
    const data = await fetch("https://api.simkl.com/sync/history", {
      method: "POST",
      headers: createSimklHeaders(userConfig.accesstoken, userConfig.clientid),
      body: JSON.stringify({
        shows: [
          {
            title: simklResult.name,
            ids: {
              imdb: simklResult.id,
            },
            seasons: [
              {
                number: season,
                episodes: [
                  {
                    number: episode,
                  },
                ],
              },
            ],
          },
        ] as SimklShowAddToList[],
      }),
    });
    return await data.json();
  } catch (e) {
    console.log(e);
  }
}

export interface SimklShowEpisodeAddToList {
  number?: number;
  watched_at?: string;
}

export interface SimklShowSeasonAddToList {
  number?: number;
  watched_at?: string;
  episodes?: SimklShowEpisodeAddToList[];
}

export interface SimklShowAddToList {
  title?: string;
  ids: {
    imdb: string;
  };
  to?: string;
  watched_at?: string;
  seasons?: SimklShowSeasonAddToList[];
}
