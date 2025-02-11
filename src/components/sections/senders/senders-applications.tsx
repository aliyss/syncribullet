import { component$ } from '@builder.io/qwik';
import type { PropFunction } from '@builder.io/qwik';

import { Button } from '~/components/buttons/button';
import Subtitle from '~/components/titles/subtitle';

import type { SenderInfo } from '~/utils/sender/sender';
import type { Senders } from '~/utils/sender/types/senders';

export interface SendersApplicationsProps {
  senders: SenderInfo[];
  onClick$: PropFunction<(id: Senders) => void>;
}

export default component$<SendersApplicationsProps>(({ senders, onClick$ }) => {
  return (
    <div class="w-full text-center flex flex-col gap-2">
      <Subtitle>Applications</Subtitle>
      <div class="flex flex-wrap gap-2 justify-center pt-1 text-on-background">
        {senders.map((item) => {
          return (
            <Button
              key={item.id}
              borderColour={item.borderColour}
              backgroundColour={item.backgroundColour}
              icon={item.icon}
              onClick$={() => onClick$(item.id)}
            >
              {item.text}
            </Button>
          );
        })}
      </div>
    </div>
  );
});
