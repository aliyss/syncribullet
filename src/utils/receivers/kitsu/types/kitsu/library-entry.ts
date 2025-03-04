export interface KitsuTitles {
  en?: string;
  en_jp?: string;
  en_us?: string;
  ja_jp?: string;
}

export interface KitsuLibraryEntryData {
  id: string;
  attributes: {
    status: string;
    progress?: number;
    notes?: string;
    rating?: string;
    startedAt?: string;
    finishedAt?: string;
    updatedAt?: string;
    createdAt?: string;
  };
  relationships: {
    anime?: {
      data?: {
        id: string;
        type: 'anime';
      };
    };
  };
}

export interface KitsuLibraryEntryIncluded {
  id: string;
  type: 'anime';
  attributes: {
    nsfw?: boolean;
    titles: KitsuTitles;
    slug?: string;
    description?: string;
    averageRating?: string;
    coverImage?: {
      tiny?: string;
      small?: string;
      large?: string;
      original?: string;
    };
    posterImage: {
      medium?: string;
      large?: string;
      original: string;
    };
    status: string;
    startDate?: string;
    endDate?: string;
    episodeCount?: number;
    showType: string;
  };
  relationships?: {
    genres?: {
      data?: {
        id: string;
        type: 'genres';
      }[];
    };
    episodes?: {
      data?: {
        id: string;
        type: 'episodes';
      }[];
    };
  };
}

export interface KitsuLibraryEntryIncludedGenres {
  id: string;
  type: 'genres';
  attributes: {
    name: string;
  };
}

export interface KitsuLibraryEntryIncludedEpisodes {
  id: string;
  type: 'episodes';
  attributes: {
    createdAt: string;
    titles?: KitsuTitles;
    canonicalTitle?: string;
    description?: string;
    seasonNumber?: number;
    number?: number;
    relativeNumber?: number;
    airdate?: string;
    thumbnail?: {
      original?: string;
    };
  };
}

export interface KitsuLibraryEntryResponse {
  data: KitsuLibraryEntryData[];
  included: (KitsuLibraryEntryIncluded | KitsuLibraryEntryIncludedGenres)[];
}

export interface KitsuLibraryEntry extends KitsuLibraryEntryData {
  meta: KitsuLibraryEntryIncluded;
  genres?: KitsuLibraryEntryIncludedGenres['attributes']['name'][];
}
