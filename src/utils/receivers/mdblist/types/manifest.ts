import type { DeepWriteable } from '~/utils/helpers/types';
import type { ManifestCatalogItemType } from '~/utils/manifest';
import type { ReceiverServerConfig } from '~/utils/receiver/receiver-server';
import type { Receivers } from '~/utils/receiver/types/receivers';

import type { internalIds, syncIds } from '../constants';
import type { MDBListCatalogStatus } from './catalog/catalog-status';
import type { MDBListCatalogType } from './catalog/catalog-type';

type MDBListCatalog = ManifestCatalogItemType<
  Receivers.MDBLIST,
  MDBListCatalogStatus,
  MDBListCatalogType
>;

export type MDBListMCIT = MDBListCatalog & {
  auth?: {
    apikey: string;
  };
  internalIds: DeepWriteable<typeof internalIds>;
  syncIds: DeepWriteable<typeof syncIds>;
  receiverServerConfig: ReceiverServerConfig<any, any>;
};
