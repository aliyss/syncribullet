import { Receivers } from '../receiver/types/receivers';
import { AnilistClientReceiver } from '../receivers/anilist/recevier-client';
import { KitsuClientReceiver } from '../receivers/kitsu/recevier-client';
import { SimklClientReceiver } from '../receivers/simkl/recevier-client';

export const configurableReceivers = () => ({
  [Receivers.SIMKL]: new SimklClientReceiver(),
  [Receivers.ANILIST]: new AnilistClientReceiver(),
  [Receivers.KITSU]: new KitsuClientReceiver(),
});
