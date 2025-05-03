import { ReceiverClient } from '~/utils/receiver/receiver-client';

import {
  defaultCatalogs,
  defaultImportCatalogs,
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
  defaultImportCatalogs = defaultImportCatalogs;
  liveSyncTypes = liveSyncTypes;
  defaultLiveSyncTypes = defaultLiveSyncTypes;
}
