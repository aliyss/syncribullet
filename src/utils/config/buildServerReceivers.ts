import type { ReceiverServers } from '../receiver/types/receivers';
import { Receivers } from '../receiver/types/receivers';
import { AnilistServerReceiver } from '../receivers/anilist/recevier-server';
import { SimklServerReceiver } from '../receivers/simkl/recevier-server';
import type { UserConfigBuildMinifiedString } from './types';

export const buildReceiversFromUserConfigBuildMinifiedStrings = async <
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

  for (const [key, value] of Object.entries(userConfigBuildMinifiedString)) {
    let receiver;
    switch (key) {
      case Receivers.SIMKL:
        receiver = await new SimklServerReceiver().withUserConfig(value);
        urlData[key] = receiver;
        break;
      case Receivers.ANILIST:
        receiver = await new AnilistServerReceiver().withUserConfig(value);
        urlData[key] = receiver;
        break;
      case Receivers.KITSU:
        break;
    }
  }

  return urlData;
};
