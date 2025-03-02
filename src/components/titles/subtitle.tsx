import { Slot, component$ } from '@builder.io/qwik';

export default component$(() => {
  return (
    <h3 class="font-bold md:text-xl">
      <Slot />
    </h3>
  );
});
