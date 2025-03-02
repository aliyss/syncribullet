import type { Without } from '~/utils/helpers/types';

export interface CharacterName {
  first: string; // The given name
  middle?: string; // The middle name
  last: string; // The surname
  full: string; // The first and last name
  native: string; // The full name in their native language
  alternative?: string[]; // Other names the character might be referred to as
  alternativeSpoiler?: string[]; // Other names the character might be referred to as but are spoilers
  userPreferred: string; // The currently authenticated user's preferred name language. Default romaji for non-authenticated
}

export type Name = Without<CharacterName, 'alternativeSpoiler'>;
