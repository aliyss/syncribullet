import type {
  ReceiverClients,
  ReceiverServers,
} from '../receiver/types/receivers';

export type UserConfigBuildMinified<
  RC extends ReceiverClients | ReceiverServers,
  RCU extends NonNullable<RC['userSettings']> = NonNullable<RC['userSettings']>,
> = {
  auth?: RCU['auth'] | undefined;
  catalogs?: RC['minifiedManifestCatalogItems'][number][] | undefined;
  liveSync?: RC['minifiedLiveSyncTypes'][number][] | undefined;
};

export type UserConfigBuildMinifiedString<
  RC extends ReceiverClients | ReceiverServers,
  RCU extends NonNullable<RC['userSettings']> = NonNullable<RC['userSettings']>,
> = {
  a?: RCU['auth'] | undefined;
  c?: string | undefined;
  l?: string | undefined;
};
