import type { DeepWriteable } from '~/utils/helpers/types';
import type { ManifestCatalogItemType } from '~/utils/manifest';
import type { ReceiverServerConfig } from '~/utils/receiver/receiver-server';
import type { Receivers } from '~/utils/receiver/types/receivers';

import type { internalIds, syncIds } from '../constants';
import type { KitsuCatalogStatus } from './catalog/catalog-status';
import type { KitsuCatalogType } from './catalog/catalog-type';
import type { KitsuLibraryEntry } from './kitsu/library-entry';

export type KitsuMCIT = ManifestCatalogItemType<
  Receivers.KITSU,
  KitsuCatalogStatus,
  KitsuCatalogType
> & {
  auth?: {
    access_token: string;
    rt: string;
    e: string;
    t?: string;
  };
  internalIds: DeepWriteable<typeof internalIds>;
  syncIds: DeepWriteable<typeof syncIds>;
  receiverServerConfig: ReceiverServerConfig<
    KitsuLibraryEntry,
    KitsuLibraryEntry
  >;
};
