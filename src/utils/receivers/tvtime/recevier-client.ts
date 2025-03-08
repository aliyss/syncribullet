import { ReceiverClient } from '~/utils/receiver/receiver-client';

import {
  defaultCatalogs,
  defaultLiveSyncTypes,
  liveSyncTypes,
  manifestCatalogItems,
  receiverInfo,
} from './constants';
import type { TVTimeMCIT } from './types/manifest';

export class TVTimeClientReceiver extends ReceiverClient<TVTimeMCIT> {
  receiverInfo = receiverInfo;
  manifestCatalogItems = manifestCatalogItems;

  defaultCatalogs = defaultCatalogs;
  liveSyncTypes = liveSyncTypes;
  defaultLiveSyncTypes = defaultLiveSyncTypes;
}
