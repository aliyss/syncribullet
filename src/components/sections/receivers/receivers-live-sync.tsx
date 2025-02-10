import { component$ } from '@builder.io/qwik';
import type { PropFunction } from '@builder.io/qwik';

import { Button } from '~/components/buttons/button';

import type { KnownNoSerialize } from '~/utils/helpers/qwik-types';
import type { Receivers } from '~/utils/receiver/types/receivers';
import type { AnilistClientReceiver } from '~/utils/receivers/anilist/recevier-client';
import type { SimklClientReceiver } from '~/utils/receivers/simkl/recevier-client';

export interface ReceiversLiveSyncProps {
  receivers: KnownNoSerialize<SimklClientReceiver | AnilistClientReceiver>[];
  onClick$: PropFunction<(id: Receivers) => void>;
}

export default component$<ReceiversLiveSyncProps>(({ receivers, onClick$ }) => {
  return (
    <div class="w-full text-center flex flex-col gap-2">
      <h3 class="font-bold md:text-xl">Live Sync</h3>
      <div class="flex flex-wrap gap-2 justify-center pt-1 text-on-background">
        {receivers.map((item) => {
          return (
            <Button
              key={item.receiverInfo.id}
              backgroundColour={item.receiverInfo.backgroundColour}
              icon={
                item.userSettings
                  ? 'https://api.iconify.design/tabler:checks.svg?color=%237FFD4F'
                  : item.receiverInfo.icon
              }
              onClick$={() => onClick$(item.receiverInfo.id)}
            >
              {item.receiverInfo.text}
            </Button>
          );
        })}
      </div>
    </div>
  );
});
