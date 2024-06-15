// Helpers
// Types
import type { RequestHandler } from "@builder.io/qwik-city";
import { convertStremioSubtitleInfoToStremioSubtitleId } from "~/utils/stremio/convert";
import type { StremioSubtitleInfo } from "~/utils/stremio/types";
import { updateNormal } from "~/utils/updaters/updateNormal";

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

  if (!catchall[0] || !catchall[1]) {
    json(200, { subtitles: [] });
    return;
  }

  if (userConfig["simkl"] && !userConfig["simkl"].clientid) {
    userConfig["simkl"].clientid = env.get("PRIVATE_SIMKL_CLIENT_ID") || "";
  }

  const stremioInfo = convertStremioSubtitleInfoToStremioSubtitleId(
    catchall as StremioSubtitleInfo,
  );

  try {
    await updateNormal(stremioInfo, userConfig);
  } catch (e) {
    console.log(e);
  }
  json(200, { subtitles: [] });
};
