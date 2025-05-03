import { component$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';

import Configure from '~/components/sections/configure';

export default component$(() => {
  const location = useLocation();
  const configString = location.params.config;

  return <Configure config={configString} />;
});
