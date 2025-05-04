import type { IDs } from '~/utils/receiver/types/id';

import type { SimklIds } from '../types/simkl/library';

export const convertToInternalIds = (ids: Partial<SimklIds>): Partial<IDs> => {
  return ids;
};
