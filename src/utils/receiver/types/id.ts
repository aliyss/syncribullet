export type ID = string | number;

export enum IDSources {
  ANILIST = 'anilist',
  KITSU = 'kitsu',
  KITSU_NSFW = 'kitsu-nsfw',
  SIMKL = 'simkl',
  IMDB = 'imdb',
  TMDB = 'tmdb',
  TVDB = 'tvdb',
  MAL = 'mal',
  TRAKT = 'trakt',
  AOZORA = 'aozora',
}

export type IDs = Record<IDSources, ID | undefined> & {
  [IDSources.IMDB]: string | undefined;
  [IDSources.ANILIST]: number | undefined;
  [IDSources.SIMKL]: number | undefined;
  [IDSources.KITSU]: number | undefined;
  [IDSources.KITSU_NSFW]: number | undefined;
  [IDSources.TMDB]: number | undefined;
  [IDSources.TVDB]: number | undefined;
  [IDSources.MAL]: number | undefined;
  [IDSources.TRAKT]: number | undefined;
  [IDSources.AOZORA]: string | undefined;
};

export const testMaybeAnime = (ids: Partial<IDs>): boolean => {
  if (ids['kitsu-nsfw'] || ids.kitsu || ids.anilist || ids.mal) {
    return true;
  }
  return false;
};

export const createIDCatalogString = (
  ids: Partial<IDs> | undefined,
  nsfw = true,
): string | undefined => {
  if (!ids) {
    return;
  }
  if (ids['kitsu-nsfw'] && nsfw) {
    return `kitsu-nsfw:${ids['kitsu-nsfw']}`;
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

export const createIDsFromCatalogString = (
  id: string,
): {
  ids: Partial<IDs>;
  count:
    | {
        season: number;
        episode: number;
      }
    | undefined;
} => {
  let usableId: Partial<IDs> = {};
  let tempId: string[] = [];
  if (id.startsWith('kitsu-nsfw:')) {
    tempId = id.slice('kitsu-nsfw:'.length).split(':');
    usableId = {
      'kitsu-nsfw': parseInt(tempId[0]),
      kitsu: parseInt(tempId[0]),
    };
  } else if (id.startsWith('kitsu:')) {
    tempId = id.slice('kitsu:'.length).split(':');
    usableId = {
      kitsu: parseInt(tempId[0]),
    };
  } else if (id.startsWith('anilist:')) {
    tempId = id.slice('anilist:'.length).split(':');
    usableId = {
      anilist: parseInt(tempId[0]),
    };
  } else if (id.startsWith('mal:')) {
    tempId = id.slice('mal:'.length).split(':');
    usableId = {
      mal: parseInt(tempId[0]),
    };
  } else if (id.startsWith('imdb:')) {
    tempId = id.slice('imdb:'.length).split(':');
    usableId = {
      imdb: tempId[0],
    };
  } else if (id.startsWith('tmdb:')) {
    tempId = id.slice('tmdb:'.length).split(':');
    usableId = {
      tmdb: parseInt(tempId[0]),
    };
  } else if (id.startsWith('tvdb:')) {
    tempId = id.slice('tvdb:'.length).split(':');
    usableId = {
      tvdb: parseInt(tempId[0]),
    };
  } else if (id.startsWith('simkl:')) {
    tempId = id.slice('simkl:'.length).split(':');
    usableId = {
      simkl: parseInt(tempId[0]),
    };
  } else if (id.startsWith('tt')) {
    tempId = id.split(':');
    usableId = {
      imdb: tempId[0],
    };
  }

  let count:
    | {
        season: number;
        episode: number;
      }
    | undefined = {
    season: 0,
    episode: 0,
  };

  if (!tempId[1]) {
    count = undefined;
  } else if (tempId[2]) {
    count = {
      season: parseInt(tempId[1]),
      episode: parseInt(tempId[2]),
    };
  } else if (tempId[1]) {
    count = {
      season: 1,
      episode: parseInt(tempId[1]),
    };
  }

  return {
    ids: usableId,
    count,
  };
};
