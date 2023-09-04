import { description, version } from "../../package.json";

export const manifest = {
  id: `com.aliyss.syncribullet`,
  name: "syncribullet",
  version: version,
  description,
  logo: "https://github.com/aliyss/syncribullet/blob/master/public/android-chrome-192x192.png?raw=true",
  background: "",
  catalogs: [],
  resources: ["catalog", "meta", "stream", "subtitles"],
  types: ["series", "movie"],
  behaviorHints: {
    configurable: true,
    configurationRequired: true,
  },
};
