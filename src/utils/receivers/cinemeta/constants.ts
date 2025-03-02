import type { ReceiverInfoBase } from '~/utils/receiver/receiver';
import { IDSources } from '~/utils/receiver/types/id';
import { ExtendedReceivers } from '~/utils/receiver/types/receivers';

export const receiverInfo: ReceiverInfoBase<ExtendedReceivers.CINEMETA> = {
  id: ExtendedReceivers.CINEMETA,
  text: 'Cinemeta',
};

export const internalIds = [[IDSources.IMDB]] as const satisfies Readonly<
  Readonly<IDSources[]>[]
>;
