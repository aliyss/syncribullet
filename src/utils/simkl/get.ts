import { createSimklHeaders } from "./helper";
import type {
  SimklLibrary,
  SimklLibraryObjectShow,
  SimklLibraryObjectStatus,
  SimklLibraryType,
} from "./types";

export async function getSimklItem(
  cinemetaInfo: any,
  userConfig: Record<string, string> | undefined,
) {
  if (!userConfig || !userConfig.accesstoken) {
    return;
  }
  return cinemetaInfo.meta;
}

export async function getSimklList(
  type: SimklLibraryType,
  status: SimklLibraryObjectStatus,
  userConfig: Record<string, string> | undefined,
): Promise<SimklLibrary> {
  if (!userConfig || !userConfig.accesstoken) {
    return {};
  }
  try {
    const data = await fetch(
      `https://api.simkl.com/sync/all-items/${type}/${status}`,
      {
        method: "GET",
        headers: createSimklHeaders(
          userConfig.accesstoken,
          userConfig.clientid,
        ),
      },
    );
    return await data.json();
  } catch (e) {
    console.log(e);
  }
  return {};
}

export async function getSimklById(
  source: "anilist",
  id: string,
  userConfig: Record<string, string> | undefined,
): Promise<SimklLibraryObjectShow[]> {
  if (!userConfig || !userConfig.accesstoken) {
    return [];
  }
  try {
    const data = await fetch(
      `https://api.simkl.com/search/id?${source}=${id}`,
      {
        method: "GET",
        headers: createSimklHeaders(
          userConfig.accesstoken,
          userConfig.clientid,
        ),
      },
    );
    return await data.json();
  } catch (e) {
    console.log(e);
  }
  return [];
}

export async function getSimklAnimeById(
  id: string,
  userConfig: Record<string, string> | undefined,
): Promise<SimklLibraryObjectShow | undefined> {
  if (!userConfig || !userConfig.accesstoken) {
    return undefined;
  }
  try {
    const data = await fetch(
      `https://api.simkl.com/anime/${id}?extended=full`,
      {
        method: "GET",
        headers: createSimklHeaders(
          userConfig.accesstoken,
          userConfig.clientid,
        ),
      },
    );
    return await data.json();
  } catch (e) {
    console.log(e);
  }
  return undefined;
}
