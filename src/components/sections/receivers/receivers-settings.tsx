import { component$ } from '@builder.io/qwik';
import type { PropFunction } from '@builder.io/qwik';

import AnilistLogin from '~/components/forms/anilist-login';
import KitsuLogin from '~/components/forms/kitsu-login';
import ManifestSettings from '~/components/forms/manifest-settings';
import SimklLogin from '~/components/forms/simkl-login';

import type { KnownNoSerialize } from '~/utils/helpers/qwik-types';
import {
  type ReceiverClients,
  Receivers,
} from '~/utils/receiver/types/receivers';

export interface ReceiversSettingsProps {
  currentReceiver: KnownNoSerialize<ReceiverClients>;
  updateReceiver$: PropFunction<() => void>;
}

export default component$<ReceiversSettingsProps>(
  ({ currentReceiver, updateReceiver$ }) => {
    return (
      <div class="p-6 w-full max-w-2xl rounded-xl border shadow-xl border-outline/20 bg-secondary/20 flex flex-col">
        <h2 class="w-full text-xl font-bold text-center md:text-3xl">
          {currentReceiver.receiverInfo.text}
        </h2>
        <div class="flex flex-col gap-6 pt-5 md:flex-row">
          <div class="flex flex-col gap-4 w-full text-center">
            <div class="flex flex-col gap-2 items-center pt-1 text-on-background">
              {currentReceiver.userSettings &&
              currentReceiver.receiverInfo.id === Receivers.SIMKL ? (
                <ManifestSettings
                  currentReceiver={currentReceiver}
                  updateReceiver$={updateReceiver$}
                />
              ) : currentReceiver.userSettings &&
                currentReceiver.receiverInfo.id === Receivers.ANILIST ? (
                <ManifestSettings
                  currentReceiver={currentReceiver}
                  updateReceiver$={updateReceiver$}
                />
              ) : currentReceiver.userSettings &&
                currentReceiver.receiverInfo.id === Receivers.KITSU ? (
                <ManifestSettings
                  currentReceiver={currentReceiver}
                  updateReceiver$={updateReceiver$}
                />
              ) : currentReceiver.receiverInfo.id === 'simkl' ? (
                <SimklLogin />
              ) : currentReceiver.receiverInfo.id === 'anilist' ? (
                <AnilistLogin />
              ) : currentReceiver.receiverInfo.id === 'kitsu' ? (
                <KitsuLogin />
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);
