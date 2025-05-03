import { component$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';

import Configure from '~/components/sections/configure';

export default component$(() => {
  const location = useLocation();
  const configString = location.url.pathname.split('/')[1];

  return <Configure config={configString} />;
});
