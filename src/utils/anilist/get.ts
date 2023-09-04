import { Anilist as NewAnilist } from "@tdanks2000/anilist-wrapper";
import type { Data } from "@tdanks2000/anilist-wrapper/dist/types/Search";

export async function getAnilistItem(
  cinemetaInfo: any,
  userConfig: Record<string, string> | undefined,
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
  const anilist = new NewAnilist(userConfig.accesstoken);
  const tempAnilistResult = <{ data: Data }>(
    await anilist.search.anime(cinemetaInfo.meta.name, 1, 1)
  );
  if (
    !Array.isArray(tempAnilistResult.data.Page.media) ||
    !tempAnilistResult.data.Page.media[0]
  ) {
    return;
  }
  const anilistResult = <{ data: { Media: { mediaListEntry: any } } }>(
    await anilist.media.anime(tempAnilistResult.data.Page.media[0].id)
  );
  return anilistResult.data.Media.mediaListEntry;
}
