import {
  component$,
  noSerialize,
  useSignal,
  useStore,
  useVisibleTask$,
} from '@builder.io/qwik';
import type { NoSerialize } from '@builder.io/qwik';
import { useLocation, useNavigate } from '@builder.io/qwik-city';
import type { DocumentHead } from '@builder.io/qwik-city';

// Components
import ReceiversSection from '~/components/sections/receivers/receivers-section';
import ReceiversSettings from '~/components/sections/receivers/receivers-settings';
import SyncribulletTitle from '~/components/titles/syncribullet-title';

// Utils
import { configurableReceivers } from '~/utils/connections/receivers';

// Types
import { exists } from '~/utils/helpers/array';
import { Receivers } from '~/utils/receiver/types/receivers';
import type { AnilistClientReceiver } from '~/utils/receivers/anilist/recevier-client';
import type { SimklClientReceiver } from '~/utils/receivers/simkl/recevier-client';
import type { ReceiverSettings } from '~/utils/settings/stringify';

export type ApiClientForm = {
  client_id: string;
};

export type ManifestSettingsForm = {
  catalogs: IManifestSettings['catalogs'];
};

export type ApiClientCodeForm = {
  user_code: string;
};

export interface IManifestSettings extends ReceiverSettings {
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

export default component$(() => {
  const nav = useNavigate();
  const location = useLocation();
  const senderListSync = [
    {
      id: 'stremio',
      icon: 'https://www.stremio.com/website/stremio-logo-small.png',
      text: 'Stremio',
      backgroundColour: 'bg-[#8152A3]/60',
    },
  ];

  const receivers = useStore<{
    [key in Receivers]: NoSerialize<
      SimklClientReceiver | AnilistClientReceiver
    >;
  }>({
    [Receivers.SIMKL]: undefined,
    [Receivers.ANILIST]: undefined,
    [Receivers.KITSU]: undefined,
  });

  const currentReceiver = useSignal<Receivers | null>(null);

  useVisibleTask$(() => {
    const configuredReceivers = configurableReceivers();
    receivers.simkl = noSerialize(configuredReceivers[Receivers.SIMKL]);
    receivers.simkl?.getUserConfig();
    receivers.anilist = noSerialize(configuredReceivers[Receivers.ANILIST]);
    receivers.anilist?.getUserConfig();
  });

  /*
  const fullSyncItems = receiverListSync
    .filter((item) => item.fullSync)
    .map((item) => {
      return (
        <Button
          key={item.id}
          backgroundColour={item.backgroundColour}
          icon={item.icon}
        >
          {item.text}
        </Button>
      );
    });
  */

  // const syncApplications = senderListSync.map((item) => {
  //   return (
  //     <Button
  //       key={item.id}
  //       backgroundColour={item.backgroundColour}
  //       icon={item.icon}
  //       onClick$={() => {
  //         const configURL: string[] = [];
  //         if (configuredReceivers['anilist'].data) {
  //           configURL.push(
  //             `anilist_accesstoken-=-${configuredReceivers['anilist'].data.access_token}`,
  //           );
  //           const anilistSettings =
  //             window.localStorage.getItem('anilist-settings');
  //           if (anilistSettings) {
  //             try {
  //               const anilistSettingsData: IManifestSettings =
  //                 JSON.parse(anilistSettings);
  //               configURL.push(
  //                 `anilist_settings-=-${stringifySettings(
  //                   anilistSettingsData,
  //                   'anilist',
  //                 )}`,
  //               );
  //             } catch (e) {
  //               console.error(e);
  //             }
  //           }
  //         }
  //         if (configuredReceivers['simkl'].data) {
  //           configURL.push(
  //             `simkl_accesstoken-=-${configuredReceivers['simkl'].data.access_token}`,
  //           );
  //           configURL.push(
  //             `simkl_clientid-=-${configuredReceivers['simkl'].data.client_id}`,
  //           );
  //
  //           const simklSettings = window.localStorage.getItem('simkl-settings');
  //           if (simklSettings) {
  //             try {
  //               const simklSettingsData: IManifestSettings =
  //                 JSON.parse(simklSettings);
  //               configURL.push(
  //                 `simkl_settings-=-${stringifySettings(
  //                   simklSettingsData,
  //                   'simkl',
  //                 )}`,
  //               );
  //             } catch (e) {
  //               console.error(e);
  //             }
  //           }
  //         }
  //         if (configuredReceivers['stremio'].data) {
  //           configURL.push(
  //             `stremio_authKey-=-${configuredReceivers['stremio'].data.authKey}`,
  //           );
  //         }
  //         const info = `stremio://${location.url.host}${
  //           location.url.host.endsWith('syncribullet')
  //             ? '.baby-beamup.club'
  //             : ''
  //         }/${encodeURI(configURL.join('|'))}/manifest.json`;
  //         nav(info);
  //       }}
  //     >
  //       {item.text}
  //     </Button>
  //   );
  // });

  return (
    <>
      <div class="flex flex-col gap-10 justify-center items-center p-6 w-full min-h-screen">
        <SyncribulletTitle />
        <ReceiversSection
          receivers={Object.values(receivers).filter(exists)}
          onClick$={(id) => {
            currentReceiver.value = id;
          }}
        />
        {currentReceiver.value !== null && receivers[currentReceiver.value] && (
          <ReceiversSettings
            currentReceiver={receivers[currentReceiver.value]!}
          />
        )}
        {Object.values(receivers).filter((item) => item && item.userSettings)
          .length > 0 ? (
          <div class="p-6 w-full max-w-2xl rounded-xl border shadow-xl border-outline/20 bg-secondary-container text-on-secondary-container">
            <h2 class="w-full text-xl font-bold text-center md:text-3xl">
              Senders
            </h2>
            <div class="flex flex-col gap-6 pt-5 md:flex-row">
              <div class="w-full text-center">
                <h3 class="font-bold md:text-xl">Applications</h3>
                <div class="flex flex-wrap gap-2 justify-center pt-1 text-on-background">
                  {/* {syncApplications} */}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
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
