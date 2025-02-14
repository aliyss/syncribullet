import { ReceiverClient } from '~/utils/receiver/receiver-client';

import {
  defaultCatalogs,
  defaultLiveSyncTypes,
  liveSyncTypes,
  manifestCatalogItems,
  receiverInfo,
} from './constants';
import type { AnilistMCIT } from './types/manifest';

export class AnilistClientReceiver extends ReceiverClient<AnilistMCIT> {
  receiverInfo = receiverInfo;
  manifestCatalogItems = manifestCatalogItems;

  defaultCatalogs = defaultCatalogs;
  liveSyncTypes = liveSyncTypes;
  defaultLiveSyncTypes = defaultLiveSyncTypes;
}
