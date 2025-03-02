import type { ManifestCatalogItem } from '../manifest';
import { ManifestReceiverTypes } from '../manifest';
import type { ReceiverMCITypes } from './types/receivers';

export type MinifiedManifestCatalogItem<MCIT extends ReceiverMCITypes> = {
  id: ManifestCatalogItem<MCIT>['id'];
  name: ManifestCatalogItem<MCIT>['name'];
  smallId: string;
};

export interface MinifiedTypeMapping {
  [key: string]: {
    smallType: string;
    actions: {
      [key: string]: {
        smallAction: string;
      };
    };
  };
}

const generateMinifiedId = (type: string, typeCount: number): string => {
  let smallTypeId = '';
  for (let i = 0; i <= typeCount; i++) {
    smallTypeId += type[i].toUpperCase();
  }
  return smallTypeId;
};

export const minifyManifestCatalogItems = <MCIT extends ReceiverMCITypes>(
  manifestCatalogItems: Readonly<ManifestCatalogItem<MCIT>[]>,
): MinifiedManifestCatalogItem<MCIT>[] => {
  const result: MinifiedManifestCatalogItem<MCIT>[] = [];
  const types: MinifiedTypeMapping = {};

  for (const manifestCatalogItem of manifestCatalogItems) {
    const ids = manifestCatalogItem.id.split('-');
    const type: string = ids[2];
    const action: string = ids[3];

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (types[type]?.actions[action]) {
      throw new Error('Action already exists');
    }

    let typeId: string;
    let actionId: string;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!types[type]) {
      let typeIndex = 0;
      const smallTypes = Object.keys(types).map((key) => types[key].smallType);

      do {
        typeId = generateMinifiedId(type, typeIndex);
        typeIndex++;
      } while (smallTypes.includes(typeId));

      types[type] = {
        smallType: typeId,
        actions: {},
      };
    } else {
      typeId = types[type].smallType;
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!types[type].actions[action]) {
      let actionIndex = 0;
      const smallActions = Object.keys(types[type].actions).map(
        (key) => types[type].actions[key].smallAction,
      );

      do {
        actionId = generateMinifiedId(action, actionIndex);
        actionIndex++;
      } while (smallActions.includes(actionId));

      types[type].actions[action] = {
        smallAction: actionId,
      };
    } else {
      actionId = types[type].actions[action].smallAction;
    }

    const smallId = `${typeId}${actionId}`;
    result.push({
      id: manifestCatalogItem.id,
      name: manifestCatalogItem.name,
      smallId,
    });
  }

  return result;
};

export type MinifiedManifestReceiverTypes = string;

export const minifyManifestReceiverTypes = (
  manifestReceiverTypes: Readonly<ManifestReceiverTypes[]>,
): MinifiedManifestReceiverTypes[] => {
  const result: MinifiedManifestReceiverTypes[] = [];

  for (const manifestReceiverType of manifestReceiverTypes) {
    switch (manifestReceiverType) {
      case ManifestReceiverTypes.ANIME:
        result.push('A');
        break;
      case ManifestReceiverTypes.MOVIE:
        result.push('M');
        break;
      case ManifestReceiverTypes.SERIES:
        result.push('S');
        break;
      case ManifestReceiverTypes.CHANNELS:
        result.push('C');
        break;
      case ManifestReceiverTypes.TV:
        result.push('T');
        break;
    }
  }

  return result;
};
