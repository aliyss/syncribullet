import type { PickByArrays } from '~/utils/helpers/types';
import type { ManifestBase, ManifestCatalogItemBase } from '~/utils/manifest';
import { ManifestReceiverTypes } from '~/utils/manifest';
import { ReceiverServerExtended } from '~/utils/receiver/receiver-server-extended';
import type { IDs } from '~/utils/receiver/types/id';
import type { MetaObject } from '~/utils/receiver/types/meta-object';
import type { MetaPreviewObject } from '~/utils/receiver/types/meta-preview-object';

import { KITSU_ADDON_BASE_URL } from './api/url';
import { internalIds, receiverInfo } from './constants';
import { KitsuAddonCatalogType } from './types/catalog/catalog-type';
import type {
  KitsuAddonCatalogObject,
  KitsuAddonCatalogPreviewObject,
} from './types/kitsu-addon/library';
import type { KitsuAddonMCIT } from './types/manifest';

export class KitsuAddonServerReceiver extends ReceiverServerExtended<KitsuAddonMCIT> {
  internalIds = internalIds;
  receiverTypeMapping = {
    [KitsuAddonCatalogType.ANIME]: ManifestReceiverTypes.ANIME,
  };

  receiverInfo = receiverInfo;

  getMappingIds(id: string, source: string): Promise<IDs> {
    console.log(id, source);
    throw new Error('Method not implemented.');
  }

  async _convertPreviewObjectToMetaPreviewObject(
    previewObject: KitsuAddonCatalogPreviewObject,
  ): Promise<MetaPreviewObject> {
    return previewObject;
  }

  async _convertObjectToMetaObject(
    object: KitsuAddonCatalogObject,
  ): Promise<MetaObject> {
    return object;
  }

  async _getMetaPreviews() // type: MCIT['receiverCatalogType'],
  // potentialTypes: MCIT['receiverCatalogType'][],
  // status: MCIT['receiverCatalogStatus'],
  // options?: ManifestCatalogExtraParametersOptions,
  : Promise<KitsuAddonMCIT['receiverServerConfig']['metaPreviewObject'][]> {
    return [];
  }

  async _getMetaObject(
    ids: PickByArrays<IDs, KitsuAddonMCIT['internalIds']>,
    type: KitsuAddonMCIT['receiverCatalogType'],
    // potentialTypes: KitsuAddonMCIT['receiverCatalogType'][],
  ): Promise<KitsuAddonMCIT['receiverServerConfig']['metaObject']> {
    const url = `${KITSU_ADDON_BASE_URL}/meta/${type}/kitsu:${ids.kitsu}.json`;
    return await this.getMetaObjectFromAddonUrl(url);
  }

  static async getManifest(): Promise<ManifestBase<ManifestCatalogItemBase>> {
    const url = `${KITSU_ADDON_BASE_URL}/manifest.json`;
    return await ReceiverServerExtended.getManifestFromAddonUrl(url);
  }
}
