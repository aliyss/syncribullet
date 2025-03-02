import { Receivers } from '../receiver/types/receivers';
import { AnilistClientReceiver } from '../receivers/anilist/recevier-client';
import { SimklClientReceiver } from '../receivers/simkl/recevier-client';

export const configurableReceivers = () => ({
  [Receivers.SIMKL]: new SimklClientReceiver(),
  [Receivers.ANILIST]: new AnilistClientReceiver(),
});
