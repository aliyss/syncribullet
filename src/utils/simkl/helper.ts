import { type ManifestCatalogItem, ManifestReceiverTypes } from '../manifest';

export function createSimklHeaders(accessToken: string, id: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
    'simkl-api-key': id,
  };
}

export function getSimklCatalogs(): {
  id: ManifestCatalogItem['id'];
  name: string;
  smallId: string;
}[] {
  return [
    {
      id: 'syncribullet-simkl-movies-plantowatch',
      name: 'Simkl Plan to Watch',
      smallId: 'P',
    },
    {
      id: 'syncribullet-simkl-movies-completed',
      name: 'Simkl Completed',
      smallId: 'C',
    },
    {
      id: 'syncribullet-simkl-movies-dropped',
      name: 'Simkl Dropped',
      smallId: 'D',
    },
    {
      id: 'syncribullet-simkl-shows-watching',
      name: 'Simkl TV Watching',
      smallId: 'W',
    },
    {
      id: 'syncribullet-simkl-shows-plantowatch',
      name: 'Simkl TV Plan to Watch',
      smallId: 'TP',
    },
    {
      id: 'syncribullet-simkl-shows-completed',
      name: 'Simkl TV Completed',
      smallId: 'TC',
    },
    {
      id: 'syncribullet-simkl-shows-hold',
      name: 'Simkl TV On Hold',
      smallId: 'TO',
    },
    {
      id: 'syncribullet-simkl-shows-dropped',
      name: 'Simkl TV Dropped',
      smallId: 'TD',
    },
    {
      id: 'syncribullet-simkl-anime-watching',
      name: 'Simkl Anime Watching',
      smallId: 'AW',
    },
    {
      id: 'syncribullet-simkl-anime-plantowatch',
      name: 'Simkl Anime Plan to Watch',
      smallId: 'AP',
    },
    {
      id: 'syncribullet-simkl-anime-completed',
      name: 'Simkl Anime Completed',
      smallId: 'AC',
    },
    {
      id: 'syncribullet-simkl-anime-hold',
      name: 'Simkl Anime On Hold',
      smallId: 'AO',
    },
    {
      id: 'syncribullet-simkl-anime-dropped',
      name: 'Simkl Anime Dropped',
      smallId: 'AD',
    },
  ];
}

export function createSimklCatalog(
  catalogs: {
    id: ManifestCatalogItem['id'];
    value: boolean;
  }[] = getSimklCatalogs().map((item) => ({ id: item.id, value: true })),
): ManifestCatalogItem[] {
  const allCatalogs: ManifestCatalogItem[] = [
    {
      id: 'syncribullet-simkl-movies-plantowatch',
      type: ManifestReceiverTypes.MOVIE,
      name: 'Simkl - Plan to Watch',
      extra: [
        { name: 'genre', isRequired: false },
        { name: 'skip', isRequired: false },
      ],
    },
    {
      id: 'syncribullet-simkl-movies-completed',
      type: ManifestReceiverTypes.MOVIE,
      name: 'Simkl - Completed',
      extra: [
        { name: 'genre', isRequired: false },
        { name: 'skip', isRequired: false },
      ],
    },
    {
      id: 'syncribullet-simkl-movies-dropped',
      type: ManifestReceiverTypes.MOVIE,
      name: 'Simkl - Dropped',
      extra: [
        { name: 'genre', isRequired: false },
        { name: 'skip', isRequired: false },
      ],
    },
    {
      id: 'syncribullet-simkl-shows-watching',
      type: ManifestReceiverTypes.SERIES,
      name: 'Simkl - Watching',
      extra: [
        { name: 'genre', isRequired: false },
        { name: 'skip', isRequired: false },
      ],
    },
    {
      id: 'syncribullet-simkl-shows-plantowatch',
      type: ManifestReceiverTypes.SERIES,
      name: 'Simkl - Plan to Watch',
      extra: [
        { name: 'genre', isRequired: false },
        { name: 'skip', isRequired: false },
      ],
    },
    {
      id: 'syncribullet-simkl-shows-completed',
      type: ManifestReceiverTypes.SERIES,
      name: 'Simkl - Completed',
      extra: [
        { name: 'genre', isRequired: false },
        { name: 'skip', isRequired: false },
      ],
    },
    {
      id: 'syncribullet-simkl-shows-hold',
      type: ManifestReceiverTypes.SERIES,
      name: 'Simkl - On Hold',
      extra: [
        { name: 'genre', isRequired: false },
        { name: 'skip', isRequired: false },
      ],
    },
    {
      id: 'syncribullet-simkl-shows-dropped',
      type: ManifestReceiverTypes.SERIES,
      name: 'Simkl - Dropped',
      extra: [
        { name: 'genre', isRequired: false },
        { name: 'skip', isRequired: false },
      ],
    },
    {
      id: 'syncribullet-simkl-anime-watching',
      type: ManifestReceiverTypes.ANIME,
      name: 'Simkl - Watching',
      genres: ['tv', 'special', 'ova', 'movie', 'music video', 'ona'],
      extra: [
        { name: 'genre', isRequired: false },
        { name: 'skip', isRequired: false },
      ],
    },
    {
      id: 'syncribullet-simkl-anime-plantowatch',
      type: ManifestReceiverTypes.ANIME,
      name: 'Simkl - Plan to Watch',
      genres: ['tv', 'special', 'ova', 'movie', 'music video', 'ona'],
      extra: [
        { name: 'genre', isRequired: false },
        { name: 'skip', isRequired: false },
      ],
    },
    {
      id: 'syncribullet-simkl-anime-completed',
      type: ManifestReceiverTypes.ANIME,
      name: 'Simkl - Completed',
      genres: ['tv', 'special', 'ova', 'movie', 'music video', 'ona'],
      extra: [
        { name: 'genre', isRequired: false },
        { name: 'skip', isRequired: false },
      ],
    },
    {
      id: 'syncribullet-simkl-anime-hold',
      type: ManifestReceiverTypes.ANIME,
      name: 'Simkl - On Hold',
      genres: ['tv', 'special', 'ova', 'movie', 'music video', 'ona'],
      extra: [
        { name: 'genre', isRequired: false },
        { name: 'skip', isRequired: false },
      ],
    },
    {
      id: 'syncribullet-simkl-anime-dropped',
      type: ManifestReceiverTypes.ANIME,
      name: 'Simkl - Dropped',
      genres: ['tv', 'special', 'ova', 'movie', 'music video', 'ona'],
      extra: [
        { name: 'genre', isRequired: false },
        { name: 'skip', isRequired: false },
      ],
    },
  ];

  const defaultCatalogs = [
    'syncribullet-simkl-movies-plantowatch',
    'syncribullet-simkl-movies-completed',
    'syncribullet-simkl-anime-watching',
    'syncribullet-simkl-anime-plantowatch',
    'syncribullet-simkl-anime-completed',
    'syncribullet-simkl-shows-watching',
    'syncribullet-simkl-shows-plantowatch',
    'syncribullet-simkl-shows-completed',
  ];

  return allCatalogs.filter((catalog) => {
    const found = catalogs.find((item) => item.id === catalog.id);
    return found ? found.value : defaultCatalogs.includes(catalog.id);
  });
}
