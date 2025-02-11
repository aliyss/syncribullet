type Enumerate<
  N extends number,
  Acc extends number[] = [],
> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>;

export type IntRange<F extends number, T extends number> = Exclude<
  Enumerate<T>,
  Enumerate<F>
>;

export type Year = `${IntRange<0, 9>}${IntRange<0, 9>}${IntRange<
  0,
  9
>}${IntRange<0, 9>}`;

export type RepeatingTuple<T extends string> = [T, ...T[]];
export type TupleToString<T extends Array<string>> = T extends [
  infer U extends string,
  ...infer Rest extends Array<string>,
]
  ? `${U}${TupleToString<Rest>}`
  : '';

export type Only<T, U> = {
  [P in keyof T]: T[P];
} & {
  [P in keyof U]?: never;
};

export type Either<T, U> = Only<T, U> | Only<U, T>;

type TMonth = `${number}${number}`;
type TDay = `${number}${number}`;
type THours = `${number}${number}`;
type TMinutes = `${number}${number}`;
type TSeconds = `${number}${number}`;
type TMilliseconds = `${number}${number}${number}`;

type TDateISODate = `${Year}-${TMonth}-${TDay}`;

type TDateISOTime = `${THours}:${TMinutes}:${TSeconds}.${TMilliseconds}`;

export type TDateISO = `${TDateISODate}T${TDateISOTime}Z`;

export type EnumMapping<E extends string, X> = {
  [K in E]: X;
};

export type OptionalEnumMapping<E extends string, X> = {
  [K in E]?: X;
};

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };
export type DeepWriteable<T> = {
  -readonly [P in keyof T]: DeepWriteable<T[P]>;
};
