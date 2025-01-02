import { Hono } from "hono";
import authClient from "../config/twitter";

const app = new Hono();

const STATE = "my-state";

app.get("/login", async (c) => {
  try {
    const authUrl = authClient().generateAuthURL({
      state: STATE,
      code_challenge_method: "s256",
    });

    return c.redirect(authUrl);
  } catch (e) {
    console.error(e);
    return c.json({ error: e.message }, 500);
  }
});

app.get("/callback", async (c) => {
  try {
    const { code, state } = c.req.query();

    if (state !== STATE) {
      return c.text("State isn't matching", 500);
    }

    const token = await authClient().requestAccessToken(code);
    console.log(token);
    return c.redirect("/twitter");
  } catch (e) {
    console.error(e);
    return c.json({ error: e.message }, 500);
  }
});

export default app;
