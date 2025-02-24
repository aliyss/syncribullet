import Axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';

export const axiosInstance = Axios.create();

export const axiosCache = setupCache(axiosInstance, {
  staleIfError: 5 * 60 * 1000,
  debug: console.log,
});
