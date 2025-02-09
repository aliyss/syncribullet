import { type ManifestCatalogItem, ManifestReceiverTypes } from '../manifest';

export function getAnilistCatalogs(): {
  id: ManifestCatalogItem['id'];
  name: string;
  smallId: string;
}[] {
  return [
    {
      id: 'syncribullet-anilist-anime-CURRENT',
      name: 'Watching',
      smallId: 'C',
    },
    {
      id: 'syncribullet-anilist-anime-PLANNING',
      name: 'Planning',
      smallId: 'P',
    },
    {
      id: 'syncribullet-anilist-anime-COMPLETED',
      name: 'Completed',
      smallId: 'CO',
    },
    {
      id: 'syncribullet-anilist-anime-PAUSED',
      name: 'On Hold',
      smallId: 'O',
    },
    {
      id: 'syncribullet-anilist-anime-DROPPED',
      name: 'Dropped',
      smallId: 'D',
    },
    {
      id: 'syncribullet-anilist-anime-REPEATING',
      name: 'Repeating',
      smallId: 'R',
    },
  ];
}

export function createAnilistCatalog(
  catalogs: {
    id: ManifestCatalogItem['id'];
    value: boolean;
  }[] = getAnilistCatalogs().map((item) => ({ id: item.id, value: true })),
): ManifestCatalogItem[] {
  const allCatalogs: ManifestCatalogItem[] = [
    {
      id: 'syncribullet-anilist-anime-CURRENT',
      type: ManifestReceiverTypes.ANIME,
      name: 'Anilist - Watching',
      genres: ['tv', 'special', 'ova', 'movie', 'music video', 'ona'],
      extra: [
        { name: 'search', isRequired: false },
        { name: 'genre', isRequired: false },
        { name: 'skip', isRequired: false },
      ],
    },
    {
      id: 'syncribullet-anilist-anime-PLANNING',
      type: ManifestReceiverTypes.ANIME,
      name: 'Anilist - Planning',
      genres: ['tv', 'special', 'ova', 'movie', 'music video', 'ona'],
      extra: [
        { name: 'search', isRequired: false },
        { name: 'genre', isRequired: false },
        { name: 'skip', isRequired: false },
      ],
    },
    {
      id: 'syncribullet-anilist-anime-COMPLETED',
      type: ManifestReceiverTypes.ANIME,
      name: 'Anilist - Completed',
      genres: ['tv', 'special', 'ova', 'movie', 'music video', 'ona'],
      extra: [
        { name: 'search', isRequired: false },
        { name: 'genre', isRequired: false },
        { name: 'skip', isRequired: false },
      ],
    },
    {
      id: 'syncribullet-anilist-anime-PAUSED',
      type: ManifestReceiverTypes.ANIME,
      name: 'Anilist - On Hold',
      genres: ['tv', 'special', 'ova', 'movie', 'music video', 'ona'],
      extra: [
        { name: 'search', isRequired: false },
        { name: 'genre', isRequired: false },
        { name: 'skip', isRequired: false },
      ],
    },
    {
      id: 'syncribullet-anilist-anime-DROPPED',
      type: ManifestReceiverTypes.ANIME,
      name: 'Anilist - Dropped',
      genres: ['tv', 'special', 'ova', 'movie', 'music video', 'ona'],
      extra: [
        { name: 'search', isRequired: false },
        { name: 'genre', isRequired: false },
        { name: 'skip', isRequired: false },
      ],
    },
    {
      id: 'syncribullet-anilist-anime-REPEATING',
      type: ManifestReceiverTypes.ANIME,
      name: 'Anilist - Repeating',
      genres: ['tv', 'special', 'ova', 'movie', 'music video', 'ona'],
      extra: [
        { name: 'search', isRequired: false },
        { name: 'genre', isRequired: false },
        { name: 'skip', isRequired: false },
      ],
    },
  ];

  const defaultCatalogs = [
    'syncribullet-anilist-anime-CURRENT',
    'syncribullet-anilist-anime-PLANNING',
    'syncribullet-anilist-anime-COMPLETED',
  ];

  return allCatalogs.filter((catalog) => {
    const found = catalogs.find((item) => item.id === catalog.id);
    return found ? found.value : defaultCatalogs.includes(catalog.id);
  });
}
