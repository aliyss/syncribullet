export const exists = <T>(item: T | undefined): item is T => {
  return !!item;
};
