import { $, component$, useSignal } from '@builder.io/qwik';
import type { PropFunction } from '@builder.io/qwik';

import { useForm } from '@modular-forms/qwik';
import type { SubmitHandler } from '@modular-forms/qwik';

import type { KnownNoSerialize } from '~/utils/helpers/qwik-types';
import {
  type ImporterClients,
  type ImporterMCITypes,
  Importers,
} from '~/utils/importer/types/importers';
import {
  type ReceiverClients,
  type ReceiverMCITypes,
  Receivers,
} from '~/utils/receiver/types/receivers';
import type { UserSettingsImportForm } from '~/utils/receiver/types/user-settings/form';

import { Button } from '../buttons/button';
import { ChevronDown } from '../icons/chevron';
import { ImportersSettingsView } from '../sections/importers/importers-settings';
import Subtitle from '../titles/subtitle';

export interface ManifestSettingsProps {
  currentReceiver: KnownNoSerialize<ReceiverClients>;
  currentImporter: KnownNoSerialize<ImporterClients>;
  updateView$: PropFunction<(view: ImportersSettingsView) => void>;
}

export default component$<ManifestSettingsProps>(
  ({ currentReceiver, currentImporter, updateView$ }) => {
    type FormSettings = Pick<
      UserSettingsImportForm<ReceiverMCITypes, ImporterMCITypes>,
      'catalogs'
    >;

    const userConfig = useSignal(currentReceiver.getUserConfig());

    const currentCatalogs = useSignal(
      currentReceiver.getImportCatalogItems(
        currentImporter.importerInfo.id,
        userConfig.value?.importCatalog?.[currentImporter.importerInfo.id] ??
          undefined,
      ),
    );

    const formDefault = useSignal<FormSettings>({
      catalogs: currentReceiver.manifestCatalogItems.map((catalog) => {
        const currentCatalog = currentCatalogs.value.find(
          (x) => x.id === catalog.id,
        );
        const currentCatalogDefaultFilters =
          currentReceiver.getImportCatalogItems(
            currentImporter.importerInfo.id,
          );
        return {
          id: catalog.id,
          name: catalog.name,
          value: currentCatalog ? currentCatalog.value : false,
          filters: {
            moviesStateFlaggedWatched: false,
            moviesStateFlaggedUnwatched: false,
            moviesStateFlaggedDropped: false,
            seriesStateFlaggedWatched: false,
            seriesStateFlaggedUnwatched: false,
            seriesStateFlaggedDropped: false,
            seriesStateFlaggedOnHold: false,
            seriesStateHasWatchCount: null,
            seriesPreferStateFlaggedWatchedOverWatchCount: null,
            seriesUseCinemetaComparison: null,
            seriesBackfillEpisodes: null,
            supportsTypes: [],
            ...currentCatalogDefaultFilters.find((x) => x.id === catalog.id)
              ?.filters,
            ...currentCatalog?.filters,
          },
        };
      }),
    });

    const [, { Form, Field, FieldArray }] = useForm<FormSettings>({
      loader: formDefault,
      fieldArrays: ['catalogs'],
    });

    const handleSubmit = $<SubmitHandler<FormSettings>>((values) => {
      console.log('submit', values.catalogs);
      currentReceiver.mergeUserConfig({
        importCatalog: {
          ...currentReceiver.userSettings?.importCatalog,
          [Importers.STREMIO]:
            currentReceiver.userSettings?.importCatalog?.['stremio'] || [],
          [Importers.SIMKL]:
            currentReceiver.userSettings?.importCatalog?.['simkl'] || [],
          [currentImporter.importerInfo.id]: values.catalogs,
        },
      });
      updateView$(ImportersSettingsView.LOAD_LIBRARY);
    });

    const toggledFilters = useSignal<string[]>([]);

    return (
      <Form onSubmit$={handleSubmit} shouldActive={false} class="w-full">
        <div class="flex flex-col gap-4 w-full">
          <div class="flex flex-col gap-3">
            <Subtitle>Import Settings</Subtitle>
            <div class="w-full text-start flex flex-col gap-2">
              <p class="text-sm text-on-surface">
                Select the catalogs you want to import from your library. You
                can also select the filters you want to apply to each catalog. I
                recommend to keep the default configuration though.
              </p>
              <ul class="text-sm text-on-surface list-disc pl-4">
                <li>
                  <strong class="text-info">
                    Prefer "FlaggedWatched" over "HasWatchCount":
                  </strong>{' '}
                  will mark a Series as completed if the Series has been marked
                  as completed on {currentImporter.importerInfo.text}.
                </li>
                <li>
                  <strong class="text-info">
                    Determine which episodes were marked as watched:
                  </strong>{' '}
                  will use {currentImporter.importerInfo.text} to determine
                  which episodes have been marked as watched. In this case you
                  don't need to edit the season or episode count. If you do edit
                  the item manually, it will assume that all the episodes have
                  been marked as watched before the edited count.
                </li>
                <li>
                  <strong class="text-info">
                    Mark all episodes before the current as watched:
                  </strong>{' '}
                  will skip "Determine which episodes were marked as watched"
                  and mark all episodes before the current as watched.
                </li>
              </ul>
              <div class="w-full text-start flex flex-col gap-2">
                {currentReceiver.receiverInfo.id === Receivers.SIMKL && (
                  <p class="text-sm text-on-surface">
                    <span class="text-info">
                      Note: Simkl has following special internal logics:
                      <ul class="list-disc pl-4 text-on-surface">
                        <li>
                          You can add status: "completed" to mark a show as
                          completed. However, if the show is still airing, it
                          will be added to your "watching" watchlist instead and
                          all aired episodes will be marked as watched.
                        </li>
                      </ul>
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
          <FieldArray name="catalogs">
            {(fieldArray) => (
              <div id={fieldArray.name} class="grid grid-cols-1 w-full gap-4">
                {fieldArray.items.map((item, index) => (
                  <div key={item}>
                    <div class="flex flex-row w-full gap-2 justify-between items-start">
                      <Field name={`catalogs.${index}.value`} type="boolean">
                        {(field, props) => (
                          <div class="flex flex-row gap-2">
                            <div>
                              <input
                                type="checkbox"
                                placeholder="List"
                                class="font-sans text-lg font-normal rounded-lg border transition-all focus:border-2 bg-background/20 text-on-surface outline-solid outline-0"
                                checked={field.value}
                                {...props}
                              />
                            </div>
                            <div class="text-start">
                              <p class="text-sm pt-0.5">
                                {
                                  currentReceiver.manifestCatalogItems[index]
                                    .name
                                }
                              </p>
                              <p class="text-xs">
                                {
                                  currentReceiver.manifestCatalogItems[index]
                                    .type
                                }
                              </p>
                            </div>
                          </div>
                        )}
                      </Field>
                      <button
                        type="button"
                        class="p-2"
                        onClick$={() => {
                          if (
                            toggledFilters.value.includes('catalogs.' + index)
                          ) {
                            toggledFilters.value = toggledFilters.value.filter(
                              (x) => x !== 'catalogs.' + index,
                            );
                          } else {
                            toggledFilters.value = [
                              ...toggledFilters.value,
                              'catalogs.' + index,
                            ];
                          }
                        }}
                      >
                        <ChevronDown
                          class={`${
                            toggledFilters.value.includes('catalogs.' + index)
                              ? 'rotate-180'
                              : ''
                          } transition-all duration-200`}
                        />
                      </button>
                    </div>
                    {toggledFilters.value.includes('catalogs.' + index) && (
                      <div class="flex flex-col gap-2 pl-6 pt-4 text-sm">
                        <div class="flex flex-col gap-2">
                          <Field
                            name={`catalogs.${index}.filters.moviesStateFlaggedWatched`}
                            type="boolean"
                          >
                            {(field, props) => {
                              if (field.value === null) {
                                return <></>;
                              }
                              return (
                                <div class="flex flex-row gap-2 items-center">
                                  <input
                                    type="checkbox"
                                    placeholder="List"
                                    class="font-sans text-lg font-normal rounded-lg border transition-all focus:border-2 bg-background/20 text-on-surface outline-solid outline-0"
                                    checked={field.value}
                                    {...props}
                                  />
                                  <div class="flex flex-row gap-2">
                                    Movies: Was marked as "FlaggedWatched"
                                  </div>
                                </div>
                              );
                            }}
                          </Field>
                          <Field
                            name={`catalogs.${index}.filters.moviesStateFlaggedUnwatched`}
                            type="boolean"
                          >
                            {(field, props) => {
                              if (field.value === null) {
                                return <></>;
                              }
                              return (
                                <div class="flex flex-row gap-2 items-center">
                                  <input
                                    type="checkbox"
                                    placeholder="List"
                                    class="font-sans text-lg font-normal rounded-lg border transition-all focus:border-2 bg-background/20 text-on-surface outline-solid outline-0"
                                    checked={field.value}
                                    {...props}
                                  />
                                  <div class="flex flex-row gap-2">
                                    Movies: Was marked as "FlaggedUnwatched"
                                  </div>
                                </div>
                              );
                            }}
                          </Field>
                        </div>
                        <div class="flex flex-col gap-2">
                          <Field
                            name={`catalogs.${index}.filters.seriesStateFlaggedWatched`}
                            type="boolean"
                          >
                            {(field, props) => {
                              if (field.value === null) {
                                return <></>;
                              }
                              return (
                                <div class="flex flex-row gap-2 items-center">
                                  <input
                                    type="checkbox"
                                    placeholder="List"
                                    class="font-sans text-lg font-normal rounded-lg border transition-all focus:border-2 bg-background/20 text-on-surface outline-solid outline-0"
                                    checked={field.value}
                                    {...props}
                                  />
                                  <div class="flex flex-row gap-2">
                                    Series: Was marked as "FlaggedWatched"
                                  </div>
                                </div>
                              );
                            }}
                          </Field>
                          <Field
                            name={`catalogs.${index}.filters.seriesStateFlaggedUnwatched`}
                            type="boolean"
                          >
                            {(field, props) => {
                              if (field.value === null) {
                                return <></>;
                              }
                              return (
                                <div class="flex flex-row gap-2 items-center">
                                  <input
                                    type="checkbox"
                                    placeholder="List"
                                    class="font-sans text-lg font-normal rounded-lg border transition-all focus:border-2 bg-background/20 text-on-surface outline-solid outline-0"
                                    checked={field.value}
                                    {...props}
                                  />
                                  <div class="flex flex-row gap-2">
                                    Series: Was marked as "FlaggedUnwatched"
                                  </div>
                                </div>
                              );
                            }}
                          </Field>
                          <Field
                            name={`catalogs.${index}.filters.seriesStateHasWatchCount`}
                            type="boolean"
                          >
                            {(field, props) => {
                              if (
                                field.value === null ||
                                field.value === undefined
                              ) {
                                return <></>;
                              }
                              return (
                                <div class="flex flex-row gap-2 items-center">
                                  <input
                                    type="checkbox"
                                    placeholder="List"
                                    class="font-sans text-lg font-normal rounded-lg border transition-all focus:border-2 bg-background/20 text-on-surface outline-solid outline-0"
                                    checked={field.value}
                                    {...props}
                                  />
                                  <div class="flex flex-row gap-2">
                                    Series: Was marked as "HasWatchCount"
                                  </div>
                                </div>
                              );
                            }}
                          </Field>
                          <Field
                            name={`catalogs.${index}.filters.seriesPreferStateFlaggedWatchedOverWatchCount`}
                            type="boolean"
                          >
                            {(field, props) => {
                              if (
                                field.value === null ||
                                field.value === undefined
                              ) {
                                return <></>;
                              }
                              return (
                                <div class="flex flex-row gap-2 items-center">
                                  <input
                                    type="checkbox"
                                    placeholder="List"
                                    class="font-sans text-lg font-normal rounded-lg border transition-all focus:border-2 bg-background/20 text-on-surface outline-solid outline-0"
                                    checked={field.value}
                                    {...props}
                                  />
                                  <div class="flex flex-row gap-2">
                                    Series: Prefer "FlaggedWatched" over
                                    "HasWatchCount"
                                  </div>
                                </div>
                              );
                            }}
                          </Field>
                          <Field
                            name={`catalogs.${index}.filters.seriesUseCinemetaComparison`}
                            type="boolean"
                          >
                            {(field, props) => {
                              if (
                                field.value === null ||
                                field.value === undefined
                              ) {
                                return <></>;
                              }
                              return (
                                <div class="flex flex-row gap-2 items-center">
                                  <input
                                    type="checkbox"
                                    placeholder="List"
                                    class="font-sans text-lg font-normal rounded-lg border transition-all focus:border-2 bg-background/20 text-on-surface outline-solid outline-0"
                                    checked={field.value}
                                    {...props}
                                  />
                                  <div class="flex flex-row gap-2">
                                    Series: Determine which episodes were marked
                                    as watched
                                  </div>
                                </div>
                              );
                            }}
                          </Field>
                          <Field
                            name={`catalogs.${index}.filters.seriesBackfillEpisodes`}
                            type="boolean"
                          >
                            {(field, props) => {
                              if (field.value === null) {
                                return <></>;
                              }
                              return (
                                <div class="flex flex-row gap-2 text-start items-center">
                                  <input
                                    type="checkbox"
                                    placeholder="List"
                                    class="font-sans text-lg font-normal rounded-lg border transition-all focus:border-2 bg-background/20 text-on-surface outline-solid outline-0"
                                    checked={field.value}
                                    {...props}
                                  />
                                  <div class="flex flex-row gap-2 text-start">
                                    Series: Mark all episodes before the current
                                    as watched
                                  </div>
                                </div>
                              );
                            }}
                          </Field>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </FieldArray>
          <div class="flex flex-row gap-2">
            <Button
              type="submit"
              class={`inline-flex items-center py-1.5 px-4 text-sm font-medium text-center rounded-full border border-outline text-on-primary`}
              backgroundColour="bg-primary"
              borderColour="border-primary"
            >
              Load Library Items
            </Button>
          </div>
        </div>
      </Form>
    );
  },
);
