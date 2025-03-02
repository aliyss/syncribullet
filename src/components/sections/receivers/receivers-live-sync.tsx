import { component$ } from '@builder.io/qwik';
import type { NoSerialize, PropFunction } from '@builder.io/qwik';

import { Button } from '~/components/buttons/button';
import Subtitle from '~/components/titles/subtitle';

import { exists } from '~/utils/helpers/array';
import type {
  ReceiverClients,
  Receivers,
} from '~/utils/receiver/types/receivers';
import type { SyncriBulletGeneralSettingsId } from '~/utils/settings/general';

export interface ReceiversLiveSyncProps {
  receivers: { [key in Receivers]: NoSerialize<ReceiverClients> };
  onClick$: PropFunction<
    (id: Receivers | SyncriBulletGeneralSettingsId) => void
  >;
}

export default component$<ReceiversLiveSyncProps>(({ receivers, onClick$ }) => {
  return (
    <div class="w-full text-center flex flex-col gap-2">
      <Subtitle>Live Sync</Subtitle>
      <div class="flex flex-wrap gap-2 justify-center pt-1 text-on-background">
        {Object.values(receivers)
          .filter(exists)
          .map((item) => {
            return (
              <Button
                key={item.receiverInfo.id}
                borderColour={item.receiverInfo.borderColour}
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
