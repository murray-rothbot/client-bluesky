import { BskyAgent } from "@atproto/api";
import "dotenv/config";

const consoleMode = process.env.CONSOLE_MODE === "true" ? true : false;

type Props = { client: BskyAgent; message: string };

export const postTweet = async ({ client, message }: Props) => {
  try {
    if (consoleMode) {
      console.log(message);
    } else {
      await client.post({
        text: message,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
