import {
  component$,
  useSignal,
  useStore,
  useVisibleTask$,
} from "@builder.io/qwik";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
// Components
import { Button } from "~/components/buttons/Button";
import AnilistLogin from "~/components/forms/anilist-login";
import SimklLogin from "~/components/forms/simkl-login";
// Utils
import { configureReceivers, receivers } from "~/utils/connections/receivers";
// Types
import type { ReceiverConfig } from "~/utils/connections/receivers";
import type { DocumentHead } from "@builder.io/qwik-city";

export type ApiClientForm = {
  client_id: string;
};

export type ApiClientCodeForm = {
  user_code: string;
};

export default component$(() => {
  const nav = useNavigate();
  const location = useLocation();
  const senderListSync = [
    {
      id: "stremio",
      icon: "https://www.stremio.com/website/stremio-logo-small.png",
      text: "Stremio",
      backgroundColour: "bg-[#8152A3]/60",
    },
  ];

  const configuredReceivers = useStore<Record<string, ReceiverConfig>>(
    configureReceivers(),
  );
  const currentReceiver = useSignal<string | null>(null);

  useVisibleTask$(() => {
    const anilist = window.localStorage.getItem("anilist");
    if (anilist) {
      configuredReceivers["anilist"].enabled = true;
      configuredReceivers["anilist"].data = JSON.parse(anilist);
    }
    const simkl = window.localStorage.getItem("simkl");
    if (simkl) {
      configuredReceivers["simkl"].enabled = true;
      configuredReceivers["simkl"].data = JSON.parse(simkl);
    }
  });

  const liveSyncItems = receivers
    .filter((item) => item.liveSync)
    .map((item) => {
      return (
        <Button
          key={item.id}
          backgroundColour={item.backgroundColour}
          icon={
            configuredReceivers[item.id].enabled
              ? "https://api.iconify.design/tabler:checks.svg?color=%237FFD4F"
              : item.icon
          }
          onClick$={() => {
            currentReceiver.value = item.id;
          }}
        >
          {item.text}
        </Button>
      );
    });

  /*
  const fullSyncItems = receiverListSync
    .filter((item) => item.fullSync)
    .map((item) => {
      return (
        <Button
          key={item.id}
          backgroundColour={item.backgroundColour}
          icon={item.icon}
        >
          {item.text}
        </Button>
      );
    });
  */

  const syncApplications = senderListSync.map((item) => {
    return (
      <Button
        key={item.id}
        backgroundColour={item.backgroundColour}
        icon={item.icon}
        onClick$={() => {
          const configURL: string[] = [];
          if (configuredReceivers["anilist"].data) {
            configURL.push(
              `anilist_accesstoken-=-${configuredReceivers["anilist"].data.access_token}`,
            );
          }
          if (configuredReceivers["simkl"].data) {
            configURL.push(
              `simkl_accesstoken-=-${configuredReceivers["simkl"].data.access_token}`,
            );
            configURL.push(
              `simkl_clientid-=-${configuredReceivers["simkl"].data.client_id}`,
            );
          }
          const info = `stremio://${location.url.host}${
            location.url.host.startsWith("localhost") ? "" : ".baby-beamup.club"
          }/${configURL.join("|")}/manifest.json`;
          nav(info);
        }}
      >
        {item.text}
      </Button>
    );
  });

  return (
    <>
      <div class="flex flex-col gap-6 justify-center items-center p-6 w-full min-h-screen">
        <h1 class="text-3xl font-bold md:text-6xl">
          <span class="bg-primary">S</span>
          <span class="bg-[#ed1c24]">y</span>
          <span class="bg-[#2e51a2]">n</span>
          <span class="bg-[#00cdff]">c</span>
          <span class="bg-[#FF5B38]">r</span>
          <span class="bg-[#0C0F11]">i</span>
          Bullet
        </h1>
        <div class="p-6 w-full max-w-2xl rounded-xl border shadow-xl border-outline/20 bg-secondary-container text-on-secondary-container">
          <h2 class="w-full text-xl font-bold text-center md:text-3xl">
            Receivers
          </h2>
          <div class="flex flex-col gap-6 pt-5 md:flex-row">
            <div class="w-full text-center">
              <h3 class="font-bold md:text-xl">Live Sync</h3>
              <div class="flex flex-wrap gap-2 justify-center pt-1 text-on-background">
                {liveSyncItems}
              </div>
            </div>
          </div>
        </div>
        {currentReceiver.value !== null ? (
          <div class="p-6 w-full max-w-2xl rounded-xl border shadow-xl border-outline/20 bg-secondary/20">
            <h2 class="w-full text-xl font-bold text-center md:text-3xl">
              {configuredReceivers[currentReceiver.value].receiver.text}
            </h2>
            <div class="flex flex-col gap-6 pt-5 md:flex-row">
              <div class="flex flex-col gap-4 w-full text-center">
                <div class="flex flex-col gap-2 items-center pt-1 text-on-background">
                  {currentReceiver.value === "anilist" ? (
                    <>
                      <AnilistLogin />
                    </>
                  ) : currentReceiver.value === "simkl" ? (
                    <SimklLogin />
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
        {Object.values(configuredReceivers).filter((item) => item.enabled)
          .length > 0 ? (
          <div class="p-6 w-full max-w-2xl rounded-xl border shadow-xl border-outline/20 bg-secondary-container text-on-secondary-container">
            <h2 class="w-full text-xl font-bold text-center md:text-3xl">
              Senders
            </h2>
            <div class="flex flex-col gap-6 pt-5 md:flex-row">
              <div class="w-full text-center">
                <h3 class="font-bold md:text-xl">Applications</h3>
                <div class="flex flex-wrap gap-2 justify-center pt-1 text-on-background">
                  {syncApplications}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "SyncriBullet",
  meta: [
    {
      name: "description",
      content: "Mixing up synchronizisation",
    },
  ],
};
