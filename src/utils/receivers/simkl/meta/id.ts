import type { RequireAtLeastOne } from '~/utils/helpers/types';
import { type IDs } from '~/utils/receiver/types/id';
import { createIDsFromCatalogString } from '~/utils/receiver/types/id';

import type { SimklIds } from '../types/simkl/library';

export const convertToInternalIds = (
  ids: RequireAtLeastOne<SimklIds> & {
    simkl?: number;
  },
): Partial<IDs> => {
  return Object.entries(ids).reduce((acc, [key, value]) => {
    acc = {
      ...acc,
      ...createIDsFromCatalogString(key + ':' + value).ids,
    };
    return acc;
  }, {} as Partial<IDs>);
};
