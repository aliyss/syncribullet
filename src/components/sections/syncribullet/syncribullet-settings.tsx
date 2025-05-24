import { component$ } from '@builder.io/qwik';
import type { PropFunction } from '@builder.io/qwik';

import SyncribulletSettingsForm from '~/components/forms/syncribullet-settings-form';

import type { GeneralSettings } from '~/utils/settings/general';

export interface SyncriBulletSettingsProps {
  currentSyncriBulletSettings: GeneralSettings;
  updateSyncriBulletSettings$: PropFunction<
    (syncriBulletSettings: GeneralSettings) => void
  >;
}

export default component$<SyncriBulletSettingsProps>(
  ({ currentSyncriBulletSettings, updateSyncriBulletSettings$ }) => {
    return (
      <div class="p-6 w-full max-w-2xl rounded-xl border shadow-xl border-outline/20 bg-secondary/20 flex flex-col">
        <h2 class="w-full text-xl font-bold text-center md:text-3xl text-on-background">
          SyncriBullet
        </h2>
        <div class="flex flex-col gap-6 pt-5 md:flex-row">
          <div class="flex flex-col gap-4 w-full text-center">
            <div class="flex flex-col gap-2 items-center pt-1 text-on-background">
              <SyncribulletSettingsForm
                currentSettings={currentSyncriBulletSettings}
                updateSettings$={updateSyncriBulletSettings$}
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
);
