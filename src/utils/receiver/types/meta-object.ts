import type { TDateISO } from '~/utils/helpers/types';

import type { MetaPreviewObject } from './meta-preview-object';
import type { VideoObject } from './video-object';

export interface MetaObjectBehaviourHints {
  defaultVideoId?: string;
}

export type MetaObject = MetaPreviewObject & {
  background?: string;
  logo?: string;
  released?: TDateISO;
  videos?: VideoObject[];
  runtime?: string;
  language?: string;
  country?: string;
  awards?: string;
  website?: string;
  behaviourHints?: MetaObjectBehaviourHints;
};
