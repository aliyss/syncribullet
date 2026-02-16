import type { MDBListUserSettings } from '../types/user-settings';

export function createMDBListHeaders(
  _auth: NonNullable<MDBListUserSettings['auth']>,
) {
  return {
    'Content-Type': 'application/json',
  };
}
