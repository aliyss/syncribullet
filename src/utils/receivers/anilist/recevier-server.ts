import { ManifestReceiverTypes } from '~/utils/manifest';
import { ReceiverServer } from '~/utils/receiver/receiver-server';
import type { IDs } from '~/utils/receiver/types/id';
import type { ManifestCatalogExtraParametersOptions } from '~/utils/receiver/types/manifest-types';
import type { MetaObject } from '~/utils/receiver/types/meta-object';

import {
  defaultCatalogs,
  defaultLiveSyncTypes,
  internalIds,
  liveSyncTypes,
  manifestCatalogItems,
  receiverInfo,
} from './constants';
import type { SimklLibraryListEntry } from './types';
import { AnilistCatalogType } from './types/catalog/catalog-type';
import type { AnilistMCIT } from './types/manifest';

export class AnilistServerReceiver extends ReceiverServer<AnilistMCIT> {
  internalIds = internalIds;
  receiverTypeMapping = {
    [AnilistCatalogType.MOVIES]: ManifestReceiverTypes.MOVIE,
    [AnilistCatalogType.SHOWS]: ManifestReceiverTypes.SERIES,
    [AnilistCatalogType.ANIME]: ManifestReceiverTypes.ANIME,
  };

  receiverInfo = receiverInfo;
  manifestCatalogItems = manifestCatalogItems;
  defaultCatalogs = defaultCatalogs;
  liveSyncTypes = liveSyncTypes;
  defaultLiveSyncTypes = defaultLiveSyncTypes;

  getMappingIds(id: string, source: string): Promise<IDs> {
    console.log(id, source);
    throw new Error('Method not implemented.');
  }

  _convertPreviewObjectToMetaPreviewObject(
    previewObject: SimklLibraryListEntry,
    type: AnilistMCIT['receiverCatalogType'],

    options?: ManifestCatalogExtraParametersOptions,
    index?: number,
  ): Promise<MetaObject> {
    console.log(
      'SimklServerReceiver -> _convertObjectToMetaObject -> object',
      previewObject,
      index,
    );
    throw new Error('Method not implemented.');
  }

  _convertObjectToMetaObject(object: MetaObject): Promise<MetaObject> {
    console.log(
      'SimklServerReceiver -> _convertObjectToMetaObject -> object',
      object,
    );
    throw new Error('Method not implemented.');
  }

  _getMetaPreviews() // type: AnilistCatalogType,
  // potentialTypes: AnilistCatalogType[],
  // status: AnilistCatalogStatus,
  // options?: ManifestCatalogExtraParametersOptions,
  : Promise<SimklLibraryListEntry[]> {
    throw new Error('Method not implemented.');
  }

  _getMetaObject() // ids: IDs,
  // type: AnilistMCIT['receiverCatalogType'],
  // potentialTypes: AnilistMCIT['receiverCatalogType'][],
  : Promise<MetaObject> {
    throw new Error('Method not implemented.');
  }
}
