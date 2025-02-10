export type KnownNoSerialize<T> = T & {
  __no_serialize__: true;
};
