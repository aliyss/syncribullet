import type { PropFunction } from '@builder.io/qwik';
import { $, component$, useSignal, useTask$ } from '@builder.io/qwik';
import { server$ } from '@builder.io/qwik-city';

import { useForm } from '@modular-forms/qwik';
import type { SubmitHandler } from '@modular-forms/qwik';

import { preauthString } from '~/utils/auth/preauth';
import { Importers } from '~/utils/importer/types/importers';

export type AuthPreparationData = {
  success: boolean;
  code: string;
  link: string;
  qrcode: string;
  result: {
    success: boolean;
    code: string;
    link: string;
    qrcode: string;
  };
};

export type AuthData = {
  auth_key?: string;
  authKey?: string;
  result: {
    auth_key?: string;
    authKey?: string;
  };
};

export const getLink = server$(async function () {
  try {
    const data = await fetch(
      `https://link.stremio.com/api/create?type=Create`,
      {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        referrerPolicy: 'no-referrer',
      },
    );
    return (await data.json()) as AuthPreparationData;
  } catch {
    return {
      success: false,
      code: '',
      link: '',
      qrcode: '',
      result: {
        success: false,
        code: '',
        link: '',
        qrcode: '',
      },
    } as AuthPreparationData;
  }
});

export const getToken = server$(async function (code: string) {
  try {
    const data = await fetch(
      `https://link.stremio.com/api/read?type=Read&code=${code}`,
      {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
      },
    );
    return (await data.json()) as AuthData;
  } catch {
    return {
      authKey: '',
      auth_key: '',
      result: {
        authKey: '',
        auth_key: '',
      },
    } as AuthData;
  }
});

export interface StremioLoginProps {
  saveFromPreAuth$: PropFunction<() => void>;
}

export default component$<StremioLoginProps>(({ saveFromPreAuth$ }) => {
  const enableButton = useSignal(false);
  const authPreparation = useSignal<AuthPreparationData>({
    success: false,
    code: '',
    link: '',
    qrcode: '',
    result: {
      success: false,
      code: '',
      link: '',
      qrcode: '',
    },
  });

  const [, { Form: FormAuth, Field: FieldAuth }] = useForm<AuthPreparationData>(
    {
      loader: authPreparation,
    },
  );

  const setToken = $((authKey: string) => {
    localStorage.setItem(
      preauthString(Importers.STREMIO),
      JSON.stringify({
        authKey: authKey,
      }),
    );
  });

  useTask$(async () => {
    if (!authPreparation.value.code) {
      try {
        authPreparation.value = await getLink();
      } catch {
        /**/
      }
    }
  });

  const handleSubmitAuth = $<SubmitHandler<AuthPreparationData>>(async () => {
    const tokenData = await getToken(authPreparation.value.code);
    if (tokenData.result.authKey || tokenData.result.auth_key) {
      setToken(tokenData.result.authKey || tokenData.result.auth_key || '');
    }
    saveFromPreAuth$();
  });

  return (
    <>
      <FormAuth onSubmit$={handleSubmitAuth}>
        <div class="flex flex-col gap-4 items-center">
          <p class="pb-2 text-error">
            Warning! Stremio logins are not supported by stremio. If you use
            this and something goes wrong, you are on your own.
            <br />
            Feel free to report issues on Syncribullet GitHub. There will be no
            support from the Stremio team if anything goes wrong.
          </p>
          <p>
            <a
              href={authPreparation.value.link}
              class="text-primary"
              target="_blank"
              onClick$={() => (enableButton.value = true)}
            >
              Click this link
            </a>{' '}
            and submit after new device has been registered.
          </p>
          <div>
            <FieldAuth name="code">
              {(_, props) => (
                <input
                  {...props}
                  disabled
                  type="text"
                  value={authPreparation.value.code}
                  placeholder="Code"
                  class="py-2.5 px-3 h-10 font-sans text-lg font-normal rounded-lg border transition-all focus:border-2 bg-background/20 text-on-surface outline-solid outline-0 disabled:border-outline/20"
                />
              )}
            </FieldAuth>
          </div>
          <button
            disabled={!enableButton.value}
            type="submit"
            class={`inline-flex items-center py-1.5 px-4 text-sm font-medium text-center rounded-full border border-outline bg-primary/30 disabled:border-outline/20 disabled:bg-primary/10`}
          >
            Submit
          </button>
        </div>
      </FormAuth>
    </>
  );
});
