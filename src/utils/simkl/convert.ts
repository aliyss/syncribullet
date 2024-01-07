import type { SimklLibrary, SimklLibraryType } from "./types";

export async function convertSimklToCinemeta(
  type: SimklLibraryType,
  list: SimklLibrary,
  options: {
    skip: number;
    genre?: string;
  },
) {
  try {
    if (type === "movies") {
      return list.movies
        ?.slice(options.skip, options.skip ? options.skip + 100 : undefined)
        .map((x) => {
          return {
            type: "movies",
            id: x.movie.ids.imdb,
            name: x.movie.title,
            releaseInfo: x.movie.year,
            poster: "https://simkl.in/posters/" + x.movie.poster + "_0.jpg",
          };
        });
    } else if (type === "shows") {
      return list.shows
        ?.slice(options.skip, options.skip ? options.skip + 100 : undefined)
        .map((x) => {
          return {
            type: "series",
            id: x.show.ids.imdb,
            name: x.show.title,
            releaseInfo: x.show.year,
            poster: "https://simkl.in/posters/" + x.show.poster + "_0.jpg",
          };
        });
    } else if (type === "anime") {
      return list.anime
        ?.filter((x) => {
          if (options.genre) {
            return x.anime_type === options.genre;
          }
          return true;
        })
        .slice(options.skip, options.skip ? options.skip + 100 : undefined)
        .map((x) => {
          return {
            type: "series",
            id: x.show.ids.imdb,
            name: x.show.title,
            releaseInfo: x.show.year,
            poster: "https://simkl.in/posters/" + x.show.poster + "_0.jpg",
          };
        });
    }
  } catch (e) {
    console.log(e);
  }
}
