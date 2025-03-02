import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { server$, useNavigate } from '@builder.io/qwik-city';

import { preauthString } from '~/utils/auth/preauth';
import { SimklClientReceiver } from '~/utils/receivers/simkl/recevier-client';
import type { SimklPreAuth } from '~/utils/receivers/simkl/types/auth';

export const validateCode = server$(async function (
  code: string,
  client_id?: string,
) {
  if (!client_id) {
    client_id = this.env.get('PRIVATE_SIMKL_CLIENT_ID');
  }
  if (!client_id) {
    return;
  }
  try {
    const data = await fetch(
      `https://api.simkl.com/oauth/pin/${code}?client_id=${client_id}`,
    );
    return {
      ...(await data.json()),
      client_id,
    };
  } catch (e) {
    return;
  }
});

export default component$(() => {
  const nav = useNavigate();
  useVisibleTask$(async () => {
    const simklReceiver = new SimklClientReceiver();
    const preAuthId = preauthString(simklReceiver.receiverInfo.id);

    let parsedPreAuth: SimklPreAuth | null = null;
    try {
      const preAuth = window.localStorage.getItem(preAuthId);
      if (!preAuth) {
        throw new Error('No PreAuth for simkl.');
      }
      parsedPreAuth = JSON.parse(preAuth);
    } catch (e) {
      console.error(e);
    }

    if (!parsedPreAuth) {
      throw new Error('No PreAuth for simkl.');
    }

    let result = null;
    if (parsedPreAuth.client_id) {
      try {
        const response = await fetch(
          `https://api.simkl.com/oauth/pin/${parsedPreAuth.code}?client_id=${parsedPreAuth.client_id}`,
        );
        result = await response.json();
      } catch (e) {
        console.error(e);
        throw new Error(
          `Couldn't validate simkl pin with client_id: ${parsedPreAuth.client_id}`,
        );
      }
    } else {
      try {
        const response = await validateCode(parsedPreAuth.code);
        if (!response || response.error) {
          throw new Error('Something bad happened!');
        }
        result = response;
        parsedPreAuth.client_id = result.client_id;
      } catch (e) {
        console.error(e);
        throw new Error(
          `Couldn't validate simkl code with client_id: ${parsedPreAuth.client_id} and code: ${parsedPreAuth.code}`,
        );
      }
    }

    if (!parsedPreAuth.client_id) {
      throw new Error('No Client Id found for simkl.');
    }

    if (!result) {
      throw new Error('No result from simkl.');
    }

    if (!result.access_token) {
      throw new Error('No Access Token found for simkl.');
    }

    simklReceiver.mergeUserConfig({
      auth: {
        access_token: result.access_token,
        client_id: parsedPreAuth.client_id,
      },
    });

    window.localStorage.removeItem(preAuthId);
    nav('/');
  });
  return <></>;
});
