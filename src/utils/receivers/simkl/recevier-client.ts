import { ReceiverClient } from '~/utils/receiver/receiver';

import {
  defaultCatalogs,
  manifestCatalogItems,
  receiverInfo,
} from './constants';
import type { SimklUserConfig } from './types';

export class SimklClientReceiver extends ReceiverClient<SimklUserConfig> {
  receiverInfo = receiverInfo;
  manifestCatalogItems = manifestCatalogItems;

  defaultCatalogs = defaultCatalogs;
}
