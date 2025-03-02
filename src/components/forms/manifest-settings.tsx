import { $, component$, useSignal } from '@builder.io/qwik';
import type { PropFunction } from '@builder.io/qwik';

import { useForm } from '@modular-forms/qwik';
import type { SubmitHandler } from '@modular-forms/qwik';

import type { KnownNoSerialize } from '~/utils/helpers/qwik-types';
import type {
  ReceiverClients,
  ReceiverMCITypes,
} from '~/utils/receiver/types/receivers';
import type { UserSettingsForm } from '~/utils/receiver/types/user-settings/form';

import { Button } from '../buttons/button';
import Tab from '../tabs/tab';
import Subtitle from '../titles/subtitle';

export interface ManifestSettingsProps {
  currentReceiver: KnownNoSerialize<ReceiverClients>;
  updateReceiver$: PropFunction<() => void>;
}

type ManifestSettingsTab = 'Catalogs' | 'Live Sync' | 'Credentials';

export default component$<ManifestSettingsProps>(
  ({ currentReceiver, updateReceiver$ }) => {
    type FormSettings = UserSettingsForm<ReceiverMCITypes>;

    const userConfig = useSignal(currentReceiver.getUserConfig());

    const currentCatalogs = useSignal(
      currentReceiver.getManifestCatalogItems(
        userConfig.value?.catalogs?.map((catalog) => catalog.id),
      ),
    );

    const currentLiveSyncTypes = useSignal(
      currentReceiver.getLiveSyncTypes(userConfig.value?.liveSync),
    );

    const formDefault = useSignal<FormSettings>({
      catalogs: currentReceiver.manifestCatalogItems.map((catalog) => ({
        id: catalog.id,
        name: catalog.name,
        value: currentCatalogs.value.includes(catalog),
      })),
      liveSync: currentReceiver.liveSyncTypes.map((liveSync) => ({
        id: liveSync,
        value: currentLiveSyncTypes.value.includes(liveSync),
      })),
    });

    const [, { Form, Field, FieldArray }] = useForm<FormSettings>({
      loader: formDefault,
      fieldArrays: ['catalogs', 'liveSync'],
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

      const liveSyncValues =
        JSON.stringify(
          values.liveSync
            .filter((catalog) => catalog.value)
            .map((catalog) => catalog.id)
            .sort((a, b) => a.localeCompare(b)),
        ) !==
        JSON.stringify(
          [...currentReceiver.liveSyncTypes].sort((a, b) => a.localeCompare(b)),
        )
          ? currentReceiver.getLiveSyncTypes(
              values.liveSync
                .filter((liveSync) => liveSync.value)
                .map((liveSync) => liveSync.id),
            )
          : undefined;

      currentReceiver.mergeUserConfig({
        catalogs: catalogValues,
        liveSync: liveSyncValues,
      });
      updateReceiver$();
    });

    const activeTab = useSignal<ManifestSettingsTab>('Catalogs');

    return (
      <Form onSubmit$={handleSubmit} shouldActive={false} class="w-full">
        <div class="flex flex-col gap-4 w-full">
          <div class="flex">
            <Subtitle>Settings</Subtitle>
          </div>
          <Tab
            activeTab={activeTab.value.toString()}
            tabs={['Catalogs', 'Live Sync', 'Credentials']}
            onTabChange$={(tab) => {
              activeTab.value = tab as ManifestSettingsTab;
            }}
          >
            <div class={`${activeTab.value !== 'Catalogs' && 'hidden'}`}>
              <FieldArray name="catalogs">
                {(fieldArray) => (
                  <div
                    id={fieldArray.name}
                    class="grid grid-cols-1 w-full gap-4"
                  >
                    {fieldArray.items.map((item, index) => (
                      <div key={item}>
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
                      </div>
                    ))}
                  </div>
                )}
              </FieldArray>
            </div>
            <div class={`${activeTab.value !== 'Live Sync' && 'hidden'}`}>
              <FieldArray name="liveSync">
                {(fieldArray) => (
                  <div
                    id={fieldArray.name}
                    class="grid grid-cols-1 w-full gap-4"
                  >
                    {fieldArray.items.map((item, index) => (
                      <div key={item}>
                        <Field name={`liveSync.${index}.value`} type="boolean">
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
                                <p>{currentReceiver.liveSyncTypes[index]}</p>
                              </div>
                            </div>
                          )}
                        </Field>
                      </div>
                    ))}
                  </div>
                )}
              </FieldArray>
            </div>
            <div class={`${activeTab.value !== 'Credentials' && 'hidden'}`}>
              <div class="flex flex-col gap-2">
                <p class="text-error text-start">
                  This will clear all credentials and remove all the settings
                  associated with {currentReceiver.receiverInfo.text}. Resetting
                  to the default settings.
                </p>
                <div class="flex">
                  <Button
                    type="button"
                    borderColour="border-error"
                    backgroundColour="bg-error"
                    onClick$={async () => {
                      currentReceiver.removeUserConfig();
                      updateReceiver$();
                    }}
                  >
                    Remove Credentials
                  </Button>
                </div>
              </div>
            </div>
          </Tab>
          <div class="flex flex-row gap-2">
            <button
              type="submit"
              class={`inline-flex items-center py-1.5 px-4 text-sm font-medium text-center rounded-full border border-outline bg-primary/30`}
            >
              Save Settings
            </button>
          </div>
        </div>
      </Form>
    );
  },
);
