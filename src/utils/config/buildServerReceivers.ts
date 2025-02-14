import type { ReceiverServers } from '../receiver/types/receivers';
import { Receivers } from '../receiver/types/receivers';
import { AnilistServerReceiver } from '../receivers/anilist/recevier-server';
import { SimklServerReceiver } from '../receivers/simkl/recevier-server';
import type { UserConfigBuildMinifiedString } from './types';

export const buildReceiversFromUserConfigBuildMinifiedStrings = <
  RC extends ReceiverServers,
>(userConfigBuildMinifiedString: {
  [key in Receivers]?: UserConfigBuildMinifiedString<RC>;
}) => {
  const urlData: {
    [Receivers.SIMKL]: SimklServerReceiver | undefined;
    [Receivers.ANILIST]: AnilistServerReceiver | undefined;
    [Receivers.KITSU]: undefined;
  } = {
    [Receivers.SIMKL]: undefined,
    [Receivers.ANILIST]: undefined,
    [Receivers.KITSU]: undefined,
  };

  Object.entries(userConfigBuildMinifiedString).forEach(([key, value]) => {
    let receiver;
    switch (key) {
      case Receivers.SIMKL:
        receiver = new SimklServerReceiver().withUserConfig(value);
        urlData[key] = receiver;
        break;
      case Receivers.ANILIST:
        receiver = new AnilistServerReceiver().withUserConfig(value);
        urlData[key] = receiver;
        break;
      case Receivers.KITSU:
        break;
    }
  });

  return urlData;
};
