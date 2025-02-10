import { Slot, component$ } from '@builder.io/qwik';
import type { QwikIntrinsicElements } from '@builder.io/qwik';

export type ButtonProps = QwikIntrinsicElements['button'] & {
  backgroundColour: string;
  icon?: string;
};

export const Button = component$<ButtonProps>(
  ({ icon, backgroundColour, ...props }) => {
    return (
      <button
        type="button"
        class={`inline-flex items-center py-1.5 px-4 text-sm font-medium text-center rounded-full border border-outline ${backgroundColour}`}
        {...props}
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
