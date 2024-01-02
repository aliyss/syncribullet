import type { ManifestCatalogItem } from "../manifest";

export function createAnilistCatalog(): ManifestCatalogItem[] {
  return [
    {
      id: "syncribullet-anilist-anime-CURRENT",
      type: "series",
      name: "Anilist - Watching",
      genres: ["tv", "special", "ova", "movie", "music video", "ona"],
      extra: [
        { name: "search", isRequired: false },
        { name: "genre", isRequired: false },
        { name: "skip", isRequired: false },
      ],
    },
    {
      id: "syncribullet-anilist-anime-PLANNING",
      type: "series",
      name: "Anilist - Planning",
      genres: ["tv", "special", "ova", "movie", "music video", "ona"],
      extra: [
        { name: "search", isRequired: false },
        { name: "genre", isRequired: false },
        { name: "skip", isRequired: false },
      ],
    },
    {
      id: "syncribullet-anilist-anime-COMPLETED",
      type: "series",
      name: "Anilist - Completed",
      genres: ["tv", "special", "ova", "movie", "music video", "ona"],
      extra: [
        { name: "search", isRequired: false },
        { name: "genre", isRequired: false },
        { name: "skip", isRequired: false },
      ],
    },
    {
      id: "syncribullet-anilist-anime-PAUSED",
      type: "series",
      name: "Anilist - On Hold",
      genres: ["tv", "special", "ova", "movie", "music video", "ona"],
      extra: [
        { name: "search", isRequired: false },
        { name: "genre", isRequired: false },
        { name: "skip", isRequired: false },
      ],
    },
    {
      id: "syncribullet-anilist-anime-DROPPED",
      type: "series",
      name: "Anilist - Dropped",
      genres: ["tv", "special", "ova", "movie", "music video", "ona"],
      extra: [
        { name: "search", isRequired: false },
        { name: "genre", isRequired: false },
        { name: "skip", isRequired: false },
      ],
    },
    {
      id: "syncribullet-anilist-anime-REPEATING",
      type: "series",
      name: "Anilist - Repeating",
      genres: ["tv", "special", "ova", "movie", "music video", "ona"],
      extra: [
        { name: "search", isRequired: false },
        { name: "genre", isRequired: false },
        { name: "skip", isRequired: false },
      ],
    },
  ];
}
