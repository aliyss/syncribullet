import { DeepWriteable } from '../helpers/types';

export type PickByArray<
  T extends Record<string | number | symbol, unknown>,
  K extends readonly (keyof T)[],
> = K extends [infer Head extends keyof T, ...infer Rest extends (keyof T)[]]
  ? Pick<T, Head> & PickByArray<T, Rest>
  : {};

export type PickByArrays<
  T extends Record<string | number | symbol, unknown>,
  KS extends readonly (readonly (keyof T)[])[],
> = KS extends [
  infer Head extends (keyof T)[],
  ...infer Rest extends (readonly (keyof T)[])[],
]
  ? PickByArray<T, Head> | PickByArrays<T, Rest>
  : never;

export type ID = string | number;

export enum IDSources {
  ANILIST = 'anilist',
  KITSU = 'kitsu',
  SIMKL = 'simkl',
  IMDB = 'imdb',
  TMDB = 'tmdb',
  TVDB = 'tvdb',
  MAL = 'mal',
}

export type IDs = Record<IDSources, ID | undefined> & {
  [IDSources.IMDB]: string | undefined;
  [IDSources.ANILIST]: number | undefined;
  [IDSources.SIMKL]: number | undefined;
  [IDSources.KITSU]: number | undefined;
  [IDSources.TMDB]: number | undefined;
  [IDSources.TVDB]: number | undefined;
  [IDSources.MAL]: number | undefined;
};

// Option 1 (Immutable)
export const internalIds = [
  [IDSources.SIMKL],
  [IDSources.IMDB, IDSources.ANILIST],
] as const satisfies readonly (readonly IDSources[])[];

// Option 2 (Mutable)
// export const internalIds: IDSources[][] = [[IDSources.SIMKL]];

export const x: PickByArrays<IDs, DeepWriteable<typeof internalIds>> = {
  [IDSources.IMDB]: '', // ✅ Correctly inferred
  [IDSources.SIMKL]: 3, // ✅ Correctly inferred
};
