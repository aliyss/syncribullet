import Anilist from "anilist-node";

export async function setAnilistItem(
  anilistResult: any,
  progress: number,
  userConfig: Record<string, string> | undefined,
) {
  if (!anilistResult || !userConfig || !userConfig.accesstoken) {
    return;
  }
  let state: "COMPLETED" | "CURRENT" =
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    anilistResult && anilistResult.status === "COMPLETED"
      ? "COMPLETED"
      : "CURRENT";

  const hasProgress = anilistResult && anilistResult.progress;
  const episodeCount = progress || 1;
  if (hasProgress && episodeCount <= anilistResult.progress) {
    return;
  }

  if (state === "COMPLETED") {
    return;
  }

  if (progress === 0 && !anilistResult.mediaId) {
    state = "COMPLETED";
  }

  try {
    const legacyAnilist = new Anilist(userConfig.accesstoken);
    return await legacyAnilist.lists.addEntry(
      anilistResult.mediaId || anilistResult.id,
      // @ts-ignore
      {
        status: state,
        progress: episodeCount,
      },
    );
  } catch (e) {
    console.log(e);
  }
}
