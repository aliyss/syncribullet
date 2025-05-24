import { ReceiverClient } from '~/utils/receiver/receiver-client';

import {
  defaultCatalogs,
  defaultImportCatalogs,
  defaultLiveSyncTypes,
  liveSyncTypes,
  manifestCatalogItems,
  receiverInfo,
  receiverTypeMapping,
  receiverTypeReverseMapping,
} from './constants';
import type { TVTimeMCIT } from './types/manifest';

export class TVTimeClientReceiver extends ReceiverClient<TVTimeMCIT> {
  receiverInfo = receiverInfo;
  manifestCatalogItems = manifestCatalogItems;

  defaultCatalogs = defaultCatalogs;
  defaultImportCatalogs = defaultImportCatalogs;
  liveSyncTypes = liveSyncTypes;
  defaultLiveSyncTypes = defaultLiveSyncTypes;

  receiverTypeMapping = receiverTypeMapping;
  receiverTypeReverseMapping = receiverTypeReverseMapping;
}
