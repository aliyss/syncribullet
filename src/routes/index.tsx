import { component$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';

import Configure from '~/components/sections/configure';

export default component$(() => {
  return <Configure />;
});

export const head: DocumentHead = {
  title: 'SyncriBullet',
  meta: [
    {
      name: 'description',
      content: 'Mixing up synchronizisation',
    },
  ],
};
