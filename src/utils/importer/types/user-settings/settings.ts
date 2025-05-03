import type { ImporterMCITypes } from '../importers';

export type UserSettings<MCIT extends ImporterMCITypes> = {
  auth?: MCIT['auth'];
};
