import { component$, $, useSignal, useTask$ } from "@builder.io/qwik";
import { useForm } from "@modular-forms/qwik";
import type { SubmitHandler } from "@modular-forms/qwik";
import { server$ } from "@builder.io/qwik-city";

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
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        referrerPolicy: "no-referrer",
      },
    );
    return (await data.json()) as AuthPreparationData;
  } catch (e) {
    return {
      success: false,
      code: "",
      link: "",
      qrcode: "",
      result: {
        success: false,
        code: "",
        link: "",
        qrcode: "",
      },
    } as AuthPreparationData;
  }
});

export const getToken = server$(async function (code: string) {
  try {
    const data = await fetch(
      `https://link.stremio.com/api/read?type=Read&code=${code}`,
      {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow",
        referrerPolicy: "no-referrer",
      },
    );
    return (await data.json()) as AuthData;
  } catch (e) {
    return {
      authKey: "",
      auth_key: "",
      result: {
        authKey: "",
        auth_key: "",
      },
    } as AuthData;
  }
});

export default component$(() => {
  const enableButton = useSignal(false);
  const authPreparation = useSignal<AuthPreparationData>({
    success: false,
    code: "",
    link: "",
    qrcode: "",
    result: {
      success: false,
      code: "",
      link: "",
      qrcode: "",
    },
  });

  const [, { Form: FormAuth, Field: FieldAuth }] = useForm<AuthPreparationData>(
    {
      loader: authPreparation,
    },
  );

  const setToken = $((authKey: string) => {
    localStorage.setItem(
      "stremio",
      JSON.stringify({
        authKey: authKey,
      }),
    );
  });

  useTask$(async () => {
    if (!authPreparation.value.code) {
      try {
        authPreparation.value = await getLink();
      } catch (e) {
        /**/
      }
    }
  });

  const handleSubmitAuth = $<SubmitHandler<AuthPreparationData>>(async () => {
    const tokenData = await getToken(authPreparation.value.code);
    if (tokenData.result.authKey || tokenData.result.auth_key) {
      setToken(tokenData.result.authKey || tokenData.result.auth_key || "");
      // Has to be replaced at some point
      setTimeout(() => {
        window.location.reload();
      }, 30);
    }
  });

  return (
    <>
      <FormAuth onSubmit$={handleSubmitAuth}>
        <div class="flex flex-col gap-4 items-center">
          <p>
            <p class="pb-2 text-error">
              Warning! This receiver is just for better sync validation.
              <br />
              No syncing will be done <strong>to</strong> your stremio library.
              <br />
              Also this does nothing as of now.
            </p>
            <a
              href={authPreparation.value.link}
              class="text-primary"
              target="_blank"
              onClick$={() => (enableButton.value = true)}
            >
              Click this link
            </a>{" "}
            and submit after new device has been registered.
            <FieldAuth name="code">
              {(_, props) => (
                <input
                  {...props}
                  disabled
                  type="text"
                  value={authPreparation.value.code}
                  placeholder="Code"
                  class="py-2.5 px-3 h-10 font-sans text-lg font-normal rounded-lg border transition-all focus:border-2 bg-background/20 text-on-surface outline outline-0 disabled:border-outline/20"
                />
              )}
            </FieldAuth>
          </p>
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
