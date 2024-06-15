import { createTVDBHeaders } from './helper';

export async function findTVDBItem(
  title: string,
  userConfig: Record<string, string> | undefined,
  options: Record<string, string>,
) {
  if (!userConfig || !userConfig.bearerToken) {
    return {};
  }
  try {
    const data = await fetch(
      `https://api4.thetvdb.com/v4/search?query=${title}&limit=1${
        options.year ? '&year=' + options.year : ''
      }`,
      {
        method: 'GET',
        headers: createTVDBHeaders(userConfig.bearerToken),
      },
    );
    console.log(data);
    return await data.json();
  } catch (e) {
    console.log(e);
  }
  return {};
}
