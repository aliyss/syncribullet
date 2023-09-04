import type { RequestHandler } from "@builder.io/qwik-city";
import manifest from "~/utils/manifest";

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

  json(200, {
    ...manifest,
    behaviorHints: {
      configurable: true,
      configurationRequired: false,
    },
  });
};
