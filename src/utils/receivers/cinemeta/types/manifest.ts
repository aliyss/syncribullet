import type { DeepWriteable } from '~/utils/helpers/types';
import type { ManifestCatalogItemType } from '~/utils/manifest';
import type { ReceiverServerConfig } from '~/utils/receiver/receiver-server';
import type { ExtendedReceivers } from '~/utils/receiver/types/receivers';

import type { internalIds } from '../constants';
import type { CinemetaCatalogStatus } from './catalog/catalog-status';
import type { CinemetaCatalogType } from './catalog/catalog-type';
import type {
  CinemetaCatalogObject,
  CinemetaCatalogPreviewObject,
} from './cinemeta/library';

type CinemetaCatalog = ManifestCatalogItemType<
  ExtendedReceivers.CINEMETA,
  CinemetaCatalogStatus,
  CinemetaCatalogType
>;

export type CinemetaMCIT = CinemetaCatalog & {
  auth?: undefined;
  internalIds: DeepWriteable<typeof internalIds>;
  receiverServerConfig: ReceiverServerConfig<
    CinemetaCatalogPreviewObject,
    CinemetaCatalogObject
  >;
};
