import type { FuzzyDate } from './date';
import type { CharacterName, Name } from './name';
import type { Trailer } from './trailer';

/**
 * Represents the season the media was released in.
 * @description Months December to February are considered winter, March to May are considered spring, June to August are considered summer, and September to November are considered fall.
 */
export enum MediaSeason {
  /**
   * Months December to February.
   */
  WINTER = 'WINTER',

  /**
   * Months March to May.
   */
  SPRING = 'SPRING',

  /**
   * Months June to August.
   */
  SUMMER = 'SUMMER',

  /**
   * Months September to November.
   */
  FALL = 'FALL',
}

/**
 * Represents the format the media was released in.
 * @description The format could be Japanese Anime or Asian comic.
 */
export enum MediaType {
  /**
   * Japanese Anime.
   */
  ANIME = 'ANIME',

  /**
   * Asian comic.
   */
  MANGA = 'MANGA',
}

/**
 * Represents the format the media was released in.
 * @description This includes various formats such as TV broadcasts, movies, manga, novels, etc.
 */
export enum MediaFormat {
  /**
   * Anime broadcast on television.
   */
  TV = 'TV',

  /**
   * Anime which are under 15 minutes in length and broadcast on television.
   */
  TV_SHORT = 'TV_SHORT',

  /**
   * Anime movies with a theatrical release.
   */
  MOVIE = 'MOVIE',

  /**
   * Special episodes that have been included in DVD/Blu-ray releases, picture dramas, pilots, etc.
   */
  SPECIAL = 'SPECIAL',

  /**
   * (Original Video Animation) Anime that have been released directly on DVD/Blu-ray without originally going through a theatrical release or television broadcast.
   */
  OVA = 'OVA',

  /**
   * (Original Net Animation) Anime that have been originally released online or are only available through streaming services.
   */
  ONA = 'ONA',

  /**
   * Short anime released as a music video.
   */
  MUSIC = 'MUSIC',

  /**
   * Professionally published manga with more than one chapter.
   */
  MANGA = 'MANGA',

  /**
   * Written books released as a series of light novels.
   */
  NOVEL = 'NOVEL',

  /**
   * Manga with just one chapter.
   */
  ONE_SHOT = 'ONE_SHOT',
}

/**
 * Represents the current releasing status of the media.
 * @description Possible statuses of media releases.
 */
export enum MediaStatus {
  /**
   * Has completed and is no longer being released.
   */
  FINISHED = 'FINISHED',

  /**
   * Currently releasing.
   */
  RELEASING = 'RELEASING',

  /**
   * To be released at a later date.
   */
  NOT_YET_RELEASED = 'NOT_YET_RELEASED',

  /**
   * Ended before the work could be finished.
   */
  CANCELLED = 'CANCELLED',

  /**
   * Version 2 only. Is currently paused from releasing and will resume at a later date.
   */
  HIATUS = 'HIATUS',
}

/**
 * @description Source type the media was adapted from.
 */
export enum MediaSource {
  /**
   * An original production not based on another work.
   */
  ORIGINAL = 'ORIGINAL',

  /**
   * Asian comic book.
   */
  MANGA = 'MANGA',

  /**
   * Written work published in volumes.
   */
  LIGHT_NOVEL = 'LIGHT_NOVEL',

  /**
   * Video game driven primarily by text and narrative.
   */
  VISUAL_NOVEL = 'VISUAL_NOVEL',

  /**
   * Video game.
   */
  VIDEO_GAME = 'VIDEO_GAME',

  /**
   * Other.
   */
  OTHER = 'OTHER',

  /**
   * Version 2+ only. Written works not published in volumes.
   */
  NOVEL = 'NOVEL',

  /**
   * Version 2+ only. Self-published works.
   */
  DOUJINSHI = 'DOUJINSHI',

  /**
   * Version 2+ only. Japanese Anime.
   */
  ANIME = 'ANIME',

  /**
   * Version 3 only. Written works published online.
   */
  WEB_NOVEL = 'WEB_NOVEL',

  /**
   * Version 3 only. Live action media such as movies or TV show.
   */
  LIVE_ACTION = 'LIVE_ACTION',

  /**
   * Version 3 only. Games excluding video games.
   */
  GAME = 'GAME',

  /**
   * Version 3 only. Comics excluding manga.
   */
  COMIC = 'COMIC',

  /**
   * Version 3 only. Multimedia project.
   */
  MULTIMEDIA_PROJECT = 'MULTIMEDIA_PROJECT',

