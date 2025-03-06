import {
  ManifestCatalogExtraParameters,
  ManifestReceiverTypes,
} from '../manifest';
import { ANIME_GENRES } from '../receiver/defaults/genres';
import type { ReceiverMCITypes, Receivers } from '../receiver/types/receivers';
import type {
  ReceiverClients,
  ReceiverServers,
} from '../receiver/types/receivers';
import type { UserSettingsCatalog } from '../receiver/types/user-settings/catalog';
import { CinemetaServerReceiver } from '../receivers/cinemeta/receiver-server';
import type { GeneralSettings } from '../settings/general';
import { decompress } from '../string/compression';
import { decrypt } from '../string/encryption';
import type { UserConfigBuildMinifiedString } from './types';

export const mapGenresToCatalogs = async (
  catalogs: UserSettingsCatalog<ReceiverMCITypes>[] | undefined,
) => {
  try {
    const CINEMETA_MANIFEST = await CinemetaServerReceiver.getManifest();
    const movieCatalogInfo = CINEMETA_MANIFEST.catalogs.find(
      (c) => c.type === 'movie' && c.id === 'top',
    );
    const seriesCatalogInfo = CINEMETA_MANIFEST.catalogs.find(
      (c) => c.type === 'series' && c.id === 'top',
    );
    return catalogs?.map((catalog) => {
      if (!catalog.genres) {
        switch (catalog.type) {
          case ManifestReceiverTypes.ANIME:
            catalog.genres = ['Default', ...ANIME_GENRES];
            catalog.extra = [
              {
                name: ManifestCatalogExtraParameters.GENRE,
                options: ['Default', ...ANIME_GENRES],
              },
              {
                name: ManifestCatalogExtraParameters.SKIP,
              },
            ];
            catalog.extraRequired = [ManifestCatalogExtraParameters.GENRE];
            break;
          case ManifestReceiverTypes.MOVIE:
            catalog.genres = ['Default', ...(movieCatalogInfo?.genres ?? [])];
            catalog.extra = movieCatalogInfo?.extra
              ?.filter((e) => e.name !== ManifestCatalogExtraParameters.SEARCH)
              .map((e) => {
                if (e.name === ManifestCatalogExtraParameters.GENRE) {
                  e.options = ['Default', ...(e.options ?? [])];
                }
                return e;
              });
            catalog.extraRequired = [ManifestCatalogExtraParameters.GENRE];
            break;
          case ManifestReceiverTypes.SERIES:
            catalog.genres = ['Default', ...(seriesCatalogInfo?.genres ?? [])];
            catalog.extra = seriesCatalogInfo?.extra
              ?.filter((e) => e.name !== ManifestCatalogExtraParameters.SEARCH)
              .map((e) => {
                if (e.name === ManifestCatalogExtraParameters.GENRE) {
                  e.options = ['Default', ...(e.options ?? [])];
                }
                return e;
              });
            catalog.extraRequired = [ManifestCatalogExtraParameters.GENRE];
            break;
        }
      }

      catalog.extraSupported = catalog.extra?.map((e) => e.name) ?? [];
      return catalog;
    });
  } catch (e) {
    console.error(e);
    return catalogs;
  }
};

export const buildUserConfigBuildFromUserConfigBuildMinifiedString = async <
  T extends ReceiverServers,
>(
  receiverClient: T,
  userConfigBuildMinifiedString: UserConfigBuildMinifiedString<T>,
): Promise<NonNullable<T['userSettings']>> => {
  return {
    auth: userConfigBuildMinifiedString.a,
    catalogs: userConfigBuildMinifiedString.c
      ? await mapGenresToCatalogs(
          receiverClient.getManifestCatalogItems(
            receiverClient
              .getMinifiedManifestCatalogItemsFromSmallIds(
                userConfigBuildMinifiedString.c.split(','),
              )
              .map((item) => item.id),
          ),
        )
      : await mapGenresToCatalogs(receiverClient.getManifestCatalogItems()),
    liveSync: userConfigBuildMinifiedString.l
      ? receiverClient.getLiveSyncTypesFromSmallIds(
          userConfigBuildMinifiedString.l.split(','),
        )
      : receiverClient.getLiveSyncTypes(),
  } as NonNullable<T['userSettings']>;
};

export const buildUserConfigBuildFromUserConfigBuildMinifiedStringClients = <
  T extends ReceiverClients,
>(
  receiverClient: T,
  userConfigBuildMinifiedString: UserConfigBuildMinifiedString<T>,
): NonNullable<T['userSettings']> => {
  return {
    auth: userConfigBuildMinifiedString.a,
    catalogs: userConfigBuildMinifiedString.c
      ? receiverClient.getManifestCatalogItems(
          receiverClient
            .getMinifiedManifestCatalogItemsFromSmallIds(
              userConfigBuildMinifiedString.c.split(','),
            )
            .map((item) => item.id),
        )
      : receiverClient.getManifestCatalogItems(),
    liveSync: userConfigBuildMinifiedString.l
      ? receiverClient.getLiveSyncTypesFromSmallIds(
          userConfigBuildMinifiedString.l.split(','),
        )
      : receiverClient.getLiveSyncTypes(),
  } as NonNullable<T['userSettings']>;
};

export const decryptCompressToUserConfigBuildMinifiedStrings = (
  urlString: string,
  encryptionKey: string,
):
  | [
      {
        [key in Receivers]?: UserConfigBuildMinifiedString<ReceiverServers>;
      },
      GeneralSettings,
    ]
  | {
      [key in Receivers]?: UserConfigBuildMinifiedString<ReceiverServers>;
    } => {
  const decrypted = decrypt(urlString, encryptionKey);
  try {
    return JSON.parse(decodeURIComponent(decompress(decompress(decrypted))));
  } catch (e) {
    console.error(e);
    throw new Error('Failed to decrypt and decompress');
  }
};
