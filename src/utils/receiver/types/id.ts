export type ID = string;

export enum IDSources {
  ANILIST = 'anilist',
  KITSU = 'kitsu',
  SIMKL = 'simkl',
  IMDB = 'imdb',
}

export interface IDMapping {
  id: ID;
  source: IDSources;
}
