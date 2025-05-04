import type { ImporterInfo } from '~/utils/importer/importer';
import { Importers } from '~/utils/importer/types/importers';
import { receiverInfo } from '~/utils/receivers/simkl/constants';

export const importerInfo: ImporterInfo<Importers.SIMKL> = {
  ...receiverInfo,
  id: Importers.SIMKL,
};
