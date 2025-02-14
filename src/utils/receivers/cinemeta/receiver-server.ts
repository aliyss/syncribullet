import type { PickByArrays } from '~/utils/helpers/types';
import { ManifestReceiverTypes } from '~/utils/manifest';
import { ReceiverServerExtended } from '~/utils/receiver/receiver-server-extended';
import type { IDs } from '~/utils/receiver/types/id';
import type { MetaObject } from '~/utils/receiver/types/meta-object';
import type { MetaPreviewObject } from '~/utils/receiver/types/meta-preview-object';

import { getCinemetaMetaObject } from './api/meta';
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

  _getMetaObject(
    ids: PickByArrays<IDs, CinemetaServerReceiver['internalIds']>,
    type: CinemetaMCIT['receiverCatalogType'],
    // potentialTypes: CinemetaMCIT['receiverCatalogType'][],
  ): Promise<CinemetaMCIT['receiverServerConfig']['metaObject']> {
    return getCinemetaMetaObject(ids, type);
  }
}
