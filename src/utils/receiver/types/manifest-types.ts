import type { EnumMapping } from '~/utils/helpers/types';
import type {
  ManifestCatalogExtraParameters,
  ManifestReceiverTypes,
} from '~/utils/manifest';

export type ManifestReceiverTypesMapping<E extends string> = EnumMapping<
  E,
  ManifestReceiverTypes
>;

export interface ManifestCatalogExtraParametersOptions {
  [ManifestCatalogExtraParameters.SKIP]?: number;
  [ManifestCatalogExtraParameters.GENRE]?: string;
  [ManifestCatalogExtraParameters.SEARCH]?: string;
}
