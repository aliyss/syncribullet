import type { UserSettings } from '~/utils/receiver/types/user-settings/settings';

import type { AnilistMCIT } from './manifest';

export type AnilistUserSettings = UserSettings<AnilistMCIT> & {
  auth?: {
    access_token: string;
    e: string;
    client_id?: string;
  };
};
