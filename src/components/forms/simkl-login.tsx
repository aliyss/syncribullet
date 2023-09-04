import { component$, $, useSignal } from "@builder.io/qwik";
import { useForm } from "@modular-forms/qwik";
import type { SubmitHandler } from "@modular-forms/qwik";
import type { ApiClientCodeForm, ApiClientForm } from "~/routes";
import { useLocation, useNavigate } from "@builder.io/qwik-city";

export default component$(() => {
  const location = useLocation();
  const nav = useNavigate();
  const [, { Form, Field }] = useForm<ApiClientForm>({
    loader: useSignal({
      client_id: "",
    }),
  });

  const client_id = useSignal<string | null>(null);

  const code = useSignal({ user_code: "", verification_url: "" });

  const [, { Form: FormCode, Field: FieldCode }] = useForm<ApiClientCodeForm>({
    loader: code,
  });

  const setToken = $(() => {
    localStorage.setItem(
      "simkl_code",
      JSON.stringify({
        client_id: client_id.value,
        code: code.value.user_code,
      }),
    );
  });

  const handleSubmit = $<SubmitHandler<ApiClientForm>>(async (values) => {
    try {
      const data = await fetch(
        `https://api.simkl.com/oauth/pin?client_id=${
          values.client_id
        }&redirect=${
          location.url.protocol + location.url.host + "/oauth/simkl/"
        }`,
      );
      const responseData = await data.json();
      code.value = responseData;
      client_id.value = values.client_id;
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
              <a
                href="https://simkl.com/settings/developer/new/"
                class="text-primary"
              >
                Create an app
              </a>{" "}
              and set the redirect_uri to{" "}
              <span class="rounded-full text-primary bg-surface">
                {location.url.protocol + location.url.host + "/oauth/simkl/"}
              </span>
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
