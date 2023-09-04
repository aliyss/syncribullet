import { description } from "../../package.json";

const manifest = {
  id: `com.aliyss.syncribullet`,
  name: "syncribullet",
  version: "1.0.3",
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

export default manifest;
