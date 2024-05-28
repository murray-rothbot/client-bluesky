import "dotenv/config";

import axios from "axios";
import { Utils } from "../utils";
import { BskyAgent } from "@atproto/api";

const SERVICE_MURRAY_SERVICE = process.env.SERVICE_MURRAY_SERVICE;

type Props = { client: BskyAgent };

export const Halving = {
  cron: "0 15 9,12,14,19,21 * * *",
  action: async ({ client }: Props) => {
    try {
      const result = await axios.get(`${SERVICE_MURRAY_SERVICE}/blockchain/halving`);
      const fields = result.data?.data?.fields;

      if (fields) {
        const currentProgress = fields.completedPercentageRaw.value.toFixed(2);
        const progressMessage = Utils.createProgressMessage({ currentProgress });
        const nextHalvingDate = Utils.formatDate({ date: new Date(fields.nextHalvingDate.value) });

        const messageLines = [];

        messageLines.push(`${result.data.data.title}`);
        messageLines.push(``);
        messageLines.push(`${progressMessage}`);
        messageLines.push(``);
        messageLines.push(`${fields.halvingCountdown.description}: ${fields.halvingCountdown.value}`);
        messageLines.push(``);
        messageLines.push(`${fields.nextHalvingBlock.description}: ${fields.nextHalvingBlock.value}`);
        messageLines.push(`${fields.height.description}: ${fields.height.value}`);
        messageLines.push(``);
        messageLines.push(`${fields.daysUntilHalving.description}: ${fields.daysUntilHalving.value}`);
        messageLines.push(`${fields.nextHalvingDate.description}: ${nextHalvingDate}`);
        messageLines.push(`${fields.halvingEra.description}: ${fields.halvingEra.value}`);
        messageLines.push(``);
        messageLines.push(`#Bitcoin #Halving`);

        const message = messageLines.join("\n");

        await Utils.postTweet({ client, message });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
