import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { server$, useNavigate } from '@builder.io/qwik-city';

export const validateCode = server$(async function (
  code: string,
  client_id?: string,
) {
  if (!client_id) {
    client_id = this.env.get('PRIVATE_TRAKT_CLIENT_ID');
  }
  if (!client_id) {
    return;
  }
  try {
    const data = await fetch(
      `https://api.trakt.tv/oauth/pin/${code}?client_id=${client_id}`,
    );
    return await data.json();
  } catch (e) {
    return;
  }
});

export default component$(() => {
  const nav = useNavigate();
  useVisibleTask$(async () => {
    try {
      const data = JSON.parse(
        window.localStorage.getItem('trakt_code') || '{}',
      );

      if (data.client_id) {
        const result = await fetch(
          `https://api.trakt.tv/oauth/device/${data.code}?client_id=${data.client_id}`,
        );
        window.localStorage.setItem(
          'trakt',
          JSON.stringify({
            ...(await result.json()),
            client_id: data.client_id,
          }),
        );
      } else {
        const result = await validateCode(data.code);
        if (!result || result.error) {
          throw new Error('Something bad happened!');
        }
        window.localStorage.setItem(
          'trakt',
          JSON.stringify({
            ...result,
            client_id: data.client_id,
          }),
        );
      }
      nav('/');
    } catch (e) {
      /**/
    }
  });
  return <></>;
});
