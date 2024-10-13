import { getAnilistCatalogs } from '../anilist/helper';
import type { ManifestCatalogItem } from '../manifest';
import { getSimklCatalogs } from '../simkl/helper';

export const booleanString = (value: boolean) => (value ? 't' : 'f');
export const booleanUnString = (value: 't' | 'f') =>
  value === 't' ? true : false;

export interface ReceiverSettings {
  catalogs?: { id: ManifestCatalogItem['id']; value: boolean }[];
}

export const stringifySettings = (
  settings: ReceiverSettings,
  type: 'anilist' | 'simkl',
) => {
  const stringBuilder: string[] = [];
  if (settings.catalogs && settings.catalogs.length > 0) {
    const catalogString: string[] = [];
    let catalogs: { id: ManifestCatalogItem['id']; smallId: string }[] = [];
    if (type === 'anilist') {
      catalogs = getAnilistCatalogs();
    } else if (type === 'simkl') {
      catalogs = getSimklCatalogs();
    }
    for (const catalog of settings.catalogs) {
      const mappedCatalog = catalogs.find((c) => c.id === catalog.id);
      catalogString.push(
        `${mappedCatalog?.smallId}:${booleanString(catalog.value)}`,
      );
    }
    stringBuilder.push(`c¬${catalogString.join(',')}`);
  }
  return stringBuilder.join('&');
};

export const unstringifySettings = (
  settings: string,
  type: 'anilist' | 'simkl',
): ReceiverSettings => {
  const settingsObject: ReceiverSettings = {};
  const settingsArray = settings.split('&');
  for (const setting of settingsArray) {
    const [key, value] = setting.split('¬');
    if (key === 'c') {
      const catalogArray = value.split(',');
      const catalogInfo: {
        id: ManifestCatalogItem['id'];
        value: boolean;
        smallId: string;
      }[] = [];
      if (type === 'anilist') {
        catalogInfo.push(
          ...getAnilistCatalogs().map((catalog) => ({
            id: catalog.id,
            smallId: catalog.smallId,
            value: false,
          })),
        );
      } else if (type === 'simkl') {
        catalogInfo.push(
          ...getSimklCatalogs().map((catalog) => ({
            id: catalog.id,
            smallId: catalog.smallId,
            value: false,
          })),
        );
      }
      for (const catalog of catalogArray) {
        const [smallId, value] = catalog.split(':');
        const id = catalogInfo.find((c) => c.smallId === smallId)?.id;
        if (!id) {
          continue;
        }
        if (!settingsObject.catalogs) {
          settingsObject.catalogs = [];
        }
        settingsObject.catalogs.push({
          id,
          value: booleanUnString(value as 't' | 'f'),
        });
      }
    }
  }
  return settingsObject;
};
