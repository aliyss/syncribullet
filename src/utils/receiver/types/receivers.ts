import type { AnilistClientReceiver } from '~/utils/receivers/anilist/recevier-client';
import type { SimklClientReceiver } from '~/utils/receivers/simkl/recevier-client';

export enum Receivers {
  SIMKL = 'simkl',
  ANILIST = 'anilist',
  KITSU = 'kitsu',
}

export type ReceiverClients = SimklClientReceiver | AnilistClientReceiver;
