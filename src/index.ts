import { RichText } from "@atproto/api";
import { Hono } from "hono";
import { showRoutes } from "hono/dev";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { RestliClient } from "linkedin-api-client";
import { Resource } from "sst";
import { TEXT_EXAMPLE } from "./config";
import agent from "./config/bluesky";
import telegram from "./routes/telegram";
// import twitter from "./routes/twitter";

const app = new Hono();

app.use(logger());

app.onError((error, c) => {
  console.error(error);

  if (error instanceof HTTPException) {
    return c.json({
      statusCode: error.status,
      message: error.message,
    });
  }

  return c.json({ error: error }, 500);
});

app.get("/", (c) => c.json({ message: "Hello World!" }));

app.post("/bsky", async (c) => {
  try {
    await agent.login({
      identifier: Resource.BLUESKY_USERNAME.value,
      password: Resource.BLUESKY_PASSWORD.value,
    });
  } catch (e) {
    if (e instanceof Error) {
      console.error(e);
      return c.json({ error: e.message }, 500);
    }

    console.error("Unexpected error", e);
    return c.json({ error: "An unexpected error occurred" }, 500);
  }

  const richText = new RichText({
    text: TEXT_EXAMPLE,
  });
  await richText.detectFacets(agent);
  const response = await agent.post({
    $type: "app.bsky.feed.post",
    text: richText.text,
    facets: richText.facets,
    createdAt: new Date().toISOString(),
  });

  return c.json(response);
});

app.post("/linkedin", async (c) => {
  const USERINFO_RESOURCE = "/userinfo";
  const UGC_POSTS_RESOURCE = "/ugcPosts";

  try {
    const restliClient = new RestliClient();
    restliClient.setDebugParams({ enabled: true });
    const accessToken = Resource.LINKEDIN_ACCESS_TOKEN.value;

    const me = await restliClient.get({
      resourcePath: USERINFO_RESOURCE,
      accessToken,
    });

    const response = await restliClient.create({
      resourcePath: UGC_POSTS_RESOURCE,
      entity: {
        author: `urn:li:organization:${Resource.LINKEDIN_ORGANISATION_ID.value}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: TEXT_EXAMPLE,
            },
            shareMediaCategory: "ARTICLE",
            media: [
              {
                status: "READY",
                originalUrl:
                  "https://blog.google/products/search/google-year-in-search-video-breakouts/",
              },
            ],
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      },
      accessToken,
    });
    console.log(response);

    return c.json(response);
  } catch (e) {
    console.error(e);
    return c.json({ error: e.message }, 500);
  }
});

app.route("/telegram", telegram);

// TODO: Temporary disable Twitter function first
// app.route("/twitter", twitter);

showRoutes(app, { colorize: true });

export default app;
