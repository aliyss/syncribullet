import { Anilist as NewAnilist } from "@tdanks2000/anilist-wrapper";
import Anilist from "anilist-node";
import type { CinemetaEpisode } from "../cinemeta/meta";
import type { MediaListStatus } from "@tdanks2000/anilist-wrapper/dist/types";
import type { AnilistLibrary } from "./types";

export async function getAnilistItem(
  cinemetaInfo: any,
  userConfig: Record<string, string> | undefined,
  episode?: CinemetaEpisode,
) {
  if (!cinemetaInfo) {
    return;
  }

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

  const tempAnilistResult = releaseDate
    ? await node_anilist.searchEntry.anime(cinemetaInfo.meta.name, {
        // @ts-ignore
        startDate_lesser: releaseDate
          ? parseInt(releaseDate.join(""))
          : undefined,
        // @ts-ignore
        endDate_greater: releaseDate
          ? parseInt(releaseDate.join(""))
          : undefined,
      })
    : await node_anilist.searchEntry.anime(cinemetaInfo.meta.name, {});

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

    if (!firstMatch && anilistResult.data?.Media.mediaListEntry) {
      firstMatch = anilistResult.data.Media.mediaListEntry;
    }

    if (
      anilistResult.data &&
      !anilistResult.data.Media.mediaListEntry &&
      !episode
    ) {
      const titles = Object.values(tempAnilistResult.media[i].title);

      for (let j = 0; j < titles.length; j++) {
        if (titles[j] === cinemetaInfo.meta.name) {
          return anilistResult.data.Media;
        }
      }
    }
  }

  return firstMatch;
}

export async function getAnilistUserList(
  status: MediaListStatus,
  userConfig: Record<string, string> | undefined,
): Promise<AnilistLibrary> {
  if (!userConfig || !userConfig.accesstoken) {
    return {
      data: {
        MediaListCollection: {
          lists: [],
        },
      },
    };
  }

  try {
    const node_anilist = new NewAnilist(userConfig.accesstoken);
    const user = await node_anilist.user.getCurrentUser();
    return (await node_anilist.lists.anime(
      (user as any).data.Viewer.id,
      status,
    )) as AnilistLibrary;
  } catch (e) {
    console.log(e);
  }

  return {
    data: {
      MediaListCollection: {
        lists: [],
      },
    },
  };
}
