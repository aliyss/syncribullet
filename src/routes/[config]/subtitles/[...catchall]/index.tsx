// Helpers
import { getCinemetaMeta } from "~/utils/cinemeta/meta";
import { getAnilistItem } from "~/utils/anilist/get";
import { setAnilistItem } from "~/utils/anilist/set";
import { setSimklItem } from "~/utils/simkl/set";
import { getSimklItem } from "~/utils/simkl/get";
// Types
import type { RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = async ({ json, params }) => {
  const userConfigString = params.config.split("|");

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

  if (!catchall[0] || !catchall[1]) {
    json(200, { subtitles: [] });
    return;
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
    const anilistResult: any | undefined = await getAnilistItem(
      info,
      userConfig["anilist"],
    );
    const simklResult: any | undefined = await getSimklItem(
      info,
      userConfig["simkl"],
    );

    console.log(`Queued ${info?.meta.id} running in ${info?.meta.runtime}`);

    const seasonCount = parseInt(catchall[1].split(":")[1]);
    const episodeCount = parseInt(catchall[1].split(":")[2]);

    setTimeout(async function () {
      console.log("Syncing...");
      const syncedItems = [];
      const anilistUpdateResult = await setAnilistItem(
        anilistResult,
        episodeCount,
        userConfig["anilist"],
      );
      const simklUpdateResult = await setSimklItem(
        simklResult,
        seasonCount,
        episodeCount,
        userConfig["simkl"],
      );
      if (anilistUpdateResult) {
        syncedItems.push("anilist");
      }
      if (simklUpdateResult) {
        syncedItems.push("simkl");
      }
      console.log("Synced", syncedItems);
    }, timeout);
  } catch (e) {
    console.log(e);
  }
  json(200, { subtitles: [] });
};
