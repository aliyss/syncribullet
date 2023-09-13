import { Anilist as NewAnilist } from "@tdanks2000/anilist-wrapper";
import Anilist from "anilist-node";
import type { CinemetaEpisode } from "../cinemeta/meta";

export async function getAnilistItem(
  cinemetaInfo: any,
  userConfig: Record<string, string> | undefined,
  episode?: CinemetaEpisode,
) {
  if (
    !(
      cinemetaInfo.meta.genre && cinemetaInfo.meta.genre.includes("Animation")
    ) &&
    !(
      cinemetaInfo.meta.genres && cinemetaInfo.meta.genres.includes("Animation")
    )
  ) {
    return;
  }
  if (!userConfig || !userConfig.accesstoken) {
    return;
  }
  const node_anilist = new Anilist(userConfig.accesstoken);
  const releaseDate = episode
    ? episode.released.split("T")[0].split("-")
    : undefined;
  const tempAnilistResult = await node_anilist.searchEntry.anime(
    cinemetaInfo.meta.name,
    {
      // @ts-ignore
      startDate_lesser: releaseDate
        ? parseInt(releaseDate.join(""))
        : undefined,
      // @ts-ignore
      endDate_greater: releaseDate ? parseInt(releaseDate.join("")) : undefined,
    },
  );
  if (!Array.isArray(tempAnilistResult.media) || !tempAnilistResult.media[0]) {
    return;
  }
  let firstMatch;
  const anilist = new NewAnilist(userConfig.accesstoken);
  for (let i = 0; i < tempAnilistResult.media.length; i++) {
    if (
      episode &&
      episode.season &&
      episode.season > 1 &&
      !tempAnilistResult.media[i].title.english.includes(
        episode.season.toString(),
      )
    ) {
      continue;
    }
    const anilistResult = <
      { data?: { Media: { mediaListEntry: any; streamingEpisodes?: any[] } } }
    >await anilist.media.anime(tempAnilistResult.media[i].id);
    if (
      anilistResult.data &&
      anilistResult.data.Media.streamingEpisodes &&
      anilistResult.data.Media.streamingEpisodes.length > 0
    ) {
      const anilistResultWithEpisode =
        anilistResult.data.Media.streamingEpisodes.find((x) =>
          x.title.includes(episode?.name),
        );
      if (anilistResultWithEpisode) {
        return anilistResult.data.Media.mediaListEntry;
      }
    }
    if (!firstMatch) {
      firstMatch = anilistResult.data?.Media.mediaListEntry;
    }
  }
  return firstMatch;
}
