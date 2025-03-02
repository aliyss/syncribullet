import {
  component$,
  noSerialize,
  useSignal,
  useVisibleTask$,
} from '@builder.io/qwik';
import type { NoSerialize } from '@builder.io/qwik';
import {
  type DocumentHead,
  server$,
  useLocation,
  useNavigate,
} from '@builder.io/qwik-city';

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
import type {
  GeneralSettings,
  SyncriBulletGeneralSettingsId,
} from '~/utils/settings/general';

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

export default component$(() => {
  const nav = useNavigate();
  const location = useLocation();

  const receivers = useSignal<{
    [key in Receivers]: NoSerialize<ReceiverClients>;
  }>({
    [Receivers.SIMKL]: undefined,
    [Receivers.ANILIST]: undefined,
    [Receivers.KITSU]: undefined,
  });

  const currentReceiver = useSignal<
    Receivers | SyncriBulletGeneralSettingsId | null
  >(null);

  const syncriBulletSettings = useSignal<GeneralSettings>({});

  useVisibleTask$(async () => {
    const config = location.url.searchParams.get('config');
    if (config) {
      const configData = await retrieveConfig(config);
      const configReceivers = Array.isArray(configData)
        ? buildClientReceiversFromUserConfigBuildMinifiedStrings(configData[0])
        : buildClientReceiversFromUserConfigBuildMinifiedStrings(configData);

      if (Array.isArray(configData)) {
        syncriBulletSettings.value = configData[1];
      }
      receivers.value = {
        [Receivers.SIMKL]: noSerialize(configReceivers[Receivers.SIMKL]),
        [Receivers.ANILIST]: noSerialize(configReceivers[Receivers.ANILIST]),
        [Receivers.KITSU]: undefined,
      };
      return;
    }
    const configuredReceivers = configurableReceivers();
    receivers.value = {
      [Receivers.SIMKL]: noSerialize(configuredReceivers[Receivers.SIMKL]),
      [Receivers.ANILIST]: noSerialize(configuredReceivers[Receivers.ANILIST]),
      [Receivers.KITSU]: undefined,
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
          onClick$={(id) => {
            currentReceiver.value = id;
          }}
        />
        {currentReceiver.value !== null &&
        currentReceiver.value !== 'syncribullet-settings' &&
        receivers.value[currentReceiver.value] ? (
          <ReceiversSettings
            currentReceiver={receivers.value[currentReceiver.value]!}
            updateReceiver$={() => {
              receivers.value = {
                ...receivers.value,
              };
            }}
          />
        ) : currentReceiver.value === 'syncribullet-settings' ? (
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
            onClick$={async () => {
              const receiverList = Object.values(receivers.value).filter(
                exists,
              );
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

              console.log(url);

              const link = `stremio://${location.url.host}${
                location.url.host.endsWith('syncribullet')
                  ? '.baby-beamup.club'
                  : ''
              }/${encodeURI(url)}/manifest.json`;
              await nav(link);
            }}
          />
        )}
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: 'SyncriBullet',
  meta: [
    {
      name: 'description',
      content: 'Mixing up synchronizisation',
    },
  ],
};
