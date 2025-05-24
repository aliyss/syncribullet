import { $, component$, useSignal } from '@builder.io/qwik';
import { Link, useNavigate } from '@builder.io/qwik-city';

import { useForm } from '@modular-forms/qwik';
import type { SubmitHandler } from '@modular-forms/qwik';

import { TVTimeClientReceiver } from '~/utils/receivers/tvtime/recevier-client';

export type ApiClientForm = {
  grant_type: string;
  username: string;
  password: string;
};

export default component$(() => {
  const nav = useNavigate();

  const [, { Form, Field }] = useForm<ApiClientForm>({
    loader: useSignal({ grant_type: 'password', username: '', password: '' }),
  });

  const handleSubmit = $<SubmitHandler<ApiClientForm>>(async (values) => {
    if (!values.username || !values.password) {
      return;
    }
    let data = null;
    try {
      const preResponse = await fetch(
        'https://app.tvtime.com/sidecar?o=https%3A%2F%2Fapi2.tozelabs.com%2Fv2%2Fuser&lang=en',
        {
          credentials: 'omit',
          headers: {
            Accept: '*/*',
            'Accept-Language': 'en-US',
            'user-lang-setting': 'en',
            locale: 'en',
            'country-code': 'us',
            Pragma: 'no-cache',
            'Cache-Control': 'no-cache',
          },
          referrer: 'https://app.tvtime.com/',
          method: 'POST',
          mode: 'cors',
        },
      );
      const preData = await preResponse.json();

      const response = await fetch(
        `https://app.tvtime.com/sidecar?o=https://auth.tvtime.com/v1/login`,
        {
          method: 'POST',
          body: JSON.stringify({
            username: values.username,
            password: values.password,
          }),
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${preData.jwt_token}`,
          },
        },
      );
      data = await response.json();
    } catch (e) {
      console.error(e);
    }

    if (!data) {
      return;
    }

    const tvtimeReceiver = new TVTimeClientReceiver();
    tvtimeReceiver.mergeUserConfig({
      auth: {
        id: data.data.id,
        access_token: data.data.jwt_token,
        rt: data.data.jwt_refresh_token,
      },
    });

    await nav(`/oauth/tvtime/`);
  });

  return (
    <Form onSubmit$={handleSubmit}>
      <div class="flex flex-col gap-4 items-center">
        <p>
          Client Credentials are not yet supported for TV Time. You will need to
          login using email and password. Credentials are directly sent to TV
          Time API and not processed by the server. See{' '}
          <Link
            href="https://github.com/aliyss/syncribullet/blob/master/src/components/forms/tvtime-login.tsx#L28"
            class="text-primary"
            target="_blank"
          >
            this file
          </Link>{' '}
          for more information.
        </p>
        <Field name="username">
          {(field, props) => (
            <input
              {...props}
              type="text"
              value={field.value}
              placeholder="Email"
              class="py-2.5 px-3 h-10 font-sans text-lg font-normal rounded-lg border transition-all focus:border-2 bg-background/20 text-on-surface outline-solid outline-0"
            />
          )}
        </Field>
        <Field name="password">
          {(field, props) => (
            <input
              {...props}
              type="password"
              value={field.value}
              placeholder="Password"
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