  /**
   * Version 3 only. Picture book.
   */
  PICTURE_BOOK = 'PICTURE_BOOK',
}

/**
 * Media sort enums
 * @description Enums for sorting media.
 */
export enum MediaSort {
  ID = 'ID',
  TITLE_ROMAJI = 'TITLE_ROMAJI',
  TITLE_ENGLISH = 'TITLE_ENGLISH',
  TITLE_NATIVE = 'TITLE_NATIVE',
  TYPE = 'TYPE',
  FORMAT = 'FORMAT',
  START_DATE = 'START_DATE',
  END_DATE = 'END_DATE',
  SCORE = 'SCORE',
  POPULARITY = 'POPULARITY',
  TRENDING = 'TRENDING',
  EPISODES = 'EPISODES',
  DURATION = 'DURATION',
  STATUS = 'STATUS',
  CHAPTERS = 'CHAPTERS',
  VOLUMES = 'VOLUMES',
  UPDATED_AT = 'UPDATED_AT',
  SEARCH_MATCH = 'SEARCH_MATCH',
  FAVOURITES = 'FAVOURITES',
}

export interface CoverImage {
  extraLarge: string;
  large: string;
  medium: string;
  color: string;
}

export enum MediaGenre {
  ACTION = 'Action',
  ADVENTURE = 'Adventure',
  CARS = 'Cars',
  COMEDY = 'Comedy',
  DRAMA = 'Drama',
  FANTASY = 'Fantasy',
  HORROR = 'Horror',
  MAHOU_SHOUJO = 'Mahou Shoujo',
  MECHA = 'Mecha',
  MUSIC = 'Music',
  MYSTERY = 'Mystery',
  PSYCHOLOGICAL = 'Psychological',
  ROMANCE = 'Romance',
  SCI_FI = 'Sci-Fi',
  SLICE_OF_LIFE = 'Slice of Life',
  SPORTS = 'Sports',
  SUPERNATURAL = 'Supernatural',
  THRILLER = 'Thriller',
}

export interface MediaTag {
  id: number; // The id of the tag
  name: string; // The name of the tag
  description?: string; // A general description of the tag
  category?: string; // The categories of tags this tag belongs to
  rank?: number; // The relevance ranking of the tag out of the 100 for this media
  isGeneralSpoiler?: boolean; // If the tag could be a spoiler for any media
  isMediaSpoiler?: boolean; // If the tag is a spoiler for this media
  isAdult?: boolean; // If the tag is only for adult 18+ media
  userId?: number; // The user who submitted the tag
}

export type MediaStudioEdge = {
  isMain: boolean;
  node: {
    id: number;
    name: string;
  };
};

export type MediaTitle = {
  english: null | string;
  native: string;
  romaji: string;
  userPreferred?: string;
};

export type MediaRanking = {
  rank: number;
  type: string;
  context: string;
  year: number;
  season: string;
};

export type MediaListEntry = {
  progress: number;
  status: string;
  score: number;
  id: number;
  startedAt: FuzzyDate;
  completedAt: FuzzyDate;
  userId: number;
  mediaId: number;
  updatedAt: string;
  createdAt: string;
};

export type MediaStaff = {
  id: number;
  name: Name;
  languageV2: string;
  image: Pick<CoverImage, 'large' | 'medium'>;
  description: string;
  primaryOccupations: string[];
  gender: string;
  dateOfBirth: FuzzyDate;
  dateOfDeath: FuzzyDate;
};

export type MediaStats = {
  scoreDistribution: {
    score: number;
    amount: number;
  }[];
  statusDistribution: {
    status: string;
    amount: number;
  }[];
};

export type MediaReview = {
  id: number;
  score: number;
  summary: string;
  body: string;
};

export type MediaTrend = {
  mediaId: number;
  date: string;
  trending: number;
  averageScore: number;
  popularity: number;
  media: {
    id: number;
    coverImage: CoverImage;
    idMal: number;
    title: MediaTitle;
  };
};

export type MediaExternalLink = {
  url: string;
  site: string;
  type: string;
  language: string;
};

export type MediaNextAiringEpisode = {
  airingAt: number;
  timeUntilAiring: number;
  episode: number;
};

export type MediaRecommendation = {
  id: number;
  mediaRecommendation: {
    type: string;
    id: number;
    idMal: number;
    title: MediaTitle;
    status: string;
    episodes: number;
    coverImage: CoverImage;
    bannerImage: string;
    format: string;
    chapters: number;
    meanScore: number;
    nextAiringEpisode: MediaNextAiringEpisode;
  };
};

