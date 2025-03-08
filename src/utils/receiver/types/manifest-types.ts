import type { EnumMapping } from '~/utils/helpers/types';
import type {
  ManifestCatalogExtraParameters,
  ManifestReceiverTypes,
} from '~/utils/manifest';

export type ManifestReceiverTypesMapping<E extends string> = EnumMapping<
  E,
  ManifestReceiverTypes
>;

export type ManifestReceiverTypesReverseMapping<E extends string> = EnumMapping<
  ManifestReceiverTypes,
  E | undefined
>;

export interface ManifestCatalogExtraParametersOptions {
  [ManifestCatalogExtraParameters.SKIP]?: number;
  [ManifestCatalogExtraParameters.GENRE]?: string;
  [ManifestCatalogExtraParameters.SEARCH]?: string;
}
