import { createSimklHeaders } from "./helper";

export async function setSimklShowItem(
  simklResult: any,
  season: number,
  episode: number,
  userConfig: Record<string, string> | undefined,
) {
  if (!userConfig || !userConfig.accesstoken || !userConfig.clientid) {
    return;
  }

  const items = {
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
  };

  try {
    const data = await fetch("https://api.simkl.com/sync/history", {
      method: "POST",
      headers: createSimklHeaders(userConfig.accesstoken, userConfig.clientid),
      body: JSON.stringify(items),
    });
    return await data.json();
  } catch (e) {
    console.log(e);
  }
}

export async function setSimklMovieItem(
  simklResult: any,
  userConfig: Record<string, string> | undefined,
) {
  if (!userConfig || !userConfig.accesstoken || !userConfig.clientid) {
    return;
  }

  const items = {
    movies: [
      {
        title: simklResult.name,
        ids: {
          imdb: simklResult.id,
        },
      },
    ],
  };

  try {
    const data = await fetch("https://api.simkl.com/sync/history", {
      method: "POST",
      headers: createSimklHeaders(userConfig.accesstoken, userConfig.clientid),
      body: JSON.stringify(items),
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
