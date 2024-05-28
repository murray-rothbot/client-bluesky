import "dotenv/config";

import axios from "axios";
import { Utils } from "../utils";
import { BskyAgent } from "@atproto/api";

const SERVICE_MURRAY_SERVICE = process.env.SERVICE_MURRAY_SERVICE;

type Props = { client: BskyAgent };

export const MarketCap = {
  cron: "0 45 10,19 * * *",
  action: async ({ client }: Props) => {
    try {
      const result = await axios.get(`${SERVICE_MURRAY_SERVICE}/market/capitalization`);
      const fields = result.data?.data?.fields;

      if (fields) {
        const btcusd = fields.btcusd?.value;
        const btcbrl = fields.btcbrl?.value;

        if (!btcusd || !btcbrl) {
          console.log("Invalid data");
          return;
        }

        const messageLines = [];

        messageLines.push(`💰 Bitcoin Market Cap`);
        messageLines.push(``);
        messageLines.push(`🇺🇸 Price: ${btcusd.price.value}`);
        messageLines.push(`⚡ Sats/USD: ${btcusd.satsPerFiat.value}`);
        messageLines.push(`💰 Market Cap: ${btcusd.marketCap.value}`);
        messageLines.push(``);
        messageLines.push(`🇧🇷 Price: ${btcbrl.price.value}`);
        messageLines.push(`⚡ Sats/BRL: ${btcbrl.satsPerFiat.value}`);
        messageLines.push(`💰 Market Cap: ${btcbrl.marketCap.value}`);
        messageLines.push(``);
        messageLines.push(`#Bitcoin #MarketCap #price`);

        const message = messageLines.join("\n");
        await Utils.postTweet({ client, message });
      }
    } finally {
      console.log("MarketCap tweet sent!");
    }
  },
};
