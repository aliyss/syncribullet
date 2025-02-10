import type { ManifestCatalogItem } from '../manifest';

export type MinifiedManifestCatalogItem = {
  id: ManifestCatalogItem['id'];
  name: ManifestCatalogItem['name'];
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

export const minifyManifestCatalogItems = (
  manifestCatalogItems: Readonly<ManifestCatalogItem[]>,
): MinifiedManifestCatalogItem[] => {
  const result: MinifiedManifestCatalogItem[] = [];
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
