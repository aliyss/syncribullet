import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

import { manifest } from '~/utils/manifest';

import { GithubIcon } from '../icons/github';

export default component$(() => {
  return (
    <div class="flex flex-col items-center justify-center gap-10">
      <h1 class="text-3xl font-bold md:text-6xl text-on-background">
        <span class="bg-primary">S</span>
        <span class="bg-[#ed1c24] text-on-background-dark">y</span>
        <span class="bg-[#2e51a2] text-on-background-dark">n</span>
        <span class="bg-[#00cdff] text-on-background-dark">c</span>
        <span class="bg-[#FF5B38] text-on-background-dark">r</span>
        <span class="bg-[#0C0F11] text-on-background-dark">i</span>
        Bullet
        <span class="ml-2 text-base">(v{manifest.version})</span>
      </h1>
      <div>
        <Link
          href="https://github.com/aliyss/syncribullet"
          target="_blank"
          class="text-primary hover:text-white"
        >
          <GithubIcon class="w-8 h-8" />
        </Link>
      </div>
    </div>
  );
});
