import type { StremioSubtitleId, StremioSubtitleInfo } from './types';

export const convertStremioSubtitleInfoToStremioSubtitleId = (
  stremioSubtitleInfo: StremioSubtitleInfo,
): StremioSubtitleId => {
  const subtitleInfo = stremioSubtitleInfo[1].split(':');

  const source = subtitleInfo[0] === 'kitsu' ? 'kitsu' : 'imdb';
  const id = source === 'kitsu' ? subtitleInfo[1] : subtitleInfo[0];
  const season = source === 'kitsu' ? undefined : subtitleInfo[1];
  const episode = source === 'kitsu' ? subtitleInfo[2] : subtitleInfo[2];

  return {
    id: id,
    type: stremioSubtitleInfo[0],
    source: source,
    season: season ? parseInt(season) : undefined,
    episode: episode ? parseInt(episode) : undefined,
  };
};
