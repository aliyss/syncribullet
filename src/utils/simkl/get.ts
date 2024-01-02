import { createSimklHeaders } from "./helper";
import type {
  SimklLibrary,
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
