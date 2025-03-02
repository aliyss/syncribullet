import type { TDateISO } from '~/utils/helpers/types';

import type { StreamObject } from './stream-object';

export type VideoObjectStreams =
  | {
      streams?: StreamObject[];
      available?: never;
    }
  | {
      streams?: never;
      available?: boolean;
    };

export type VideoObject = VideoObjectStreams & {
  id: string;
  title: string;
  released: TDateISO;
  thumbnail?: string;
  episode?: number;
  season?: number;
  trailers?: StreamObject[];
  overview?: string;
};
