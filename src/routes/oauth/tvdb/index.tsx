import type { RequestHandler } from "@builder.io/qwik-city";
import { loginTVDB } from "~/utils/tvdb/login";

export const onGet: RequestHandler = async ({ redirect, env }) => {
  try {
    const response = await loginTVDB(env.get("TVDB_API_KEY"));
    console.log(response);
  } catch (e) {
    console.log(e);
  }
  throw redirect(307, "/");
};
