import type { DeepWriteable } from '~/utils/helpers/types';
import type { ManifestCatalogItemType } from '~/utils/manifest';
import type { ReceiverServerConfig } from '~/utils/receiver/receiver-server';
import type { ExtendedReceivers } from '~/utils/receiver/types/receivers';

import type { internalIds } from '../constants';
import type { KitsuAddonCatalogStatus } from './catalog/catalog-status';
import type { KitsuAddonCatalogType } from './catalog/catalog-type';
import type {
  KitsuAddonCatalogObject,
  KitsuAddonCatalogPreviewObject,
} from './kitsu-addon/library';

type KitsuAddonCatalog = ManifestCatalogItemType<
  ExtendedReceivers.KITSU_ADDON,
  KitsuAddonCatalogStatus,
  KitsuAddonCatalogType
>;

export type KitsuAddonMCIT = KitsuAddonCatalog & {
  auth?: undefined;
  internalIds: DeepWriteable<typeof internalIds>;
  receiverServerConfig: ReceiverServerConfig<
    KitsuAddonCatalogPreviewObject,
    KitsuAddonCatalogObject
  >;
};
