import type { FuzzyDate } from '../types/anilist/date';
import type { AnilistLibraryListEntry } from '../types/anilist/library';

const fuzzyDateToString = (date: FuzzyDate): string => {
  if (date.day && date.month && date.year) {
    return `${date.year.toString().padStart(4, '0')}-${date.month
      .toString()
      .padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`;
  }

  if (date.month && date.year) {
    return `${date.year.toString().padStart(4, '0')}-${date.month
      .toString()
      .padStart(2, '0')}`;
  }

  if (date.year) {
    return `${date.year.toString().padStart(4, '0')}`;
  }

  return '';
};

export const buildLibraryObjectUserDescription = (
  libraryObject: AnilistLibraryListEntry,
): string => {
  const description = [];

  if (libraryObject.createdAt) {
    description.push(
      `• Added to watchlist: ${
        new Date(parseInt(libraryObject.createdAt.toString().padEnd(13, '0')))
          .toISOString()
          .split('T')[0]
      }`,
    );
    if (libraryObject.startedAt) {
      const startedAt = fuzzyDateToString(libraryObject.startedAt);
      if (startedAt) {
        description.push(`• Started At: ${startedAt}`);
      }
    }
    if (libraryObject.completedAt) {
      const completedAt = fuzzyDateToString(libraryObject.completedAt);
      if (completedAt) {
        description.push(`• Completed At: ${completedAt}`);
      }
    }
  }

  if (libraryObject.score) {
    if (description.length > 0) {
      description.push(`----------------`);
    }

    description.push(`• Rating: ${libraryObject.score}`);
  }

  if (libraryObject.progress) {
    if (description.length > 0) {
      description.push(`----------------`);
    }

    description.push(
      `• Progress: ${libraryObject.progress}/${libraryObject.media.episodes}`,
    );
  }

  if (libraryObject.notes) {
    if (description.length > 0) {
      description.push(`----------------`);
    }

    description.push(`Notes:\n${libraryObject.notes}`);
  }

  if (description.length > 0) {
    description.push(`----------------`);
  }

  description.push(libraryObject.media.description);

  return description.join('\n');
};
