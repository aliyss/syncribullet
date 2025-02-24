import type { RequestHandler } from '@builder.io/qwik-city';

import { decryptCompressToUserConfigBuildMinifiedStrings } from '~/utils/config/buildReceiversFromUrl';
import { buildReceiversFromUserConfigBuildMinifiedStrings } from '~/utils/config/buildServerReceivers';
import { manifest } from '~/utils/manifest';

export const onGet: RequestHandler = async ({ json, params, env }) => {
  const userConfig = decryptCompressToUserConfigBuildMinifiedStrings(
    params.config,
    env.get('PRIVATE_ENCRYPTION_KEY') ||
      '__SECRET_DOM_DO_NOT_USE_OR_YOU_WILL_BE_FIRED',
  );

  const receivers = await buildReceiversFromUserConfigBuildMinifiedStrings(
    userConfig,
  );

  manifest.catalogs = [
    ...(receivers.simkl?.userSettings.catalogs ?? []),
    ...(receivers.anilist?.userSettings.catalogs ?? []),
  ];

  json(200, {
    ...manifest,
    behaviorHints: {
      configurable: true,
      configurationRequired: false,
    },
  });
};
