import type { UserSettings } from '~/utils/receiver/types/user-settings/settings';

import type { MDBListMCIT } from './manifest';

export type MDBListUserSettings = UserSettings<MDBListMCIT> & {
  auth?: {
    apikey: string;
  };
};
