import type { ManifestReceiverTypes } from '~/utils/manifest';
import type { ReceiverServers } from '~/utils/receiver/types/receivers';

export type CatalogCatchAll = [
  ManifestReceiverTypes | undefined,
  ReceiverServers['manifestCatalogItems'][number]['id'] | undefined,
  string | undefined,
];
