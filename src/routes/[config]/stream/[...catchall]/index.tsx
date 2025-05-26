// Helpers
// Types
import type { RequestHandler } from '@builder.io/qwik-city';

// import { ALLOWED_ORIGINS } from '~/utils/auth/stremio';
import { decryptCompressToUserConfigBuildMinifiedStrings } from '~/utils/config/buildReceiversFromUrl';
import { ReceiverServerExtended } from '~/utils/receiver/receiver-server-extended';
import type { StreamObject } from '~/utils/receiver/types/stream-object';

export const onGet: RequestHandler = async ({
  json,
  params,
  env,
  url,
  headers,
}) => {
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT,POST,DELETE');
  headers.set(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization',
  );
  headers.set('Access-Control-Allow-Credentials', 'true');
  // if (
  //   !ALLOWED_ORIGINS.includes(request.headers.get('origin') ?? '') &&
  //   request.headers.get('host') !== env.get('PRIVATE_SYNCRIBULLET_HOST')
  // ) {
  //   json(200, {
  //     streams: [],
  //   });
  //   return;
  // }
  const config = decryptCompressToUserConfigBuildMinifiedStrings(
    params.config,
    env.get('PRIVATE_ENCRYPTION_KEY') ||
      '__SECRET_DOM_DO_NOT_USE_OR_YOU_WILL_BE_FIRED',
  );

  const [, settings] = Array.isArray(config) ? config : [config, {}];
  if (!settings.externalStreamAddons) {
    json(200, {
      streams: [],
    });
    return;
  }

  const externalAddonPath = params.catchall;
  const usableExternalAddonPath = params.catchall.slice(0, -'.json'.length);

  const streamObjects: StreamObject[] = [];
  for (const addon of settings.externalStreamAddons) {
    const addonUrl = [
      addon.url.slice(0, -'/manifest.json'.length),
      'stream',
      externalAddonPath,
    ].join('/');
    try {
      const addonStreamObjects =
        await ReceiverServerExtended.getStreamObjectsFromAddonUrl(addonUrl);
      for (let i = 0; i < addonStreamObjects.streams.length; i++) {
        const currentUrl = addonStreamObjects.streams[i].externalUrl;
        if (!currentUrl) {
          continue;
        }
        addonStreamObjects.streams[i].externalUrl =
          'https://www.stremio.com/warning#' +
          encodeURIComponent(
            [
              url.origin +
                (url.origin.startsWith('localhost') ? '' : '.baby-beamup.club'),
              encodeURIComponent(params.config),
              'subtitles',
              usableExternalAddonPath,
              'r.json',
            ].join('/') +
              '?r=' +
              encodeURIComponent(currentUrl),
          );
      }
      streamObjects.push(...addonStreamObjects.streams);
    } catch (e) {
      console.log(e);
    }
  }

  json(200, {
    streams: streamObjects,
    cacheMaxAge: 60 * 60,
    staleRevalidate: 60 * 60,
  });
  return;
};
