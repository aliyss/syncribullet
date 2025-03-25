import type { Year } from '~/utils/helpers/types';
import type { ManifestReceiverTypes } from '~/utils/manifest';

import type { MetaLinkObject } from './meta-link-object';
import type { StreamObject } from './stream-object';

export type MetaPreviewObjectType =
  | {
      type:
        | ManifestReceiverTypes.SERIES
        | ManifestReceiverTypes.CHANNELS
        | ManifestReceiverTypes.ANIME;
      releaseInfo?: string;
    }
  | {
      type: ManifestReceiverTypes;
      releaseInfo?: Year;
    };

export type MetaPreviewObject = MetaPreviewObjectType & {
  id: string;
  name: string;
  poster: string;
  runtime?: string;
  posterShape?: 'landscape' | 'poster' | 'square';
  logo?: string;
  background?: string;
  imdbRating?: string;
  links?: MetaLinkObject[];
  genres?: string[];
  description?: string;
  trailers?: (StreamObject | { source: string; type: 'Trailer' })[];
};
