import "dotenv/config";

import axios from "axios";
import { Utils } from "../utils";
import { BskyAgent } from "@atproto/api";

const SERVICE_MURRAY_SERVICE = process.env.SERVICE_MURRAY_SERVICE;

type Props = { client: BskyAgent };

export const Difficulty = {
  cron: "0 45 9,18 * * *",
  action: async ({ client }: Props) => {
    try {
      const result = await axios.get(`${SERVICE_MURRAY_SERVICE}/blockchain/difficulty`);
      const fields = result.data?.data?.fields;

      if (fields) {
        const currentProgress = fields.currentProgress.value.toFixed(2);
        const progressMessage = Utils.createProgressMessage({ currentProgress });
        const estimatedDate = Utils.formatDate({ date: new Date(fields.estimatedDate.value) });

        const messageLines = [];

        messageLines.push(`🦾 Bitcoin Difficulty Adjustment`);
        messageLines.push(``);
        messageLines.push(fields.currentProgress.description);
        messageLines.push(``);
        messageLines.push(progressMessage);
        messageLines.push(``);
        messageLines.push(`${fields.estimatedDate.description}: ${estimatedDate}`);
        messageLines.push(``);
        messageLines.push(`Current Change   : ${fields.estimateChange.value}`);
        messageLines.push(`Previous Change : ${fields.previousChange.value}`);
        messageLines.push(``);
        messageLines.push(`#Bitcoin #DifficultyAdjustment #GracePeriod`);

        const message = messageLines.join("\n");

        await Utils.postTweet({ client, message });
      }
    } finally {
      console.log("Difficulty Adjustment message.");
    }
  },
};
