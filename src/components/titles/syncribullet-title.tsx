import { component$ } from '@builder.io/qwik';

export default component$(() => {
  return (
    <h1 class="text-3xl font-bold md:text-6xl text-on-background">
      <span class="bg-primary">S</span>
      <span class="bg-[#ed1c24] text-on-background-dark">y</span>
      <span class="bg-[#2e51a2] text-on-background-dark">n</span>
      <span class="bg-[#00cdff] text-on-background-dark">c</span>
      <span class="bg-[#FF5B38] text-on-background-dark">r</span>
      <span class="bg-[#0C0F11] text-on-background-dark">i</span>
      Bullet
      <span class="ml-2 text-base">(v2)</span>
    </h1>
  );
});
