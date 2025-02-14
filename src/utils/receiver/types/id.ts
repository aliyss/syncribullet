export type ID = string | number;

export enum IDSources {
  ANILIST = 'anilist',
  KITSU = 'kitsu',
  SIMKL = 'simkl',
  IMDB = 'imdb',
  TMDB = 'tmdb',
  TVDB = 'tvdb',
  MAL = 'mal',
}

export type IDs = Record<IDSources, ID | undefined> & {
  [IDSources.IMDB]: string | undefined;
  [IDSources.ANILIST]: number | undefined;
  [IDSources.SIMKL]: number | undefined;
  [IDSources.KITSU]: number | undefined;
  [IDSources.TMDB]: number | undefined;
  [IDSources.TVDB]: number | undefined;
  [IDSources.MAL]: number | undefined;
};

export const createIDCatalogString = (
  ids: Partial<IDs> | undefined,
): string | undefined => {
  if (!ids) {
    return;
  }
  if (ids.kitsu) {
    return `kitsu:${ids.kitsu}`;
  }
  if (ids.anilist) {
    return `anilist:${ids.anilist}`;
  }
  if (ids.mal) {
    return `mal:${ids.mal}`;
  }
  if (ids.imdb) {
    return `${ids.imdb}`;
  }
  if (ids.tmdb) {
    return `tmdb:${ids.tmdb}`;
  }
  if (ids.tvdb) {
    return `tvdb:${ids.tvdb}`;
  }
  if (ids.simkl) {
    return `simkl:${ids.simkl}`;
  }
};
