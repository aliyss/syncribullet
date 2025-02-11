import type { UserSettings } from '~/utils/receiver/types/user-settings/settings';

export type SimklUserSettings = UserSettings & {
  auth?: {
    access_token: string;
    client_id: string;
  };
};
