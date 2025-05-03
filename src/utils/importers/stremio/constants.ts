import type { ImporterInfo } from '~/utils/importer/importer';
import { Importers } from '~/utils/importer/types/importers';

export const importerInfo: ImporterInfo<Importers.STREMIO> = {
  id: Importers.STREMIO,
  icon: 'https://www.stremio.com/website/stremio-logo-small.png',
  text: 'Stremio',
  backgroundColour: 'bg-[#8152A3]/60',
  borderColour: 'border-[#8152A3]',
};
