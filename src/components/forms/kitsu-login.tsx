import { $, component$, useSignal } from '@builder.io/qwik';
import { Link, useNavigate } from '@builder.io/qwik-city';

import { useForm } from '@modular-forms/qwik';
import type { SubmitHandler } from '@modular-forms/qwik';

import { KitsuClientReceiver } from '~/utils/receivers/kitsu/recevier-client';

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
      const response = await fetch(`https://kitsu.app/api/oauth/token`, {
        method: 'POST',
        body: JSON.stringify({
          grant_type: 'password',
          username: values.username,
          password: values.password,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      data = await response.json();
    } catch (e) {
      console.error(e);
    }

    if (!data) {
      return;
    }

    const kitsuReceiver = new KitsuClientReceiver();
    kitsuReceiver.mergeUserConfig({
      auth: {
        access_token: data.access_token,
        rt: data.refresh_token,
        e: data.expires_in,
        t: data.token_type,
      },
    });

    await nav(`/oauth/kitsu/`);
  });

  return (
    <Form onSubmit$={handleSubmit}>
      <div class="flex flex-col gap-4 items-center">
        <p>
          Client Credentials are{' '}
          <Link
            href="https://kitsu.docs.apiary.io/#introduction/authentication/grant-types"
            class="text-primary"
            target="_blank"
          >
            not yet supported
          </Link>{' '}
          for Kitsu. You will need to login using username and password.
          Credentials are directly sent to Kitsu API and not processed by the
          server. See{' '}
          <Link
            href="https://github.com/aliyss/syncribullet/blob/master/src/components/forms/kitsu-login.tsx#L28"
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
              placeholder="Username / Email"
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
