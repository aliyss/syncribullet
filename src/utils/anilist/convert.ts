import type { AnilistLibraryEntry } from "./types";

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
      return list
        .filter((x) => {
          if (options.genre) {
            if (x.media.format === "TV" && options.genre === "tv") {
              return true;
            } else if (x.media.format === "TV") {
              return false;
            }
            if (x.media.format === "MOVIE" && options.genre === "movie") {
              return true;
            } else if (x.media.format === "MOVIE") {
              return false;
            }
            if (x.media.format === "OVA" && options.genre === "ova") {
              return true;
            } else if (x.media.format === "OVA") {
              return false;
            }
            if (x.media.format === "SPECIAL" && options.genre === "special") {
              return true;
            } else if (x.media.format === "SPECIAL") {
              return false;
            }
            if (x.media.format === "MUSIC" && options.genre === "music video") {
              return true;
            } else if (x.media.format === "SPECIAL") {
              return false;
            }
            if (x.media.format === "ONA" && options.genre === "ona") {
              return true;
            } else if (x.media.format === "ONA") {
              return false;
            }
            return x.media.format === options.genre;
          }
          return true;
        })
        .slice(options.skip, options.skip + 100)
        .map((x) => {
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
