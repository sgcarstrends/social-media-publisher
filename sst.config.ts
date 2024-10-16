/// <reference path="./.sst/platform/config.d.ts" />

import { AppEnv } from "./src/types";

export default $config({
  app(input) {
    return {
      name: "social-media-publisher",
      removal: input?.stage === AppEnv.PROD ? "retain" : "remove",
      home: "cloudflare",
    };
  },
  async run() {
    const hono = new sst.cloudflare.Worker("Hono", {
      url: true,
      handler: "src/index.ts",
    });

    return {
      api: hono.url,
    };
  },
});
