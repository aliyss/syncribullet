import type { DeepWriteable } from '~/utils/helpers/types';
import type { ManifestCatalogItemType } from '~/utils/manifest';
import type { ReceiverServerConfig } from '~/utils/receiver/receiver-server';
import type { Receivers } from '~/utils/receiver/types/receivers';

import type { internalIds } from '../constants';
import type { SimklCatalogStatus } from './catalog/catalog-status';
import type { SimklCatalogType } from './catalog/catalog-type';
import type { SimklLibraryListEntry } from './simkl/library';

type SimklCatalog = ManifestCatalogItemType<
  Receivers.SIMKL,
  SimklCatalogStatus,
  SimklCatalogType
>;

export type SimklMCIT = SimklCatalog & {
  auth?: {
    access_token: string;
    client_id: string;
  };
  internalIds: DeepWriteable<typeof internalIds>;
  receiverServerConfig: ReceiverServerConfig<
    SimklLibraryListEntry,
    SimklLibraryListEntry
  >;
};
