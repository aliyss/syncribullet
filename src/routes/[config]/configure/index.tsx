import type { RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = async ({ redirect }) => {
  redirect(307, "/");
};
