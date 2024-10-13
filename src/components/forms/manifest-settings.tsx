import { $, Slot, component$, useSignal } from '@builder.io/qwik';

import { useForm } from '@modular-forms/qwik';
import type { SubmitHandler } from '@modular-forms/qwik';
import type {
  IManifestSettings,
  ManifestSettingsForm,
  ManifestSettingsInfo,
} from '~/routes';

export interface ManifestSettingsProps {
  data: IManifestSettings;
  info: ManifestSettingsInfo;
  id: string;
}

export default component$<ManifestSettingsProps>(({ data, id }) => {
  const formDefault = useSignal(data);
  const [, { Form, Field, FieldArray }] = useForm<ManifestSettingsForm>({
    loader: formDefault,
    fieldArrays: ['catalogs'],
  });

  const handleSubmit = $<SubmitHandler<ManifestSettingsForm>>((values) => {
    localStorage.setItem(`${id}-settings`, JSON.stringify(values));
  });

  return (
    <Form onSubmit$={handleSubmit} shouldActive={false}>
      <div class="flex flex-col gap-4 items-center">
        <p>Settings</p>
        <FieldArray name="catalogs">
          {(fieldArray) => (
            <div id={fieldArray.name} class="grid grid-cols-2 w-full gap-4">
              {fieldArray.items.map((item, index) => (
                <div key={item}>
                  <Field name={`catalogs.${index}.value`} type="boolean">
                    {(field, props) => (
                      <div class="flex flex-row items-center gap-2">
                        <input
                          type="checkbox"
                          placeholder="List"
                          class="py-2.5 px-3 h-10 font-sans text-lg font-normal rounded-lg border transition-all focus:border-2 bg-background/20 text-on-surface outline outline-0"
                          checked={field.value}
                          {...props}
                        />
                        {data.catalogs[index].name}
                      </div>
                    )}
                  </Field>
                </div>
              ))}
            </div>
          )}
        </FieldArray>
        <div class="flex flex-row gap-2">
          <button
            type="submit"
            class={`inline-flex items-center py-1.5 px-4 text-sm font-medium text-center rounded-full border border-outline bg-primary/30`}
          >
            Save Settings
          </button>
          <Slot />
        </div>
      </div>
    </Form>
  );
});
