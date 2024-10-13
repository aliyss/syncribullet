import type { ManifestCatalogItem } from '../manifest';

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
  catalogs: { id: ManifestCatalogItem['id']; value: boolean }[] = [],
): ManifestCatalogItem[] {
  const allCatalogs: ManifestCatalogItem[] = [
    {
      id: 'syncribullet-simkl-movies-plantowatch',
      type: 'movie',
      name: 'Simkl Plan to Watch',
      extra: [
        { name: 'genre', isRequired: false },
        { name: 'skip', isRequired: false },
      ],
    },
    {
      id: 'syncribullet-simkl-movies-completed',
      type: 'movie',
      name: 'Simkl Completed',
      extra: [
        { name: 'genre', isRequired: false },
        { name: 'skip', isRequired: false },
      ],
    },
    {
      id: 'syncribullet-simkl-movies-dropped',
      type: 'movie',
      name: 'Simkl Dropped',
      extra: [
        { name: 'genre', isRequired: false },
        { name: 'skip', isRequired: false },
      ],
    },
    {
      id: 'syncribullet-simkl-shows-watching',
      type: 'series',
      name: 'Simkl TV Watching',
      extra: [
        { name: 'genre', isRequired: false },
        { name: 'skip', isRequired: false },
      ],
    },
    {
      id: 'syncribullet-simkl-shows-plantowatch',
      type: 'series',
      name: 'Simkl TV Plan to Watch',
      extra: [
        { name: 'genre', isRequired: false },
        { name: 'skip', isRequired: false },
      ],
    },
    {
      id: 'syncribullet-simkl-shows-completed',
      type: 'series',
      name: 'Simkl TV Completed',
      extra: [
        { name: 'genre', isRequired: false },
        { name: 'skip', isRequired: false },
      ],
    },
    {
      id: 'syncribullet-simkl-shows-hold',
      type: 'series',
      name: 'Simkl TV On Hold',
      extra: [
        { name: 'genre', isRequired: false },
        { name: 'skip', isRequired: false },
      ],
    },
    {
      id: 'syncribullet-simkl-shows-dropped',
      type: 'series',
      name: 'Simkl TV Dropped',
      extra: [
        { name: 'genre', isRequired: false },
        { name: 'skip', isRequired: false },
      ],
    },
    {
      id: 'syncribullet-simkl-anime-watching',
      type: 'series',
      name: 'Simkl Anime Watching',
      genres: ['tv', 'special', 'ova', 'movie', 'music video', 'ona'],
      extra: [
        { name: 'genre', isRequired: false },
        { name: 'skip', isRequired: false },
      ],
    },
    {
      id: 'syncribullet-simkl-anime-plantowatch',
      type: 'series',
      name: 'Simkl Anime Plan to Watch',
      genres: ['tv', 'special', 'ova', 'movie', 'music video', 'ona'],
      extra: [
        { name: 'genre', isRequired: false },
        { name: 'skip', isRequired: false },
      ],
    },
    {
      id: 'syncribullet-simkl-anime-completed',
      type: 'series',
      name: 'Simkl Anime Completed',
      genres: ['tv', 'special', 'ova', 'movie', 'music video', 'ona'],
      extra: [
        { name: 'genre', isRequired: false },
        { name: 'skip', isRequired: false },
      ],
    },
    {
      id: 'syncribullet-simkl-anime-hold',
      type: 'series',
      name: 'Simkl Anime On Hold',
      genres: ['tv', 'special', 'ova', 'movie', 'music video', 'ona'],
      extra: [
        { name: 'genre', isRequired: false },
        { name: 'skip', isRequired: false },
      ],
    },
    {
      id: 'syncribullet-simkl-anime-dropped',
      type: 'series',
      name: 'Simkl Anime Dropped',
      genres: ['tv', 'special', 'ova', 'movie', 'music video', 'ona'],
      extra: [
        { name: 'genre', isRequired: false },
        { name: 'skip', isRequired: false },
      ],
    },
  ];

  return allCatalogs.filter((catalog) => {
    const found = catalogs.find((item) => item.id === catalog.id);
    return found ? found.value : true;
  });
}
