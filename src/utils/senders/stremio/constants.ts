import type { SenderInfo } from '~/utils/sender/sender';
import { Senders } from '~/utils/sender/types/senders';

export const senderInfo: SenderInfo = {
  id: Senders.STREMIO,
  icon: 'https://www.stremio.com/website/stremio-logo-small.png',
  text: 'Stremio',
  backgroundColour: 'bg-[#8152A3]/60',
  borderColour: 'border-[#8152A3]',
};
