import { Slot, component$ } from '@builder.io/qwik';
import type { PropFunction, QwikMouseEvent } from '@builder.io/qwik';

export interface ButtonProps {
  backgroundColour: string;
  icon?: string;
  onClick$?: PropFunction<
    (
      event?: QwikMouseEvent<HTMLButtonElement, MouseEvent>,
      element?: HTMLButtonElement,
    ) => void
  >;
}

export const Button = component$<ButtonProps>(
  ({ icon, backgroundColour, onClick$ }) => {
    return (
      <button
        type="button"
        class={`inline-flex items-center py-1.5 px-4 text-sm font-medium text-center rounded-full border border-outline ${backgroundColour}`}
        onClick$={onClick$}
      >
        {icon ? (
          <img class="mr-2 -ml-1" src={icon} width="18" height="18" />
        ) : (
          <></>
        )}
        <Slot />
      </button>
    );
  },
);
