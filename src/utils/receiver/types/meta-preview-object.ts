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
      releaseInfo?: {
        start: Year;
        end: Year;
      };
    }
  | {
      type: ManifestReceiverTypes;
      releaseInfo?: Year;
    };

export type MetaPreviewObject = MetaPreviewObjectType & {
  id: string;
  name: string;
  poster: string;
  posterShape?: 'landscape' | 'poster' | 'square';
  imdbRating?: number;
  links?: MetaLinkObject[];
  description?: string;
  trailers?: StreamObject[];
};
