import type { KitsuUserSettings } from '../types/user-settings';

export function createKitsuHeaders(auth: KitsuUserSettings['auth']) {
  return {
    'Content-Type': 'application/vnd.api+json',
    Accept: 'application/vnd.api+json',
    Authorization: auth ? `Bearer ${auth.access_token}` : undefined,
  };
}
