import type { MinifiedManifestCatalogItem } from '~/utils/receiver/manifest';
import { ReceiverClient } from '~/utils/receiver/receiver';

import {
  defaultCatalogs,
  manifestCatalogItems,
  receiverInfo,
} from './constants';

export class AnilistClientReceiver extends ReceiverClient<{
  catalogs: MinifiedManifestCatalogItem[];
  auth: {
    accessToken: string;
    refreshToken: string;
  };
}> {
  receiverInfo = receiverInfo;
  manifestCatalogItems = manifestCatalogItems;

  defaultCatalogs = defaultCatalogs;
}
