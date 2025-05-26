// Helpers
// Types
import type { RequestHandler } from '@builder.io/qwik-city';

// import { ALLOWED_ORIGINS, ALLOWED_REFERERS } from '~/utils/auth/stremio';
import type { MetaCatchAll } from '~/utils/catchall/types/meta';
import { decryptCompressToUserConfigBuildMinifiedStrings } from '~/utils/config/buildReceiversFromUrl';
import { buildReceiversFromUserConfigBuildMinifiedStrings } from '~/utils/config/buildServerReceivers';
import { exists } from '~/utils/helpers/array';
import type { PickByArrays } from '~/utils/helpers/types';
import { getMappingIdsHaglundIMDB } from '~/utils/mappings/haglund';
import { getMappingIdsTVTimeIMDB } from '~/utils/mappings/tvtime';
import type { IDs } from '~/utils/receiver/types/id';
import type { IDSources } from '~/utils/receiver/types/id';
import { createIDsFromCatalogString } from '~/utils/receiver/types/id';
import { KitsuAddonServerReceiver } from '~/utils/receivers/kitsu-addon/receiver-server';

export const onGet: RequestHandler = async ({
  json,
  params,
  env,
  redirect,
  query,
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
  //   !ALLOWED_REFERERS.includes(request.headers.get('referer') ?? '') &&
  //   request.headers.get('host') !== env.get('PRIVATE_SYNCRIBULLET_HOST')
  // ) {
  //   json(200, {
  //     subtitles: [],
  //   });
  //   return;
  // }
  const redirectQuery = query.get('r');
  const redirectUrl = redirectQuery ? decodeURIComponent(redirectQuery) : null;

  const config = decryptCompressToUserConfigBuildMinifiedStrings(
    params.config,
    env.get('PRIVATE_ENCRYPTION_KEY') ||
      '__SECRET_DOM_DO_NOT_USE_OR_YOU_WILL_BE_FIRED',
  );

  const [userConfig] = Array.isArray(config) ? config : [config, {}];

  const receivers =
    await buildReceiversFromUserConfigBuildMinifiedStrings(userConfig);

  const [potentialReceiverType, metaProgress] = params.catchall
    .slice(0, -'.json'.length)
    .split('/') as MetaCatchAll;

  if (!potentialReceiverType || !metaProgress) {
    if (redirectUrl) {
      throw redirect(302, redirectUrl);
    }
    json(200, {
      subtitles: [],
    });
    return;
  }

  const ids = createIDsFromCatalogString(metaProgress);
  if (!Object.keys(ids.ids).length) {
    if (redirectUrl) {
      throw redirect(302, redirectUrl);
    }
    json(200, {
      subtitles: [],
    });
    return;
  }

  if (ids.ids.kitsu) {
    const kitsuAddonServerReceiver = new KitsuAddonServerReceiver();
    ids.ids = {
      ...ids.ids,
      ...(await kitsuAddonServerReceiver.getMappingIds(
        ids.ids.kitsu.toString(),
      )),
    };
  } else if (ids.ids.imdb) {
    ids.ids = {
      ...ids.ids,
      ...(await getMappingIdsHaglundIMDB(
        ids.ids.imdb.toString(),
        ids.count?.season,
      )),
      ...(receivers.tvtime
        ? await getMappingIdsTVTimeIMDB(
            ids.ids.imdb.toString(),
            receivers.tvtime.receiverTypeReverseMapping[potentialReceiverType],
            receivers.tvtime.userSettings,
          )
        : {}),
    };
  }

  const idTypes = Object.keys(ids.ids) as [IDSources];

  const receiversAsList = Object.values(receivers)
    .map((receiver) => {
      if (!receiver) {
        return;
      }
      const metaIds = [...receiver.syncIds].find((x) => {
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
        ids: ids as {
          ids: PickByArrays<IDs, (typeof receiver)['syncIds']>;
          count: { season: number; episode: number } | undefined;
        },
      };
    })
    .filter(exists);

  if (receiversAsList.length <= 0) {
    if (redirectUrl) {
      throw redirect(302, redirectUrl);
    }
    json(200, {
      subtitles: [],
    });
    return;
  }

  try {
    for (const receiverEntry of receiversAsList) {
      try {
        await receiverEntry.receiver.syncMetaObject(
          receiverEntry.ids,
          receiverEntry.receiver.receiverTypeReverseMapping[
            potentialReceiverType as never
          ],
          potentialReceiverType,
        );
      } catch (e) {
        console.error(e);
      }
    }
    if (redirectUrl) {
      throw redirect(302, redirectUrl);
    }
    json(200, {
      subtitles: [],
    });
  } catch (e) {
    console.error(e);
    if (redirectUrl) {
      throw redirect(302, redirectUrl);
    }
    json(200, {
      subtitles: [],
    });
  }

  return;
};
