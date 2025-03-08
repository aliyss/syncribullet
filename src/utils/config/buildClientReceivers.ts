import { configurableReceivers } from '../connections/receivers';
import { Receivers } from '../receiver/types/receivers';
import type { ReceiverClients } from '../receiver/types/receivers';
import type { UserConfigBuildMinifiedString } from './types';

export const buildClientReceiversFromUserConfigBuildMinifiedStrings = <
  RC extends ReceiverClients = ReceiverClients,
>(userConfigBuildMinifiedString: {
  [key in Receivers]?: UserConfigBuildMinifiedString<RC>;
}) => {
  const urlData = configurableReceivers();

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
      case Receivers.TVTIME:
        urlData[key].withUserConfig(value);
        break;
    }
  });

  return urlData;
};
