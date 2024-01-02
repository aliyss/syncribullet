import {
  AnimeResult,
  MediaListStatus,
} from "@tdanks2000/anilist-wrapper/dist/types";

export interface AnilistLibrary {
  data: {
    MediaListCollection: {
      lists: {
        name: MediaListStatus;
        entries: any[];
      }[];
    };
  };
}

export interface AnilistLibraryEntry {
  id: number;
  media: AnimeResult;
}
