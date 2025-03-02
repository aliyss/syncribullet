import { $, component$, useSignal } from '@builder.io/qwik';
import type { PropFunction } from '@builder.io/qwik';

import { insert, useForm } from '@modular-forms/qwik';
import type { SubmitHandler } from '@modular-forms/qwik';

import type {
  GeneralFormSettings,
  GeneralSettings,
} from '~/utils/settings/general';

import Tab from '../tabs/tab';
import Subtitle from '../titles/subtitle';

export interface SyncriBulletSettingsProps {
  currentSettings: GeneralSettings;
  updateSettings$: PropFunction<(settings: GeneralSettings) => void>;
}

type SyncriBulletSettingsTab = 'External Playback';

export default component$<SyncriBulletSettingsProps>(
  ({ currentSettings, updateSettings$ }) => {
    type FormSettings = GeneralFormSettings;

    const formDefault = useSignal<FormSettings>({
      externalStreamAddons: currentSettings.externalStreamAddons || [],
    });

    const [formStore, { Form, Field, FieldArray }] = useForm<FormSettings>({
      loader: formDefault,
      fieldArrays: ['externalStreamAddons'],
    });

    const handleSubmit = $<SubmitHandler<FormSettings>>((values) => {
      const newValues: GeneralSettings = {};
      values.externalStreamAddons = values.externalStreamAddons
        ?.filter(
          (v, i, a) =>
            a.findIndex((t) => t.url === v.url) === i && v.url.trim(),
        )
        .map((v) => ({ url: v.url.trim() }));
      if (values.externalStreamAddons && values.externalStreamAddons.length) {
        newValues.externalStreamAddons = values.externalStreamAddons;
      }
      updateSettings$(newValues);
    });

    const activeTab = useSignal<SyncriBulletSettingsTab>('External Playback');

    return (
      <Form onSubmit$={handleSubmit} shouldActive={false} class="w-full">
        <div class="flex flex-col gap-4 w-full">
          <div class="flex">
            <Subtitle>Settings</Subtitle>
          </div>
          <Tab
            activeTab={activeTab.value.toString()}
            tabs={['External Playback']}
            overflow={false}
            onTabChange$={(tab) => {
              activeTab.value = tab as SyncriBulletSettingsTab;
            }}
          >
            <div
              class={`${activeTab.value !== 'External Playback' && 'hidden'}`}
            >
              <p class="text-error text-start pb-3">
                Use this responsibly. Add the <strong>manifest URL</strong> of
                the addon providing the external playback streams, then remove
                it if possible from stremio to minimize the load on the addon
                server.
              </p>
              <div class="w-full items-start justify-start flex pb-3">
                <button
                  type="button"
                  class={`inline-flex items-center py-1.5 px-4 text-sm font-medium text-center rounded-md border border-outline bg-secondary/30`}
                  onClick$={() => {
                    insert(formStore, 'externalStreamAddons', {
                      at: 0,
                      value: {
                        url: '',
                      },
                    });
                  }}
                >
                  + Add Manifest URL
                </button>
              </div>
              <FieldArray name="externalStreamAddons">
                {(fieldArray) => (
                  <div
                    id={fieldArray.name}
                    class="flex flex-col w-full gap-4 overflow-scroll h-80"
                  >
                    {fieldArray.items.map((item, index) => (
                      <Field
                        name={`externalStreamAddons.${index}.url`}
                        type="string"
                        key={item}
                      >
                        {(field, props) => (
                          <input
                            placeholder="Manifest URL"
                            class="font-sans text-lg font-normal rounded-lg border transition-all focus:border-2 bg-background/20 text-on-surface outline outline-0 px-1.5 w-full h-[30px]"
                            value={field.value}
                            {...props}
                          />
                        )}
                      </Field>
                    ))}
                  </div>
                )}
              </FieldArray>
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
