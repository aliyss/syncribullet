import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";

export default component$(() => {
  const nav = useNavigate();
  useVisibleTask$(() => {
    const anilistString = window.location.hash.slice(1).split("&");
    const anilistData: Record<string, string> = {};
    for (let i = 0; i < anilistString.length; i++) {
      const split = anilistString[i].split("=");
      anilistData[split[0]] = split[1];
    }
    window.localStorage.setItem("anilist", JSON.stringify(anilistData));
    nav("/");
  });
  return <></>;
});
