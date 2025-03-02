import type { AnilistMCIT } from '~/utils/receivers/anilist/types/manifest';
import type { CinemetaMCIT } from '~/utils/receivers/cinemeta/types/manifest';
import type { KitsuAddonMCIT } from '~/utils/receivers/kitsu-addon/types/manifest';
import type { KitsuMCIT } from '~/utils/receivers/kitsu/types/manifest';
import type { SimklMCIT } from '~/utils/receivers/simkl/types/manifest';

import type { ReceiverClient } from '../receiver-client';
import type { ReceiverServer } from '../receiver-server';

export enum Receivers {
  SIMKL = 'simkl',
  ANILIST = 'anilist',
  KITSU = 'kitsu',
}

export enum ExtendedReceivers {
  CINEMETA = 'cinemeta',
  KITSU_ADDON = 'kitsu-addon',
}

export type AllReceivers = Receivers | ExtendedReceivers;

export type ReceiverMCITypes = SimklMCIT | AnilistMCIT | KitsuMCIT;
export type ExtendedReceiverMCITypes = CinemetaMCIT | KitsuAddonMCIT;

export type ReceiverClients = ReceiverClient<ReceiverMCITypes>;
export type ReceiverServers = ReceiverServer<ReceiverMCITypes>;
