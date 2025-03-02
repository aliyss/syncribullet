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
    anime: {
      data: {
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
    titles: {
      en: string;
      en_jp: string;
      en_us: string;
      ja_jp: string;
    };
    description?: string;
    averageRating?: string;
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
}

export interface KitsuLibraryEntryResponse {
  data: KitsuLibraryEntryData[];
  included: KitsuLibraryEntryIncluded[];
}

export interface KitsuLibraryEntry extends KitsuLibraryEntryData {
  meta: KitsuLibraryEntryIncluded;
}
