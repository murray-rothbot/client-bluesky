import "dotenv/config";

import axios from "axios";
import { Utils } from "../utils";
import { BskyAgent } from "@atproto/api";

const SERVICE_MURRAY_SERVICE = process.env.SERVICE_MURRAY_SERVICE;

type Props = { client: BskyAgent };

export const LightningNetwork = {
  cron: "0 30 10,19 * * *",
  action: async ({ client }: Props) => {
    try {
      const result = await axios.get(`${SERVICE_MURRAY_SERVICE}/lightning/statistics`);
      const fields = result.data?.data?.fields;

      if (fields) {
        const messageArr = [];

        messageArr.push(`⚡ Lightning Network`);
        messageArr.push(``);
        messageArr.push(`${fields.totalCapacity.description}: ${fields.totalCapacity.value}`);
        messageArr.push(`${fields.avgCapacity.description}: ${fields.avgCapacity.value}`);
        messageArr.push(``);
        messageArr.push(`${fields.nodes.description}: ${fields.nodes.value}`);
        messageArr.push(`🤵‍♂️ Clearnet: ${fields.clearNet.value}`);
        messageArr.push(`🕵️ Tor: ${fields.tor.value}`);
        messageArr.push(`${fields.channels.description}: ${fields.channels.value}`);
        messageArr.push(``);
        messageArr.push(`${fields.avgFee.description}: ${fields.avgFee.value}`);
        messageArr.push(`${fields.avgBaseFee.description}: ${fields.avgBaseFee.value}`);
        messageArr.push(``);
        messageArr.push(`#Bitcoin #LightningNetwork`);

        const message = messageArr.join("\n");

        await Utils.postTweet({ client, message });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
