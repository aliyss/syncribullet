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
import type { Receivers } from './types/receivers';

export interface ReceiverInfo {
  id: Receivers;
  icon: string;
  text: string;
  backgroundColour: string;
  liveSync: boolean;
  fullSync: boolean;
}

export abstract class Receiver {
  public abstract receiverInfo: ReceiverInfo;
  public abstract manifestCatalogItems: Readonly<ManifestCatalogItem[]>;
  public abstract defaultCatalogs: Readonly<
    (typeof this.manifestCatalogItems)[number]['id'][]
  >;
  public get minifiedManifestCatalogItems(): MinifiedManifestCatalogItem[] {
    return minifyManifestCatalogItems(this.manifestCatalogItems);
  }

  public getUserManifestCatalogItems(
    ids?: (typeof this.manifestCatalogItems)[number]['id'][],
  ): ManifestCatalogItem[] {
    return this.manifestCatalogItems.filter((item) =>
      (ids ?? this.defaultCatalogs).includes(item.id),
    );
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

export abstract class ReceiverClient<UserSettings> extends Receiver {
  public userSettings: UserSettings | null = null;

  public setUserConfig(userSettings: UserSettings): void {
    this.userSettings = userSettings;
    localStorage.setItem(
      'user-settings-' + this.receiverInfo.id,
      JSON.stringify(userSettings),
    );
  }

  public mergeUserConfig(userSettings: Partial<UserSettings>): void {
    const existingSettings = this.getUserConfig();

    if (!existingSettings) {
      this.setUserConfig(userSettings as UserSettings);
      return;
    }

    this.setUserConfig({
      ...existingSettings,
      ...userSettings,
    });
  }

  public removeUserConfig(): void {
    this.userSettings = null;
    localStorage.removeItem('user-settings-' + this.receiverInfo.id);
  }

  private _loadUserConfig(): ReceiverClient<UserSettings>['userSettings'] {
    if (!this.userSettings) {
      const data = localStorage.getItem(
        'user-settings-' + this.receiverInfo.id,
      );
      if (data) {
        try {
          this.userSettings = JSON.parse(data);
        } catch (e) {
          this.userSettings = null;
        }
      } else {
        this.userSettings = null;
      }
    }
    return this.userSettings;
  }

  public getUserConfig(): ReceiverClient<UserSettings>['userSettings'] {
    if (!this.userSettings) {
      this._loadUserConfig();
    }
    return this.userSettings;
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
