import { ImporterClient } from '~/utils/importer/importer-client';

import { importerInfo } from './constants';
import type { StremioMCIT } from './types/manifest';

export class StremioClientImporter extends ImporterClient<StremioMCIT> {
  importerInfo = importerInfo;
}
