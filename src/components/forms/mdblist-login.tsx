import { $, component$, useSignal } from '@builder.io/qwik';
import type { PropFunction } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

import { useForm } from '@modular-forms/qwik';
import type { SubmitHandler } from '@modular-forms/qwik';

import type { KnownNoSerialize } from '~/utils/helpers/qwik-types';
import type { ReceiverClients } from '~/utils/receiver/types/receivers';

export type ApiKeyForm = {
  apikey: string;
};

export interface MdblistLoginProps {
  currentReceiver: KnownNoSerialize<ReceiverClients>;
  updateReceiver$: PropFunction<() => void>;
}

export default component$<MdblistLoginProps>(
  ({ currentReceiver, updateReceiver$ }) => {
    const [, { Form, Field }] = useForm<ApiKeyForm>({
      loader: useSignal({ apikey: '' }),
    });

    const handleSubmit = $<SubmitHandler<ApiKeyForm>>((values) => {
      if (!values.apikey) {
        return;
      }

      currentReceiver.mergeUserConfig({
        auth: {
          apikey: values.apikey,
        },
      });

      // Reload the user config to update the in-memory state
      currentReceiver.getUserConfig();

      // Trigger reactivity in the parent component
      updateReceiver$();
    });

  return (
    <Form onSubmit$={handleSubmit}>
      <div class="flex flex-col gap-4 items-center">
        <p>
          Enter your MDBList API key. You can get your API key from{' '}
          <Link
            href="https://mdblist.com/preferences/"
            class="text-primary"
            target="_blank"
          >
            MDBList Preferences
          </Link>
          .
        </p>
        <Field name="apikey">
          {(field, props) => (
            <input
              {...props}
              type="text"
              value={field.value}
              placeholder="API Key"
              class="py-2.5 px-3 h-10 font-sans text-lg font-normal rounded-lg border transition-all focus:border-2 bg-background/20 text-on-surface outline-solid outline-0"
            />
          )}
        </Field>
        <button
          type="submit"
          class={`inline-flex items-center py-1.5 px-4 text-sm font-medium text-center rounded-full border border-outline bg-primary/30`}
        >
          Submit
        </button>
      </div>
    </Form>
  );
});
