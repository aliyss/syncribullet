import type {
  KitsuLibraryEntryIncluded,
  KitsuLibraryEntryIncludedEpisodes,
  KitsuLibraryEntryIncludedGenres,
} from './library-entry';

export interface KitsuAnimeEntryResponse {
  data: KitsuLibraryEntryIncluded;
  included: (
    | KitsuLibraryEntryIncludedGenres
    | KitsuLibraryEntryIncludedEpisodes
  )[];
}

export interface KitsuAnimeEntry extends KitsuLibraryEntryIncluded {
  episodes?: KitsuLibraryEntryIncludedEpisodes[];
  genres?: KitsuLibraryEntryIncludedGenres['attributes']['name'][];
}
