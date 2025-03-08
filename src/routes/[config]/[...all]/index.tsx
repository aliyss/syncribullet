import type { RequestHandler } from '@builder.io/qwik-city';

import { decryptCompressToUserConfigBuildMinifiedStrings } from '~/utils/config/buildReceiversFromUrl';
import { buildReceiversFromUserConfigBuildMinifiedStrings } from '~/utils/config/buildServerReceivers';
import { manifest } from '~/utils/manifest';
import type { ManifestResource } from '~/utils/manifest';
import { ReceiverServerExtended } from '~/utils/receiver/receiver-server-extended';

export const onGet: RequestHandler = async ({ json, params, env }) => {
  const userConfig = decryptCompressToUserConfigBuildMinifiedStrings(
    params.config,
    env.get('PRIVATE_ENCRYPTION_KEY') ||
      '__SECRET_DOM_DO_NOT_USE_OR_YOU_WILL_BE_FIRED',
  );

  const [config, settings] = Array.isArray(userConfig)
    ? userConfig
    : [userConfig, {}];

  const receivers = await buildReceiversFromUserConfigBuildMinifiedStrings(
    config,
  );

  manifest.catalogs = [
    ...(receivers.simkl?.userSettings.catalogs ?? []),
    ...(receivers.anilist?.userSettings.catalogs ?? []),
    ...(receivers.kitsu?.userSettings.catalogs ?? []),
    ...(receivers.tvtime?.userSettings.catalogs ?? []),
  ];

  if (settings.externalStreamAddons) {
    let resourceStream: ManifestResource | null = null;
    for (const addon of settings.externalStreamAddons) {
      if (!addon.url) {
        continue;
      }

      try {
        const addonManifest =
          await ReceiverServerExtended.getManifestFromAddonUrl(addon.url);
        if (addonManifest.id === manifest.id) {
          resourceStream = null;
          console.error(
            'Tried and failed to add self as stream resource. lol :)',
          );
          break;
        }
        for (const resource of addonManifest.resources) {
          if (resource === 'stream') {
            resourceStream = resource;
            break;
          } else if (
            typeof resource === 'object' &&
            resource.name === 'stream'
          ) {
            if (!resourceStream) {
              resourceStream = resource;
              break;
            } else if (typeof resourceStream === 'object') {
              const idPrefixes: string[] = [
                ...new Set([
                  ...(resourceStream.idPrefixes ?? []),
                  ...(resource.idPrefixes ?? []),
                ]),
              ];
              resourceStream = {
                name: 'stream',
                types: [
                  ...new Set([...resourceStream.types, ...resource.types]),
                ],
                idPrefixes: idPrefixes.length ? idPrefixes : undefined,
              };
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
      if (resourceStream === 'stream') {
        break;
      }
    }
    if (resourceStream) {
      manifest.resources.push(resourceStream);
    }
  }

  json(200, {
    ...manifest,
    behaviorHints: {
      configurable: true,
      configurationRequired: false,
    },
  });
};
