import { Importers } from '../importer/types/importers';
import { StremioClientImporter } from '../importers/stremio/importer-client';

export const configurableImporters = () => ({
  [Importers.STREMIO]: new StremioClientImporter(),
});
