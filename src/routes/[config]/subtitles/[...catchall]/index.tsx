// Helpers
import { getCinemetaMeta } from "~/utils/cinemeta/meta";
import { getAnilistItem } from "~/utils/anilist/get";
import { setAnilistItem } from "~/utils/anilist/set";
import { setSimklMovieItem, setSimklShowItem } from "~/utils/simkl/set";
import { getSimklItem } from "~/utils/simkl/get";
// Types
import type { RequestHandler } from "@builder.io/qwik-city";
import type { CinemetaEpisode } from "~/utils/cinemeta/meta";

export const onGet: RequestHandler = async ({ json, params, env }) => {
  const userConfigString = decodeURI(params.config).split("|");

  const userConfig: Record<string, Record<string, string> | undefined> = {};
  for (let i = 0; i < userConfigString.length; i++) {
    const lineConfig = userConfigString[i].split("-=-");
    const keyConfig = lineConfig[0].split("_");
    userConfig[keyConfig[0]] = {
      ...(userConfig[keyConfig[0]] ? userConfig[keyConfig[0]] : {}),
      [keyConfig[1]]: lineConfig[1],
    };
  }

  const catchall = params.catchall.split("/");

  console.log(catchall[0], catchall[1]);
  if (!catchall[0] || !catchall[1]) {
    json(200, { subtitles: [] });
    return;
  }

  if (userConfig["simkl"] && !userConfig["simkl"].clientid) {
    userConfig["simkl"].clientid = env.get("PRIVATE_SIMKL_CLIENT_ID") || "";
  }

  try {
    const info = await getCinemetaMeta(catchall[0], catchall[1].split(":")[0]);

    let timeout = 0;
    if (!info.meta) {
      json(200, { subtitles: [] });
      return;
    }
    if (info.meta.runtime) {
      timeout = parseInt(info.meta.runtime.split(" ")[0]) * 60 * 1000;
    }
    const simklResult: any | undefined = await getSimklItem(
      info,
      userConfig["simkl"],
    );
    const anilistResult: any | undefined = await getAnilistItem(
      info,
      userConfig["anilist"],
      info.meta.videos.find((x: CinemetaEpisode) => x.id === catchall[1]),
    );

    console.log(`Queued ${info?.meta.id} running in ${info?.meta.runtime}`);

    const seasonCount = parseInt(catchall[1].split(":")[1] || "0");
    const episodeCount = parseInt(catchall[1].split(":")[2] || "0");

    setTimeout(
      async function () {
        console.log("Syncing...");
        const syncedItems = [];
        const anilistUpdateResult = await setAnilistItem(
          anilistResult,
          episodeCount,
          userConfig["anilist"],
        );
        let simklUpdateResult;
        if (catchall[0] === "series") {
          simklUpdateResult = await setSimklShowItem(
            simklResult,
            seasonCount,
            episodeCount,
            userConfig["simkl"],
          );
        } else {
          simklUpdateResult = await setSimklMovieItem(
            simklResult,
            userConfig["simkl"],
          );
        }
        if (anilistUpdateResult) {
          syncedItems.push("anilist");
        }
        if (simklUpdateResult) {
          syncedItems.push("simkl");
        }
        console.log("Synced", syncedItems);
      },
      timeout / 1000 / 60,
    );
  } catch (e) {
    console.log(e);
  }
  json(200, { subtitles: [] });
};
