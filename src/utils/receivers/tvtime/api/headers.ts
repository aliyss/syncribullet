import type { TVTimeUserSettings } from '../types/user-settings';

export function createTVTimeHeaders(
  auth: TVTimeUserSettings['auth'],
  limit?: string,
  lastKey?: string,
) {
  return {
    'content-type': null,
    locale: 'en',
    'country-code': 'us',
    Accept: 'application/vnd.api+json',
    'client-version': '10.7.1',
    authorization: auth ? `Bearer ${auth.access_token}` : undefined,
    'Page-Limit': limit,
    'Page-Last-Key': lastKey,
  };
}
