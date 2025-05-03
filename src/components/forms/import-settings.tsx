import { $, component$, useSignal } from '@builder.io/qwik';

import { useForm } from '@modular-forms/qwik';
import type { SubmitHandler } from '@modular-forms/qwik';

import type { KnownNoSerialize } from '~/utils/helpers/qwik-types';
import type {
  ImporterClients,
  ImporterMCITypes,
} from '~/utils/importer/types/importers';
import type {
  ReceiverClients,
  ReceiverMCITypes,
} from '~/utils/receiver/types/receivers';
import type { UserSettingsImportForm } from '~/utils/receiver/types/user-settings/form';

import { Button } from '../buttons/button';
import { ChevronDown } from '../icons/chevron';
import Subtitle from '../titles/subtitle';

export interface ManifestSettingsProps {
  currentReceiver: KnownNoSerialize<ReceiverClients>;
  currentImporter: KnownNoSerialize<ImporterClients>;
}

export default component$<ManifestSettingsProps>(
  ({ currentReceiver, currentImporter }) => {
    type FormSettings = Pick<
      UserSettingsImportForm<ReceiverMCITypes, ImporterMCITypes>,
      'catalogs'
    >;

    // const userConfig = useSignal(currentReceiver.getUserConfig());

    const currentCatalogs = useSignal(
      currentReceiver.getImportCatalogItems(currentImporter.importerInfo.id),
    );

    const formDefault = useSignal<FormSettings>({
      catalogs: currentReceiver.manifestCatalogItems.map((catalog) => {
        const currentCatalog = currentCatalogs.value.find(
          (x) => x.id === catalog.id,
        );
        return {
          id: catalog.id,
          name: catalog.name,
          value: currentCatalog ? true : false,
          filters: currentCatalog?.filters ?? {
            stateFlaggedWatched: false,
          },
        };
      }),
    });

    const [, { Form, Field, FieldArray }] = useForm<FormSettings>({
      loader: formDefault,
      fieldArrays: ['catalogs'],
    });

    const handleSubmit = $<SubmitHandler<FormSettings>>((values) => {
      const catalogValues =
        JSON.stringify(
          values.catalogs
            .filter((catalog) => catalog.value)
            .map((catalog) => catalog.id)
            .sort((a, b) => a.localeCompare(b)),
        ) !==
        JSON.stringify(
          [...currentReceiver.defaultCatalogs].sort((a, b) =>
            a.localeCompare(b),
          ),
        )
          ? currentReceiver.getManifestCatalogItems(
              values.catalogs
                .filter((catalog) => catalog.value)
                .map((catalog) => catalog.id),
            )
          : undefined;

      console.log('Catalogs', catalogValues);
    });

    const toggledFilters = useSignal<string[]>([]);

    return (
      <Form onSubmit$={handleSubmit} shouldActive={false} class="w-full">
        <div class="flex flex-col gap-4 w-full">
          <div class="flex">
            <Subtitle>Import Settings</Subtitle>
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
                                class="font-sans text-lg font-normal rounded-lg border transition-all focus:border-2 bg-background/20 text-on-surface outline outline-0"
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
                        <Field
                          name={`catalogs.${index}.filters.stateFlaggedWatched`}
                          type="boolean"
                        >
                          {(field, props) => (
                            <div class="flex flex-row gap-2">
                              <input
                                type="checkbox"
                                placeholder="List"
                                class="font-sans text-lg font-normal rounded-lg border transition-all focus:border-2 bg-background/20 text-on-surface outline outline-0"
                                checked={field.value}
                                {...props}
                              />
                              <div class="flex flex-row gap-2">
                                Was marked as "FlaggedWatched"
                              </div>
                            </div>
                          )}
                        </Field>
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
              class={`inline-flex items-center py-1.5 px-4 text-sm font-medium text-center rounded-full border border-outline`}
              backgroundColour="bg-primary"
              borderColour="border-primary"
            >
              Start Import
            </Button>
          </div>
        </div>
      </Form>
    );
  },
);
