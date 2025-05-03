import type { Importers } from '../importer/types/importers';
import type { Receivers } from '../receiver/types/receivers';

export const preauthString = (receiver: Receivers | Importers) => {
  return `preauth_${receiver}`;
};
