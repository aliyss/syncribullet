import { Slot, component$, useSignal } from '@builder.io/qwik';
import type { PropFunction } from '@builder.io/qwik';

export interface TabProps<T extends string = string> {
  activeTab: T;
  tabs: T[];
  onTabChange$: PropFunction<(tab: T) => void>;
  overflow?: boolean;
}

export default component$<TabProps>(
  ({ activeTab, tabs, onTabChange$, overflow = true }) => {
    const tabRef = useSignal<Element | undefined>(undefined);

    return (
      <div class="flex flex-col gap-4 w-full">
        <div class="flex flex-row gap-4" ref={tabRef}>
          {Object.values(tabs).map((tab) => (
            <button
              key={tab}
              onClick$={() => {
                onTabChange$(tab);
                setTimeout(() => {
                  if (tabRef.value) {
                    tabRef.value.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                      inline: 'start',
                    });
                  }
                }, 300);
              }}
              class={`${
                activeTab === tab
                  ? 'bg-primary text-on-primary'
                  : 'bg-secondary text-on-secondary'
              } px-4 py-2`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div class={`flex flex-col ${overflow ? 'h-80 overflow-scroll' : ''}`}>
          <Slot />
        </div>
      </div>
    );
  },
);
