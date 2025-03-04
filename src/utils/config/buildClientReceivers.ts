import { Receivers } from '../receiver/types/receivers';
import type { ReceiverClients } from '../receiver/types/receivers';
import { AnilistClientReceiver } from '../receivers/anilist/recevier-client';
import { KitsuClientReceiver } from '../receivers/kitsu/recevier-client';
import { SimklClientReceiver } from '../receivers/simkl/recevier-client';
import type { UserConfigBuildMinifiedString } from './types';

export const buildClientReceiversFromUserConfigBuildMinifiedStrings = <
  RC extends ReceiverClients = ReceiverClients,
>(userConfigBuildMinifiedString: {
  [key in Receivers]?: UserConfigBuildMinifiedString<RC>;
}) => {
  const urlData: {
    [Receivers.SIMKL]: SimklClientReceiver;
    [Receivers.ANILIST]: AnilistClientReceiver;
    [Receivers.KITSU]: KitsuClientReceiver;
  } = {
    [Receivers.SIMKL]: new SimklClientReceiver(),
    [Receivers.ANILIST]: new AnilistClientReceiver(),
    [Receivers.KITSU]: new KitsuClientReceiver(),
  };

  Object.entries(userConfigBuildMinifiedString).forEach(([key, value]) => {
    switch (key) {
      case Receivers.SIMKL:
        urlData[key].withUserConfig(value);
        break;
      case Receivers.ANILIST:
        urlData[key].withUserConfig(value);
        break;
      case Receivers.KITSU:
        urlData[key].withUserConfig(value);
        break;
    }
  });

  return urlData;
};
