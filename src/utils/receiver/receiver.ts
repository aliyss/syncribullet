import type {
  ImporterClients,
  ImporterMCITypes,
  Importers,
} from '../importer/types/importers';
import type { ImportCatalogs } from '../importer/types/user-settings/import-catalogs';
import type {
  ManifestCatalogItem,
  ManifestReceiverTypes,
  SYNCRIBULLETID,
} from '../manifest';
import {
  minifyManifestCatalogItems,
  minifyManifestReceiverTypes,
} from './manifest';
import type { MinifiedManifestReceiverTypes } from './manifest';
import type {
  ManifestReceiverTypesMapping,
  ManifestReceiverTypesReverseMapping,
} from './types/manifest-types';
import type {
  AllReceivers,
  ReceiverMCITypes,
  Receivers,
} from './types/receivers';
import type { UserSettings } from './types/user-settings/settings';

export interface ReceiverInfoBase<R extends AllReceivers> {
  id: R;
  text: string;
}

export interface ReceiverInfo<R extends Receivers> extends ReceiverInfoBase<R> {
  text: string;
  icon: string;
  backgroundColour: string;
  borderColour: string;
  liveSync: boolean;
  importSync: boolean;
}

export abstract class ReceiverBase<R extends AllReceivers> {
  public abstract receiverInfo: R extends Receivers
    ? ReceiverInfo<R>
    : ReceiverInfoBase<R>;
}

export abstract class Receiver<
  MCIT extends ReceiverMCITypes,
> extends ReceiverBase<MCIT['receiverType']> {
  public abstract manifestCatalogItems: Readonly<ManifestCatalogItem<MCIT>[]>;
  public abstract defaultCatalogs: Readonly<
    (typeof this.manifestCatalogItems)[number]['id'][]
  >;
  public abstract defaultImportCatalogs: Readonly<
    Record<Importers, Readonly<ImportCatalogs<MCIT, ImporterMCITypes>[]>>
  >;
  public abstract liveSyncTypes: Readonly<ManifestReceiverTypes[]>;
  public abstract defaultLiveSyncTypes: Readonly<
    (typeof this.liveSyncTypes)[number][]
  >;

  abstract receiverTypeMapping: ManifestReceiverTypesMapping<
    MCIT['receiverCatalogType']
  >;
  abstract receiverTypeReverseMapping: ManifestReceiverTypesReverseMapping<
    MCIT['receiverCatalogType']
  >;

  public userSettings: UserSettings<MCIT> | null = null;
  public importer: ImporterClients | null = null;

  public get minifiedManifestCatalogItems() {
    return minifyManifestCatalogItems<MCIT>(this.manifestCatalogItems);
  }

  public get minifiedLiveSyncTypes(): MinifiedManifestReceiverTypes[] {
    return minifyManifestReceiverTypes(this.liveSyncTypes);
  }

  public getLiveSyncTypes(ids?: (typeof this.liveSyncTypes)[number][]) {
    return this.liveSyncTypes.filter((item) =>
      (ids ?? this.defaultLiveSyncTypes).includes(item),
    );
  }

  public getManifestCatalogItems(
    ids?: (typeof this.manifestCatalogItems)[number]['id'][],
  ): (typeof this.manifestCatalogItems)[number][] {
    return this.manifestCatalogItems.filter((item) =>
      (ids ?? this.defaultCatalogs).includes(item.id),
    );
  }

  public getImportCatalogItems(
    importerId: Importers,
    ids?: Readonly<ImportCatalogs<MCIT, ImporterMCITypes>[]>,
  ): ImportCatalogs<MCIT, ImporterMCITypes>[] {
    return this.manifestCatalogItems
      .filter((item) =>
        (ids ?? this.defaultImportCatalogs[importerId])
          .map((x) => x.id)
          .includes(item.id),
      )
      .map((item) => {
        const importCatalogDefault = this.defaultImportCatalogs[
          importerId
        ].find((x) => x.id === item.id);
        const importCatalog = (
          ids ?? this.defaultImportCatalogs[importerId]
        ).find((x) => x.id === item.id);
        return {
          ...item,
          value: importCatalog?.value || false,
          filters: importCatalog?.filters
            ? {
                ...importCatalogDefault?.filters,
                ...importCatalog.filters,
              }
            : null,
        };
      });
  }

  public getManifestCatalogIdParsed(
    catalog: (typeof this.manifestCatalogItems)[number]['id'],
  ): [
    MCIT['receiverType'],
    MCIT['receiverCatalogType'],
    MCIT['receiverCatalogStatus'],
  ] {
    const [, ...id] = catalog.split('-') as [
      SYNCRIBULLETID,
      MCIT['receiverType'],
      MCIT['receiverCatalogType'],
      MCIT['receiverCatalogStatus'],
    ];
    return id;
  }

  public getMinifiedManifestCatalogItemsFromSmallIds(
    ids?: (typeof this.minifiedManifestCatalogItems)[number]['smallId'][],
  ): (typeof this.minifiedManifestCatalogItems)[number][] {
    if (!ids) {
      return this.minifiedManifestCatalogItems.filter((item) =>
        this.defaultCatalogs.includes(item.id),
      );
    }
    return this.minifiedManifestCatalogItems.filter((item) =>
      ids.includes(item.smallId),
    );
  }

  public getMinifiedManifestCatalogItems(
    ids?: (typeof this.manifestCatalogItems)[number]['id'][],
  ): (typeof this.minifiedManifestCatalogItems)[number][] {
    return this.minifiedManifestCatalogItems.filter((x) =>
      (ids ?? this.defaultCatalogs).includes(x.id),
    );
  }

  public getLiveSyncTypesFromSmallIds(
    ids?: MinifiedManifestReceiverTypes[],
  ): ManifestReceiverTypes[] {
    if (!ids) {
      return this.liveSyncTypes
        .map((item, i) => ({
          id: this.minifiedLiveSyncTypes[i],
          value: item,
        }))
        .filter((item) => this.defaultLiveSyncTypes.includes(item.value))
        .map((x) => x.value);
    }
    return this.liveSyncTypes
      .map((item, i) => ({
        id: this.minifiedLiveSyncTypes[i],
        value: item,
      }))
      .filter((item) => ids.includes(item.id))
      .map((x) => x.value);
  }

  public getMinifiedLiveSyncTypes(
    ids?: (typeof this.liveSyncTypes)[number][],
  ): MinifiedManifestReceiverTypes[] {
    return this.minifiedLiveSyncTypes.filter((x) =>
      minifyManifestReceiverTypes(ids ?? this.defaultLiveSyncTypes).includes(x),
    );
  }

  public _setUserConfig(userSettings: Receiver<MCIT>['userSettings']): void {
    this.userSettings = userSettings;
  }

  abstract setUserConfig(userSettings: Receiver<MCIT>['userSettings']): void;
}
