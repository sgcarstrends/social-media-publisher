/// <reference path="./.sst/platform/config.d.ts" />

import { AppEnv } from "./src/types";

const DOMAIN_NAME = "sgcarstrends.com";

const DOMAIN = {
  dev: `dev.publisher.${DOMAIN_NAME}`,
  staging: `staging.publisher.${DOMAIN_NAME}`,
  prod: `publisher.${DOMAIN_NAME}`,
};

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
      domain: DOMAIN[$app.stage],
      url: true,
      handler: "src/index.ts",
    });

    return {
      api: hono.url,
    };
  },
});
