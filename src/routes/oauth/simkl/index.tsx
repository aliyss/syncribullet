import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";

export default component$(() => {
  const nav = useNavigate();
  useVisibleTask$(async () => {
    try {
      const data = JSON.parse(
        window.localStorage.getItem("simkl_code") || "{}",
      );

      const result = await fetch(
        `https://api.simkl.com/oauth/pin/${data.code}?client_id=${data.client_id}`,
      );
      window.localStorage.setItem(
        "simkl",
        JSON.stringify({
          ...(await result.json()),
          client_id: data.client_id,
        }),
      );
      nav("/");
    } catch (e) {
      /**/
    }
  });
  return <></>;
});
