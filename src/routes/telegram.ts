import { Hono } from "hono";
import { Resource } from "sst";
import { TELEGRAM_API_URL, TELEGRAM_CHANNEL } from "../config/telegram";

const app = new Hono();

app.post("/", async (c) => {
  const { message } = await c.req.json();

  try {
    const response = await fetch(
      `${TELEGRAM_API_URL}/bot${Resource.TELEGRAM_BOT_TOKEN.value}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHANNEL,
          text: message,
        }),
      },
    ).then((res) => res.json());
    console.info(response);

    if (response.ok) {
      return c.json(response);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
});

export default app;
