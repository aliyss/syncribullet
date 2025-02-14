import { exists } from '../helpers/array';
import type { PickByArrays } from '../helpers/types';
import type { ManifestReceiverTypes } from '../manifest';
import { ReceiverBase } from './receiver';
import type { IDSources, IDs } from './types/id';
import type {
  ManifestCatalogExtraParametersOptions,
  ManifestReceiverTypesMapping,
} from './types/manifest-types';
import type { MetaObject } from './types/meta-object';
import type { MetaPreviewObject } from './types/meta-preview-object';
import type { ExtendedReceiverMCITypes } from './types/receivers';

export abstract class ReceiverServerExtended<
  MCIT extends ExtendedReceiverMCITypes,
> extends ReceiverBase<MCIT['receiverType']> {
  abstract internalIds: Readonly<Readonly<IDSources[]>[]>;
  abstract receiverTypeMapping: ManifestReceiverTypesMapping<
    MCIT['receiverCatalogType']
  >;

  constructor() {
    super();
  }

  abstract getMappingIds(id: string, source: IDSources): Promise<IDs>;

  abstract _getMetaPreviews(
    type: MCIT['receiverCatalogType'],
    potentialTypes: MCIT['receiverCatalogType'][],
    status: MCIT['receiverCatalogStatus'],
    options?: ManifestCatalogExtraParametersOptions,
  ): Promise<MCIT['receiverServerConfig']['metaPreviewObject'][]>;

  abstract _getMetaObject(
    ids: PickByArrays<IDs, MCIT['internalIds']>,
    type: MCIT['receiverCatalogType'],
    potentialTypes: MCIT['receiverCatalogType'][],
  ): Promise<MCIT['receiverServerConfig']['metaObject']>;

  abstract _convertPreviewObjectToMetaPreviewObject(
    previewObject: MCIT['receiverServerConfig']['metaPreviewObject'],
    options?: ManifestCatalogExtraParametersOptions,
    index?: number,
  ): Promise<MetaPreviewObject>;

  abstract _convertObjectToMetaObject(
    object: MCIT['receiverServerConfig']['metaObject'],
    ids: PickByArrays<IDs, MCIT['internalIds']>,
    type: MCIT['receiverCatalogType'],
    potentialTypes: ManifestReceiverTypes,
  ): Promise<MetaObject>;

  private convertManifestTypeToLibraryType(
    type?: ManifestReceiverTypes,
  ): MCIT['receiverCatalogType'][] {
    return Object.entries(this.receiverTypeMapping)
      .map(([key, value]) => {
        if (value === type) {
          return key as MCIT['receiverCatalogType'];
        }
      })
      .filter(exists);
  }

  public async getMetaPreviews(
    type: MCIT['receiverCatalogType'],
    status: MCIT['receiverCatalogStatus'],
    potentialType?: ManifestReceiverTypes,
    options?: ManifestCatalogExtraParametersOptions,
  ): Promise<MetaPreviewObject[]> {
    const result = await this._getMetaPreviews(
      type,
      this.convertManifestTypeToLibraryType(potentialType),
      status,
      options,
    );
    const promises = result.map((x, i) =>
      this._convertPreviewObjectToMetaPreviewObject(x, options, i),
    );
    return await Promise.all(promises);
  }

  public async getMetaObject(
    ids: PickByArrays<IDs, MCIT['internalIds']>,
    type: MCIT['receiverCatalogType'],
    potentialType: ManifestReceiverTypes,
  ): Promise<MetaObject> {
    const result = await this._getMetaObject(
      ids,
      type,
      this.convertManifestTypeToLibraryType(potentialType),
    );
    return await this._convertObjectToMetaObject(
      result,
      ids,
      type,
      potentialType,
    );
  }
}