export type MediaRelation = {
  id: number;
  relationType: string;
  node: {
    id: number;
    idMal: number;
    status: string;
    coverImage: CoverImage;
    bannerImage: string;
    title: MediaTitle;
    episodes: number;
    chapters: number;
    type: MediaType;
    averageScore: number;
    format: string;
    nextAiringEpisode: MediaNextAiringEpisode;
    meanScore: number;
  };
};

export type MediaStudio = {
  isMain: boolean;
  node: {
    id: number;
    name: string;
  };
};

export type MediaCharacter = {
  role: string;
  node: {
    id: number;
    name: CharacterName;
    image: Pick<CoverImage, 'large' | 'medium'>;
  };
  voiceActors: {
    id: number;
    languageV2: string;
    name: Name;
    image: Pick<CoverImage, 'large' | 'medium'>;
  }[];
};

export interface FavoriteAnimeResponse {
  ToggleFavourite: {
    anime: {
      nodes: {
        id: number;
      }[];
    };
  };
}

export interface AnimeMediaReturn {
  data: { Media: Anime };
}

export interface MangaMediaReturn {
  data: { Media: Manga };
}

export interface PagedAnimeMediaReturn {
  data: {
    Page: {
      media: Anime[];
    };
  };
}

export interface PagedMangaMediaReturn {
  data: {
    Page: {
      media: Manga[];
    };
  };
}

export interface Media<T = Anime | Manga> {
  Media: T;
}

export interface Anime {
  id: number;
  idMal: number;
  title: MediaTitle;
  modNotes: string;
  siteUrl: string;
  autoCreateForumThread: boolean;
  synonyms: string[];
  countryOfOrigin: string;
  isLicensed: boolean;
  isAdult: boolean;
  hashtag: string;
  rankings: MediaRanking[];
  mediaListEntry: MediaListEntry;
  staff: MediaStaff;
  stats: MediaStats;
  reviews: {
    nodes: MediaReview[];
  };
  trends: {
    edges: {
      node: MediaTrend;
    }[];
  };
  externalLinks: MediaExternalLink[];
  coverImage: CoverImage;
  startDate: FuzzyDate;
  endDate: FuzzyDate;
  bannerImage: string;
  season: string;
  isLocked: boolean;
  seasonYear: number;
  description: string;
  type: string;
  format: string;
  status: string;
  episodes: number;
  duration: number;
  chapters: number;
  volumes: number;
  trending: number;
  trailer: Trailer;
  genres: string[];
  source: string;
  averageScore: number;
  popularity: number;
  meanScore: number;
  nextAiringEpisode: MediaNextAiringEpisode;
  characters: {
    edges: MediaCharacter[];
  };
  isFavourite: boolean;
  recommendations: {
    edges: MediaRecommendation[];
  };
  relations: {
    edges: MediaRelation[];
  };
  studios: {
    edges: MediaStudioEdge[];
  };
  isRecommendationBlocked: boolean;
}

export interface Manga {
  id: number;
  idMal: number;
  title: MediaTitle;
  description: string;
  format: string;
  status: string;
  startDate: FuzzyDate;
  endDate: FuzzyDate;
  chapters: number;
  volumes: number;
  countryOfOrigin: string;
  isLicensed: boolean;
  updatedAt: string;
  coverImage: CoverImage;
  bannerImage: string;
  genres: string[];
  synonyms: string[];
  averageScore: number;
  meanScore: number;
  siteUrl: string;
  autoCreateForumThread: boolean;
  modNotes: string;
  popularity: number;
  trending: number;
  tags: MediaTag[];
  relations: {
    edges: MediaRelation[];
  };
  characters: {
    nodes: MediaCharacter[];
  };
  staff: {
    nodes: MediaStaff[];
  };
  isFavourite: boolean;
  isAdult: boolean;
  isLocked: boolean;
  trends: {
    nodes: MediaTrend[];
  };
  externalLinks: MediaExternalLink[];
  rankings: MediaRanking[];
  mediaListEntry: MediaListEntry;
  reviews: {
    nodes: MediaReview[];
  };
  stats: MediaStats;
  favourites: number;
  isRecommendationBlocked: boolean;
  recommendations: {
    edges: MediaRecommendation[];
  };
}

export interface FavoriteMangaMutationResponse {
  ToggleFavourite: {
    manga: {
      nodes: {
        id: number;
      }[];
    };
  };
}
