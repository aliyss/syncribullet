import type { Year } from './types';

export const yearsToString = <
  SY extends Year | number | undefined,
  EY extends Year | number | undefined,
>(
  startYear: SY,
  endYear: EY,
): EY extends undefined ? Year : string | undefined => {
  if (!startYear) {
    return startYear as any;
  }
  if (!endYear) {
    return startYear as any;
  }
  if (startYear.toString() === endYear.toString()) {
    return startYear as any;
  }
  return `${startYear}-${endYear}` as any;
};
