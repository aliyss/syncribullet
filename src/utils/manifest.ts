import { description } from "../../package.json";

const manifest = {
  id: `com.aliyss.syncribullet`,
  name: "SyncriBullet",
  version: "0.0.1",
  description,
  logo: "",
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
