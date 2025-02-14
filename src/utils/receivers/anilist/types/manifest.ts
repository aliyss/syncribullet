import type { DeepWriteable } from '~/utils/helpers/types';
import type { ManifestCatalogItemType } from '~/utils/manifest';
import type { ReceiverServerConfig } from '~/utils/receiver/receiver-server';
import type { MetaObject } from '~/utils/receiver/types/meta-object';
import type { Receivers } from '~/utils/receiver/types/receivers';

import type { internalIds } from '../constants';
import type { SimklLibraryListEntry } from '../types';
import type { AnilistCatalogStatus } from './catalog/catalog-status';
import type { AnilistCatalogType } from './catalog/catalog-type';

export type AnilistMCIT = ManifestCatalogItemType<
  Receivers.ANILIST,
  AnilistCatalogStatus,
  AnilistCatalogType
> & {
  auth?: {
    access_token: string;
    e: string;
    client_id?: string;
  };
  internalIds: DeepWriteable<typeof internalIds>;
  receiverServerConfig: ReceiverServerConfig<SimklLibraryListEntry, MetaObject>;
};
