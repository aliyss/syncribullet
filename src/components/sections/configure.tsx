import {
  component$,
  noSerialize,
  useSignal,
  useVisibleTask$,
} from '@builder.io/qwik';
import type { NoSerialize } from '@builder.io/qwik';
import { server$, useLocation, useNavigate } from '@builder.io/qwik-city';

// Components
import ReceiversSection from '~/components/sections/receivers/receivers-section';
import ReceiversSettings from '~/components/sections/receivers/receivers-settings';
import SendersSection from '~/components/sections/senders/senders-section';
import SyncribulletSettings from '~/components/sections/syncribullet/syncribullet-settings';
import SyncribulletTitle from '~/components/titles/syncribullet-title';

// Utils
import { configurableReceivers } from '~/utils/connections/receivers';

import { buildClientReceiversFromUserConfigBuildMinifiedStrings } from '~/utils/config/buildClientReceivers';
import { decryptCompressToUserConfigBuildMinifiedStrings } from '~/utils/config/buildReceiversFromUrl';
import {
  buildUserConfigBuildMinifiedStringsFromReceivers,
  encryptCompressFromUserConfigBuildMinifiedStrings,
} from '~/utils/config/buildUrlFromReceivers';
import type { UserConfigBuildMinifiedString } from '~/utils/config/types';
import { exists } from '~/utils/helpers/array';
// Types
import { Receivers } from '~/utils/receiver/types/receivers';
import type { ReceiverClients } from '~/utils/receiver/types/receivers';
import type { GeneralSettings } from '~/utils/settings/general';

export type ApiClientForm = {
  client_id: string;
};

export type ManifestSettingsForm = {
  catalogs: IManifestSettings['catalogs'];
};

export type ApiClientCodeForm = {
  user_code: string;
};

export interface IManifestSettings {
  catalogs: { id: string; name: string; value: boolean }[];
}

export interface ManifestSettingsInfo {
  catalogs: { id: string; name: string }[];
}

export interface CurrentReceiver {
  id: string;
  settings?: {
    info: ManifestSettingsInfo;
    data: IManifestSettings;
  };
}

export enum ReceiversActionType {
  Catalogs = 'Catalogs',
  LiveSync = 'LiveSync',
  ImportSync = 'ImportSync',
  Settings = 'Settings',
}

export const retrieveConfig = server$(function (url: string) {
  return decryptCompressToUserConfigBuildMinifiedStrings(
    url,
    this.env.get('PRIVATE_ENCRYPTION_KEY') ||
      '__SECRET_DOM_DO_NOT_USE_OR_YOU_WILL_BE_FIRED',
  );
});

export const buildURL = server$(function (
  data:
    | [
        {
          [key in Receivers]?: UserConfigBuildMinifiedString<ReceiverClients>;
        },
        GeneralSettings,
      ]
    | {
        [key in Receivers]?: UserConfigBuildMinifiedString<ReceiverClients>;
      },
) {
  return encryptCompressFromUserConfigBuildMinifiedStrings(
    data,
    this.env.get('PRIVATE_ENCRYPTION_KEY') ||
      '__SECRET_DOM_DO_NOT_USE_OR_YOU_WILL_BE_FIRED',
  );
});

export interface ConfigureProps {
  config?: string;
}

