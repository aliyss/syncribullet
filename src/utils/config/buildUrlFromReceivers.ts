import type { ReceiverClients, Receivers } from '../receiver/types/receivers';
import type { GeneralSettings } from '../settings/general';
import { CompressionType, compress } from '../string/compression';
import { EncryptionType, encrypt } from '../string/encryption';
import type {
  UserConfigBuildMinified,
  UserConfigBuildMinifiedString,
} from './types';

const buildUserConfigBuildMinifiedStringFromUserConfigBuildMinified = <
  T extends ReceiverClients,
>(
  userConfigBuildMinified: UserConfigBuildMinified<T>,
): UserConfigBuildMinifiedString<T> => {
  return {
    a: userConfigBuildMinified.auth,
    c: userConfigBuildMinified.catalogs
      ? userConfigBuildMinified.catalogs
          .map((catalog) => catalog.smallId)
          .join(',')
      : undefined,
    l: userConfigBuildMinified.liveSync
      ? userConfigBuildMinified.liveSync.join(',')
      : undefined,
  };
};

const buildFromUserConfig = <T extends ReceiverClients>(
  receiverClient: T,
): UserConfigBuildMinified<T> => {
  const userConfig = receiverClient.getUserConfig();
  console.log(userConfig, 'x');
  return {
    auth: userConfig?.auth,
    catalogs: userConfig?.catalogs
      ? receiverClient.getMinifiedManifestCatalogItems(
          userConfig.catalogs.map((catalog) => catalog.id),
        )
      : undefined,
    liveSync: userConfig?.liveSync
      ? receiverClient.getMinifiedLiveSyncTypes(userConfig.liveSync)
      : undefined,
  };
};

export const buildUserConfigBuildMinifiedStringsFromReceivers = <
  RC extends ReceiverClients,
>(
  receiverClients: RC[],
): {
  [key in Receivers]?: UserConfigBuildMinifiedString<RC>;
} => {
  const urlData: {
    [key in Receivers]?: UserConfigBuildMinifiedString<RC>;
  } = {};

  for (const client of receiverClients) {
    if (!client.userSettings) {
      continue;
    }
    const userConfig = buildFromUserConfig(client);
    urlData[client.receiverInfo.id] =
      buildUserConfigBuildMinifiedStringFromUserConfigBuildMinified(userConfig);
  }

  return urlData;
};

export const encryptCompressFromUserConfigBuildMinifiedStrings = (
  urlData:
    | [
        {
          [key in Receivers]?: UserConfigBuildMinifiedString<ReceiverClients>;
        },
        GeneralSettings,
      ]
    | {
        [key in Receivers]?: UserConfigBuildMinifiedString<ReceiverClients>;
      },
  encryptionKey: string,
): string => {
  const compressed = compress(
    compress(
      encodeURIComponent(JSON.stringify(urlData)),
      CompressionType.MAPPING,
    ),
    CompressionType.LZ,
  );
  return encrypt(compressed, encryptionKey, EncryptionType.FPE);
};
