import type { ManifestReceiverTypes } from '~/utils/manifest';

export type MetaCatchAll = [
  ManifestReceiverTypes | undefined,
  string | undefined,
  string | undefined,
];
