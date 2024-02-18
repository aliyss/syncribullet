import { server$ } from "@builder.io/qwik-city";

export const loginTVDB = server$(async function (client_id?: string) {
  if (!client_id) {
    client_id = this.env.get("TVDB_API_KEY");
  }
  if (!client_id) {
    return;
  }
  try {
    const data = await fetch(`https://api4.thetvdb.com/v4/login`, {
      method: "POST",
      body: JSON.stringify({
        apiKey: client_id,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return await data.json();
  } catch (e) {
    return;
  }
});
