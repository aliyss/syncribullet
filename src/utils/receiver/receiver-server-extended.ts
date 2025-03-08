import { axiosCache } from '../axios/cache';
import { exists } from '../helpers/array';
import type { PickByArrays, RequireAtLeastOne } from '../helpers/types';
import type {
  ManifestBase,
  ManifestCatalogItemBase,
  ManifestReceiverTypes,
} from '../manifest';
import { ReceiverBase } from './receiver';
import type { IDSources, IDs } from './types/id';
import type {
  ManifestCatalogExtraParametersOptions,
  ManifestReceiverTypesMapping,
  ManifestReceiverTypesReverseMapping,
} from './types/manifest-types';
import type { MetaObject } from './types/meta-object';
import type { MetaPreviewObject } from './types/meta-preview-object';
import type { ExtendedReceiverMCITypes } from './types/receivers';
import type { StreamObject } from './types/stream-object';

export abstract class ReceiverServerExtended<
  MCIT extends ExtendedReceiverMCITypes,
> extends ReceiverBase<MCIT['receiverType']> {
  abstract internalIds: Readonly<Readonly<IDSources[]>[]>;
  abstract receiverTypeMapping: ManifestReceiverTypesMapping<
    MCIT['receiverCatalogType']
  >;
  abstract receiverTypeReverseMapping: ManifestReceiverTypesReverseMapping<
    MCIT['receiverCatalogType']
  >;

  constructor() {
    super();
  }

  abstract getMappingIds(
    id: string,
    source: IDSources,
  ): Promise<RequireAtLeastOne<IDs> | {}>;

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

  public static async getManifestFromAddonUrl(
    url: string,
  ): Promise<ManifestBase<ManifestCatalogItemBase>> {
    const response = await axiosCache(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: {
        ttl: 1000 * 60 * 60 * 24,
        staleIfError: 60 * 60 * 24,
        interpretHeader: false,
      },
    });
    const info = await response.data;
    if (!info) {
      throw new Error(`Failed to fetch manifest for:\n${url}`);
    }
    return info as ManifestBase<ManifestCatalogItemBase>;
  }

  public static async getStreamObjectsFromAddonUrl(
    url: string,
  ): Promise<{ streams: StreamObject[] }> {
    const response = await axiosCache(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: {
        ttl: 1000 * 60 * 60 * 24,
        staleIfError: 60 * 60 * 24,
        interpretHeader: true,
      },
    });
    const info = await response.data;
    if (!info) {
      throw new Error(`Failed to fetch stream objects for:\n${url}`);
    }
    return info as { streams: StreamObject[] };
  }

  public async getMetaObjectFromAddonUrl(
    url: string,
  ): Promise<MCIT['receiverServerConfig']['metaObject']> {
    const response = await axiosCache(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: {
        ttl: 1000 * 60 * 60 * 5,
        staleIfError: 1000 * 60 * 60 * 24,
        interpretHeader: false,
      },
    });
    const info = response.data.meta;
    if (!info) {
      throw new Error(`Failed to fetch meta object for:\n${url}`);
    }
    return info;
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
