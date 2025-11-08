import type { RequestHandler } from '@builder.io/qwik-city';

import { decryptCompressToUserConfigBuildMinifiedStrings } from '~/utils/config/buildReceiversFromUrl';
import { buildReceiversFromUserConfigBuildMinifiedStrings } from '~/utils/config/buildServerReceivers';
import { manifest } from '~/utils/manifest';
import type { ManifestResource } from '~/utils/manifest';
import { ReceiverServerExtended } from '~/utils/receiver/receiver-server-extended';

export const onGet: RequestHandler = async ({ json, params, env, headers }) => {
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT,POST,DELETE');
  headers.set(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization',
  );
  headers.set('Access-Control-Allow-Credentials', 'true');

  if (params.config === 'manifest.json') {
    json(200, {
      ...manifest,
    });
    return;
  }

  if (params.all !== 'manifest.json') {
    return;
  }

  const userConfig = decryptCompressToUserConfigBuildMinifiedStrings(
    params.config,
    env.get('PRIVATE_ENCRYPTION_KEY') ||
      '__SECRET_DOM_DO_NOT_USE_OR_YOU_WILL_BE_FIRED',
  );
  console.log(userConfig);

  const [config, settings] = Array.isArray(userConfig)
    ? userConfig
    : [userConfig, {}];

  const receivers =
    await buildReceiversFromUserConfigBuildMinifiedStrings(config);

  const newManifest = JSON.parse(JSON.stringify(manifest));

  newManifest.catalogs = [
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
      newManifest.resources.push(resourceStream);
    }
  }

  json(200, {
    ...newManifest,
    behaviorHints: {
      configurable: true,
      configurationRequired: false,
    },
  });
};