export default component$<ConfigureProps>(({ config }) => {
  const nav = useNavigate();
  const location = useLocation();

  const receivers = useSignal<{
    [key in Receivers]: NoSerialize<ReceiverClients>;
  }>({
    [Receivers.SIMKL]: undefined,
    [Receivers.ANILIST]: undefined,
    [Receivers.KITSU]: undefined,
    [Receivers.TVTIME]: undefined,
  });

  const currentReceiver = useSignal<Receivers | null>();
  const currentViewType = useSignal<ReceiversActionType | null>(
    ReceiversActionType.Catalogs,
  );

  const syncriBulletSettings = useSignal<GeneralSettings>({});
  const syncriBulletUrl = useSignal<string | undefined>();

  useVisibleTask$(async () => {
    if (config) {
      const configData = await retrieveConfig(encodeURIComponent(config));
      const configReceivers = Array.isArray(configData)
        ? buildClientReceiversFromUserConfigBuildMinifiedStrings(configData[0])
        : buildClientReceiversFromUserConfigBuildMinifiedStrings(configData);

      if (Array.isArray(configData)) {
        syncriBulletSettings.value = configData[1];
      }
      receivers.value = {
        [Receivers.SIMKL]: noSerialize(configReceivers[Receivers.SIMKL]),
        [Receivers.ANILIST]: noSerialize(configReceivers[Receivers.ANILIST]),
        [Receivers.KITSU]: noSerialize(configReceivers[Receivers.KITSU]),
        [Receivers.TVTIME]: noSerialize(configReceivers[Receivers.TVTIME]),
      };
      return;
    }
    const configuredReceivers = configurableReceivers();
    receivers.value = {
      [Receivers.SIMKL]: noSerialize(configuredReceivers[Receivers.SIMKL]),
      [Receivers.ANILIST]: noSerialize(configuredReceivers[Receivers.ANILIST]),
      [Receivers.KITSU]: noSerialize(configuredReceivers[Receivers.KITSU]),
      [Receivers.TVTIME]: noSerialize(configuredReceivers[Receivers.TVTIME]),
    };

    const settings = localStorage.getItem('syncribullet-settings');
    if (settings) {
      try {
        syncriBulletSettings.value = JSON.parse(settings);
      } catch (e) {
        console.error(e);
      }
    }

    Object.values(receivers.value).forEach((receiver) => {
      receiver?.getUserConfig();
    });
  });

  return (
    <>
      <div class="flex flex-col gap-10 justify-center items-center p-6 w-full min-h-screen">
        <SyncribulletTitle />
        <ReceiversSection
          receivers={receivers.value}
          onClick$={(id, type) => {
            currentViewType.value = type;
            if (id === 'syncribullet-settings') {
              return;
            }
            currentReceiver.value = id;
          }}
        />
        {currentReceiver.value &&
        currentViewType.value === ReceiversActionType.LiveSync &&
        receivers.value[currentReceiver.value] ? (
          <ReceiversSettings
            currentReceiver={receivers.value[currentReceiver.value]!}
            updateReceiver$={() => {
              receivers.value = {
                ...receivers.value,
              };
            }}
          />
        ) : currentViewType.value === ReceiversActionType.Settings ? (
          <SyncribulletSettings
            currentSyncriBulletSettings={syncriBulletSettings.value}
            updateSyncriBulletSettings$={(value) => {
              syncriBulletSettings.value = value;

              const settings = value;
              Object.entries(settings).forEach(([key]) => {
                if (settings[key as keyof GeneralSettings] === undefined) {
                  delete settings[key as keyof GeneralSettings];
                  return;
                }
              });

              localStorage.setItem(
                'syncribullet-settings',
                JSON.stringify(settings),
              );
            }}
          />
        ) : null}
        {Object.values(receivers.value).filter(
          (item) => item && item.userSettings,
        ).length > 0 && (
          <SendersSection
            url={syncriBulletUrl.value}
            onClick$={async () => {
              const receiverList = Object.values(receivers.value)
                .filter(exists)
                .filter((item) => {
                  return !!(
                    item.getLiveSyncTypes(item.userSettings?.liveSync).length +
                    item.getManifestCatalogItems(
                      item.userSettings?.catalogs?.map((x) => x.id),
                    ).length
                  );
                });

              const urlData =
                buildUserConfigBuildMinifiedStringsFromReceivers(receiverList);

              let hasSettings = false;
              const settings = syncriBulletSettings.value;
              const keys = Object.entries(settings).filter(([key]) => {
                if (settings[key as keyof GeneralSettings] === undefined) {
                  return false;
                }
                return true;
              });

              if (keys.length) {
                hasSettings = true;
              }

              const url = hasSettings
                ? await buildURL([urlData, settings])
                : await buildURL(urlData);

              const link = `stremio://${location.url.host.replace(
                'localhost',
                '127.0.0.1',
              )}${
                location.url.host.endsWith('syncribullet')
                  ? '.baby-beamup.club'
                  : ''
              }/${encodeURIComponent(url)}/manifest.json`;

              console.log(link);
              await nav(link);
              syncriBulletUrl.value = link;
            }}
          />
        )}
      </div>
    </>
  );
});
