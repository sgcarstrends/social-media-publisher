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
  } catch (error) {
    console.error(error);
    throw error;
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
  } catch (error) {
    console.error(error);
    throw error;
  }
});

export default app;
