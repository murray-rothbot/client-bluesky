import { BskyAgent } from "@atproto/api";
import "dotenv/config";

const BLUESKY_USERNAME = `${process.env.BLUESKY_USERNAME}`;
const BLUESKY_PASSWORD = `${process.env.BLUESKY_PASSWORD}`;

export const Bluesky = async (): Promise<BskyAgent> => {
  const agent = new BskyAgent({
    service: "https://bsky.social",
  });
  await agent.login({ identifier: BLUESKY_USERNAME, password: BLUESKY_PASSWORD! });
  return agent;
};
