import type { ManifestCatalogItem, ManifestReceiverTypes } from '../manifest';
import { minifyManifestCatalogItems } from './manifest';
import type { MinifiedManifestCatalogItem } from './manifest';
import type { IDMapping, IDSources } from './types/id';
import type {
  ManifestCatalogExtraParametersOptions,
  ManifestReceiverTypesMapping,
} from './types/manifest-types';
import type { MetaObject } from './types/meta-object';
import type { MetaPreviewObject } from './types/meta-preview-object';

export interface ReceiverInfo {
  id: string;
  icon: string;
  text: string;
  backgroundColour: string;
  liveSync: boolean;
  fullSync: boolean;
}

export abstract class Receiver {
  public abstract receiverInfo: ReceiverInfo;
  public abstract manifestCatalogItems: ManifestCatalogItem[];
  public abstract defaultCatalogs: ManifestCatalogItem['id'][];
  public get minifiedManifestCatalogItems(): MinifiedManifestCatalogItem[] {
    return minifyManifestCatalogItems(this.manifestCatalogItems);
  }

  public getUserManifestCatalogItems(
    ids: ManifestCatalogItem['id'][] = this.defaultCatalogs,
  ): ManifestCatalogItem[] {
    return this.manifestCatalogItems.filter((item) => ids.includes(item.id));
  }

  public getUserManifestCatalogItemsBySmallId(
    smallIds?: Record<MinifiedManifestCatalogItem['smallId'], boolean>,
  ): ManifestCatalogItem[] {
    if (!smallIds) {
      return this.manifestCatalogItems.filter((x) =>
        this.defaultCatalogs.includes(x.id),
      );
    }
    return this.minifiedManifestCatalogItems
      .filter((item) => smallIds[item.smallId])
      .map((item) => {
        return this.manifestCatalogItems.find((x) => x.id === item.id)!;
      });
  }
}

export type ReceiverServerConfig<RLT extends string, RMPO, RPO> = {
  libraryType: RLT;
  metaPreviewObject: RMPO;
  metaObject: RPO;
};

export abstract class ReceiverServer<
  UserConfig,
  RC extends ReceiverServerConfig<
    string,
    Record<string, any>,
    Record<string, any>
  >,
> extends Receiver {
  abstract internalIds: IDSources[];
  abstract receiverTypeMapping: ManifestReceiverTypesMapping<RC['libraryType']>;

  abstract getMappingIds(
    id: string,
    source: IDSources,
    userConfig: UserConfig,
  ): Promise<IDMapping[]>;
  abstract _getMetaPreviews(
    types: RC['libraryType'][],
    userConfig: UserConfig,
  ): Promise<RC['metaPreviewObject'][]>;
  abstract _getMetaObject(
    types: RC['libraryType'][],
    id: string,
    userConfig: UserConfig,
  ): Promise<RC['metaObject']>;

  abstract _convertPreviewObjectToMetaPreviewObject(
    previewObject: RC['metaPreviewObject'],
    options?: ManifestCatalogExtraParametersOptions,
    index?: number,
  ): Promise<MetaPreviewObject>;

  abstract _convertObjectToMetaObject(
    object: RC['metaObject'],
  ): Promise<MetaObject>;

  private convertManifestTypeToLibraryType(
    type: ManifestReceiverTypes,
  ): RC['libraryType'][] {
    return Object.entries(this.receiverTypeMapping)
      .map(([key, value]) => {
        if (value === type) {
          return key;
        }
      })
      .filter((x) => x) as RC['libraryType'][];
  }

  public async getMetaPreviews(
    type: ManifestReceiverTypes,
    userConfig: UserConfig,
    options?: ManifestCatalogExtraParametersOptions,
  ): Promise<MetaPreviewObject[]> {
    const result = await this._getMetaPreviews(
      this.convertManifestTypeToLibraryType(type),
      userConfig,
    );
    const promises = result.map((x, i) =>
      this._convertPreviewObjectToMetaPreviewObject(x, options, i),
    );
    return await Promise.all(promises);
  }

  public async getMetaObject(
    type: ManifestReceiverTypes,
    id: MetaPreviewObject['id'],
    userConfig: UserConfig,
  ): Promise<MetaObject> {
    const result = await this._getMetaObject(
      this.convertManifestTypeToLibraryType(type),
      id,
      userConfig,
    );
    return await this._convertObjectToMetaObject(result);
  }

  public getInternalIds(ids: IDMapping[]): IDMapping[] {
    return (
      this.internalIds
        .map((x) => {
          return ids.find((i) => i.source === x);
        })
        // Required as the map function will return undefined even if it is filtered out
        .filter((x) => x) as IDMapping[]
    );
  }
}
