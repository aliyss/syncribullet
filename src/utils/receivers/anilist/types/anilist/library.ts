import type { AnilistCatalogStatus } from '../catalog/catalog-status';
import type { FuzzyDate } from './date';
import type { CoverImage, MediaNextAiringEpisode, MediaTitle } from './media';

interface Media {
  averageScore: number;
  meanScore: number;
  id: number;
  idMal: number;
  title: MediaTitle;
  status: string;
  type: string;
  seasonYear: number;
  coverImage: CoverImage;
  bannerImage: string;
  episodes: number;
  nextAiringEpisode: MediaNextAiringEpisode;
  description: string;
  format: string;
  startDate: FuzzyDate;
  endDate: FuzzyDate;
  duration: number;
  genres: string[];
  synonyms: string[];
  tags: { name: string; isMediaSpoiler: boolean }[];
  isFavourite: boolean;
  isAdult: boolean;
  siteUrl: string;
}

interface Entry {
  id: number;
  media: Media;
  status: string;
  score: number;
  progress: number;
  repeat: number;
  priority: number;
  private: boolean;
  notes: string;
  hiddenFromStatusLists: boolean;
  advancedScores: string[];
  startedAt: FuzzyDate;
  completedAt: FuzzyDate;
  updatedAt: string;
  createdAt: string;
}

export interface AnilistLibraryListEntry extends Entry {
  listData: Pick<
    AnilistList,
    'name' | 'isCustomList' | 'isSplitCompletedList' | 'status'
  >;
}

interface AnilistList {
  name: string;
  isCustomList: boolean;
  isSplitCompletedList: boolean;
  status: AnilistCatalogStatus;
  entries: Entry[];
}

interface MediaListCollection {
  lists: AnilistList[];
}

export interface AnimeListResponse {
  MediaListCollection: MediaListCollection;
}
