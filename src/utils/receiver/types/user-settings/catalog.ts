import type { ManifestCatalogItem } from '~/utils/manifest';

import type { ReceiverMCITypes } from '../receivers';

export type UserSettingsCatalog<MCIT extends ReceiverMCITypes> =
  ManifestCatalogItem<MCIT>;
