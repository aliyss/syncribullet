import type { RequestHandler } from '@builder.io/qwik-city';

export const onGet: RequestHandler = async ({ redirect, params }) => {
  throw redirect(307, `/?config=${encodeURI(params.config)}`);
};
