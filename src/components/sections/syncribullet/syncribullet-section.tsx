import { component$ } from '@builder.io/qwik';
import type { PropFunction } from '@builder.io/qwik';

import { Button } from '~/components/buttons/button';
import Subtitle from '~/components/titles/subtitle';

import type { SyncriBulletGeneralSettingsId } from '~/utils/settings/general';

export interface ReceiversLiveSyncProps {
  onClick$: PropFunction<(id: SyncriBulletGeneralSettingsId) => void>;
}

export default component$<ReceiversLiveSyncProps>(({ onClick$ }) => {
  return (
    <div class="w-full text-center flex flex-col gap-2">
      <Subtitle>General Settings</Subtitle>
      <div class="flex flex-wrap gap-2 justify-center pt-1 text-on-background">
        <Button
          key={'syncribullet-settings'}
          borderColour={'#000000'}
          backgroundColour={'#FFFFFF'}
          icon={
            'https://api.iconify.design/tabler:settings.svg?color=%23FFFFFF'
          }
          onClick$={() => onClick$('syncribullet-settings')}
        >
          SyncriBullet
        </Button>
      </div>
    </div>
  );
});
