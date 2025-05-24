// Helpers
// Types
import type { RequestHandler } from '@builder.io/qwik-city';

// import { ALLOWED_ORIGINS } from '~/utils/auth/stremio';
import type { MetaCatchAll } from '~/utils/catchall/types/meta';
import { exists } from '~/utils/helpers/array';
import type { PickByArrays } from '~/utils/helpers/types';
import type { IDSources, IDs } from '~/utils/receiver/types/id';
import { createIDsFromCatalogString } from '~/utils/receiver/types/id';
import { CinemetaServerReceiver } from '~/utils/receivers/cinemeta/receiver-server';
import { KitsuAddonServerReceiver } from '~/utils/receivers/kitsu-addon/receiver-server';

export const onGet: RequestHandler = async ({ json, params }) => {
  // if (
  //   !ALLOWED_ORIGINS.includes(request.headers.get('origin') ?? '') &&
  //   request.headers.get('host') !== env.get('PRIVATE_SYNCRIBULLET_HOST')
  // ) {
  //   json(200, {
  //     meta: {},
  //   });
  //   return;
  // }

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
    new CinemetaServerReceiver(),
    new KitsuAddonServerReceiver(),
  ]);

  const receiversAsList = [...extendedReceiversAsList]
    .map((receiver) => {
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

      json(200, {
        meta: metaObject,
        cacheMaxAge: 24 * 60 * 60,
        staleRevalidate: 28 * 60 * 60,
      });
      return;
    } catch (e) {
      console.log(e);
    }
  }
};
