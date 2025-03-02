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
    [Receivers.SIMKL]: SimklClientReceiver | undefined;
    [Receivers.ANILIST]: AnilistClientReceiver | undefined;
    [Receivers.KITSU]: KitsuClientReceiver | undefined;
  } = {
    [Receivers.SIMKL]: undefined,
    [Receivers.ANILIST]: undefined,
    [Receivers.KITSU]: undefined,
  };

  Object.entries(userConfigBuildMinifiedString).forEach(([key, value]) => {
    let receiver;
    switch (key) {
      case Receivers.SIMKL:
        receiver = new SimklClientReceiver().withUserConfig(value);
        urlData[key] = receiver;
        break;
      case Receivers.ANILIST:
        receiver = new AnilistClientReceiver().withUserConfig(value);
        urlData[key] = receiver;
        break;
      case Receivers.KITSU:
        receiver = new KitsuClientReceiver().withUserConfig(value);
        urlData[key] = receiver;
        break;
    }
  });

  return urlData;
};
