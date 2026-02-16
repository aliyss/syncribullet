import type { ReceiverServers } from '../receiver/types/receivers';
import { Receivers } from '../receiver/types/receivers';
import { AnilistServerReceiver } from '../receivers/anilist/recevier-server';
import { KitsuServerReceiver } from '../receivers/kitsu/recevier-server';
import { MDBListServerReceiver } from '../receivers/mdblist/recevier-server';
import { SimklServerReceiver } from '../receivers/simkl/recevier-server';
import { TVTimeServerReceiver } from '../receivers/tvtime/recevier-server';
import type { UserConfigBuildMinifiedString } from './types';

export const buildReceiversFromUserConfigBuildMinifiedStrings = async <
  RC extends ReceiverServers,
>(userConfigBuildMinifiedString: {
  [key in Receivers]?: UserConfigBuildMinifiedString<RC>;
}) => {
  const urlData: {
    [Receivers.SIMKL]: SimklServerReceiver | undefined;
    [Receivers.ANILIST]: AnilistServerReceiver | undefined;
    [Receivers.KITSU]: KitsuServerReceiver | undefined;
    [Receivers.TVTIME]: TVTimeServerReceiver | undefined;
    [Receivers.MDBLIST]: MDBListServerReceiver | undefined;
  } = {
    [Receivers.SIMKL]: undefined,
    [Receivers.ANILIST]: undefined,
    [Receivers.KITSU]: undefined,
    [Receivers.TVTIME]: undefined,
    [Receivers.MDBLIST]: undefined,
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
        receiver = await new KitsuServerReceiver().withUserConfig(value);
        urlData[key] = receiver;
        break;
      case Receivers.TVTIME:
        receiver = await new TVTimeServerReceiver().withUserConfig(value);
        urlData[key] = receiver;
        break;
      case Receivers.MDBLIST:
        receiver = await new MDBListServerReceiver().withUserConfig(value);
        urlData[key] = receiver;
        break;
    }
  }

  return urlData;
};
