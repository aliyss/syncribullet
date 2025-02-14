import type { SimklUserSettings } from '../types/user-settings';

export function createSimklHeaders(
  auth: NonNullable<SimklUserSettings['auth']>,
) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${auth.access_token}`,
    'simkl-api-key': auth.client_id,
  };
}
