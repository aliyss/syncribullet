import type { MetaLink } from './meta-link-object';
import type { SubtitleObject } from './subtitle-object';

export type StreamObjectBehaviorHintsBase = {
  countryWhitelist?: string[];
  notWebReady?: boolean;
  bingeGroup?: string;
  proxyHeaders?: {
    request?: Record<string, string>;
    response?: Record<string, string>;
  };
  videoHash?: string;
  videoSize?: number;
  filename?: string;
};

export type StreamObjectBehaviorHints =
  | (StreamObjectBehaviorHintsBase & {
      notWebReady: true;
      proxyHeaders?: {
        request?: Record<string, string>;
        response?: Record<string, string>;
      };
    })
  | (Omit<StreamObjectBehaviorHintsBase, 'proxyHeaders'> & {
      notWebReady?: false;
    });

export type StreamObject = {
  name?: string;
  description?: string;
  subtitles?: SubtitleObject[];
  sources?: string[];
  behaviorHints?: StreamObjectBehaviorHints;
} & (
  | {
      url: string;
    }
  | {
      ytId: string;
    }
  | {
      infoHash: string;
    }
  | {
      externalUrl: string | MetaLink;
    }
  | {
      fileIdx: number;
    }
);
