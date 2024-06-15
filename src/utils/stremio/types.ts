export type StremioType = 'movie' | 'series';
export type StremioSources = 'kitsu' | 'imdb';

export type StremioSubtitleInfo = [StremioType, string, string];

export interface StremioSubtitleId {
  id: string;
  type: StremioType;
  source: StremioSources;
  season?: number;
  episode?: number;
}
