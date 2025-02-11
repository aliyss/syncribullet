import { component$ } from '@builder.io/qwik';
import type { PropFunction } from '@builder.io/qwik';

import type { KnownNoSerialize } from '~/utils/helpers/qwik-types';
import type { AnilistClientReceiver } from '~/utils/receivers/anilist/recevier-client';
import type { SimklClientReceiver } from '~/utils/receivers/simkl/recevier-client';
import type { Senders } from '~/utils/sender/types/senders';
import { senderInfo } from '~/utils/senders/stremio/constants';

import SendersApplications from './senders-applications';

export interface ReceiversSectionProps {
  receivers: KnownNoSerialize<AnilistClientReceiver | SimklClientReceiver>[];
  onClick$: PropFunction<(id: Senders) => void>;
}

export default component$<ReceiversSectionProps>(({ onClick$ }) => {
  const senders = [senderInfo];

  return (
    <div class="p-6 w-full max-w-2xl rounded-xl border shadow-xl border-outline/20 bg-secondary-container text-on-secondary-container">
      <h2 class="w-full text-xl font-bold text-center md:text-3xl">Senders</h2>
      <div class="flex flex-col gap-6 pt-5 md:flex-row">
        <SendersApplications senders={senders} onClick$={onClick$} />
      </div>
    </div>
  );
});
