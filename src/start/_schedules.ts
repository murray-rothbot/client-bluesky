import { Messages } from "../messages";
import { Utils } from "../utils";
import { BskyAgent } from "@atproto/api";

type Props = { client: BskyAgent };

export const Schedules = async ({ client }: Props): Promise<void> => {
  Object.keys(Messages).forEach((key) => {
    const schedule = Messages[key as keyof typeof Messages];

    if (schedule) {
      Utils.createCron({
        cron: schedule.cron,
        action: () => schedule.action({ client }),
      });
    }
  });
};
