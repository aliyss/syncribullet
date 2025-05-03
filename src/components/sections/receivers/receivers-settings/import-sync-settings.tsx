import {
  $,
  component$,
  noSerialize,
  useSignal,
  useVisibleTask$,
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
    });

    const currentImporter = useSignal<Importers>(Importers.STREMIO);
    const updateImporters = $(() => {
      const configuredImporters = configurableImporters();
      importers.value = {
        [Importers.STREMIO]: noSerialize(
          configuredImporters[Importers.STREMIO],
        ),
      };

      Object.values(importers.value).forEach((importer) => {
        importer?.getUserConfig();
      });
    });

    useVisibleTask$(async () => {
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
