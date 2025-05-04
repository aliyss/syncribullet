import { component$ } from '@builder.io/qwik';
import type { PropFunction } from '@builder.io/qwik';

import type { KnownNoSerialize } from '~/utils/helpers/qwik-types';
import type { ImporterClients } from '~/utils/importer/types/importers';
import type { ReceiverClients } from '~/utils/receiver/types/receivers';

import type { ImportersSettingsView } from './importers-settings';

export interface ManifestSettingsProps<
  R extends KnownNoSerialize<ReceiverClients>,
  T extends KnownNoSerialize<ImporterClients>,
> {
  currentReceiver: R;
  currentImporter: T;
  importedCatalogs: Awaited<ReturnType<T['loadLibraryDiff']>>;
  receiverCatalogItems: Awaited<
    ReturnType<NonNullable<R['importer']>['loadLibraryDiff']>
  >;
  libraryDiff: Awaited<ReturnType<T['filterLibraryUncalculatedDiff']>>;
  updateView$: PropFunction<(view: ImportersSettingsView) => void>;
}

export default component$(
  <
    R extends KnownNoSerialize<ReceiverClients>,
    T extends KnownNoSerialize<ImporterClients>,
  >({
    libraryDiff,
    importedCatalogs,
  }: ManifestSettingsProps<R, T>) => {
    return (
      <div class="flex flex-col gap-2 items-center pt-1 text-on-background">
        <div>
          {libraryDiff.length}
          <br />
          {importedCatalogs.length}
        </div>
        {libraryDiff.map((catalog) => {
          return catalog.info.name;
        })}
      </div>
    );
  },
);
