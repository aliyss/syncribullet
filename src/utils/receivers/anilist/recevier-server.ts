import { ManifestReceiverTypes } from '~/utils/manifest';
import { ReceiverServer } from '~/utils/receiver/receiver';
import type { ReceiverServerConfig } from '~/utils/receiver/receiver';
import { IDSources } from '~/utils/receiver/types/id';
import type { IDMapping } from '~/utils/receiver/types/id';
import type { ManifestCatalogExtraParametersOptions } from '~/utils/receiver/types/manifest-types';
import type { MetaObject } from '~/utils/receiver/types/meta-object';
import type { MetaPreviewObject } from '~/utils/receiver/types/meta-preview-object';

import {
  defaultCatalogs,
  manifestCatalogItems,
  receiverInfo,
} from './constants';
import type { SimklLibraryListEntry, SimklUserConfig } from './types';
import { SimklLibraryType } from './types';

export class SimklServerReceiver extends ReceiverServer<
  SimklUserConfig,
  ReceiverServerConfig<SimklLibraryType, SimklLibraryListEntry, MetaObject>
> {
  internalIds = [IDSources.SIMKL];
  receiverTypeMapping = {
    [SimklLibraryType.MOVIES]: ManifestReceiverTypes.MOVIE,
    [SimklLibraryType.SHOWS]: ManifestReceiverTypes.SERIES,
    [SimklLibraryType.ANIME]: ManifestReceiverTypes.ANIME,
  };

  receiverInfo = receiverInfo;
  manifestCatalogItems = manifestCatalogItems;
  defaultCatalogs = defaultCatalogs;

  getMappingIds(
    id: string,
    source: string,
    userConfig: SimklUserConfig,
  ): Promise<IDMapping[]> {
    console.log(id, source, userConfig);
    throw new Error('Method not implemented.');
  }

  _convertPreviewObjectToMetaPreviewObject(
    previewObject: SimklLibraryListEntry,
    options?: ManifestCatalogExtraParametersOptions,
  ): Promise<MetaObject> {
    console.log(
      'SimklServerReceiver -> _convertObjectToMetaObject -> object',
      previewObject,
      options,
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

  _getMetaPreviews(
    types: SimklLibraryType[],
    userConfig: SimklUserConfig,
  ): Promise<SimklLibraryListEntry[]> {
    console.log(
      'SimklServerReceiver -> _getMetaObject -> id',
      types,
      userConfig,
    );
    throw new Error('Method not implemented.');
  }

  _getMetaObject(
    types: SimklLibraryType[],
    id: MetaPreviewObject['id'],
    userConfig: SimklUserConfig,
  ): Promise<MetaObject> {
    console.log(
      'SimklServerReceiver -> _getMetaObject -> id',
      id,
      types,
      userConfig,
    );
    throw new Error('Method not implemented.');
  }
}

export const simklServerReceiver = new SimklServerReceiver();
