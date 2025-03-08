import type { UserSettings } from '~/utils/receiver/types/user-settings/settings';

import type { TVTimeMCIT } from './manifest';

export type TVTimeUserSettings = UserSettings<TVTimeMCIT> & {
  auth?: {
    id: string;
    access_token: string;
    rt: string;
  };
};
