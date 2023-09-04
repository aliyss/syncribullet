import type { RequestHandler } from "@builder.io/qwik-city";
import { manifest } from "~/utils/manifest";

export const onGet: RequestHandler = async ({ json, cacheControl }) => {
  cacheControl({
    public: false,
    maxAge: 0,
    sMaxAge: 0,
    staleWhileRevalidate: 0,
  });

  json(200, {
    ...manifest,
  });
};
