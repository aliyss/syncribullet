import { component$ } from '@builder.io/qwik';
import type { PropFunction } from '@builder.io/qwik';

import ImportSettings from '~/components/forms/import-settings';
import StremioLogin from '~/components/forms/stremio-login';

import type { KnownNoSerialize } from '~/utils/helpers/qwik-types';
import {
  type ImporterClients,
  Importers,
} from '~/utils/importer/types/importers';
import type { ReceiverClients } from '~/utils/receiver/types/receivers';

export interface ImportersSettingsProps {
  currentReceiver: KnownNoSerialize<ReceiverClients>;
  currentImporter: KnownNoSerialize<ImporterClients>;
  saveFromPreAuth$: PropFunction<(importerId: Importers) => void>;
}

export default component$<ImportersSettingsProps>(
  ({ currentImporter, currentReceiver, saveFromPreAuth$ }) => {
    return (
      <div class="p-6 w-full max-w-2xl rounded-xl border shadow-xl border-outline/20 bg-secondary/20 flex flex-col">
        <h2 class="w-full text-xl font-bold text-center md:text-xl">
          {currentImporter.importerInfo.text}
        </h2>
        <div class="flex flex-col gap-6 pt-5 md:flex-row">
          <div class="flex flex-col gap-4 w-full text-center">
            <div class="flex flex-col gap-2 items-center pt-1 text-on-background">
              {currentImporter.userSettings &&
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              currentImporter.importerInfo.id === Importers.STREMIO ? (
                <ImportSettings
                  currentReceiver={currentReceiver}
                  currentImporter={currentImporter}
                />
              ) : // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              currentImporter.importerInfo.id === 'stremio' ? (
                <StremioLogin
                  saveFromPreAuth$={() =>
                    saveFromPreAuth$(currentImporter.importerInfo.id)
                  }
                />
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
