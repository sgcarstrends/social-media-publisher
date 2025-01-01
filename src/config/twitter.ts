import { Resource } from "sst";
import { auth } from "twitter-api-sdk";

const authClient = () =>
  new auth.OAuth2User({
    client_id: Resource.TWITTER_CLIENT_ID.value,
    client_secret: Resource.TWITTER_CLIENT_SECRET.value,
    callback: "https://dev.publisher.sgcarstrends.com/twitter/callback",
    scopes: ["offline.access", "tweet.read", "tweet.write", "users.read"],
  });

export default authClient;
