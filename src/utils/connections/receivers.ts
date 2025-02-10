import { Receivers } from '../receiver/types/receivers';
import { AnilistClientReceiver } from '../receivers/anilist/recevier-client';
import { SimklClientReceiver } from '../receivers/simkl/recevier-client';

// export const receivers: Receiver[] = [
//   {
//     id: 'trakt',
//     icon: 'https://api.iconify.design/simple-icons:trakt.svg?color=%23FFFFFF',
//     text: 'Trakt',
//     backgroundColour: 'bg-[#ed1c24]',
//     liveSync: false,
//     fullSync: true,
//   },
//   {
//     id: 'mal',
//     icon: 'https://api.iconify.design/simple-icons:myanimelist.svg?color=%23FFFFFF',
//     text: 'MyAnimeList',
//     backgroundColour: 'bg-[#2e51a2]/60',
//     liveSync: false,
//     fullSync: true,
//   },
//   {
//     id: 'kitsu',
//     icon: 'https://api.iconify.design/simple-icons:kitsu.svg?color=%23FFFFFF',
//     text: 'Kitsu',
//     backgroundColour: 'bg-[#FF5B38]/60',
//     liveSync: false,
//     fullSync: true,
//   },
//   {
//     id: 'stremio',
//     icon: 'https://raw.githubusercontent.com/Stremio/stremio-brand/master/favicons/stremio-service-dicon-white-gb.svg',
//     text: 'Stremio',
//     backgroundColour: 'bg-[#8152A3]/60',
//     liveSync: true,
//     fullSync: true,
//   },
// ];

export const configurableReceivers = () => ({
  [Receivers.SIMKL]: new SimklClientReceiver(),
  [Receivers.ANILIST]: new AnilistClientReceiver(),
});
