import { ManifestCatalogItem } from "../manifest";

export function createSimklHeaders(accessToken: string, id: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
    "simkl-api-key": id,
  };
}

export function createSimklCatalog(): ManifestCatalogItem[] {
  return [
    {
      id: "syncribullet-simkl-movies-plantowatch",
      type: "movie",
      name: "Simkl Plan to Watch",
      extra: [
        { name: "genre", isRequired: false },
        { name: "skip", isRequired: false },
      ],
    },
    {
      id: "syncribullet-simkl-movies-completed",
      type: "movie",
      name: "Simkl Completed",
      extra: [
        { name: "genre", isRequired: false },
        { name: "skip", isRequired: false },
      ],
    },
    {
      id: "syncribullet-simkl-movies-dropped",
      type: "movie",
      name: "Simkl Dropped",
      extra: [
        { name: "genre", isRequired: false },
        { name: "skip", isRequired: false },
      ],
    },
    {
      id: "syncribullet-simkl-shows-watching",
      type: "series",
      name: "Simkl TV Watching",
      extra: [
        { name: "genre", isRequired: false },
        { name: "skip", isRequired: false },
      ],
    },
    {
      id: "syncribullet-simkl-shows-plantowatch",
      type: "series",
      name: "Simkl TV Plan to Watch",
      extra: [
        { name: "genre", isRequired: false },
        { name: "skip", isRequired: false },
      ],
    },
    {
      id: "syncribullet-simkl-shows-completed",
      type: "series",
      name: "Simkl TV Completed",
      extra: [
        { name: "genre", isRequired: false },
        { name: "skip", isRequired: false },
      ],
    },
    {
      id: "syncribullet-simkl-shows-hold",
      type: "series",
      name: "Simkl TV On Hold",
      extra: [
        { name: "genre", isRequired: false },
        { name: "skip", isRequired: false },
      ],
    },
    {
      id: "syncribullet-simkl-shows-dropped",
      type: "series",
      name: "Simkl TV Dropped",
      extra: [
        { name: "genre", isRequired: false },
        { name: "skip", isRequired: false },
      ],
    },
    {
      id: "syncribullet-simkl-anime-watching",
      type: "series",
      name: "Simkl Anime Watching",
      genres: ["tv", "special", "ova", "movie", "music video", "ona"],
      extra: [
        { name: "genre", isRequired: false },
        { name: "skip", isRequired: false },
      ],
    },
    {
      id: "syncribullet-simkl-anime-plantowatch",
      type: "series",
      name: "Simkl Anime Plan to Watch",
      genres: ["tv", "special", "ova", "movie", "music video", "ona"],
      extra: [
        { name: "genre", isRequired: false },
        { name: "skip", isRequired: false },
      ],
    },
    {
      id: "syncribullet-simkl-anime-completed",
      type: "series",
      name: "Simkl Anime Completed",
      genres: ["tv", "special", "ova", "movie", "music video", "ona"],
      extra: [
        { name: "genre", isRequired: false },
        { name: "skip", isRequired: false },
      ],
    },
    {
      id: "syncribullet-simkl-anime-hold",
      type: "series",
      name: "Simkl Anime On Hold",
      genres: ["tv", "special", "ova", "movie", "music video", "ona"],
      extra: [
        { name: "genre", isRequired: false },
        { name: "skip", isRequired: false },
      ],
    },
    {
      id: "syncribullet-simkl-anime-dropped",
      type: "series",
      name: "Simkl Anime Dropped",
      genres: ["tv", "special", "ova", "movie", "music video", "ona"],
      extra: [
        { name: "genre", isRequired: false },
        { name: "skip", isRequired: false },
      ],
    },
  ];
}
