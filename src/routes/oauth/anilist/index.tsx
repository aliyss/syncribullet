import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';

import { preauthString } from '~/utils/auth/preauth';
import { AnilistClientReceiver } from '~/utils/receivers/anilist/recevier-client';
import type { AnilistPreAuth } from '~/utils/receivers/anilist/types/auth';

export default component$(() => {
  const nav = useNavigate();
  useVisibleTask$(async () => {
    const anilistString = window.location.hash.slice(1).split('&');
    const anilistData: Record<string, string> = {};
    for (let i = 0; i < anilistString.length; i++) {
      const split = anilistString[i].split('=');
      anilistData[split[0]] = split[1];
    }

    const anilistReceiver = new AnilistClientReceiver();
    const preAuthId = preauthString(anilistReceiver.receiverInfo.id);

    let parsedPreAuth: AnilistPreAuth | null = null;
    try {
      const preAuth = window.localStorage.getItem(preAuthId) || '{}';
      if (!preAuth) {
        throw new Error('No PreAuth for anilist.');
      }
      parsedPreAuth = JSON.parse(preAuth);
    } catch (e) {
      console.error(e);
    }

    if (!parsedPreAuth) {
      throw new Error('No PreAuth for anilist.');
    }

    if (!anilistData.access_token) {
      throw new Error('No Access Token found for anilist.');
    }

    anilistReceiver.mergeUserConfig({
      auth: {
        access_token: anilistData.access_token,
        token_type: anilistData.token_type,
        expires_in: anilistData.expires_in,
        client_id: parsedPreAuth.client_id,
      },
    });

    window.localStorage.removeItem(preAuthId);

    await nav('/');
  });
  return <></>;
});
