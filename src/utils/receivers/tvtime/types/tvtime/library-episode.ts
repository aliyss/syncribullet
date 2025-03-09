export interface TVTimeLibraryEntryEpisode {
  absolute_number: number;
  air_date: string;
  air_time: string;
  articles: any[];
  characters: any[];
  has_absolute_number: boolean;
  id: number;
  imdb_id: string;
  is_aired: boolean;
  is_movie: boolean;
  is_special: boolean;
  linked_movie_id: number;
  name: string;
  next_episode: {
    id: number;
    uuid: string;
  };
  number: number;
  overview: string;
  rating: number;
  runtime: number;
  screenshot: {
    favorite_count: number;
    id: number;
    is_deleted: boolean;
  };
  season: {
    id: number;
    number: number;
    translations: any;
    uuid: string;
  };
  series_id: number;
  series_uuid: string;
  timestamp: number;
  trailers: any[];
  translations: any[];
  type: string;
  uuid: string;
  utc_air_date: string;
  utc_air_time: string;
  watch_order: number;
}
