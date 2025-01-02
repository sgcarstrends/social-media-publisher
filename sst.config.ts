/// <reference path="./.sst/platform/config.d.ts" />

import { AppEnv } from "./src/types";

const DOMAIN_NAME = "sgcarstrends.com";

const DOMAIN: Record<string, string> = {
  dev: `dev.publisher.${DOMAIN_NAME}`,
  staging: `staging.publisher.${DOMAIN_NAME}`,
  prod: `publisher.${DOMAIN_NAME}`,
};

export default $config({
  app(input) {
    return {
      name: "social-media",
      removal: input?.stage === AppEnv.PROD ? "retain" : "remove",
      home: "cloudflare",
    };
  },
  async run() {
    const BLUESKY_USERNAME = new sst.Secret(
      "BLUESKY_USERNAME",
      process.env.BLUESKY_USERNAME,
    );
    const BLUESKY_PASSWORD = new sst.Secret(
      "BLUESKY_PASSWORD",
      process.env.BLUESKY_PASSWORD,
    );
    const TWITTER_CLIENT_ID = new sst.Secret(
      "TWITTER_CLIENT_ID",
      process.env.TWITTER_CLIENT_ID,
    );
    const TWITTER_CLIENT_SECRET = new sst.Secret(
      "TWITTER_CLIENT_SECRET",
      process.env.TWITTER_CLIENT_SECRET,
    );
    const TWITTER_BEARER_TOKEN = new sst.Secret(
      "TWITTER_BEARER_TOKEN",
      process.env.TWITTER_BEARER_TOKEN,
    );
    const LINKEDIN_ACCESS_TOKEN = new sst.Secret(
      "LINKEDIN_ACCESS_TOKEN",
      process.env.LINKEDIN_ACCESS_TOKEN,
    );
    const LINKEDIN_ORGANISATION_ID = new sst.Secret(
      "LINKEDIN_ORGANISATION_ID",
      process.env.LINKEDIN_ORGANISATION_ID,
    );
    const TELEGRAM_CHANNEL_ID = new sst.Secret(
      "TELEGRAM_CHANNEL_ID",
      process.env.TELEGRAM_CHANNEL_ID,
    );
    const TELEGRAM_BOT_TOKEN = new sst.Secret(
      "TELEGRAM_BOT_TOKEN",
      process.env.TELEGRAM_BOT_TOKEN,
    );

    const hono = new sst.cloudflare.Worker("Hono", {
      link: [
        BLUESKY_USERNAME,
        BLUESKY_PASSWORD,
        TWITTER_CLIENT_ID,
        TWITTER_CLIENT_SECRET,
        TWITTER_BEARER_TOKEN,
        LINKEDIN_ACCESS_TOKEN,
        LINKEDIN_ORGANISATION_ID,
        TELEGRAM_CHANNEL_ID,
        TELEGRAM_BOT_TOKEN,
      ],
      domain: DOMAIN[$app.stage],
      handler: "src/index.ts",
    });

    return {
      api: hono.url,
    };
  },
});
