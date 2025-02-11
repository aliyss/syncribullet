import type { Receivers } from '../receiver/types/receivers';

export const preauthString = (receiver: Receivers) => {
  return `preauth_${receiver}`;
};
