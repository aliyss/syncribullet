// Helpers
// Types
import type { RequestHandler } from '@builder.io/qwik-city';

// import { ALLOWED_ORIGINS } from '~/utils/auth/stremio';
import type { MetaCatchAll } from '~/utils/catchall/types/meta';
import { decryptCompressToUserConfigBuildMinifiedStrings } from '~/utils/config/buildReceiversFromUrl';
import { buildReceiversFromUserConfigBuildMinifiedStrings } from '~/utils/config/buildServerReceivers';
import { exists } from '~/utils/helpers/array';
import type { PickByArrays } from '~/utils/helpers/types';
import type { IDSources, IDs } from '~/utils/receiver/types/id';
import { createIDsFromCatalogString } from '~/utils/receiver/types/id';
import { KitsuAddonServerReceiver } from '~/utils/receivers/kitsu-addon/receiver-server';

export const onGet: RequestHandler = async ({ json, params, env, headers }) => {
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
  //     meta: {},
  //   });
  //   return;
  // }
  const config = decryptCompressToUserConfigBuildMinifiedStrings(
    params.config,
    env.get('PRIVATE_ENCRYPTION_KEY') ||
      '__SECRET_DOM_DO_NOT_USE_OR_YOU_WILL_BE_FIRED',
  );

  const [userConfig] = Array.isArray(config) ? config : [config, {}];

  const receivers =
    await buildReceiversFromUserConfigBuildMinifiedStrings(userConfig);

  const [potentialReceiverType, metaId] = params.catchall
    .slice(0, -'.json'.length)
    .split('/') as MetaCatchAll;

  if (!potentialReceiverType || !metaId) {
    json(200, {
      meta: {},
    });
    return;
  }
  const ids = createIDsFromCatalogString(metaId);
  if (!Object.keys(ids.ids).length) {
    json(200, {
      meta: {},
    });
    return;
  }

  const idTypes = Object.keys(ids.ids) as [IDSources];

  const extendedReceiversAsList = Object.values([
    new KitsuAddonServerReceiver(),
  ]);

  const receiversAsList = [
    ...Object.values(receivers).filter((x) => x?.receiverInfo.id !== 'tvtime'),
    ...extendedReceiversAsList,
  ]
    .map((receiver) => {
      if (!receiver) {
        return;
      }
      const metaIds = [...receiver.internalIds].find((x) => {
        return idTypes
          .flatMap((idType) => idType)
          .find((id) => x.includes(id as never));
      });
      if (!metaIds) {
        return;
      }
      // TODO: Fix this typing so it works without the assignment
      return {
        receiver,
        ids: ids.ids as PickByArrays<IDs, (typeof receiver)['internalIds']>,
      };
    })
    .filter(exists);

  if (receiversAsList.length <= 0) {
    json(200, {
      meta: {},
    });
    return;
  }

  for (const receiver of receiversAsList) {
    try {
      const metaObject = await receiver.receiver.getMetaObject(
        receiver.ids,
        receiver.receiver.receiverTypeReverseMapping[
          potentialReceiverType
        ] as never,
        potentialReceiverType,
      );
      if (!metaObject) {
        continue;
      }

      json(200, {
        meta: metaObject,
        cacheMaxAge: 24 * 60 * 60,
        staleRevalidate: 28 * 60 * 60,
      });
      return;
    } catch (e) {
      if (receiver.receiver.receiverInfo.id === 'kitsu') {
        console.log(e);
      }
      console.log('Error');
    }
  }
};
