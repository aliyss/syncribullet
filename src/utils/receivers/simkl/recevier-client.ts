import { ReceiverClient } from '~/utils/receiver/receiver-client';

import {
  defaultCatalogs,
  defaultLiveSyncTypes,
  liveSyncTypes,
  manifestCatalogItems,
  receiverInfo,
} from './constants';
import type { SimklMCIT } from './types/manifest';

export class SimklClientReceiver extends ReceiverClient<SimklMCIT> {
  receiverInfo = receiverInfo;
  manifestCatalogItems = manifestCatalogItems;

  defaultCatalogs = defaultCatalogs;
  liveSyncTypes = liveSyncTypes;
  defaultLiveSyncTypes = defaultLiveSyncTypes;
}
