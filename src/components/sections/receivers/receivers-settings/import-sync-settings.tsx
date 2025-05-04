import {
  $,
  component$,
  noSerialize,
  useSignal,
  useTask$,
} from '@builder.io/qwik';
import type { NoSerialize } from '@builder.io/qwik';

import { configurableImporters } from '~/utils/connections/importers';

import { preauthString } from '~/utils/auth/preauth';
import type { KnownNoSerialize } from '~/utils/helpers/qwik-types';
import { Importers } from '~/utils/importer/types/importers';
import type { ImporterClients } from '~/utils/importer/types/importers';
import type { ReceiverClients } from '~/utils/receiver/types/receivers';

import ImportersSettings from '../../importers/importers-settings';

export interface ReceiversImportSyncSettingsProps {
  currentReceiver: KnownNoSerialize<ReceiverClients>;
}
export default component$<ReceiversImportSyncSettingsProps>(
  ({ currentReceiver }) => {
    const importers = useSignal<{
      [key in Importers]: NoSerialize<ImporterClients>;
    }>({
      [Importers.STREMIO]: undefined,
      [Importers.SIMKL]: undefined,
    });

    const currentImporter = useSignal<Importers>(Importers.STREMIO);
    const updateImporters = $(() => {
      const configuredImporters = configurableImporters();
      importers.value = {
        [Importers.STREMIO]: noSerialize(
          configuredImporters[Importers.STREMIO],
        ),
        [Importers.SIMKL]: noSerialize(configuredImporters[Importers.SIMKL]),
      };

      Object.values(importers.value).forEach((importer) => {
        importer?.getUserConfig();
        if (
          currentReceiver.receiverInfo.id.toString() ===
          importer?.importerInfo.id.toString()
        ) {
          currentReceiver.importer = importer;
        }
      });
    });

    useTask$(() => {
      updateImporters();
    });

    const saveFromPreAuth = $((importerId: Importers) => {
      const preAuth = preauthString(importerId);
      const preAuthStringData = localStorage.getItem(preAuth);
      if (preAuth) {
        const preAuthData = JSON.parse(preAuthStringData || '{}');
        if (preAuthData && preAuthData.authKey) {
          importers.value[importerId]?.setUserConfig({
            auth: preAuthData,
          });
          localStorage.removeItem(preAuth);
          updateImporters();
        }
      }
    });

    if (!currentReceiver.receiverInfo.importSync) {
      return (
        <div class="p-6 w-full max-w-2xl rounded-xl border shadow-xl border-outline/20 bg-secondary/20 flex flex-col">
          <h2 class="w-full text-xl font-bold text-center md:text-xl">
            {currentReceiver.receiverInfo.text}
          </h2>
          <div class="flex flex-col gap-6 pt-5 md:flex-row">
            <div class="flex flex-col gap-4 w-full text-center">
              <div class="flex flex-col gap-2 items-center pt-1 text-on-background">
                <p>Import Sync is not available for this receiver.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        {importers.value[currentImporter.value] && (
          <ImportersSettings
            currentReceiver={currentReceiver}
            currentImporter={importers.value[currentImporter.value]!}
            saveFromPreAuth$={(id) => {
              saveFromPreAuth(id);
            }}
          />
        )}
      </div>
    );
  },
);
