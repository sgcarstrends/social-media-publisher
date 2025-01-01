import { BskyAgent } from "@atproto/api";

const agent = new BskyAgent({
  service: "https://bsky.social",
});

export default agent;
