import Axios from 'axios';
import { buildWebStorage, setupCache } from 'axios-cache-interceptor';
import type { AxiosCacheInstance } from 'axios-cache-interceptor';

export const axiosInstance = Axios.create();

let sessionCache: AxiosCacheInstance | undefined = undefined;

export const axiosSessionCache = () => {
  if (sessionCache) {
    return sessionCache;
  }
  sessionCache = setupCache(axiosInstance, {
    staleIfError: 5 * 60 * 1000,
    methods: ['get', 'post'],
    storage: buildWebStorage(sessionStorage),
    debug: (x) => console.log(x),
  });
  return sessionCache;
};
