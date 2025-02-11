import type { UserSettings } from '~/utils/receiver/types/user-settings/settings';

export type AnilistUserSettings = UserSettings & {
  auth?: {
    access_token: string;
    token_type: string;
    expires_in: string;
    client_id?: string;
  };
};
