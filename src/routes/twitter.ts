import { Hono } from "hono";
import { Client } from "twitter-api-sdk";
import { TEXT_EXAMPLE } from "../config";
import authClient from "../config/twitter";

const app = new Hono();

app.post("/", async (c) => {
  try {
    const token = await authClient().requestAccessToken();
    console.log(token.token.access_token);
    const client = new Client(token.token.access_token as string);
    const response = await client.tweets.createTweet({ text: TEXT_EXAMPLE });
    console.log(response);

    return c.json(response);
  } catch (e) {
    console.error(e);
    return c.json({ error: e.message }, 500);
  }
});

app.get("/auth", async (c) => {
  try {
    const authUrl = authClient().generateAuthURL({
      state: "my-state",
      code_challenge_method: "s256",
    });
    console.log(authUrl);

    return c.redirect(authUrl);
  } catch (e) {
    console.error(e);
    return c.json({ error: e.message }, 500);
  }
});

app.get("/callback", async (c) => {
  const { code, state } = c.req.query();

  const token = await authClient().requestAccessToken(code);

  return c.json(token);
});

export default app;
