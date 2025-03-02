import type { ReceiverInfoBase } from '~/utils/receiver/receiver';
import { IDSources } from '~/utils/receiver/types/id';
import { ExtendedReceivers } from '~/utils/receiver/types/receivers';

export const receiverInfo: ReceiverInfoBase<ExtendedReceivers.KITSU_ADDON> = {
  id: ExtendedReceivers.KITSU_ADDON,
  text: 'Kitsu Addon',
};

export const internalIds = [[IDSources.KITSU]] as const satisfies Readonly<
  Readonly<IDSources[]>[]
>;
