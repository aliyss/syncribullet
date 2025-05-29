import { component$, useSignal } from '@builder.io/qwik';
import type { PropFunction } from '@builder.io/qwik';

import ImportSettings from '~/components/forms/import-settings';
import StremioLogin from '~/components/forms/stremio-login';

import type { KnownNoSerialize } from '~/utils/helpers/qwik-types';
import {
  type ImporterClients,
  Importers,
} from '~/utils/importer/types/importers';
import type { ReceiverClients } from '~/utils/receiver/types/receivers';

import ImportersLoadLibrary from './importers-load-library';

export interface ImportersSettingsProps {
  currentReceiver: KnownNoSerialize<ReceiverClients>;
  currentImporter: KnownNoSerialize<ImporterClients>;
  saveFromPreAuth$: PropFunction<(importerId: Importers) => void>;
}

export enum ImportersSettingsView {
  SETTINGS = 'settings',
  LOAD_LIBRARY = 'load-library',
}

export default component$<ImportersSettingsProps>(
  ({ currentImporter, currentReceiver, saveFromPreAuth$ }) => {
    const view = useSignal<ImportersSettingsView>(
      ImportersSettingsView.SETTINGS,
    );

    const importerLibrary = useSignal<
      Awaited<ReturnType<(typeof currentImporter)['loadLibraryDiff']>>
    >([]);
    const receiverLibrary = useSignal<
      | Awaited<
          ReturnType<
            NonNullable<(typeof currentReceiver)['importer']>['loadLibraryDiff']
          >
        >
      | undefined
    >(undefined);
    const libraryDiff = useSignal<
      Awaited<
        ReturnType<NonNullable<(typeof currentImporter)['sortLibraryDiff']>>
      >
    >([]);

    return (
      <div class="p-6 w-full max-w-2xl rounded-xl border shadow-xl border-outline/20 bg-secondary-container flex flex-col">
        <h2 class="w-full text-xl font-bold text-center md:text-xl">
          From {currentImporter.importerInfo.text} to{' '}
          {currentReceiver.receiverInfo.text}
        </h2>
        <div class="flex flex-col gap-6 pt-5 md:flex-row">
          <div class="flex flex-col gap-4 w-full text-center">
            <div class="flex flex-col gap-2 items-center pt-1 text-on-background">
              {currentImporter.userSettings &&
              view.value === ImportersSettingsView.SETTINGS &&
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              currentImporter.importerInfo.id === Importers.STREMIO ? (
                <ImportSettings
                  currentReceiver={currentReceiver}
                  currentImporter={currentImporter}
                  updateView$={async () => {
                    const userConfig = currentReceiver.getUserConfig();
                    if (!userConfig || !userConfig.importCatalog) {
                      view.value = ImportersSettingsView.LOAD_LIBRARY;
                      return;
                    }
                    if (!currentReceiver.importer) {
                      view.value = ImportersSettingsView.LOAD_LIBRARY;
                      return;
                    }

                    importerLibrary.value =
                      await currentImporter.loadLibraryDiff(
                        userConfig.lastImportSync?.[
                          currentImporter.importerInfo.id
                        ]?.lastImport,
                      );

                    if (!importerLibrary.value.length) {
                      alert('No items left in the library to import.');
                      return;
                    }

                    receiverLibrary.value =
                      await currentReceiver.importer.loadLibraryDiff(
                        new Date(
                          Math.min(
                            ...importerLibrary.value.map((obj) =>
                              obj.metadata.modified.getTime(),
                            ),
                          ),
                        ).toISOString(),
                      );

                    libraryDiff.value = await currentImporter.sortLibraryDiff(
                      await currentImporter.filterLibraryUncalculatedDiff(
                        importerLibrary.value,
                        receiverLibrary.value,
                      ),
                      userConfig.importCatalog[currentImporter.importerInfo.id],
                      currentReceiver,
                    );

                    view.value = ImportersSettingsView.LOAD_LIBRARY;
                  }}
                />
              ) : currentImporter.userSettings &&
                view.value === ImportersSettingsView.LOAD_LIBRARY &&
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                currentImporter.importerInfo.id === Importers.STREMIO ? (
                <>
                  {receiverLibrary.value ? (
                    <ImportersLoadLibrary
                      currentReceiver={currentReceiver}
                      currentImporter={currentImporter}
                      importedCatalogs={importerLibrary.value}
                      receiverCatalogItems={receiverLibrary.value}
                      libraryDiff={libraryDiff.value}
                      updateView$={(newView: ImportersSettingsView) => {
                        view.value = newView;
                        libraryDiff.value = [];
                        importerLibrary.value = [];
                        receiverLibrary.value = undefined;
                      }}
                    />
                  ) : (
                    <div class="flex flex-col gap-2 items-center pt-1 text-on-background">
                      <p class="text-sm pt-0.5">
                        Not a valid Receiver for this Importer.
                      </p>
                      <p class="text-xs">
                        This should not happen. Please report this.
                      </p>
                    </div>
                  )}
                </>
              ) : // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              currentImporter.importerInfo.id === Importers.STREMIO ? (
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
