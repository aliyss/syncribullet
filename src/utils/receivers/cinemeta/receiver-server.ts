import type { PickByArrays } from '~/utils/helpers/types';
import type { ManifestBase, ManifestCatalogItemBase } from '~/utils/manifest';
import { ManifestReceiverTypes } from '~/utils/manifest';
import { ReceiverServerExtended } from '~/utils/receiver/receiver-server-extended';
import type { IDs } from '~/utils/receiver/types/id';
import type { MetaObject } from '~/utils/receiver/types/meta-object';
import type { MetaPreviewObject } from '~/utils/receiver/types/meta-preview-object';

import { CINEMETA_BASE_URL } from './api/url';
import { internalIds, receiverInfo } from './constants';
import { CinemetaCatalogType } from './types/catalog/catalog-type';
import type {
  CinemetaCatalogObject,
  CinemetaCatalogPreviewObject,
} from './types/cinemeta/library';
import type { CinemetaMCIT } from './types/manifest';

export class CinemetaServerReceiver extends ReceiverServerExtended<CinemetaMCIT> {
  internalIds = internalIds;
  receiverTypeMapping = {
    [CinemetaCatalogType.MOVIE]: ManifestReceiverTypes.MOVIE,
    [CinemetaCatalogType.SERIES]: ManifestReceiverTypes.SERIES,
  };
  receiverTypeReverseMapping = {
    [ManifestReceiverTypes.MOVIE]: CinemetaCatalogType.MOVIE,
    [ManifestReceiverTypes.SERIES]: CinemetaCatalogType.SERIES,
    [ManifestReceiverTypes.ANIME]: CinemetaCatalogType.SERIES,
    [ManifestReceiverTypes.CHANNELS]: CinemetaCatalogType.SERIES,
    [ManifestReceiverTypes.TV]: CinemetaCatalogType.SERIES,
  };

  receiverInfo = receiverInfo;

  getMappingIds(id: string, source: string): Promise<IDs> {
    console.log(id, source);
    throw new Error('Method not implemented.');
  }

  async _convertPreviewObjectToMetaPreviewObject(
    previewObject: CinemetaCatalogPreviewObject,
  ): Promise<MetaPreviewObject> {
    return previewObject;
  }

  async _convertObjectToMetaObject(
    object: CinemetaCatalogObject,
  ): Promise<MetaObject> {
    return object;
  }

  async _getMetaPreviews() // type: MCIT['receiverCatalogType'],
  // potentialTypes: MCIT['receiverCatalogType'][],
  // status: MCIT['receiverCatalogStatus'],
  // options?: ManifestCatalogExtraParametersOptions,
  : Promise<CinemetaMCIT['receiverServerConfig']['metaPreviewObject'][]> {
    return [];
  }

  async _getMetaObject(
    ids: PickByArrays<IDs, CinemetaMCIT['internalIds']>,
    type: CinemetaMCIT['receiverCatalogType'],
    // potentialTypes: CinemetaMCIT['receiverCatalogType'][],
  ): Promise<CinemetaMCIT['receiverServerConfig']['metaObject']> {
    const url = `${CINEMETA_BASE_URL}/meta/${type}/${ids.imdb}.json`;
    return await this.getMetaObjectFromAddonUrl(url);
  }

  static async getManifest(): Promise<ManifestBase<ManifestCatalogItemBase>> {
    const url = `${CINEMETA_BASE_URL}/manifest.json`;
    return await ReceiverServerExtended.getManifestFromAddonUrl(url);
  }
}
