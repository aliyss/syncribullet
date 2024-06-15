export interface Receiver {
  id: string;
  icon: string;
  text: string;
  backgroundColour: string;
  liveSync: boolean;
  fullSync: boolean;
}

export interface ReceiverConfig {
  receiver: Receiver;
  enabled: boolean;
  data?: any;
}

export const receivers: Receiver[] = [
  {
    id: 'trakt',
    icon: 'https://api.iconify.design/simple-icons:trakt.svg?color=%23FFFFFF',
    text: 'Trakt',
    backgroundColour: 'bg-[#ed1c24]',
    liveSync: false,
    fullSync: true,
  },
  {
    id: 'mal',
    icon: 'https://api.iconify.design/simple-icons:myanimelist.svg?color=%23FFFFFF',
    text: 'MyAnimeList',
    backgroundColour: 'bg-[#2e51a2]/60',
    liveSync: false,
    fullSync: true,
  },
  {
    id: 'anilist',
    icon: 'https://api.iconify.design/simple-icons:anilist.svg?color=%23FFFFFF',
    text: 'Anilist',
    backgroundColour: 'bg-[#00cdff]/60',
    liveSync: true,
    fullSync: true,
  },
  {
    id: 'kitsu',
    icon: 'https://api.iconify.design/simple-icons:kitsu.svg?color=%23FFFFFF',
    text: 'Kitsu',
    backgroundColour: 'bg-[#FF5B38]/60',
    liveSync: false,
    fullSync: true,
  },
  {
    id: 'simkl',
    icon: 'https://api.iconify.design/simple-icons:simkl.svg?color=%23FFFFFF',
    text: 'Simkl',
    backgroundColour: 'bg-[#0C0F11]/60',
    liveSync: true,
    fullSync: true,
  },
  {
    id: 'stremio',
    icon: 'https://raw.githubusercontent.com/Stremio/stremio-brand/master/favicons/stremio-service-dicon-white-gb.svg',
    text: 'Stremio',
    backgroundColour: 'bg-[#8152A3]/60',
    liveSync: true,
    fullSync: true,
  },
];

export function configureReceivers(): Record<string, ReceiverConfig> {
  const receiverConfigs: Record<string, ReceiverConfig> = {};
  for (let i = 0; i < receivers.length; i++) {
    receiverConfigs[receivers[i].id] = {
      receiver: receivers[i],
      enabled: false,
    };
  }
  return receiverConfigs;
}
