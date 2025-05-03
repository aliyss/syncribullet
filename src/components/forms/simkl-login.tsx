import { $, component$, useSignal, useTask$ } from '@builder.io/qwik';
import { Link, server$, useLocation, useNavigate } from '@builder.io/qwik-city';

import { useForm } from '@modular-forms/qwik';
import type { SubmitHandler } from '@modular-forms/qwik';

import type {
  ApiClientCodeForm,
  ApiClientForm,
} from '~/components/sections/configure';

import { preauthString } from '~/utils/auth/preauth';
import { Receivers } from '~/utils/receiver/types/receivers';
import type { SimklPreAuth } from '~/utils/receivers/simkl/types/auth';

export const getCode = server$(async function (
  redirect_url: string,
  client_id?: string,
) {
  if (!client_id) {
    client_id = this.env.get('PRIVATE_SIMKL_CLIENT_ID');
  }
  if (!client_id) {
    return { user_code: '', verification_url: '' };
  }
  try {
    const data = await fetch(
      `https://api.simkl.com/oauth/pin?client_id=${client_id}&redirect=${redirect_url}`,
    );
    return await data.json();
  } catch (e) {
    return { user_code: '', verification_url: '' };
  }
});

export default component$(() => {
  const location = useLocation();
  const nav = useNavigate();
  const [, { Form, Field }] = useForm<ApiClientForm>({
    loader: useSignal({
      client_id: '',
    }),
  });

  const client_id = useSignal<string | boolean>(false);

  const code = useSignal({ user_code: '', verification_url: '' });

  const [, { Form: FormCode, Field: FieldCode }] = useForm<ApiClientCodeForm>({
    loader: code,
  });

  const setToken = $(() => {
    localStorage.setItem(
      preauthString(Receivers.SIMKL),
      JSON.stringify({
        client_id: typeof client_id.value === 'string' ? client_id.value : '',
        code: code.value.user_code,
      } as SimklPreAuth),
    );
  });

  useTask$(async () => {
    if (!client_id.value) {
      try {
        const data = await getCode(
          location.url.protocol +
            '//' +
            location.url.host +
            `${
              location.url.host.startsWith('localhost')
                ? ''
                : '.baby-beamup.club'
            }` +
            '/oauth/simkl/',
        );
        code.value = data;
        if (code.value.user_code) {
          client_id.value = true;
          setToken();
        }
      } catch (e) {
        /**/
      }
    }
  });

  const handleSubmit = $<SubmitHandler<ApiClientForm>>(async (values) => {
    try {
      const redirect_url =
        location.url.protocol + '//' + location.url.host + '/oauth/simkl/';
      const client_id_p = values.client_id;
      const data = await fetch(
        `https://api.simkl.com/oauth/pin?client_id=${client_id_p}&redirect=${redirect_url}`,
      );
      const responseData = await data.json();
      code.value = responseData;
      client_id.value = client_id_p;
      setToken();
    } catch (e) {
      /**/
    }
  });

  return (
    <>
      {!client_id.value ? (
        <Form onSubmit$={handleSubmit}>
          <div class="flex flex-col gap-4 items-center">
            <p>
              <Link
                href="https://simkl.com/settings/developer/new/"
                class="text-primary"
                target="_blank"
              >
                Create an app
              </Link>{' '}
              and set the redirect_uri to{' '}
              <p>
                <span class="rounded-full text-primary bg-surface">
                  {location.url.protocol +
                    '//' +
                    location.url.host +
                    '/oauth/simkl/'}
                </span>
              </p>
            </p>
            <Field name="client_id">
              {(field, props) => (
                <input
                  {...props}
                  type="text"
                  value={field.value}
                  placeholder="Client Id"
                  class="py-2.5 px-3 h-10 font-sans text-lg font-normal rounded-lg border transition-all focus:border-2 bg-background/20 text-on-surface outline outline-0"
                />
              )}
            </Field>
            <button
              type="submit"
              class={`inline-flex items-center py-1.5 px-4 text-sm font-medium text-center rounded-full border border-outline bg-primary/30`}
            >
              Get Code
            </button>
          </div>
        </Form>
      ) : (
        <FormCode>
          <div class="flex flex-col gap-4 items-center">
            <FieldCode name="user_code">
              {(_field, props) => (
                <input
                  {...props}
                  type="text"
                  value={code.value.user_code}
                  disabled
                  placeholder="Copy Code"
                  class="py-2.5 px-3 w-full h-10 font-sans text-lg font-normal rounded-lg border transition-all focus:border-2 bg-background/20 text-on-surface outline outline-0"
                />
              )}
            </FieldCode>
            <button
              type="button"
              class={`inline-flex items-center py-1.5 px-4 text-sm font-medium text-center rounded-full border border-outline bg-primary/30`}
              onClick$={() =>
                nav(`${code.value.verification_url}/${code.value.user_code}`)
              }
            >
              Validate
            </button>
          </div>
        </FormCode>
      )}
    </>
  );
});
