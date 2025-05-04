import { Importers } from '../importer/types/importers';
import { SimklClientImporter } from '../importers/simkl/importer-client';
import { StremioClientImporter } from '../importers/stremio/importer-client';

export const configurableImporters = () => ({
  [Importers.STREMIO]: new StremioClientImporter(),
  [Importers.SIMKL]: new SimklClientImporter(true),
});
