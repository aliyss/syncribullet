import type { RequestHandler } from "@builder.io/qwik-city";
import { manifest } from "~/utils/manifest";

export const onGet: RequestHandler = async ({ json, headers }) => {
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "OPTIONS,GET,PUT,POST,DELETE");
  headers.set(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization",
  );
  headers.set("Access-Control-Allow-Credentials", "true");

  json(200, {
    ...manifest,
  });
};
