import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(() => {
  return {
    build: {
      sourcemap: true,
    },
    plugins: [
      qwikCity({ 
        trailingSlash: false,
      }),
      qwikVite(), tsconfigPaths(), 
      // sentryVitePlugin(
      //   {
      //     org: process.env.SENTRY_ORG,
      //     project: process.env.SENTRY_PROJECT,
      //     authToken: process.env.SENTRY_AUTH_TOKEN,
      //     telemetry: false,
      //   }
      // )
    ],
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600",
      },
    },
    server: {
      host: "0.0.0.0",
    },
  };
});
