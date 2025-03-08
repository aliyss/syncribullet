import type { DeepWriteable } from '~/utils/helpers/types';
import type { ManifestCatalogItemType } from '~/utils/manifest';
import type { ReceiverServerConfig } from '~/utils/receiver/receiver-server';
import type { Receivers } from '~/utils/receiver/types/receivers';

import type { internalIds, syncIds } from '../constants';
import type { TVTimeCatalogStatus } from './catalog/catalog-status';
import type { TVTimeCatalogType } from './catalog/catalog-type';
import type { TVTimeLibraryEntry } from './tvtime/library-entry';

export type TVTimeMCIT = ManifestCatalogItemType<
  Receivers.TVTIME,
  TVTimeCatalogStatus,
  TVTimeCatalogType
> & {
  auth?: {
    id: string;
    access_token: string;
    rt: string;
  };
  internalIds: DeepWriteable<typeof internalIds>;
  syncIds: DeepWriteable<typeof syncIds>;
  receiverServerConfig: ReceiverServerConfig<
    TVTimeLibraryEntry,
    TVTimeLibraryEntry
  >;
};
