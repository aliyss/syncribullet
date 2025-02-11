import { ReceiverClient } from '~/utils/receiver/receiver';

import {
  defaultCatalogs,
  defaultLiveSyncTypes,
  liveSyncTypes,
  manifestCatalogItems,
  receiverInfo,
} from './constants';
import type { AnilistUserSettings } from './types/user-settings';

export class AnilistClientReceiver extends ReceiverClient<AnilistUserSettings> {
  receiverInfo = receiverInfo;
  manifestCatalogItems = manifestCatalogItems;

  defaultCatalogs = defaultCatalogs;
  liveSyncTypes = liveSyncTypes;
  defaultLiveSyncTypes = defaultLiveSyncTypes;
}
