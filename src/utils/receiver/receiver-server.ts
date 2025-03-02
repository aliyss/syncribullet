import { buildUserConfigBuildFromUserConfigBuildMinifiedString } from '../config/buildReceiversFromUrl';
import type { UserConfigBuildMinifiedString } from '../config/types';
import { exists } from '../helpers/array';
import type { PickByArrays, RequireAtLeastOne } from '../helpers/types';
import { ManifestReceiverTypes } from '../manifest';
import { Receiver } from './receiver';
import { type IDSources, type IDs, testMaybeAnime } from './types/id';
import type {
  ManifestCatalogExtraParametersOptions,
  ManifestReceiverTypesMapping,
  ManifestReceiverTypesReverseMapping,
} from './types/manifest-types';
import type { MetaObject } from './types/meta-object';
import type { MetaPreviewObject } from './types/meta-preview-object';
import type { ReceiverMCITypes } from './types/receivers';

export type ReceiverServerConfig<RMPO, RPO> = {
  metaPreviewObject: RMPO;
  metaObject: RPO;
};

export abstract class ReceiverServer<
  MCIT extends ReceiverMCITypes,
> extends Receiver<MCIT> {
  abstract internalIds: Readonly<Readonly<IDSources[]>[]>;
  abstract syncIds: Readonly<Readonly<IDSources[]>[]>;
  abstract receiverTypeMapping: ManifestReceiverTypesMapping<
    MCIT['receiverCatalogType']
  >;
  abstract receiverTypeReverseMapping: ManifestReceiverTypesReverseMapping<
    MCIT['receiverCatalogType']
  >;

  public userSettings: NonNullable<Receiver<MCIT>['userSettings']>;
  public HAS_INTERNAL_SKIP = true;

  public setUserConfig(
    userSettings: ReceiverServer<MCIT>['userSettings'],
  ): void {
    this.userSettings = userSettings;
  }

  // TODO: Fix this typing at some point
  constructor() {
    super();
    // TODO: Fix this typing at some point
    this.userSettings = null as any;
  }

  public async withUserConfig(
    userConfig: UserConfigBuildMinifiedString<any>,
  ): Promise<typeof this> {
    this.userSettings =
      await buildUserConfigBuildFromUserConfigBuildMinifiedString<any>(
        this,
        userConfig,
      );
    return this;
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

  abstract _getMetaObject(
    ids: PickByArrays<IDs, MCIT['internalIds']>,
    type: MCIT['receiverCatalogType'],
    potentialTypes: MCIT['receiverCatalogType'][],
  ): Promise<MCIT['receiverServerConfig']['metaObject']>;

  abstract _syncMetaObject(
    ids: {
      ids: PickByArrays<IDs, MCIT['syncIds']>;
      count:
        | {
            season: number;
            episode: number;
          }
        | undefined;
    },
    type: MCIT['receiverCatalogType'],
    potentialTypes: ManifestReceiverTypes,
  ): Promise<void>;

  abstract _convertPreviewObjectToMetaPreviewObject(
    previewObject: MCIT['receiverServerConfig']['metaPreviewObject'],
    type: MCIT['receiverCatalogType'],
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
    const promises = result
      .filter((_, i) => {
        if (this.HAS_INTERNAL_SKIP) {
          return true;
        }
        if ((options?.skip || 0) <= i && i < (options?.skip || 0) + 100) {
          return true;
        }
        return false;
      })
      .map((x, i) =>
        this._convertPreviewObjectToMetaPreviewObject(x, type, options, i),
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

  public async syncMetaObject(
    ids: {
      ids: PickByArrays<IDs, MCIT['syncIds']>;
      count:
        | {
            season: number;
            episode: number;
          }
        | undefined;
    },
    type: MCIT['receiverCatalogType'],
    potentialType: ManifestReceiverTypes,
  ): Promise<void> {
    const syncTypes = this.getLiveSyncTypes(this.userSettings.liveSync);
    if (
      testMaybeAnime(ids.ids) &&
      !syncTypes.includes(ManifestReceiverTypes.ANIME)
    ) {
      return;
    }
    if (!syncTypes.includes(potentialType)) {
      return;
    }
    return await this._syncMetaObject(ids, type, potentialType);
  }
}
