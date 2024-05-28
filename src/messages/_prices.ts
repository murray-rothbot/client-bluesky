import "dotenv/config";

import axios from "axios";
import { Utils } from "../utils";
import { BskyAgent } from "@atproto/api";

const SERVICE_MURRAY_SERVICE = process.env.SERVICE_MURRAY_SERVICE;

type Props = { client: BskyAgent };

export const Prices = {
  cron: "0 0 1,3,5,7,9,11,13,15,17,19,21,23 * * *",
  action: async ({ client }: Props) => {
    try {
      const result = await axios.get(`${SERVICE_MURRAY_SERVICE}/prices`);
      const fields = result.data?.data?.fields;
      const title = result.data?.data?.title;

      if (fields && title) {
        const messageLines = [];

        messageLines.push(title);
        messageLines.push(``);

        Object.keys(fields).forEach((key) => {
          const price = fields[key];
          const values = price.value.split("\n");

          messageLines.push(`${price.description}\n${values[0]}\n${values[1].trim()}`);
          messageLines.push(``);
        });

        messageLines.push(`#Bitcoin`);

        const message = messageLines.join("\n");

        await Utils.postTweet({ client, message });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
