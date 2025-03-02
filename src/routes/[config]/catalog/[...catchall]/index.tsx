// Helpers
// Types
import type { RequestHandler } from '@builder.io/qwik-city';

import { buildCatchAllParams } from '~/utils/catchall/params';
import type { CatalogCatchAll } from '~/utils/catchall/types/catalog';
import { decryptCompressToUserConfigBuildMinifiedStrings } from '~/utils/config/buildReceiversFromUrl';
import { buildReceiversFromUserConfigBuildMinifiedStrings } from '~/utils/config/buildServerReceivers';
import { exists } from '~/utils/helpers/array';
import type { ReceiverServers } from '~/utils/receiver/types/receivers';

export const onGet: RequestHandler = async ({ json, params, env }) => {
  // if (!ALLOWED_ORIGINS.includes(request.headers.get('origin') ?? '')) {
  //   json(200, {
  //     metas: [],
  //   });
  //   return;
  // }
  const config = decryptCompressToUserConfigBuildMinifiedStrings(
    params.config,
    env.get('PRIVATE_ENCRYPTION_KEY') ||
      '__SECRET_DOM_DO_NOT_USE_OR_YOU_WILL_BE_FIRED',
  );

  const [userConfig] = Array.isArray(config) ? config : [config, {}];

  const receivers = await buildReceiversFromUserConfigBuildMinifiedStrings(
    userConfig,
  );

  const [potentialReceiverType, catalogId, searchParams] = params.catchall
    .slice(0, -'.json'.length)
    .split('/') as CatalogCatchAll;

  if (!potentialReceiverType || !catalogId) {
    json(200, { metas: [] });
    return;
  }

  const receiversAsList = Object.values(receivers)
    .map((receiver) => {
      if (!receiver) {
        return;
      }
      const catalogItem = [...receiver.manifestCatalogItems].find(
        (x) => x.id === catalogId,
      ) as (typeof receiver.manifestCatalogItems)[number] | undefined;
      if (!catalogItem) {
        return;
      }
      // TODO: Fix this typing so it works without the assignment
      return { receiver, catalogItem } as {
        receiver: NonNullable<ReceiverServers>;
        catalogItem: NonNullable<
          (typeof receiver.manifestCatalogItems)[number]
        >;
      };
    })
    .filter(exists);

  if (receiversAsList.length <= 0) {
    json(200, { metas: [] });
    return;
  }

  const usableReceiver = receiversAsList[0].receiver;
  const usableCatalogItem = receiversAsList[0].catalogItem;

  const safeUserConfig = userConfig[usableReceiver.receiverInfo.id];
  if (!safeUserConfig) {
    json(200, { metas: [] });
    return;
  }

  const catalogInfo = usableReceiver.getManifestCatalogIdParsed(
    usableCatalogItem.id,
  );

  const options = buildCatchAllParams(searchParams);

  const catalogItems = await usableReceiver.getMetaPreviews(
    catalogInfo[1],
    catalogInfo[2],
    potentialReceiverType,
    options,
  );

  json(200, {
    metas: catalogItems.filter((item) => {
      if (
        potentialReceiverType !== 'anime' &&
        options.genre &&
        !(
          item.genres?.includes(options.genre) ||
          (item.links || []).filter(
            (x) => x.category === 'Genres' && x.name === options.genre,
          ).length > 0
        )
      ) {
        return false;
      }
      // console.log('Genre not found', item.type, item.name);
      return true;
    }),
  });
  return;
};
