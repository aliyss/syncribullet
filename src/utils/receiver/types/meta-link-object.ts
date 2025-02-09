import type { RepeatingTuple, TupleToString } from '~/utils/helpers/types';
import type {
  ManifestCatalogExtraParameters,
  ManifestCatalogItem,
  ManifestReceiverTypes,
} from '~/utils/manifest';

import type { MetaPreviewObject } from './meta-preview-object';

export enum MetaLinkObjectCategory {
  ACTOR = 'actor',
  DIRECTOR = 'director',
  WRITER = 'writer',
}

export type ManifestCatalogExtraParametersAsUrl =
  `${ManifestCatalogExtraParameters}=${string}`;
export type MetaLinkStremioSearchQueryParams =
  | TupleToString<RepeatingTuple<`&${ManifestCatalogExtraParametersAsUrl}`>>
  | '';
export type MetaLinkStremioSearchQueryParamsInitial =
  | `?${ManifestCatalogExtraParametersAsUrl}${MetaLinkStremioSearchQueryParams}`
  | '';

export type MetaLinkStremioSearch = `stremio:///search?search=${string}`;
export type MetaLinkStremioDiscover =
  `stremio:///discover/${string}/${ManifestReceiverTypes}/${ManifestCatalogItem['id']}${MetaLinkStremioSearchQueryParamsInitial}`;
export type MetaStremioDetail =
  `stremio:///details/${ManifestReceiverTypes}/${MetaPreviewObject['id']}`;
export type MetaStremioDetailVideo = `${MetaStremioDetail}/${string}`;

export type MetaLink =
  | MetaLinkStremioSearch
  | MetaLinkStremioDiscover
  | MetaStremioDetail
  | MetaStremioDetailVideo;

export interface MetaLinkObject {
  name: string;
  category: MetaLinkObjectCategory;
  url: MetaLink;
}
