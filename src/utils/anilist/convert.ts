import { AnilistLibraryEntry } from "./types";

export async function convertAnilistToCinemeta(
  type: "shows",
  list: AnilistLibraryEntry[],
  options: {
    skip: number;
    genre?: string;
  },
) {
  try {
    if (type === "shows") {
      return list.slice(options.skip, options.skip + 100).map((x) => {
        return {
          type: "series",
          id: "anilist_" + x.media.id,
          name: x.media.title.userPreferred,
          poster: x.media.coverImage.large,
          releaseInfo: (x.media.seasonYear || "").toString(),
          genres: x.media.genres,
          description: x.media.description,
          background: x.media.bannerImage,
        };
      });
    }
  } catch (e) {
    console.log(e);
  }
}
