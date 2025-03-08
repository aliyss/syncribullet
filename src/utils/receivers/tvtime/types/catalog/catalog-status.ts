export type TVTimeCatalogMovieStatus = 'watched' | 'not_watched';
export type TVTimeCatalogSeriesStatus =
  | 'watching'
  | 'not_started_yet'
  | 'up_to_date'
  | 'finished'
  | 'stopped_watching';

export type TVTimeCatalogStatus =
  | TVTimeCatalogMovieStatus
  | TVTimeCatalogSeriesStatus;
